'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport } from '@/lib/report-store'
import type { StatsCrm, Contact, CollectionResponse } from '@/lib/assoconnect'
import { DEMO_ASSOCIATION } from '@/lib/mock-data'

const CATEGORY_LABELS: Record<string, string> = {
  activité: '🌿 Activité',
  formation: '📚 Formation',
  événement: '🎉 Événement',
  sortie: '🚶 Sortie',
  chantier: '🔨 Chantier',
  gouvernance: '📋 Gouvernance',
}

function Card({ title, icon, children, badge }: { title: string; icon: string; children: React.ReactNode; badge?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        {badge && (
          <span className="text-xs bg-emerald-100 text-emerald-700 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            ✓ {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function ContactRow({ contact }: { contact: Contact }) {
  const name = contact.type === 'PERSON'
    ? [contact.firstName, contact.lastName].filter(Boolean).join(' ') || '—'
    : contact.companyName || '—'
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0 text-sm">
      <div className="min-w-0">
        <p className="font-medium text-slate-700 truncate">{name}</p>
        {contact.email && <p className="text-xs text-slate-400 truncate">{contact.email}</p>}
      </div>
      <span className="text-xs text-slate-400 shrink-0 ml-3">
        {contact.type === 'PERSON' ? '👤' : '🏢'}
      </span>
    </div>
  )
}

export default function DonneesClient({
  stats,
  contacts,
}: {
  stats: StatsCrm
  contacts: CollectionResponse<Contact>
}) {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    const report = getReport(id)
    if (!report) router.push('/rapport')
  }, [id, router])

  function handleContinue() {
    updateReport(id, { status: 'interview' })
    router.push(`/rapport/${id}/interview`)
  }

  const data = DEMO_ASSOCIATION
  const totalParticipants = data.events.reduce((s, e) => s + e.participants, 0)
  const totalRevenue = Object.values(data.finance.revenue).reduce((s, v) => s + v, 0)

  const totalContacts = contacts['hydra:totalItems']
  const sample = contacts['hydra:member'].slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vos données 📊</h1>
        <p className="text-slate-500 mt-1">On a tout récupéré depuis AssoConnect. Plus qu&apos;à vérifier que tout est bien là !</p>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-2xl">🎯</span>
        <div>
          <p className="font-semibold text-indigo-800">Données importées automatiquement</p>
          <p className="text-indigo-600 text-sm">Membres, événements, finances et bénévoles sont prêts à rejoindre votre rapport. Vous n&apos;avez rien eu à chercher !</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">

        {/* Membres — données réelles API */}
        <Card title="Membres" icon="👥" badge="Importé">
          <div className="flex items-end gap-4 mb-4">
            <div>
              <p className="text-4xl font-bold text-slate-900">{totalContacts}</p>
              <p className="text-sm text-slate-500">contacts dans le CRM</p>
            </div>
            <div className="text-right pb-1">
              <p className="text-lg font-bold text-emerald-600">{stats.inSubscription ?? stats.people}</p>
              <p className="text-xs text-slate-400">en adhésion</p>
            </div>
          </div>
          <div className="space-y-0">
            {sample.map((c) => (
              <ContactRow key={c.id} contact={c} />
            ))}
            {totalContacts > 5 && (
              <p className="text-xs text-slate-400 pt-2 text-center">
                + {totalContacts - 5} autres contacts
              </p>
            )}
          </div>
        </Card>

        <Card title="Bénévoles" icon="🙌" badge="Importé">
          <div className="flex items-end gap-4 mb-4">
            <div>
              <p className="text-4xl font-bold text-slate-900">{data.volunteers.total}</p>
              <p className="text-sm text-slate-500">bénévoles au total</p>
            </div>
            <div className="text-right pb-1">
              <p className="text-lg font-bold text-amber-500">{data.volunteers.active}</p>
              <p className="text-xs text-slate-400">très actifs</p>
            </div>
          </div>
          <div className="space-y-2">
            {data.topVolunteers.slice(0, 3).map(v => (
              <div key={v.name} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-700">{v.name}</p>
                  <p className="text-xs text-slate-400">{v.role}</p>
                </div>
                <span className="text-sm font-bold text-indigo-600">{v.hours}h</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Événements" icon="📅" badge="Importé">
          <div className="flex gap-6 mb-4">
            <div>
              <p className="text-4xl font-bold text-slate-900">{data.events.length}</p>
              <p className="text-sm text-slate-500">événements</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-slate-900">{totalParticipants.toLocaleString('fr-FR')}</p>
              <p className="text-sm text-slate-500">participants</p>
            </div>
          </div>
          <div className="space-y-1.5 max-h-44 overflow-y-auto">
            {data.events.map(ev => (
              <div key={ev.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs shrink-0">{CATEGORY_LABELS[ev.category]?.split(' ')[0] ?? '•'}</span>
                  <span className="text-slate-700 truncate">{ev.name}</span>
                </div>
                <span className="text-slate-400 shrink-0 ml-2">{ev.participants}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Bilan financier" icon="💰" badge="Importé">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Recettes · {totalRevenue.toLocaleString('fr-FR')} €</p>
              {Object.entries({ 'Dons': data.finance.revenue.donations, 'Subventions': data.finance.revenue.grants, 'Cotisations': data.finance.revenue.membershipFees, 'Autres': data.finance.revenue.other }).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-slate-500 w-20 shrink-0">{k}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-400 h-2 rounded-full" style={{ width: `${(v / totalRevenue) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-slate-600 w-16 text-right">{v.toLocaleString('fr-FR')} €</span>
                </div>
              ))}
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 flex justify-between items-center border border-emerald-100">
              <span className="text-sm font-semibold text-emerald-800">🎯 Excédent {data.year}</span>
              <span className="text-lg font-bold text-emerald-600">+{data.finance.surplus.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Partenaires" icon="🤝" badge="Importé">
        <div className="flex flex-wrap gap-3">
          {data.partners.map(p => (
            <div key={p.name} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
              <span className="font-medium text-slate-700 text-sm">{p.name}</span>
              <span className="text-xs text-slate-400 bg-white border border-slate-100 rounded-full px-2 py-0.5">{p.type}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <button onClick={handleContinue} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          Aller à l&apos;entretien →
        </button>
      </div>
    </div>
  )
}
