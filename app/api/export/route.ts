import { NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import { getTriggers, getEvidence } from '@/lib/airtable'

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF2D2D2D' },
}

const HEADER_FONT: Partial<ExcelJS.Font> = {
  bold: true,
  color: { argb: 'FFFFFFFF' },
  size: 11,
}

const WRAP: Partial<ExcelJS.Alignment> = {
  wrapText: true,
  vertical: 'top',
}

const BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
  left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
  bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
  right: { style: 'thin', color: { argb: 'FFD0D0D0' } },
}

function styleHeader(row: ExcelJS.Row) {
  row.height = 28
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL
    cell.font = HEADER_FONT
    cell.alignment = { ...WRAP, horizontal: 'center' }
    cell.border = BORDER
  })
}

function styleDataRow(row: ExcelJS.Row, rowIndex: number) {
  const bg = rowIndex % 2 === 0 ? 'FFFAFAFA' : 'FFFFFFFF'
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }
    cell.alignment = WRAP
    cell.border = BORDER
    cell.font = { size: 11 }
  })
}

export async function GET() {
  const [triggersData, evidenceData] = await Promise.all([
    getTriggers(),
    getEvidence(),
  ])

  const wb = new ExcelJS.Workbook()
  wb.creator = 'Worth Without Proof'

  // ── Trigger Log sheet ────────────────────────────────────────────────────
  const triggerSheet = wb.addWorksheet('Trigger Log', {
    views: [{ state: 'frozen', ySplit: 1 }],
  })

  triggerSheet.columns = [
    { header: 'Date',               key: 'date',       width: 14 },
    { header: 'Trigger',            key: 'trigger',    width: 40 },
    { header: 'Meaning Made',       key: 'meaning',    width: 40 },
    { header: 'Body Sensation',     key: 'body',       width: 32 },
    { header: 'Protection Strategy',key: 'protection', width: 36 },
    { header: 'Correction',         key: 'correction', width: 40 },
    { header: 'SCARF Status',       key: 's_status',   width: 14 },
    { header: 'SCARF Certainty',    key: 's_certainty',width: 16 },
    { header: 'SCARF Autonomy',     key: 's_autonomy', width: 16 },
    { header: 'SCARF Relatedness',  key: 's_related',  width: 17 },
    { header: 'SCARF Fairness',     key: 's_fairness', width: 15 },
  ]

  styleHeader(triggerSheet.getRow(1))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const triggerRecords = triggersData.records ?? [] as any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  triggerRecords.forEach((r: any, i: number) => {
    const row = triggerSheet.addRow({
      date:        r.fields.Date ?? '',
      trigger:     r.fields.Trigger ?? '',
      meaning:     r.fields.Meaning ?? '',
      body:        r.fields.Body ?? '',
      protection:  r.fields.Protection ?? '',
      correction:  r.fields.Correction ?? '',
      s_status:    r.fields['SCARF Status'] ? '✓' : '',
      s_certainty: r.fields['SCARF Certainty'] ? '✓' : '',
      s_autonomy:  r.fields['SCARF Autonomy'] ? '✓' : '',
      s_related:   r.fields['SCARF Relatedness'] ? '✓' : '',
      s_fairness:  r.fields['SCARF Fairness'] ? '✓' : '',
    })
    styleDataRow(row, i)
    // Center the SCARF checkmark columns
    for (let col = 7; col <= 11; col++) {
      row.getCell(col).alignment = { ...WRAP, horizontal: 'center' }
    }
  })

  // ── Worth Evidence sheet ─────────────────────────────────────────────────
  const evidenceSheet = wb.addWorksheet('Worth Evidence', {
    views: [{ state: 'frozen', ySplit: 1 }],
  })

  evidenceSheet.columns = [
    { header: 'Date',     key: 'date',     width: 14 },
    { header: 'Evidence', key: 'evidence', width: 80 },
  ]

  styleHeader(evidenceSheet.getRow(1))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const evidenceRecords = evidenceData.records ?? [] as any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evidenceRecords.forEach((r: any, i: number) => {
    const row = evidenceSheet.addRow({
      date:     r.fields.Date ?? '',
      evidence: r.fields.Evidence ?? '',
    })
    styleDataRow(row, i)
  })

  const buf = await wb.xlsx.writeBuffer()

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="worth-without-proof.xlsx"',
    },
  })
}
