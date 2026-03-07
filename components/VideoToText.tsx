'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function VideoToText() {
  const { t } = useLanguage()

  const examples = [
    { image: '/video/text/1.jpg', title: t('video_to_text.example_desc1') },
    { image: '/video/text/2.jpg', title: t('video_to_text.example_desc2') },
    { image: '/video/text/3.jpg', title: t('video_to_text.example_desc3') },
  ]

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('video_to_text.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('video_to_text.description')}
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl mx-auto">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('video_to_text.upload_title')}
            </h3>
            <p className="text-gray-500 mb-4">
              {t('video_to_text.click_to_upload')}
            </p>
            <p className="text-sm text-gray-400">
              {t('video_to_text.supported_formats')}
            </p>
          </div>

          {/* Coming Soon Badge */}
          <div className="mt-8 text-center">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
              🚧 {t('video_to_text.coming_soon')}
            </span>
          </div>
        </div>

        {/* Examples Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            {t('video_to_text.examples_title')}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {t('video_to_text.examples_desc')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {examples.map((example, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={example.image}
                    alt={`${t('video_to_text.example')} ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 font-medium">{example.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

