import { render, screen } from '@testing-library/react'
import DashboardPage from './page'

beforeEach(() => {
  const fakeToken = [
    btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
    btoa(JSON.stringify({
      preferred_username: 'testuser',
      realm_access: { roles: ['admin', 'user'] },
    })),
    'signature'
  ].join('.')

  localStorage.setItem('token', fakeToken)
})


// Mock the token decoder
jest.mock('@/utils/token', () => ({
  decodeToken: () => ({
    preferred_username: 'testuser',
    realm_access: { roles: ['admin'] },
  }),
}))

beforeEach(() => {
  localStorage.setItem('token', 'valid-token')
})

describe('DashboardPage', () => {
  it('renders dashboard content', () => {
    render(<DashboardPage />)

    expect(screen.getByText(/create stone/i)).toBeInTheDocument()
    expect(screen.getByText(/recommendations/i)).toBeInTheDocument()
    expect(screen.getAllByText(/pricing/i).length).toBeGreaterThan(0)
  })
})
