'use client'

import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
}

/**
 * Composant de barre de recherche réutilisable avec debounce intégré
 *
 * @param value - Valeur actuelle de la recherche (controlled component)
 * @param onChange - Callback appelé après le debounce
 * @param placeholder - Texte du placeholder
 * @param debounceMs - Délai de debounce en millisecondes (défaut: 300ms)
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Rechercher un deal...',
  debounceMs = 300
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)

  // Synchroniser la valeur locale avec la valeur du store
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounce: appeler onChange après debounceMs
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [localValue, debounceMs, onChange])

  return (
    <Input.Search
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      allowClear
      size="large"
      aria-label="Rechercher un deal"
      className="max-w-xl"
    />
  )
}
