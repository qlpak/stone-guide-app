import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AIRecognitionPage from './page'

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


// mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
  }),
}))

describe('AIRecognitionPage', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'mock')
    global.fetch = jest.fn()
    URL.createObjectURL = jest.fn(() => 'mock-preview-url')
  })

  it('renders upload input and button', () => {
    render(<AIRecognitionPage />)
    expect(screen.getByLabelText(/upload stone image/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /guess the stone/i })).toBeInTheDocument()
  })
  it('shows image preview when file is selected', () => {
    render(<AIRecognitionPage />)

    const input = screen.getByLabelText(/upload stone image/i)
    const file = new File(['dummy content'], 'stone.jpg', { type: 'image/jpeg' })

    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByAltText('Preview')).toHaveAttribute('src', 'mock-preview-url')
  })
  it('shows top 3 predictions after submit', async () => {
    const mockResponse = [
      { rank: 1, stone: 'taj-mahal', probability: 0.9 },
      { rank: 2, stone: 'calacatta-oro', probability: 0.07 },
      { rank: 3, stone: 'nero-marquina', probability: 0.03 },
    ]

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(<AIRecognitionPage />)

    const input = screen.getByLabelText(/upload stone image/i)
    const file = new File(['dummy'], 'stone.jpg', { type: 'image/jpeg' })
    fireEvent.change(input, { target: { files: [file] } })

    const button = screen.getByRole('button', { name: /guess the stone/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/🥇 1st/i)).toBeInTheDocument()
      expect(screen.getByText(/Taj Mahal/i)).toBeInTheDocument()
      expect(screen.getByText(/90.0%/i)).toBeInTheDocument()
    })
  })
  it('shows error message when prediction fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false })

    render(<AIRecognitionPage />)

    const input = screen.getByLabelText(/upload stone image/i)
    const file = new File(['dummy'], 'stone.jpg', { type: 'image/jpeg' })
    fireEvent.change(input, { target: { files: [file] } })

    const button = screen.getByRole('button', { name: /guess the stone/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/failed to predict/i)).toBeInTheDocument()
    })
  })
})
