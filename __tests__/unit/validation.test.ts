import { describe, it, expect } from 'vitest'
import { validateCSVData, isValidStatus, isValidPriority } from '@/lib/validation'

describe('validateCSVData', () => {
  it('valide des données CSV correctes', () => {
    const data = [
      {
        'Task Name': 'John Doe - Acme Corp',
        'Status': 'prospect',
        'Montant Deal': '1000'
      }
    ]

    const result = validateCSVData(data)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejette un tableau vide', () => {
    const result = validateCSVData([])
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Le fichier CSV est vide')
  })
})

describe('isValidStatus', () => {
  it('valide un statut correct', () => {
    expect(isValidStatus('prospect')).toBe(true)
    expect(isValidStatus('qualifié')).toBe(true)
  })

  it('rejette un statut invalide', () => {
    expect(isValidStatus('invalid')).toBe(false)
  })
})

describe('isValidPriority', () => {
  it('valide une priorité correcte', () => {
    expect(isValidPriority('low')).toBe(true)
    expect(isValidPriority('medium')).toBe(true)
  })

  it('rejette une priorité invalide', () => {
    expect(isValidPriority('invalid')).toBe(false)
  })
})
