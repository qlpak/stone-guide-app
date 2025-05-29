'use client'

import { useState, useEffect} from 'react'
import { useDebounce } from '@/utils/useDebounce'
import { useAuthRedirect } from '@/utils/useAuthRedirect'
import { Gem } from 'lucide-react'

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

export default function ComparePage() {
  useAuthRedirect(['admin', 'user'])

  const [queries, setQueries] = useState(['', '', ''])
  const [suggestions, setSuggestions] = useState<Stone[][]>([[], [], []])
  const [selected, setSelected] = useState<(Stone | null)[]>([null, null, null])
  const [error, setError] = useState(false)

  const debouncedQueries = [
    useDebounce(queries[0], 300),
    useDebounce(queries[1], 300),
    useDebounce(queries[2], 300),
  ]

  useEffect(() => {
    const fetchSuggestions = async (query: string, idx: number) => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stones/search?query=${encodeURIComponent(query.trim())}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (!res.ok) {
          setError(true)
          return
        }

        const data = await res.json()
        setSuggestions((prev) => {
          const copy = [...prev]
          copy[idx] = data.stones || data
          return copy
        })
        setError(false)
      } catch {
        setError(true)
      }
    }

    debouncedQueries.forEach((query, idx) => {
      if (!query.trim()) {
        setSuggestions((prev) => {
          const copy = [...prev]
          copy[idx] = []
          return copy
        })
        return
      }
      fetchSuggestions(query, idx)
    })
  }, [debouncedQueries[0], debouncedQueries[1], debouncedQueries[2]])

  const format = (str: string) =>
    str.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b0b17] via-[#10101e] to-[#0c0c1c] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
        <h1 className="text-4xl font-bold text-center text-indigo-400 flex items-center justify-center gap-2">
          <Gem className="w-6 h-6 text-indigo-300 animate-pulse" /> Compare Stones
        </h1>

        {/* Search Inputs */}
        <div className="grid md:grid-cols-3 gap-5">
          {queries.map((q, idx) => (
            <div key={idx} className="relative space-y-2">
              <input
                type="text"
                placeholder={`Stone ${idx + 1}`}
                value={q}
                onChange={(e) => {
                  const copy = [...queries]
                  copy[idx] = e.target.value
                  setQueries(copy)
                }}
                className="w-full px-4 py-2 rounded-md bg-zinc-900 border border-zinc-700 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />

              {suggestions[idx].length > 0 && (
                <div className="absolute z-30 top-full left-0 right-0 bg-zinc-800 border border-zinc-700 rounded mt-1 max-h-48 overflow-auto shadow-lg animate-slide-up">
                  {suggestions[idx].map((s) => (
                    <div
                      key={s._id}
                      onClick={() => {
  const newSelected = [...selected]
  newSelected[idx] = s
  setSelected(newSelected)

  const newQueries = [...queries]
  newQueries[idx] = format(s.name)
  setQueries(newQueries)

  // to prevent overwrite from debounce:
  setSuggestions((prev) => {
  const copy = [...prev]
  copy[idx] = []
  return copy
})
}}
                      className="px-4 py-2 hover:bg-zinc-700 cursor-pointer text-sm border-b border-zinc-700 transition"
                    >
                      {format(s.name)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-center text-red-500 mt-4">Failed to fetch stone data</p>
        )}

        {/* Comparison Table */}
        {selected.some((s) => s !== null) && (
          <div className="overflow-auto mt-10 animate-fade-in">
            <table className="min-w-full border-collapse text-sm text-left bg-zinc-900 rounded-xl overflow-hidden shadow-lg">
              <thead className="bg-zinc-800 text-indigo-400">
                <tr>
                  <th className="w-40 p-3 font-semibold">Property</th>
                  {selected.map((stone, idx) => (
                    <th key={idx} className="p-3 font-semibold text-zinc-300">
                      {stone ? format(stone.name) : `Stone ${idx + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {[
                  { label: 'Type', accessor: (s: Stone) => s.type },
                  { label: 'Color', accessor: (s: Stone) => format(s.color) },
                  { label: 'Price 2cm', accessor: (s: Stone) => s.pricePerM2_2cm ? `€${s.pricePerM2_2cm}` : '-' },
                  { label: 'Price 3cm', accessor: (s: Stone) => s.pricePerM2_3cm ? `€${s.pricePerM2_3cm}` : '-' },
                  { label: 'Usage', accessor: (s: Stone) => s.usage.map(format).join(', ') },
                  { label: 'Location', accessor: (s: Stone) => s.location.map(format).join(', ') },
                ].map(({ label, accessor }) => (
                  <tr key={label} className="hover:bg-zinc-800 transition-colors">
                    <td className="p-3 text-indigo-300 font-medium">{label}</td>
                    {selected.map((stone, idx) => (
                      <td key={idx} className="p-3 text-zinc-200">
                        {stone ? accessor(stone) : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!selected.some((s) => s !== null) && !error && (
          <p className="text-center text-zinc-500 mt-10">Select stones above to view comparison.</p>
        )}
      </div>
    </main>
  )
}
