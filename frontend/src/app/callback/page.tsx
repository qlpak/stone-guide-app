'use client'

import { useEffect } from 'react'

export default function CallbackPage() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) return

    const exchangeCodeForToken = async () => {
      const body = new URLSearchParams()
      body.append('grant_type', 'authorization_code')
body.append('client_id', process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!)
body.append('code', code)
body.append('redirect_uri', `${process.env.NEXT_PUBLIC_REDIRECT_URI}/callback`)


      const response = await fetch(`${process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      })

      console.log('Received code:', code)

const data = await response.json()
console.log('Token response:', data)


      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('token_type', data.token_type)
        localStorage.setItem('expires_at', (Date.now() + Number(data.expires_in) * 1000).toString())
        console.log('✅ Token saved to localStorage!')
console.log('Saved token:', data.access_token)
        window.location.href = '/dashboard'
      } else {
        console.error('Token exchange failed:', data)
        alert('Failed to log in.')
        window.location.href = '/'
      }
    }

    exchangeCodeForToken()
  }, [])

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center">
      <p>Logging in...</p>
    </main>
  )
}
