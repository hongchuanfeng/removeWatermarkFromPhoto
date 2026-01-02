import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Remove Watermark from Photo - Remove Logo Online Free',
  description: 'Remove watermark and logo from photos online. Free AI-powered watermark removal tool. Remove watermarks from images instantly.',
  keywords: 'remove watermark from photo, remove logo, watermark remover, logo remover, remove watermark online, free watermark remover',
  authors: [{ name: 'ChDaoAI' }],
  creator: 'ChDaoAI',
  publisher: 'ChDaoAI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.chdaoai.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'zh': '/zh',
    },
  },
  openGraph: {
    title: 'Remove Watermark from Photo - Remove Logo Online Free',
    description: 'Remove watermark and logo from photos online. Free AI-powered watermark removal tool.',
    url: 'https://www.chdaoai.com',
    siteName: 'Remove Watermark',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remove Watermark from Photo - Remove Logo Online Free',
    description: 'Remove watermark and logo from photos online. Free AI-powered watermark removal tool.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7K2W5KRNQD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7K2W5KRNQD');
          `}
        </Script>
        
        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7274710287377352"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
