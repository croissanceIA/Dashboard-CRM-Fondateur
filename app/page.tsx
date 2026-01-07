'use client'

import { Space, Typography, Card, Divider } from 'antd'
import { CSVUploader } from '@/components/shared/CSVUploader'
import { KPICards } from '@/components/dashboard/KPICards'
import { PipelineChart } from '@/components/dashboard/PipelineChart'
import { SearchBar } from '@/components/shared/SearchBar'
import { DealsTable } from '@/components/deals/DealsTable'
import { useDealsStore } from '@/store/dealsStore'
import { Deal } from '@/lib/types'

const { Title, Paragraph } = Typography

export default function DashboardPage() {
  const { deals, kpis, searchQuery, filteredDeals, setDeals, setSearchQuery } = useDealsStore()

  const handleDataLoaded = (loadedDeals: Deal[]) => {
    setDeals(loadedDeals)
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>Bienvenue sur votre Dashboard CRM</Title>
          <Paragraph>
            Uploadez votre fichier CSV pour visualiser la météo de votre business
          </Paragraph>
        </div>

        <CSVUploader onDataLoaded={handleDataLoaded} />

        {deals.length === 0 && (
          <Card>
            <Paragraph style={{ textAlign: 'center', fontSize: '16px', margin: 0 }}>
              Aucun deal chargé. Uploadez un fichier CSV pour commencer.
            </Paragraph>
          </Card>
        )}

        {deals.length > 0 && kpis && (
          <>
            <KPICards kpis={kpis} />
            <PipelineChart deals={deals} />

            <Divider />

            <div>
              <Title level={3}>Liste des Deals</Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Rechercher par contact, entreprise ou notes..."
                />
                <DealsTable deals={filteredDeals} />
              </Space>
            </div>
          </>
        )}
      </Space>
    </div>
  )
}
