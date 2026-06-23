'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, Report } from '@/lib/report-store'
import { DEMO_ASSOCIATION } from '@/lib/mock-data'
import StepTracker from '@/components/StepTracker'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function ReportPreview({ report }: { report: Report }) {
  const data = DEMO_ASSOCIATION
  const totalParticipants = data.events.reduce((s, e) => s + e.participants, 0)
  const featuredPhotos = report.photos.filter(p => p.featured)

  return (
    <div id="rapport-print" className="bg-white text-stone-900 max-w-3xl mx-auto">
      {/* Cover */}
      <div className="text-center py-20 px-8 border-b-4 border-green-700">
        <div className="text-7xl mb-6">🌱</div>
        <h1 className="text-4xl font-bold text-green-800 mb-2">{data.name}</h1>
        <p className="text-xl text-stone-600 mb-1">Rapport d&apos;activité {report.year}</p>
        <p className="text-stone-500 text-sm">Assemblée générale du {formatDate(report.agmDate)}</p>
      </div>

      {/* Key figures */}
      <div className="grid grid-cols-4 gap-0 border-b border-stone-200">
        {[
          { label: 'Membres', value: data.members.current },
          { label: 'Bénévoles', value: data.volunteers.total },
          { label: 'Événements', value: data.events.length },
          { label: 'Participants', value: totalParticipants },
        ].map(stat => (
          <div key={stat.label} className="text-center p-6 border-r border-stone-200 last:border-r-0">
            <p className="text-3xl font-bold text-green-700">{stat.value}</p>
            <p className="text-sm text-stone-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Featured photos */}
      {featuredPhotos.length > 0 && (
        <div className="p-8 border-b border-stone-200">
          <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-4">L&apos;année en images</h2>
          <div className="grid grid-cols-3 gap-3">
            {featuredPhotos.slice(0, 3).map(photo => (
              <div key={photo.id} className="aspect-video rounded-lg overflow-hidden bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.dataUrl} alt={photo.caption} className="w-full h-full object-cover" />
                {photo.caption && <p className="text-xs text-stone-500 mt-1 text-center">{photo.caption}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sections */}
      {report.sections.map(section => (
        <div key={section.id} className="p-8 border-b border-stone-100">
          <h2 className="text-2xl font-bold text-green-800 mb-4">{section.title}</h2>
          <div className="text-stone-700 leading-relaxed space-y-3">
            {section.content.split('\n').filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="p-8 bg-stone-50 text-center">
        <p className="text-stone-500 text-sm">{data.name} · Rapport d&apos;activité {report.year}</p>
        <p className="text-stone-400 text-xs mt-1">Document généré le {new Date().toLocaleDateString('fr-FR')}</p>
      </div>
    </div>
  )
}

export default function ExportPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [report, setReport] = useState<Report | null>(null)

  useEffect(() => {
    const r = getReport(id)
    if (!r) { router.push('/rapport'); return }
    if (r.sections.length === 0) { router.push(`/rapport/${id}/generateur`); return }
    setReport(r)
  }, [id, router])

  function handlePrint() {
    window.print()
  }

  function handleWordExport() {
    if (!report) return
    const data = DEMO_ASSOCIATION
    const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Rapport d'activité ${report.year} - ${data.name}</title>
<style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#1c1917;line-height:1.6}h1{color:#15803d;font-size:28px}h2{color:#15803d;font-size:22px;margin-top:36px}p{margin-bottom:12px}.cover{text-align:center;padding:60px 0;border-bottom:3px solid #15803d;margin-bottom:40px}.stats{display:flex;gap:20px;justify-content:center;margin:30px 0}.stat{text-align:center}.stat strong{display:block;font-size:28px;color:#15803d}</style>
</head>
<body>
<div class="cover">
<h1>${data.name}</h1>
<p style="font-size:20px;color:#57534e">Rapport d'activité ${report.year}</p>
<p style="color:#78716c">Assemblée générale du ${new Date(report.agmDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
</div>
<div class="stats">
<div class="stat"><strong>${data.members.current}</strong>membres</div>
<div class="stat"><strong>${data.volunteers.total}</strong>bénévoles</div>
<div class="stat"><strong>${data.events.length}</strong>événements</div>
<div class="stat"><strong>${data.events.reduce((s, e) => s + e.participants, 0)}</strong>participants</div>
</div>
${report.sections.map(s => `<h2>${s.title}</h2>${s.content.split('\n').filter(Boolean).map(p => `<p>${p}</p>`).join('')}`).join('\n')}
<hr style="margin-top:60px">
<p style="text-align:center;color:#a8a29e;font-size:13px">${data.name} · Rapport d'activité ${report.year} · Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
</body></html>`

    const blob = new Blob([html], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport-activite-${report.year}.doc`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!report) return null

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          body > * { display: none !important; }
          #rapport-print, #rapport-print * { display: revert !important; }
          #rapport-print { max-width: 100% !important; }
        }
      `}</style>

      <div className="flex flex-col gap-4 print:hidden">
        <StepTracker reportId={id} current="export" reached="export" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Export du rapport</h1>
            <p className="text-stone-600 mt-1">Votre rapport est prêt. Téléchargez-le dans le format souhaité.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleWordExport}
              className="border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
            >
              📄 Télécharger Word
            </button>
            <button
              onClick={handlePrint}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
            >
              🖨️ Télécharger PDF
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden print:shadow-none print:border-0 print:rounded-none">
        <ReportPreview report={report} />
      </div>
    </div>
  )
}
