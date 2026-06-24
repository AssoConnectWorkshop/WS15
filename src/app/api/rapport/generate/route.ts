import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { REPORT_SECTIONS } from '@/lib/mock-data'
import { getOrganization, getStatsCrm, getEventCollects, getAccountingEntries } from '@/lib/assoconnect'

const client = new Anthropic()

type InterviewAnswers = Record<string, string>

type OrgData = {
  name: string
  members: number
  people: number
  eventCount: number
  totalRevenue: number
  totalExpenses: number
  surplus: number
}

function buildPrompt(interview: InterviewAnswers, sectionId: string, sectionTitle: string, org: OrgData): string {
  const context = `
Association : ${org.name}
Membres actifs : ${org.members}
Contacts CRM : ${org.people} personnes
Événements cette année : ${org.eventCount}
Finances : Recettes ${org.totalRevenue.toLocaleString('fr-FR')} €, Dépenses ${org.totalExpenses.toLocaleString('fr-FR')} €, Résultat ${org.surplus >= 0 ? '+' : ''}${org.surplus.toLocaleString('fr-FR')} €

Réponses de l'entretien :
${Object.entries(interview).map(([k, v]) => v ? `- ${k}: ${v}` : '').filter(Boolean).join('\n')}
`

  const sectionPrompts: Record<string, string> = {
    president_message: `Rédigez le mot du président pour le rapport d'activité de ${org.name}.
Ton chaleureux, personnel, fier des bénévoles et tourné vers l'avenir. Commencez par "Chères et chers membres,".
Utilisez les réponses de l'entretien pour rendre ce message authentique. 150-200 mots.`,

    mission: `Rédigez la section "Notre mission et nos valeurs" pour le rapport d'activité de ${org.name}.
Présentez la mission de l'association et ses valeurs fondamentales. Reliez-les aux actions concrètes menées cette année.
Ton institutionnel mais humain. 120-160 mots.`,

    members_volunteers: `Rédigez la section "Membres et bénévoles" pour le rapport d'activité de ${org.name}.
Incluez les chiffres clés (${org.members} membres actifs, ${org.people} contacts dans le CRM).
Mettez en valeur l'engagement des bénévoles. Ton reconnaissant et chaleureux. 150-200 mots.`,

    activities: `Rédigez la section "Activités et impact" pour le rapport d'activité de ${org.name}.
Décrivez les ${org.eventCount} événements organisés et leur impact sur la communauté.
Ton vivant et engagé. 180-220 mots.`,

    partnerships: `Rédigez la section "Partenariats" pour le rapport d'activité de ${org.name}.
Présentez les partenaires clés et ce que ces collaborations ont apporté à l'association.
Ton professionnel et reconnaissant. 100-140 mots.`,

    finance: `Rédigez la section "Bilan financier" pour le rapport d'activité de ${org.name}.
Expliquez simplement les grandes lignes financières en langage accessible (pas de jargon comptable).
Recettes : ${org.totalRevenue.toLocaleString('fr-FR')} €, Dépenses : ${org.totalExpenses.toLocaleString('fr-FR')} €, Résultat : ${org.surplus >= 0 ? '+' : ''}${org.surplus.toLocaleString('fr-FR')} €.
Ton transparent et rassurant. 130-170 mots.`,

    challenges: `Rédigez la section "Défis et apprentissages" pour le rapport d'activité de ${org.name}.
Parlez honnêtement des difficultés rencontrées et de ce que l'association en a appris.
Ton honnête et constructif. 130-160 mots.`,

    outlook: `Rédigez la section "Perspectives" pour le rapport d'activité de ${org.name}.
Présentez les priorités et projets pour l'année à venir avec enthousiasme et réalisme.
Invitez les membres à s'impliquer. Ton dynamique et mobilisateur. 130-160 mots.`,
  }

  return `Vous êtes rédacteur spécialisé dans les rapports d'activité associatifs français. Écrivez uniquement en français.

CONTEXTE :
${context}

SECTION À RÉDIGER : ${sectionTitle}

CONSIGNES :
${sectionPrompts[sectionId] ?? `Rédigez la section "${sectionTitle}" en 150-200 mots.`}

IMPORTANT :
- N'inventez aucune donnée qui n'est pas fournie dans le contexte
- Utilisez les vrais chiffres fournis
- Rédigez directement le contenu, sans titre ni introduction méta
- Prose fluide, paragraphes, pas de listes à puces
- Ton associatif français authentique`
}

export async function POST(req: NextRequest) {
  try {
    const { interview } = await req.json() as { interview: InterviewAnswers }

    const [apiOrg, stats, eventCollects, accountingEntries] = await Promise.all([
      getOrganization(),
      getStatsCrm(),
      getEventCollects(),
      getAccountingEntries(),
    ])

    const entries = accountingEntries['hydra:member']
    const totalRevenue = entries
      .filter(e => e.type === 'CREDIT' && e.account.accountNumber >= 700000 && e.account.accountNumber < 800000)
      .reduce((s, e) => s + Number(e.amount) / 100, 0)
    const totalExpenses = entries
      .filter(e => e.type === 'DEBIT' && e.account.accountNumber >= 600000 && e.account.accountNumber < 700000)
      .reduce((s, e) => s + Number(e.amount) / 100, 0)

    const orgData: OrgData = {
      name: apiOrg.name,
      members: stats.inSubscription,
      people: stats.people,
      eventCount: eventCollects['hydra:totalItems'],
      totalRevenue,
      totalExpenses,
      surplus: totalRevenue - totalExpenses,
    }

    const sections: Array<{ id: string; title: string; content: string }> = []

    for (const section of REPORT_SECTIONS) {
      const prompt = buildPrompt(interview, section.id, section.title, orgData)
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      })

      const content = message.content[0].type === 'text' ? message.content[0].text : ''
      sections.push({ id: section.id, title: section.title, content })
    }

    return NextResponse.json({ sections })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: 'Erreur lors de la génération' }, { status: 500 })
  }
}
