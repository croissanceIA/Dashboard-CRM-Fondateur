'use client'

import { Row, Col, Card, Statistic } from 'antd'
import { RiseOutlined, DollarOutlined, ShoppingOutlined } from '@ant-design/icons'
import { KPIs } from '@/lib/types'
import { formatCurrency } from '@/lib/kpiCalculations'

interface KPICardsProps {
  kpis: KPIs
  loading?: boolean
}

export function KPICards({ kpis, loading = false }: KPICardsProps) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={8}>
        <Card>
          <Statistic
            title="Volume du Pipeline"
            value={kpis.totalDeals}
            prefix={<RiseOutlined />}
            valueStyle={{ color: '#1890ff' }}
            loading={loading}
            suffix="deals"
          />
        </Card>
      </Col>

      <Col xs={24} sm={24} md={8}>
        <Card>
          <Statistic
            title="CA Total Pipeline Brut"
            value={formatCurrency(kpis.pipelineBrut)}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#52c41a' }}
            loading={loading}
          />
        </Card>
      </Col>

      <Col xs={24} sm={24} md={8}>
        <Card>
          <Statistic
            title="Panier Moyen"
            value={formatCurrency(kpis.panierMoyen)}
            prefix={<ShoppingOutlined />}
            valueStyle={{ color: '#722ed1' }}
            loading={loading}
          />
        </Card>
      </Col>
    </Row>
  )
}
