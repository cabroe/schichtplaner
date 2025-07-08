import { render, screen, waitFor } from '@testing-library/react'
import Home from './Home'

// Mock fetch
global.fetch = vi.fn()

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dashboard title', () => {
    // Mock successful API response
    const mockResponse = { status: 'ok' }
    ;(global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    render(<Home />)
    expect(screen.getByText('Schichtplaner Dashboard')).toBeInTheDocument()
  })

  it('fetches and displays server status', async () => {
    const mockStatus = 'ok'
    const mockResponse = { status: mockStatus }
    ;(global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
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
    ;(global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(new Error('Network error'))

    render(<Home />)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })
    
    consoleSpy.mockRestore()
  })
})
