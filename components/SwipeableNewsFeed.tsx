'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { NewsItem } from '@/lib/types'
import QuoteCard from './QuoteCard'
import AuthModal from './AuthModal'
import { useAuth } from '@/context/AuthContext'

const FREE_LIMIT = 5

interface Props {
  items: NewsItem[]
  page: number
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
  onSeen: (id: string) => void
  timeUntilRefresh: string
  fetchedAt: Date | null
  nextRefreshAt: Date | null
}

function EndCard({ nextRefreshAt }: { nextRefreshAt: Date | null }) {
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    if (!nextRefreshAt) return
    const tick = () => {
      const ms = Math.max(0, nextRefreshAt.getTime() - Date.now())
      const m = Math.floor(ms / 60000)
      const s = Math.floor((ms % 60000) / 1000)
      setCountdown(`${m}m ${s.toString().padStart(2, '0')}s`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextRefreshAt])

  return (
    <div className="flex flex-col items-center justify-center min-h-[480px] bg-card border border-white/[0.07] rounded-2xl p-8 text-center">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
          <svg className="w-12 h-12 text-accent/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-live/20 border border-live/30 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-live animate-pulse block" />
        </div>
      </div>

      <h3 className="text-white font-bold text-lg mb-2">¡Ya las viste todas!</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-xs">
        Nuevas noticias en camino. Volvé en unos minutos.
      </p>

      {/* Countdown */}
      {countdown && (
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-xs text-slate-600 uppercase tracking-widest">Próximo refresh</p>
          <div className="text-2xl font-bold text-accent tabular-nums">{countdown}</div>
        </div>
      )}
    </div>
  )
}

export default function SwipeableNewsFeed({
  items, hasMore, loadingMore, onLoadMore, onSeen, timeUntilRefresh, fetchedAt, nextRefreshAt,
}: Props) {
  const { user } = useAuth()
  const [current, setCurrent] = useState(0)
  const [leaving, setLeaving] = useState<'left' | 'right' | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const dragStartX = useRef<number | null>(null)
  const isDragging = useRef(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const visibleItems = user ? items : items.slice(0, 10)
  const atEnd = current >= visibleItems.length

  const goTo = useCallback((dir: 'next' | 'prev') => {
    if (dir === 'next') {
      if (!user && current + 1 >= FREE_LIMIT) {
        setShowAuthModal(true)
        return
      }
      // Mark current card as seen before advancing
      const currentItem = visibleItems[current]
      if (currentItem) onSeen(currentItem.id)

      if (current >= visibleItems.length - 1) {
        if (hasMore) { onLoadMore(); return }
        // show end card
        setLeaving('left')
        setTimeout(() => { setCurrent(i => i + 1); setLeaving(null); setDragOffset(0) }, 260)
        return
      }
      setLeaving('left')
      setTimeout(() => { setCurrent(i => i + 1); setLeaving(null); setDragOffset(0) }, 260)
    } else {
      if (current === 0) return
      setLeaving('right')
      setTimeout(() => { setCurrent(i => i - 1); setLeaving(null); setDragOffset(0) }, 260)
    }
  }, [current, visibleItems, hasMore, onLoadMore, onSeen, user])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo('next')
      if (e.key === 'ArrowLeft') goTo('prev')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goTo])

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX
    isDragging.current = true
    cardRef.current?.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || dragStartX.current === null) return
    setDragOffset(e.clientX - dragStartX.current)
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || dragStartX.current === null) return
    const dx = e.clientX - dragStartX.current
    isDragging.current = false
    dragStartX.current = null
    if (Math.abs(dx) > 72) goTo(dx < 0 ? 'next' : 'prev')
    else setDragOffset(0)
  }

  const item = visibleItems[current]
  const nextItem = visibleItems[current + 1]
  const isNearLimit = !user && current === FREE_LIMIT - 1

  const leavingTransform = leaving === 'left'
    ? 'translateX(-110%) rotate(-5deg)'
    : 'translateX(110%) rotate(5deg)'

  const cardTransform = leaving
    ? leavingTransform
    : `translateX(${dragOffset}px) rotate(${dragOffset * 0.015}deg)`

  const cardTransition = leaving ? 'transform 0.26s ease-in, opacity 0.26s ease-in' : 'none'

  return (
    <>
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={() => setShowAuthModal(false)} />
      )}

      <div className="flex flex-col gap-4">
        {/* Status bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
          <span>
            {visibleItems.length === 0 ? 'Sin noticias' : atEnd ? `${visibleItems.length} / ${visibleItems.length}` : `${current + 1} / ${visibleItems.length}`}
            {!user && items.length > 10 && (
              <span className="ml-1.5 text-accent/70">
                · <button onClick={() => setShowAuthModal(true)} className="hover:text-accent underline underline-offset-2">
                  Ver {items.length} noticias
                </button>
              </span>
            )}
            {fetchedAt && ` · ${fetchedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {timeUntilRefresh}
          </span>
        </div>

        {/* Card stack — overflow hidden to prevent mobile horizontal scroll */}
        <div className="relative select-none overflow-hidden rounded-2xl" style={{ minHeight: '480px' }}>

          {/* End card */}
          {atEnd && <EndCard nextRefreshAt={nextRefreshAt} />}

          {/* Next card behind (or blurred paywall peek) */}
          {!atEnd && nextItem && !isNearLimit && (
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ transform: 'scale(0.96) translateY(10px)', zIndex: 0, opacity: 0.5 }}
            >
              <QuoteCard item={nextItem} index={1} />
            </div>
          )}

          {!atEnd && isNearLimit && nextItem && (
            <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
              style={{ transform: 'scale(0.96) translateY(10px)', zIndex: 0 }}>
              <div style={{ filter: 'blur(6px)', opacity: 0.35 }}>
                <QuoteCard item={nextItem} index={1} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
            </div>
          )}

          {/* Current card */}
          {!atEnd && item && (
            <div
              ref={cardRef}
              className="relative cursor-grab active:cursor-grabbing"
              style={{ transform: cardTransform, transition: cardTransition, zIndex: 1, touchAction: 'pan-y', userSelect: 'none' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <QuoteCard item={item} index={0} />
            </div>
          )}

          {!atEnd && !item && (
            <div className="flex items-center justify-center min-h-[480px] text-slate-500 text-sm">
              No hay noticias en las últimas 5 horas.
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => goTo('prev')}
            disabled={current === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-xs text-slate-400 hover:text-white disabled:opacity-25 transition-colors rounded-xl hover:bg-surface"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>

          <div className="flex-1 mx-4 h-1 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: visibleItems.length > 0 ? `${Math.min(((current + 1) / visibleItems.length) * 100, 100)}%` : '0%' }}
            />
          </div>

          <button
            onClick={() => goTo('next')}
            disabled={atEnd && !hasMore}
            className="flex items-center gap-1.5 px-4 py-2 text-xs text-slate-400 hover:text-white disabled:opacity-25 transition-colors rounded-xl hover:bg-surface"
          >
            {isNearLimit
              ? 'Iniciar sesión'
              : current >= visibleItems.length - 1 && hasMore
              ? (loadingMore ? 'Cargando…' : 'Más noticias')
              : 'Siguiente'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
