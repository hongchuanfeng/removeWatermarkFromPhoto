'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function UseCases() {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('usecases.title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('usecases.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{t('usecases.photography')}</h3>
            <p className="text-gray-600">
              {t('usecases.photography.desc')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{t('usecases.business')}</h3>
            <p className="text-gray-600">
              {t('usecases.business.desc')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{t('usecases.personal')}</h3>
            <p className="text-gray-600">
              {t('usecases.personal.desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
