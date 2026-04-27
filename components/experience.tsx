'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Section } from './ui/section'
import { cn } from '@/lib/utils'
import type { Experience, Education } from '@/lib/types'

interface ExperienceProps {
  experiences: Experience[]
  educations: Education[]
}

export function ExperienceSection({ experiences, educations }: ExperienceProps) {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience')
  const [showAll, setShowAll] = useState(false)

  const items = activeTab === 'experience' ? experiences : educations
  const displayedItems = showAll ? items : items.slice(0, 3)

  return (
    <Section id="experience" className="py-20 lg:py-32">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          Experience
        </h2>

        {/* Tabs */}
        <div className="mx-auto mb-10 flex w-fit gap-2 rounded-lg bg-card p-2">
          {(['experience', 'education'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setShowAll(false)
              }}
              className={cn(
                'rounded-md px-6 py-2 text-sm font-medium capitalize transition-colors',
                activeTab === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-8">
            {displayedItems.map((item, index) => (
              <TimelineCard
                key={item.id}
                item={item}
                index={index}
                type={activeTab}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        {items.length > 3 && (
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

interface TimelineCardProps {
  item: Experience | Education
  index: number
  type: 'experience' | 'education'
}

function TimelineCard({ item, index, type }: TimelineCardProps) {
  const isExperience = type === 'experience'
  const title = isExperience
    ? (item as Experience).position
    : (item as Education).degree
  const subtitle = isExperience
    ? (item as Experience).company
    : (item as Education).institute

  return (
    <div
      className={cn(
        'relative flex gap-8 md:gap-0',
        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
      )}
    >
      {/* Timeline dot */}
      <div className="absolute left-8 top-6 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-primary bg-background md:left-1/2" />

      {/* Content */}
      <div className={cn('ml-16 flex-1 md:ml-0', index % 2 === 0 ? 'md:pr-12' : 'md:pl-12')}>
        <div className="rounded-xl bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="mb-4 flex items-start gap-4">
            {item.logo && (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={item.logo}
                  alt={subtitle}
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-primary">{subtitle}</p>
              {item.duration && (
                <p className="mt-1 text-xs text-muted-foreground">{item.duration}</p>
              )}
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

      {/* Spacer for alternating layout */}
      <div className="hidden flex-1 md:block" />
    </div>
  )
}
