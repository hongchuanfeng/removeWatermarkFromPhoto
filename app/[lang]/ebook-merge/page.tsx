import EbookTool from '@/components/EbookTool'
import EbookToolInfo from '@/components/EbookToolInfo'
import CTA from '@/components/CTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'eBook Merge - Combine eBook Files',
  description: 'Merge multiple eBook files into one document with our easy-to-use tool.',
}

export default function LangEbookMergePage() {
  const exampleImages = [
    '/ebook/merge/1.jpg',
    '/ebook/merge/2.jpg',
    '/ebook/merge/3.jpg',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <EbookTool toolKey="ebook_merge" />
      <EbookToolInfo toolKey="ebook_merge" exampleImages={exampleImages} />
      <CTA />
    </div>
  )
}

