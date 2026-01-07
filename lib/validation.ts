import { CSV_REQUIRED_COLUMNS, VALID_STATUSES, VALID_PRIORITIES } from './constants'
import { Status, Priority } from './types'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateCSVData(data: unknown[]): ValidationResult {
  const errors: string[] = []

  if (!Array.isArray(data)) {
    errors.push('Les données ne sont pas au format tableau')
    return { valid: false, errors }
  }

  if (data.length === 0) {
    errors.push('Le fichier CSV est vide')
    return { valid: false, errors }
  }

  const firstRow = data[0] as Record<string, unknown>

  CSV_REQUIRED_COLUMNS.forEach((column) => {
    if (!(column in firstRow)) {
      errors.push(`Colonne requise manquante : ${column}`)
    }
  })

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  let validRowsCount = 0

  for (let i = 0; i < data.length; i++) {
    const row = data[i] as Record<string, unknown>

    if (!row['Task Name'] || typeof row['Task Name'] !== 'string') {
      continue
    }

    if (!row['Status'] || typeof row['Status'] !== 'string') {
      continue
    }

    if (!row['Montant Deal']) {
      continue
    }

    validRowsCount++
  }

  if (validRowsCount === 0) {
    errors.push('Aucune ligne valide trouvée dans le CSV')
    return { valid: false, errors }
  }

  return { valid: true, errors: [] }
}

export function isValidStatus(status: string): status is Status {
  return VALID_STATUSES.includes(status as Status)
}

export function isValidPriority(priority: string): priority is Priority {
  return VALID_PRIORITIES.includes(priority as Priority)
}
