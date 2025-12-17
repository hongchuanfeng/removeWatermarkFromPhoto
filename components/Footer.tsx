'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">RemoveWatermark</h3>
            <p className="text-sm">
              Professional AI-powered watermark and logo removal service.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition">
                  {t('footer.refund')}
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition">
                  {t('footer.disclaimer')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">More</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/copyright" className="hover:text-white transition">
                  {t('footer.copyright')}
                </Link>
              </li>
              <li>
                <Link href="/legal-notice" className="hover:text-white transition">
                  {t('footer.legal')}
                </Link>
              </li>
              <li>
                <Link href="/intellectual-property" className="hover:text-white transition">
                  {t('footer.ip')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-medium">{t('footer.email')}:</span>{' '}
                <a href="mailto:support@chdaoai.com" className="hover:text-white transition">
                  support@chdaoai.com
                </a>
              </li>
              <li>
                <span className="font-medium">{t('footer.address')}:</span>{' '}
                {t('footer.address.value')}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} RemoveWatermark. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
