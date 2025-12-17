'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LegalNoticePage() {
  const { t } = useLanguage()
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('legal.title')}</h1>
      <div className="prose max-w-none text-gray-700 bg-white rounded-lg shadow-sm p-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('legal.company')}</h2>
          <p className="mb-4">
            {t('legal.companyText')}
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>{t('legal.email')}</strong> support@chdaoai.com</p>
            <p><strong>{t('legal.address')}</strong> {t('footer.address.value')}</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('legal.liability')}</h2>
          <p className="mb-4">
            {t('legal.liabilityText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('legal.registration')}</h2>
          <p className="mb-4">
            {t('legal.registrationText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('legal.jurisdiction')}</h2>
          <p className="mb-4">
            {t('legal.jurisdictionText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('legal.content')}</h2>
          <p className="mb-4">
            {t('legal.contentText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('legal.modifications')}</h2>
          <p className="mb-4">
            {t('legal.modificationsText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('legal.liabilityLimit')}</h2>
          <p className="mb-4">
            {t('legal.liabilityLimitText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('legal.dataProtection')}</h2>
          <p className="mb-4">
            {t('legal.dataProtectionText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('legal.compliance')}</h2>
          <p className="mb-4">
            {t('legal.complianceText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('legal.links')}</h2>
          <p className="mb-4">
            {t('legal.linksText')}
          </p>
        </section>
      </div>
    </div>
  )
}
