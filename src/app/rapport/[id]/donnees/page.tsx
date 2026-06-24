import { getStatsCrm, getContacts } from '@/lib/assoconnect'
import DonneesClient from './DonneesClient'

export const dynamic = 'force-dynamic'

export default async function DonneesPage() {
  const [stats, contacts] = await Promise.all([
    getStatsCrm(),
    getContacts(),
  ])

  return <DonneesClient stats={stats} contacts={contacts} />
}
