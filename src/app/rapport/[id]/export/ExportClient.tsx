'use client'

import React, { useEffect, useState } from 'react'
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

const SECTION_ACCENTS = [
  { bg: 'bg-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  { bg: 'bg-violet-600', light: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  { bg: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  { bg: 'bg-cyan-600', light: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
]

function highlightNumbers(text: string): React.ReactNode[] {
  const parts = text.split(/(\b\d[\d\s]*(?:[,.]?\d+)*\s*(?:%|€|k€|M€)?)/g)
  return parts.map((part, i) =>
    /^\d/.test(part)
      ? <strong key={i} className="text-indigo-700 font-bold">{part}</strong>
      : part
  )
}

function ReportPreview({ report, orgStats }: { report: Report; orgStats: OrgStats }) {
  const featuredPhotos = report.photos.filter(p => p.featured)
  const surplusLabel = `${orgStats.surplus >= 0 ? '+' : ''}${orgStats.surplus.toLocaleString('fr-FR')} €`

  const keyStats = [
    {
      icon: '👥',
      value: orgStats.members.toLocaleString('fr-FR'),
      label: 'membres actifs',
      context: 'font confiance à notre association',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: '📅',
      value: orgStats.eventCount.toLocaleString('fr-FR'),
      label: 'événements',
      context: 'organisés tout au long de l\'année',
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      icon: '🙌',
      value: orgStats.people.toLocaleString('fr-FR'),
      label: 'personnes dans notre réseau',
      context: 'mobilisées autour de notre mission',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: '💰',
      value: orgStats.surplus !== 0 ? surplusLabel : '—',
      label: 'résultat financier',
      context: 'une gestion saine et transparente',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]

  return (
    <div id="rapport-print" className="bg-white text-slate-900 max-w-3xl mx-auto font-sans">

      {/* ── Couverture ── */}
      <div className="relative bg-gradient-to-br from-indigo-700 to-violet-700 text-white overflow-hidden">
        <div className="text-center px-8 pt-16 pb-10">
          <div className="text-6xl mb-5">🌱</div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">{orgStats.orgName}</h1>
          <p className="text-2xl text-indigo-200 font-light mb-1">Rapport d&apos;activité {report.year}</p>
          <p className="text-indigo-300 text-sm">Assemblée générale · {formatDate(report.agmDate)}</p>
        </div>
        {/* Vague décorative */}
        <div className="h-12 bg-white" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </div>

      {/* ── Chiffres clés contextualisés ── */}
      <div className="px-8 pb-10">
        <div className="text-center mb-8">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">L&apos;année {report.year} en chiffres</p>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Ce que nous avons accompli ensemble</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">Ces données sont extraites directement de votre compte AssoConnect — elles traduisent l&apos;impact concret de votre association.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {keyStats.map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-2xl p-6 flex flex-col`}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className={`text-5xl font-black ${stat.color} leading-none mb-1`}>{stat.value}</p>
              <p className="text-slate-700 font-bold text-sm mt-2">{stat.label}</p>
              <p className="text-slate-400 text-xs mt-0.5 italic">{stat.context}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Photos à la une ── */}
      {featuredPhotos.length > 0 && (
        <div className="px-8 pb-10 border-t border-slate-100 pt-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">L&apos;année en images</p>
          <div className={`grid gap-3 ${featuredPhotos.length === 1 ? 'grid-cols-1' : featuredPhotos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {featuredPhotos.slice(0, 3).map(photo => (
              <div key={photo.id} className="rounded-xl overflow-hidden bg-slate-100 aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.dataUrl} alt={photo.caption} className="w-full h-full object-cover" />
                {photo.caption && <p className="text-xs text-center text-slate-400 p-1.5 italic">{photo.caption}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Sections éditoriales ── */}
      {report.sections.map((section, idx) => {
        const accent = SECTION_ACCENTS[idx % SECTION_ACCENTS.length]
        const paragraphs = section.content.split('\n').filter(Boolean)
        const [firstPara, ...restParas] = paragraphs
        return (
          <div key={section.id} className="border-t border-slate-100">
            {/* En-tête de section */}
            <div className={`${accent.light} px-8 py-6 flex items-start gap-4`}>
              <div className={`${accent.bg} w-1 rounded-full self-stretch shrink-0`} />
              <div>
                <h2 className={`text-2xl font-black ${accent.text} mb-0`}>{section.title}</h2>
              </div>
            </div>
            <div className="px-8 py-6 space-y-4">
              {/* Premier paragraphe en mise en avant */}
              {firstPara && (
                <p className={`text-lg font-medium text-slate-800 leading-relaxed border-l-4 ${accent.border} pl-4 py-1`}>
                  {highlightNumbers(firstPara)}
                </p>
              )}
              {/* Paragraphes suivants */}
              <div className="space-y-3">
                {restParas.map((para, i) => (
                  <p key={i} className="text-slate-600 leading-relaxed">
                    {highlightNumbers(para)}
                  </p>
                ))}
              </div>
              <SectionPhotos sectionId={section.id} report={report} />
            </div>
          </div>
        )
      })}

      {/* ── Pied de page ── */}
      <div className="bg-gradient-to-r from-indigo-700 to-violet-700 px-8 py-6 text-center">
        <div className="inline-flex items-center gap-2 mb-1">
          <div className="bg-white text-indigo-600 text-xs font-black px-2 py-0.5 rounded">AC</div>
          <span className="text-indigo-200 text-sm font-medium">Généré avec AssoConnect Rapport</span>
        </div>
        <p className="text-indigo-300 text-xs">{orgStats.orgName} · Rapport d&apos;activité {report.year} · {new Date().toLocaleDateString('fr-FR')}</p>
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
          #rapport-print { position: absolute; top: 0; left: 0; width: 100%; max-width: 100%; margin: 0; padding: 0; }
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
