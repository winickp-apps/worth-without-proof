'use client'

import { useState } from 'react'
import Link from 'next/link'

function today() {
  return new Date().toISOString().split('T')[0]
}

export default function EvidencePage() {
  const [date, setDate] = useState(today())
  const [evidence, setEvidence] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, evidence }),
    })
    setStatus(res.ok ? 'done' : 'error')
  }

  if (status === 'done') {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="text-xl font-medium text-stone-800 mb-2">Logged</h2>
        <p className="text-stone-500 text-sm mb-10">Worth from within. That counts.</p>
        <div className="space-y-3 w-full max-w-xs">
          <button
            onClick={() => { setEvidence(''); setDate(today()); setStatus('idle') }}
            className="block w-full bg-stone-900 text-white rounded-xl py-3.5 text-base font-medium text-center"
          >
            Log another
          </button>
          <Link href="/" className="block w-full border border-stone-300 text-stone-700 rounded-xl py-3.5 text-base font-medium text-center">
            Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 px-6 py-8">
      <div className="flex items-center mb-8">
        <Link href="/" className="text-stone-500 text-sm mr-4">← Back</Link>
        <h1 className="text-xl font-semibold text-stone-800">Worth Evidence</h1>
      </div>

      <p className="text-stone-500 text-sm mb-8">
        One example from today where your worth came from action, values, care, discipline, honesty, repair, or courage — not from approval.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1">
        <div>
          <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1.5">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1.5">Evidence</label>
          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="e.g. I showed up honestly in a hard conversation even though no one validated me for it."
            rows={6}
            className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
          />
        </div>

        {status === 'error' && (
          <p className="text-red-500 text-sm">Something went wrong. Try again.</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || !evidence.trim()}
          className="w-full bg-stone-900 text-white rounded-xl py-3.5 text-base font-medium disabled:opacity-40 active:bg-stone-700"
        >
          {status === 'loading' ? 'Saving…' : 'Save entry'}
        </button>
      </form>
    </div>
  )
}
