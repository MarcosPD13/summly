'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { NewsItem } from '@/lib/types'
import QuoteCard from './QuoteCard'
import AuthModal from './AuthModal'
import { useAuth } from '@/context/AuthContext'

const FREE_LIMIT = 5   // show modal when trying to go past this index

interface Props {
  items: NewsItem[]
  page: number
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
  timeUntilRefresh: string
  fetchedAt: Date | null
}

export default function SwipeableNewsFeed({
  items, page, hasMore, loadingMore, onLoadMore, timeUntilRefresh, fetchedAt,
}: Props) {
  const { user } = useAuth()
  const [current, setCurrent] = useState(0)
  const [leaving, setLeaving] = useState<'left' | 'right' | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const dragStartX = useRef<number | null>(null)
  const isDragging = useRef(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Visible items: guests see max 10, logged-in see all 30
  const visibleItems = user ? items : items.slice(0, 10)

  const goTo = useCallback((dir: 'next' | 'prev') => {
    if (dir === 'next') {
      const nextIndex = current + 1

      // Auth gate: if guest tries to go past FREE_LIMIT
      if (!user && nextIndex >= FREE_LIMIT) {
        setShowAuthModal(true)
        return
      }

      if (current >= visibleItems.length - 1) {
        if (hasMore && user) onLoadMore()
        return
      }

      setLeaving('left')
      setTimeout(() => {
        setCurrent(i => i + 1)
        setLeaving(null)
        setDragOffset(0)
      }, 260)
    } else {
      if (current === 0) return
      setLeaving('right')
      setTimeout(() => {
        setCurrent(i => i - 1)
        setLeaving(null)
        setDragOffset(0)
      }, 260)
    }
  }, [current, visibleItems.length, hasMore, onLoadMore, user])

  // Keyboard navigation
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
    : leaving === 'right'
    ? 'translateX(110%) rotate(5deg)'
    : undefined

  const cardTransform = leaving
    ? leavingTransform
    : `translateX(${dragOffset}px) rotate(${dragOffset * 0.015}deg)`

  const cardTransition = leaving ? 'transform 0.26s ease-in, opacity 0.26s ease-in' : 'none'

  return (
    <>
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}

      <div className="flex flex-col gap-4">
        {/* Status bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
          <span>
            {visibleItems.length === 0 ? 'Sin noticias' : `${current + 1} / ${visibleItems.length}`}
            {!user && items.length > 10 && (
              <span className="ml-1.5 text-accent/70">
                · <button onClick={() => setShowAuthModal(true)} className="hover:text-accent underline underline-offset-2">
                  Iniciá sesión para ver {items.length} noticias
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

        {/* Card stack */}
        <div className="relative select-none" style={{ minHeight: '480px' }}>
          {/* Next card (behind) */}
          {nextItem && !isNearLimit && (
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ transform: 'scale(0.96) translateY(10px)', zIndex: 0, opacity: 0.5 }}
            >
              <QuoteCard item={nextItem} index={1} />
            </div>
          )}

          {/* Paywall peek card (blurred) when near limit */}
          {isNearLimit && nextItem && (
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
              style={{ transform: 'scale(0.96) translateY(10px)', zIndex: 0 }}
            >
              <div className="relative">
                <div style={{ filter: 'blur(6px)', opacity: 0.4 }}>
                  <QuoteCard item={nextItem} index={1} />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <svg className="w-8 h-8 text-accent/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Current card */}
          {item ? (
            <div
              ref={cardRef}
              className="relative cursor-grab active:cursor-grabbing"
              style={{
                transform: cardTransform,
                transition: cardTransition,
                zIndex: 1,
                touchAction: 'pan-y',
                userSelect: 'none',
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <QuoteCard item={item} index={0} />
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-48 text-slate-500 text-sm">
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

          {/* Progress bar */}
          <div className="flex-1 mx-4 h-1 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: visibleItems.length > 1 ? `${((current + 1) / visibleItems.length) * 100}%` : '100%' }}
            />
          </div>

          <button
            onClick={() => goTo('next')}
            disabled={current >= visibleItems.length - 1 && !hasMore}
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
