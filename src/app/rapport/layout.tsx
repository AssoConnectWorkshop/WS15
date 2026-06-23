import Link from 'next/link'

export default function RapportLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/rapport" className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">AC</div>
            <span className="font-semibold text-slate-800">Rapport d&apos;activité</span>
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← Accueil
          </Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
