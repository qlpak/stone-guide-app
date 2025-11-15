import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Navbar from './Navbar'
import * as tokenUtils from '@/utils/token'
import { usePathname } from 'next/navigation'

// Mock the dependencies
jest.mock('@/utils/token')
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

describe('Navbar', () => {
  const mockGetUserRole = tokenUtils.getUserRole as jest.MockedFunction<typeof tokenUtils.getUserRole>
  const mockUsePathname = usePathname as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePathname.mockReturnValue('/dashboard')
    
    Storage.prototype.clear = jest.fn()
  })

  it('renders nothing when user has no role', () => {
    mockGetUserRole.mockReturnValue(null)
    
    const { container } = render(<Navbar />)
    
    expect(container.firstChild).toBeNull()
  })

  it('renders navbar for user role', async () => {
    mockGetUserRole.mockReturnValue('user')
    
    render(<Navbar />)
    
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('Recommendations')).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('AI')).toBeInTheDocument()
    expect(screen.getByText('Compare Stones')).toBeInTheDocument()
    expect(screen.queryByText('Create Stone')).not.toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
  })

  it('renders navbar with Create Stone link for admin role', async () => {
    mockGetUserRole.mockReturnValue('admin')
    
    render(<Navbar />)
    
    await waitFor(() => {
      expect(screen.getByText('Create Stone')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('highlights active link based on pathname', async () => {
    mockGetUserRole.mockReturnValue('user')
    mockUsePathname.mockReturnValue('/pricing')
    
    render(<Navbar />)
    
    await waitFor(() => {
      const pricingLink = screen.getByText('Pricing').closest('a')
      expect(pricingLink).toHaveClass('text-indigo-400')
    })
  })

  it('applies different styling for admin badge', async () => {
    mockGetUserRole.mockReturnValue('admin')
    
    render(<Navbar />)
    
    await waitFor(() => {
      const adminBadge = screen.getByText('Admin')
      expect(adminBadge).toHaveClass('from-purple-800')
      expect(adminBadge).toHaveClass('to-indigo-900')
      expect(adminBadge).toHaveClass('animate-pulse')
    })
  })

  it('applies different styling for user badge', async () => {
    mockGetUserRole.mockReturnValue('user')
    
    render(<Navbar />)
    
    await waitFor(() => {
      const userBadge = screen.getByText('User')
      expect(userBadge).toHaveClass('from-teal-800')
      expect(userBadge).toHaveClass('to-cyan-900')
    })
  })

  it('calls logout function when clicking logout button', async () => {
    mockGetUserRole.mockReturnValue('user')
    
    render(<Navbar />)
    
    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument()
    })
    
    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)
    
    expect(localStorage.clear).toHaveBeenCalled()
  })

  it('renders all navigation links correctly', async () => {
    mockGetUserRole.mockReturnValue('admin')
    
    render(<Navbar />)
    
    await waitFor(() => {
      const homeLink = screen.getByText('Home').closest('a')
      expect(homeLink).toHaveAttribute('href', '/dashboard')
    })
    
    expect(screen.getByText('Pricing').closest('a')).toHaveAttribute('href', '/pricing')
    expect(screen.getByText('Recommendations').closest('a')).toHaveAttribute('href', '/recommendations')
    expect(screen.getByText('Search').closest('a')).toHaveAttribute('href', '/search')
    expect(screen.getByText('AI').closest('a')).toHaveAttribute('href', '/ai')
    expect(screen.getByText('Compare Stones').closest('a')).toHaveAttribute('href', '/compare')
    expect(screen.getByText('Create Stone').closest('a')).toHaveAttribute('href', '/add-stone')
  })
})
