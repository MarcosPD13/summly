'use client'

import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import NewsFeed from '@/components/NewsFeed'
import AuthModal from '@/components/AuthModal'

export default function Home() {
  const { theme, toggle } = useTheme()
  const { user, signOut } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <main className="min-h-screen bg-bg">
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />
      )}

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
            <span className="font-bold text-white text-sm tracking-wide">Summly</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse-dot" />
              Live
            </div>

            {/* Auth button */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-xs text-slate-500 max-w-[120px] truncate">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/20 transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="text-xs font-medium text-white bg-accent/20 hover:bg-accent/30 border border-accent/30 px-3 py-1.5 rounded-lg transition-colors"
              >
                Iniciar sesión
              </button>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/[0.15] hover:border-white/30 transition-colors"
            >
              {theme === 'dark' ? (
                <span className="w-4 h-4 rounded-full bg-white block" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-black block" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Feed */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">
        <NewsFeed />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between text-xs text-slate-600">
          <span>Summly © {new Date().getFullYear()}</span>
          <span>Updates every 30 min · 5h expiry</span>
        </div>
      </footer>
    </main>
  )
}
