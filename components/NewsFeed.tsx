'use client'

import { useState, useEffect, useCallback } from 'react'
import { NewsItem } from '@/lib/types'
import { useLanguage } from '@/context/LanguageContext'
import QuoteCard from './QuoteCard'

const REFRESH_INTERVAL = 30 * 60 * 1000 // 30 minutes

export default function NewsFeed() {
  const { lang } = useLanguage()
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null)
  const [nextRefreshAt, setNextRefreshAt] = useState<Date | null>(null)
  const [timeUntilRefresh, setTimeUntilRefresh] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`/api/news?lang=${lang}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setItems(data.items)
      setFetchedAt(new Date(data.fetchedAt))
      setNextRefreshAt(new Date(data.nextRefreshAt))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [lang])

  // Fetch on mount and language change
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-refresh every 30 min
  useEffect(() => {
    const interval = setInterval(fetchData, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchData])

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
      setItems((prev) => prev.filter((item) => new Date(item.expiresAt).getTime() > Date.now()))
    }, 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
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
          onClick={fetchData}
          className="px-4 py-2 bg-accent/20 text-accent border border-accent/30 rounded-xl text-sm hover:bg-accent/30 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 text-sm">No stories from the last 24 hours.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Status bar */}
      <div className="flex items-center justify-between mb-6 text-xs text-slate-500 flex-wrap gap-2">
        <span>
          {items.length} {items.length === 1 ? 'story' : 'stories'} ·{' '}
          {fetchedAt && `Updated ${new Date(fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Next refresh in {timeUntilRefresh}
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <QuoteCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  )
}
