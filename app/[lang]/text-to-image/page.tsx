import TextToImage from '@/components/TextToImage'
import ImageToolInfo from '@/components/ImageToolInfo'
import CTA from '@/components/CTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Text to Image - Convert Text to Image',
  description: 'Convert your text to beautiful images with customizable styles.',
}

export default function LangTextToImagePage() {
  const exampleImages = [
    '/image/text-to-image/1.jpg',
    '/image/text-to-image/2.jpg',
    '/image/text-to-image/3.jpg',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <TextToImage />
      <ImageToolInfo toolKey="text_to_image" exampleImages={exampleImages} />
      <CTA />
    </div>
  )
}

