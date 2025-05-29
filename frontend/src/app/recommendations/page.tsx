'use client'

import { useState } from 'react'
import { formatStoneName } from '@/utils/formatName'
import { Search, Gem, BadgeEuro } from 'lucide-react'
import { useAuthRedirect } from '@/utils/useAuthRedirect'

type Stone = {
  _id: string
  name: string
  type: string
  pricePerM2_2cm: number
  pricePerM2_3cm: number
  usage: string[]
  location: string[]
}

const usageOptions = ['kitchen', 'bathroom', 'stairs', 'flooring', 'walls']
const colorOptions = ['white', 'black', 'beige', 'grey', 'green', 'blue', 'brown']

export default function RecommendationsPage() {
  useAuthRedirect(['admin', 'user'])
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedUsage, setSelectedUsage] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [results, setResults] = useState<Stone[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleUsageToggle = (value: string) => {
    setSelectedUsage(prev =>
      prev.includes(value) ? prev.filter(u => u !== value) : [...prev, value]
    )
  }

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return setError('You must be logged in.')

      const params = new URLSearchParams()
      if (selectedColor) params.append('color', selectedColor)
      if (selectedUsage.length > 0) params.append('usage', selectedUsage.join(','))
      if (minPrice) params.append('min', minPrice)
      if (maxPrice) params.append('max', maxPrice)

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stones/recommend?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error('Failed to fetch recommendations')

      const data = await res.json()
      setResults(data)
    } catch (err) {
      console.error('Recommendation error:', err)
      setError('Failed to fetch recommendations.')
    }
  }

  return (
   <main className="min-h-screen bg-[#0a0a23] text-gray-100 px-6 py-12 animate-fade-in">
  <div className="max-w-5xl mx-auto">
    <h1 className="text-4xl font-extrabold mb-10 text-slate-100 flex items-center gap-3">
      <Gem className="text-indigo-300" /> Stone Recommendations
    </h1>

            <div className="grid gap-6 mb-12 bg-[#111122]/90 p-6 rounded-2xl border border-[#2d2d4d] shadow-xl backdrop-blur">

          <div>
            <label className="block mb-2 text-sm text-zinc-400">Color</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
        className="w-full bg-[#1c1c3a] text-white p-3 rounded-lg outline-none focus:ring-2 ring-indigo-700 transition-all"
            >
              <option value="">Any</option>
              {colorOptions.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          <div>
  <label className="block mb-2 text-sm text-zinc-400">Usage</label>
  <div className="flex flex-wrap gap-3">
    {usageOptions.map(u => (
      <button
  key={u}
  onClick={() => handleUsageToggle(u)}
  className={`relative px-4 py-2 text-sm font-medium rounded-full z-10 transition-all duration-300 ease-in-out
    ${selectedUsage.includes(u)
      ? 'bg-gradient-to-r from-indigo-800 via-[#1a1433] to-indigo-900 text-white shadow-lg shadow-indigo-800/40'
      : 'bg-[#1c1c3a] text-zinc-300 hover:bg-[#232343]'}
  `}
>
  <span className="relative z-20">{u}</span>

  {/* Border Lap SVG */}
  {selectedUsage.includes(u) && (
    <svg
      className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
    >
      <rect
        x="1"
        y="1"
        width="98"
        height="38"
        rx="20"
        ry="20"
        fill="none"
        stroke="#6366f1"  /* indigo-500 */
        strokeWidth="2"
        className="animate-draw-lap"
      />
    </svg>
  )}
</button>

    ))}
  </div>
</div>


          <div className="grid sm:grid-cols-2 gap-4">
            <div className="relative">
              <BadgeEuro className="absolute top-3 left-3 text-zinc-400 h-5 w-5" />
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min price (EUR/m²)"
                className="w-full bg-[#1c1c3a] text-white p-3 pl-10 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:outline-none"

              />
            </div>
            <div className="relative">
              <BadgeEuro className="absolute top-3 left-3 text-zinc-400 h-5 w-5" />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max price (EUR/m²)"
                className="w-full bg-[#1c1c3a] text-white p-3 pl-10 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
        onClick={fetchRecommendations}
        className="w-full bg-gradient-to-r from-indigo-900 via-[#1a1433] to-indigo-800 hover:brightness-110 text-white p-3 rounded-xl font-bold tracking-wide shadow-xl transition-all duration-300 transform hover:scale-[1.015] flex items-center justify-center gap-2"
      >
        <Search className="h-5 w-5" /> Find Recommendations
      </button>
        </div>

        {error && <p className="text-red-500 mb-6 animate-pulse">{error}</p>}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(stone => (
            <div
              key={stone._id}
          className="bg-[#111122] border border-[#2d2d4d] p-5 rounded-2xl shadow-md hover:shadow-lg transition duration-300 hover:border-indigo-700 group"
            >
          <h2 className="text-xl font-bold mb-2 text-indigo-300 group-hover:text-indigo-200 transition">
                {formatStoneName(stone.name)}
              </h2>
              <p className="text-sm text-zinc-300"><strong>Type:</strong> {stone.type}</p>
              <p className="text-sm text-zinc-300"><strong>Price 2cm:</strong> €{stone.pricePerM2_2cm}</p>
              <p className="text-sm text-zinc-300"><strong>Price 3cm:</strong> €{stone.pricePerM2_3cm}</p>
              <p className="text-sm text-zinc-300"><strong>Usage:</strong> {stone.usage.join(', ')}</p>
              <p className="text-sm text-zinc-300"><strong>Location:</strong> {stone.location.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

