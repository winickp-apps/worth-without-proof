import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { getTriggers, getEvidence } from '@/lib/airtable'

export async function GET() {
  const [triggersData, evidenceData] = await Promise.all([
    getTriggers(),
    getEvidence(),
  ])

  const wb = XLSX.utils.book_new()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const triggerRows = (triggersData.records ?? []).map((r: any) => ({
    Date: r.fields.Date ?? '',
    Trigger: r.fields.Trigger ?? '',
    Meaning: r.fields.Meaning ?? '',
    Body: r.fields.Body ?? '',
    Protection: r.fields.Protection ?? '',
    Correction: r.fields.Correction ?? '',
    'SCARF Status': r.fields['SCARF Status'] ? 'Yes' : '',
    'SCARF Certainty': r.fields['SCARF Certainty'] ? 'Yes' : '',
    'SCARF Autonomy': r.fields['SCARF Autonomy'] ? 'Yes' : '',
    'SCARF Relatedness': r.fields['SCARF Relatedness'] ? 'Yes' : '',
    'SCARF Fairness': r.fields['SCARF Fairness'] ? 'Yes' : '',
  }))

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(triggerRows), 'Trigger Log')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const evidenceRows = (evidenceData.records ?? []).map((r: any) => ({
    Date: r.fields.Date ?? '',
    Evidence: r.fields.Evidence ?? '',
  }))

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(evidenceRows), 'Worth Evidence')

  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="worth-without-proof.xlsx"',
    },
  })
}
