'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LoginPage() {
  const { t } = useLanguage()
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authView, setAuthView] = useState<'sign_in' | 'sign_up' | 'forgotten_password'>('sign_in')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/profile')
      }
      setLoading(false)
    }
    checkUser()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('login.title')}
          </h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google']}
            redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/profile` : '/profile'}
            onlyThirdPartyProviders={false}
            magicLink={false}
            showLinks={false}
            view={authView}
            localization={{
              variables: {
                sign_in: {
                  email_label: t('login.email') || 'Email',
                  password_label: t('login.password') || 'Password',
                  email_input_placeholder: t('login.email_placeholder') || 'Your email address',
                  password_input_placeholder: t('login.password_placeholder') || 'Your password',
                  button_label: t('login.sign_in_button') || 'Sign In',
                  loading_button_label: t('login.signing_in') || 'Signing in...',
                  social_provider_text: t('login.or_continue_with') || 'or continue with',
                  link_text: '还没有账户？注册',
                },
                sign_up: {
                  email_label: t('login.email') || 'Email',
                  password_label: t('login.password') || 'Password',
                  email_input_placeholder: t('login.email_placeholder') || 'Your email address',
                  password_input_placeholder: t('login.password_placeholder') || 'Your password',
                  button_label: t('login.sign_up_button') || 'Sign Up',
                  loading_button_label: t('login.signing_up') || 'Signing up...',
                  social_provider_text: t('login.or_continue_with') || 'or continue with',
                  link_text: '已有账号，去登录',
                  confirmation_text: t('login.confirmation_text') || 'Check your email for the confirmation link',
                },
                forgotten_password: {
                  email_label: t('login.email') || 'Email',
                  password_label: t('login.password') || 'Password',
                  email_input_placeholder: t('login.email_placeholder') || 'Your email address',
                  button_label: t('login.reset_password_button') || 'Send reset password instructions',
                  loading_button_label: t('login.sending') || 'Sending...',
                  link_text: t('login.back_to_sign_in') || 'Back to sign in',
                  confirmation_text: t('login.reset_instructions') || 'Check your email for the password reset link',
                },
              },
            }}
          />
          <div className="mt-4 text-center">
            {authView === 'sign_in' && (
              <button
                type="button"
                className="text-sm text-gray-600 hover:underline"
                onClick={() => setAuthView('sign_up')}
              >
                {t('login.no_account') || '还没有账户？注册'}
              </button>
            )}
            {authView === 'sign_up' && (
              <button
                type="button"
                className="text-sm text-gray-600 hover:underline"
                onClick={() => setAuthView('sign_in')}
              >
                {t('login.have_account') || '已有账号，去登录'}
              </button>
            )}
            {authView === 'forgotten_password' && (
              <button
                type="button"
                className="text-sm text-gray-600 hover:underline"
                onClick={() => setAuthView('sign_in')}
              >
                {t('login.back_to_sign_in') || '返回登录'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
