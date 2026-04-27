import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Profile, Social } from '@/lib/types'
import { TypewriterText } from './typewriter-text'
import { SocialLinks } from './social-links'

interface HeroProps {
  profile: Profile
  socials: Social[]
}

export function Hero({ profile, socials }: HeroProps) {
  const { name, titles, short_desc, hero_image, tech_stack_images } = profile

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 lg:py-32">
        <div className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:justify-between lg:gap-16">
          {/* Content */}
          <div className="flex flex-1 flex-col gap-6 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                <span className="text-balance">Hi, I&apos;m {name}</span>
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className="text-lg text-muted-foreground md:text-xl">I am into</span>
                <TypewriterText texts={titles} />
              </div>
            </div>

            <p className="mx-auto max-w-xl text-pretty text-base text-muted-foreground lg:mx-0 lg:text-lg">
              {short_desc}
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row lg:items-start">
              <Link
                href="#about"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                About Me
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-card-foreground transition-colors hover:bg-accent"
              >
                View Projects
              </Link>
            </div>

            {/* Social Links */}
            <SocialLinks socials={socials} />
          </div>

          {/* Avatar with tech icons */}
          <div className="relative">
            <div className="relative h-64 w-64 md:h-80 md:w-80">
              {/* Avatar */}
              <div className="h-full w-full overflow-hidden rounded-full border-4 border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10">
                <Image
                  src={hero_image || '/me2.png'}
                  alt={name}
                  width={320}
                  height={320}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Tech stack icons */}
              {tech_stack_images.slice(0, 4).map((src, i) => {
                const positions = [
                  '-top-4 left-1/2 -translate-x-1/2',
                  'top-1/2 -right-4 -translate-y-1/2',
                  '-bottom-4 left-1/2 -translate-x-1/2',
                  'top-1/2 -left-4 -translate-y-1/2',
                ]
                return (
                  <div
                    key={i}
                    className={`absolute ${positions[i]} hidden h-12 w-12 items-center justify-center rounded-full border border-border bg-card shadow-lg md:flex`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Tech ${i + 1}`}
                      className="h-8 w-8 object-contain"
                      loading="lazy"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
