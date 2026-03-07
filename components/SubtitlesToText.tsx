'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useState } from 'react'

export default function SubtitlesToText() {
  const { t } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleConvert = async () => {
    if (!file) return
    setProcessing(true)
    // TODO: 实现字幕转文字功能
    setTimeout(() => {
      setProcessing(false)
      setResult(t('subtitles_to_text.result_placeholder'))
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('subtitles_to_text.title')}
        </h1>
        <p className="text-xl text-gray-600">
          {t('subtitles_to_text.description')}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            {t('subtitles_to_text.upload_label')}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition">
            <input
              type="file"
              accept=".srt,.vtt,.ass"
              onChange={handleFileChange}
              className="hidden"
              id="subtitle-file"
            />
            <label htmlFor="subtitle-file" className="cursor-pointer">
              <div className="text-gray-600">
                {file ? (
                  <div>
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <>
                    <p className="text-4xl mb-2">📄</p>
                    <p>{t('subtitles_to_text.upload_hint')}</p>
                    <p className="text-sm text-gray-500 mt-1">SRT, VTT, ASS</p>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={handleConvert}
          disabled={processing || !file}
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? t('subtitles_to_text.processing') : t('subtitles_to_text.convert')}
        </button>

        {result && (
          <div className="mt-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('subtitles_to_text.result_label')}
            </label>
            <textarea
              value={result}
              readOnly
              className="w-full h-48 p-4 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-gray-500">
        {t('subtitles_to_text.coming_soon')}
      </div>
    </div>
  )
}

