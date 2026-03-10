import RemoveBackground from '@/components/RemoveBackground'
import ImageToolInfo from '@/components/ImageToolInfo'
import CTA from '@/components/CTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Remove Background - Remove Image Background',
  description: 'Remove background from your images automatically with AI technology.',
}

export default function LangRemoveBackgroundPage() {
  const exampleImages = [
    '/image/remove-background/1.jpg',
    '/image/remove-background/2.jpg',
    '/image/remove-background/3.jpg',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <RemoveBackground />
      <ImageToolInfo toolKey="remove_background" exampleImages={exampleImages} />
      <CTA />
    </div>
  )
}

