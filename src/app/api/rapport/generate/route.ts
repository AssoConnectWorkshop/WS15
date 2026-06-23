import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { DEMO_ASSOCIATION, REPORT_SECTIONS } from '@/lib/mock-data'

const client = new Anthropic()

type InterviewAnswers = Record<string, string>

function buildPrompt(interview: InterviewAnswers, sectionId: string, sectionTitle: string): string {
  const data = DEMO_ASSOCIATION
  const totalParticipants = data.events.reduce((s, e) => s + e.participants, 0)
  const totalRevenue = Object.values(data.finance.revenue).reduce((s, v) => s + v, 0)

  const context = `
Association : ${data.name}
Année : ${data.year}
Membres : ${data.members.current} (vs ${data.members.previous} l'année précédente, +${data.members.current - data.members.previous})
Bénévoles : ${data.volunteers.total} au total, ${data.volunteers.active} actifs
Événements : ${data.events.length} événements, ${totalParticipants} participants au total
Finances : Recettes ${totalRevenue.toLocaleString('fr-FR')} €, excédent ${data.finance.surplus.toLocaleString('fr-FR')} €
Partenaires : ${data.partners.map(p => p.name).join(', ')}
Mission : ${data.mission}
Valeurs : ${data.values.join(', ')}
Principaux bénévoles : ${data.topVolunteers.map(v => `${v.name} (${v.role}, ${v.hours}h)`).join(', ')}

Réponses de la présidente lors de l'entretien :
${Object.entries(interview).map(([k, v]) => v ? `- ${k}: ${v}` : '').filter(Boolean).join('\n')}
`

  const sectionPrompts: Record<string, string> = {
    president_message: `Rédigez le mot de la présidente pour le rapport d'activité ${data.year} de ${data.name}.
Ton chaleureux, personnel, fier des bénévoles et tourné vers l'avenir. Commencez par "Chères et chers membres,".
Utilisez les réponses de l'entretien pour rendre ce message authentique. 150-200 mots.`,

    mission: `Rédigez la section "Notre mission et nos valeurs" pour le rapport d'activité ${data.year}.
Présentez la mission de l'association et ses valeurs fondamentales. Reliez-les aux actions concrètes menées cette année.
Ton institutionnel mais humain. 120-160 mots.`,

    members_volunteers: `Rédigez la section "Membres et bénévoles" pour le rapport d'activité ${data.year}.
Incluez les chiffres clés (${data.members.current} membres, progression de +${data.members.current - data.members.previous}), mettez en valeur l'engagement des bénévoles.
Citez nommément les bénévoles les plus impliqués. Ton reconnaissant et chaleureux. 150-200 mots.`,

    activities: `Rédigez la section "Activités et impact" pour le rapport d'activité ${data.year}.
Décrivez les ${data.events.length} événements organisés et leur impact (${totalParticipants} participants au total).
Mettez en avant les temps forts et l'impact sur la communauté locale. Ton vivant et engagé. 180-220 mots.`,

    partnerships: `Rédigez la section "Partenariats" pour le rapport d'activité ${data.year}.
Présentez les partenaires clés et ce que ces collaborations ont apporté à l'association.
Partenaires : ${data.partners.map(p => `${p.name} (${p.type})`).join(', ')}.
Ton professionnel et reconnaissant. 100-140 mots.`,

    finance: `Rédigez la section "Bilan financier" pour le rapport d'activité ${data.year}.
Expliquez simplement les grandes lignes financières en langage accessible (pas de jargon comptable).
Soulignez la santé financière de l'association et la confiance accordée par les financeurs.
Recettes : dons ${data.finance.revenue.donations.toLocaleString('fr-FR')} €, subventions ${data.finance.revenue.grants.toLocaleString('fr-FR')} €, cotisations ${data.finance.revenue.membershipFees.toLocaleString('fr-FR')} €.
Excédent : ${data.finance.surplus.toLocaleString('fr-FR')} €. Ton transparent et rassurant. 130-170 mots.`,

    challenges: `Rédigez la section "Défis et apprentissages" pour le rapport d'activité ${data.year}.
Parlez honnêtement des difficultés rencontrées et de ce que l'association en a appris.
Montrez la capacité d'adaptation et la maturité de l'organisation. Ton honnête et constructif. 130-160 mots.`,

    outlook: `Rédigez la section "Perspectives" pour le rapport d'activité ${data.year}.
Présentez les priorités et projets pour l'année à venir avec enthousiasme et réalisme.
Invitez les membres à s'impliquer dans les projets futurs. Ton dynamique et mobilisateur. 130-160 mots.`,
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
    const sections: Array<{ id: string; title: string; content: string }> = []

    for (const section of REPORT_SECTIONS) {
      const prompt = buildPrompt(interview, section.id, section.title)
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
