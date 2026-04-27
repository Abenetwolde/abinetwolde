'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Github, ExternalLink, Play } from 'lucide-react'
import { Section } from './ui/section'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/types'

interface ProjectsProps {
  projects: Project[]
}

export function Projects({ projects }: ProjectsProps) {
  const categories = useMemo(
    () => [...new Set(projects.map((p) => p.category).filter(Boolean))],
    [projects]
  )
  const [activeCategory, setActiveCategory] = useState(categories[0] || 'all')
  const [showAll, setShowAll] = useState(false)

  const filteredProjects = useMemo(
    () =>
      activeCategory === 'all'
        ? projects
        : projects.filter((p) => p.category === activeCategory),
    [projects, activeCategory]
  )

  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6)

  return (
    <Section id="projects" className="bg-muted/30 py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          Projects
        </h2>

        {/* Category Tabs */}
        {categories.length > 1 && (
          <div className="mx-auto mb-10 flex max-w-2xl flex-wrap justify-center gap-2 rounded-lg bg-card p-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category || 'all')
                  setShowAll(false)
                }}
                className={cn(
                  'rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors',
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* View All Button */}
        {filteredProjects.length > 6 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90"
            >
              {showAll ? 'Show Less' : 'View All Projects'}
            </button>
          </div>
        )}
      </div>
    </Section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const { name, images, techstack, description, link_visit, link_code, link_video } = project

  return (
    <article className="group overflow-hidden rounded-xl bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {images && images.length > 0 ? (
          <Image
            src={images[0]}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-bold text-muted-foreground/30">
            {name.charAt(0)}
          </div>
        )}

        {/* Overlay with links */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          {link_visit && (
            <Link
              href={link_visit}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black transition-colors hover:bg-primary hover:text-white"
              aria-label="Visit site"
            >
              <ExternalLink className="h-5 w-5" />
            </Link>
          )}
          {link_code && (
            <Link
              href={link_code}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black transition-colors hover:bg-primary hover:text-white"
              aria-label="View code"
            >
              <Github className="h-5 w-5" />
            </Link>
          )}
          {link_video && (
            <Link
              href={link_video}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black transition-colors hover:bg-primary hover:text-white"
              aria-label="Watch video"
            >
              <Play className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-2 text-lg font-semibold text-foreground">{name}</h3>
        {techstack && (
          <p className="mb-3 text-sm text-muted-foreground">
            <span className="font-medium">Tech:</span> {techstack}
          </p>
        )}
        {description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </article>
  )
}
