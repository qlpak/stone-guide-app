'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getUserRole } from '@/utils/token'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [role, setRole] = useState<'admin' | 'user' | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setRole(getUserRole())
  }, [])

  const logout = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  if (!role) return null

  const links = [
    { href: '/dashboard', label: 'Home' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/recommendations', label: 'Recommendations' },
    { href: '/search', label: 'Search' },
    { href: '/ai', label: 'AI' },
    { href: '/compare', label: 'Compare Stones'}
  ]

  if (role === 'admin') {
    links.push({ href: '/add-stone', label: 'Create Stone' })
  }

  return (
    <nav className="w-full bg-[#0e0e10]/80 backdrop-blur-lg border-b border-zinc-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Left nav links */}
        <div className="flex flex-wrap items-center gap-5 text-sm font-semibold tracking-wide">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`group relative px-4 py-1.5 transition-all duration-300 ease-in-out rounded-md
                ${
                  pathname === href
                    ? 'text-indigo-400 after:scale-x-100 after:opacity-100'
                    : 'text-gray-400 hover:text-gray-200'
                }
              `}
            >
              <span className="relative z-10">{label}</span>
              {/* Underline animation */}
              <span
                className="absolute left-0 bottom-0 w-full h-[2px] bg-indigo-500 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 origin-center transition-transform duration-300"
              ></span>
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <span
            className={`text-xs px-3 py-1 rounded-full border shadow-sm tracking-wide font-medium transition-all
              ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-purple-800 to-indigo-900 text-indigo-300 border-indigo-700 animate-pulse'
                  : 'bg-gradient-to-r from-teal-800 to-cyan-900 text-cyan-300 border-cyan-700'
              }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>

          <button
            onClick={logout}
            className="text-sm bg-zinc-900 text-zinc-300 border border-zinc-700 px-4 py-1.5 rounded-md hover:text-red-400 hover:border-red-500 transition-all duration-200 active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
