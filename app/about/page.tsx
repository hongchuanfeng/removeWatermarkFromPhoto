'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('about.title')}</h1>
      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 mb-6">
          {t('about.welcome')}
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('about.mission')}</h2>
        <p className="text-gray-700 mb-6">
          {t('about.missionText')}
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('about.technology')}</h2>
        <p className="text-gray-700 mb-6">
          {t('about.technologyText')}
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('about.whyChoose')}</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>{t('about.reason1')}</li>
          <li>{t('about.reason2')}</li>
          <li>{t('about.reason3')}</li>
          <li>{t('about.reason4')}</li>
          <li>{t('about.reason5')}</li>
        </ul>
      </div>
    </div>
  )
}
