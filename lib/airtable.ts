const BASE = 'https://api.airtable.com/v0/appByGJVhHD1uzvdG'
const TRIGGER_TABLE = 'tblLBnDRK5O1PQJzI'
const EVIDENCE_TABLE = 'tblGjTrcXwXwvHFnX'

function headers() {
  return {
    Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  }
}

export async function createTrigger(data: {
  date: string
  trigger: string
  meaning: string
  body: string
  protection: string
  correction: string
}) {
  const res = await fetch(`${BASE}/${TRIGGER_TABLE}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      fields: {
        Date: data.date,
        Trigger: data.trigger,
        Meaning: data.meaning,
        Body: data.body,
        Protection: data.protection,
        Correction: data.correction,
      },
    }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function createEvidence(data: { date: string; evidence: string }) {
  const res = await fetch(`${BASE}/${EVIDENCE_TABLE}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      fields: { Date: data.date, Evidence: data.evidence },
    }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getTriggers() {
  const params = new URLSearchParams({
    'sort[0][field]': 'Date',
    'sort[0][direction]': 'desc',
  })
  const res = await fetch(`${BASE}/${TRIGGER_TABLE}?${params}`, {
    headers: headers(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getEvidence() {
  const params = new URLSearchParams({
    'sort[0][field]': 'Date',
    'sort[0][direction]': 'desc',
  })
  const res = await fetch(`${BASE}/${EVIDENCE_TABLE}?${params}`, {
    headers: headers(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
