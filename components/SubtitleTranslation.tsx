'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useState } from 'react'

export default function SubtitleTranslation() {
  const { t } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [targetLanguage, setTargetLanguage] = useState('en')
  const [processing, setProcessing] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleConvert = async () => {
    if (!file) return
    setProcessing(true)
    // TODO: 实现字幕翻译功能
    setTimeout(() => {
      setProcessing(false)
      setDownloadUrl('#')
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('subtitle_translation.title')}
        </h1>
        <p className="text-xl text-gray-600">
          {t('subtitle_translation.description')}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            {t('subtitle_translation.upload_label')}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition">
            <input
              type="file"
              accept=".srt,.vtt,.ass,.ssa"
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
                    <p>{t('subtitle_translation.upload_hint')}</p>
                    <p className="text-sm text-gray-500 mt-1">SRT, VTT, ASS</p>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            {t('subtitle_translation.target_language')}
          </label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="es">Español</option>
            <option value="ru">Русский</option>
            <option value="pt">Português</option>
            <option value="ar">العربية</option>
          </select>
        </div>

        <button
          onClick={handleConvert}
          disabled={processing || !file}
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? t('subtitle_translation.processing') : t('subtitle_translation.translate')}
        </button>

        {downloadUrl && (
          <div className="mt-6 text-center">
            <a
              href={downloadUrl}
              className="inline-block bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {t('subtitle_translation.download')}
            </a>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-gray-500">
        {t('subtitle_translation.coming_soon')}
      </div>
    </div>
  )
}

