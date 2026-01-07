import { Deal, RawCSVRow, Status, Priority } from './types'
import { isValidStatus, isValidPriority } from './validation'
import { parse as parseDate } from 'date-fns'

export function processCSVData(rawData: unknown[]): Deal[] {
  const deals: Deal[] = []

  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i] as Partial<RawCSVRow>

    if (!row['Task Name'] || !row['Status'] || !row['Montant Deal']) {
      continue
    }

    try {
      const deal = transformRowToDeal(row as RawCSVRow, i)
      if (deal) {
        deals.push(deal)
      }
    } catch (error) {
      console.warn(`Erreur lors du traitement de la ligne ${i + 1}:`, error)
      continue
    }
  }

  return deals
}

function transformRowToDeal(row: RawCSVRow, index: number): Deal | null {
  const { contactName, companyName } = parseTaskName(row['Task Name'])

  if (!contactName || !companyName) {
    return null
  }

  const status = normalizeStatus(row['Status'])
  if (!isValidStatus(status)) {
    return null
  }

  const amount = parseAmount(row['Montant Deal'])
  if (amount === null || amount < 0) {
    return null
  }

  const priority = normalizePriority(row['Priority'] || 'medium')

  return {
    id: `deal-${index}-${Date.now()}`,
    contactName,
    companyName,
    status,
    amount,
    dueDate: parseCSVDate(row['Due Date']),
    startDate: parseCSVDate(row['Start Date']),
    dateCreated: parseCSVDate(row['Date Created']),
    priority,
    tags: parseTags(row['Tags'] || ''),
    notes: row['Task Content'] || '',
    assignees: row['Assignees'] || ''
  }
}

export function parseTaskName(taskName: string): {
  contactName: string
  companyName: string
} {
  const parts = taskName.split(' - ')

  if (parts.length < 2) {
    return {
      contactName: taskName.trim(),
      companyName: 'N/A'
    }
  }

  return {
    contactName: parts[0].trim(),
    companyName: parts.slice(1).join(' - ').trim()
  }
}

export function parseCSVDate(dateString: string | undefined): Date | null {
  if (!dateString || dateString.trim() === '') {
    return null
  }

  const formats = [
    'yyyy-MM-dd',
    'dd/MM/yyyy',
    'MM/dd/yyyy',
    'yyyy/MM/dd',
    'dd-MM-yyyy',
    'MM-dd-yyyy'
  ]

  for (const format of formats) {
    try {
      const date = parseDate(dateString.trim(), format, new Date())
      if (!isNaN(date.getTime())) {
        return date
      }
    } catch {
      continue
    }
  }

  const nativeDate = new Date(dateString)
  if (!isNaN(nativeDate.getTime())) {
    return nativeDate
  }

  return null
}

export function parseAmount(amountString: string): number | null {
  if (!amountString) {
    return null
  }

  const cleanedString = amountString
    .toString()
    .replace(/\s/g, '')
    .replace(/€/g, '')
    .replace(/,/g, '.')

  const amount = parseFloat(cleanedString)

  if (isNaN(amount)) {
    return null
  }

  return amount
}

export function parseTags(tagsString: string): string[] {
  if (!tagsString || tagsString.trim() === '') {
    return []
  }

  return tagsString
    .split('|')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
}

function normalizeStatus(status: string): string {
  const normalized = status.toLowerCase().trim()

  const statusMap: Record<string, Status> = {
    prospect: 'prospect',
    qualifie: 'qualifié',
    qualifié: 'qualifié',
    negociation: 'négociation',
    négociation: 'négociation',
    'gagne - en cours': 'gagné - en cours',
    'gagné - en cours': 'gagné - en cours',
    'gagne': 'gagné - en cours',
    'gagné': 'gagné - en cours'
  }

  return statusMap[normalized] || normalized
}

function normalizePriority(priority: string): Priority {
  const normalized = priority.toLowerCase().trim()

  if (isValidPriority(normalized)) {
    return normalized
  }

  return 'medium'
}
