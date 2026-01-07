import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DealsTable } from '@/components/deals/DealsTable'
import { Deal } from '@/lib/types'

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
    notes: 'Client potentiel',
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
    notes: 'Entreprise innovante',
    assignees: 'Bob'
  },
  {
    id: '3',
    contactName: 'Pierre Durand',
    companyName: 'Global Solutions Inc',
    status: 'négociation',
    amount: 50000,
    dueDate: new Date('2025-12-20'), // Date passée
    startDate: new Date('2026-01-05'),
    dateCreated: new Date('2026-01-05'),
    priority: 'high',
    tags: ['Enterprise', 'B2B', 'International', 'Strategic'],
    notes: 'Deal stratégique',
    assignees: 'Charlie'
  }
]

describe('DealsTable Component', () => {
  describe('Data Display', () => {
    it('should render all column headers', () => {
      render(<DealsTable deals={mockDeals} />)

      expect(screen.getByText('Contact')).toBeInTheDocument()
      expect(screen.getByText('Entreprise')).toBeInTheDocument()
      expect(screen.getByText('Statut')).toBeInTheDocument()
      expect(screen.getByText('Montant')).toBeInTheDocument()
      expect(screen.getByText('Échéance')).toBeInTheDocument()
      expect(screen.getByText('Priorité')).toBeInTheDocument()
      expect(screen.getByText('Tags')).toBeInTheDocument()
    })

    it('should display all deals data', () => {
      render(<DealsTable deals={mockDeals} />)

      expect(screen.getByText('Jean Dupont')).toBeInTheDocument()
      expect(screen.getByText('Marie Martin')).toBeInTheDocument()
      expect(screen.getByText('Pierre Durand')).toBeInTheDocument()

      expect(screen.getByText('Acme Corp')).toBeInTheDocument()
      expect(screen.getByText('TechStart SAS')).toBeInTheDocument()
      expect(screen.getByText('Global Solutions Inc')).toBeInTheDocument()
    })

    it('should format amounts in euros', () => {
      render(<DealsTable deals={mockDeals} />)

      // Vérifier que les montants sont formatés correctement
      expect(screen.getByText(/10\s?000\s?€/)).toBeInTheDocument()
      expect(screen.getByText(/25\s?000\s?€/)).toBeInTheDocument()
      expect(screen.getByText(/50\s?000\s?€/)).toBeInTheDocument()
    })

    it('should format dates as DD/MM/YYYY', () => {
      render(<DealsTable deals={mockDeals} />)

      expect(screen.getByText('01/02/2026')).toBeInTheDocument()
      expect(screen.getByText('15/03/2026')).toBeInTheDocument()
      expect(screen.getByText('20/12/2025')).toBeInTheDocument()
    })

    it('should display status badges', () => {
      render(<DealsTable deals={mockDeals} />)

      expect(screen.getByText('prospect')).toBeInTheDocument()
      expect(screen.getByText('qualifié')).toBeInTheDocument()
      expect(screen.getByText('négociation')).toBeInTheDocument()
    })

    it('should display priority badges with French labels', () => {
      render(<DealsTable deals={mockDeals} />)

      expect(screen.getAllByText('Haute')).toHaveLength(2) // 2 deals avec priorité high
      expect(screen.getByText('Moyenne')).toBeInTheDocument()
    })

    it('should display tags as chips', () => {
      render(<DealsTable deals={mockDeals} />)

      expect(screen.getAllByText('SaaS')).toHaveLength(1)
      expect(screen.getAllByText('B2B')).toHaveLength(2)
      expect(screen.getByText('Startup')).toBeInTheDocument()
    })

    it('should limit tags display to 3 with overflow indicator', () => {
      render(<DealsTable deals={mockDeals} />)

      // Deal 3 a 4 tags : Enterprise, B2B, International, Strategic
      // Doit afficher les 3 premiers + "+1"
      const rows = screen.getAllByRole('row')
      const deal3Row = rows.find(row => row.textContent?.includes('Pierre Durand'))

      expect(deal3Row).toBeInTheDocument()
      // Vérifier qu'il y a un indicateur "+1" pour le tag restant
      expect(screen.getByText('+1')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no deals', () => {
      render(<DealsTable deals={[]} />)

      expect(screen.getByText(/Aucun deal ne correspond à votre recherche/)).toBeInTheDocument()
    })
  })

  describe('Visual Indicators', () => {
    it('should highlight overdue dates in red', () => {
      render(<DealsTable deals={mockDeals} />)

      // Deal 3 a une date passée (20/12/2025)
      const overdueDate = screen.getByText('20/12/2025')
      expect(overdueDate).toHaveClass('text-red-600', 'font-semibold')
    })

    it('should display "-" for null dates', () => {
      const dealWithNullDate: Deal = {
        ...mockDeals[0],
        dueDate: null
      }

      render(<DealsTable deals={[dealWithNullDate]} />)

      const cells = screen.getAllByText('-')
      expect(cells.length).toBeGreaterThan(0)
    })

    it('should display "-" for empty tags', () => {
      const dealWithNoTags: Deal = {
        ...mockDeals[0],
        tags: []
      }

      render(<DealsTable deals={[dealWithNoTags]} />)

      const cells = screen.getAllByText('-')
      expect(cells.length).toBeGreaterThan(0)
    })
  })

  describe('Pagination', () => {
    it('should display pagination info', () => {
      render(<DealsTable deals={mockDeals} />)

      // Ant Design affiche "X-Y sur Z deals"
      expect(screen.getByText(/1-3 sur 3 deals/)).toBeInTheDocument()
    })

    it('should paginate with 50 deals per page', () => {
      // Créer 60 deals pour tester la pagination
      const manyDeals = Array.from({ length: 60 }, (_, i) => ({
        ...mockDeals[0],
        id: `deal-${i}`,
        contactName: `Contact ${i}`
      }))

      render(<DealsTable deals={manyDeals} />)

      // Doit afficher "1-50 sur 60 deals" sur la première page
      expect(screen.getByText(/1-50 sur 60 deals/)).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner when loading prop is true', () => {
      render(<DealsTable deals={mockDeals} loading={true} />)

      // Ant Design Table affiche un spinner avec la classe 'ant-spin'
      const spinner = document.querySelector('.ant-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('should not show loading spinner by default', () => {
      render(<DealsTable deals={mockDeals} />)

      const spinner = document.querySelector('.ant-spin')
      expect(spinner).not.toBeInTheDocument()
    })
  })

  describe('Table Structure', () => {
    it('should render as a table element', () => {
      render(<DealsTable deals={mockDeals} />)

      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })

    it('should have correct number of rows (excluding header)', () => {
      render(<DealsTable deals={mockDeals} />)

      // 1 header row + 3 data rows
      const rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(4)
    })
  })
})
