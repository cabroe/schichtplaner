import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MainLayout } from './MainLayout'

// Mock the child components
vi.mock('./Header', () => ({
  Header: () => <div data-testid="header">Header Component</div>
}))

vi.mock('./Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar Component</div>
}))

vi.mock('./PageWrapper', () => ({
  PageWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-wrapper">
      <div data-testid="page-wrapper-content">{children}</div>
    </div>
  )
}))

// Test helper to render MainLayout with router context
const renderWithRouter = (children?: React.ReactNode) => {
  return render(
    <MemoryRouter>
      <MainLayout>{children}</MainLayout>
    </MemoryRouter>
  )
}

describe('MainLayout', () => {
  it('renders without crashing', () => {
    renderWithRouter()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('page-wrapper')).toBeInTheDocument()
  })

  it('has correct root CSS class', () => {
    const { container } = renderWithRouter()
    const pageDiv = container.querySelector('.page')
    expect(pageDiv).toBeInTheDocument()
  })

  it('renders all child components in correct order', () => {
    renderWithRouter()
    
    const header = screen.getByTestId('header')
    const sidebar = screen.getByTestId('sidebar')
    const pageWrapper = screen.getByTestId('page-wrapper')
    
    expect(header).toBeInTheDocument()
    expect(sidebar).toBeInTheDocument()
    expect(pageWrapper).toBeInTheDocument()
    
    // Check component order in DOM
    const pageDiv = document.querySelector('.page')
    const children = Array.from(pageDiv?.children || [])
    
    expect(children[0]).toBe(sidebar)
    expect(children[1]).toBe(header)
    expect(children[2]).toBe(pageWrapper)
  })

  it('passes children to PageWrapper component', () => {
    const testContent = 'Test content for children'
    renderWithRouter(<div>{testContent}</div>)
    
    expect(screen.getByTestId('page-wrapper-content')).toBeInTheDocument()
    expect(screen.getByText(testContent)).toBeInTheDocument()
  })

  it('handles no children gracefully', () => {
    renderWithRouter()
    
    expect(screen.getByTestId('page-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('page-wrapper-content')).toBeInTheDocument()
  })

  it('handles multiple children elements', () => {
    renderWithRouter(
      <>
        <div>First child</div>
        <div>Second child</div>
        <span>Third child</span>
      </>
    )
    
    expect(screen.getByText('First child')).toBeInTheDocument()
    expect(screen.getByText('Second child')).toBeInTheDocument()
    expect(screen.getByText('Third child')).toBeInTheDocument()
  })

  it('handles complex nested children', () => {
    renderWithRouter(
      <div className="test-container">
        <h1>Page Title</h1>
        <main>
          <section>
            <p>Content paragraph</p>
            <button>Action Button</button>
          </section>
        </main>
      </div>
    )
    
    expect(screen.getByText('Page Title')).toBeInTheDocument()
    expect(screen.getByText('Content paragraph')).toBeInTheDocument()
    expect(screen.getByText('Action Button')).toBeInTheDocument()
  })

  it('maintains proper DOM structure', () => {
    const { container } = renderWithRouter(<div>Test content</div>)
    
    // Check that we have the expected DOM structure
    const pageDiv = container.querySelector('.page')
    expect(pageDiv).toBeInTheDocument()
    
    // Verify all components are direct children of .page
    const directChildren = pageDiv?.children
    expect(directChildren).toHaveLength(3)
    
    // Check that children content is nested properly within PageWrapper
    const pageWrapperContent = screen.getByTestId('page-wrapper-content')
    expect(pageWrapperContent).toContainElement(screen.getByText('Test content'))
  })

  describe('Component Integration', () => {
    it('Header component is rendered', () => {
      renderWithRouter()
      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByText('Header Component')).toBeInTheDocument()
    })

    it('Sidebar component is rendered', () => {
      renderWithRouter()
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
      expect(screen.getByText('Sidebar Component')).toBeInTheDocument()
    })

    it('PageWrapper component is rendered', () => {
      renderWithRouter()
      expect(screen.getByTestId('page-wrapper')).toBeInTheDocument()
    })
  })

  describe('Props Interface', () => {
    it('accepts ReactNode children prop', () => {
      const stringChild = 'String child'
      const elementChild = <div>Element child</div>
      const numberChild = 42
      
      // Test string child
      renderWithRouter(stringChild)
      expect(screen.getByText(stringChild)).toBeInTheDocument()
      
      // Re-render with element child
      render(
        <MemoryRouter>
          <MainLayout>{elementChild}</MainLayout>
        </MemoryRouter>
      )
      expect(screen.getByText('Element child')).toBeInTheDocument()
    })
  })
})
