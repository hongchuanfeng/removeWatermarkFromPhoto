import CSVTool from '@/components/CSVTool'
import CSVToolInfo from '@/components/CSVToolInfo'
import CTA from '@/components/CTA'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CSV Split - Split CSV Files',
  description: 'Split a large CSV file into multiple smaller files with our easy-to-use tool.',
}

export default function LangCsvSplitPage() {
  const exampleImages = [
    '/csv/split/1.jpg',
    '/csv/split/2.jpg',
    '/csv/split/3.jpg',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <CSVTool toolKey="csv_split" />
      <CSVToolInfo toolKey="csv_split" exampleImages={exampleImages} />
      <CTA />
    </div>
  )
}

