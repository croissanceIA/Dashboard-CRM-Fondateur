import { create } from 'zustand'
import { Deal, KPIs } from '@/lib/types'
import { calculateKPIs } from '@/lib/kpiCalculations'

interface DealsState {
  deals: Deal[]
  kpis: KPIs | null
  searchQuery: string
  filteredDeals: Deal[]
  setDeals: (deals: Deal[]) => void
  clearDeals: () => void
  setSearchQuery: (query: string) => void
}

export const useDealsStore = create<DealsState>((set, get) => ({
  deals: [],
  kpis: null,
  searchQuery: '',
  filteredDeals: [],

  setDeals: (deals: Deal[]) => {
    const kpis = calculateKPIs(deals)
    set({ deals, kpis, filteredDeals: deals })
  },

  clearDeals: () => {
    set({ deals: [], kpis: null, searchQuery: '', filteredDeals: [] })
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query })

    const { deals } = get()

    // Si la query est vide, afficher tous les deals
    if (query.trim() === '') {
      set({ filteredDeals: deals })
      return
    }

    // Filtrage case-insensitive sur contactName, companyName, notes
    const lowerQuery = query.toLowerCase()
    const filtered = deals.filter(deal => {
      return (
        deal.contactName.toLowerCase().includes(lowerQuery) ||
        deal.companyName.toLowerCase().includes(lowerQuery) ||
        deal.notes.toLowerCase().includes(lowerQuery)
      )
    })

    set({ filteredDeals: filtered })
  }
}))
