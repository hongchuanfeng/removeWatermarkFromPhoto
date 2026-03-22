import TextToImage from '@/components/TextToImage'
import CTA from '@/components/CTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Text to Image - Generate Images from Text',
  description: 'Use our AI-powered tool to generate stunning images from text descriptions. Create unique artwork, illustrations, and more.',
}

export default function LangTextToImagePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <TextToImage />
      <CTA />
    </div>
  )
}
