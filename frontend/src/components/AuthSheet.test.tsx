import { render, screen, fireEvent } from '@testing-library/react'
import AuthSheet from './AuthSheet'
import * as authUtils from '@/utils/auth'

// Mock the auth utils
jest.mock('@/utils/auth')

describe('AuthSheet', () => {
  const mockGetLoginUrl = authUtils.getLoginUrl as jest.MockedFunction<typeof authUtils.getLoginUrl>

  beforeEach(() => {
    jest.clearAllMocks()
    window.alert = jest.fn()
  })

  it('renders login mode by default', () => {
    render(<AuthSheet />)
    
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Login with Keycloak')).toBeInTheDocument()
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
  })

  it('switches to signup mode when clicking Sign up button', () => {
    render(<AuthSheet />)
    
    const signUpButton = screen.getByText('Sign up')
    fireEvent.click(signUpButton)
    
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
    expect(screen.getByText('Sign up with Keycloak')).toBeInTheDocument()
    expect(screen.getByText('Already have an account?')).toBeInTheDocument()
  })

  it('switches back to login mode from signup', () => {
    render(<AuthSheet />)
    
    // Switch to signup
    fireEvent.click(screen.getByText('Sign up'))
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
    
    // Switch back to login
    fireEvent.click(screen.getByText('Log in'))
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('calls getLoginUrl when clicking login button with valid URL', () => {
    const mockUrl = 'https://keycloak.example.com/auth'
    mockGetLoginUrl.mockReturnValue(mockUrl)
    
    render(<AuthSheet />)
    
    const loginButton = screen.getByText('Login with Keycloak')
    fireEvent.click(loginButton)
    
    expect(mockGetLoginUrl).toHaveBeenCalled()
  })

  it('shows alert when login URL is invalid (empty)', () => {
    mockGetLoginUrl.mockReturnValue('')
    
    render(<AuthSheet />)
    
    const loginButton = screen.getByText('Login with Keycloak')
    fireEvent.click(loginButton)
    
    expect(window.alert).toHaveBeenCalledWith('Invalid login URL')
  })

  it('shows alert when login URL is invalid (not http/https)', () => {
    mockGetLoginUrl.mockReturnValue('javascript:alert(1)')
    
    render(<AuthSheet />)
    
    const loginButton = screen.getByText('Login with Keycloak')
    fireEvent.click(loginButton)
    
    expect(window.alert).toHaveBeenCalledWith('Invalid login URL')
  })

  it('calls getLoginUrl when clicking signup button', () => {
    const mockUrl = 'https://keycloak.example.com/auth'
    mockGetLoginUrl.mockReturnValue(mockUrl)
    
    render(<AuthSheet />)
    
    // Switch to signup mode
    fireEvent.click(screen.getByText('Sign up'))
    
    // Click signup button
    const signupButton = screen.getByText('Sign up with Keycloak')
    fireEvent.click(signupButton)
    
    expect(mockGetLoginUrl).toHaveBeenCalled()
  })
})
