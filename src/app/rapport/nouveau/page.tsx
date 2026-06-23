'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createReport } from '@/lib/report-store'
import { DEMO_ASSOCIATION } from '@/lib/mock-data'

export default function NouveauRapport() {
  const router = useRouter()
  const [year, setYear] = useState(DEMO_ASSOCIATION.year)
  const [agmDate, setAgmDate] = useState('2026-01-24')

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const report = createReport(year, agmDate)
    router.push(`/rapport/${report.id}/donnees`)
  }

  const currentYear = new Date().getFullYear()
  const years = [currentYear - 1, currentYear, currentYear + 1]

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <Link href="/rapport" className="text-sm text-stone-500 hover:text-stone-700 flex items-center gap-1 mb-4">
          ← Retour
        </Link>
        <h1 className="text-2xl font-bold text-stone-900">Nouveau rapport d&apos;activité</h1>
        <p className="text-stone-600 mt-1">Renseignez les informations de base pour démarrer.</p>
      </div>

      <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Association</label>
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span className="text-2xl">🌱</span>
            <span className="font-medium text-stone-800">{DEMO_ASSOCIATION.name}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Année du rapport</label>
          <div className="flex gap-3">
            {years.map(y => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                className={`flex-1 py-3 rounded-lg border font-semibold transition-colors text-lg
                  ${year === y
                    ? 'bg-green-700 border-green-700 text-white'
                    : 'bg-white border-stone-300 text-stone-700 hover:border-green-400'
                  }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="agmDate" className="block text-sm font-medium text-stone-700 mb-1">
            Date de l&apos;Assemblée Générale
          </label>
          <input
            id="agmDate"
            type="date"
            value={agmDate}
            onChange={e => setAgmDate(e.target.value)}
            required
            className="w-full border border-stone-300 rounded-lg px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-stone-500 mt-1">Le rapport sera présenté lors de cette assemblée</p>
        </div>

        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-xl transition-colors text-lg"
        >
          Créer le rapport →
        </button>
      </form>
    </div>
  )
}
