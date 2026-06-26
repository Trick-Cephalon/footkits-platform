import { type NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:3001'

// Forward Stripe webhooks to the NestJS backend which handles signature verification
export async function POST(req: NextRequest) {
  const rawBody = await req.arrayBuffer()
  const sig = req.headers.get('stripe-signature') ?? ''

  const res = await fetch(`${BACKEND}/api/v1/payments/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'stripe-signature': sig,
    },
    body: rawBody,
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
