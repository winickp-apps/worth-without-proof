'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/')
    } else {
      const data = await res.json().catch(() => ({}))
      setError(res.status === 500 ? `Server error: ${data.error ?? 'check Vercel env vars'}` : 'Incorrect password.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-20">
      <h1 className="text-2xl font-semibold text-stone-800 mb-2">Worth Without Proof</h1>
      <p className="text-stone-500 text-sm mb-10">Enter your password to continue.</p>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full border border-stone-300 rounded-xl px-4 py-3.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-stone-900 text-white rounded-xl py-3.5 text-base font-medium disabled:opacity-40 active:bg-stone-700"
        >
          {loading ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  )
}
