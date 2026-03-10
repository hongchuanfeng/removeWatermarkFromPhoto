'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useRef } from 'react'

export default function ImageGrid() {
  const { t } = useLanguage()
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [gridCols, setGridCols] = useState(2)
  const [gridSpacing, setGridSpacing] = useState(10)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages: string[] = []
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          newImages.push(e.target?.result as string)
          if (newImages.length === files.length) {
            setSelectedImages([...selectedImages, ...newImages])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleProcess = async () => {
    if (selectedImages.length === 0) return
    setIsProcessing(true)
    setTimeout(() => {
      setProcessedImage(selectedImages[0])
      setIsProcessing(false)
    }, 2000)
  }

  const handleDownload = () => {
    if (!processedImage) return
    const link = document.createElement('a')
    link.download = 'image-grid.png'
    link.href = processedImage
    link.click()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('nav.image_grid')}</h1>
        <p className="text-lg text-gray-600">{t('image_grid.description')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <label className="text-gray-700">{t('image_grid.columns')}:</label>
          <select 
            value={gridCols}
            onChange={(e) => setGridCols(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
          <label className="text-gray-700 ml-4">{t('image_grid.spacing')}:</label>
          <select 
            value={gridSpacing}
            onChange={(e) => setGridSpacing(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value={0}>0</option>
            <option value={5}>5px</option>
            <option value={10}>10px</option>
            <option value={20}>20px</option>
          </select>
        </div>

        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition mb-6"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-4 text-lg text-gray-600">{t('image_grid.upload_multiple')}</p>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            multiple
            className="hidden" 
            onChange={handleFileChange}
          />
          <p className="mt-2 text-sm text-gray-500">{t('image_grid.supported')}</p>
        </div>

        {selectedImages.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600 mb-2">{selectedImages.length} {t('image_grid.images_selected')}</p>
            <div className="flex flex-wrap gap-2">
              {selectedImages.map((img, idx) => (
                <img key={idx} src={img} alt={`Selected ${idx}`} className="w-20 h-20 object-cover rounded" />
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleProcess}
            disabled={isProcessing || selectedImages.length === 0}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            {isProcessing ? t('image_grid.processing') : t('image_grid.create_grid')}
          </button>
        </div>

        {processedImage && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{t('image_grid.result')}</h3>
            <div className="flex justify-center mb-6">
              <img src={processedImage} alt="Processed" className="max-w-full rounded-lg" />
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                {t('image_grid.download')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

