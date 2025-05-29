import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import ComparePage from './page'

beforeEach(() => {
  localStorage.setItem('token', 'mock-token')

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      stones: [
        {
          _id: '1',
          name: 'Infinity',
          type: 'Quartzite',
          color: 'green',
          pricePerM2_2cm: 400,
          pricePerM2_3cm: 500,
          location: ['Shelf A'],
          usage: ['kitchen', 'bathroom'],
        },
        {
          _id: '2',
          name: 'Calacatta',
          type: 'Marble',
          color: 'white',
          pricePerM2_2cm: 300,
          pricePerM2_3cm: 420,
          location: ['Shelf B'],
          usage: ['bathroom'],
        },
        {
          _id: '3',
          name: 'Bronzite',
          type: 'Quartzite',
          color: 'black',
          pricePerM2_2cm: 380,
          pricePerM2_3cm: 460,
          location: ['Shelf C'],
          usage: ['flooring'],
        },
      ],
    }),
  })

  jest.clearAllMocks()
})

describe('ComparePage', () => {
  it('compares three stones and displays results', async () => {
    render(<ComparePage />)

    const inputs = screen.getAllByPlaceholderText(/Stone \d/i)

    // Stone 1 – Calacatta
    fireEvent.change(inputs[0], { target: { value: 'Calacatta' } })
    const dropdown1 = await screen.findByText('Calacatta')
    fireEvent.click(dropdown1)

    // Stone 2 – Infinity
    fireEvent.change(inputs[1], { target: { value: 'Infinity' } })
    const secondInputWrapper = inputs[1].closest('div')! // parent of input + dropdown
    const dropdown2 = await within(secondInputWrapper).findByText('Infinity')
    fireEvent.click(dropdown2)

    // Stone 3 – Bronzite
    fireEvent.change(inputs[2], { target: { value: 'Bronzite' } })
    const thirdInputWrapper = inputs[2].closest('div')!
    const dropdown3 = await within(thirdInputWrapper).findByText('Bronzite')
    fireEvent.click(dropdown3)

    await waitFor(() => {
      expect(screen.getAllByText(/Quartzite/i).length).toBeGreaterThan(1)
      expect(screen.getByText(/Marble/i)).toBeInTheDocument()
      expect(screen.getByText(/€500/i)).toBeInTheDocument()
      expect(screen.getByText(/€420/i)).toBeInTheDocument()
      expect(screen.getByText(/€460/i)).toBeInTheDocument()
    })
  })
})
