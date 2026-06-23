'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport, ReportSection } from '@/lib/report-store'
import { REPORT_SECTIONS } from '@/lib/mock-data'
import StepTracker from '@/components/StepTracker'

type GenerationState = 'idle' | 'loading' | 'done' | 'error'

export default function GenerateurPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [state, setState] = useState<GenerationState>('idle')
  const [progress, setProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState('')
  const [sections, setSections] = useState<ReportSection[]>([])
  const [ready, setReady] = useState(false)
  const [interview, setInterview] = useState<Record<string, string>>({})

  useEffect(() => {
    const report = getReport(id)
    if (!report) { router.push('/rapport'); return }
    setInterview(report.interview)
    if (report.sections.length > 0) {
      setSections(report.sections)
      setState('done')
    }
    setReady(true)
  }, [id, router])

  async function handleGenerate() {
    setState('loading')
    setProgress(0)
    setSections([])

    try {
      for (let i = 0; i < REPORT_SECTIONS.length; i++) {
        setCurrentSection(REPORT_SECTIONS[i].title)
        setProgress(Math.round((i / REPORT_SECTIONS.length) * 100))
      }

      const res = await fetch('/api/rapport/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interview }),
      })

      if (!res.ok) throw new Error('Génération échouée')

      const data = await res.json() as { sections: ReportSection[] }
      setSections(data.sections)
      updateReport(id, {
        sections: data.sections,
        status: 'editing',
        generatedAt: new Date().toISOString(),
      })
      setProgress(100)
      setState('done')
    } catch {
      setState('error')
    }
  }

  function handleContinue() {
    router.push(`/rapport/${id}/editeur`)
  }

  if (!ready) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <StepTracker reportId={id} current="generation" reached="generation" />
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Génération du rapport</h1>
          <p className="text-stone-600 mt-1">L&apos;IA va rédiger toutes les sections à partir de vos données et réponses.</p>
        </div>
      </div>

      {state === 'idle' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-10 text-center">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-xl font-bold text-stone-900 mb-3">Prêt à générer votre rapport</h2>
          <p className="text-stone-600 max-w-md mx-auto mb-8">
            L&apos;IA va créer {REPORT_SECTIONS.length} sections à partir de vos données AssoConnect, vos réponses à l&apos;entretien et les contributions des responsables.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {REPORT_SECTIONS.map(s => (
              <span key={s.id} className="text-sm bg-stone-100 text-stone-600 px-3 py-1 rounded-full">
                {s.icon} {s.title}
              </span>
            ))}
          </div>
          <button
            onClick={handleGenerate}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold px-10 py-4 rounded-xl transition-colors text-lg"
          >
            ✨ Générer le rapport
          </button>
          <p className="text-xs text-stone-400 mt-3">Environ 30 secondes</p>
        </div>
      )}

      {state === 'loading' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-10 text-center">
          <div className="text-5xl mb-4 animate-pulse">⚙️</div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Génération en cours…</h2>
          <p className="text-stone-500 mb-6">Rédaction de : <span className="font-medium text-stone-700">{currentSection}</span></p>
          <div className="bg-stone-100 rounded-full h-3 max-w-sm mx-auto mb-2">
            <div className="bg-green-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-stone-500">{progress}%</p>
        </div>
      )}

      {state === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-lg font-bold text-red-800 mb-2">Erreur lors de la génération</h2>
          <p className="text-red-600 mb-4">Vérifiez votre connexion et réessayez.</p>
          <button onClick={handleGenerate} className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
            Réessayer
          </button>
        </div>
      )}

      {state === 'done' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-3">
            <span className="text-green-600 text-2xl">✓</span>
            <div>
              <p className="font-bold text-green-800 text-lg">Rapport généré avec succès !</p>
              <p className="text-green-700 text-sm">{sections.length} sections rédigées. Vous pouvez maintenant les relire et les modifier.</p>
            </div>
          </div>

          <div className="grid gap-3">
            {sections.map(section => (
              <div key={section.id} className="bg-white rounded-xl border border-stone-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">✓</span>
                  <h3 className="font-semibold text-stone-800">{section.title}</h3>
                </div>
                <p className="text-stone-600 text-sm line-clamp-3">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={handleGenerate}
              className="border border-stone-300 text-stone-600 hover:bg-stone-50 font-medium px-6 py-2.5 rounded-xl transition-colors"
            >
              Régénérer tout
            </button>
            <button
              onClick={handleContinue}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Éditer le rapport →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
