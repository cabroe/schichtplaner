import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navigation from './Navigation'

const NavigationWithRouter = () => (
  <BrowserRouter>
    <Navigation />
  </BrowserRouter>
)

describe('Navigation', () => {
  it('renders brand title', () => {
    render(<NavigationWithRouter />)
    expect(screen.getByText('Schichtplaner')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<NavigationWithRouter />)
    
    const homeLink = screen.getByText('Home')
    const aboutLink = screen.getByText('About')
    
    expect(homeLink).toBeInTheDocument()
    expect(aboutLink).toBeInTheDocument()
  })

  it('has correct link hrefs', () => {
    render(<NavigationWithRouter />)
    
    const homeLink = screen.getByText('Home').closest('a')
    const aboutLink = screen.getByText('About').closest('a')
    
    expect(homeLink).toHaveAttribute('href', '/')
    expect(aboutLink).toHaveAttribute('href', '/about')
  })
})
