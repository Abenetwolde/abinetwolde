import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Award, MapPin } from 'lucide-react'
import { Section } from './ui/section'
import type { Certification } from '@/lib/types'

const TYPE_COLORS: Record<string, string> = {
  online: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  onsite: 'bg-green-500/10 text-green-600 dark:text-green-400',
  hybrid: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  other: 'bg-muted text-muted-foreground',
}

interface CertificationsProps {
  certifications: Certification[]
}

export function Certifications({ certifications }: CertificationsProps) {
  if (certifications.length === 0) return null

  return (
    <Section id="certifications" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Credentials
          </p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Notable Certifications
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col rounded-xl bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* Header: image + title */}
              <div className="mb-4 flex items-start gap-4">
                {cert.image ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={cert.image} alt={cert.title} fill className="object-contain p-1" />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Award className="h-7 w-7" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground leading-tight">{cert.title}</h3>
                  <p className="mt-0.5 text-sm text-primary">{cert.issuer}</p>

                  {/* Meta row: date + type badge */}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {cert.issued_date && (
                      <span className="text-xs text-muted-foreground">{cert.issued_date}</span>
                    )}
                    {cert.type && (
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${TYPE_COLORS[cert.type.toLowerCase()] ?? TYPE_COLORS.other}`}>
                        {cert.type}
                      </span>
                    )}
                  </div>

                  {/* Address */}
                  {cert.address && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {cert.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Bullet description */}
              {cert.description && cert.description.length > 0 && (
                <ul className="mb-4 flex-1 space-y-1.5">
                  {cert.description.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}

              {/* Credential link */}
              {cert.credential_url && (
                <Link
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  View Credential
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
