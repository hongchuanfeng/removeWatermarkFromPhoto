import OldVideoRestoration from '@/components/OldVideoRestoration'
import VideoToolInfo from '@/components/VideoToolInfo'
import CTA from '@/components/CTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Old Video Restoration - Restore Old Videos',
  description: 'Restore and enhance your old videos with AI-powered video restoration technology.',
}

export default function LangOldVideoRestorationPage() {
  const exampleImages = [
    '/video/old/1.jpg',
    '/video/old/2.jpg',
    '/video/old/3.jpg',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <OldVideoRestoration />
      <VideoToolInfo toolKey="old_video_restoration" exampleImages={exampleImages} />
      <CTA />
    </div>
  )
}

