import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './Header'

// Test helper to render Header with router context
const renderWithRouter = (initialPath = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Header />
    </MemoryRouter>
  )
}

describe('Header', () => {
  it('renders header element', () => {
    renderWithRouter()
    const header = document.querySelector('header')
    expect(header).toBeInTheDocument()
  })

  it('has correct CSS classes', () => {
    renderWithRouter()
    const header = document.querySelector('header')
    expect(header).toHaveClass('navbar', 'navbar-expand-md', 'd-none', 'd-lg-flex', 'd-print-none')
  })

  it('displays default title "Schichtplaner" for unknown route', () => {
    renderWithRouter('/unknown-route')
    expect(screen.getByText('Schichtplaner')).toBeInTheDocument()
  })

  it('displays correct title for dashboard route', () => {
    renderWithRouter('/')
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('displays correct title for about route', () => {
    renderWithRouter('/about')
    expect(screen.getByText('Über uns')).toBeInTheDocument()
  })

  it('displays correct title for modal test route', () => {
    renderWithRouter('/modal-test')
    expect(screen.getByText('Modal Test')).toBeInTheDocument()
  })

  it('displays default title for child routes (not in menu)', () => {
    renderWithRouter('/timesheet')
    expect(screen.getByText('Schichtplaner')).toBeInTheDocument()
  })

  it('displays default title for quick entry route (not in menu)', () => {
    renderWithRouter('/quick_entry')
    expect(screen.getByText('Schichtplaner')).toBeInTheDocument()
  })

  it('displays default title for calendar route (not in menu)', () => {
    renderWithRouter('/calendar')
    expect(screen.getByText('Schichtplaner')).toBeInTheDocument()
  })

  it('contains navbar toggler button', () => {
    renderWithRouter()
    const toggleButton = screen.getByRole('button')
    expect(toggleButton).toHaveClass('navbar-toggler')
    expect(toggleButton).toHaveAttribute('data-bs-toggle', 'collapse')
    expect(toggleButton).toHaveAttribute('data-bs-target', '#navbar-menu')
  })

  it('contains navbar collapse div', () => {
    renderWithRouter()
    const collapseDiv = document.querySelector('#navbar-menu')
    expect(collapseDiv).toBeInTheDocument()
    expect(collapseDiv).toHaveClass('collapse', 'navbar-collapse')
  })

  it('displays page title with correct heading level', () => {
    renderWithRouter('/')
    const pageTitle = screen.getByRole('heading', { level: 2 })
    expect(pageTitle).toBeInTheDocument()
    expect(pageTitle).toHaveClass('page-title', 'me-2')
    expect(pageTitle).toHaveTextContent('Dashboard')
  })

  describe('getPageTitle function behavior', () => {
    it('returns default title when no matching route found', () => {
      renderWithRouter('/non-existent-route')
      expect(screen.getByText('Schichtplaner')).toBeInTheDocument()
    })

    it('handles nested routes correctly (returns default for unmapped routes)', () => {
      renderWithRouter('/timesheet')
      expect(screen.getByText('Schichtplaner')).toBeInTheDocument()
      expect(screen.queryByText('Zeiterfassung')).not.toBeInTheDocument()
    })

    it('returns default title for unmapped child routes', () => {
      renderWithRouter('/calendar')
      expect(screen.getByText('Schichtplaner')).toBeInTheDocument()
      expect(screen.queryByText('Zeiterfassung')).not.toBeInTheDocument()
    })
  })
})
