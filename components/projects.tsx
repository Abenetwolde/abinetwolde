'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, Github, ExternalLink, Play, BookOpen, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { Section } from './ui/section'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/types'

const CATEGORY_ORDER = ['mobile', 'web', 'bot']

interface ProjectsProps {
  projects: Project[]
}

export function Projects({ projects }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [showAll, setShowAll] = useState(false)

  const categories = useMemo(() => {
    const unique = [...new Set(projects.map((p) => p.category).filter(Boolean))] as string[]
    return unique.sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a.toLowerCase())
      const bi = CATEGORY_ORDER.indexOf(b.toLowerCase())
      if (ai !== -1 && bi !== -1) return ai - bi
      if (ai !== -1) return -1
      if (bi !== -1) return 1
      return a.localeCompare(b)
    })
  }, [projects])

  const filteredProjects = useMemo(
    () => {
      const filtered = activeCategory === 'all' ? projects : projects.filter((p) => p.category === activeCategory)
      // Sort by display_order
      return [...filtered].sort((a, b) => a.display_order - b.display_order)
    },
    [projects, activeCategory]
  )

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6)

  return (
    <Section id="projects" className="bg-muted/30 py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          Projects
        </h2>

        {categories.length > 0 && (
          <div className="mx-auto mb-10 flex max-w-2xl flex-wrap justify-center gap-2 rounded-lg bg-card p-2">
            <button
              onClick={() => { setActiveCategory('all'); setShowAll(false) }}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors',
                activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => { setActiveCategory(category); setShowAll(false) }}
                className={cn(
                  'rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors',
                  activeCategory === category ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onSelect={setSelectedProject} />
          ))}
        </div>

        {filteredProjects.length > 6 && (
          <div className="mt-10 text-center">
            {showAll ? (
              <button
                onClick={() => setShowAll(false)}
                className="rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90"
              >
                Show Less
              </button>
            ) : (
              <Link
                href="/projects"
                className="inline-block rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90"
              >
                View All My Projects
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Portal — renders outside any stacking context, always on top */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </Section>
  )
}

// ---------------------------------------------------------------------------
// ProjectCard
// ---------------------------------------------------------------------------

function ProjectCard({ project, onSelect }: { project: Project; onSelect: (p: Project) => void }) {
  const { name, images, cover_image, techstack, description } = project
  // Use cover_image as thumbnail if set, otherwise fall back to first image
  const thumbnail = cover_image || (images && images.length > 0 ? images[0] : null)

  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-xl bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
      onClick={() => onSelect(project)}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            placeholder="empty"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-bold text-muted-foreground/30">
            {name.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-110">
            <Eye className="h-6 w-6" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="mb-2 text-lg font-semibold text-foreground">{name}</h3>
        {techstack && (
          <p className="mb-3 text-sm text-muted-foreground">
            <span className="font-medium">Tech:</span> {techstack}
          </p>
        )}
        {description && <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>}
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// ImageGrid — thumbnail grid + full-screen lightbox
// ---------------------------------------------------------------------------

function ImageGrid({ images, name }: { images: string[]; name: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (images.length === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-lg bg-muted text-5xl font-bold text-muted-foreground/30">
        {name.charAt(0)}
      </div>
    )
  }

  const openLightbox = (i: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setLightboxIndex(i)
  }
  const closeLightbox = () => setLightboxIndex(null)
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLightboxIndex((i) => (i! - 1 + images.length) % images.length)
  }
  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLightboxIndex((i) => (i! + 1) % images.length)
  }

  const gridClass =
    images.length === 1 ? 'grid-cols-1' :
    images.length === 2 ? 'grid-cols-2' :
    images.length === 3 ? 'grid-cols-2' :
    'grid-cols-2 sm:grid-cols-3'

  return (
    <>
      <div className={cn('grid gap-2 overflow-hidden rounded-lg', gridClass)}>
        {images.map((src, i) => {
          const isWide = images.length === 3 && i === 0
          return (
            <button
              key={i}
              type="button"
              onClick={(e) => openLightbox(i, e)}
              className={cn(
                'group/thumb relative overflow-hidden rounded-lg bg-muted',
                isWide ? 'col-span-2' : '',
                images.length === 1 ? 'aspect-video' : 'aspect-square'
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${name} screenshot ${i + 1}`}
                fill
                className="object-cover transition-transform group-hover/thumb:scale-105"
                sizes="(max-width: 768px) 50vw, 300px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/thumb:opacity-100">
                <ZoomIn className="h-6 w-6 text-white drop-shadow" />
              </div>
            </button>
          )
        })}
      </div>

      {/* Lightbox — portal to body so it's never clipped */}
      {mounted && lightboxIndex !== null && createPortal(
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.96)' }}
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            style={{ position: 'absolute', top: 16, right: 16, zIndex: 10000 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Counter */}
          {images.length > 1 && (
            <span
              style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 10000 }}
              className="rounded-full bg-white/10 px-3 py-1 text-xs text-white"
            >
              {lightboxIndex + 1} / {images.length}
            </span>
          )}

          {/* Image — fills screen, never cropped */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: images.length > 1 ? '48px 56px' : '48px 16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex]}
              alt={`${name} screenshot ${lightboxIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: 8,
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9)',
                display: 'block',
              }}
            />
          </div>

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 10000 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={next}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 10000 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>,
        document.body
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// ProjectModal — portal to body, always above header, fully scrollable
// ---------------------------------------------------------------------------

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const { name, images, techstack, description, features, link_visit, link_code, link_video, blog } = project
  const panelRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => { panelRef.current?.focus() }, [])

  if (!mounted) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} project details`}
    >
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Scroll content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '32px 16px',
        }}
      >
        {/* Panel */}
        <div
          ref={panelRef}
          tabIndex={-1}
          style={{ position: 'relative', width: '100%', maxWidth: 896, outline: 'none' }}
          className="rounded-2xl bg-background shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6">
            <ImageGrid images={images || []} name={name} />

            <div className="mt-5">
              <h2 className="text-2xl font-bold text-foreground">{name}</h2>
              {techstack && (
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium">Tech:</span> {techstack}
                </p>
              )}
            </div>

            {description && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
            )}

            {features && features.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold text-foreground">Key Features</h3>
                <ul className="space-y-1.5">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(link_visit || link_code || link_video || blog) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {link_visit && (
                  <Link href={link_visit} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    <ExternalLink className="h-4 w-4" /> Visit Site
                  </Link>
                )}
                {link_code && (
                  <Link href={link_code} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90">
                    <Github className="h-4 w-4" /> GitHub
                  </Link>
                )}
                {link_video && (
                  <Link href={link_video} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90">
                    <Play className="h-4 w-4" /> Watch Video
                  </Link>
                )}
                {blog && (
                  <Link href={blog} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90">
                    <BookOpen className="h-4 w-4" /> Blog Post
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
