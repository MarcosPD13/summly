'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Language } from '@/lib/types'

interface LanguageContextType {
  lang: Language
  setLang: (l: Language) => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('summly_lang')
      if (saved === 'en' || saved === 'es' || saved === 'fr') return saved
    }
    return 'es'
  })

  const setLangPersist = (l: Language) => {
    setLang(l)
    if (typeof window !== 'undefined') localStorage.setItem('summly_lang', l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangPersist }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
