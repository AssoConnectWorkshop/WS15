'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getReports, deleteReport, Report, STATUS_LABELS } from '@/lib/report-store'
import { DEMO_ASSOCIATION } from '@/lib/mock-data'

const STATUS_COLORS: Record<string, string> = {
  data_review: 'bg-blue-100 text-blue-700',
  interview: 'bg-purple-100 text-purple-700',
  contributors: 'bg-yellow-100 text-yellow-700',
  photos: 'bg-orange-100 text-orange-700',
  generation: 'bg-amber-100 text-amber-700',
  editing: 'bg-green-100 text-green-700',
  export: 'bg-emerald-100 text-emerald-700',
}

const STATUS_PATHS: Record<string, string> = {
  data_review: 'donnees',
  interview: 'interview',
  contributors: 'contributeurs',
  photos: 'photos',
  generation: 'generateur',
  editing: 'editeur',
  export: 'export',
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

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🌱</span>
            <div>
              <p className="text-sm text-stone-500 font-medium">{DEMO_ASSOCIATION.name}</p>
              <h1 className="text-2xl font-bold text-stone-900">Rapport d&apos;activité annuel</h1>
            </div>
          </div>
          <p className="text-stone-600 max-w-lg">
            Générez un rapport d&apos;activité complet et engageant en moins de 30 minutes, à partir de vos données et de l&apos;intelligence artificielle.
          </p>
        </div>
        <Link
          href="/rapport/nouveau"
          className="shrink-0 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
        >
          <span>+</span>
          Créer un rapport
        </Link>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Membres', value: DEMO_ASSOCIATION.members.current, unit: '', sub: `+${DEMO_ASSOCIATION.members.current - DEMO_ASSOCIATION.members.previous} vs 2024` },
          { label: 'Bénévoles', value: DEMO_ASSOCIATION.volunteers.total, unit: '', sub: `${DEMO_ASSOCIATION.volunteers.active} actifs` },
          { label: 'Événements', value: DEMO_ASSOCIATION.events.length, unit: '', sub: `${DEMO_ASSOCIATION.events.reduce((s, e) => s + e.participants, 0)} participants` },
          { label: 'Résultat', value: DEMO_ASSOCIATION.finance.surplus.toLocaleString('fr-FR'), unit: '€', sub: 'excédent annuel' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-stone-200 p-4">
            <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">{stat.label}</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">{stat.value}<span className="text-lg">{stat.unit}</span></p>
            <p className="text-xs text-stone-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Reports list */}
      <div>
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Mes rapports</h2>
        {reports.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-stone-300 p-12 text-center">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-stone-700 font-semibold mb-2">Aucun rapport pour le moment</h3>
            <p className="text-stone-500 text-sm mb-6">Créez votre premier rapport d&apos;activité annuel</p>
            <Link href="/rapport/nouveau" className="bg-green-700 hover:bg-green-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors inline-block">
              Créer mon premier rapport
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map(report => (
              <div key={report.id} className="bg-white rounded-xl border border-stone-200 p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-xl font-bold text-green-700">
                    {report.year}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">Rapport {report.year}</p>
                    <p className="text-sm text-stone-500">Créé le {formatDate(report.createdAt)} · AG le {formatDate(report.agmDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[report.status]}`}>
                    {STATUS_LABELS[report.status]}
                  </span>
                  <Link
                    href={`/rapport/${report.id}/${STATUS_PATHS[report.status]}`}
                    className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Continuer →
                  </Link>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="text-stone-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                    title="Supprimer"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
