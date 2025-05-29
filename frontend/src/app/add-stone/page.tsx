"use client"

import { useState } from "react"
import { Gem, MapPin, Loader2 } from "lucide-react"
import { useAuthRedirect } from '@/utils/useAuthRedirect'

const stoneTypes = ["granite", "marble", "quartzite", "onyx", "travertine"]
const showroomLocations = [
  "Container 1",
  "Container 2",
  "Container 3",
  "Container 4",
  "Container 5",
  "Container 6",
  "Container 7",
  "Container 8",
  "Container 9",
  "Container 10",
  "Container 11",
  "Dispatcher - Table",
  "Dispatcher - Shelf",
]

type StoneForm = {
  name: string
  type: string
  color: string
  pricePerM2_2cm: string
  pricePerM2_3cm: string
  usage: string
  location: string[]
}

export default function AddStonePage() {
  useAuthRedirect(['admin'])
  const [form, setForm] = useState<StoneForm>({
    name: "",
    type: "",
    color: "",
    pricePerM2_2cm: "",
    pricePerM2_3cm: "",
    usage: "",
    location: [],
  })

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const token = localStorage.getItem("token")
    if (!token) {
  setMessage("Not authorized.")
  setLoading(false)
  return
}


    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stones/add-stone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          pricePerM2_2cm: form.pricePerM2_2cm ? parseFloat(form.pricePerM2_2cm) : undefined,
          pricePerM2_3cm: form.pricePerM2_3cm ? parseFloat(form.pricePerM2_3cm) : undefined,
          usage: form.usage.split(",").map((s) => s.trim()),
          location: form.location,
        }),
      })

      if (!res.ok) throw new Error("Failed to create stone")

      const data = await res.json()
      setMessage(`✅ Stone "${data.name}" created successfully!`)
      setForm({
        name: "",
        type: "",
        color: "",
        pricePerM2_2cm: "",
        pricePerM2_3cm: "",
        usage: "",
        location: [],
      })
    } catch (err) {
      console.error(err)
      setMessage("Failed to create stone")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0e0e1c] via-[#0f0f1f] to-[#10101e] text-zinc-100 px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-center text-indigo-400 flex items-center justify-center gap-2">
          <Gem className="w-6 h-6" /> Create New Stone
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-[#1a1a2f] p-6 rounded-2xl shadow-xl border border-zinc-700"
        >
          {(["name", "color"] as (keyof StoneForm)[]).map((field) => (
            <input
              key={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required
              className="w-full p-3 bg-[#12121e] border border-zinc-700 rounded-md placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          ))}

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#12121e] border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="">Select type</option>
            {stoneTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              step="0.01"
              name="pricePerM2_2cm"
              value={form.pricePerM2_2cm}
              onChange={handleChange}
              placeholder="Price per m² (2cm)"
              className="w-full p-3 bg-[#12121e] border border-zinc-700 rounded-md placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <input
              type="number"
              step="0.01"
              name="pricePerM2_3cm"
              value={form.pricePerM2_3cm}
              onChange={handleChange}
              placeholder="Price per m² (3cm)"
              className="w-full p-3 bg-[#12121e] border border-zinc-700 rounded-md placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <input
            name="usage"
            value={form.usage}
            onChange={handleChange}
            placeholder="Usage (comma-separated)"
            required
            className="w-full p-3 bg-[#12121e] border border-zinc-700 rounded-md placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          <div className="space-y-2">
            <label className="text-sm text-zinc-400 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Showroom Location
            </label>
            <div className="flex flex-wrap gap-2">
              {showroomLocations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      location: prev.location.includes(loc)
                        ? prev.location.filter((l) => l !== loc)
                        : [...prev.location, loc],
                    }))
                  }
                  className={`relative px-4 py-2 text-sm font-medium rounded-full z-10 transition-all duration-300 ease-in-out
                    ${form.location.includes(loc)
                      ? 'bg-gradient-to-r from-indigo-800 via-[#1a1433] to-indigo-900 text-white shadow-lg shadow-indigo-800/40'
                      : 'bg-[#1c1c3a] text-zinc-300 hover:bg-[#232343]'}
                  `}
                >
                  <span className="relative z-20">{loc}</span>
                  {form.location.includes(loc) && (
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
  stroke="#a78bfa" // or a soft neon tone
filter="drop-shadow(0 0 4px #6366f1)"

  strokeWidth="2"
  className="animate-border-lap"
/>

                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 p-3 rounded-md text-white font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Saving..." : "Create Stone"}
          </button>
        </form>

        {message && (
          <p
            className={`text-center text-sm mt-2 ${message.startsWith("✅") ? "text-green-400" : "text-red-400"}`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  )
}