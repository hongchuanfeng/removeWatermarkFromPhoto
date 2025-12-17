'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function TermsOfServicePage() {
  const { t } = useLanguage()
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('terms.title')}</h1>
      <div className="prose max-w-none text-gray-700 bg-white rounded-lg shadow-sm p-8">
        <p className="text-sm text-gray-500 mb-6">{t('terms.lastUpdated')} {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.acceptance')}</h2>
          <p className="mb-4">
            {t('terms.acceptanceText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.serviceDesc')}</h2>
          <p className="mb-4">
            {t('terms.serviceDescText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.use')}</h2>
          <p className="mb-4">{t('terms.useText')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.subscription')}</h2>
          <p className="mb-4">
            {t('terms.subscriptionText')}
          </p>
          <p className="mb-2 font-semibold">{t('terms.subscriptionDetails')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('terms.subscription1')}</li>
            <li>{t('terms.subscription2')}</li>
            <li>{t('terms.subscription3')}</li>
            <li>{t('terms.subscription4')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.accounts')}</h2>
          <p className="mb-4">
            {t('terms.accountsText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.ip')}</h2>
          <p className="mb-4">
            {t('terms.ipText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.prohibited')}</h2>
          <p className="mb-4">{t('terms.prohibitedText')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('terms.prohibited1')}</li>
            <li>{t('terms.prohibited2')}</li>
            <li>{t('terms.prohibited3')}</li>
            <li>{t('terms.prohibited4')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.serviceChanges')}</h2>
          <p className="mb-4">
            {t('terms.serviceChangesText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.termination')}</h2>
          <p className="mb-4">
            {t('terms.terminationText')}
          </p>
          <p className="mb-4">
            {t('terms.terminationUser')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.liability')}</h2>
          <p className="mb-4">
            {t('terms.liabilityText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.warranties')}</h2>
          <p className="mb-4">
            {t('terms.warrantiesText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.indemnification')}</h2>
          <p className="mb-4">
            {t('terms.indemnificationText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.disputes')}</h2>
          <p className="mb-4">
            {t('terms.disputesText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.governing')}</h2>
          <p className="mb-4">
            {t('terms.governingText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.contact')}</h2>
          <p className="mb-4">
            {t('terms.contactText')}{' '}
            <a href="mailto:support@chdaoai.com" className="text-primary-600 hover:underline">
              support@chdaoai.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
