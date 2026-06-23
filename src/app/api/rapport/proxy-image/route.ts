import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'URL manquante' }, { status: 400 })

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RapportBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return NextResponse.json({ error: 'Image inaccessible' }, { status: 400 })
    const contentType = res.headers.get('content-type') ?? 'image/jpeg'
    const buffer = await res.arrayBuffer()
    return new NextResponse(buffer, { headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=86400' } })
  } catch {
    return NextResponse.json({ error: 'Erreur de récupération' }, { status: 500 })
  }
}
