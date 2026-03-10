'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useState } from 'react'

export default function TextToImage() {
  const { t } = useLanguage()
  const [text, setText] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!text) return
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setGeneratedImage('/demo1.png')
      setIsGenerating(false)
    }, 3000)
  }

  const handleDownload = () => {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.download = 'text-to-image.png'
    link.href = generatedImage
    link.click()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('nav.text_to_image')}</h1>
        <p className="text-lg text-gray-600">{t('text_to_image.description')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">{t('text_to_image.enter_text')}</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('text_to_image.placeholder')}
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !text}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            {isGenerating ? t('text_to_image.generating') : t('text_to_image.generate')}
          </button>
        </div>

        {generatedImage && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{t('text_to_image.result')}</h3>
            <div className="flex justify-center mb-6">
              <img src={generatedImage} alt="Generated" className="max-w-full rounded-lg" />
            </div>
            <div className="flex justify-center">
              <button onClick={handleDownload} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                {t('text_to_image.download')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

