import { NextRequest, NextResponse } from 'next/server'

export type FetchedImage = {
  src: string
  alt: string
  width?: number
  height?: number
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json() as { url: string }

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'URL invalide' }, { status: 400 })
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RapportBot/1.0)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Impossible d'accéder au site (${res.status})` }, { status: 400 })
    }

    const html = await res.text()
    const baseUrl = new URL(url).origin

    const images: FetchedImage[] = []
    const seen = new Set<string>()

    // Extract og:image
    const ogMatches = html.matchAll(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi)
    for (const m of ogMatches) {
      const src = resolveUrl(m[1], baseUrl)
      if (src && !seen.has(src)) { seen.add(src); images.push({ src, alt: 'Image de partage' }) }
    }

    // Extract <img> tags
    const imgMatches = html.matchAll(/<img[^>]+src=["']([^"']+)["'](?:[^>]+alt=["']([^"']*)["'])?[^>]*>/gi)
    for (const m of imgMatches) {
      const src = resolveUrl(m[1], baseUrl)
      if (!src || seen.has(src)) continue
      if (src.match(/\.(jpg|jpeg|png|webp|gif)/i) && !src.includes('logo') && !src.includes('icon') && !src.includes('avatar')) {
        seen.add(src)
        images.push({ src, alt: m[2] ?? '' })
        if (images.length >= 30) break
      }
    }

    return NextResponse.json({ images: images.slice(0, 30) })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ error: `Erreur : ${msg}` }, { status: 500 })
  }
}

function resolveUrl(src: string, base: string): string | null {
  try {
    if (src.startsWith('data:')) return null
    if (src.startsWith('//')) return 'https:' + src
    if (src.startsWith('http')) return src
    return base + (src.startsWith('/') ? src : '/' + src)
  } catch {
    return null
  }
}
