'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getReport, getStepCompletion, Report } from '@/lib/report-store'
import { DEMO_ASSOCIATION } from '@/lib/mock-data'

const STEPS = [
  { id: 'data_review', path: 'donnees', label: 'Données', icon: '📊', cheer: 'Données prêtes !' },
  { id: 'interview', path: 'interview', label: 'Entretien', icon: '🎤', cheer: 'Vous êtes bavard·e !' },
  { id: 'contributors', path: 'contributeurs', label: 'Contributeurs', icon: '🙌', cheer: 'Équipe de choc !' },
  { id: 'photos', path: 'photos', label: 'Photos', icon: '📸', cheer: 'Trop belles !' },
  { id: 'generation', path: 'generateur', label: 'Génération IA', icon: '✨', cheer: "L'IA a assuré !" },
  { id: 'editing', path: 'editeur', label: 'Édition', icon: '✏️', cheer: "Chef-d'œuvre !" },
  { id: 'export', path: 'export', label: 'Export', icon: '🎉', cheer: 'Légendaire !' },
]

const FUN_MESSAGES = [
  "C'est votre année qui s'écrit 🌱",
  "Votre asso déchire 🔥",
  "L'AG va être top 🎯",
  "Le rapport le plus stylé ✨",
]

function SidebarContent({ reportId, pathname, report, onClose }: {
  reportId: string
  pathname: string
  report: Report | null
  onClose?: () => void
}) {
  const completion = report ? getStepCompletion(report) : null
  const completedCount = completion ? Object.values(completion).filter(Boolean).length : 0
  const overallProgress = Math.round((completedCount / STEPS.length) * 100)
  const currentStep = STEPS.find(s => pathname.endsWith(s.path))
  const [funMsg] = useState(() => FUN_MESSAGES[Math.floor(Math.random() * FUN_MESSAGES.length)])

  const needsGeneration = !completion?.generation

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur rounded-lg p-1.5">
              <span className="text-lg">🌱</span>
            </div>
            <span className="text-white font-bold text-sm truncate">{DEMO_ASSOCIATION.name}</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-white/70 hover:text-white text-xl leading-none">✕</button>
          )}
        </div>
        <div className="text-indigo-200 text-xs mb-3">{report?.year ?? '…'} · {funMsg}</div>
        <div className="bg-white/20 rounded-full h-1.5 mb-1">
          <div className="bg-white h-1.5 rounded-full transition-all duration-700" style={{ width: `${overallProgress}%` }} />
        </div>
        <p className="text-indigo-200 text-xs">{overallProgress}% complété</p>
      </div>

      {/* Steps */}
      <nav className="p-2 flex-1 overflow-y-auto">
        {STEPS.map((step, i) => {
          const isActive = pathname.endsWith(step.path)
          const isDone = completion ? completion[step.id as keyof typeof completion] : false
          const isAiStep = step.id === 'generation' || step.id === 'editing' || step.id === 'export'
          const isUnavailable = isAiStep && needsGeneration

          if (i === 4) {
            return (
              <div key={step.id}>
                <div className="my-1.5 mx-2 border-t border-slate-100 flex items-center gap-2">
                  <span className="text-xs text-slate-300 bg-white px-1">IA</span>
                </div>
                {renderStep(step, isActive, isDone, isUnavailable, reportId, onClose)}
              </div>
            )
          }
          return renderStep(step, isActive, isDone, false, reportId, onClose)
        })}
      </nav>

      {currentStep && (
        <div className="mx-2 mb-2 px-3 py-2.5 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-xs font-bold text-amber-700">
            {completion?.[currentStep.id as keyof typeof completion] ? `${currentStep.cheer} 🎉` : `C'est à vous ! ${currentStep.icon}`}
          </p>
        </div>
      )}

      <div className="px-3 pb-3">
        <Link href="/rapport" onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
          ← Tous les rapports
        </Link>
      </div>
    </div>
  )
}

function renderStep(
  step: typeof STEPS[0],
  isActive: boolean,
  isDone: boolean,
  isUnavailable: boolean,
  id: string,
  onClose?: () => void
) {
  if (isUnavailable) {
    return (
      <div key={step.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 select-none" title="Disponible après la génération IA">
        <span className="text-base shrink-0 opacity-40">{step.icon}</span>
        <span className="text-xs flex-1 font-medium">{step.label}</span>
        <span className="text-xs text-slate-200">—</span>
      </div>
    )
  }

  return (
    <Link
      key={step.id}
      href={`/rapport/${id}/${step.path}`}
      onClick={onClose}
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

export default function ReportIdLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const id = params.id as string
  const [report, setReport] = useState<Report | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setReport(getReport(id))
  }, [id, pathname])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <div className="flex gap-6 relative">
      {/* Desktop sidebar */}
      <aside className="w-56 shrink-0 hidden md:block">
        <div className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
          <SidebarContent reportId={id} pathname={pathname} report={report} />
        </div>
      </aside>

      {/* Mobile burger */}
      <div className="md:hidden fixed top-16 left-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200"
        >
          ☰
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 shadow-2xl overflow-hidden">
            <SidebarContent reportId={id} pathname={pathname} report={report} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 md:pl-0 pl-0">{children}</div>
    </div>
  )
}
