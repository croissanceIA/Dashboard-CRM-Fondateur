import { Deal, KPIs } from './types'

/**
 * Calcule les KPIs pour le MVP (Phase 1)
 */
export function calculateKPIs(deals: Deal[]): KPIs {
  if (!deals || deals.length === 0) {
    return {
      totalDeals: 0,
      pipelineBrut: 0,
      panierMoyen: 0
    }
  }

  const totalDeals = deals.length

  const pipelineBrut = deals.reduce((sum, deal) => sum + deal.amount, 0)

  const panierMoyen = totalDeals > 0 ? pipelineBrut / totalDeals : 0

  return {
    totalDeals,
    pipelineBrut: Math.round(pipelineBrut * 100) / 100,
    panierMoyen: Math.round(panierMoyen * 100) / 100
  }
}

/**
 * Formate un montant en euros
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Formate un montant en euros avec décimales
 */
export function formatCurrencyWithDecimals(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}
