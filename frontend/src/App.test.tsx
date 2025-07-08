import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock successful API response for all tests
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok' }),
    } as Response)
  })

  it('renders navigation', () => {
    render(<App />)
    expect(screen.getByText('Schichtplaner')).toBeInTheDocument()
  })

  it('renders home page by default', () => {
    render(<App />)
    expect(screen.getByText('Schichtplaner Dashboard')).toBeInTheDocument()
  })

  it('has home and about navigation links', () => {
    render(<App />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })
})
