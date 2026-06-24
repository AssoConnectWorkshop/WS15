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
  const totalRevenue = entries
    .filter(e => e.type === 'CREDIT' && e.account.type === 'INCOME')
    .reduce((s, e) => s + Number(e.amount), 0)
  const totalExpenses = entries
    .filter(e => e.type === 'DEBIT' && e.account.type === 'EXPENSE')
    .reduce((s, e) => s + Number(e.amount), 0)

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
