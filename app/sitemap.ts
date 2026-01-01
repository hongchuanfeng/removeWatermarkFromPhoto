import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://removewatermark.chdaoai.com'
  const locales = ['en', 'zh', 'ru', 'ar', 'de', 'ja', 'fr', 'es', 'pt', 'ko']
  const routes = [
    '',
    '/about',
    '/contact',
    '/subscribe',
    '/remove-watermark',
    '/ai-age-change',
    '/gender-swapper',
    '/ai-face-beautify',
    '/privacy-policy',
    '/terms-of-service',
    '/refund-policy',
    '/disclaimer',
    '/copyright',
    '/legal-notice',
    '/intellectual-property',
    '/profile'
  ]

  const sitemap: MetadataRoute.Sitemap = []

  // 为每种语言生成所有路由
  locales.forEach(locale => {
    const localePrefix = locale === 'en' ? '' : `/${locale}`

    routes.forEach(route => {
      const url = `${baseUrl}${localePrefix}${route}`

      // 设置优先级和更新频率
      let priority = 0.5
      let changeFrequency: 'yearly' | 'monthly' | 'weekly' | 'daily' = 'yearly'

      if (route === '') {
        priority = 1
        changeFrequency = 'daily'
      } else if (route === '/remove-watermark') {
        priority = 1
        changeFrequency = 'daily'
      } else if (route === '/subscribe') {
        priority = 0.9
        changeFrequency = 'weekly'
      } else if (['/about', '/contact'].includes(route)) {
        priority = 0.8
        changeFrequency = 'monthly'
      }

      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency,
        priority,
      })
    })
  })

  return sitemap
}
