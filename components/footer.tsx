import Link from 'next/link'
import type { Social } from '@/lib/types'
import { SocialLinks } from './social-links'

interface FooterProps {
  name: string
  socials: Social[]
}

export function Footer({ name, socials }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-foreground transition-colors hover:text-primary"
          >
            {name.split(' ').map(n => n[0]).join('')}
          </Link>

          {/* Social Links */}
          <SocialLinks socials={socials} />

          {/* Copyright */}
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} {name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
