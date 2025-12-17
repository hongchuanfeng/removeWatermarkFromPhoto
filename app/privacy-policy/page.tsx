'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function PrivacyPolicyPage() {
  const { t } = useLanguage()
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('privacy.title')}</h1>
      <div className="prose max-w-none text-gray-700 bg-white rounded-lg shadow-sm p-8">
        <p className="text-sm text-gray-500 mb-6">{t('terms.lastUpdated')} {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.intro')}</h2>
          <p className="mb-4">
            {t('privacy.introText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.collect')}</h2>
          <p className="mb-4">{t('privacy.collectText')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacy.collect1')}</li>
            <li>{t('privacy.collect2')}</li>
            <li>{t('privacy.collect3')}</li>
            <li>{t('privacy.collect4')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.use')}</h2>
          <p className="mb-4">{t('privacy.useText')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacy.use1')}</li>
            <li>{t('privacy.use2')}</li>
            <li>{t('privacy.use3')}</li>
            <li>{t('privacy.use4')}</li>
            <li>{t('privacy.use5')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.security')}</h2>
          <p className="mb-4">
            {t('privacy.securityText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.retention')}</h2>
          <p className="mb-4">
            {t('privacy.retentionText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.rights')}</h2>
          <p className="mb-4">{t('privacy.rightsText')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacy.rights1')}</li>
            <li>{t('privacy.rights2')}</li>
            <li>{t('privacy.rights3')}</li>
            <li>{t('privacy.rights4')}</li>
            <li>{t('privacy.rights5')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.contact')}</h2>
          <p className="mb-4">
            {t('privacy.contactText')}{' '}
            <a href="mailto:support@chdaoai.com" className="text-primary-600 hover:underline">
              support@chdaoai.com
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.cookies')}</h2>
          <p className="mb-4">
            {t('privacy.cookiesText')}
          </p>
          <p className="mb-2 font-semibold">{t('privacy.cookiesTypes')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacy.cookies1')}</li>
            <li>{t('privacy.cookies2')}</li>
            <li>{t('privacy.cookies3')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.thirdParty')}</h2>
          <p className="mb-4">
            {t('privacy.thirdPartyText')}
          </p>
          <p className="mb-2 font-semibold">{t('privacy.thirdPartyList')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacy.thirdParty1')}</li>
            <li>{t('privacy.thirdParty2')}</li>
            <li>{t('privacy.thirdParty3')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.international')}</h2>
          <p className="mb-4">
            {t('privacy.internationalText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.children')}</h2>
          <p className="mb-4">
            {t('privacy.childrenText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacy.changes')}</h2>
          <p className="mb-4">
            {t('privacy.changesText')}
          </p>
        </section>
      </div>
    </div>
  )
}
