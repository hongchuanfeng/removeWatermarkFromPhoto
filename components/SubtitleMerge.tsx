'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useState } from 'react'

export default function SubtitleMerge() {
  const { t } = useLanguage()
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }

  const handleMerge = async () => {
    if (files.length < 2) return
    setProcessing(true)
    // TODO: 实现字幕合并功能
    setTimeout(() => {
      setProcessing(false)
      setDownloadUrl('#')
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('subtitle_merge.title')}
        </h1>
        <p className="text-xl text-gray-600">
          {t('subtitle_merge.description')}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            {t('subtitle_merge.upload_label')}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition">
            <input
              type="file"
              accept=".srt,.vtt,.ass,.ssa"
              onChange={handleFileChange}
              className="hidden"
              id="subtitle-files"
              multiple
            />
            <label htmlFor="subtitle-files" className="cursor-pointer">
              <div className="text-gray-600">
                <p className="text-4xl mb-2">📄</p>
                <p>{t('subtitle_merge.upload_hint')}</p>
                <p className="text-sm text-gray-500 mt-1">SRT, VTT, ASS, SSA</p>
              </div>
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              {t('subtitle_merge.selected_files')}
            </label>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">📄</span>
                    <div>
                      <p className="font-semibold">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleMerge}
          disabled={processing || files.length < 2}
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? t('subtitle_merge.processing') : t('subtitle_merge.merge')}
        </button>

        {downloadUrl && (
          <div className="mt-6 text-center">
            <a
              href={downloadUrl}
              className="inline-block bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {t('subtitle_merge.download')}
            </a>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-gray-500">
        {t('subtitle_merge.coming_soon')}
      </div>
    </div>
  )
}

