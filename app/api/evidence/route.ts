import { NextRequest, NextResponse } from 'next/server'
import { createEvidence } from '@/lib/airtable'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const record = await createEvidence(data)
    return NextResponse.json(record)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
