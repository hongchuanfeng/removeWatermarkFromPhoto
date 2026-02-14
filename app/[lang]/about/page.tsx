import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
}

export default function LangAboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">About Us</h1>
        <p className="text-center text-gray-600">About page content</p>
      </div>
    </div>
  )
}
