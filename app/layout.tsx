import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import NewsletterButton from '@/components/NewsletterButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Summly — Tech & Innovation News',
  description: 'Top tech and innovation stories, updated every 30 minutes. EN/ES.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
          <NewsletterButton />
        </LanguageProvider>
      </body>
    </html>
  )
}
