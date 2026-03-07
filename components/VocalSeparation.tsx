'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useState } from 'react'

export default function VocalSeparation() {
  const { t } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    // Placeholder for actual functionality
    setTimeout(() => {
      setUploading(false)
    }, 2000)
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('nav.vocal_separation')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('vocal_separation.description')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-500 transition">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
              id="audio-upload"
            />
            <label htmlFor="audio-upload" className="cursor-pointer">
              <div className="text-6xl mb-4">🎤</div>
              <p className="text-lg text-gray-700 mb-2">
                {file ? file.name : t('vocal_separation.upload')}
              </p>
              <p className="text-sm text-gray-500">
                {t('vocal_separation.supported')}
              </p>
            </label>
          </div>

          {file && (
            <div className="mt-6">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-400"
              >
                {uploading ? t('vocal_separation.processing') : t('vocal_separation.separate')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

