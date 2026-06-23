'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getReport, getStepCompletion, Report } from '@/lib/report-store'
import { DEMO_ASSOCIATION } from '@/lib/mock-data'

const STEPS = [
  { id: 'data_review', path: 'donnees', label: 'Données', icon: '📊', fun: 'Tout est là, promis !' },
  { id: 'interview', path: 'interview', label: 'Entretien', icon: '🎤', fun: 'Racontez-nous tout !' },
  { id: 'contributors', path: 'contributeurs', label: 'Contributeurs', icon: '🙌', fun: 'En équipe c\'est mieux' },
  { id: 'photos', path: 'photos', label: 'Photos', icon: '📸', fun: 'Souriez !' },
  { id: 'generation', path: 'generateur', label: 'Génération IA', icon: '✨', fun: 'La magie opère…' },
  { id: 'editing', path: 'editeur', label: 'Édition', icon: '✏️', fun: 'Dernière touche !' },
  { id: 'export', path: 'export', label: 'Export', icon: '🎉', fun: 'C\'est prêt !' },
]

export default function ReportIdLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const id = params.id as string
  const [report, setReport] = useState<Report | null>(null)

  useEffect(() => {
    const r = getReport(id)
    setReport(r)
  }, [id, pathname])

  const completion = report ? getStepCompletion(report) : null

  const currentStep = STEPS.find(s => pathname.endsWith(s.path))

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="w-52 shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
          {/* Report identity */}
          <div className="bg-indigo-600 px-4 py-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🌱</span>
              <span className="text-white font-semibold text-sm truncate">{DEMO_ASSOCIATION.name}</span>
            </div>
            <span className="text-indigo-200 text-xs">Rapport {report?.year ?? '…'}</span>
          </div>

          {/* Steps */}
          <nav className="p-2">
            {STEPS.map((step, i) => {
              const isActive = pathname.endsWith(step.path)
              const isDone = completion ? completion[step.id as keyof typeof completion] : false
              const isGenerationStep = step.id === 'generation' || step.id === 'editing' || step.id === 'export'
              const canAccess = !isGenerationStep || (completion?.generation)

              return (
                <div key={step.id}>
                  {i === 4 && (
                    <div className="my-2 border-t border-slate-100" />
                  )}
                  {canAccess ? (
                    <Link
                      href={`/rapport/${id}/${step.path}`}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all group
                        ${isActive
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                    >
                      <span className="text-base shrink-0">{step.icon}</span>
                      <span className="flex-1 leading-tight">{step.label}</span>
                      {isDone && !isActive && (
                        <span className="text-emerald-500 text-xs font-bold shrink-0">✓</span>
                      )}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-300 cursor-not-allowed">
                      <span className="text-base shrink-0 opacity-40">{step.icon}</span>
                      <span className="flex-1 leading-tight">{step.label}</span>
                      <span className="text-xs">🔒</span>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Fun message */}
          {currentStep && (
            <div className="mx-2 mb-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-xs text-amber-700 font-medium">{currentStep.fun}</p>
            </div>
          )}

          {/* Back link */}
          <div className="px-3 pb-3">
            <Link href="/rapport" className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
              ← Tous les rapports
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}
