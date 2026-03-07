import VideoWatermarkRemoval from '@/components/VideoWatermarkRemoval'
import VideoToolInfo from '@/components/VideoToolInfo'
import CTA from '@/components/CTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Video Watermark Removal - Remove Watermarks from Videos',
  description: 'Use our AI-powered tool to remove watermarks and logos from your videos quickly and easily.',
}

export default function LangVideoWatermarkRemovalPage() {
  const exampleImages = [
    '/video/watermark/1.jpg',
    '/video/watermark/2.jpg',
    '/video/watermark/3.jpg',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <VideoWatermarkRemoval />
      <VideoToolInfo toolKey="video_watermark_removal" exampleImages={exampleImages} />
      <CTA />
    </div>
  )
}

