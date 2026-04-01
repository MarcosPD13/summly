import { NextRequest, NextResponse } from 'next/server'
import { fetchNews } from '@/lib/rss'
import { enrichArticles } from '@/lib/summarize'
import { Language, NewsResponse } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  const lang = (req.nextUrl.searchParams.get('lang') ?? 'en') as Language

  if (lang !== 'en' && lang !== 'es') {
    return NextResponse.json({ error: 'Invalid language' }, { status: 400 })
  }

  const allItems = await fetchNews()

  // Sort newest first, take top 20
  const top20 = allItems
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 20)

  // Enrich with AI translations + summaries in the target language
  const items = await enrichArticles(top20, lang)

  const now = new Date()
  const nextRefreshAt = new Date(now.getTime() + 30 * 60 * 1000)

  const response: NewsResponse = {
    items,
    fetchedAt: now.toISOString(),
    nextRefreshAt: nextRefreshAt.toISOString(),
  }

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
