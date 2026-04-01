import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import { ThemeProvider } from '@/context/ThemeContext'
import NewsletterButton from '@/components/NewsletterButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Summly — Tech & Innovation News',
  description: 'Top tech and innovation stories, updated every 30 minutes. EN/ES.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('summly-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})()`,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <NewsletterButton />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
