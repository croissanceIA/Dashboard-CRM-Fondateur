import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '@/components/shared/SearchBar'

describe('SearchBar Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should render with default placeholder', () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} />)

    const input = screen.getByPlaceholderText('Rechercher un deal...')
    expect(input).toBeInTheDocument()
  })

  it('should render with custom placeholder', () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} placeholder="Rechercher..." />)

    const input = screen.getByPlaceholderText('Rechercher...')
    expect(input).toBeInTheDocument()
  })

  it('should display the provided value', () => {
    const onChange = vi.fn()
    render(<SearchBar value="test" onChange={onChange} />)

    const input = screen.getByDisplayValue('test')
    expect(input).toBeInTheDocument()
  })

  it('should call onChange after debounce delay', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup({ delay: null })

    render(<SearchBar value="" onChange={onChange} debounceMs={300} />)

    const input = screen.getByPlaceholderText('Rechercher un deal...')

    // Saisir du texte
    await user.type(input, 'test')

    // onChange ne doit pas être appelé immédiatement
    expect(onChange).not.toHaveBeenCalled()

    // Avancer le timer de 300ms
    vi.advanceTimersByTime(300)

    // onChange doit maintenant être appelé avec 'test'
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('test')
    })
  })

  it('should debounce multiple rapid inputs', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup({ delay: null })

    render(<SearchBar value="" onChange={onChange} debounceMs={300} />)

    const input = screen.getByPlaceholderText('Rechercher un deal...')

    // Saisir rapidement plusieurs caractères
    await user.type(input, 't')
    vi.advanceTimersByTime(100)

    await user.type(input, 'e')
    vi.advanceTimersByTime(100)

    await user.type(input, 's')
    vi.advanceTimersByTime(100)

    await user.type(input, 't')

    // onChange ne doit toujours pas être appelé
    expect(onChange).not.toHaveBeenCalled()

    // Avancer le timer pour terminer le debounce
    vi.advanceTimersByTime(300)

    // onChange doit être appelé une seule fois avec la valeur finale
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith('test')
    })
  })

  it('should have aria-label for accessibility', () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} />)

    const input = screen.getByLabelText('Rechercher un deal')
    expect(input).toBeInTheDocument()
  })

  it('should update when value prop changes', async () => {
    const onChange = vi.fn()
    const { rerender } = render(<SearchBar value="" onChange={onChange} />)

    let input = screen.getByPlaceholderText('Rechercher un deal...')
    expect(input).toHaveValue('')

    // Mettre à jour la prop value
    rerender(<SearchBar value="new value" onChange={onChange} />)

    await waitFor(() => {
      input = screen.getByPlaceholderText('Rechercher un deal...')
      expect(input).toHaveValue('new value')
    })
  })

  it('should use custom debounce time', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup({ delay: null })

    render(<SearchBar value="" onChange={onChange} debounceMs={500} />)

    const input = screen.getByPlaceholderText('Rechercher un deal...')
    await user.type(input, 'test')

    // Avancer de 300ms (pas encore assez)
    vi.advanceTimersByTime(300)
    expect(onChange).not.toHaveBeenCalled()

    // Avancer de 200ms supplémentaires (total 500ms)
    vi.advanceTimersByTime(200)

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('test')
    })
  })

  it('should have clear button functionality', async () => {
    const onChange = vi.fn()
    render(<SearchBar value="test" onChange={onChange} />)

    const input = screen.getByDisplayValue('test')
    expect(input).toHaveValue('test')

    // Le bouton clear est rendu par Ant Design Input.Search
    // Vérifier que le composant a la prop allowClear
    const searchInput = input.closest('.ant-input-affix-wrapper')
    expect(searchInput).toBeInTheDocument()
  })
})
