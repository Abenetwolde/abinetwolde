import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  id: string
  className?: string
}

export function Section({ children, id, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'animate-fade-in',
        className
      )}
    >
      {children}
    </section>
  )
}
