import Link from 'next/link'
import { Github, Linkedin, Mail, Globe } from 'lucide-react'
import type { Social } from '@/lib/types'

interface SocialLinksProps {
  socials: Social[]
  className?: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  mail: Mail,
  website: Globe,
  globe: Globe,
}

function getSocialHref(social: Social): string {
  const icon = social.icon.toLowerCase()
  // If it's an email icon and the link isn't already a mailto:, prefix it
  if ((icon === 'email' || icon === 'mail') && !social.link.startsWith('mailto:')) {
    return `mailto:${social.link}`
  }
  return social.link
}

export function SocialLinks({ socials, className = '' }: SocialLinksProps) {
  // Filter out Twitter/X
  const filtered = socials.filter(
    (s) => !['twitter', 'x'].includes(s.icon.toLowerCase())
  )

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {filtered.map((social) => {
        const Icon = iconMap[social.icon.toLowerCase()] || Mail
        const href = getSocialHref(social)
        const isExternal = !href.startsWith('mailto:')
        return (
          <Link
            key={social.id}
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            aria-label={social.icon}
          >
            <Icon className="h-5 w-5" />
          </Link>
        )
      })}
    </div>
  )
}
