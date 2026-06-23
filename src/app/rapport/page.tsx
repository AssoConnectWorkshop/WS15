'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getReports, deleteReport, Report, STATUS_LABELS } from '@/lib/report-store'
import { DEMO_ASSOCIATION } from '@/lib/mock-data'

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

export default function RapportDashboard() {
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    setReports(getReports().sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  }, [])

  function handleDelete(id: string) {
    if (confirm('Supprimer ce rapport ?')) {
      deleteReport(id)
      setReports(getReports())
    }
  }

  const data = DEMO_ASSOCIATION
  const totalParticipants = data.events.reduce((s, e) => s + e.participants, 0)

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-indigo-600 rounded-3xl p-8 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 text-[200px] leading-none opacity-10 select-none">🌱</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-lg">AssoConnect</div>
            <span className="text-indigo-200 text-sm">Rapport d&apos;activité</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Bonjour 👋</h1>
          <p className="text-indigo-200 text-lg mb-6 max-w-lg">
            Votre rapport annuel, prêt en 30 minutes. Sans page blanche. Sans galère. Avec des données réelles et l&apos;IA.
          </p>
          <Link href="/rapport/nouveau" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg">
            <span>✨</span> Créer un nouveau rapport
          </Link>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Membres', value: data.members.current, icon: '👥', sub: `+${data.members.current - data.members.previous} cette année` },
          { label: 'Bénévoles', value: data.volunteers.total, icon: '🙌', sub: `${data.volunteers.active} très actifs` },
          { label: 'Événements', value: data.events.length, icon: '📅', sub: `${totalParticipants} participants` },
          { label: 'Résultat', value: `+${data.finance.surplus.toLocaleString('fr-FR')} €`, icon: '💰', sub: 'excédent 2025' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Reports list */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Mes rapports</h2>

        {reports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-14 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-slate-700 font-bold text-lg mb-2">Aucun rapport pour le moment</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">Créez votre premier rapport et découvrez la magie 🪄</p>
            <Link href="/rapport/nouveau" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors inline-block">
              C&apos;est parti ! →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map(report => (
              <div key={report.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-xl font-bold text-indigo-600 border border-indigo-100">
                    {report.year}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{data.name} — {report.year}</p>
                    <p className="text-sm text-slate-400">Créé le {formatDate(report.createdAt)} · AG le {formatDate(report.agmDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${STATUS_COLORS[report.status]}`}>
                    {STATUS_LABELS[report.status]}
                  </span>
                  <Link href={`/rapport/${report.id}/${STATUS_PATHS[report.status]}`} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                    Continuer →
                  </Link>
                  <button onClick={() => handleDelete(report.id)} className="text-slate-300 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Supprimer">🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feature teaser */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: '📊', title: 'Données automatiques', desc: 'Membres, finances, événements… déjà là depuis AssoConnect.' },
          { icon: '🤖', title: 'IA à votre service', desc: 'L\'IA rédige, vous validez. Jamais l\'inverse.' },
          { icon: '📸', title: 'Photos incluses', desc: 'Importez depuis votre site ou votre téléphone.' },
        ].map(f => (
          <div key={f.title} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="text-3xl mb-3">{f.icon}</div>
            <p className="font-semibold text-slate-800 mb-1">{f.title}</p>
            <p className="text-sm text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
