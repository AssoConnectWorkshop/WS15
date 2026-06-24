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

const STORAGE_KEY = 'ws4_activity_reports'

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

export type StepCompletion = {
  data_review: boolean
  interview: boolean
  contributors: boolean
  photos: boolean
  generation: boolean
  editing: boolean
  export: boolean
}

export function getStepCompletion(report: Report): StepCompletion {
  const interviewAnswered = Object.values(report.interview).filter(v => v?.trim()).length
  const contributorsComplete = Object.values(report.contributorStatuses).filter(s => s === 'complete').length
  return {
    data_review: true,
    interview: interviewAnswered >= 4,
    contributors: contributorsComplete >= 1,
    photos: report.photos.length > 0,
    generation: report.sections.length > 0,
    editing: report.sections.length > 0,
    export: report.sections.length > 0,
  }
}

export const STATUS_LABELS: Record<ReportStatus, string> = {
  data_review: 'Données',
  interview: 'Entretien',
  contributors: 'Contributeurs',
  photos: 'Photos',
  generation: 'Génération',
  editing: 'Édition',
  export: 'Export',
}

export const STATUS_ORDER: ReportStatus[] = [
  'data_review', 'interview', 'contributors', 'photos', 'generation', 'editing', 'export'
]
