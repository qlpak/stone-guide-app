'use client'

import { useEffect, useState } from 'react'
import { Home, Calculator, Brain, Search, Image, PlusCircle, GitCompare } from 'lucide-react'
import { decodeToken } from '@/utils/token'

export default function Dashboard() {
  const [username, setUsername] = useState<string | null>(null)
  const [role, setRole] = useState<'admin' | 'user' | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      location.href = '/'
      return
    }

    const decoded = decodeToken(token)
    if (!decoded) {
      location.href = '/'
      return
    }

    setUsername(decoded.preferred_username)

    const roles = decoded.realm_access?.roles || []
    if (roles.includes('admin')) setRole('admin')
    else if (roles.includes('user')) setRole('user')
  }, [])

  if (!username || !role) return null

  return (
    <main className="min-h-screen bg-[#0e0e10] text-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 text-slate-100">
          Welcome, {username}!
        </h1>
        <p className="text-gray-400 mb-10">
          You are logged in as <strong>{role}</strong>. Here&apos;s what you can do:
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {[
  { icon: Home, label: 'Home', desc: 'View this dashboard and check your login status.' },
  { icon: Calculator, label: 'Pricing', desc: 'Calculate stone pricing based on area and thickness.' },
  { icon: Brain, label: 'Recommendations', desc: 'Get recommended stones similar to a selected one.' },
  { icon: Search, label: 'Search Stones', desc: 'Browse and search through all stones by keyword, type, or color.' },
  { icon: Image, label: 'AI Recognition', desc: 'Upload a photo of stone to identify its type using AI.' },
  { icon: GitCompare, label: 'Compare Stones', desc: 'Compare multiple stones side by side.' },
  ...(role === 'admin'
    ? [{ icon: PlusCircle, label: 'Create Stone', desc: 'Add a new stone entry to the database.' }]
    : [])
].map((item, index) => {
  const IconComponent = item.icon
  return (
    <div
      key={index}
      className="group bg-zinc-800/40 hover:bg-zinc-800/70 backdrop-blur-sm transition-all duration-300 p-5 rounded-xl border border-zinc-700 hover:border-sky-500 shadow-sm hover:shadow-md hover:shadow-sky-500/20 hover:scale-[1.02] hover:-rotate-1 hover:translate-y-[-4px] cursor-pointer"
    >
      <div className="text-slate-300 font-semibold text-sm flex items-center gap-2 mb-1">
        <IconComponent className="w-5 h-5 text-indigo-400 group-hover:text-sky-400 transition-colors duration-200" />
        {item.label}
      </div>
      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition duration-200">
        {item.desc}
      </p>
    </div>
  )
})}
</div>

      </div>
    </main>
  )
}
