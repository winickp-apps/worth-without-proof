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

const SCARF_ITEMS = [
  {
    key: 'scarfStatus',
    label: 'Status',
    description: 'Do I matter here?',
    triggers: 'Public correction or criticism, being ignored or overlooked, ideas dismissed, loss of respect or recognition, comparison with others.',
    helps: 'Give recognition, acknowledge, protect dignity.',
  },
  {
    key: 'scarfCertainty',
    label: 'Certainty',
    description: 'Do I know what is happening?',
    triggers: 'Unclear goals or decisions, constant change, mixed messages, lack of information, surprises.',
    helps: 'Give clarity, share information, communicate early.',
  },
  {
    key: 'scarfAutonomy',
    label: 'Autonomy',
    description: 'Do I have choice?',
    triggers: 'Being micromanaged, no input in decisions, feeling controlled, "you have to" language, no flexibility.',
    helps: 'Explain the why, ask for input, support independence.',
  },
  {
    key: 'scarfRelatedness',
    label: 'Relatedness',
    description: 'Am I safe with you?',
    triggers: 'Feeling excluded, curt or harsh tone, broken trust, loss of connection, feeling isolated.',
    helps: 'Build trust, be present, include and listen.',
  },
  {
    key: 'scarfFairness',
    label: 'Fairness',
    description: 'Is this just?',
    triggers: 'Unfair treatment, unclear rules, favouritism, broken promises, unequal rewards.',
    helps: 'Keep promises, apply rules fairly, explain decisions.',
  },
]

const SCARF_INITIAL: Record<string, boolean> = {
  scarfStatus: false,
  scarfCertainty: false,
  scarfAutonomy: false,
  scarfRelatedness: false,
  scarfFairness: false,
}

export default function TriggerPage() {
  const [date, setDate] = useState(today())
  const [fields, setFields] = useState<Record<string, string>>({
    trigger: '', meaning: '', body: '', protection: '', correction: '',
  })
  const [scarf, setScarf] = useState<Record<string, boolean>>(SCARF_INITIAL)
  const [scarfInfoOpen, setScarfInfoOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  function set(key: string, value: string) {
    setFields((f) => ({ ...f, [key]: value }))
  }

  function toggleScarf(key: string) {
    setScarf((s) => ({ ...s, [key]: !s[key] }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, ...fields, ...scarf }),
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
              setScarf(SCARF_INITIAL)
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

            {f.key === 'trigger' && (
              <div className="mt-3 border border-stone-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-stone-50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">SCARF</span>
                    <span className="text-xs text-stone-400 ml-2">Which needs were threatened?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setScarfInfoOpen((o) => !o)}
                    className="text-xs text-stone-400 underline underline-offset-2 shrink-0 ml-3"
                  >
                    {scarfInfoOpen ? 'Hide info' : 'What is SCARF?'}
                  </button>
                </div>

                {scarfInfoOpen && (
                  <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 space-y-4">
                    {SCARF_ITEMS.map((item) => (
                      <div key={item.key}>
                        <div className="text-xs font-semibold text-stone-700">
                          {item.label[0]} — {item.label}
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">{item.description}</div>
                        <div className="text-xs text-stone-500 mt-1">
                          <span className="text-emerald-600 font-medium">What helps:</span> {item.helps}
                        </div>
                        <div className="text-xs text-stone-500">
                          <span className="text-red-500 font-medium">Triggers:</span> {item.triggers}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="px-4 py-3 space-y-3 border-t border-stone-100 bg-white">
                  {SCARF_ITEMS.map((item) => (
                    <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scarf[item.key]}
                        onChange={() => toggleScarf(item.key)}
                        className="w-5 h-5 rounded border-stone-300 accent-stone-900 cursor-pointer"
                      />
                      <span className="text-sm text-stone-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
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
