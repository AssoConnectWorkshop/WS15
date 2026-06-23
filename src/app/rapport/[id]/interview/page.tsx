'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport } from '@/lib/report-store'
import { INTERVIEW_QUESTIONS } from '@/lib/mock-data'
import StepTracker from '@/components/StepTracker'

export default function InterviewPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
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

  function handleNext() {
    if (currentQ < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1)
    } else {
      updateReport(id, { status: 'contributors' })
      router.push(`/rapport/${id}/contributeurs`)
    }
  }

  function handlePrev() {
    setCurrentQ(q => Math.max(0, q - 1))
  }

  if (!ready) return null

  const question = INTERVIEW_QUESTIONS[currentQ]
  const answeredCount = INTERVIEW_QUESTIONS.filter(q => answers[q.id]?.trim()).length
  const progress = Math.round((answeredCount / INTERVIEW_QUESTIONS.length) * 100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <StepTracker reportId={id} current="interview" reached="interview" />
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Entretien guidé</h1>
          <p className="text-stone-600 mt-1">Vos réponses serviront à générer les sections narratives du rapport.</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-stone-700">{answeredCount} / {INTERVIEW_QUESTIONS.length} questions répondues</span>
          <span className="text-sm font-semibold text-green-700">{progress}%</span>
        </div>
        <div className="bg-stone-100 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Question {currentQ + 1} sur {INTERVIEW_QUESTIONS.length}</span>
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">{question.question}</h2>
        <p className="text-sm text-stone-500 mb-6 flex items-center gap-1">
          <span>💡</span> {question.hint}
        </p>
        <textarea
          key={question.id}
          value={answers[question.id] ?? ''}
          onChange={e => saveAnswer(question.id, e.target.value)}
          placeholder={question.placeholder}
          rows={6}
          className="w-full border border-stone-200 rounded-xl p-4 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-base"
        />
        {answers[question.id]?.trim() && (
          <div className="mt-2 flex items-center gap-1.5 text-green-600">
            <span className="text-sm">✓</span>
            <span className="text-sm font-medium">Réponse enregistrée</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQ === 0}
          className="px-6 py-2.5 rounded-xl border border-stone-300 text-stone-600 font-medium hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Précédent
        </button>

        {/* Dot navigation */}
        <div className="flex gap-2">
          {INTERVIEW_QUESTIONS.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentQ(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === currentQ ? 'bg-green-600' : answers[q.id]?.trim() ? 'bg-green-300' : 'bg-stone-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          {currentQ === INTERVIEW_QUESTIONS.length - 1 ? 'Terminer →' : 'Suivant →'}
        </button>
      </div>

      {/* Quick overview */}
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">Toutes les questions</p>
        <div className="grid gap-2">
          {INTERVIEW_QUESTIONS.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentQ(i)}
              className={`text-left flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                i === currentQ ? 'bg-green-50 border border-green-200' : 'hover:bg-white'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                answers[q.id]?.trim() ? 'bg-green-600 text-white' : 'bg-stone-200 text-stone-500'
              }`}>
                {answers[q.id]?.trim() ? '✓' : i + 1}
              </span>
              <span className="text-sm text-stone-600 line-clamp-1">{q.question}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
