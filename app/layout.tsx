import './globals.css'
import { Poppins } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata, Viewport } from 'next'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
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
      <body className={`${poppins.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
