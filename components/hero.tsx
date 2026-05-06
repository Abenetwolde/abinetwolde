'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Profile, Social } from '@/lib/types'
import { SocialLinks } from './social-links'

interface HeroProps {
  profile: Profile
  socials: Social[]
}

export function Hero({ profile, socials }: HeroProps) {
  const { name, hero_headline, hero_subtitle, short_desc, titles, hero_stats } = profile

  const headline = hero_headline || (titles.length > 0 ? titles[0] : name)
  const accentLine = hero_subtitle || (titles.length > 1 ? titles[1] : '')

  return (
    <section id="home" className="relative min-h-screen w-full bg-background">
      {/* Subtle radial gradient blobs using theme primary color */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-left blob */}
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        {/* Bottom-right blob */}
        <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[100px]" />
        {/* Center subtle wash */}
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[80px]" />
      </div>
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-32 lg:px-8">

        {/* Main headline */}
        <h1 className="mb-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
          {headline}
          {accentLine && (
            <>
              <br />
              <span className="text-primary">
                {accentLine}
                {/* Blinking cursor */}
                <span
                  aria-hidden="true"
                  className="ml-0.5 inline-block w-[3px] animate-blink-cursor bg-primary align-middle"
                  style={{ height: '0.85em', verticalAlign: 'middle' }}
                />
              </span>
            </>
          )}
        </h1>

        {/* Short description */}
        {short_desc && (
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-foreground/80 md:text-lg">
            {short_desc}
          </p>
        )}

        {/* CTA buttons */}
        <div className="mb-12 flex flex-wrap items-center gap-3">
          {/* Primary CTA — filled background */}
          <Link
            href="/recent-works"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            See recent work
            <ArrowRight className="h-4 w-4" />
          </Link>
          {/* Secondary CTA — outlined */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Personal Projects
          </Link>
        </div>

        {/* Scrolling stat cards — seamless infinite loop */}
        {hero_stats && hero_stats.length > 0 && (
          <div className="relative overflow-hidden">
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />

            {/*
              Two identical sets side by side.
              The animation translates the whole track by -50% (= one full set width),
              then instantly resets to 0 — creating a seamless loop.
              group-hover pauses the animation.
            */}
            <div className="group flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
              {/* Set 1 */}
              {hero_stats.map((stat, i) => (
                <StatCard key={`a-${i}`} stat={stat} />
              ))}
              {/* Set 2 — identical, fills the gap when set 1 scrolls off */}
              {hero_stats.map((stat, i) => (
                <StatCard key={`b-${i}`} stat={stat} />
              ))}
            </div>
          </div>
        )}

        {/* Social links */}
        {socials.length > 0 && (
          <div className="mt-10">
            <SocialLinks socials={socials} />
          </div>
        )}
      </div>
    </section>
  )
}

function StatCard({ stat }: { stat: { value: string; label: string } }) {
  return (
    <div className="shrink-0 rounded-lg border border-border bg-card px-4 py-3 min-w-[160px]">
      <p className="text-xs font-semibold uppercase tracking-widest text-foreground">{stat.value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
    </div>
  )
}
