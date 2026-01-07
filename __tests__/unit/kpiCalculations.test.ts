import { describe, it, expect } from 'vitest'
import { calculateKPIs, formatCurrency, formatCurrencyWithDecimals } from '@/lib/kpiCalculations'
import { Deal } from '@/lib/types'

describe('calculateKPIs', () => {
  const mockDeal = (amount: number): Deal => ({
    id: `deal-${Math.random()}`,
    contactName: 'John Doe',
    companyName: 'Acme Corp',
    status: 'prospect',
    amount,
    dueDate: null,
    startDate: null,
    dateCreated: null,
    priority: 'medium',
    tags: [],
    notes: '',
    assignees: ''
  })

  it('calcule correctement le pipeline brut', () => {
    const deals: Deal[] = [
      mockDeal(1000),
      mockDeal(2000),
      mockDeal(3000)
    ]

    const kpis = calculateKPIs(deals)
    expect(kpis.pipelineBrut).toBe(6000)
  })

  it('calcule correctement le panier moyen', () => {
    const deals: Deal[] = [
      mockDeal(1000),
      mockDeal(2000),
      mockDeal(3000)
    ]

    const kpis = calculateKPIs(deals)
    expect(kpis.panierMoyen).toBe(2000)
  })

  it('calcule correctement le nombre total de deals', () => {
    const deals: Deal[] = [
      mockDeal(1000),
      mockDeal(2000)
    ]

    const kpis = calculateKPIs(deals)
    expect(kpis.totalDeals).toBe(2)
  })

  it('gère un tableau vide (division par zéro)', () => {
    const kpis = calculateKPIs([])
    expect(kpis.totalDeals).toBe(0)
    expect(kpis.pipelineBrut).toBe(0)
    expect(kpis.panierMoyen).toBe(0)
  })

  it('arrondit les valeurs à 2 décimales', () => {
    const deals: Deal[] = [
      mockDeal(1000.123),
      mockDeal(2000.456)
    ]

    const kpis = calculateKPIs(deals)
    expect(kpis.pipelineBrut).toBe(3000.58)
    expect(kpis.panierMoyen).toBe(1500.29)
  })
})

describe('formatCurrency', () => {
  it('formate un montant en euros sans décimales', () => {
    const result = formatCurrency(1234.56)
    expect(result).toContain('1')
    expect(result).toContain('235')
    expect(result).toContain('€')
  })

  it('gère les grands nombres', () => {
    const result = formatCurrency(1234567)
    expect(result).toContain('1')
    expect(result).toContain('234')
    expect(result).toContain('567')
  })

  it('gère zéro', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
    expect(result).toContain('€')
  })
})

describe('formatCurrencyWithDecimals', () => {
  it('formate un montant en euros avec décimales', () => {
    const result = formatCurrencyWithDecimals(1234.56)
    expect(result).toContain('1')
    expect(result).toContain('234')
    expect(result).toContain('56')
    expect(result).toContain('€')
  })

  it('ajoute des décimales .00 pour les nombres entiers', () => {
    const result = formatCurrencyWithDecimals(1000)
    expect(result).toContain('1')
    expect(result).toContain('000')
    expect(result).toContain('00')
  })
})
