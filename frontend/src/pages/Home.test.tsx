import { render, screen, waitFor } from '@testing-library/react'
import Home from './Home'

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dashboard title', () => {
    // Mock successful API response
    const mockResponse = { status: 'ok' }
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    render(<Home />)
    expect(screen.getByText('Schichtplaner Dashboard')).toBeInTheDocument()
  })

  it('fetches and displays server status', async () => {
    const mockStatus = 'ok'
    const mockResponse = { status: mockStatus }
    ;(globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText(`Status: ${mockStatus}`)).toBeInTheDocument()
    })
    
    expect(fetch).toHaveBeenCalledWith('/api/health')
  })

  it('handles fetch error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    ;(globalThis.fetch as any).mockRejectedValue(new Error('Network error'))

    render(<Home />)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })
    
    consoleSpy.mockRestore()
  })
})
