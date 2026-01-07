import { Status, Priority } from './types'

export const VALID_STATUSES: readonly Status[] = [
  'prospect',
  'qualifié',
  'négociation',
  'gagné - en cours'
] as const

export const VALID_PRIORITIES: readonly Priority[] = ['low', 'medium', 'high'] as const

export const CSV_REQUIRED_COLUMNS = [
  'Task Name',
  'Status',
  'Montant Deal'
] as const

export const STATUS_LABELS: Record<Status, string> = {
  prospect: 'Prospect',
  qualifié: 'Qualifié',
  négociation: 'Négociation',
  'gagné - en cours': 'Gagné'
}

export const STATUS_COLORS: Record<Status, string> = {
  prospect: '#d9d9d9',
  qualifié: '#91caff',
  négociation: '#ffd666',
  'gagné - en cours': '#95de64'
}

export const MAX_FILE_SIZE_MB = 5
export const ALLOWED_FILE_TYPES = ['text/csv', 'application/vnd.ms-excel']
