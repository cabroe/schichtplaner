import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />)
    expect(screen.getByText('Golang + Vite + React')).toBeInTheDocument()
  })

  it('renders Schichtplaner title', () => {
    render(<App />)
    expect(screen.getByText('Schichtplaner')).toBeInTheDocument()
  })

  it('renders Vite and React buttons', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /vite/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /react/i })).toBeInTheDocument()
  })

  it('renders Font Awesome SVG icons', () => {
    render(<App />)
    const svgElements = document.querySelectorAll('svg[data-icon]')
    expect(svgElements.length).toBeGreaterThan(0)
  })
})
