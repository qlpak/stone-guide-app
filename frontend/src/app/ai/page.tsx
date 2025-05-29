'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image as ImageIcon, Bot } from 'lucide-react'
import { useAuthRedirect } from '@/utils/useAuthRedirect'


type Prediction = {
  rank: number
  stone: string
  probability: number
}

export default function AIRecognitionPage() {
  useAuthRedirect(['admin', 'user'])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<Prediction[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lapStarted, setLapStarted] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setPredictions(null)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!imageFile || loading) return
    setLapStarted(true)
    setPredictions(null)
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('image', imageFile)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AI_API_URL}/`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Prediction failed')
      const data = await res.json()
      setPredictions(data)
    } catch (err) {
      console.error('Prediction error:', err)
      setError('Failed to predict. Please try again.')
    } finally {
      setLoading(false)
      setTimeout(() => setLapStarted(false), 1000)
    }
  }

  return (
    <main className="min-h-screen bg-[#0e0e1a] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Upload & Predict */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Bot className="text-indigo-400" />
            AI Stone Recognition
          </h1>

          <label className="block">
            <span className="text-sm text-zinc-400 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Stone Image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 w-full text-sm text-zinc-300 file:bg-[#1a1a2f] file:border file:border-zinc-600 file:rounded file:px-4 file:py-2 file:text-sm file:text-white file:cursor-pointer hover:file:bg-[#22223a] transition-all duration-300"
            />
          </label>

          {previewUrl && (
            <motion.img
              src={previewUrl}
              alt="Preview"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-64 object-cover rounded-lg border border-zinc-700 shadow-xl"
            />
          )}

          <button
            onClick={handleSubmit}
            disabled={!imageFile || loading}
            className="relative w-full py-3 px-4 text-white rounded-full font-semibold tracking-wide bg-gradient-to-r from-indigo-700 via-indigo-900 to-indigo-800 shadow-lg overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-20 text-lg">{loading ? 'Analyzing...' : 'Guess The Stone'}</span>

            {!loading && lapStarted && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="absolute inset-0 bg-indigo-500/30 rounded-full z-10"
                style={{ transformOrigin: 'left' }}
              />
            )}
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </motion.div>

        {/* Result Rankings */}
        {predictions && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
              <ImageIcon className="text-indigo-300" />
              Top 3 Predictions
            </h2>

            <div className="space-y-4">
              {predictions.map((p, index) => (
                <motion.div
                  key={p.rank}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.2 }}
                  className="bg-[#1a1a2f] border border-indigo-700/40 rounded-xl px-5 py-4 shadow-md flex items-center justify-between hover:scale-[1.01] transition duration-300"
                >
                  <div className="text-sm text-indigo-400 font-bold tracking-wide">
                    {['🥇 1st', '🥈 2nd', '🥉 3rd'][index]}
                  </div>
                  <div className="text-white font-medium text-lg">
                    {p.stone.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="text-sm text-zinc-400 font-mono">
                    {(p.probability * 100).toFixed(1)}%
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
