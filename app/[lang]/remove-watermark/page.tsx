import RemoveWatermarkInline from '@/components/RemoveWatermarkInline'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Remove Watermark',
}

export default function LangRemoveWatermarkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <RemoveWatermarkInline />
    </div>
  )
}
