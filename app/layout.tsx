import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
  metadataBase: new URL('https://removewatermark.chdaoai.com'),
  alternates: {
    canonical: 'https://removewatermark.chdaoai.com',
    languages: {
      'en': 'https://removewatermark.chdaoai.com/en',
      'zh': 'https://removewatermark.chdaoai.com/zh',
    },
  },
  openGraph: {
    title: 'Remove Watermark from Photo - Remove Logo Online Free',
    description: 'Remove watermark and logo from photos online. Free AI-powered watermark removal tool.',
    url: 'https://removewatermark.chdaoai.com',
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
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://removewatermark.chdaoai.com" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
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
