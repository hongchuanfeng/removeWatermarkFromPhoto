import EbookTool from '@/components/EbookTool'
import EbookToolInfo from '@/components/EbookToolInfo'
import CTA from '@/components/CTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'eBook Watermark Removal - Remove Watermarks from eBooks',
  description: 'Remove watermarks from eBooks with our AI-powered tool.',
}

export default function LangEbookWatermarkRemovalPage() {
  const exampleImages = [
    '/ebook/watermark/1.jpg',
    '/ebook/watermark/2.jpg',
    '/ebook/watermark/3.jpg',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <EbookTool toolKey="ebook_watermark_removal" />
      <EbookToolInfo toolKey="ebook_watermark_removal" exampleImages={exampleImages} />
      <CTA />
    </div>
  )
}

