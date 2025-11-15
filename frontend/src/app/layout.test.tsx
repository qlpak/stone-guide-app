import { render, screen } from '@testing-library/react'
import RootLayout, { metadata } from './layout'

// Mock Navbar component
jest.mock('@/components/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>
  }
})

describe('RootLayout', () => {
  it('renders children correctly', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders Navbar component', () => {
    render(
      <RootLayout>
        <div>Content</div>
      </RootLayout>
    )

    expect(screen.getByTestId('navbar')).toBeInTheDocument()
  })

  it('has correct metadata', () => {
    expect(metadata.title).toBe('Stone Guide')
    expect(metadata.description).toBe('Find and compare natural stone easily')
  })

  it('renders multiple children', () => {
    render(
      <RootLayout>
        <div>First Child</div>
        <div>Second Child</div>
      </RootLayout>
    )

    expect(screen.getByText('First Child')).toBeInTheDocument()
    expect(screen.getByText('Second Child')).toBeInTheDocument()
  })
})
