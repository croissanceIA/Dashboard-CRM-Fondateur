import { describe, it, expect } from 'vitest'
import { parseTaskName, parseTags, parseAmount, parseCSVDate, processCSVData } from '@/lib/dataProcessing'

describe('parseTaskName', () => {
  it('parse correctement "Nom Prénom - Nom Entreprise"', () => {
    const result = parseTaskName('John Doe - Acme Corp')
    expect(result.contactName).toBe('John Doe')
    expect(result.companyName).toBe('Acme Corp')
  })

  it('gère les noms sans séparateur', () => {
    const result = parseTaskName('John Doe')
    expect(result.contactName).toBe('John Doe')
    expect(result.companyName).toBe('N/A')
  })
})

describe('parseTags', () => {
  it('parse les tags séparés par |', () => {
    const result = parseTags('SaaS|B2B|Enterprise')
    expect(result).toEqual(['SaaS', 'B2B', 'Enterprise'])
  })

  it('gère une chaîne vide', () => {
    const result = parseTags('')
    expect(result).toEqual([])
  })
})

describe('parseAmount', () => {
  it('parse un nombre entier', () => {
    expect(parseAmount('1000')).toBe(1000)
  })

  it('retourne null pour une chaîne invalide', () => {
    expect(parseAmount('abc')).toBe(null)
  })
})

describe('parseCSVDate', () => {
  it('parse une date ISO', () => {
    const result = parseCSVDate('2024-01-15')
    expect(result).toBeInstanceOf(Date)
  })

  it('retourne null pour une chaîne vide', () => {
    expect(parseCSVDate('')).toBe(null)
  })
})
