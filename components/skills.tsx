'use client'

import { useState, useMemo } from 'react'
import { Section } from './ui/section'
import { cn } from '@/lib/utils'
import type { Skill } from '@/lib/types'

interface SkillsProps {
  skills: Skill[]
}

export function Skills({ skills }: SkillsProps) {
  const categories = useMemo(
    () => [...new Set(skills.map((s) => s.category))],
    [skills]
  )
  const [activeCategory, setActiveCategory] = useState(categories[0])

  const filteredSkills = useMemo(
    () => skills.filter((s) => s.category === activeCategory),
    [skills, activeCategory]
  )

  return (
    <Section id="skills" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          Tech Stack
        </h2>

        {/* Category Tabs */}
        <div className="mx-auto mb-10 flex max-w-xl flex-wrap justify-center gap-2 rounded-lg bg-card p-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
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

        {/* Skills Grid */}
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </Section>
  )
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="group flex flex-col items-center gap-3 rounded-xl bg-card p-4 transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-12 w-12 transition-transform group-hover:scale-110">
        {skill.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={skill.image}
            alt={skill.name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
            {skill.name.charAt(0)}
          </div>
        )}
      </div>
      <span className="text-center text-xs font-medium text-muted-foreground">
        {skill.name}
      </span>
    </div>
  )
}
