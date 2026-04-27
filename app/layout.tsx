import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata, Viewport } from 'next'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Abenet Wolde | Software Engineer',
  description: 'Portfolio of Abenet Wolde - Full Stack Developer specializing in React, Next.js, Flutter, and Node.js',
  keywords: ['Software Engineer', 'Full Stack Developer', 'React', 'Next.js', 'Flutter', 'Node.js'],
  authors: [{ name: 'Abenet Wolde' }],
  openGraph: {
    title: 'Abenet Wolde | Software Engineer',
    description: 'Full Stack Developer specializing in React, Next.js, Flutter, and Node.js',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
