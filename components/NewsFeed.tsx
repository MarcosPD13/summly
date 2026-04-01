'use client'

import { useState, useEffect, useCallback } from 'react'
import { NewsItem } from '@/lib/types'
import { useLanguage } from '@/context/LanguageContext'
import SwipeableNewsFeed from './SwipeableNewsFeed'

const REFRESH_INTERVAL = 30 * 60 * 1000 // 30 minutes

export default function NewsFeed() {
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

  const fetchPage = useCallback(async (p: number, append: boolean) => {
    if (p === 1) setLoading(true)
    else setLoadingMore(true)
    setError(false)
    try {
      const res = await fetch(`/api/news?lang=${lang}&page=${p}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setItems(prev => append ? [...prev, ...data.items] : data.items)
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
  }, [lang])

  // Fetch page 1 on mount and language change
  useEffect(() => {
    setItems([])
    setPage(1)
    fetchPage(1, false)
  }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh every 30 min (resets to page 1)
  useEffect(() => {
    const interval = setInterval(() => fetchPage(1, false), REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchPage])

  // Countdown to next refresh
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

  // Filter expired items every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => prev.filter(item => new Date(item.expiresAt).getTime() > Date.now()))
    }, 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchPage(page + 1, true)
    }
  }, [fetchPage, page, hasMore, loadingMore])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border border-white/[0.07] rounded-2xl p-5 animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex gap-2 mb-3">
              <div className="h-5 w-24 bg-white/10 rounded-full" />
              <div className="h-5 w-16 bg-white/5 rounded-full" />
            </div>
            <div className="h-5 w-3/4 bg-white/10 rounded mb-2" />
            <div className="h-4 w-full bg-white/5 rounded mb-1" />
            <div className="h-4 w-5/6 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400 mb-4">Failed to load news. Check your connection.</p>
        <button
          onClick={() => fetchPage(1, false)}
          className="px-4 py-2 bg-accent/20 text-accent border border-accent/30 rounded-xl text-sm hover:bg-accent/30 transition-colors"
        >
          Retry
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
      timeUntilRefresh={timeUntilRefresh}
      fetchedAt={fetchedAt}
    />
  )
}
