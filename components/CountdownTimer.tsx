'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  expiresAt: string
}

function formatTimeLeft(ms: number): { text: string; urgency: 'low' | 'medium' | 'high' } {
  if (ms <= 0) return { text: 'Expired', urgency: 'high' }

  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  let text: string
  if (hours > 0) {
    text = `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    text = `${minutes}m ${seconds}s`
  } else {
    text = `${seconds}s`
  }

  let urgency: 'low' | 'medium' | 'high'
  if (ms > 6 * 3600 * 1000) urgency = 'low'
  else if (ms > 2 * 3600 * 1000) urgency = 'medium'
  else urgency = 'high'

  return { text, urgency }
}

export default function CountdownTimer({ expiresAt }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, new Date(expiresAt).getTime() - Date.now())
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, new Date(expiresAt).getTime() - Date.now()))
    }, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const { text, urgency } = formatTimeLeft(timeLeft)

  const colorMap = {
    low: 'text-green-400 border-green-500/30 bg-green-500/10',
    medium: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    high: 'text-red-400 border-red-500/30 bg-red-500/10',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full border ${colorMap[urgency]}`}
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      {text}
    </span>
  )
}
