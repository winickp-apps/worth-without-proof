import { NextResponse } from 'next/server'
import { getTriggers, getEvidence } from '@/lib/airtable'

export async function GET() {
  try {
    const [triggers, evidence] = await Promise.all([getTriggers(), getEvidence()])
    return NextResponse.json({ triggers: triggers.records, evidence: evidence.records })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
