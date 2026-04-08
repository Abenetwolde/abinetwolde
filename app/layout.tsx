'use client';
import './globals.css';
import { Poppins } from '@next/font/google';
import { ThemeProvider } from 'next-themes';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import GAListener from './ga-tracker';
import Loglib from "@loglib/tracker/react";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <ThemeProvider attribute="class" defaultTheme="light">
        <body className={`${poppins.className} font-poppins bg-gray-100/50 dark:bg-grey-900 text-black dark:text-white overflow-x-hidden`}>
          {/* <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID }`}
          /> */}
     {/* <Script
          id="google-analytics"
          strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
        /> */}
          {/* <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-ECDEKL29XG'}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript> */}
            {/* <GAListener /> */}
          {children}
               <Loglib
       config={{
                    id: "securitysystems",
                }}
            />
          <Analytics />
        </body>
      </ThemeProvider>
    </html>
  );
}
