'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type TriggerRecord = {
  id: string
  createdTime: string
  fields: {
    Date?: string
    Trigger?: string
    Meaning?: string
    Body?: string
    Protection?: string
    Correction?: string
  }
}

type EvidenceRecord = {
  id: string
  createdTime: string
  fields: {
    Date?: string
    Evidence?: string
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function TriggerCard({ record }: { record: TriggerRecord }) {
  const [open, setOpen] = useState(false)
  const f = record.fields

  return (
    <button
      onClick={() => setOpen((o) => !o)}
      className="w-full text-left bg-white border border-stone-200 rounded-2xl p-5 active:bg-stone-50"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-3">
          <div className="text-xs text-stone-400 mb-1">{formatDate(f.Date)}</div>
          <div className="text-sm text-stone-800 font-medium line-clamp-2">{f.Trigger || '—'}</div>
        </div>
        <span className="text-stone-400 text-sm mt-0.5">{open ? '↑' : '↓'}</span>
      </div>

      {open && (
        <div className="mt-4 space-y-3 border-t border-stone-100 pt-4">
          {[
            { label: 'Meaning', value: f.Meaning },
            { label: 'Body', value: f.Body },
            { label: 'Protection', value: f.Protection },
            { label: 'Correction', value: f.Correction },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-0.5">{label}</div>
              <div className="text-sm text-stone-700">{value || '—'}</div>
            </div>
          ))}
        </div>
      )}
    </button>
  )
}

function EvidenceCard({ record }: { record: EvidenceRecord }) {
  const f = record.fields
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5">
      <div className="text-xs text-stone-400 mb-1">{formatDate(f.Date)}</div>
      <div className="text-sm text-stone-800">{f.Evidence || '—'}</div>
    </div>
  )
}

export default function HistoryPage() {
  const [tab, setTab] = useState<'triggers' | 'evidence'>('triggers')
  const [triggers, setTriggers] = useState<TriggerRecord[]>([])
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/records')
      .then((r) => r.json())
      .then((data) => {
        setTriggers(data.triggers ?? [])
        setEvidence(data.evidence ?? [])
      })
      .catch(() => setError('Could not load records.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col flex-1 px-6 py-8">
      <div className="flex items-center mb-6">
        <Link href="/" className="text-stone-500 text-sm mr-4">← Back</Link>
        <h1 className="text-xl font-semibold text-stone-800">History</h1>
      </div>

      <div className="flex bg-stone-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setTab('triggers')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'triggers' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
          }`}
        >
          Triggers
        </button>
        <button
          onClick={() => setTab('evidence')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'evidence' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
          }`}
        >
          Worth Evidence
        </button>
      </div>

      {loading && <p className="text-stone-400 text-sm text-center py-12">Loading…</p>}
      {error && <p className="text-red-400 text-sm text-center py-12">{error}</p>}

      {!loading && !error && tab === 'triggers' && (
        <div className="space-y-3">
          {triggers.length === 0 && (
            <p className="text-stone-400 text-sm text-center py-12">No triggers logged yet.</p>
          )}
          {triggers.map((r) => <TriggerCard key={r.id} record={r} />)}
        </div>
      )}

      {!loading && !error && tab === 'evidence' && (
        <div className="space-y-3">
          {evidence.length === 0 && (
            <p className="text-stone-400 text-sm text-center py-12">No worth evidence logged yet.</p>
          )}
          {evidence.map((r) => <EvidenceCard key={r.id} record={r} />)}
        </div>
      )}
    </div>
  )
}
