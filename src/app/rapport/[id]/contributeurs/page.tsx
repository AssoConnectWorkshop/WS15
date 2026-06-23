'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport, ContributorStatus } from '@/lib/report-store'
import { SECTION_CONTRIBUTORS } from '@/lib/mock-data'
import StepTracker from '@/components/StepTracker'

const STATUS_CONFIG: Record<ContributorStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: 'text-stone-500', bg: 'bg-stone-100' },
  in_progress: { label: 'En cours', color: 'text-amber-700', bg: 'bg-amber-100' },
  complete: { label: 'Terminé', color: 'text-green-700', bg: 'bg-green-100' },
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

  function handleContinue() {
    updateReport(id, { status: 'photos' })
    router.push(`/rapport/${id}/photos`)
  }

  if (!ready) return null

  const completedCount = Object.values(statuses).filter(s => s === 'complete').length
  const canContinue = completedCount >= 2

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <StepTracker reportId={id} current="contributors" reached="contributors" />
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Contributeurs</h1>
          <p className="text-stone-600 mt-1">Chaque responsable de section contribue aux données de son activité.</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-stone-700">{completedCount} / {SECTION_CONTRIBUTORS.length} sections complétées</span>
          {canContinue ? (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">✓ Prêt à continuer</span>
          ) : (
            <span className="text-xs text-stone-500">Minimum 2 sections requises</span>
          )}
        </div>
        <div className="bg-stone-100 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / SECTION_CONTRIBUTORS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Contributor cards */}
      <div className="grid gap-4">
        {SECTION_CONTRIBUTORS.map(contrib => {
          const status = statuses[contrib.id] ?? 'pending'
          const cfg = STATUS_CONFIG[status]
          const isOpen = openSection === contrib.id

          return (
            <div key={contrib.id} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{contrib.icon}</span>
                  <div>
                    <p className="font-semibold text-stone-800">{contrib.name}</p>
                    <p className="text-sm text-stone-500">{contrib.leader}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  <button
                    onClick={() => setOpenSection(isOpen ? null : contrib.id)}
                    className="text-sm text-green-700 hover:text-green-800 font-medium"
                  >
                    {isOpen ? 'Fermer' : 'Ouvrir'}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-stone-100 p-5 bg-stone-50 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Notes et informations de la section
                    </label>
                    <textarea
                      value={notes[contrib.id] ?? ''}
                      onChange={e => saveNote(contrib.id, e.target.value)}
                      placeholder={`Résumé des activités de ${contrib.name.toLowerCase()}, faits marquants, chiffres clés...`}
                      rows={4}
                      className="w-full border border-stone-200 rounded-lg p-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Statut</label>
                    <div className="flex gap-2">
                      {(['pending', 'in_progress', 'complete'] as ContributorStatus[]).map(s => (
                        <button
                          key={s}
                          onClick={() => setStatus(contrib.id, s)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors
                            ${status === s
                              ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color} border-current`
                              : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                            }`}
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

      <div className="flex justify-end pt-2">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="bg-green-700 hover:bg-green-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Continuer vers les photos →
        </button>
      </div>
    </div>
  )
}
