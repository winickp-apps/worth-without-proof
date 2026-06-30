'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type TriggerFields = {
  Date?: string
  Trigger?: string
  Meaning?: string
  Body?: string
  Protection?: string
  Correction?: string
}

type TriggerRecord = { id: string; createdTime: string; fields: TriggerFields }
type EvidenceRecord = { id: string; createdTime: string; fields: { Date?: string; Evidence?: string } }

const TRIGGER_FIELD_DEFS = [
  { key: 'Trigger', label: 'Trigger' },
  { key: 'Meaning', label: 'Meaning' },
  { key: 'Body', label: 'Body' },
  { key: 'Protection', label: 'Protection' },
  { key: 'Correction', label: 'Correction' },
]

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
}

function toYMD(dateStr?: string) {
  return dateStr?.slice(0, 10) ?? ''
}

// ── Calendar ────────────────────────────────────────────────────────────────

function Calendar({
  month,
  countByDate,
  selected,
  onSelect,
  onMonthChange,
}: {
  month: Date
  countByDate: Record<string, number>
  selected: string | null
  onSelect: (d: string | null) => void
  onMonthChange: (delta: number) => void
}) {
  const year = month.getFullYear()
  const mon = month.getMonth()
  const label = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const firstDow = new Date(year, mon, 1).getDay()
  const daysInMonth = new Date(year, mon + 1, 0).getDate()
  const todayYMD = new Date().toISOString().slice(0, 10)

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => onMonthChange(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-500 active:bg-stone-100"
        >
          ‹
        </button>
        <span className="text-sm font-medium text-stone-700">{label}</span>
        <button
          onClick={() => onMonthChange(1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-500 active:bg-stone-100"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-[10px] text-stone-400 py-0.5">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const ymd = `${year}-${String(mon + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const count = countByDate[ymd] ?? 0
          const isSelected = selected === ymd
          const isToday = ymd === todayYMD

          return (
            <button
              key={i}
              onClick={() => onSelect(isSelected ? null : ymd)}
              className={`flex flex-col items-center justify-center h-9 rounded-lg text-xs transition-colors
                ${isSelected ? 'bg-stone-900 text-white' : isToday ? 'border border-stone-300 text-stone-800' : 'text-stone-600'}
                ${count > 0 && !isSelected ? 'font-semibold' : ''}
              `}
            >
              <span>{day}</span>
              {count > 0 && (
                <span className={`text-[9px] leading-none ${isSelected ? 'text-stone-400' : 'text-stone-400'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {selected && (
        <button
          onClick={() => onSelect(null)}
          className="mt-3 w-full text-xs text-stone-400 text-center"
        >
          Clear filter ×
        </button>
      )}
    </div>
  )
}

// ── Trigger Card ─────────────────────────────────────────────────────────────

function TriggerCard({
  record,
  onUpdate,
  onDelete,
}: {
  record: TriggerRecord
  onUpdate: (id: string, fields: TriggerFields) => void
  onDelete: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [draft, setDraft] = useState<TriggerFields>(record.fields)
  const [saving, setSaving] = useState(false)

  function setField(key: string, val: string) {
    setDraft((d) => ({ ...d, [key]: val }))
  }

  async function save() {
    setSaving(true)
    const res = await fetch(`/api/trigger/${record.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    })
    if (res.ok) {
      onUpdate(record.id, draft)
      setEditing(false)
    }
    setSaving(false)
  }

  async function remove() {
    const res = await fetch(`/api/trigger/${record.id}`, { method: 'DELETE' })
    if (res.ok) onDelete(record.id)
  }

  const f = record.fields

  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => { setOpen((o) => !o); setEditing(false); setConfirmDelete(false) }}
        className="w-full text-left p-5 active:bg-stone-50"
      >
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">
              {formatDate(f.Date)}
            </div>
            <div className="text-sm text-stone-800 font-medium leading-snug line-clamp-2">
              {f.Trigger || '—'}
            </div>
          </div>
          <span className="text-stone-400 text-base mt-0.5 shrink-0">{open ? '↑' : '↓'}</span>
        </div>
      </button>

      {open && !editing && (
        <div className="px-5 pb-5 space-y-4 border-t border-stone-100 pt-4">
          {TRIGGER_FIELD_DEFS.map(({ key, label }) => (
            <div key={key}>
              <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-0.5">{label}</div>
              <div className="text-sm text-stone-700">{(f as Record<string, string | undefined>)[key] || '—'}</div>
            </div>
          ))}

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => { setEditing(true); setDraft(f) }}
              className="flex-1 border border-stone-300 text-stone-700 rounded-xl py-2.5 text-sm font-medium active:bg-stone-50"
            >
              Edit
            </button>
            {confirmDelete ? (
              <button
                onClick={remove}
                className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-medium active:bg-red-600"
              >
                Confirm delete
              </button>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex-1 border border-stone-300 text-red-400 rounded-xl py-2.5 text-sm font-medium active:bg-stone-50"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}

      {open && editing && (
        <div className="px-5 pb-5 border-t border-stone-100 pt-4 space-y-4">
          <div>
            <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1 block">Date</label>
            <input
              type="date"
              value={draft.Date ?? ''}
              onChange={(e) => setField('Date', e.target.value)}
              className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
          {TRIGGER_FIELD_DEFS.map(({ key, label }) => (
            <div key={key}>
              <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1 block">{label}</label>
              <textarea
                rows={2}
                value={(draft as Record<string, string | undefined>)[key] ?? ''}
                onChange={(e) => setField(key, e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
              />
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => { setEditing(false); setDraft(f) }}
              className="flex-1 border border-stone-300 text-stone-600 rounded-xl py-2.5 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 bg-stone-900 text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Evidence Card ─────────────────────────────────────────────────────────────

function EvidenceCard({
  record,
  onUpdate,
  onDelete,
}: {
  record: EvidenceRecord
  onUpdate: (id: string, fields: EvidenceRecord['fields']) => void
  onDelete: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [draft, setDraft] = useState(record.fields)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    const res = await fetch(`/api/evidence/${record.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    })
    if (res.ok) {
      onUpdate(record.id, draft)
      setEditing(false)
    }
    setSaving(false)
  }

  async function remove() {
    const res = await fetch(`/api/evidence/${record.id}`, { method: 'DELETE' })
    if (res.ok) onDelete(record.id)
  }

  const f = record.fields

  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => { setOpen((o) => !o); setEditing(false); setConfirmDelete(false) }}
        className="w-full text-left p-5 active:bg-stone-50"
      >
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">
              {formatDate(f.Date)}
            </div>
            <div className="text-sm text-stone-800 font-medium leading-snug line-clamp-2">
              {f.Evidence || '—'}
            </div>
          </div>
          <span className="text-stone-400 text-base mt-0.5 shrink-0">{open ? '↑' : '↓'}</span>
        </div>
      </button>

      {open && !editing && (
        <div className="px-5 pb-5 border-t border-stone-100 pt-4 space-y-4">
          <div className="text-sm text-stone-700">{f.Evidence || '—'}</div>
          <div className="flex gap-2">
            <button
              onClick={() => { setEditing(true); setDraft(f) }}
              className="flex-1 border border-stone-300 text-stone-700 rounded-xl py-2.5 text-sm font-medium active:bg-stone-50"
            >
              Edit
            </button>
            {confirmDelete ? (
              <button
                onClick={remove}
                className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-medium"
              >
                Confirm delete
              </button>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex-1 border border-stone-300 text-red-400 rounded-xl py-2.5 text-sm font-medium"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}

      {open && editing && (
        <div className="px-5 pb-5 border-t border-stone-100 pt-4 space-y-4">
          <div>
            <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1 block">Date</label>
            <input
              type="date"
              value={draft.Date ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, Date: e.target.value }))}
              className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1 block">Evidence</label>
            <textarea
              rows={4}
              value={draft.Evidence ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, Evidence: e.target.value }))}
              className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setEditing(false); setDraft(f) }}
              className="flex-1 border border-stone-300 text-stone-600 rounded-xl py-2.5 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 bg-stone-900 text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [tab, setTab] = useState<'triggers' | 'evidence'>('triggers')
  const [triggers, setTriggers] = useState<TriggerRecord[]>([])
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })

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

  const triggerCountByDate = useMemo(() => {
    const map: Record<string, number> = {}
    triggers.forEach((r) => {
      const d = toYMD(r.fields.Date)
      if (d) map[d] = (map[d] ?? 0) + 1
    })
    return map
  }, [triggers])

  const filteredTriggers = useMemo(() => {
    if (!selectedDate) return triggers
    return triggers.filter((r) => toYMD(r.fields.Date) === selectedDate)
  }, [triggers, selectedDate])

  function handleMonthChange(delta: number) {
    setCalendarMonth((m) => {
      const d = new Date(m)
      d.setMonth(d.getMonth() + delta)
      return d
    })
  }

  function handleTriggerUpdate(id: string, fields: TriggerFields) {
    setTriggers((prev) => prev.map((r) => (r.id === id ? { ...r, fields } : r)))
  }

  function handleTriggerDelete(id: string) {
    setTriggers((prev) => prev.filter((r) => r.id !== id))
  }

  function handleEvidenceUpdate(id: string, fields: EvidenceRecord['fields']) {
    setEvidence((prev) => prev.map((r) => (r.id === id ? { ...r, fields } : r)))
  }

  function handleEvidenceDelete(id: string) {
    setEvidence((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="flex flex-col flex-1 px-6 py-8">
      <div className="flex items-center mb-6">
        <Link href="/" className="text-stone-500 text-sm mr-4">← Back</Link>
        <h1 className="text-xl font-semibold text-stone-800">History</h1>
      </div>

      <div className="flex bg-stone-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => { setTab('triggers'); setSelectedDate(null) }}
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
        <>
          <Calendar
            month={calendarMonth}
            countByDate={triggerCountByDate}
            selected={selectedDate}
            onSelect={setSelectedDate}
            onMonthChange={handleMonthChange}
          />

          {selectedDate && (
            <p className="text-xs text-stone-400 mb-3 text-center">
              Showing {filteredTriggers.length} {filteredTriggers.length === 1 ? 'entry' : 'entries'} for {formatDate(selectedDate)}
            </p>
          )}

          <div className="space-y-3">
            {filteredTriggers.length === 0 && (
              <p className="text-stone-400 text-sm text-center py-8">
                {selectedDate ? 'No triggers on this day.' : 'No triggers logged yet.'}
              </p>
            )}
            {filteredTriggers.map((r) => (
              <TriggerCard
                key={r.id}
                record={r}
                onUpdate={handleTriggerUpdate}
                onDelete={handleTriggerDelete}
              />
            ))}
          </div>
        </>
      )}

      {!loading && !error && tab === 'evidence' && (
        <div className="space-y-3">
          {evidence.length === 0 && (
            <p className="text-stone-400 text-sm text-center py-8">No worth evidence logged yet.</p>
          )}
          {evidence.map((r) => (
            <EvidenceCard
              key={r.id}
              record={r}
              onUpdate={handleEvidenceUpdate}
              onDelete={handleEvidenceDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
