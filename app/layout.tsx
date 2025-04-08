'use client';
import './globals.css'
import { Poppins } from '@next/font/google'
import { ThemeProvider } from 'next-themes'
import Script from 'next/script';
// import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import Loglib from "@loglib/tracker/react"
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

 
      <head/>
      <ThemeProvider attribute='class' defaultTheme='light'>
        <body className={`${poppins.className} font-poppins bg-gray-100/50 dark:bg-grey-900 text-black dark:text-white overflow-x-hidden`}>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-ECDEKL29XG"></Script>
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ECDEKL29XG');
            `,
          }}
        />
        {/* <GoogleAnalytics gaId={"G-ECDEKL29XG"} /> */}
          {/* <body className='bg-gray-100/50 dark:bg-grey-900 text-black dark:text-white overflow-x-hidden'> */}
          {children}
          {/* <Loglib config={{
                id: "ewerwerwerqfsdfsdfsr" 
            }} /> */}
            
          {/* <Analytics /> */}
        </body>
      </ThemeProvider>
    </html>
  )
}
