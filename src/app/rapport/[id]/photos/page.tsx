'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReport, updateReport, Photo } from '@/lib/report-store'
import StepTracker from '@/components/StepTracker'

const SECTIONS = [
  { id: 'jardinage', label: 'Activités jardinage' },
  { id: 'ateliers', label: 'Ateliers & formations' },
  { id: 'evenements', label: 'Événements' },
  { id: 'benevoles', label: 'Bénévoles' },
  { id: 'autre', label: 'Autre' },
]

const MAX_PHOTOS = 25

export default function PhotosPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [photos, setPhotos] = useState<Photo[]>([])
  const [dragging, setDragging] = useState(false)
  const [ready, setReady] = useState(false)
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
    const toProcess = Array.from(files).slice(0, remaining).filter(f => f.type.startsWith('image/'))
    toProcess.forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        const dataUrl = e.target?.result as string
        const newPhoto: Photo = {
          id: crypto.randomUUID(),
          dataUrl,
          caption: '',
          section: 'autre',
          featured: false,
        }
        setPhotos(prev => {
          const updated = [...prev, newPhoto]
          updateReport(id, { photos: updated })
          return updated
        })
      }
      reader.readAsDataURL(file)
    })
  }

  function updatePhoto(photoId: string, changes: Partial<Photo>) {
    const updated = photos.map(p => p.id === photoId ? { ...p, ...changes } : p)
    persistPhotos(updated)
  }

  function removePhoto(photoId: string) {
    persistPhotos(photos.filter(p => p.id !== photoId))
  }

  function toggleFeatured(photoId: string) {
    const photo = photos.find(p => p.id === photoId)
    if (photo?.featured) {
      updatePhoto(photoId, { featured: false })
    } else {
      const featuredCount = photos.filter(p => p.featured).length
      if (featuredCount < 5) updatePhoto(photoId, { featured: true })
    }
  }

  function handleContinue() {
    updateReport(id, { status: 'generation' })
    router.push(`/rapport/${id}/generateur`)
  }

  if (!ready) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <StepTracker reportId={id} current="photos" reached="photos" />
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Photos</h1>
            <p className="text-stone-600 mt-1">Illustrez votre rapport avec des moments marquants de l&apos;année.</p>
          </div>
          <span className="text-sm font-medium text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full">
            {photos.length} / {MAX_PHOTOS}
          </span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-amber-500 text-lg">💡</span>
        <p className="text-sm text-amber-800">
          Privilégiez des photos qui racontent une histoire. Marquez jusqu&apos;à 5 photos en <strong>vedette</strong> pour qu&apos;elles apparaissent en grand dans le rapport.
        </p>
      </div>

      {/* Upload zone */}
      {photos.length < MAX_PHOTOS && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors
            ${dragging ? 'border-green-500 bg-green-50' : 'border-stone-300 bg-white hover:border-green-400 hover:bg-stone-50'}`}
        >
          <div className="text-5xl mb-3">📸</div>
          <p className="font-semibold text-stone-700">Glissez vos photos ici ou cliquez pour choisir</p>
          <p className="text-sm text-stone-500 mt-1">JPG, PNG, WebP — max {MAX_PHOTOS} photos</p>
          <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
        </div>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className={`bg-white rounded-xl border overflow-hidden shadow-sm ${photo.featured ? 'border-amber-400 ring-2 ring-amber-300' : 'border-stone-200'}`}>
              <div className="relative aspect-video bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.dataUrl} alt={photo.caption || 'Photo'} className="w-full h-full object-cover" />
                <button
                  onClick={() => toggleFeatured(photo.id)}
                  title="Photo vedette"
                  className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-base transition-colors ${photo.featured ? 'bg-amber-400 text-white' : 'bg-white/80 text-stone-400 hover:bg-amber-100'}`}
                >
                  ★
                </button>
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/80 text-stone-500 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-xs transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-3 space-y-2">
                <input
                  type="text"
                  value={photo.caption}
                  onChange={e => updatePhoto(photo.id, { caption: e.target.value })}
                  placeholder="Légende de la photo..."
                  className="w-full text-sm border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <select
                  value={photo.section}
                  onChange={e => updatePhoto(photo.id, { section: e.target.value })}
                  className="w-full text-xs border border-stone-200 rounded-lg px-2 py-1.5 text-stone-600 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                >
                  {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={handleContinue}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          {photos.length === 0 ? 'Passer sans photos →' : 'Continuer vers la génération →'}
        </button>
      </div>
    </div>
  )
}
