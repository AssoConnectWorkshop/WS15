'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport, ReportSection } from '@/lib/report-store'
import { REPORT_SECTIONS } from '@/lib/mock-data'

export default function EditeurPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [sections, setSections] = useState<ReportSection[]>([])
  const [activeSection, setActiveSection] = useState('')
  const [preview, setPreview] = useState(false)
  const [ready, setReady] = useState(false)
  const [regenerating, setRegenerating] = useState<string | null>(null)
  const [interview, setInterview] = useState<Record<string, string>>({})
  const [savedFlash, setSavedFlash] = useState(false)

  useEffect(() => {
    const report = getReport(id)
    if (!report) { router.push('/rapport'); return }
    if (!report.sections.length) { router.push(`/rapport/${id}/generateur`); return }
    setSections(report.sections)
    setActiveSection(report.sections[0]?.id ?? '')
    setInterview(report.interview)
    setReady(true)
  }, [id, router])

  function updateSection(sectionId: string, content: string) {
    const updated = sections.map(s => s.id === sectionId ? { ...s, content } : s)
    setSections(updated)
    updateReport(id, { sections: updated })
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1500)
  }

  async function regenerateSection(sectionId: string) {
    setRegenerating(sectionId)
    try {
      const res = await fetch('/api/rapport/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interview }),
      })
      if (res.ok) {
        const data = await res.json() as { sections: ReportSection[] }
        const regen = data.sections.find(s => s.id === sectionId)
        if (regen) updateSection(sectionId, regen.content)
      }
    } finally {
      setRegenerating(null)
    }
  }

  if (!ready) return null

  const active = sections.find(s => s.id === activeSection)
  const meta = REPORT_SECTIONS.find(s => s.id === activeSection)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Édition ✏️</h1>
          <p className="text-slate-500 mt-1">Relisez, retouchez, faites-le vôtre. L&apos;IA a fait le gros du travail !</p>
        </div>
        <div className="flex items-center gap-3">
          {savedFlash && <span className="text-sm text-emerald-600 font-medium animate-pulse">✓ Sauvegardé</span>}
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setPreview(false)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!preview ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              ✏️ Éditer
            </button>
            <button
              onClick={() => setPreview(true)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${preview ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              👁 Aperçu
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Section list */}
        <div className="w-48 shrink-0 space-y-1">
          {sections.map(section => {
            const m = REPORT_SECTIONS.find(s => s.id === section.id)
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2
                  ${activeSection === section.id ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
              >
                <span>{m?.icon ?? '📄'}</span>
                <span className="leading-tight text-xs">{section.title}</span>
              </button>
            )
          })}
        </div>

        {/* Editor area */}
        <div className="flex-1 min-w-0">
          {active && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
                <span className="font-semibold text-slate-700 flex items-center gap-2">
                  <span>{meta?.icon}</span> {active.title}
                </span>
                <button
                  onClick={() => regenerateSection(active.id)}
                  disabled={regenerating === active.id}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 disabled:opacity-50 transition-colors"
                >
                  {regenerating === active.id ? '⏳ En cours…' : '✨ Régénérer'}
                </button>
              </div>

              {preview ? (
                <div className="p-8 space-y-3">
                  {active.content.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i} className="text-slate-700 leading-relaxed">{para}</p>
                  ))}
                </div>
              ) : (
                <textarea
                  value={active.content}
                  onChange={e => updateSection(active.id, e.target.value)}
                  className="w-full p-6 text-slate-700 leading-relaxed focus:outline-none resize-none min-h-64 text-base"
                  rows={12}
                />
              )}

              <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="text-xs text-slate-400">{active.content.split(/\s+/).filter(Boolean).length} mots</span>
                <span className="text-xs text-emerald-500 font-medium">Auto-sauvegardé ✓</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button onClick={() => { updateReport(id, { status: 'export' }); router.push(`/rapport/${id}/export`) }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          Exporter le rapport 🎉 →
        </button>
      </div>
    </div>
  )
}
