import { render, screen } from '@testing-library/react'
import CallbackPage from './page'

describe('CallbackPage', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_KEYCLOAK_BASE_URL: 'https://keycloak.example.com',
      NEXT_PUBLIC_KEYCLOAK_REALM: 'test-realm',
      NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: 'test-client',
      NEXT_PUBLIC_REDIRECT_URI: 'https://app.example.com',
    }

    global.fetch = jest.fn()
    
    console.log = jest.fn()
    console.error = jest.fn()
    window.alert = jest.fn()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('renders loading message', () => {
    render(<CallbackPage />)

    expect(screen.getByText('Logging in...')).toBeInTheDocument()
  })

  it('does nothing when no code is present', () => {
    render(<CallbackPage />)

    expect(global.fetch).not.toHaveBeenCalled()
  })
})
