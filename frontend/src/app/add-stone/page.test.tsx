import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AddStonePage from './page'

// mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
  }),
}))

describe('AddStonePage', () => {
  beforeEach(() => {
  localStorage.clear()
  global.fetch = jest.fn()
})


  it('renders form inputs', () => {
    render(<AddStonePage />)
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
  })

 it('shows "Failed to create stone" when request fails', async () => {
  const fakeToken = [
  btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
  btoa(JSON.stringify({
    preferred_username: 'testuser',
    realm_access: { roles: ['admin'] },
  })),
  'signature'
].join('.')

localStorage.setItem('token', fakeToken)


  render(<AddStonePage />)

  const nameInput = screen.getByPlaceholderText('Name')
  fireEvent.change(nameInput, { target: { value: 'Test Stone' } })

  const colorInput = screen.getByPlaceholderText('Color')
  fireEvent.change(colorInput, { target: { value: 'Blue' } })

  const usageInput = screen.getByPlaceholderText('Usage (comma-separated)')
  fireEvent.change(usageInput, { target: { value: 'kitchen' } })

  const typeSelect = screen.getByDisplayValue('Select type')
  fireEvent.change(typeSelect, { target: { value: 'granite' } })

  const button = screen.getByRole('button', { name: /create stone/i })
  fireEvent.click(button)

  await waitFor(() =>
    expect(
      screen.getByText(/Failed to create stone/i)
    ).toBeInTheDocument()
  )
})
it('shows "Not authorized." if token is missing', async () => {
  localStorage.removeItem('token')

  global.fetch = jest.fn() 

  render(<AddStonePage />)

  fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test Stone' } })
  fireEvent.change(screen.getByPlaceholderText('Color'), { target: { value: 'Gray' } })
  fireEvent.change(screen.getByPlaceholderText('Usage (comma-separated)'), { target: { value: 'kitchen' } })
  fireEvent.change(screen.getByDisplayValue('Select type'), { target: { value: 'granite' } })

  const button = screen.getByRole('button', { name: /create stone/i })
  fireEvent.click(button)

  await waitFor(() =>
    expect(screen.getByText((t) => t.toLowerCase().includes('not authorized'))).toBeInTheDocument()
  )
})


})

it('shows "Failed to create stone" if server rejects', async () => {
  localStorage.setItem('token', 'invalid')

  // fake fetch fail
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: false,
    json: async () => ({}),
  })

  render(<AddStonePage />)

  fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Taj Mahal' } })
  fireEvent.change(screen.getByPlaceholderText('Color'), { target: { value: 'Beige' } })
  fireEvent.change(screen.getByPlaceholderText('Usage (comma-separated)'), { target: { value: 'kitchen' } })
  fireEvent.change(screen.getByDisplayValue('Select type'), { target: { value: 'granite' } })

  const button = screen.getByRole('button', { name: /create stone/i })
  fireEvent.click(button)

  await waitFor(() =>
    expect(screen.getByText(/Failed to create stone/i)).toBeInTheDocument()
  )
})
it('adds and removes location on click', () => {
  render(<AddStonePage />)

  const locationButton = screen.getByText('Container 1')
  fireEvent.click(locationButton) 
  fireEvent.click(locationButton) 

  expect(locationButton.closest('button')).toHaveClass('bg-[#1c1c3a]') 
})

it('shows success message when stone is created', async () => {
  localStorage.setItem('token', 'valid')

  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => ({ name: 'Taj Mahal' }),
  })

  render(<AddStonePage />)

  fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Taj Mahal' } })
  fireEvent.change(screen.getByPlaceholderText('Color'), { target: { value: 'Beige' } })
  fireEvent.change(screen.getByPlaceholderText('Usage (comma-separated)'), { target: { value: 'kitchen' } })
  fireEvent.change(screen.getByDisplayValue('Select type'), { target: { value: 'granite' } })

  const button = screen.getByRole('button', { name: /create stone/i })
  fireEvent.click(button)

  await waitFor(() =>
    expect(screen.getByText(/Stone "Taj Mahal" created successfully/i)).toBeInTheDocument()
  )
})
