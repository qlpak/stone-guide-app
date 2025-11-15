import './globals.css'
import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import PageTransition from '@/components/PageTransition'

export const metadata = {
  title: 'Stone Guide',
  description: 'Find and compare natural stone easily',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-900 text-zinc-100 font-sans antialiased">
        <Navbar />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
