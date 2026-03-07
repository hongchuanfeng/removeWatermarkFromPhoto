import VideoToText from '@/components/VideoToText'
import VideoToolInfo from '@/components/VideoToolInfo'
import CTA from '@/components/CTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Video to Text - Extract Text from Videos',
  description: 'Convert video content to text with our AI-powered video to text extraction tool.',
}

export default function LangVideoToTextPage() {
  const exampleImages = [
    '/video/text/1.jpg',
    '/video/text/2.jpg',
    '/video/text/3.jpg',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <VideoToText />
      <VideoToolInfo toolKey="video_to_text" exampleImages={exampleImages} />
      <CTA />
    </div>
  )
}

