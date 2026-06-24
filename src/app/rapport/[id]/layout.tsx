import { getOrganization } from '@/lib/assoconnect'
import ReportIdLayout from './ReportIdLayoutClient'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const org = await getOrganization()
  return <ReportIdLayout orgName={org.name}>{children}</ReportIdLayout>
}
