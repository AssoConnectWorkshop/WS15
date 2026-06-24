'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getReport, getStepCompletion, Report } from '@/lib/report-store'
import { DEMO_ASSOCIATION } from '@/lib/mock-data'

const STEPS = [
  { id: 'data_review', path: 'donnees', label: 'Données', icon: '📊', done: '📊✅', cheer: 'Données prêtes !' },
  { id: 'interview', path: 'interview', label: 'Entretien', icon: '🎤', done: '🎤✨', cheer: 'Vous êtes bavard·e !' },
  { id: 'contributors', path: 'contributeurs', label: 'Contributeurs', icon: '🙌', done: '🙌🔥', cheer: 'Équipe de choc !' },
  { id: 'photos', path: 'photos', label: 'Photos', icon: '📸', done: '📸🌟', cheer: 'Trop belles !' },
  { id: 'generation', path: 'generateur', label: 'Génération IA', icon: '✨', done: '🤖💪', cheer: 'L\'IA a assuré !' },
  { id: 'editing', path: 'editeur', label: 'Édition', icon: '✏️', done: '✏️🎨', cheer: 'Chef-d\'œuvre !' },
  { id: 'export', path: 'export', label: 'Export', icon: '🎉', done: '🏆🎊', cheer: 'Légendaire !' },
]

const FUN_SIDEBAR_MESSAGES = [
  "C'est votre année qui s'écrit 🌱",
  "Votre asso déchire 🔥",
  "L'AG va être top 🎯",
  "Vous gérez la vie 💪",
  "Le rapport le plus stylé du quartier ✨",
]

export default function ReportIdLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const id = params.id as string
  const [report, setReport] = useState<Report | null>(null)
  const [funMsg] = useState(() => FUN_SIDEBAR_MESSAGES[Math.floor(Math.random() * FUN_SIDEBAR_MESSAGES.length)])

  useEffect(() => {
    const r = getReport(id)
    setReport(r)
  }, [id, pathname])

  const completion = report ? getStepCompletion(report) : null
  const completedCount = completion ? Object.values(completion).filter(Boolean).length : 0
  const totalSteps = STEPS.length
  const overallProgress = Math.round((completedCount / totalSteps) * 100)

  const currentStep = STEPS.find(s => pathname.endsWith(s.path))

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="w-56 shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-white/20 backdrop-blur rounded-lg p-1.5">
                <span className="text-lg">🌱</span>
              </div>
              <span className="text-white font-bold text-sm truncate">{DEMO_ASSOCIATION.name}</span>
            </div>
            <div className="text-indigo-200 text-xs mb-3">{report?.year ?? '…'} · {funMsg}</div>
            {/* Global progress */}
            <div className="bg-white/20 rounded-full h-1.5 mb-1">
              <div
                className="bg-white h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-indigo-200 text-xs">{overallProgress}% complété</p>
          </div>

          {/* Steps */}
          <nav className="p-2 space-y-0.5">
            {STEPS.map((step, i) => {
              const isActive = pathname.endsWith(step.path)
              const isDone = completion ? completion[step.id as keyof typeof completion] : false
              const isLocked = (step.id === 'generation' || step.id === 'editing' || step.id === 'export') && !completion?.generation

              if (i === 4) {
                // Separator before AI steps
                return (
                  <div key={`sep-${step.id}`}>
                    <div className="my-1.5 mx-2 border-t border-slate-100" />
                    {renderStep(step, i, isActive, isDone, isLocked, id)}
                  </div>
                )
              }
              return renderStep(step, i, isActive, isDone, isLocked, id)
            })}
          </nav>

          {/* Current step encouragement */}
          {currentStep && (
            <div className="mx-2 mb-2 px-3 py-2.5 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-xs font-bold text-amber-700">
                {completion?.[currentStep.id as keyof typeof completion]
                  ? `${currentStep.cheer} 🎉`
                  : `C'est à vous ! ${currentStep.icon}`
                }
              </p>
            </div>
          )}

          <div className="px-3 pb-3">
            <Link href="/rapport" className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
              ← Tous les rapports
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

function renderStep(
  step: typeof STEPS[0],
  _i: number,
  isActive: boolean,
  isDone: boolean,
  isLocked: boolean,
  id: string
) {
  if (isLocked) {
    return (
      <div key={step.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 cursor-not-allowed select-none">
        <span className="text-base shrink-0 opacity-40">{step.icon}</span>
        <span className="text-xs flex-1">{step.label}</span>
        <span className="text-xs">🔒</span>
      </div>
    )
  }

  return (
    <Link
      key={step.id}
      href={`/rapport/${id}/${step.path}`}
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all group
        ${isActive
          ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-200'
          : isDone
            ? 'text-emerald-700 hover:bg-emerald-50'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        }`}
    >
      <span className="text-base shrink-0">{isDone && !isActive ? '✅' : step.icon}</span>
      <span className="flex-1 leading-tight font-medium">{step.label}</span>
      {isDone && !isActive && <span className="text-emerald-400 font-bold shrink-0 text-xs">✓</span>}
      {isActive && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shrink-0" />}
    </Link>
  )
}
