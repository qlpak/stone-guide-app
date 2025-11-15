'use client'

import { useEffect, useState } from 'react'
import { Mountain, KeyRound } from 'lucide-react'
import AuthSheet from '@/components/AuthSheet'
// import { decodeToken } from '@/utils/token'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
  const hash = window.location.hash
  if (hash.includes('access_token')) {
    const params = new URLSearchParams(hash.substring(1))
    const token = params.get('access_token')
    const expiresIn = params.get('expires_in')
    const tokenType = params.get('token_type')

    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('token_type', tokenType || 'Bearer')
      localStorage.setItem('expires_at', (Date.now() + Number(expiresIn) * 1000).toString())
      window.location.href = '/dashboard' // reload without hash
    }
  }

  if (localStorage.getItem('token')) {
    setIsLoggedIn(true)
  }

  const handleKeyDown = () => {
    if (!showAuth) setShowAuth(true)
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [showAuth])


  if (isLoggedIn) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-zinc-100 bg-zinc-900">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Mountain className="w-10 h-10 text-indigo-400" /> Welcome back!
        </h1>
        <p className="text-zinc-400">You are logged in. Start exploring.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center transition-all duration-500">
      {!showAuth ? (
        <div className="text-center animate-fadeIn">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-4">
            <Mountain className="w-12 h-12 text-indigo-400 animate-pulse" /> Stone Guide
          </h1>
          <p className="text-lg text-zinc-400 flex items-center justify-center gap-2">
            <KeyRound className="w-5 h-5" /> Press any key to enter the world of stones.
          </p>
        </div>
      ) : (
        <AuthSheet />
      )}
    </main>
  )
}
