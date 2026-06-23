'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport, ReportSection } from '@/lib/report-store'
import { REPORT_SECTIONS } from '@/lib/mock-data'
import StepTracker from '@/components/StepTracker'

export default function EditeurPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [sections, setSections] = useState<ReportSection[]>([])
  const [activeSection, setActiveSection] = useState<string>('')
  const [preview, setPreview] = useState(false)
  const [ready, setReady] = useState(false)
  const [regenerating, setRegenerating] = useState<string | null>(null)
  const [interview, setInterview] = useState<Record<string, string>>({})

  useEffect(() => {
    const report = getReport(id)
    if (!report) { router.push('/rapport'); return }
    if (report.sections.length === 0) { router.push(`/rapport/${id}/generateur`); return }
    setSections(report.sections)
    setActiveSection(report.sections[0]?.id ?? '')
    setInterview(report.interview)
    setReady(true)
  }, [id, router])

  function updateSection(sectionId: string, content: string) {
    const updated = sections.map(s => s.id === sectionId ? { ...s, content } : s)
    setSections(updated)
    updateReport(id, { sections: updated })
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
        const regenerated = data.sections.find(s => s.id === sectionId)
        if (regenerated) {
          updateSection(sectionId, regenerated.content)
        }
      }
    } finally {
      setRegenerating(null)
    }
  }

  function handleContinue() {
    updateReport(id, { status: 'export' })
    router.push(`/rapport/${id}/export`)
  }

  if (!ready) return null

  const activeSectionData = sections.find(s => s.id === activeSection)
  const sectionMeta = REPORT_SECTIONS.find(s => s.id === activeSection)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <StepTracker reportId={id} current="editing" reached="editing" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Édition du rapport</h1>
            <p className="text-stone-600 mt-1">Relisez et modifiez chaque section à votre convenance.</p>
          </div>
          <button
            onClick={() => setPreview(p => !p)}
            className={`px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${preview ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'}`}
          >
            {preview ? '✏️ Éditer' : '👁 Aperçu'}
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Section sidebar */}
        <div className="w-52 shrink-0 space-y-1">
          {sections.map(section => {
            const meta = REPORT_SECTIONS.find(s => s.id === section.id)
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2
                  ${activeSection === section.id ? 'bg-green-50 text-green-800 font-semibold border border-green-200' : 'text-stone-600 hover:bg-stone-50'}`}
              >
                <span>{meta?.icon ?? '📄'}</span>
                <span className="leading-tight">{section.title}</span>
              </button>
            )
          })}
        </div>

        {/* Editor */}
        <div className="flex-1 min-w-0">
          {activeSectionData && (
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100 bg-stone-50">
                <div className="flex items-center gap-2">
                  <span>{sectionMeta?.icon}</span>
                  <span className="font-semibold text-stone-800">{activeSectionData.title}</span>
                </div>
                <button
                  onClick={() => regenerateSection(activeSectionData.id)}
                  disabled={regenerating === activeSectionData.id}
                  className="text-xs text-green-700 hover:text-green-800 font-medium border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 disabled:opacity-50 transition-colors"
                >
                  {regenerating === activeSectionData.id ? '⚙️ En cours…' : '✨ Régénérer'}
                </button>
              </div>
              {preview ? (
                <div className="p-6 prose max-w-none">
                  {activeSectionData.content.split('\n').map((para, i) => (
                    <p key={i} className="text-stone-700 mb-3 leading-relaxed">{para}</p>
                  ))}
                </div>
              ) : (
                <textarea
                  value={activeSectionData.content}
                  onChange={e => updateSection(activeSectionData.id, e.target.value)}
                  className="w-full p-6 text-stone-700 leading-relaxed focus:outline-none resize-none min-h-64 text-base"
                  rows={14}
                />
              )}
              <div className="px-5 py-2 border-t border-stone-100 bg-stone-50 flex justify-between items-center">
                <span className="text-xs text-stone-400">{activeSectionData.content.length} caractères</span>
                <span className="text-xs text-stone-400">{activeSectionData.content.split(/\s+/).filter(Boolean).length} mots</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleContinue}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Exporter le rapport →
        </button>
      </div>
    </div>
  )
}
