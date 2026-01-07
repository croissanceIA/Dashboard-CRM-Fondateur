'use client'

import { Table, Badge, Tag, Empty } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Deal } from '@/lib/types'
import { format } from 'date-fns'
import { useMemo } from 'react'

interface DealsTableProps {
  deals: Deal[]
  loading?: boolean
}

/**
 * Couleurs des badges de statut
 */
const STATUS_COLORS = {
  'prospect': 'blue',
  'qualifié': 'orange',
  'négociation': 'purple',
  'gagné - en cours': 'green'
} as const

/**
 * Couleurs des badges de priorité
 */
const PRIORITY_COLORS = {
  'low': 'default',
  'medium': 'blue',
  'high': 'red'
} as const

/**
 * Labels de priorité en français
 */
const PRIORITY_LABELS = {
  'low': 'Faible',
  'medium': 'Moyenne',
  'high': 'Haute'
} as const

/**
 * Formatte un montant en euros
 */
function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Formatte une date au format DD/MM/YYYY
 */
function formatDate(date: Date | null): string {
  if (!date) return '-'
  return format(date, 'dd/MM/yyyy')
}

/**
 * Vérifie si une date est passée
 */
function isOverdue(date: Date | null): boolean {
  if (!date) return false
  return date < new Date()
}

/**
 * Composant principal du tableau des deals avec tri et pagination
 */
export function DealsTable({ deals, loading = false }: DealsTableProps) {
  const columns: ColumnsType<Deal> = useMemo(() => [
    {
      title: 'Contact',
      dataIndex: 'contactName',
      key: 'contactName',
      sorter: (a, b) => a.contactName.localeCompare(b.contactName, 'fr'),
      ellipsis: true,
      width: 150
    },
    {
      title: 'Entreprise',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: (a, b) => a.companyName.localeCompare(b.companyName, 'fr'),
      ellipsis: true,
      width: 150
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status, 'fr'),
      render: (status: Deal['status']) => (
        <Badge
          color={STATUS_COLORS[status]}
          text={status}
        />
      ),
      width: 140
    },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number) => (
        <span className="font-semibold">{formatAmount(amount)}</span>
      ),
      align: 'right',
      width: 120
    },
    {
      title: 'Échéance',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.getTime() - b.dueDate.getTime()
      },
      render: (dueDate: Date | null) => {
        if (!dueDate) return <span className="text-gray-400">-</span>
        const overdue = isOverdue(dueDate)
        return (
          <span className={overdue ? 'text-red-600 font-semibold' : ''}>
            {formatDate(dueDate)}
          </span>
        )
      },
      width: 120
    },
    {
      title: 'Priorité',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => {
        const order = { 'high': 3, 'medium': 2, 'low': 1 }
        return order[a.priority] - order[b.priority]
      },
      render: (priority: Deal['priority']) => (
        <Badge
          color={PRIORITY_COLORS[priority]}
          text={PRIORITY_LABELS[priority]}
        />
      ),
      width: 110
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => {
        if (!tags || tags.length === 0) {
          return <span className="text-gray-400">-</span>
        }

        // Afficher max 3 tags + "..." si plus
        const visibleTags = tags.slice(0, 3)
        const remainingCount = tags.length - 3

        return (
          <>
            {visibleTags.map((tag) => (
              <Tag key={tag} color="blue">
                {tag}
              </Tag>
            ))}
            {remainingCount > 0 && (
              <Tag color="default">+{remainingCount}</Tag>
            )}
          </>
        )
      },
      width: 200
    }
  ], [])

  // Empty state personnalisé
  const emptyState = (
    <Empty
      description={
        deals.length === 0
          ? 'Aucun deal ne correspond à votre recherche'
          : 'Aucun deal uploadé. Importez un fichier CSV pour commencer.'
      }
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  )

  return (
    <Table
      columns={columns}
      dataSource={deals}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 50,
        position: ['bottomCenter'],
        showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} deals`,
        showSizeChanger: false
      }}
      locale={{ emptyText: emptyState }}
      scroll={{ x: 1000 }}
      className="deals-table"
    />
  )
}
