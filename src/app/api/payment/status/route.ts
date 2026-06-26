import { type NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:3001'

export async function GET(req: NextRequest) {
  const piId = req.nextUrl.searchParams.get('id')
  if (!piId) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const res = await fetch(`${BACKEND}/api/v1/payments/status/${piId}`)
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
