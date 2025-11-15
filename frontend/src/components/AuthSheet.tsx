'use client'

import { useState } from 'react'
import { getLoginUrl } from '@/utils/auth'

export default function AuthSheet() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const handleLogin = () => {
    const url = getLoginUrl()
    if (!url || !url.startsWith('http')) {
      alert('Invalid login URL')
      return
    }
    window.location.href = url
  }

  return (
    <div className="w-full max-w-md bg-[#0f0f11]/60 backdrop-blur-2xl rounded-lg shadow-2xl shadow-indigo-900/30 p-8 animate-slideUp border border-gray-700/50">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </h2>
      <div className="space-y-4">
        <button
          onClick={handleLogin}
          className="relative overflow-hidden w-full bg-slate-700/80 backdrop-blur-sm hover:bg-slate-600/80 text-gray-100 py-2 rounded transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/20 group"
        >
          <span className="relative z-10">{mode === 'login' ? 'Login with Keycloak' : 'Sign up with Keycloak'}</span>
          <span className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
        </button>
      </div>

      <div className="text-center mt-4 text-sm text-gray-500">
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => setMode('signup')}
              className="text-slate-300 hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setMode('login')}
              className="text-slate-300 hover:underline"
            >
              Log in
            </button>
          </>
        )}
      </div>
    </div>
  )
}
