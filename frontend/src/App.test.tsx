import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders API Message heading', () => {
    render(<App />)
    expect(screen.getByText('API Message')).toBeInTheDocument()
  })

  it('renders a paragraph for the server message', () => {
    render(<App />)
    expect(screen.getByRole('paragraph')).toBeInTheDocument()
  })
})
