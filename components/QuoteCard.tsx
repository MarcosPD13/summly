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

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

function isNew(isoDate: string): boolean {
  return Date.now() - new Date(isoDate).getTime() < 60 * 60 * 1000
}

const SOURCE_COLORS: Record<string, string> = {
  'TechCrunch':      'bg-green-500/15 text-green-400 border-green-500/25',
  'The Verge':       'bg-purple-500/15 text-purple-400 border-purple-500/25',
  'Wired':           'bg-red-500/15 text-red-400 border-red-500/25',
  'Ars Technica':    'bg-orange-500/15 text-orange-400 border-orange-500/25',
  'VentureBeat':     'bg-blue-500/15 text-blue-400 border-blue-500/25',
  'MIT Tech Review': 'bg-sky-500/15 text-sky-400 border-sky-500/25',
  'Hacker News':     'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  'Engadget':        'bg-rose-500/15 text-rose-400 border-rose-500/25',
  'ZDNet':           'bg-blue-600/15 text-blue-300 border-blue-600/25',
  'TechRadar':       'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  '9to5Mac':         'bg-gray-500/15 text-gray-300 border-gray-500/25',
  '9to5Google':      'bg-blue-400/15 text-blue-300 border-blue-400/25',
  'Mashable Tech':   'bg-red-400/15 text-red-300 border-red-400/25',
  'The Register':    'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'ReadWrite':       'bg-violet-500/15 text-violet-400 border-violet-500/25',
  'Digital Trends':  'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  'Gizmodo':         'bg-lime-500/15 text-lime-400 border-lime-500/25',
  "Tom's Hardware":  'bg-orange-600/15 text-orange-300 border-orange-600/25',
  'Dev.to':          'bg-slate-500/15 text-slate-300 border-slate-500/25',
  'InfoQ':           'bg-purple-600/15 text-purple-300 border-purple-600/25',
  'Xataka':          'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
  'Genbeta':         'bg-pink-500/15 text-pink-400 border-pink-500/25',
  'Hipertextual':    'bg-teal-500/15 text-teal-400 border-teal-500/25',
  'FayerWayer':      'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  'MuyComputer':     'bg-blue-500/15 text-blue-400 border-blue-500/25',
  'ADSLZone':        'bg-green-600/15 text-green-300 border-green-600/25',
  'TICbeat':         'bg-red-600/15 text-red-300 border-red-600/25',
  'WWWhatsnew':      'bg-yellow-600/15 text-yellow-300 border-yellow-600/25',
  'El País Tech':    'bg-slate-600/15 text-slate-300 border-slate-600/25',
  'Xataka Móvil':    'bg-indigo-600/15 text-indigo-300 border-indigo-600/25',
  'Xataka Android':  'bg-green-500/15 text-green-400 border-green-500/25',
  'Applesfera':      'bg-gray-400/15 text-gray-300 border-gray-400/25',
}

export default function QuoteCard({ item, index }: QuoteCardProps) {
  const sourceColor = SOURCE_COLORS[item.source] || 'bg-slate-500/15 text-slate-400 border-slate-500/25'
  const fresh = isNew(item.publishedAt)

  return (
    <article
      className="group relative bg-card border border-white/[0.07] rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-200 animate-fade-in"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'both' }}
    >
      {/* Hero image */}
      {item.imageUrl && (
        <div className="relative w-full h-44 overflow-hidden bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${sourceColor}`}>
              {item.source}
            </span>
            {fresh && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 animate-pulse">
                NEW
              </span>
            )}
            <span className="text-xs text-slate-500">{timeAgo(item.publishedAt)}</span>
          </div>
          <CountdownTimer expiresAt={item.expiresAt} />
        </div>

        {/* Title */}
        <h2 className="text-white font-semibold text-base leading-snug mb-3 group-hover:text-accent transition-colors duration-150">
          {item.title}
        </h2>

        {/* AI Summary */}
        {item.aiSummary && item.aiSummary.length > 0 ? (
          <ul className="text-slate-400 text-sm leading-relaxed mb-4 space-y-1.5">
            {item.aiSummary.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent/60 shrink-0 mt-0.5">·</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : item.summary ? (
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            {item.summary}
          </p>
        ) : null}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <a
            href={item.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs text-accent/70 hover:text-accent transition-colors duration-150"
          >
            Leer artículo completo
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <span className="text-xs text-slate-600">{item.language.toUpperCase()}</span>
        </div>
      </div>
    </article>
  )
}
