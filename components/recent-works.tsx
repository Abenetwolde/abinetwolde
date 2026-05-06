'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Github, Play, Trophy, Images, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { Section } from './ui/section'
import { cn } from '@/lib/utils'
import type { RecentWork } from '@/lib/types'

interface RecentWorksProps {
  works: RecentWork[]
}

export function RecentWorks({ works }: RecentWorksProps) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? works : works.slice(0, 4)

  if (works.length === 0) return null

  return (
    <Section id="recent-works" className="py-20 lg:py-32">
      <div className="mx-auto max-w-4xl px-4">
        {/* Notable section heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Selected Work
          </p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Recent Work
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            A curated selection of projects I&apos;ve led or contributed to significantly.
          </p>
        </div>

        {/* Single-column timeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 h-full w-0.5 bg-border" />
          <div className="space-y-8">
            {displayed.map((work, index) => (
              <RecentWorkCard key={work.id} work={work} index={index} />
            ))}
          </div>
        </div>

        {works.length > 4 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90"
            >
              {showAll ? 'Show Less' : 'View All Work'}
            </button>
          </div>
        )}
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// RecentWorkCard
// ---------------------------------------------------------------------------

function RecentWorkCard({ work }: { work: RecentWork; index: number }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const screenshots = work.images || []

  return (
    <div className="relative flex gap-8">
      {/* Timeline dot */}
      <div className="absolute left-8 top-6 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-primary bg-background" />

      {/* Card */}
      <div className="ml-16 flex-1">
        <div className="rounded-xl bg-card p-6 shadow-sm transition-all hover:shadow-md">

          {/* Header */}
          <div className="mb-3 flex items-start gap-4">
            {work.image && (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={work.image} alt={work.name} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              {work.category && (
                <span className="mb-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium capitalize text-primary">
                  {work.category}
                </span>
              )}
              <h3 className="font-semibold text-foreground">{work.name}</h3>
            </div>
          </div>

          {/* Role — first, prominent, always green */}
          <p className="mb-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{work.role}</p>

          {/* Short description */}
          {work.short_description && (
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
              {work.short_description}
            </p>
          )}

          {/* Key achievement */}
          {work.key_achievement && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-primary/5 px-4 py-3">
              <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm font-medium text-foreground">{work.key_achievement}</p>
            </div>
          )}

          {/* Tech stack */}
          {work.techstack && (
            <p className="mb-4 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Tech Stack:</span> {work.techstack}
            </p>
          )}

          {/* Action row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Screenshots CTA — plain text button */}
            {screenshots.length > 0 && (
              <button
                onClick={() => setLightboxOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-2 hover:underline"
              >
                <Images className="h-3.5 w-3.5" />
                View Screenshots ({screenshots.length})
              </button>
            )}
            {work.link_visit && (
              <Link href={work.link_visit} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent">
                <ExternalLink className="h-3.5 w-3.5" /> Visit
              </Link>
            )}
            {work.link_code && (
              <Link href={work.link_code} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent">
                <Github className="h-3.5 w-3.5" /> Code
              </Link>
            )}
            {work.link_video && (
              <Link href={work.link_video} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent">
                <Play className="h-3.5 w-3.5" /> Demo
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Screenshots lightbox */}
      {lightboxOpen && screenshots.length > 0 && (
        <ScreenshotLightbox
          images={screenshots}
          name={work.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ScreenshotLightbox — portal, same pattern as projects
// ---------------------------------------------------------------------------

function ScreenshotLightbox({ images, name, onClose }: { images: string[]; name: string; onClose: () => void }) {
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setCurrent(c => (c - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') setCurrent(c => (c + 1) % images.length)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose, images.length])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!mounted) return null

  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.96)' }}
      onClick={onClose}
    >
      {/* Close */}
      <button onClick={onClose}
        style={{ position: 'absolute', top: 16, right: 16, zIndex: 10000 }}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Close">
        <X className="h-5 w-5" />
      </button>

      {/* Title + counter */}
      <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 10000 }}
        className="flex items-center gap-3">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">{name}</span>
        {images.length > 1 && (
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
            {current + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Image */}
      <div
        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: images.length > 1 ? '64px 56px' : '64px 16px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[current]}
          alt={`${name} screenshot ${current + 1}`}
          style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: 8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9)', display: 'block' }}
        />
      </div>

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); setCurrent(c => (c - 1 + images.length) % images.length) }}
            style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 10000 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Previous">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={e => { e.stopPropagation(); setCurrent(c => (c + 1) % images.length) }}
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 10000 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Next">
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 10000 }}
          className="flex gap-2">
          {images.map((src, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i) }}
              className={cn('relative h-12 w-16 overflow-hidden rounded border-2 transition-all', i === current ? 'border-white' : 'border-white/30 opacity-60 hover:opacity-100')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}
