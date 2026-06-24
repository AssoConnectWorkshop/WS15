'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, Report } from '@/lib/report-store'
import Confetti from '@/components/Confetti'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const PHOTO_SECTION_MAP: Record<string, string[]> = {
  jardinage: ['activities', 'mission'],
  ateliers: ['activities'],
  evenements: ['activities', 'members_volunteers'],
  benevoles: ['members_volunteers'],
  autre: [],
}

function SectionPhotos({ sectionId, report }: { sectionId: string; report: Report }) {
  const photos = report.photos.filter(p => {
    if (p.featured) return false
    const mapped = PHOTO_SECTION_MAP[p.section] ?? []
    return mapped.includes(sectionId)
  })
  if (photos.length === 0) return null
  return (
    <div className={`grid gap-2 mt-4 ${photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {photos.slice(0, 2).map(photo => (
        <div key={photo.id} className="rounded-lg overflow-hidden bg-slate-100 aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.dataUrl} alt={photo.caption} className="w-full h-full object-cover" />
          {photo.caption && <p className="text-xs text-center text-slate-400 p-1.5 italic">{photo.caption}</p>}
        </div>
      ))}
    </div>
  )
}

type OrgStats = {
  orgName: string
  members: number
  people: number
  eventCount: number
  surplus: number
}

function ReportPreview({ report, orgStats }: { report: Report; orgStats: OrgStats }) {
  const featuredPhotos = report.photos.filter(p => p.featured)
  const surplusLabel = `${orgStats.surplus >= 0 ? '+' : ''}${orgStats.surplus.toLocaleString('fr-FR')} €`

  return (
    <div id="rapport-print" className="bg-white text-slate-900 max-w-3xl mx-auto font-sans">
      <div className="text-center py-20 px-8 bg-gradient-to-br from-indigo-700 to-violet-700 text-white">
        <div className="text-7xl mb-6">🌱</div>
        <h1 className="text-4xl font-bold mb-3">{orgStats.orgName}</h1>
        <p className="text-xl text-indigo-200 mb-2">Rapport d&apos;activité {report.year}</p>
        <p className="text-indigo-300 text-sm">Assemblée générale du {formatDate(report.agmDate)}</p>
      </div>
      <div className="grid grid-cols-4 border-b border-slate-100">
        {[
          { label: 'Membres', value: orgStats.members.toLocaleString('fr-FR'), icon: '👥' },
          { label: 'Contacts CRM', value: orgStats.people.toLocaleString('fr-FR'), icon: '🙌' },
          { label: 'Événements', value: orgStats.eventCount.toLocaleString('fr-FR'), icon: '📅' },
          { label: 'Résultat', value: orgStats.surplus !== 0 ? surplusLabel : '—', icon: '💰' },
        ].map(stat => (
          <div key={stat.label} className="text-center p-6 border-r border-slate-100 last:border-r-0">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <p className="text-3xl font-bold text-indigo-700">{stat.value}</p>
            <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
      {featuredPhotos.length > 0 && (
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">L&apos;année en images</h2>
          <div className={`grid gap-3 ${featuredPhotos.length === 1 ? 'grid-cols-1' : featuredPhotos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {featuredPhotos.slice(0, 3).map(photo => (
              <div key={photo.id} className="rounded-xl overflow-hidden bg-slate-100 aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.dataUrl} alt={photo.caption} className="w-full h-full object-cover" />
                {photo.caption && <p className="text-xs text-center text-slate-500 p-2 italic">{photo.caption}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      {report.sections.map(section => (
        <div key={section.id} className="p-8 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-indigo-700 mb-5">{section.title}</h2>
          <div className="space-y-3 text-slate-700 leading-relaxed">
            {section.content.split('\n').filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
          </div>
          <SectionPhotos sectionId={section.id} report={report} />
        </div>
      ))}
      <div className="p-8 bg-slate-50 text-center border-t border-slate-100">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">AC</div>
          <span className="text-slate-500 text-sm">Généré avec AssoConnect Rapport</span>
        </div>
        <p className="text-slate-400 text-xs">{orgStats.orgName} · Rapport d&apos;activité {report.year} · {new Date().toLocaleDateString('fr-FR')}</p>
      </div>
    </div>
  )
}

export default function ExportClient({ orgStats }: { orgStats: OrgStats }) {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [report, setReport] = useState<Report | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const r = getReport(id)
    if (!r) { router.push('/rapport'); return }
    if (!r.sections.length) { router.push(`/rapport/${id}/generateur`); return }
    setReport(r)
    setTimeout(() => setShowConfetti(true), 400)
  }, [id, router])

  function handleWordExport() {
    if (!report) return
    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<title>Rapport d'activité ${report.year} — ${orgStats.orgName}</title>
<style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;color:#1e293b;line-height:1.7}h1{color:#4338ca}h2{color:#4338ca;font-size:22px;margin-top:40px;padding-bottom:8px;border-bottom:2px solid #e2e8f0}.cover{text-align:center;padding:80px 40px;background:linear-gradient(135deg,#4338ca,#7c3aed);color:white;margin-bottom:0}.cover h1{color:white;font-size:32px}.cover p{color:#c7d2fe}.stats{display:flex;border:1px solid #e2e8f0}.stat{flex:1;text-align:center;padding:20px;border-right:1px solid #e2e8f0}.stat:last-child{border:none}.stat strong{display:block;font-size:28px;color:#4338ca}.stat span{font-size:13px;color:#94a3b8}p{margin-bottom:14px}</style>
</head><body>
<div class="cover"><h1>${orgStats.orgName}</h1><p style="font-size:20px">Rapport d'activité ${report.year}</p><p>AG du ${new Date(report.agmDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
<div class="stats">
  <div class="stat"><strong>${orgStats.members.toLocaleString('fr-FR')}</strong><span>membres</span></div>
  <div class="stat"><strong>${orgStats.people.toLocaleString('fr-FR')}</strong><span>contacts CRM</span></div>
  <div class="stat"><strong>${orgStats.eventCount.toLocaleString('fr-FR')}</strong><span>événements</span></div>
  <div class="stat"><strong>${orgStats.surplus !== 0 ? `${orgStats.surplus >= 0 ? '+' : ''}${orgStats.surplus.toLocaleString('fr-FR')} €` : '—'}</strong><span>résultat</span></div>
</div>
${report.sections.map(s => `<h2>${s.title}</h2>${s.content.split('\n').filter(Boolean).map(p => `<p>${p}</p>`).join('')}`).join('\n')}
<hr style="margin-top:60px;border-color:#e2e8f0">
<p style="text-align:center;color:#94a3b8;font-size:12px">Généré avec AssoConnect Rapport · ${orgStats.orgName} · ${report.year}</p>
</body></html>`
    const blob = new Blob([html], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport-${orgStats.orgName.toLowerCase().replace(/\s+/g, '-')}-${report.year}.doc`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!report) return null

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #rapport-print, #rapport-print * { visibility: visible; }
          #rapport-print { position: fixed; top: 0; left: 0; width: 100%; max-width: 100%; margin: 0; padding: 0; }
        }
      `}</style>

      <Confetti active={showConfetti} />

      <div className="print:hidden space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Export 🎉</h1>
            <p className="text-slate-500 mt-1">C&apos;est prêt ! Vous pouvez être fier·e.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleWordExport} className="flex items-center gap-2 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-5 py-2.5 rounded-xl transition-colors">
              📄 Word
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95">
              🖨️ PDF
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-200">
          <div className="flex items-start gap-5">
            <span className="text-5xl">🏆</span>
            <div>
              <p className="font-black text-2xl mb-1">Vous avez fini ! Légendaire.</p>
              <p className="text-emerald-100 mb-3">Votre rapport d&apos;activité {report.year} est complet, professionnel et prêt pour l&apos;AG. Et vous l&apos;avez fait en moins de 30 minutes. 🎯</p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-white/20 text-white text-sm font-bold px-3 py-1.5 rounded-full">📄 {report.sections.length} sections</span>
                <span className="bg-white/20 text-white text-sm font-bold px-3 py-1.5 rounded-full">✍️ {report.sections.reduce((s, sec) => s + sec.content.split(/\s+/).filter(Boolean).length, 0)} mots</span>
                <span className="bg-white/20 text-white text-sm font-bold px-3 py-1.5 rounded-full">📸 {report.photos.length} photos</span>
                <span className="bg-white/20 text-white text-sm font-bold px-3 py-1.5 rounded-full">🌱 {orgStats.members.toLocaleString('fr-FR')} membres représentés</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:shadow-none print:border-0 print:rounded-none">
        <ReportPreview report={report} orgStats={orgStats} />
      </div>
    </div>
  )
}
