'use client'

import { useMemo } from 'react'
import { Card, Empty } from 'antd'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Deal, Status } from '@/lib/types'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants'

interface PipelineChartProps {
  deals: Deal[]
}

export function PipelineChart({ deals }: PipelineChartProps) {
  const chartData = useMemo(() => {
    const statusCounts: Record<Status, number> = {
      'prospect': 0,
      'qualifié': 0,
      'négociation': 0,
      'gagné - en cours': 0
    }

    deals.forEach((deal) => {
      if (deal.status in statusCounts) {
        statusCounts[deal.status]++
      }
    })

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: STATUS_LABELS[status as Status],
      count,
      fill: STATUS_COLORS[status as Status]
    }))
  }, [deals])

  if (deals.length === 0) {
    return (
      <Card title="Répartition des Deals par Étape">
        <Empty description="Aucun deal à afficher" />
      </Card>
    )
  }

  return (
    <Card title="Répartition des Deals par Étape">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="count"
            name="Nombre de deals"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
