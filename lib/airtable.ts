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
  scarfStatus?: boolean
  scarfCertainty?: boolean
  scarfAutonomy?: boolean
  scarfRelatedness?: boolean
  scarfFairness?: boolean
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
        'SCARF Status': data.scarfStatus ?? false,
        'SCARF Certainty': data.scarfCertainty ?? false,
        'SCARF Autonomy': data.scarfAutonomy ?? false,
        'SCARF Relatedness': data.scarfRelatedness ?? false,
        'SCARF Fairness': data.scarfFairness ?? false,
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

export async function updateTrigger(id: string, data: Record<string, string | boolean>) {
  const res = await fetch(`${BASE}/${TRIGGER_TABLE}/${id}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ fields: data }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function deleteTrigger(id: string) {
  const res = await fetch(`${BASE}/${TRIGGER_TABLE}/${id}`, {
    method: 'DELETE',
    headers: headers(),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function updateEvidence(id: string, data: Record<string, string>) {
  const res = await fetch(`${BASE}/${EVIDENCE_TABLE}/${id}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ fields: data }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function deleteEvidence(id: string) {
  const res = await fetch(`${BASE}/${EVIDENCE_TABLE}/${id}`, {
    method: 'DELETE',
    headers: headers(),
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
