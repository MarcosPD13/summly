'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { NewsItem, Category } from '@/lib/types'
import { useLanguage } from '@/context/LanguageContext'
import SwipeableNewsFeed from './SwipeableNewsFeed'

const REFRESH_INTERVAL = 30 * 60 * 1000

function getSeenKey(category: Category) {
  return `summly_seen_${category}`
}

function loadSeenIds(category: Category): Set<string> {
  try {
    const raw = localStorage.getItem(getSeenKey(category))
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveSeenIds(category: Category, ids: Set<string>) {
  try {
    localStorage.setItem(getSeenKey(category), JSON.stringify([...ids]))
  } catch {}
}

interface Props {
  category: Category
}

export default function NewsFeed({ category }: Props) {
  const { lang } = useLanguage()
  const [items, setItems] = useState<NewsItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null)
  const [nextRefreshAt, setNextRefreshAt] = useState<Date | null>(null)
  const [timeUntilRefresh, setTimeUntilRefresh] = useState('')
  const seenIds = useRef<Set<string>>(new Set())

  // Load seen IDs from localStorage on mount / category change
  useEffect(() => {
    seenIds.current = loadSeenIds(category)
  }, [category])

  const handleSeen = useCallback((id: string) => {
    seenIds.current.add(id)
    saveSeenIds(category, seenIds.current)
  }, [category])

  const fetchPage = useCallback(async (p: number, append: boolean) => {
    if (p === 1) setLoading(true)
    else setLoadingMore(true)
    setError(false)
    try {
      const res = await fetch(`/api/news?lang=${lang}&page=${p}&category=${category}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      // Filter out already-seen articles (skip filter on explicit load-more)
      const incoming: NewsItem[] = data.items
      const unseen = append
        ? incoming
        : incoming.filter((item: NewsItem) => !seenIds.current.has(item.id))
      setItems(prev => append ? [...prev, ...unseen] : unseen)
      setPage(data.page)
      setHasMore(data.hasMore)
      setFetchedAt(new Date(data.fetchedAt))
      setNextRefreshAt(new Date(data.nextRefreshAt))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [lang, category])

  useEffect(() => {
    setItems([])
    setPage(1)
    fetchPage(1, false)
  }, [lang, category]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const interval = setInterval(() => fetchPage(1, false), REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchPage])

  useEffect(() => {
    if (!nextRefreshAt) return
    const tick = () => {
      const ms = Math.max(0, nextRefreshAt.getTime() - Date.now())
      const m = Math.floor(ms / 60000)
      const s = Math.floor((ms % 60000) / 1000)
      setTimeUntilRefresh(`${m}m ${s.toString().padStart(2, '0')}s`)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [nextRefreshAt])

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => prev.filter(item => new Date(item.expiresAt).getTime() > Date.now()))
    }, 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) fetchPage(page + 1, true)
  }, [fetchPage, page, hasMore, loadingMore])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border border-white/[0.07] rounded-2xl overflow-hidden animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="h-40 bg-white/5" />
            <div className="p-5 space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-24 bg-white/10 rounded-full" />
                <div className="h-5 w-16 bg-white/5 rounded-full" />
              </div>
              <div className="h-5 w-3/4 bg-white/10 rounded" />
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-5/6 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400 mb-4">Error cargando noticias.</p>
        <button
          onClick={() => fetchPage(1, false)}
          className="px-4 py-2 bg-accent/20 text-accent border border-accent/30 rounded-xl text-sm hover:bg-accent/30 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <SwipeableNewsFeed
      items={items}
      page={page}
      hasMore={hasMore}
      loadingMore={loadingMore}
      onLoadMore={handleLoadMore}
      onSeen={handleSeen}
      timeUntilRefresh={timeUntilRefresh}
      fetchedAt={fetchedAt}
      nextRefreshAt={nextRefreshAt}
    />
  )
}
