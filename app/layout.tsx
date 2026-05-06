import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata, Viewport } from 'next'

// Subset to latin only, use CSS variable for flexibility
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'Abenet Wolde | Software Engineer',
    template: '%s | Abenet Wolde',
  },
  description: 'Software Engineer specializing in full-stack development, mobile apps, and scalable backend systems.',
  keywords: ['Software Engineer', 'Full Stack Developer', 'React', 'Next.js', 'Flutter', 'Node.js', 'Abenet Wolde'],
  authors: [{ name: 'Abenet Wolde' }],
  creator: 'Abenet Wolde',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: 'Abenet Wolde | Software Engineer',
    description: 'Software Engineer specializing in full-stack development, mobile apps, and scalable backend systems.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abenet Wolde | Software Engineer',
    description: 'Software Engineer specializing in full-stack development, mobile apps, and scalable backend systems.',
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
    <html lang="en" className={`${inter.variable} bg-background`} suppressHydrationWarning>
      <head>
        {/* Preconnect to Supabase for faster API/image requests */}
        <link rel="preconnect" href="https://zfievjxkmubnokerecys.supabase.co" />
        <link rel="dns-prefetch" href="https://zfievjxkmubnokerecys.supabase.co" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
