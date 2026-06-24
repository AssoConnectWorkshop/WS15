'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport } from '@/lib/report-store'
import { INTERVIEW_QUESTIONS } from '@/lib/mock-data'
import Confetti from '@/components/Confetti'

const ENCOURAGEMENTS = [
  { text: "Voilà qui va enflammer le rapport ! 🔥", emoji: "🔥" },
  { text: "L'IA est déjà fan de vos réponses 🤖❤️", emoji: "❤️" },
  { text: "Du vécu, du concret, du parfait 💎", emoji: "💎" },
  { text: "Vous racontez ça tellement bien ! 🎤", emoji: "🎤" },
  { text: "Honnête et courageux·se — on adore 💪", emoji: "💪" },
  { text: "Vos membres vont adorer lire ça ! 😍", emoji: "😍" },
  { text: "C'est exactement ce qu'il faut dire ✨", emoji: "✨" },
  { text: "Chef-d'œuvre en cours d'écriture 🎨", emoji: "🎨" },
]

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}
interface SpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  onresult: ((e: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult
  length: number
}
interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}
interface SpeechRecognitionAlternative {
  transcript: string
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

function VoiceButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const recRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    setSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition))
  }, [])

  function toggle() {
    if (listening) {
      recRef.current?.stop()
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'fr-FR'
    rec.continuous = true
    rec.interimResults = false
    rec.onresult = (e) => {
      const transcript = Array.from({ length: e.results.length }, (_, i) => e.results[i][0].transcript).join(' ')
      onTranscript(transcript)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    rec.start()
    setListening(true)
  }

  if (!supported) return null

  return (
    <button
      type="button"
      onClick={toggle}
      title={listening ? 'Cliquez pour arrêter' : 'Répondre à la voix'}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
        listening
          ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse'
          : 'bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100'
      }`}
    >
      {listening ? (
        <>
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          Enregistrement… (cliquez pour finir)
        </>
      ) : (
        <>🎙️ Répondre à la voix</>
      )}
    </button>
  )
}

const MILESTONE_MESSAGES: Record<number, string> = {
  4: "Mi-chemin ! Vous êtes en feu 🔥",
  6: "Plus que 2 questions, vous assurez grave 💪",
  7: "Avant-dernière ! La finiiish 🏃",
  8: "TERMINÉ ! Vous êtes une légende absolue 🏆🎊🎉",
}

export default function InterviewPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ text: string; emoji: string } | null>(null)
  const [milestone, setMilestone] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const report = getReport(id)
    if (!report) { router.push('/rapport'); return }
    setAnswers(report.interview || {})
    setReady(true)
  }, [id, router])

  function saveAnswer(questionId: string, value: string) {
    const updated = { ...answers, [questionId]: value }
    setAnswers(updated)
    updateReport(id, { interview: updated, status: 'interview' })
  }

  function handleBlur(questionId: string) {
    if (!answers[questionId]?.trim()) return
    const enc = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
    setToast(enc)
    setTimeout(() => setToast(null), 3000)

    const answeredCount = Object.values({ ...answers }).filter(v => v?.trim()).length
    if (MILESTONE_MESSAGES[answeredCount]) {
      setMilestone(MILESTONE_MESSAGES[answeredCount])
      if (answeredCount === INTERVIEW_QUESTIONS.length) setShowConfetti(true)
      setTimeout(() => setMilestone(''), 4000)
    }
  }

  function handleVoiceTranscript(questionId: string, transcript: string) {
    const current = answers[questionId] ?? ''
    const joined = current ? `${current} ${transcript}` : transcript
    saveAnswer(questionId, joined)
    handleBlur(questionId)
  }

  function handleNext() {
    if (currentQ < INTERVIEW_QUESTIONS.length - 1) setCurrentQ(q => q + 1)
    else { updateReport(id, { status: 'contributors' }); router.push(`/rapport/${id}/contributeurs`) }
  }

  if (!ready) return null

  const question = INTERVIEW_QUESTIONS[currentQ]
  const answeredCount = INTERVIEW_QUESTIONS.filter(q => answers[q.id]?.trim()).length
  const allDone = answeredCount === INTERVIEW_QUESTIONS.length
  const progress = Math.round((answeredCount / INTERVIEW_QUESTIONS.length) * 100)

  return (
    <div className="space-y-5">
      <Confetti active={showConfetti} />

      {/* Milestone banner */}
      {milestone && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-2xl px-5 py-3 text-center animate-bounce shadow-lg shadow-amber-200">
          {milestone}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Entretien guidé 🎤</h1>
          <p className="text-slate-500 mt-1">Racontez votre année à votre façon. L&apos;IA se charge de la plume !</p>
        </div>
        {allDone && (
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-2xl px-4 py-2 text-sm shadow-lg shadow-emerald-200 animate-pulse">
            🏆 Terminé !
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-600">{answeredCount} / {INTERVIEW_QUESTIONS.length} questions</span>
          <span className="text-sm font-bold text-indigo-600">{progress}% 🎯</span>
        </div>
        <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress > 0 && progress < 100 && (
          <p className="text-xs text-slate-400 mt-1.5">
            {progress < 50 ? "C'est bien parti, continuez ! 💪" : progress < 75 ? "Plus de la moitié, vous gérez ! 🔥" : "Presque fini, trop fort·e ! 🚀"}
          </p>
        )}
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-6 pt-6 pb-4 border-b border-slate-100">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Question {currentQ + 1} / {INTERVIEW_QUESTIONS.length}</p>
          <h2 className="text-xl font-bold text-slate-900">{question.question}</h2>
          <p className="text-sm text-slate-400 mt-2 flex items-center gap-1.5">
            <span>💡</span> {question.hint}
          </p>
        </div>

        <div className="p-6">
          <textarea
            key={question.id}
            value={answers[question.id] ?? ''}
            onChange={e => saveAnswer(question.id, e.target.value)}
            onBlur={() => handleBlur(question.id)}
            placeholder={question.placeholder}
            rows={5}
            className="w-full border-2 border-slate-100 focus:border-indigo-300 rounded-xl p-4 text-slate-700 placeholder-slate-300 focus:outline-none resize-none text-base transition-colors"
          />

          <div className="flex items-center justify-between mt-3">
            <VoiceButton onTranscript={(t) => handleVoiceTranscript(question.id, t)} />
            <div className={`flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-all duration-300 ${toast ? 'opacity-100' : 'opacity-0'}`}>
              {toast && <><span className="text-lg">{toast.emoji}</span> {toast.text}</>}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
          disabled={currentQ === 0}
          className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-500 font-semibold hover:bg-slate-50 disabled:opacity-30 transition-colors"
        >
          ← Précédent
        </button>

        {/* Dot nav */}
        <div className="flex gap-1.5 items-center">
          {INTERVIEW_QUESTIONS.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentQ(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentQ ? 'w-7 h-3 bg-indigo-500' :
                answers[q.id]?.trim() ? 'w-3 h-3 bg-indigo-300' :
                'w-3 h-3 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-200"
        >
          {currentQ === INTERVIEW_QUESTIONS.length - 1 ? 'Terminé 🎉' : 'Suivant →'}
        </button>
      </div>

      {/* Questions overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Vue d&apos;ensemble — cliquez pour naviguer</p>
        <div className="grid grid-cols-1 gap-1">
          {INTERVIEW_QUESTIONS.map((q, i) => (
            <button key={q.id} onClick={() => setCurrentQ(i)}
              className={`text-left flex items-center gap-3 p-2.5 rounded-xl transition-colors ${i === currentQ ? 'bg-indigo-50 border-2 border-indigo-100' : 'hover:bg-slate-50 border-2 border-transparent'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold transition-all ${answers[q.id]?.trim() ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {answers[q.id]?.trim() ? '✓' : i + 1}
              </span>
              <span className="text-sm text-slate-600 line-clamp-1 flex-1">{q.question}</span>
              {answers[q.id]?.trim() && <span className="text-xs text-slate-400 shrink-0">{answers[q.id].split(/\s+/).length} mots</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
