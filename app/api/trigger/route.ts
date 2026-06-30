import { NextRequest, NextResponse } from 'next/server'
import { createTrigger } from '@/lib/airtable'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const record = await createTrigger(data)
    return NextResponse.json(record)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
