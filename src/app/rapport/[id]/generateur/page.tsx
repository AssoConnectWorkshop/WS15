'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport, ReportSection, getStepCompletion } from '@/lib/report-store'
import { REPORT_SECTIONS } from '@/lib/mock-data'

type State = 'idle' | 'loading' | 'done' | 'error'

const LOADING_MESSAGES = [
  "Je lis vos notes avec attention… 📖",
  "Je transforme vos chiffres en histoire… 🔢",
  "J'invoque les mots justes… ✍️",
  "Je choisis le ton parfait pour votre asso… 🎨",
  "Presque là, patience… ⏳",
  "Les sections prennent forme… 🌱",
  "L'IA travaille dur pour vous ! 🤖",
  "Plus que quelques secondes… 🎯",
]

export default function GenerateurPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [genState, setGenState] = useState<State>('idle')
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0])
  const [sections, setSections] = useState<ReportSection[]>([])
  const [ready, setReady] = useState(false)
  const [interview, setInterview] = useState<Record<string, string>>({})

  const [completionHints, setCompletionHints] = useState<string[]>([])

  useEffect(() => {
    const report = getReport(id)
    if (!report) { router.push('/rapport'); return }
    setInterview(report.interview)
    if (report.sections.length > 0) { setSections(report.sections); setGenState('done') }
    const c = getStepCompletion(report)
    const hints: string[] = []
    if (!c.interview) hints.push(`Répondez à au moins 4 questions de l'entretien (actuellement ${Object.values(report.interview).filter(v => v?.trim()).length})`)
    setCompletionHints(hints)

    setReady(true)
  }, [id, router])

  async function handleGenerate() {
    setGenState('loading')
    setSections([])
    let msgIdx = 0
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length
      setLoadingMsg(LOADING_MESSAGES[msgIdx])
    }, 3500)

    try {
      const res = await fetch('/api/rapport/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interview }),
      })
      clearInterval(interval)
      if (!res.ok) throw new Error()
      const data = await res.json() as { sections: ReportSection[] }
      setSections(data.sections)
      updateReport(id, { sections: data.sections, status: 'editing', generatedAt: new Date().toISOString() })
      setGenState('done')
    } catch {
      clearInterval(interval)
      setGenState('error')
    }
  }

  if (!ready) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Génération IA ✨</h1>
        <p className="text-slate-500 mt-1">Un clic, et l&apos;IA rédige toutes les sections de votre rapport. Pour de vrai.</p>
      </div>

      {genState === 'idle' && (
        <div className="space-y-4">
          {completionHints.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <p className="font-semibold text-amber-800 flex items-center gap-2">⚠️ Pour une meilleure génération :</p>
              {completionHints.map((h, i) => (
                <p key={i} className="text-sm text-amber-700 flex items-start gap-2"><span>•</span>{h}</p>
              ))}
              <p className="text-xs text-amber-600 mt-1">Vous pouvez quand même générer, mais le résultat sera moins riche.</p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
            <div className="text-6xl mb-4">🪄</div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Prêt à générer votre rapport</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              L&apos;IA va rédiger <strong>{REPORT_SECTIONS.length} sections</strong> à partir de vos données réelles et de vos réponses. Elle ne s&apos;invente rien — elle raconte votre histoire.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {REPORT_SECTIONS.map(s => (
                <span key={s.id} className="text-sm bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full">
                  {s.icon} {s.title}
                </span>
              ))}
            </div>
            <button onClick={handleGenerate} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-4 rounded-2xl transition-colors text-lg shadow-lg shadow-indigo-200">
              ✨ Générer mon rapport
            </button>
            <p className="text-xs text-slate-400 mt-3">Environ 30 secondes ☕</p>
          </div>
        </div>
      )}

      {genState === 'loading' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="text-6xl mb-4 animate-spin">⚙️</div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">L&apos;IA est au travail…</h2>
          <p className="text-indigo-600 font-medium mb-6 h-6 transition-all">{loadingMsg}</p>
          <div className="bg-slate-100 rounded-full h-2 max-w-xs mx-auto">
            <div className="bg-indigo-500 h-2 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {genState === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">😅</div>
          <h2 className="text-lg font-bold text-red-800 mb-2">Oups, ça n&apos;a pas marché cette fois</h2>
          <p className="text-red-600 mb-4 text-sm">Vérifiez votre connexion et réessayez — ça devrait passer !</p>
          <button onClick={handleGenerate} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
            Réessayer 🔄
          </button>
        </div>
      )}

      {genState === 'done' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-bold text-emerald-800 text-lg">Votre rapport est généré !</p>
              <p className="text-emerald-600 text-sm">{sections.length} sections rédigées. Maintenant vous pouvez les relire, les modifier, et les faire vôtres.</p>
            </div>
          </div>

          <div className="grid gap-3">
            {sections.map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <h3 className="font-semibold text-slate-800">{s.title}</h3>
                  <span className="text-xs text-slate-400 ml-auto">{s.content.split(/\s+/).filter(Boolean).length} mots</span>
                </div>
                <p className="text-slate-500 text-sm line-clamp-2">{s.content}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <button onClick={handleGenerate} className="border border-slate-200 text-slate-500 hover:bg-slate-50 font-medium px-5 py-2.5 rounded-xl transition-colors text-sm">
              🔄 Régénérer tout
            </button>
            <button onClick={() => router.push(`/rapport/${id}/editeur`)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Éditer le rapport →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
