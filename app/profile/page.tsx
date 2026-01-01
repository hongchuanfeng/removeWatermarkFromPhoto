'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ProfilePage() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [conversions, setConversions] = useState<any[]>([])
  const [credits, setCredits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      // Load user data
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      setUserData(userData)

      // Load orders
      const { data: ordersData } = await supabase
        .from('subscription_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setOrders(ordersData || [])

      // Load conversions
      const { data: conversionsData } = await supabase
        .from('conversions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setConversions(conversionsData || [])

      // Load credit history
      const { data: creditHistoryData } = await supabase
        .from('credit_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setCredits(creditHistoryData || [])

      setLoading(false)
    }

    loadData()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-black">{t('profile.title')}</h1>
        <p className="text-gray-600">{t('profile.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">{t('profile.accountInfo')}</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('profile.email')}</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{t('profile.availableCredits')}</p>
                <p className="text-2xl font-bold text-primary-600">{userData?.credits || 0}</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/subscribe')}
              className="mt-6 w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium"
            >
              {t('profile.subscribe')}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Orders</h2>
              <span className="text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No orders yet</p>
                <button
                  onClick={() => router.push('/subscribe')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Subscribe Now →
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('profile.orderDate')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('profile.orderAmount')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('profile.orderCredits')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('profile.orderStatus')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${order.amount / 100}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.credits}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t('profile.myConversions')}</h2>
              <span className="text-sm text-gray-500">{conversions.length} {t('profile.conversion')}{conversions.length !== 1 ? 's' : ''}</span>
            </div>
            {conversions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">{t('profile.noConversions')}</p>
                <button
                  onClick={() => router.push('/remove-watermark')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('removeWatermark.removeButton')} →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {conversions.map((conversion) => (
                  <div key={conversion.id} className="border-b border-gray-200 pb-4">
                    <p className="text-sm text-gray-600">
                      {new Date(conversion.created_at).toLocaleString()}
                    </p>
                    <div className="mt-2 flex space-x-4">
                      <a
                        href={conversion.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline text-sm"
                      >
                        {t('profile.viewOriginal')}
                      </a>
                      <a
                        href={conversion.result_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline text-sm"
                      >
                        {t('profile.viewResult')}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t('profile.myCredits')}</h2>
              <span className="text-sm text-gray-500">{credits.length} {t('profile.record')}{credits.length !== 1 ? 's' : ''}</span>
            </div>
            {credits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">{t('profile.noCredits')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('profile.creditDate')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('profile.creditType')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('profile.creditAmount')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('profile.creditDescription')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {credits.map((credit) => (
                      <tr key={credit.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(credit.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            credit.type === 'earned' || credit.type === 'initial'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {credit.type === 'earned' ? t('profile.creditEarned') : credit.type === 'spent' ? t('profile.creditSpent') : t('profile.creditInitial')}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          credit.type === 'earned' || credit.type === 'initial'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {credit.type === 'earned' || credit.type === 'initial' ? '+' : '-'}{Math.abs(credit.amount)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {credit.description || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
