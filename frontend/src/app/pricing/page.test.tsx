import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PricingPage from './page'
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


describe('PricingPage', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'valid')
    global.fetch = jest.fn()
  })

  it('calculates and displays pricing result', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        areaM2: 2.5,
        priceEUR: 800,
        pricePLN: 3500,
        priceUSD: 900,
      }),
    })

    render(<PricingPage />)

    fireEvent.change(screen.getByPlaceholderText(/search stone by name/i), {
      target: { value: 'Taj Mahal' },
    })

    fireEvent.change(screen.getByPlaceholderText(/length/i), {
      target: { value: '100' },
    })

    fireEvent.change(screen.getByPlaceholderText(/width/i), {
      target: { value: '200' },
    })

    fireEvent.click(screen.getByText(/calculate/i))

    await waitFor(() => {
      expect(screen.getByText(/€800/i)).toBeInTheDocument()
      expect(screen.getByText(/3500 zł/i)).toBeInTheDocument()
      expect(screen.getByText(/\$900/i)).toBeInTheDocument()
    })
  })

  it('shows error when fetch fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to fetch pricing' }),
    })

    render(<PricingPage />)

    fireEvent.change(screen.getByPlaceholderText(/search stone by name/i), {
      target: { value: 'Taj Mahal' },
    })
    fireEvent.change(screen.getByPlaceholderText(/length/i), {
      target: { value: '100' },
    })
    fireEvent.change(screen.getByPlaceholderText(/width/i), {
      target: { value: '200' },
    })

    fireEvent.click(screen.getByText(/calculate/i))

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch pricing/i)).toBeInTheDocument()
    })
  })
})
