import { getOrganization, getStatsCrm, getEventCollects, getAccountingEntries } from '@/lib/assoconnect'
import RapportDashboardClient from './RapportDashboardClient'

export const dynamic = 'force-dynamic'

export default async function RapportPage() {
  const [org, stats, eventCollects, accountingEntries] = await Promise.all([
    getOrganization(),
    getStatsCrm(),
    getEventCollects(),
    getAccountingEntries(),
  ])

  const entries = accountingEntries['hydra:member']
  const totalRevenue = entries.filter(e => e.amount > 0).reduce((s, e) => s + e.amount, 0)
  const totalExpenses = entries.filter(e => e.amount < 0).reduce((s, e) => s + Math.abs(e.amount), 0)

  return (
    <RapportDashboardClient
      orgName={org.name}
      members={stats.inSubscription}
      people={stats.people}
      structures={stats.structures}
      eventCount={eventCollects['hydra:totalItems']}
      surplus={totalRevenue - totalExpenses}
    />
  )
}
