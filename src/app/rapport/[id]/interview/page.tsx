'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport } from '@/lib/report-store'
import { INTERVIEW_QUESTIONS } from '@/lib/mock-data'

const ENCOURAGEMENTS = [
  "Super réponse, on voit que vous aimez votre asso ! 🌟",
  "Voilà qui va faire un beau paragraphe ! ✨",
  "L'IA va adorer travailler avec ça 🤖",
  "Honest reporting, respect ! 💪",
  "Magnifique, ça sent le vécu ! 🌱",
  "Exactement ce qu'il faut, bravo ! 🎯",
  "C'est noté, merci pour ce partage ! 🙌",
  "Le rapport va être canon ! 🔥",
]

export default function InterviewPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [justSaved, setJustSaved] = useState<string | null>(null)
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
    if (answers[questionId]?.trim()) {
      const encouragement = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
      setJustSaved(encouragement)
      setTimeout(() => setJustSaved(null), 3000)
    }
  }

  function handleNext() {
    if (currentQ < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1)
    } else {
      updateReport(id, { status: 'contributors' })
      router.push(`/rapport/${id}/contributeurs`)
    }
  }

  if (!ready) return null

  const question = INTERVIEW_QUESTIONS[currentQ]
  const answeredCount = INTERVIEW_QUESTIONS.filter(q => answers[q.id]?.trim()).length
  const progress = Math.round((answeredCount / INTERVIEW_QUESTIONS.length) * 100)
  const allDone = answeredCount === INTERVIEW_QUESTIONS.length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Entretien guidé 🎤</h1>
          <p className="text-slate-500 mt-1">Racontez votre année à votre façon. L&apos;IA se charge de la plume !</p>
        </div>
        {allDone && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-sm font-semibold text-emerald-700">
            🎉 Toutes les questions répondues !
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">{answeredCount} / {INTERVIEW_QUESTIONS.length} questions</span>
          <span className="text-sm font-bold text-indigo-600">{progress}%</span>
        </div>
        <div className="bg-slate-100 rounded-full h-2.5">
          <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Question {currentQ + 1} / {INTERVIEW_QUESTIONS.length}</p>
        <h2 className="text-xl font-bold text-slate-900 mb-2">{question.question}</h2>
        <p className="text-sm text-slate-400 mb-6 flex items-center gap-1.5">
          <span>💡</span> {question.hint}
        </p>
        <textarea
          key={question.id}
          value={answers[question.id] ?? ''}
          onChange={e => saveAnswer(question.id, e.target.value)}
          onBlur={() => handleBlur(question.id)}
          placeholder={question.placeholder}
          rows={5}
          className="w-full border border-slate-200 rounded-xl p-4 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-base transition-shadow"
        />

        {/* Encouragement toast */}
        <div className={`mt-2 text-sm font-medium text-indigo-600 transition-all duration-300 ${justSaved ? 'opacity-100' : 'opacity-0'}`}>
          {justSaved ?? ' '}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
          disabled={currentQ === 0}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-medium hover:bg-slate-50 disabled:opacity-30 transition-colors"
        >
          ← Précédent
        </button>

        {/* Dots */}
        <div className="flex gap-1.5">
          {INTERVIEW_QUESTIONS.map((q, i) => (
            <button key={q.id} onClick={() => setCurrentQ(i)} className={`rounded-full transition-all ${i === currentQ ? 'w-6 h-2.5 bg-indigo-500' : answers[q.id]?.trim() ? 'w-2.5 h-2.5 bg-indigo-300' : 'w-2.5 h-2.5 bg-slate-200'}`} />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          {currentQ === INTERVIEW_QUESTIONS.length - 1 ? 'Terminer 🎉' : 'Suivant →'}
        </button>
      </div>

      {/* Questions overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Vue d&apos;ensemble</p>
        <div className="grid grid-cols-1 gap-1.5">
          {INTERVIEW_QUESTIONS.map((q, i) => (
            <button key={q.id} onClick={() => setCurrentQ(i)} className={`text-left flex items-center gap-3 p-2.5 rounded-xl transition-colors ${i === currentQ ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${answers[q.id]?.trim() ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {answers[q.id]?.trim() ? '✓' : i + 1}
              </span>
              <span className="text-sm text-slate-600 line-clamp-1">{q.question}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
