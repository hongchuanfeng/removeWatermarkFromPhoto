'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useRef } from 'react'

export default function ViewExif() {
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [exifData, setExifData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
        
        // Extract EXIF data (simulated for demo)
        // In a real implementation, you'd use a library like exif-js
        setExifData({
          'File Name': file.name,
          'File Size': (file.size / 1024).toFixed(2) + ' KB',
          'File Type': file.type,
          'Image Width': '1920',
          'Image Height': '1080',
          'Camera Make': 'Canon',
          'Camera Model': 'EOS R5',
          'Date Taken': new Date().toLocaleDateString(),
          'ISO': '400',
          'Aperture': 'f/2.8',
          'Shutter Speed': '1/250s',
          'Focal Length': '50mm',
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClear = () => {
    setSelectedImage(null)
    setExifData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('nav.view_exif')}</h1>
        <p className="text-lg text-gray-600">{t('view_exif.description')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        {!selectedImage ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary-500 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-4 text-lg text-gray-600">{t('view_exif.upload')}</p>
            <p className="mt-2 text-sm text-gray-500">{t('view_exif.supported')}</p>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <img src={selectedImage} alt="Selected" className="max-w-full max-h-96 rounded-lg" />
            </div>

            {exifData && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{t('view_exif.data')}</h3>
                <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      {Object.entries(exifData).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-200">
                          <td className="py-2 px-4 font-medium text-gray-700">{key}</td>
                          <td className="py-2 px-4 text-gray-600">{value as string}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleClear}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                {t('common.clear')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

