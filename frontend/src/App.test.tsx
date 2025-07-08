import { render, screen, waitFor } from '@testing-library/react'
import { act } from '@testing-library/react'
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

  it('renders navigation', async () => {
    await act(async () => {
      render(<App />)
    })
    expect(screen.getByText('Schichtplaner')).toBeInTheDocument()
  })

  it('renders home page by default', async () => {
    await act(async () => {
      render(<App />)
    })
    await waitFor(() => {
      expect(screen.getByText('Schichtplaner Dashboard')).toBeInTheDocument()
    })
  })

  it('has home and about navigation links', async () => {
    await act(async () => {
      render(<App />)
    })
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })
})
