export type Status = 'prospect' | 'qualifié' | 'négociation' | 'gagné - en cours'
export type Priority = 'low' | 'medium' | 'high'

export interface Deal {
  id: string
  contactName: string
  companyName: string
  status: Status
  amount: number
  dueDate: Date | null
  startDate: Date | null
  dateCreated: Date | null
  priority: Priority
  tags: string[]
  notes: string
  assignees: string
}

export interface KPIs {
  totalDeals: number
  pipelineBrut: number
  panierMoyen: number
}

export interface RawCSVRow {
  'Task Name': string
  'Status': string
  'Date Created': string
  'Due Date': string
  'Start Date': string
  'Assignees': string
  'Priority': string
  'Tags': string
  'Task Content': string
  'Montant Deal': string
}
