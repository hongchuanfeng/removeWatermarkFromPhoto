'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const ensureUserRecord = async (u: any) => {
    if (!u?.id) return
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', u.id)
      .single()

    // If not found, insert a new record with default credits
    if ((error && error.code === 'PGRST116') || (!data && !error)) {
      await supabase
        .from('users')
        .insert({
          id: u.id,
          email: u.email,
          credits: 5,
        })
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        await ensureUserRecord(user)
      }
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        ensureUserRecord(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : '/',
      },
    })
    if (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center" onClick={() => setMobileOpen(false)}>
              <span className="text-2xl font-bold text-primary-600">RemoveWatermark</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:ml-10 md:flex md:space-x-4">
              <Link href="/" className="text-gray-700 hover:text-primary-600 px-2 py-2 text-sm font-medium whitespace-nowrap">
                {t('nav.home')}
              </Link>
              <Link href="/ai-age-change" className="text-gray-700 hover:text-primary-600 px-2 py-2 text-sm font-medium whitespace-nowrap">
                {t('nav.ai_age_change')}
              </Link>
              <Link href="/gender-swapper" className="text-gray-700 hover:text-primary-600 px-2 py-2 text-sm font-medium whitespace-nowrap">
                {t('nav.gender_swapper')}
              </Link>
              <Link href="/ai-face-beautify" className="text-gray-700 hover:text-primary-600 px-2 py-2 text-sm font-medium whitespace-nowrap">
                {t('nav.ai_face_beautify')}
              </Link>
              <Link href="/subscribe" className="text-gray-700 hover:text-primary-600 px-2 py-2 text-sm font-medium whitespace-nowrap">
                {t('nav.subscribe')}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language selector */}
            <div className="relative hidden sm:block">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'zh' | 'ru' | 'ar' | 'de' | 'ja' | 'fr' | 'es' | 'pt' | 'ko')}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer min-w-[120px]"
                style={{ color: '#111827' }}
              >
                <option value="en" style={{ color: '#111827', backgroundColor: '#ffffff' }}>English</option>
                <option value="zh" style={{ color: '#111827', backgroundColor: '#ffffff' }}>中文</option>
                <option value="ru" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Русский</option>
                <option value="ar" style={{ color: '#111827', backgroundColor: '#ffffff' }}>العربية</option>
                <option value="de" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Deutsch</option>
                <option value="ja" style={{ color: '#111827', backgroundColor: '#ffffff' }}>日本語</option>
                <option value="fr" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Français</option>
                <option value="es" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Español</option>
                <option value="pt" style={{ color: '#111827', backgroundColor: '#ffffff' }}>Português</option>
                <option value="ko" style={{ color: '#111827', backgroundColor: '#ffffff' }}>한국어</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none"
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(prev => !prev)}
            >
              {mobileOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Desktop user/login area (hidden on very small screens) */}
            <div className="hidden sm:flex items-center space-x-2">
              {loading ? (
                <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              ) : user ? (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t('nav.profile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleGoogleLogin}
                    className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>
                  <Link
                    href="/auth/login"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition"
                  >
                    {t('nav.login')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="px-4 pt-4 pb-4 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
              {t('nav.home')}
            </Link>
            <Link href="/ai-age-change" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
              {t('nav.ai_age_change')}
            </Link>
            <Link href="/gender-swapper" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
              {t('nav.gender_swapper')}
            </Link>
            <Link href="/ai-face-beautify" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
              {t('nav.ai_face_beautify')}
            </Link>
            <Link href="/subscribe" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
              {t('nav.subscribe')}
            </Link>

            <div className="border-t border-gray-100 mt-2 pt-2">
              {loading ? (
                <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              ) : user ? (
                <>
                  <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
                    {t('nav.profile')}
                  </Link>
                  <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setMobileOpen(false); handleGoogleLogin(); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                    {t('nav.login')} (Google)
                  </button>
                  <Link href="/auth/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
                    {t('nav.login')}
                  </Link>
                </>
              )}
            </div>

            <div className="pt-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'zh' | 'ru' | 'ar' | 'de' | 'ja' | 'fr' | 'es' | 'pt' | 'ko')}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900"
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
                <option value="ru">Русский</option>
                <option value="ar">العربية</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="pt">Português</option>
                <option value="ko">한국어</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
