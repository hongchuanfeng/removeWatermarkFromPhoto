'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function RefundPolicyPage() {
  const { t } = useLanguage()
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('refund.title')}</h1>
      <div className="prose max-w-none text-gray-700 bg-white rounded-lg shadow-sm p-8">
        <p className="text-sm text-gray-500 mb-6">{t('terms.lastUpdated')} {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('refund.conditions')}</h2>
          <p className="mb-4">
            {t('refund.conditionsText')}
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('refund.conditions1')}</li>
            <li>{t('refund.conditions2')}</li>
            <li>{t('refund.conditions3')}</li>
            <li>{t('refund.conditions4')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('refund.howTo')}</h2>
          <p className="mb-4">
            {t('refund.howToText')}{' '}
            <a href="mailto:support@chdaoai.com" className="text-primary-600 hover:underline">
              support@chdaoai.com
            </a>{' '}
            {t('refund.howToText2')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('refund.processing')}</h2>
          <p className="mb-4">
            {t('refund.processingText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('refund.partial')}</h2>
          <p className="mb-4">
            {t('refund.partialText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('refund.method')}</h2>
          <p className="mb-4">
            {t('refund.methodText')}
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('refund.method1')}</li>
            <li>{t('refund.method2')}</li>
            <li>{t('refund.method3')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('refund.nonRefundable')}</h2>
          <p className="mb-4">{t('refund.nonRefundableText')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('refund.nonRefundable1')}</li>
            <li>{t('refund.nonRefundable2')}</li>
            <li>{t('refund.nonRefundable3')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('refund.disputes')}</h2>
          <p className="mb-4">
            {t('refund.disputesText')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('refund.exceptions')}</h2>
          <p className="mb-4">
            {t('refund.exceptionsText')}
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('refund.exceptions1')}</li>
            <li>{t('refund.exceptions2')}</li>
            <li>{t('refund.exceptions3')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('refund.cancellation')}</h2>
          <p className="mb-4">
            {t('refund.cancellationText')}
          </p>
        </section>
      </div>
    </div>
  )
}
