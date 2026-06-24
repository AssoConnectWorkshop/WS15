'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport, ContributorStatus } from '@/lib/report-store'

const SECTIONS = [
  { id: "jardinage", name: "Activités jardinage", icon: "🌱" },
  { id: "ateliers", name: "Ateliers & formations", icon: "📚" },
  { id: "communication", name: "Communication", icon: "📢" },
  { id: "benevoles", name: "Coordination bénévoles", icon: "🤝" },
]

const STATUS_CONFIG: Record<ContributorStatus, { label: string; color: string; bg: string; border: string }> = {
  pending: { label: 'En attente', color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' },
  in_progress: { label: 'En cours', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  complete: { label: '✓ Terminé', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
}

export default function ContributeursPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [statuses, setStatuses] = useState<Record<string, ContributorStatus>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const report = getReport(id)
    if (!report) { router.push('/rapport'); return }
    setStatuses(report.contributorStatuses)
    setNotes(report.contributorNotes)
    setReady(true)
  }, [id, router])

  function setStatus(sectionId: string, status: ContributorStatus) {
    const updated = { ...statuses, [sectionId]: status }
    setStatuses(updated)
    updateReport(id, { contributorStatuses: updated })
  }

  function saveNote(sectionId: string, note: string) {
    const updatedNotes = { ...notes, [sectionId]: note }
    setNotes(updatedNotes)
    updateReport(id, { contributorNotes: updatedNotes })
  }

  if (!ready) return null

  const completedCount = Object.values(statuses).filter(s => s === 'complete').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Contributeurs 🙌</h1>
        <p className="text-slate-500 mt-1">Chaque responsable contribue à sa section. Ensemble, le rapport se construit tout seul !</p>
      </div>

      {completedCount === 0 && (
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl">🚀</span>
          <div>
            <p className="font-semibold text-violet-800">L&apos;union fait la force !</p>
            <p className="text-violet-600 text-sm">Marquez les sections comme &quot;Terminé&quot; au fur et à mesure que vos responsables contribuent. Même une seule section suffit pour avancer.</p>
          </div>
        </div>
      )}

      {completedCount >= 2 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl">🎊</span>
          <div>
            <p className="font-semibold text-emerald-800">Incroyable, {completedCount} sections complétées !</p>
            <p className="text-emerald-600 text-sm">Votre équipe assure. Vous pouvez passer à la suite quand vous voulez !</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
        <div className="flex-1 bg-slate-100 rounded-full h-3">
          <div className="bg-indigo-500 h-3 rounded-full transition-all duration-500" style={{ width: `${(completedCount / SECTIONS.length) * 100}%` }} />
        </div>
        <span className="text-sm font-bold text-slate-600 shrink-0">{completedCount} / {SECTIONS.length}</span>
      </div>

      <div className="grid gap-3">
        {SECTIONS.map(section => {
          const status = statuses[section.id] ?? 'pending'
          const cfg = STATUS_CONFIG[status]
          const isOpen = openSection === section.id

          return (
            <div key={section.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${status === 'complete' ? 'border-emerald-200' : 'border-slate-200'}`}>
              <button
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{section.icon}</span>
                  <p className="font-semibold text-slate-800">{section.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    {cfg.label}
                  </span>
                  <span className="text-slate-300">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1.5">Notes sur cette section</label>
                    <textarea
                      value={notes[section.id] ?? ''}
                      onChange={e => saveNote(section.id, e.target.value)}
                      placeholder={`Résumé des activités, chiffres clés, moments marquants de ${section.name.toLowerCase()}…`}
                      rows={4}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">Statut</label>
                    <div className="flex gap-2">
                      {(['pending', 'in_progress', 'complete'] as ContributorStatus[]).map(s => (
                        <button
                          key={s}
                          onClick={() => setStatus(section.id, s)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all
                            ${status === s ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color} ${STATUS_CONFIG[s].border}` : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                        >
                          {STATUS_CONFIG[s].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => router.push(`/rapport/${id}/photos`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Aller aux photos →
        </button>
      </div>
    </div>
  )
}
