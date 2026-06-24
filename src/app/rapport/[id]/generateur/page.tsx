'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport, ReportSection, getStepCompletion } from '@/lib/report-store'
import { REPORT_SECTIONS } from '@/lib/mock-data'
import Confetti from '@/components/Confetti'

type State = 'idle' | 'loading' | 'done' | 'error'

const LOADING_MESSAGES = [
  { text: "Je lis vos notes avec beaucoup d'amour… 📖", emoji: "📖" },
  { text: "Je transforme vos chiffres en poésie… 🔢✨", emoji: "✨" },
  { text: "L'IA est concentrée, ne pas déranger… 🤫", emoji: "🤫" },
  { text: "Je cherche les mots parfaits pour votre asso… 🎯", emoji: "🎯" },
  { text: "Je fais de mon mieux, promis… 🫡", emoji: "🫡" },
  { text: "Les sections prennent forme, c'est beau… 🌱", emoji: "🌱" },
  { text: "Presque là ! Je peaufine les détails… 💅", emoji: "💅" },
  { text: "Dernière ligne droite, suspense… 🏁", emoji: "🏁" },
]

export default function GenerateurPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [genState, setGenState] = useState<State>('idle')
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  const [sections, setSections] = useState<ReportSection[]>([])
  const [ready, setReady] = useState(false)
  const [interview, setInterview] = useState<Record<string, string>>({})
  const [hints, setHints] = useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const report = getReport(id)
    if (!report) { router.push('/rapport'); return }
    setInterview(report.interview)
    if (report.sections.length > 0) { setSections(report.sections); setGenState('done') }
    const c = getStepCompletion(report)
    const h: string[] = []
    const n = Object.values(report.interview).filter(v => v?.trim()).length
    if (!c.interview) h.push(`Répondez à au moins 4 questions de l'entretien (${n}/8 pour l'instant)`)
    setHints(h)
    setReady(true)
  }, [id, router])

  async function handleGenerate() {
    setGenState('loading')
    setSections([])
    let idx = 0
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_MESSAGES.length
      setLoadingMsgIdx(idx)
    }, 3000)

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
      setShowConfetti(true)
    } catch {
      clearInterval(interval)
      setGenState('error')
    }
  }

  if (!ready) return null

  const msg = LOADING_MESSAGES[loadingMsgIdx]

  return (
    <div className="space-y-6">
      <Confetti active={showConfetti} />

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Génération IA ✨</h1>
        <p className="text-slate-500 mt-1">Un clic. 8 sections. ~30 secondes. Pour de vrai.</p>
      </div>

      {genState === 'idle' && (
        <div className="space-y-4">
          {hints.length > 0 && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 space-y-2">
              <p className="font-bold text-amber-800 flex items-center gap-2">⚠️ Petit conseil avant de générer :</p>
              {hints.map((h, i) => <p key={i} className="text-sm text-amber-700 flex items-start gap-2"><span>•</span>{h}</p>)}
              <p className="text-xs text-amber-600 mt-1 italic">Vous pouvez quand même générer, mais plus vous répondez, plus c&apos;est magique ✨</p>
            </div>
          )}

          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-10 text-center">
            <div className="text-7xl mb-4">🪄</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Prêt·e pour la magie ?</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              L&apos;IA va rédiger <strong className="text-indigo-600">{REPORT_SECTIONS.length} sections complètes</strong> à partir de vos vraies données. Elle ne s&apos;invente rien — elle raconte <em>votre</em> histoire.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {REPORT_SECTIONS.map(s => (
                <span key={s.id} className="text-sm bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-full font-medium">
                  {s.icon} {s.title}
                </span>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold px-12 py-4 rounded-2xl transition-all text-lg shadow-xl shadow-indigo-200 hover:scale-105 active:scale-95"
            >
              ✨ Go, l&apos;IA !
            </button>
            <p className="text-xs text-slate-400 mt-3">Durée estimée : le temps d&apos;un café ☕</p>
          </div>
        </div>
      )}

      {genState === 'loading' && (
        <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-sm p-12 text-center">
          <div className="text-6xl mb-4" style={{ animation: 'spin 2s linear infinite', display: 'inline-block' }}>⚙️</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">L&apos;IA est au travail…</h2>
          <p className="text-indigo-600 font-semibold mb-1 text-lg">{msg.emoji}</p>
          <p className="text-slate-600 mb-6 h-6 transition-all">{msg.text}</p>
          <div className="bg-slate-100 rounded-full h-3 max-w-xs mx-auto overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-3 rounded-full animate-pulse" style={{ width: '75%' }} />
          </div>
          <p className="text-xs text-slate-400 mt-3">Patience, les grandes œuvres prennent du temps 🎨</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {genState === 'error' && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-3">😅</div>
          <h2 className="text-lg font-bold text-red-800 mb-2">Aïe, l&apos;IA a trébuché !</h2>
          <p className="text-red-600 mb-4 text-sm">Ça arrive même aux meilleures. On réessaie ?</p>
          <button onClick={handleGenerate} className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">
            🔄 Réessayer !
          </button>
        </div>
      )}

      {genState === 'done' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🎉</span>
              <div>
                <p className="font-black text-xl">Votre rapport est né !</p>
                <p className="text-emerald-100 text-sm mt-1">{sections.length} sections rédigées, {sections.reduce((s, sec) => s + sec.content.split(/\s+/).filter(Boolean).length, 0)} mots générés. L&apos;IA a tout donné. ❤️</p>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            {sections.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 hover:border-indigo-200 transition-colors">
                <span className="text-xl font-bold text-emerald-500 w-6 shrink-0">✓</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">{s.title}</p>
                  <p className="text-slate-400 text-xs truncate">{s.content.slice(0, 80)}…</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{s.content.split(/\s+/).filter(Boolean).length} mots</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <button onClick={handleGenerate} className="border-2 border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
              🔄 Tout régénérer
            </button>
            <div className="flex gap-3">
              <button onClick={() => router.push(`/rapport/${id}/editeur`)} className="border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                ✏️ Modifier
              </button>
              <button onClick={() => router.push(`/rapport/${id}/export`)} className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 hover:scale-105 transition-all">
                👁 Visualiser le rapport →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
