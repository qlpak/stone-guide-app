import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SearchPage from './page'
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


describe('SearchPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input', () => {
    localStorage.setItem('token', 'mock-token')
    render(<SearchPage />)
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument()
  })

  it('displays stone results after typing query', async () => {
    localStorage.setItem('token', 'mock-token')

    const mockStones = [
      { _id: '1', name: 'Taj Mahal', type: 'quartzite', color: 'beige', usage: ['kitchen'], location: ['Container 1'] },
    ]

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockStones,
    })

    render(<SearchPage />)

    fireEvent.change(screen.getByPlaceholderText(/search by name/i), {
      target: { value: 'taj' },
    })

    await waitFor(() => {
      expect(screen.getByText(/Taj Mahal/i)).toBeInTheDocument()
    })
  })

  it('shows error on failed fetch', async () => {
    localStorage.setItem('token', 'mock-token')

    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Fetch error'))

    render(<SearchPage />)

    fireEvent.change(screen.getByPlaceholderText(/search by name/i), {
      target: { value: 'taj' },
    })

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument()
    })
  })
})
