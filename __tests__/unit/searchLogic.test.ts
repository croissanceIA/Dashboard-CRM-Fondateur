import { describe, it, expect, beforeEach } from 'vitest'
import { useDealsStore } from '@/store/dealsStore'
import { Deal } from '@/lib/types'

// Mock deals pour les tests
const mockDeals: Deal[] = [
  {
    id: '1',
    contactName: 'Jean Dupont',
    companyName: 'Acme Corp',
    status: 'prospect',
    amount: 10000,
    dueDate: new Date('2026-02-01'),
    startDate: new Date('2026-01-01'),
    dateCreated: new Date('2026-01-01'),
    priority: 'high',
    tags: ['SaaS', 'B2B'],
    notes: 'Client potentiel pour notre solution cloud',
    assignees: 'Alice'
  },
  {
    id: '2',
    contactName: 'Marie Martin',
    companyName: 'TechStart SAS',
    status: 'qualifié',
    amount: 25000,
    dueDate: new Date('2026-03-15'),
    startDate: new Date('2026-01-10'),
    dateCreated: new Date('2026-01-10'),
    priority: 'medium',
    tags: ['Startup', 'Tech'],
    notes: 'Entreprise innovante dans le domaine de la fintech',
    assignees: 'Bob'
  },
  {
    id: '3',
    contactName: 'Pierre Durand',
    companyName: 'Global Solutions Inc',
    status: 'négociation',
    amount: 50000,
    dueDate: new Date('2026-01-20'),
    startDate: new Date('2026-01-05'),
    dateCreated: new Date('2026-01-05'),
    priority: 'high',
    tags: ['Enterprise', 'B2B'],
    notes: 'Deal stratégique pour expansion européenne',
    assignees: 'Charlie'
  }
]

describe('Search Logic - Zustand Store', () => {
  beforeEach(() => {
    // Réinitialiser le store avant chaque test
    const { clearDeals } = useDealsStore.getState()
    clearDeals()
  })

  describe('setSearchQuery', () => {
    it('should filter deals by contactName (case-insensitive)', () => {
      const { setDeals, setSearchQuery } = useDealsStore.getState()

      setDeals(mockDeals)
      setSearchQuery('jean')

      const { filteredDeals } = useDealsStore.getState()
      expect(filteredDeals).toHaveLength(1)
      expect(filteredDeals[0].contactName).toBe('Jean Dupont')
    })

    it('should filter deals by companyName (case-insensitive)', () => {
      const { setDeals, setSearchQuery } = useDealsStore.getState()

      setDeals(mockDeals)
      setSearchQuery('techstart')

      const { filteredDeals } = useDealsStore.getState()
      expect(filteredDeals).toHaveLength(1)
      expect(filteredDeals[0].companyName).toBe('TechStart SAS')
    })

    it('should filter deals by notes (case-insensitive)', () => {
      const { setDeals, setSearchQuery } = useDealsStore.getState()

      setDeals(mockDeals)
      setSearchQuery('fintech')

      const { filteredDeals } = useDealsStore.getState()
      expect(filteredDeals).toHaveLength(1)
      expect(filteredDeals[0].id).toBe('2')
    })

    it('should be case-insensitive', () => {
      const { setDeals, setSearchQuery } = useDealsStore.getState()

      setDeals(mockDeals)

      // Test majuscules
      setSearchQuery('JEAN')
      expect(useDealsStore.getState().filteredDeals).toHaveLength(1)

      // Test minuscules
      setSearchQuery('jean')
      expect(useDealsStore.getState().filteredDeals).toHaveLength(1)

      // Test mixte
      setSearchQuery('JeAn')
      expect(useDealsStore.getState().filteredDeals).toHaveLength(1)
    })

    it('should return all deals when query is empty', () => {
      const { setDeals, setSearchQuery } = useDealsStore.getState()

      setDeals(mockDeals)
      setSearchQuery('')

      const { filteredDeals } = useDealsStore.getState()
      expect(filteredDeals).toHaveLength(3)
      expect(filteredDeals).toEqual(mockDeals)
    })

    it('should return all deals when query contains only whitespace', () => {
      const { setDeals, setSearchQuery } = useDealsStore.getState()

      setDeals(mockDeals)
      setSearchQuery('   ')

      const { filteredDeals } = useDealsStore.getState()
      expect(filteredDeals).toHaveLength(3)
      expect(filteredDeals).toEqual(mockDeals)
    })

    it('should return empty array when no deals match', () => {
      const { setDeals, setSearchQuery } = useDealsStore.getState()

      setDeals(mockDeals)
      setSearchQuery('xyz123nonexistent')

      const { filteredDeals } = useDealsStore.getState()
      expect(filteredDeals).toHaveLength(0)
    })

    it('should filter across multiple fields', () => {
      const { setDeals, setSearchQuery } = useDealsStore.getState()

      setDeals(mockDeals)
      setSearchQuery('b2b')

      const { filteredDeals } = useDealsStore.getState()
      // Doit trouver les deals qui ont 'B2B' dans les tags ou notes
      expect(filteredDeals.length).toBeGreaterThan(0)
    })

    it('should update filteredDeals when searchQuery changes', () => {
      const { setDeals, setSearchQuery } = useDealsStore.getState()

      setDeals(mockDeals)

      // Première recherche
      setSearchQuery('jean')
      expect(useDealsStore.getState().filteredDeals).toHaveLength(1)

      // Deuxième recherche
      setSearchQuery('marie')
      expect(useDealsStore.getState().filteredDeals).toHaveLength(1)
      expect(useDealsStore.getState().filteredDeals[0].contactName).toBe('Marie Martin')
    })

    it('should handle partial matches', () => {
      const { setDeals, setSearchQuery } = useDealsStore.getState()

      setDeals(mockDeals)
      setSearchQuery('acme')

      const { filteredDeals } = useDealsStore.getState()
      expect(filteredDeals).toHaveLength(1)
      expect(filteredDeals[0].companyName).toBe('Acme Corp')
    })

    it('should preserve deals state when filtering', () => {
      const { setDeals, setSearchQuery } = useDealsStore.getState()

      setDeals(mockDeals)
      setSearchQuery('jean')

      // Les deals originaux ne doivent pas être modifiés
      expect(useDealsStore.getState().deals).toHaveLength(3)
      expect(useDealsStore.getState().deals).toEqual(mockDeals)
    })
  })

  describe('setDeals', () => {
    it('should initialize filteredDeals with all deals', () => {
      const { setDeals } = useDealsStore.getState()

      setDeals(mockDeals)

      const { filteredDeals } = useDealsStore.getState()
      expect(filteredDeals).toHaveLength(3)
      expect(filteredDeals).toEqual(mockDeals)
    })
  })

  describe('clearDeals', () => {
    it('should clear searchQuery and filteredDeals', () => {
      const { setDeals, setSearchQuery, clearDeals } = useDealsStore.getState()

      setDeals(mockDeals)
      setSearchQuery('jean')

      clearDeals()

      const state = useDealsStore.getState()
      expect(state.deals).toHaveLength(0)
      expect(state.searchQuery).toBe('')
      expect(state.filteredDeals).toHaveLength(0)
    })
  })
})
