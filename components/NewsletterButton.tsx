'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const UI = {
  en: {
    fab: 'Newsletter',
    title: 'Daily Tech Digest',
    desc: 'Get the top 5 tech stories delivered to your inbox at 9am and 5pm.',
    placeholder: 'your@email.com',
    cta: 'Subscribe',
    loading: 'Subscribing…',
    successTitle: "You're subscribed!",
    successDesc: 'First digest arrives at 9am.',
    errorGeneric: 'Something went wrong. Try again.',
    schedule: 'Delivered: 9am & 5pm · Every day',
  },
  es: {
    fab: 'Newsletter',
    title: 'Digest Tech Diario',
    desc: 'Recibí las 5 mejores noticias tech en tu correo a las 9am y 17pm.',
    placeholder: 'tu@email.com',
    cta: 'Suscribirme',
    loading: 'Suscribiendo…',
    successTitle: '¡Ya estás suscrito!',
    successDesc: 'El primer digest llega a las 9am.',
    errorGeneric: 'Algo salió mal. Intentá de nuevo.',
    schedule: 'Envíos: 9am y 17pm · Cada día',
  },
}

export default function NewsletterButton() {
  const { lang } = useLanguage()
  const t = UI[lang]

  // No localStorage — reappears on every page load
  const [visible, setVisible] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg(t.errorGeneric)
    }
  }

  if (!visible) return null

  return (
    <>
      {/* Mobile: fixed full-width bar at bottom */}
      {/* Desktop: floating card at bottom-right */}

      {/* Expanded panel */}
      {isOpen && (
        <div className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-auto sm:right-6 sm:w-80 z-50 bg-[#13131f] border-t border-white/[0.10] sm:border sm:rounded-2xl shadow-2xl animate-fade-in">
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
            <div className="flex items-center gap-2">
              <span className="text-accent text-base">⚡</span>
              <span className="text-white font-semibold text-sm">{t.title}</span>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="text-slate-500 hover:text-slate-300 transition-colors p-0.5"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Panel body */}
          <div className="px-5 py-4">
            {status === 'success' ? (
              <div className="text-center py-3">
                <div className="text-2xl mb-2">✓</div>
                <p className="text-white font-semibold text-sm mb-1">{t.successTitle}</p>
                <p className="text-slate-400 text-xs">{t.successDesc}</p>
              </div>
            ) : (
              <>
                <p className="text-slate-400 text-xs leading-relaxed mb-4">{t.desc}</p>
                <form onSubmit={submit} className="space-y-2.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full bg-surface border border-white/[0.10] rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent/50 transition-colors"
                  />
                  {status === 'error' && (
                    <p className="text-red-400 text-xs">{errorMsg}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-accent hover:bg-accent/90 disabled:opacity-60 text-white font-semibold text-sm py-2 rounded-xl transition-colors duration-150"
                  >
                    {status === 'loading' ? t.loading : t.cta}
                  </button>
                </form>
              </>
            )}
          </div>

          {status !== 'success' && (
            <div className="px-5 pb-4 flex items-center gap-1.5 text-slate-600 text-xs">
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {t.schedule}
            </div>
          )}
        </div>
      )}

      {/* Collapsed — FAB on desktop, full-width bar on mobile */}
      {!isOpen && (
        <div className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-auto sm:right-6 sm:w-auto z-50">
          {/* Mobile bar */}
          <div className="flex sm:hidden items-center justify-between bg-accent px-5 py-4 shadow-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-white font-semibold text-sm">{t.fab}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen(true)}
                className="text-white/90 text-xs font-medium bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors"
              >
                {t.cta}
              </button>
              <button onClick={() => setVisible(false)} className="text-white/60 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop FAB */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setVisible(false)}
              className="text-slate-600 hover:text-slate-400 transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg transition-all duration-200 hover:shadow-accent/25 hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {t.fab}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
