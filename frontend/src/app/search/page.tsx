'use client'

import { useDebounce } from '@/utils/useDebounce'
import { useAuthRedirect } from '@/utils/useAuthRedirect'
import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

type Stone = {
  _id: string
  name: string
  type: string
  color: string
  pricePerM2_2cm?: number
  pricePerM2_3cm?: number
  usage: string[]
  location: string[]
}

export default function SearchPage() {
  useAuthRedirect(['admin', 'user'])
  const [query, setQuery] = useState('')
  const [stones, setStones] = useState<Stone[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    const fetchStones = async () => {
      if (!debouncedQuery) return setStones([])
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem('token')
        if (!token) return setError('You must be logged in.')

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stones/search?query=${encodeURIComponent(debouncedQuery)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) throw new Error('Search failed')

        const data = await res.json()
        setStones(data.stones || data)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch search results')
      } finally {
        setLoading(false)
      }
    }

    fetchStones()
  }, [debouncedQuery])

  const formatName = (text: string) =>
    text.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b0b17] via-[#11111f] to-[#0c0c19] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-center text-indigo-400 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" /> Stone Search
        </h1>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name..."
          className="w-full px-5 py-3 rounded-xl bg-[#1a1a2a]/80 backdrop-blur-md text-white placeholder-zinc-400 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
        />

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-24 w-full rounded-xl bg-zinc-800 animate-pulse border border-zinc-700"
              />
            ))}
          </div>
        )}

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="grid gap-5 transition-all duration-500">

          {stones.map((stone, idx) => (
  <div
    key={stone._id}
    className="group p-5 rounded-xl border border-zinc-700 bg-gradient-to-br from-[#181828] to-[#1e1e30] transition-all duration-300 hover:scale-[1.015] hover:shadow-lg hover:shadow-indigo-800/30 stone-animate"
    style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
  >

              <h2 className="text-2xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-all duration-200">
                {formatName(stone.name)}
              </h2>
              <p><strong className="text-indigo-400">Type:</strong> {stone.type}</p>
              <p><strong className="text-indigo-400">Color:</strong> {formatName(stone.color)}</p>
              {stone.pricePerM2_2cm && (
                <p><strong className="text-indigo-400">Price 2cm:</strong> €{stone.pricePerM2_2cm}</p>
              )}
              {stone.pricePerM2_3cm && (
                <p><strong className="text-indigo-400">Price 3cm:</strong> €{stone.pricePerM2_3cm}</p>
              )}
              <p><strong className="text-indigo-400">Usage:</strong> {stone.usage.map(formatName).join(', ')}</p>
              <p><strong className="text-indigo-400">Location:</strong> {stone.location.map(formatName).join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
