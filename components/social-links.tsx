import Link from 'next/link'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import type { Social } from '@/lib/types'

interface SocialLinksProps {
  socials: Social[]
  className?: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
}

export function SocialLinks({ socials, className = '' }: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socials.map((social) => {
        const Icon = iconMap[social.icon.toLowerCase()] || Mail
        return (
          <Link
            key={social.id}
            href={social.link}
            target={social.link.startsWith('mailto:') ? undefined : '_blank'}
            rel={social.link.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
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
