import { render, screen, fireEvent } from '@testing-library/react'
import Home from './page'

// Mock AuthSheet component
jest.mock('@/components/AuthSheet', () => {
  return function MockAuthSheet() {
    return <div data-testid="auth-sheet">AuthSheet</div>
  }
})

describe('Home Page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders welcome message for logged in users', () => {
    localStorage.setItem('token', 'valid-token')

    render(<Home />)

    expect(screen.getByText('Welcome back!')).toBeInTheDocument()
    expect(screen.getByText('You are logged in. Start exploring.')).toBeInTheDocument()
  })

  it('renders initial prompt when not logged in and no key pressed', () => {
    render(<Home />)

    expect(screen.getByText('Stone Guide')).toBeInTheDocument()
    expect(screen.getByText('Press any key to enter the world of stones.')).toBeInTheDocument()
  })

  it('shows AuthSheet when any key is pressed', () => {
    render(<Home />)

    expect(screen.queryByTestId('auth-sheet')).not.toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Enter' })

    expect(screen.getByTestId('auth-sheet')).toBeInTheDocument()
  })

  it('does not show AuthSheet multiple times', () => {
    render(<Home />)

    fireEvent.keyDown(window, { key: 'a' })
    expect(screen.getByTestId('auth-sheet')).toBeInTheDocument()

    // Press another key
    fireEvent.keyDown(window, { key: 'b' })
    
    // Should still only have one AuthSheet
    expect(screen.getAllByTestId('auth-sheet')).toHaveLength(1)
  })

  it('cleans up event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

    const { unmount } = render(<Home />)
    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })
})
