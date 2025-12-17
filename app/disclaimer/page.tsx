'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function DisclaimerPage() {
  const { t } = useLanguage()
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('disclaimer.title')}</h1>
      <div className="prose max-w-none text-gray-700 bg-white rounded-lg shadow-sm p-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('disclaimer.service')}</h2>
          <p className="mb-4">
            {t('disclaimer.serviceText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('disclaimer.legalUse')}</h2>
          <p className="mb-4">
            {t('disclaimer.legalUseText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('disclaimer.copyright')}</h2>
          <p className="mb-4">
            {t('disclaimer.copyrightText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('disclaimer.liability')}</h2>
          <p className="mb-4">
            {t('disclaimer.liabilityText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('disclaimer.availability')}</h2>
          <p className="mb-4">
            {t('disclaimer.availabilityText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('disclaimer.accuracy')}</h2>
          <p className="mb-4">
            {t('disclaimer.accuracyText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('disclaimer.thirdParty')}</h2>
          <p className="mb-4">
            {t('disclaimer.thirdPartyText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('disclaimer.technical')}</h2>
          <p className="mb-4">
            {t('disclaimer.technicalText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('disclaimer.userContent')}</h2>
          <p className="mb-4">
            {t('disclaimer.userContentText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('disclaimer.medical')}</h2>
          <p className="mb-4">
            {t('disclaimer.medicalText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('disclaimer.force')}</h2>
          <p className="mb-4">
            {t('disclaimer.forceText')}
          </p>
        </section>
      </div>
    </div>
  )
}
