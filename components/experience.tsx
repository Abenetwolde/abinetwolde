'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Section } from './ui/section'
import { cn } from '@/lib/utils'
import type { Experience, Education } from '@/lib/types'

// ---------------------------------------------------------------------------
// Work Experience — used on home page and /experience
// ---------------------------------------------------------------------------

interface ExperienceProps {
  experiences: Experience[]
}

export function ExperienceSection({ experiences }: ExperienceProps) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? experiences : experiences.slice(0, 3)

  return (
    <Section id="experience" className="py-20 lg:py-32">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          Work Experience
        </h2>
        <Timeline items={displayed} type="experience" />
        {experiences.length > 3 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90"
            >
              {showAll ? 'Show Less' : 'View All'}
            </button>
          </div>
        )}
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Combined Experience + Education — used on home page
// ---------------------------------------------------------------------------

interface ExperienceAndEducationProps {
  experiences: Experience[]
  educations: Education[]
}

export function ExperienceAndEducationSection({ experiences, educations }: ExperienceAndEducationProps) {
  const [showAllExp, setShowAllExp] = useState(false)
  const [showAllEdu, setShowAllEdu] = useState(false)
  const displayedExp = showAllExp ? experiences : experiences.slice(0, 3)
  const displayedEdu = showAllEdu ? educations : educations.slice(0, 3)

  return (
    <Section id="experience" className="py-20 lg:py-32">
      <div className="mx-auto max-w-4xl px-4 space-y-20">
        {/* Work Experience */}
        {experiences.length > 0 && (
          <div>
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
              Work Experience
            </h2>
            <Timeline items={displayedExp} type="experience" />
            {experiences.length > 3 && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setShowAllExp(!showAllExp)}
                  className="rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90"
                >
                  {showAllExp ? 'Show Less' : 'View All'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <div id="education">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
              Education
            </h2>
            <Timeline items={displayedEdu} type="education" />
            {educations.length > 3 && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setShowAllEdu(!showAllEdu)}
                  className="rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90"
                >
                  {showAllEdu ? 'Show Less' : 'View All'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  )
}

interface EducationProps {
  educations: Education[]
}

export function EducationSection({ educations }: EducationProps) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? educations : educations.slice(0, 3)

  return (
    <Section id="education" className="py-20 lg:py-32">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          Education
        </h2>
        <Timeline items={displayed} type="education" />
        {educations.length > 3 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90"
            >
              {showAll ? 'Show Less' : 'View All'}
            </button>
          </div>
        )}
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Shared Timeline
// ---------------------------------------------------------------------------

function Timeline({ items, type }: { items: (Experience | Education)[]; type: 'experience' | 'education' }) {
  return (
    <div className="relative">
      <div className="absolute left-8 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />
      <div className="space-y-8">
        {items.map((item, index) => (
          <TimelineCard key={item.id} item={item} index={index} type={type} />
        ))}
      </div>
    </div>
  )
}

function TimelineCard({ item, index, type }: { item: Experience | Education; index: number; type: 'experience' | 'education' }) {
  const isExperience = type === 'experience'
  const title = isExperience ? (item as Experience).position : (item as Education).degree
  const subtitle = isExperience ? (item as Experience).company : (item as Education).institute

  return (
    <div className={cn('relative flex gap-8 md:gap-0', index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse')}>
      <div className="absolute left-8 top-6 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-primary bg-background md:left-1/2" />
      <div className={cn('ml-16 flex-1 md:ml-0', index % 2 === 0 ? 'md:pr-12' : 'md:pl-12')}>
        <div className="rounded-xl bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="mb-4 flex items-start gap-4">
            {item.logo && (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image src={item.logo} alt={subtitle} fill className="object-contain p-2" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-primary">{subtitle}</p>
              {item.duration && <p className="mt-1 text-xs text-muted-foreground">{item.duration}</p>}
            </div>
          </div>
          {item.description && item.description.length > 0 && (
            <ul className="space-y-2">
              {item.description.map((desc, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {desc}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="hidden flex-1 md:block" />
    </div>
  )
}
