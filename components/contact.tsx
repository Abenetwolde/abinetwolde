'use client'

import { useState } from 'react'
import { Send, Mail, MapPin, Phone } from 'lucide-react'
import { Section } from './ui/section'
import type { Social } from '@/lib/types'
import { SocialLinks } from './social-links'

interface ContactProps {
  socials: Social[]
}

export function Contact({ socials }: ContactProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }
      
      setSubmitted(true)
      setFormState({ name: '', email: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Section id="contact" className="bg-muted/30 py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
          Get In Touch
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
          Have a project in mind or want to collaborate? Feel free to reach out!
        </p>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-muted-foreground">abenetwolde@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Phone</h3>
                  <p className="text-muted-foreground">+251 947 081 180</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Location</h3>
                  <p className="text-muted-foreground">Addis Ababa, Ethiopia</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-foreground">Follow Me</h3>
              <SocialLinks socials={socials} />
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Your message..."
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
                {error}
              </div>
            )}

            {submitted && (
              <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-500">
                Thank you! Your message has been sent successfully.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || submitted}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                'Sending...'
              ) : submitted ? (
                'Message Sent!'
              ) : (
                <>
                  Send Message
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Section>
  )
}
