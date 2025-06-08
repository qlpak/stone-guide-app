'use client'

import { useEffect, useState } from 'react'
import { useDebounce } from '@/utils/useDebounce'
import { useAuthRedirect } from '@/utils/useAuthRedirect'
import { formatStoneName } from '@/utils/formatName'
import { Calculator, Ruler, Euro, DollarSign, BadgeCent } from 'lucide-react'

type PricingResult = {
  areaM2: number
  priceEUR: number
  pricePLN: number
  priceUSD: number
}

type Stone = {
  _id: string
  name: string
  type: string
}

export default function PricingPage() {
  useAuthRedirect(['admin', 'user'])
  const [form, setForm] = useState({
    stoneId: '',
    length: '',
    width: '',
    unit: 'cm',
    thickness: '2cm',
    additionalCosts: '',
  })

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Stone[]>([])
  const debouncedQuery = useDebounce(query, 300)

  const [result, setResult] = useState<PricingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStones = async () => {
      if (!debouncedQuery) return setSuggestions([])

      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stones/search?query=${debouncedQuery}`,
          {
            headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' },
          }
        )

        if (!res.ok) {
          console.warn('Stone search failed:', res.status)
          if (res.status === 401) {
            setError('Unauthorized: Please log in again.')
          }
          return
        }

        const data = await res.json()
        setSuggestions(data.stones || data)
      } catch (err) {
        console.error('Stone search error:', err)
        setSuggestions([])
      }
    }

    fetchStones()
  }, [debouncedQuery])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const token = localStorage.getItem('token')
    if (!token) {
      setError('You must be logged in.')
      return
    }

    try {
      console.log("SUBMIT TO:", "http://stoneguide.local/api/pricing");

      const res = await fetch(`http://stoneguide.local/api/pricing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          length: parseFloat(form.length),
          width: parseFloat(form.width),
          additionalCosts: form.additionalCosts ? parseFloat(form.additionalCosts) : 0,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Unknown error')

      setResult(data)
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError('Unknown error')
    }
  }

return (
  <main className="min-h-screen bg-[#0a0a23] text-gray-100 px-6 py-12 animate-fade-in">
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10 items-start">
      {/* LEFT - TITLE + FORM */}
      <div className="lg:w-1/2 w-full flex flex-col">
        <h1 className="text-4xl font-extrabold mb-8 text-slate-100 flex items-center gap-3">
          <Calculator className="text-indigo-300" /> Stone Pricing Calculator
        </h1>

        {/* FORM WRAPPED IN A DIV TO CONTROL HEIGHT ALIGNMENT */}
        <div className="bg-[#111427] p-6 rounded-2xl shadow-2xl border border-[#2b2b44] backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Search stone by name"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setForm((prev) => ({ ...prev, stoneId: '' }))
                }}
                required
                className="w-full bg-[#1b1f38] text-white p-3 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:outline-none shadow-sm"
              />
              {suggestions.length > 0 && (
                <ul className="absolute bg-[#14182e] border border-[#2a2a44] mt-1 rounded-lg w-full z-50 max-h-60 overflow-y-auto text-sm shadow-xl animate-fade-in">
                  {suggestions.map((stone) => (
                    <li
                      key={stone._id}
                      onMouseDown={() => {
                        setForm((prev) => ({ ...prev, stoneId: stone._id }))
                        setQuery(formatStoneName(stone.name))
                        setSuggestions([])
                      }}
                      className="px-4 py-2 hover:bg-[#222742] cursor-pointer transition-all"
                    >
                      {formatStoneName(stone.name)} –{' '}
                      <span className="text-zinc-400">{stone.type}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="length"
                placeholder="Length"
                value={form.length}
                onChange={handleChange}
                required
                className="bg-[#1b1f38] text-white p-3 rounded-lg"
              />
              <input
                type="number"
                name="width"
                placeholder="Width"
                value={form.width}
                onChange={handleChange}
                required
                className="bg-[#1b1f38] text-white p-3 rounded-lg"
              />
            </div>

            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full bg-[#1b1f38] text-white p-3 rounded-lg"
            >
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="cm2">cm²</option>
              <option value="m2">m²</option>
            </select>

            <select
              name="thickness"
              value={form.thickness}
              onChange={handleChange}
              className="w-full bg-[#1b1f38] text-white p-3 rounded-lg"
            >
              <option value="2cm">2cm</option>
              <option value="3cm">3cm</option>
            </select>

            <input
              type="number"
              name="additionalCosts"
              placeholder="Additional costs (optional)"
              value={form.additionalCosts}
              onChange={handleChange}
              className="w-full bg-[#1b1f38] text-white p-3 rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1e1e40] to-[#2b2b5a] hover:brightness-110 text-white p-3 rounded-xl font-bold tracking-wide shadow-lg transition-all duration-300 transform hover:scale-[1.015]"
            >
              Calculate
            </button>
          </form>

          {error && (
            <div className="text-red-500 text-sm mt-4 animate-pulse">{error}</div>
          )}
        </div>
      </div>

      {/* RIGHT - RESULTS aligned with form */}
<div className="lg:w-1/2 w-full flex items-start pt-[76px]">
  {result && (
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 w-full">
      <div className="bg-[#0d0d24] rounded-2xl p-6 text-center border border-[#1a1a33] shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center min-h-[160px]">
        <Ruler className="text-indigo-400 mb-3 h-6 w-6" />
        <p className="text-base text-zinc-400 mb-1">Area</p>
        <p className="text-2xl font-bold text-white">
          {Number(result.areaM2).toFixed(2)} m²
        </p>
      </div>

      <div className="bg-[#0d0d24] rounded-2xl p-6 text-center border border-[#1a1a33] shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center min-h-[160px]">
        <Euro className="text-indigo-400 mb-3 h-6 w-6" />
        <p className="text-base text-zinc-400 mb-1">EUR</p>
        <p className="text-2xl font-bold text-white">€{result.priceEUR}</p>
      </div>

      <div className="bg-[#0d0d24] rounded-2xl p-6 text-center border border-[#1a1a33] shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center min-h-[160px]">
        <BadgeCent className="text-indigo-400 mb-3 h-6 w-6" />
        <p className="text-base text-zinc-400 mb-1">PLN</p>
        <p className="text-2xl font-bold text-white">{result.pricePLN} zł</p>
      </div>

      <div className="bg-[#0d0d24] rounded-2xl p-6 text-center border border-[#1a1a33] shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center min-h-[160px]">
        <DollarSign className="text-indigo-400 mb-3 h-6 w-6" />
        <p className="text-base text-zinc-400 mb-1">USD</p>
        <p className="text-2xl font-bold text-white">${result.priceUSD}</p>
      </div>
    </div>
  )}
</div>

    </div>
  </main>
)
}
