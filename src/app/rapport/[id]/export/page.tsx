import { getOrganization, getStatsCrm, getEventCollects, getAccountingEntries } from '@/lib/assoconnect'
import ExportClient from './ExportClient'

export const dynamic = 'force-dynamic'

export default async function ExportPage() {
  const [org, stats, eventCollects, accountingEntries] = await Promise.all([
    getOrganization(),
    getStatsCrm(),
    getEventCollects(),
    getAccountingEntries(),
  ])

  const entries = accountingEntries['hydra:member']
  const totalRevenue = entries
    .filter(e => e.type === 'CREDIT' && e.account.accountNumber >= 700000 && e.account.accountNumber < 800000)
    .reduce((s, e) => s + Number(e.amount), 0)
  const totalExpenses = entries
    .filter(e => e.type === 'DEBIT' && e.account.accountNumber >= 600000 && e.account.accountNumber < 700000)
    .reduce((s, e) => s + Number(e.amount), 0)

  return (
    <ExportClient
      orgStats={{
        orgName: org.name,
        members: stats.inSubscription,
        people: stats.people,
        eventCount: eventCollects['hydra:totalItems'],
        surplus: totalRevenue - totalExpenses,
      }}
    />
  )
}
