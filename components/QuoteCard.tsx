'use client'

import { NewsItem } from '@/lib/types'
import CountdownTimer from './CountdownTimer'

interface QuoteCardProps {
  item: NewsItem
  index: number
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function isNew(isoDate: string): boolean {
  return Date.now() - new Date(isoDate).getTime() < 60 * 60 * 1000 // < 1h
}

const SOURCE_COLORS: Record<string, string> = {
  'TechCrunch':      'bg-green-500/15 text-green-400 border-green-500/25',
  'The Verge':       'bg-purple-500/15 text-purple-400 border-purple-500/25',
  'Wired':           'bg-red-500/15 text-red-400 border-red-500/25',
  'Ars Technica':    'bg-orange-500/15 text-orange-400 border-orange-500/25',
  'VentureBeat':     'bg-blue-500/15 text-blue-400 border-blue-500/25',
  'MIT Tech Review': 'bg-sky-500/15 text-sky-400 border-sky-500/25',
  'Hacker News':     'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  'Xataka':          'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
  'Genbeta':         'bg-pink-500/15 text-pink-400 border-pink-500/25',
  'Hipertextual':    'bg-teal-500/15 text-teal-400 border-teal-500/25',
  'FayerWayer':      'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
}

export default function QuoteCard({ item, index }: QuoteCardProps) {
  const sourceColor = SOURCE_COLORS[item.source] || 'bg-slate-500/15 text-slate-400 border-slate-500/25'
  const fresh = isNew(item.publishedAt)

  return (
    <article
      className="group relative bg-card border border-white/[0.07] rounded-2xl p-5 hover:border-accent/30 hover:bg-[#1E1E2E] transition-all duration-200 animate-fade-in"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'both' }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Source badge */}
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${sourceColor}`}>
            {item.source}
          </span>

          {/* NEW badge */}
          {fresh && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 animate-pulse">
              NEW
            </span>
          )}

          {/* Time ago */}
          <span className="text-xs text-slate-500">{timeAgo(item.publishedAt)}</span>
        </div>

        {/* Countdown */}
        <CountdownTimer expiresAt={item.expiresAt} />
      </div>

      {/* Title */}
      <h2 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-accent transition-colors duration-150">
        {item.title}
      </h2>

      {/* AI Summary */}
      {item.aiSummary && item.aiSummary.length > 0 ? (
        <ul className="text-slate-400 text-sm leading-relaxed mb-3 space-y-0.5">
          {item.aiSummary.map((line, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-accent/50 shrink-0 mt-0.5">·</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : item.summary ? (
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">
          {item.summary}
        </p>
      ) : null}

      {/* Footer */}
      <a
        href={item.articleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-accent/70 hover:text-accent transition-colors duration-150"
      >
        Read full article
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </a>
    </article>
  )
}
