'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getReports, deleteReport, Report, STATUS_LABELS, getStepCompletion } from '@/lib/report-store'

const STATUS_COLORS: Record<string, string> = {
  data_review: 'bg-blue-50 text-blue-600 border-blue-100',
  interview: 'bg-violet-50 text-violet-600 border-violet-100',
  contributors: 'bg-amber-50 text-amber-600 border-amber-100',
  photos: 'bg-orange-50 text-orange-600 border-orange-100',
  generation: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  editing: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  export: 'bg-green-50 text-green-600 border-green-100',
}

const STATUS_PATHS: Record<string, string> = {
  data_review: 'donnees', interview: 'interview', contributors: 'contributeurs',
  photos: 'photos', generation: 'generateur', editing: 'editeur', export: 'export',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const HERO_WORDS = ["page blanche", "nuit blanche", "galère", "corvée"]

type Props = {
  orgName: string
  members: number
  people: number
  structures: number
  eventCount: number
  surplus: number
}

function ReportCard({ report, orgName, onDelete }: { report: Report; orgName: string; onDelete: () => void }) {
  const completion = getStepCompletion(report)
  const completedCount = Object.values(completion).filter(Boolean).length
  const progress = Math.round((completedCount / 7) * 100)
  const isDone = report.status === 'export'

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-13 h-13 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center text-xl font-black text-indigo-700 border border-indigo-100 p-3">
          {report.year}
        </div>
        <div>
          <p className="font-black text-slate-800">{orgName} — {report.year}</p>
          <p className="text-sm text-slate-400">Créé le {formatDate(report.createdAt)} · AG le {formatDate(report.agmDate)}</p>
          {!isDone && (
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-24 bg-slate-100 rounded-full h-1.5">
                <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-slate-400">{progress}%</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${STATUS_COLORS[report.status]}`}>
          {STATUS_LABELS[report.status]}
        </span>
        <Link href={`/rapport/${report.id}/${STATUS_PATHS[report.status]}`} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-black px-4 py-2 rounded-xl transition-all hover:scale-105 shadow-md shadow-indigo-200">
          {isDone ? 'Voir →' : 'Continuer →'}
        </Link>
        <button onClick={onDelete} className="text-slate-200 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Supprimer">🗑</button>
      </div>
    </div>
  )
}

function ExampleReport() {
  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-indigo-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-indigo-700">✨ Exemple de rapport terminé</span>
          <span className="text-xs bg-indigo-100 text-indigo-500 rounded-full px-2 py-0.5">Démo</span>
        </div>
        <span className="text-xs text-slate-400">Voici à quoi ressemble le résultat final</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="bg-gradient-to-br from-indigo-700 to-violet-700 rounded-xl p-5 text-white text-center">
          <div className="text-3xl mb-2">🌱</div>
          <h3 className="font-black text-lg">Les Amis du Jardin Partagé</h3>
          <p className="text-indigo-200 text-sm">Rapport d&apos;activité 2025</p>
          <p className="text-indigo-300 text-xs mt-1">Assemblée générale · 15 mars 2026</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Membres', value: '153', icon: '👥' },
            { label: 'Bénévoles', value: '28', icon: '🙌' },
            { label: 'Événements', value: '12', icon: '📅' },
            { label: 'Excédent', value: '+2 300 €', icon: '💰' },
          ].map(s => (
            <div key={s.label} className="text-center bg-slate-50 rounded-xl p-2.5">
              <div className="text-base">{s.icon}</div>
              <p className="text-sm font-black text-indigo-700">{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {['🌱 Notre engagement solidaire', '📅 Événements phares de l\'année', '💰 Bilan financier 2025'].map(s => (
            <div key={s} className="bg-slate-50 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 flex items-center gap-2">
              {s}
              <span className="ml-auto text-emerald-400 text-xs">✓ Rédigé par l&apos;IA</span>
            </div>
          ))}
          <div className="text-xs text-center text-slate-300 py-1">+ 5 autres sections…</div>
        </div>
      </div>
    </div>
  )
}

export default function RapportDashboardClient({ orgName, members, people, structures, eventCount, surplus }: Props) {
  const [reports, setReports] = useState<Report[]>([])
  const [wordIdx, setWordIdx] = useState(0)

  useEffect(() => {
    setReports(getReports().sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
    const interval = setInterval(() => setWordIdx(i => (i + 1) % HERO_WORDS.length), 2000)
    return () => clearInterval(interval)
  }, [])

  const inProgress = reports.filter(r => r.status !== 'export')
  const done = reports.filter(r => r.status === 'export')

  function handleDelete(id: string) {
    if (confirm('Supprimer ce rapport ?')) {
      deleteReport(id)
      setReports(getReports())
    }
  }

  const surplusLabel = surplus !== 0
    ? `${surplus >= 0 ? '+' : ''}${surplus.toLocaleString('fr-FR')} €`
    : '—'

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-8 text-white overflow-hidden relative">
        <div className="absolute -top-10 -right-10 text-[220px] leading-none opacity-5 select-none pointer-events-none">🌱</div>
        <div className="absolute bottom-0 right-0 text-[100px] leading-none opacity-10 select-none pointer-events-none">✨</div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-xl px-3 py-1.5 mb-5">
            <div className="bg-white text-indigo-600 text-xs font-black px-2 py-0.5 rounded-lg">AC</div>
            <span className="text-indigo-200 text-sm font-medium">AssoConnect · Rapport d&apos;activité</span>
          </div>
          <h1 className="text-3xl font-black mb-3 leading-tight">
            Fini la{' '}
            <span className="bg-white/20 px-2 py-0.5 rounded-xl transition-all duration-300">
              {HERO_WORDS[wordIdx]}
            </span>
            . 🎉
          </h1>
          <p className="text-indigo-200 text-lg mb-6 max-w-lg">
            Votre rapport annuel, prêt en 30 minutes. Données AssoConnect + IA + votre vécu = chef-d&apos;œuvre garanti.
          </p>
          <Link href="/rapport/nouveau" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-black px-6 py-3 rounded-2xl hover:bg-indigo-50 transition-all shadow-xl hover:scale-105 active:scale-95">
            <span>✨</span> Créer un rapport maintenant
          </Link>
        </div>
      </div>

      {/* Value prop + stats */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-6 space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1 rounded-full mb-3">
            <span>⚡</span> Vos données AssoConnect, en direct
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-1">Ces données s&apos;intègrent directement dans votre rapport</h2>
          <p className="text-slate-500 text-sm">Tout ce que vous voyez ci-dessous sera automatiquement cité et mis en forme dans les bonnes sections du rapport — zéro ressaisie.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Membres actifs', value: members.toLocaleString('fr-FR'), icon: '👥', section: 'Section Membres', color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-400' },
            { label: 'Contacts CRM', value: people.toLocaleString('fr-FR'), icon: '🙌', section: 'Section Membres', color: 'bg-violet-100 text-violet-700', dot: 'bg-violet-400' },
            { label: 'Événements', value: eventCount.toLocaleString('fr-FR'), icon: '📅', section: 'Section Activités', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
            { label: 'Résultat', value: surplusLabel, icon: '💰', section: 'Section Finances', color: surplus >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700', dot: surplus >= 0 ? 'bg-emerald-400' : 'bg-red-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-1">
              <span className="text-xl">{stat.icon}</span>
              <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${stat.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`} />
                {stat.section}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reports */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-800">Mes rapports</h2>
          <Link href="/rapport/nouveau" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-black px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-md shadow-indigo-200">
            + Nouveau rapport
          </Link>
        </div>

        {reports.length === 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-slate-800 font-black text-xl mb-2">Aucun rapport… pour l&apos;instant !</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-xs">Créez votre premier rapport et découvrez à quel point c&apos;est simple 😍</p>
              <Link href="/rapport/nouveau" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 inline-block hover:scale-105">
                Allons-y ! 🎯
              </Link>
            </div>
            <ExampleReport />
          </div>
        ) : (
          <>
            {inProgress.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" /> En cours ({inProgress.length})
                </h3>
                <div className="space-y-3">
                  {inProgress.map(report => (
                    <ReportCard key={report.id} report={report} orgName={orgName} onDelete={() => handleDelete(report.id)} />
                  ))}
                </div>
              </div>
            )}

            {done.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" /> Finalisés ({done.length})
                </h3>
                <div className="space-y-3">
                  {done.map(report => (
                    <ReportCard key={report.id} report={report} orgName={orgName} onDelete={() => handleDelete(report.id)} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Why it's great */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: '⚡', title: '30 minutes, pas plus', desc: 'On a chronométré. Vraiment.', color: 'from-amber-50 to-orange-50 border-amber-100' },
          { icon: '🤖', title: 'L\'IA fait le boulot', desc: 'Vous validez. Elle rédige. Pas l\'inverse.', color: 'from-indigo-50 to-violet-50 border-indigo-100' },
          { icon: '🏆', title: 'Rapport pro garanti', desc: 'Vos membres vont être impressionnés.', color: 'from-emerald-50 to-green-50 border-emerald-100' },
        ].map(f => (
          <div key={f.title} className={`bg-gradient-to-br ${f.color} rounded-2xl border p-5`}>
            <div className="text-4xl mb-3">{f.icon}</div>
            <p className="font-black text-slate-800 mb-1">{f.title}</p>
            <p className="text-sm text-slate-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
