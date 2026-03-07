import EbookTool from '@/components/EbookTool'
import EbookToolInfo from '@/components/EbookToolInfo'
import CTA from '@/components/CTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'eBook Subtitles - Generate Subtitles from eBooks',
  description: 'Generate subtitles from your eBooks with AI technology.',
}

export default function LangEbookSubtitlesPage() {
  const exampleImages = [
    '/ebook/subtitles/1.jpg',
    '/ebook/subtitles/2.jpg',
    '/ebook/subtitles/3.jpg',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <EbookTool toolKey="ebook_subtitles" />
      <EbookToolInfo toolKey="ebook_subtitles" exampleImages={exampleImages} />
      <CTA />
    </div>
  )
}

