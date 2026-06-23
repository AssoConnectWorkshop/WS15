import Link from 'next/link'

export default function RapportLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/rapport" className="flex items-center gap-2 text-green-700 hover:text-green-800">
            <span className="text-xl">🌱</span>
            <span className="font-semibold text-stone-800">Rapport d&apos;activité</span>
          </Link>
          <Link href="/" className="text-sm text-stone-500 hover:text-stone-700">
            ← Accueil
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
