'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport } from '@/lib/report-store'
import { DEMO_ASSOCIATION } from '@/lib/mock-data'
import StepTracker from '@/components/StepTracker'

const CATEGORY_LABELS: Record<string, string> = {
  activité: '🌿 Activité',
  formation: '📚 Formation',
  événement: '🎉 Événement',
  sortie: '🚶 Sortie',
  chantier: '🔨 Chantier',
  gouvernance: '📋 Gouvernance',
}

function StatCard({ title, icon, children, badge }: { title: string; icon: string; children: React.ReactNode; badge?: string }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="font-semibold text-stone-800">{title}</h3>
        </div>
        {badge && (
          <span className="text-xs bg-green-100 text-green-700 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <span>✓</span> {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

export default function DonneesPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const report = getReport(id)
    if (!report) { router.push('/rapport'); return }
    setReady(true)
  }, [id, router])

  function handleContinue() {
    updateReport(id, { status: 'interview' })
    router.push(`/rapport/${id}/interview`)
  }

  const data = DEMO_ASSOCIATION
  const totalParticipants = data.events.reduce((s, e) => s + e.participants, 0)
  const totalRevenue = Object.values(data.finance.revenue).reduce((s, v) => s + v, 0)
  const totalExpenses = Object.values(data.finance.expenses).reduce((s, v) => s + v, 0)

  if (!ready) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <StepTracker reportId={id} current="data_review" reached="data_review" />
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Révision des données</h1>
          <p className="text-stone-600 mt-1">Vérifiez les informations importées automatiquement depuis AssoConnect.</p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-green-600 text-xl mt-0.5">✓</span>
        <div>
          <p className="font-semibold text-green-800">Données importées avec succès</p>
          <p className="text-green-700 text-sm">Membres, événements, finances et bénévoles sont prêts à être utilisés dans votre rapport.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Members */}
        <StatCard title="Membres" icon="👥" badge="Données disponibles">
          <div className="flex items-end gap-4 mb-4">
            <div>
              <p className="text-4xl font-bold text-stone-900">{data.members.current}</p>
              <p className="text-sm text-stone-500">membres en {data.year}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-green-600">+{data.members.current - data.members.previous}</p>
              <p className="text-xs text-stone-500">vs {data.previousYear}</p>
            </div>
          </div>
          {/* Simple bar chart */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-500 w-10">{data.previousYear}</span>
              <div className="flex-1 bg-stone-100 rounded-full h-3">
                <div className="bg-stone-400 h-3 rounded-full" style={{ width: `${(data.members.previous / data.members.current) * 100}%` }} />
              </div>
              <span className="text-xs font-medium text-stone-600 w-8">{data.members.previous}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-500 w-10">{data.year}</span>
              <div className="flex-1 bg-stone-100 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full w-full" />
              </div>
              <span className="text-xs font-medium text-stone-600 w-8">{data.members.current}</span>
            </div>
          </div>
        </StatCard>

        {/* Volunteers */}
        <StatCard title="Bénévoles" icon="🙌" badge="Données disponibles">
          <div className="flex items-end gap-4 mb-4">
            <div>
              <p className="text-4xl font-bold text-stone-900">{data.volunteers.total}</p>
              <p className="text-sm text-stone-500">bénévoles au total</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-amber-600">{data.volunteers.active}</p>
              <p className="text-xs text-stone-500">actifs réguliers</p>
            </div>
          </div>
          <div className="space-y-2">
            {data.topVolunteers.slice(0, 3).map(v => (
              <div key={v.name} className="flex items-center justify-between py-1 border-b border-stone-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-stone-700">{v.name}</p>
                  <p className="text-xs text-stone-500">{v.role}</p>
                </div>
                <span className="text-sm font-semibold text-stone-600">{v.hours}h</span>
              </div>
            ))}
          </div>
        </StatCard>

        {/* Events */}
        <StatCard title="Événements" icon="📅" badge="Données disponibles">
          <div className="flex gap-6 mb-4">
            <div>
              <p className="text-4xl font-bold text-stone-900">{data.events.length}</p>
              <p className="text-sm text-stone-500">événements</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-stone-900">{totalParticipants.toLocaleString('fr-FR')}</p>
              <p className="text-sm text-stone-500">participants</p>
            </div>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {data.events.map(ev => (
              <div key={ev.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs">{CATEGORY_LABELS[ev.category] ?? ev.category}</span>
                  <span className="text-stone-700 truncate max-w-40">{ev.name}</span>
                </div>
                <span className="text-stone-500 shrink-0">{ev.participants} pers.</span>
              </div>
            ))}
          </div>
        </StatCard>

        {/* Finance */}
        <StatCard title="Bilan financier" icon="💰" badge="Données disponibles">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">Recettes — {totalRevenue.toLocaleString('fr-FR')} €</p>
              {Object.entries(data.finance.revenue).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 mb-1">
                  <div className="flex-1 bg-stone-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(v / totalRevenue) * 100}%` }} />
                  </div>
                  <span className="text-xs text-stone-600 w-20 text-right">{v.toLocaleString('fr-FR')} €</span>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-100 pt-3">
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">Dépenses — {totalExpenses.toLocaleString('fr-FR')} €</p>
              {Object.entries(data.finance.expenses).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 mb-1">
                  <div className="flex-1 bg-stone-100 rounded-full h-2">
                    <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${(v / totalExpenses) * 100}%` }} />
                  </div>
                  <span className="text-xs text-stone-600 w-20 text-right">{v.toLocaleString('fr-FR')} €</span>
                </div>
              ))}
            </div>
            <div className="bg-green-50 rounded-lg p-3 flex justify-between items-center">
              <span className="text-sm font-medium text-green-800">Résultat annuel</span>
              <span className="text-lg font-bold text-green-700">+{data.finance.surplus.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </StatCard>
      </div>

      {/* Partners */}
      <StatCard title="Partenaires et soutiens" icon="🤝" badge="Données disponibles">
        <div className="flex flex-wrap gap-3">
          {data.partners.map(p => (
            <div key={p.name} className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
              <span className="font-medium text-stone-700 text-sm">{p.name}</span>
              <span className="text-xs text-stone-400">{p.type}</span>
            </div>
          ))}
        </div>
      </StatCard>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleContinue}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Continuer vers l&apos;entretien guidé →
        </button>
      </div>
    </div>
  )
}
