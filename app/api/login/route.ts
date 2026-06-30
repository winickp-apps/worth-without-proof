import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const correct = process.env.SITE_PASSWORD

  if (!correct || password !== correct) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }

  const secret = process.env.SESSION_SECRET
  if (!secret) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })

  const res = NextResponse.json({ ok: true })
  res.cookies.set('wwp_session', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })
  return res
}
