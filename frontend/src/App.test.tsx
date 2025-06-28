import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import App from './App'

// Mock fetch
const mockFetch = vi.fn()
window.fetch = mockFetch

describe('App', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockFetch.mockClear()
    // Mock successful response by default
    mockFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue('application/json')
      },
      json: vi.fn().mockResolvedValue({ message: 'Test message from server' })
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders API Message heading', async () => {
    await act(async () => {
      render(<App />)
    })
    expect(screen.getByText('API Message')).toBeInTheDocument()
  })

  it('renders a paragraph for the server message', async () => {
    await act(async () => {
      render(<App />)
    })
    expect(screen.getByRole('paragraph')).toBeInTheDocument()
    
    // Wait for the API call to complete
    await waitFor(() => {
      expect(screen.getByText('Test message from server')).toBeInTheDocument()
    })
  })

  it('handles API error gracefully', async () => {
    // Mock fetch to reject
    mockFetch.mockRejectedValue(new Error('Network error'))
    
    await act(async () => {
      render(<App />)
    })
    
    // Wait for error handling
    await waitFor(() => {
      expect(screen.getByText('API nicht erreichbar')).toBeInTheDocument()
    })
  })
})
