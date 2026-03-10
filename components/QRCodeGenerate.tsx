'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useRef } from 'react'

interface QRCodeGenerateProps {
  toolKey: string
}

export default function QRCodeGenerate({ toolKey }: QRCodeGenerateProps) {
  const { t } = useLanguage()
  const [inputText, setInputText] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [batchMode, setBatchMode] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleGenerate = async () => {
    if (!inputText && !batchMode) return
    setGenerating(true)
    
    // Placeholder for actual QR code generation functionality
    // In a real implementation, you would use a library like qrcode.react
    setTimeout(() => {
      setGenerating(false)
      // Generate a placeholder QR code image
      setGeneratedImage('/image/qrcode-placeholder.png')
    }, 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      setFiles(fileArray)
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    setInputText('')
    setGeneratedImage(null)
    setFiles([])
    setBatchMode(false)
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t(`nav.${toolKey.replace(/-/g, '_')}`)}
          </h1>
          <p className="text-xl text-gray-600">
            {t(`${toolKey.replace(/-/g, '_')}.description`)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                onClick={() => setBatchMode(false)}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  !batchMode 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('qrcode.single')}
              </button>
              <button
                onClick={() => setBatchMode(true)}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  batchMode 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('qrcode.batch')}
              </button>
            </div>
          </div>

          {!batchMode ? (
            // Single Mode
            <div className="space-y-6">
              <div>
                <label htmlFor="qr-input" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('qrcode.enter_content')}
                </label>
                <textarea
                  id="qr-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('qrcode_generate.upload')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                />
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={!inputText || generating}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-400"
              >
                {generating 
                  ? t('qrcode_generate.processing') 
                  : t('qrcode_generate.generate')
                }
              </button>

              {generatedImage && (
                <div className="mt-6 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg inline-block">
                    <canvas ref={canvasRef} className="max-w-full h-auto" />
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    {t('qrcode.download_hint')}
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Batch Mode
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition">
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                  id="batch-upload"
                  multiple
                />
                <label htmlFor="batch-upload" className="cursor-pointer">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-lg text-gray-700 mb-2">
                    {files.length > 0 
                      ? `${files.length} ${t('csv.files_selected')}` 
                      : t('qrcode.batch_upload_hint')
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('qrcode.batch_supported')}
                  </p>
                </label>
              </div>

              {files.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-700">
                      {t('csv.selected_files')}
                    </h3>
                    <button
                      onClick={() => setFiles([])}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      {t('csv.clear_all')}
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded">
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-gray-400 hover:text-red-500 ml-2"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={files.length === 0 || generating}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-400"
              >
                {generating 
                  ? t('qrcode_generate.processing') 
                  : t('qrcode.batch_generate')
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

