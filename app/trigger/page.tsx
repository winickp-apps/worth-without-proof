'use client'

import { useState } from 'react'
import Link from 'next/link'

function today() {
  return new Date().toISOString().split('T')[0]
}

const FIELDS = [
  {
    key: 'trigger',
    label: 'Trigger',
    hint: 'What happened?',
    placeholder: 'e.g. delayed reply, rejection, unclear payment, feeling lonely',
  },
  {
    key: 'meaning',
    label: 'Meaning',
    hint: 'What did your mind say it meant?',
    placeholder: 'e.g. "I am not enough", "I am not chosen", "I messed it up"',
  },
  {
    key: 'body',
    label: 'Body',
    hint: 'Where did it show up?',
    placeholder: 'e.g. chest, stomach, jaw, shoulders, breath',
  },
  {
    key: 'protection',
    label: 'Protection',
    hint: 'What did you want to do?',
    placeholder: 'e.g. chase, withdraw, explain, prove, check, analyse, distract',
  },
  {
    key: 'correction',
    label: 'Correction',
    hint: 'Write one cleaner sentence.',
    placeholder: 'e.g. "I feel exposed, but this does not prove I am worthless."',
  },
]

export default function TriggerPage() {
  const [date, setDate] = useState(today())
  const [fields, setFields] = useState<Record<string, string>>({
    trigger: '', meaning: '', body: '', protection: '', correction: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  function set(key: string, value: string) {
    setFields((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, ...fields }),
    })
    setStatus(res.ok ? 'done' : 'error')
  }

  if (status === 'done') {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="text-xl font-medium text-stone-800 mb-2">Logged</h2>
        <p className="text-stone-500 text-sm mb-10">You saw it clearly. That is enough.</p>
        <div className="space-y-3 w-full max-w-xs">
          <button
            onClick={() => {
              setFields({ trigger: '', meaning: '', body: '', protection: '', correction: '' })
              setDate(today())
              setStatus('idle')
            }}
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
        <h1 className="text-xl font-semibold text-stone-800">Log a Trigger</h1>
      </div>

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

        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wide mb-0.5">
              {f.label}
            </label>
            <p className="text-xs text-stone-400 mb-1.5">{f.hint}</p>
            <textarea
              value={fields[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              rows={3}
              className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
            />
          </div>
        ))}

        {status === 'error' && (
          <p className="text-red-500 text-sm">Something went wrong. Try again.</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-stone-900 text-white rounded-xl py-3.5 text-base font-medium disabled:opacity-40 active:bg-stone-700 mt-4"
        >
          {status === 'loading' ? 'Saving…' : 'Save entry'}
        </button>
      </form>
    </div>
  )
}
