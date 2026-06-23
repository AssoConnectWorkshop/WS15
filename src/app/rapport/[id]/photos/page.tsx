'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport, Photo } from '@/lib/report-store'
import type { FetchedImage } from '@/app/api/rapport/fetch-photos/route'

const SECTIONS = [
  { id: 'jardinage', label: '🌱 Jardinage' },
  { id: 'ateliers', label: '📚 Ateliers' },
  { id: 'evenements', label: '🎉 Événements' },
  { id: 'benevoles', label: '🙌 Bénévoles' },
  { id: 'autre', label: '📷 Autre' },
]

const MAX_PHOTOS = 25

export default function PhotosPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [photos, setPhotos] = useState<Photo[]>([])
  const [dragging, setDragging] = useState(false)
  const [ready, setReady] = useState(false)
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [fetchLoading, setFetchLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [fetchedImages, setFetchedImages] = useState<FetchedImage[]>([])
  const [selectedFetched, setSelectedFetched] = useState<Set<string>>(new Set())
  const [showFetchPanel, setShowFetchPanel] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const report = getReport(id)
    if (!report) { router.push('/rapport'); return }
    setPhotos(report.photos)
    setReady(true)
  }, [id, router])

  function persistPhotos(updated: Photo[]) {
    setPhotos(updated)
    updateReport(id, { photos: updated })
  }

  function handleFiles(files: FileList) {
    const remaining = MAX_PHOTOS - photos.length
    Array.from(files).slice(0, remaining).filter(f => f.type.startsWith('image/')).forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        const dataUrl = e.target?.result as string
        setPhotos(prev => {
          const updated = [...prev, { id: crypto.randomUUID(), dataUrl, caption: '', section: 'autre', featured: false }]
          updateReport(id, { photos: updated })
          return updated
        })
      }
      reader.readAsDataURL(file)
    })
  }

  async function handleFetchFromWebsite() {
    if (!websiteUrl.trim()) return
    setFetchLoading(true)
    setFetchError('')
    setFetchedImages([])
    try {
      const res = await fetch('/api/rapport/fetch-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: websiteUrl }),
      })
      const data = await res.json() as { images?: FetchedImage[]; error?: string }
      if (data.error) { setFetchError(data.error); return }
      setFetchedImages(data.images ?? [])
      if ((data.images ?? []).length === 0) setFetchError('Aucune image trouvée sur cette page.')
    } catch {
      setFetchError('Impossible d\'accéder au site. Vérifiez l\'URL.')
    } finally {
      setFetchLoading(false)
    }
  }

  async function importSelectedImages() {
    const toImport = fetchedImages.filter(img => selectedFetched.has(img.src))
    const remaining = MAX_PHOTOS - photos.length
    const limited = toImport.slice(0, remaining)

    const newPhotos: Photo[] = await Promise.all(
      limited.map(async (img) => {
        try {
          const res = await fetch(`/api/rapport/proxy-image?url=${encodeURIComponent(img.src)}`)
          if (!res.ok) throw new Error()
          const blob = await res.blob()
          const dataUrl = await new Promise<string>(resolve => {
            const reader = new FileReader()
            reader.onload = e => resolve(e.target?.result as string)
            reader.readAsDataURL(blob)
          })
          return { id: crypto.randomUUID(), dataUrl, caption: img.alt ?? '', section: 'autre', featured: false }
        } catch {
          return null
        }
      })
    ).then(results => results.filter((p): p is Photo => p !== null))

    persistPhotos([...photos, ...newPhotos])
    setSelectedFetched(new Set())
    setFetchedImages([])
    setShowFetchPanel(false)
    setWebsiteUrl('')
  }

  function updatePhoto(photoId: string, changes: Partial<Photo>) {
    persistPhotos(photos.map(p => p.id === photoId ? { ...p, ...changes } : p))
  }

  function toggleFeatured(photoId: string) {
    const photo = photos.find(p => p.id === photoId)
    if (!photo) return
    if (photo.featured) {
      updatePhoto(photoId, { featured: false })
    } else if (photos.filter(p => p.featured).length < 5) {
      updatePhoto(photoId, { featured: true })
    }
  }

  if (!ready) return null

  const featuredCount = photos.filter(p => p.featured).length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Photos 📸</h1>
          <p className="text-slate-500 mt-1">Un rapport avec des photos, c&apos;est un rapport qu&apos;on garde. Souriez !</p>
        </div>
        <span className="text-sm font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">{photos.length} / {MAX_PHOTOS}</span>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-2xl">⭐</span>
        <p className="text-sm text-amber-800">
          Marquez jusqu&apos;à <strong>5 photos en vedette</strong> (étoile ★) pour qu&apos;elles apparaissent en grand dans le rapport.
          {featuredCount > 0 && <span className="ml-1 font-semibold">{featuredCount}/5 sélectionnées.</span>}
        </p>
      </div>

      {/* Import from website */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowFetchPanel(p => !p)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌐</span>
            <div>
              <p className="font-semibold text-slate-800">Importer depuis votre site internet</p>
              <p className="text-sm text-slate-400">Collez l&apos;URL de votre site et on récupère les photos disponibles</p>
            </div>
          </div>
          <span className="text-slate-300">{showFetchPanel ? '▲' : '▼'}</span>
        </button>

        {showFetchPanel && (
          <div className="border-t border-slate-100 p-6 bg-slate-50 space-y-4">
            <div className="flex gap-3">
              <input
                type="url"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFetchFromWebsite()}
                placeholder="https://www.votre-association.fr"
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
              <button
                onClick={handleFetchFromWebsite}
                disabled={fetchLoading || !websiteUrl.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
              >
                {fetchLoading ? '⏳ Chargement…' : '🔍 Chercher'}
              </button>
            </div>

            {fetchError && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{fetchError}</p>
            )}

            {fetchedImages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">{fetchedImages.length} photos trouvées — sélectionnez celles à importer</p>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedFetched(new Set(fetchedImages.map(i => i.src)))} className="text-xs text-indigo-600 hover:underline">Tout sélectionner</button>
                    <button onClick={() => setSelectedFetched(new Set())} className="text-xs text-slate-400 hover:underline">Désélectionner</button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 max-h-72 overflow-y-auto">
                  {fetchedImages.map(img => (
                    <button
                      key={img.src}
                      onClick={() => setSelectedFetched(prev => {
                        const next = new Set(prev)
                        if (next.has(img.src)) { next.delete(img.src) } else { next.add(img.src) }
                        return next
                      })}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${selectedFetched.has(img.src) ? 'border-indigo-500 ring-2 ring-indigo-300' : 'border-transparent hover:border-slate-300'}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.src} alt={img.alt} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }} />
                      {selectedFetched.has(img.src) && (
                        <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                          <span className="text-white text-lg font-bold bg-indigo-500 rounded-full w-7 h-7 flex items-center justify-center">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedFetched.size > 0 && (
                  <button
                    onClick={importSelectedImages}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Importer {selectedFetched.size} photo{selectedFetched.size > 1 ? 's' : ''} →
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload zone */}
      {photos.length < MAX_PHOTOS && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${dragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'}`}
        >
          <div className="text-5xl mb-3">📁</div>
          <p className="font-semibold text-slate-600">Glissez vos photos ou cliquez pour choisir</p>
          <p className="text-sm text-slate-400 mt-1">JPG, PNG, WebP — jusqu&apos;à {MAX_PHOTOS} photos</p>
          <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
        </div>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className={`bg-white rounded-2xl border overflow-hidden shadow-sm ${photo.featured ? 'border-amber-400 ring-2 ring-amber-200' : 'border-slate-200'}`}>
              <div className="relative aspect-video bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.dataUrl} alt={photo.caption || 'Photo'} className="w-full h-full object-cover" />
                <button onClick={() => toggleFeatured(photo.id)} title="Photo vedette" className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-base shadow transition-all ${photo.featured ? 'bg-amber-400 text-white' : 'bg-white/90 text-slate-300 hover:text-amber-400'}`}>★</button>
                <button onClick={() => persistPhotos(photos.filter(p => p.id !== photo.id))} className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 text-slate-400 hover:text-red-500 flex items-center justify-center text-xs shadow transition-colors">✕</button>
                {photo.featured && <div className="absolute bottom-2 left-2 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">Vedette</div>}
              </div>
              <div className="p-3 space-y-2">
                <input type="text" value={photo.caption} onChange={e => updatePhoto(photo.id, { caption: e.target.value })} placeholder="Légende…" className="w-full text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                <select value={photo.section} onChange={e => updatePhoto(photo.id, { section: e.target.value })} className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white">
                  {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <div className="text-center py-4 text-slate-400 text-sm">
          Pas de photos ? Ce n&apos;est pas grave, l&apos;IA peut générer le rapport sans. Mais avec, c&apos;est tellement mieux ! 😉
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={() => router.push(`/rapport/${id}/generateur`)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          {photos.length === 0 ? 'Passer sans photos →' : 'Générer le rapport →'}
        </button>
      </div>
    </div>
  )
}
