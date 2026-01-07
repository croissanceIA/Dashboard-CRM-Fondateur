import { create } from 'zustand'
import { Deal, KPIs } from '@/lib/types'
import { calculateKPIs } from '@/lib/kpiCalculations'

interface DealsState {
  deals: Deal[]
  kpis: KPIs | null
  setDeals: (deals: Deal[]) => void
  clearDeals: () => void
}

export const useDealsStore = create<DealsState>((set) => ({
  deals: [],
  kpis: null,

  setDeals: (deals: Deal[]) => {
    const kpis = calculateKPIs(deals)
    set({ deals, kpis })
  },

  clearDeals: () => {
    set({ deals: [], kpis: null })
  }
}))
