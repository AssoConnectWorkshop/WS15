'use client'

export type InterviewAnswers = Record<string, string>
export type ContributorStatus = 'pending' | 'in_progress' | 'complete'

export type Photo = {
  id: string
  dataUrl: string
  caption: string
  section: string
  featured: boolean
}

export type ReportSection = {
  id: string
  title: string
  content: string
}

export type ReportStatus = 'data_review' | 'interview' | 'contributors' | 'photos' | 'generation' | 'editing' | 'export'

export type Report = {
  id: string
  year: number
  agmDate: string
  status: ReportStatus
  interview: InterviewAnswers
  contributorStatuses: Record<string, ContributorStatus>
  contributorNotes: Record<string, string>
  photos: Photo[]
  sections: ReportSection[]
  generatedAt?: string
  createdAt: string
}

const STORAGE_KEY = 'ws15_activity_reports'

export function getReports(): Report[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function getReport(id: string): Report | null {
  return getReports().find(r => r.id === id) ?? null
}

export function saveReport(report: Report): void {
  const reports = getReports().filter(r => r.id !== report.id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...reports, report]))
}

export function createReport(year: number, agmDate: string): Report {
  const report: Report = {
    id: crypto.randomUUID(),
    year,
    agmDate,
    status: 'data_review',
    interview: {},
    contributorStatuses: { jardinage: 'pending', ateliers: 'pending', communication: 'pending', benevoles: 'pending' },
    contributorNotes: {},
    photos: [],
    sections: [],
    createdAt: new Date().toISOString(),
  }
  saveReport(report)
  return report
}

export function updateReport(id: string, updates: Partial<Report>): Report | null {
  const report = getReport(id)
  if (!report) return null
  const updated = { ...report, ...updates }
  saveReport(updated)
  return updated
}

export function deleteReport(id: string): void {
  const reports = getReports().filter(r => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
}

export const STATUS_LABELS: Record<ReportStatus, string> = {
  data_review: 'Révision des données',
  interview: 'Entretien guidé',
  contributors: 'Contributeurs',
  photos: 'Photos',
  generation: 'Génération IA',
  editing: 'Édition',
  export: 'Export',
}

export const STATUS_ORDER: ReportStatus[] = [
  'data_review', 'interview', 'contributors', 'photos', 'generation', 'editing', 'export'
]

export function getNextStatus(status: ReportStatus): ReportStatus | null {
  const idx = STATUS_ORDER.indexOf(status)
  return idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null
}
