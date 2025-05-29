import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RecommendationsPage from './page'
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


beforeEach(() => {
  // Silence console errors from expected failures
  jest.spyOn(console, 'error').mockImplementation(() => {})

  // Mock token
  localStorage.setItem('token', 'fake-token')

  // Mock fetch
  global.fetch = jest.fn()
  jest.clearAllMocks()
})

afterEach(() => {
  // Restore console
  ;(console.error as jest.Mock).mockRestore()
})

describe('RecommendationsPage', () => {
  it('renders filters and fetches recommendations', async () => {
    const mockStones = [{
      _id: '1',
      name: 'Taj Mahal',
      type: 'quartzite',
      color: 'beige',
      pricePerM2_2cm: 400,
      pricePerM2_3cm: 500,
      usage: ['kitchen'],
      location: ['Container 1'],
    }]

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockStones,
    })

    render(<RecommendationsPage />)

    fireEvent.click(screen.getByText(/Find Recommendations/i))

    await waitFor(() => {
      expect(screen.getByText(/Taj Mahal/i)).toBeInTheDocument()
      expect(screen.getByText(/€400/)).toBeInTheDocument()
      expect(screen.getAllByText(/kitchen/i).length).toBeGreaterThan(0)
    })
  })

  it('handles error from API', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false })

    render(<RecommendationsPage />)

    fireEvent.click(screen.getByText(/Find Recommendations/i))

    await waitFor(() =>
      expect(screen.getByText(/Failed to fetch recommendations/i)).toBeInTheDocument()
    )
  })

  it('can toggle usage filter', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => [] })

    render(<RecommendationsPage />)

    const usageButton = screen.getAllByText(/kitchen/i)[0].closest('button')!
    fireEvent.click(usageButton)

    expect(usageButton.className).toMatch(/bg-gradient-to-r/)
  })
})
