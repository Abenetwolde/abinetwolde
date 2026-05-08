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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200/60 bg-blue-50/50 text-blue-400 transition-colors hover:border-blue-400 hover:text-blue-500 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:border-blue-500 dark:hover:text-blue-300"
            aria-label={social.icon}
          >
            <Icon className="h-5 w-5" />
          </Link>
        )
      })}
    </div>
  )
}
