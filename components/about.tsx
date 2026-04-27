import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Phone } from 'lucide-react'
import { Section } from './ui/section'
import type { About as AboutType, Profile } from '@/lib/types'

interface AboutProps {
  about: AboutType
  profile: Profile
}

export function About({ about, profile }: AboutProps) {
  const { about_image, about_image_caption, about: aboutText, resume_url, call_url } = about

  return (
    <Section id="about" className="bg-muted/30 py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">
          About Me
        </h2>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* Image Card */}
          <div className="w-full max-w-xs shrink-0">
            <div className="overflow-hidden rounded-2xl bg-card p-3 shadow-lg transition-transform hover:-translate-y-1">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                <Image
                  src={about_image || '/me3.jpg'}
                  alt={profile.name}
                  fill
                  className="object-cover grayscale transition-all hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <p className="mt-3 text-center text-sm font-medium text-muted-foreground">
                {about_image_caption || '< I Build Stuff />'}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6">
            <p className="text-pretty text-base leading-relaxed text-muted-foreground lg:text-lg">
              {aboutText}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {resume_url && (
                <Link
                  href={resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Resume
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
              {call_url && (
                <Link
                  href={call_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-accent"
                >
                  <Phone className="h-4 w-4" />
                  Schedule a Call
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
