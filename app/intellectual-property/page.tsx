'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function IntellectualPropertyPage() {
  const { t } = useLanguage()
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('ip.title')}</h1>
      <div className="prose max-w-none text-gray-700 bg-white rounded-lg shadow-sm p-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('ip.our')}</h2>
          <p className="mb-4">
            {t('ip.ourText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('ip.user')}</h2>
          <p className="mb-4">
            {t('ip.userText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('ip.thirdParty')}</h2>
          <p className="mb-4">
            {t('ip.thirdPartyText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('ip.patents')}</h2>
          <p className="mb-4">
            {t('ip.patentsText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('ip.tradeSecrets')}</h2>
          <p className="mb-4">
            {t('ip.tradeSecretsText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('ip.trademarks')}</h2>
          <p className="mb-4">
            {t('ip.trademarksText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('ip.license')}</h2>
          <p className="mb-4">
            {t('ip.licenseText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('ip.restrictions')}</h2>
          <p className="mb-4">{t('ip.restrictionsText')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('ip.restrictions1')}</li>
            <li>{t('ip.restrictions2')}</li>
            <li>{t('ip.restrictions3')}</li>
            <li>{t('ip.restrictions4')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('ip.enforcement')}</h2>
          <p className="mb-4">
            {t('ip.enforcementText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('ip.thirdPartyIP')}</h2>
          <p className="mb-4">
            {t('ip.thirdPartyIPText')}
          </p>
        </section>
      </div>
    </div>
  )
}
