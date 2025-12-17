'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          created_at: new Date().toISOString(),
        })

      if (insertError) {
        throw insertError
      }

      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (err: any) {
      console.error('Error submitting message:', err)
      setError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('contact.title')}</h1>
        <p className="text-gray-600">{t('contact.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-6">{t('contact.getInTouch')}</h2>
          <div className="space-y-6 text-gray-700">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <a href="mailto:support@chdaoai.com" className="text-primary-600 hover:text-primary-700 hover:underline">
                  support@chdaoai.com
                </a>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 mb-1">{t('footer.address')}</h3>
                <p className="text-gray-600">{t('footer.address.value')}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4">{t('contact.businessHours')}</h2>
            <p className="text-gray-700 mb-2">{t('contact.businessHoursText')}</p>
            <p className="text-gray-600 font-medium">{t('contact.hours')}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">{t('contact.response')}</h2>
            <p className="text-gray-700">{t('contact.responseText')}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">{t('contact.support')}</h2>
            <p className="text-gray-700 mb-3">{t('contact.supportText')}</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>{t('contact.support1')}</li>
              <li>{t('contact.support2')}</li>
              <li>{t('contact.support3')}</li>
            </ul>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">{t('contact.technical')}</h2>
            <p className="text-gray-700 mb-3">{t('contact.technicalText')}</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>{t('contact.technical1')}</li>
              <li>{t('contact.technical2')}</li>
              <li>{t('contact.technical3')}</li>
              <li>{t('contact.technical4')}</li>
            </ul>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">{t('contact.feedback')}</h2>
            <p className="text-gray-700">{t('contact.feedbackText')}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">{t('contact.partnership')}</h2>
            <p className="text-gray-700 mb-2">
              {t('contact.partnershipText')}{' '}
              <a href="mailto:business@chdaoai.com" className="text-primary-600 hover:text-primary-700 hover:underline">
                {t('contact.partnershipEmail')}
              </a>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">{t('contact.sendMessage')}</h2>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold">{t('contact.success')}</p>
                  <p className="text-sm mt-1">{t('contact.successMessage')}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setError(null)
                }}
                className="mt-4 text-sm text-green-700 hover:text-green-800 underline"
              >
                {t('contact.sendAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.name')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contact.message')}
                </label>
                <textarea
                  required
                  rows={5}
                  minLength={10}
                  maxLength={1000}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
                  placeholder={`${t('contact.message')} (10-1000 ${t('contact.charCount')})`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.message.length}/1000 {t('contact.charCount')}
                </p>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? t('contact.sending') : t('contact.sendButton')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
