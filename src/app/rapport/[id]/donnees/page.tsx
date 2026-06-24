import { getOrganization, getStatsCrm, getContacts, getEventCollects, getAccountingEntries } from '@/lib/assoconnect'
import DonneesClient from './DonneesClient'

export const dynamic = 'force-dynamic'

export default async function DonneesPage() {
  const [org, stats, contacts, eventCollects, accountingEntries] = await Promise.all([
    getOrganization(),
    getStatsCrm(),
    getContacts(),
    getEventCollects(),
    getAccountingEntries(),
  ])

  return (
    <DonneesClient
      org={org}
      stats={stats}
      contacts={contacts}
      eventCollects={eventCollects}
      accountingEntries={accountingEntries}
    />
  )
}
