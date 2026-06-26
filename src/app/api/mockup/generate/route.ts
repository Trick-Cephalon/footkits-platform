import { type NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const view = request.nextUrl.searchParams.get('view') ?? 'front'
  const format = request.nextUrl.searchParams.get('format') ?? 'png'

  const endpoint = format === 'pdf' ? 'pdf' : format === 'svg' ? 'svg' : `png?view=${view}`

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/mockup/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Falha ao gerar mockup' }, { status: res.status })
    }

    const contentType = res.headers.get('content-type') ?? 'image/png'
    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Backend indisponível' }, { status: 503 })
  }
}
