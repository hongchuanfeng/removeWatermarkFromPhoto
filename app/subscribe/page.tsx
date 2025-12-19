'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import axios from 'axios'
import { getPlans } from '@/lib/config'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SubscribePage() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [supabase])

  const handleSubscribe = async (productId: string) => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    try {
      console.log('[Subscribe] Creating checkout for product:', productId)
      
      const response = await axios.post(
        '/api/creem/checkout',
        {
          product_id: productId,
          metadata: {
            internal_customer_id: user.id,
            email: user.email ?? undefined,
          },
        }
      )

      console.log('[Subscribe] Checkout response:', response.data)

      if (response.data.url) {
        console.log('[Subscribe] Redirecting to:', response.data.url)
        window.location.href = response.data.url
      } else {
        console.error('[Subscribe] No URL in response:', response.data)
        alert(t('subscribe.checkoutError') || 'Failed to get checkout URL. Please try again.')
      }
    } catch (error: any) {
      console.error('[Subscribe] Error creating checkout:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          t('subscribe.checkoutError') || 
                          'Failed to create checkout. Please try again.'
      alert(errorMessage)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
        {t('subscribe.title')}
      </h1>
      <p className="text-center text-gray-600 mb-12">
        {t('subscribe.subtitle')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {getPlans().map((plan, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-lg p-8 ${
              index === 1 ? 'border-2 border-primary-600 scale-105' : ''
            }`}
          >
            {index === 1 && (
              <div className="bg-primary-600 text-white text-center py-2 rounded-t-lg -mt-8 -mx-8 mb-4">
                {t('subscribe.mostPopular')}
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
              <span className="text-gray-600">{t('subscribe.month')}</span>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 mb-2 font-semibold">{plan.credits} {t('subscribe.credits')}</p>
              <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>{t('subscribe.feature1')}</li>
                <li>{t('subscribe.feature2')}</li>
                <li>{t('subscribe.feature3')}</li>
                <li>{t('subscribe.feature4')}</li>
                <li>{t('subscribe.feature5')}</li>
              </ul>
            </div>
            <button
              onClick={() => handleSubscribe(plan.productId)}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                index === 1
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {t('subscribe.subscribeNow')}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
