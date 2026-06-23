'use client'

import Link from 'next/link'
import { ReportStatus, STATUS_ORDER } from '@/lib/report-store'

const STEP_LABELS: Record<ReportStatus, string> = {
  data_review: 'Données',
  interview: 'Entretien',
  contributors: 'Contributeurs',
  photos: 'Photos',
  generation: 'Génération',
  editing: 'Édition',
  export: 'Export',
}

const STEP_PATHS: Record<ReportStatus, string> = {
  data_review: 'donnees',
  interview: 'interview',
  contributors: 'contributeurs',
  photos: 'photos',
  generation: 'generateur',
  editing: 'editeur',
  export: 'export',
}

type Props = {
  reportId: string
  current: ReportStatus
  reached: ReportStatus
}

export default function StepTracker({ reportId, current, reached }: Props) {
  const reachedIdx = STATUS_ORDER.indexOf(reached)

  return (
    <nav className="w-full overflow-x-auto">
      <ol className="flex items-center min-w-max gap-0">
        {STATUS_ORDER.map((step, i) => {
          const stepIdx = STATUS_ORDER.indexOf(step)
          const isCompleted = stepIdx < STATUS_ORDER.indexOf(current)
          const isCurrent = step === current
          const isReachable = stepIdx <= reachedIdx
          const isLast = i === STATUS_ORDER.length - 1

          return (
            <li key={step} className="flex items-center">
              {isReachable ? (
                <Link
                  href={`/rapport/${reportId}/${STEP_PATHS[step]}`}
                  className="flex flex-col items-center gap-1 group"
                >
                  <span className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                    ${isCompleted ? 'bg-green-600 text-white' : isCurrent ? 'bg-green-700 text-white ring-2 ring-green-300' : 'bg-stone-200 text-stone-500 group-hover:bg-stone-300'}
                  `}>
                    {isCompleted ? '✓' : i + 1}
                  </span>
                  <span className={`text-xs whitespace-nowrap ${isCurrent ? 'text-green-700 font-semibold' : 'text-stone-500'}`}>
                    {STEP_LABELS[step]}
                  </span>
                </Link>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-stone-100 text-stone-300">
                    {i + 1}
                  </span>
                  <span className="text-xs whitespace-nowrap text-stone-300">{STEP_LABELS[step]}</span>
                </div>
              )}
              {!isLast && (
                <span className={`w-10 h-0.5 mx-1 mt-[-16px] ${stepIdx < reachedIdx ? 'bg-green-400' : 'bg-stone-200'}`} />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
