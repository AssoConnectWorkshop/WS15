import { getStatsCrm, getContacts } from '@/lib/assoconnect'
import DonneesClient from './DonneesClient'

export const dynamic = 'force-dynamic'

export default async function DonneesPage() {
  const [stats, contacts] = await Promise.all([
    getStatsCrm(),
    getContacts(),
  ])

  return (
    <>
      <p className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded mb-2">
        🔌 API live — {contacts['hydra:totalItems']} contacts · {stats.people} personnes
      </p>
      <DonneesClient stats={stats} contacts={contacts} />
    </>
  )
}
