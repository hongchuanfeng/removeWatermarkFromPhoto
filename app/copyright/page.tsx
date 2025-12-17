'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function CopyrightPage() {
  const { t } = useLanguage()
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('copyright.title')}</h1>
      <div className="prose max-w-none text-gray-700 bg-white rounded-lg shadow-sm p-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('copyright.ownership')}</h2>
          <p className="mb-4">
            {t('copyright.ownershipText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('copyright.userContent')}</h2>
          <p className="mb-4">
            {t('copyright.userContentText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('copyright.prohibited')}</h2>
          <p className="mb-4">{t('copyright.prohibitedText')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('copyright.prohibited1')}</li>
            <li>{t('copyright.prohibited2')}</li>
            <li>{t('copyright.prohibited3')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('copyright.license')}</h2>
          <p className="mb-4">
            {t('copyright.licenseText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('copyright.fairUse')}</h2>
          <p className="mb-4">
            {t('copyright.fairUseText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('copyright.attribution')}</h2>
          <p className="mb-4">
            {t('copyright.attributionText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('copyright.enforcement')}</h2>
          <p className="mb-4">
            {t('copyright.enforcementText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('copyright.international')}</h2>
          <p className="mb-4">
            {t('copyright.internationalText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('copyright.dmca')}</h2>
          <p className="mb-4">
            {t('copyright.dmcaText')}{' '}
            <a href="mailto:support@chdaoai.com" className="text-primary-600 hover:underline">
              support@chdaoai.com
            </a>{' '}
            {t('copyright.dmcaText2')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('copyright.contact')}</h2>
          <p className="mb-4">
            {t('copyright.contactText')}{' '}
            <a href="mailto:support@chdaoai.com" className="text-primary-600 hover:underline">
              support@chdaoai.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
