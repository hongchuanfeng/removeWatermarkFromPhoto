'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useState } from 'react'

export default function TextToSubtitles() {
  const { t } = useLanguage()
  const [text, setText] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleConvert = async () => {
    setProcessing(true)
    // TODO: 实现文字转字幕功能
    setTimeout(() => {
      setProcessing(false)
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('text_to_subtitles.title')}
        </h1>
        <p className="text-xl text-gray-600">
          {t('text_to_subtitles.description')}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            {t('text_to_subtitles.input_label')}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('text_to_subtitles.input_placeholder')}
            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleConvert}
          disabled={processing || !text}
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? t('text_to_subtitles.processing') : t('text_to_subtitles.convert')}
        </button>
      </div>

      <div className="mt-8 text-center text-gray-500">
        {t('text_to_subtitles.coming_soon')}
      </div>
    </div>
  )
}

