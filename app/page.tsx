'use client'

import { useLanguage } from '@/context/LanguageContext'
import NewsFeed from '@/components/NewsFeed'

const ALL_SOURCES = 'TechCrunch · The Verge · Wired · Ars Technica · VentureBeat · MIT Tech Review · Hacker News · Xataka · Genbeta · Hipertextual · FayerWayer'

const UI = {
  en: {
    tagline: 'Tech & Innovation',
    subtitle: 'Top 20 stories from global tech sources, translated to English and AI-summarized. Auto-updates every 30 min. Stories expire after 12h.',
    sources: ALL_SOURCES,
  },
  es: {
    tagline: 'Tecnología e Innovación',
    subtitle: 'Las 20 historias más relevantes de fuentes tech globales, traducidas al español y resumidas con IA. Se actualiza cada 30 min. Las noticias expiran a las 12h.',
    sources: ALL_SOURCES,
  },
}

export default function Home() {
  const { lang, setLang } = useLanguage()
  const t = UI[lang]

  return (
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bg/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 bg-accent/20 rounded-lg border border-accent/30">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-wide">TechPulse</span>
              <span className="block text-xs text-slate-500 leading-none">{t.tagline}</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse-dot" />
              Live
            </div>

            {/* Language toggle */}
            <div className="flex items-center bg-surface border border-white/[0.07] rounded-full p-0.5">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                  lang === 'en'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('es')}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                  lang === 'es'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero strip */}
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-6">
        <p className="text-slate-500 text-sm leading-relaxed mb-2">{t.subtitle}</p>
        <p className="text-slate-600 text-xs">{t.sources}</p>
      </div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <NewsFeed />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between text-xs text-slate-600">
          <span>TechPulse © {new Date().getFullYear()}</span>
          <span>Updates every 30 min · 12h expiry</span>
        </div>
      </footer>
    </main>
  )
}
