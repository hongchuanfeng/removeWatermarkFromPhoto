'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function Subscribe() {
  const { t } = useLanguage()

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('subscription.title') || 'Choose Your Plan'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subscription.subtitle') || 'Unlock unlimited access to all AI-powered features'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan - $10/month, 30 credits */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('subscription.basic.title') || 'Basic'}
              </h3>
              <div className="text-4xl font-bold text-primary-600 mb-1">
                ${t('subscription.basic.price') || '10'}
              </div>
              <p className="text-gray-600 mb-2">
                {t('subscription.basic.period') || '/month'}
              </p>
              <p className="text-lg font-semibold text-primary-600 mb-6">
                {t('subscription.basic.credits') || '30 credits'}
              </p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{t('subscription.basic.feature1') || '30 credits per month'}</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{t('subscription.basic.feature2') || 'All AI features'}</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{t('subscription.basic.feature3') || 'HD quality output'}</span>
                </li>
              </ul>
              <button className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700">
                {t('subscription.basic.button') || 'Choose Basic'}
              </button>
            </div>
          </div>

          {/* Pro Plan - $30/month, 100 credits */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-primary-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                {t('subscription.popular') || 'Most Popular'}
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('subscription.pro.title') || 'Pro'}
              </h3>
              <div className="text-4xl font-bold text-primary-600 mb-1">
                ${t('subscription.pro.price') || '30'}
              </div>
              <p className="text-gray-600 mb-2">
                {t('subscription.pro.period') || '/month'}
              </p>
              <p className="text-lg font-semibold text-primary-600 mb-6">
                {t('subscription.pro.credits') || '100 credits'}
              </p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{t('subscription.pro.feature1') || '100 credits per month'}</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{t('subscription.pro.feature2') || 'All AI features'}</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{t('subscription.pro.feature3') || '4K quality output'}</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{t('subscription.pro.feature4') || 'Priority processing'}</span>
                </li>
              </ul>
              <button className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700">
                {t('subscription.pro.button') || 'Choose Pro'}
              </button>
            </div>
          </div>

          {/* Enterprise Plan - $100/month, 350 credits */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('subscription.enterprise.title') || 'Enterprise'}
              </h3>
              <div className="text-4xl font-bold text-primary-600 mb-1">
                ${t('subscription.enterprise.price') || '100'}
              </div>
              <p className="text-gray-600 mb-2">
                {t('subscription.enterprise.period') || '/month'}
              </p>
              <p className="text-lg font-semibold text-primary-600 mb-6">
                {t('subscription.enterprise.credits') || '350 credits'}
              </p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{t('subscription.enterprise.feature1') || '350 credits per month'}</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{t('subscription.enterprise.feature2') || 'All AI features'}</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{t('subscription.enterprise.feature3') || '8K quality output'}</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{t('subscription.enterprise.feature4') || 'API access'}</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{t('subscription.enterprise.feature5') || 'Dedicated support'}</span>
                </li>
              </ul>
              <button className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700">
                {t('subscription.enterprise.button') || 'Choose Enterprise'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
