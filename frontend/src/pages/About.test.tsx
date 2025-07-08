import { render, screen } from '@testing-library/react'
import About from './About'

describe('About', () => {
  it('renders about page title', () => {
    render(<About />)
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('renders card title', () => {
    render(<About />)
    expect(screen.getByText('Schichtplaner')).toBeInTheDocument()
  })

  it('renders description text', () => {
    render(<About />)
    expect(screen.getByText('Ein modernes Schichtplanungs-Tool entwickelt mit Go, React und TypeScript.')).toBeInTheDocument()
  })

  it('has correct page structure', () => {
    render(<About />)
    
    const pageHeader = screen.getByText('About').closest('.page-header')
    const pageBody = screen.getByText('Schichtplaner').closest('.page-body')
    
    expect(pageHeader).toBeInTheDocument()
    expect(pageBody).toBeInTheDocument()
  })
})
