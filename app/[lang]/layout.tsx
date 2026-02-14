import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { LanguageProvider } from '@/contexts/LanguageContext'

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  
  return (
    <LanguageProvider lang={lang}>
      <Navbar />
      {children}
      <Footer />
    </LanguageProvider>
  )
}
