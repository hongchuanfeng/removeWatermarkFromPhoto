import EbookTool from '@/components/EbookTool'
import EbookToolInfo from '@/components/EbookToolInfo'
import CTA from '@/components/CTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'eBook to Speech - Convert eBooks to Audio',
  description: 'Convert eBooks to audio with natural-sounding AI voices.',
}

export default function LangEbookToSpeechPage() {
  const exampleImages = [
    '/ebook/to-speech/1.jpg',
    '/ebook/to-speech/2.jpg',
    '/ebook/to-speech/3.jpg',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <EbookTool toolKey="ebook_to_speech" />
      <EbookToolInfo toolKey="ebook_to_speech" exampleImages={exampleImages} />
      <CTA />
    </div>
  )
}

