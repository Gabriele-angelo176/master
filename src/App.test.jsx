import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import fantasyBooks from '../../fantasy.json'
import App from './App'

const comments = [
  {
    _id: 'comment-1',
    comment: 'Una recensione di prova',
    rate: 5,
  },
]

const renderApp = () => render(<App />)

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => comments,
  }))
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('EPICBOOKS app', () => {
  it('monta il componente Welcome', () => {
    renderApp()

    expect(screen.getByRole('heading', { name: 'EPIKBOOKS' })).toBeInTheDocument()
    expect(screen.getByText('Benvenuto nella nostra libreria')).toBeInTheDocument()
  })

  it('renderizza una Bootstrap Card per ogni libro del JSON', () => {
    renderApp()

    expect(document.querySelectorAll('.book-card.card')).toHaveLength(fantasyBooks.length)
  })

  it('renderizza CommentArea senza recensioni prima della selezione', () => {
    renderApp()

    expect(screen.getByRole('heading', { name: 'Recensioni' })).toBeInTheDocument()
    expect(screen.getByText('Seleziona un libro per visualizzare le recensioni.')).toBeInTheDocument()
    expect(document.querySelectorAll('.single-comment')).toHaveLength(0)
  })

  it('filtra i libri tramite la ricerca della navbar', () => {
    renderApp()
    const search = screen.getByRole('searchbox', { name: 'Search books by title' })

    fireEvent.change(search, { target: { value: 'witcher' } })
    expect(document.querySelectorAll('.book-card.card')).toHaveLength(2)

    fireEvent.change(search, { target: { value: 'mordenkainen' } })
    expect(document.querySelectorAll('.book-card.card')).toHaveLength(1)

    fireEvent.change(search, { target: { value: 'titolo inesistente' } })
    expect(document.querySelectorAll('.book-card.card')).toHaveLength(0)
  })

  it('seleziona un libro e deseleziona quello precedente quando se ne sceglie un altro', () => {
    renderApp()
    const books = screen.getAllByRole('img')

    fireEvent.click(books[0])
    expect(books[0]).toHaveClass('book-card__image--selected')

    fireEvent.click(books[1])
    expect(books[0]).not.toHaveClass('book-card__image--selected')
    expect(books[1]).toHaveClass('book-card__image--selected')
  })

  it('carica e renderizza le recensioni dopo la selezione di un libro', async () => {
    renderApp()
    fireEvent.click(screen.getAllByRole('img')[0])

    await waitFor(() => {
      expect(screen.getByText('Una recensione di prova')).toBeInTheDocument()
    })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/comments/'),
      expect.any(Object),
    )
    expect(document.querySelectorAll('.single-comment')).toHaveLength(1)
  })
})