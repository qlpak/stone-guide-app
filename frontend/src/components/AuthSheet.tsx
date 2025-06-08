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
    <div className="w-full max-w-md bg-[#0f0f11] rounded-lg shadow-2xl p-8 animate-slideUp border border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </h2>
      <div className="space-y-4">
        <button
          onClick={handleLogin}
          className="w-full bg-slate-700 hover:bg-slate-600 text-gray-100 py-2 rounded transition-colors"
        >
          {mode === 'login' ? 'Login with Keycloak' : 'Sign up with Keycloak'}
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
