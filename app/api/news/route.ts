import { NextRequest, NextResponse } from 'next/server'
import { fetchNews } from '@/lib/rss'
import { enrichArticles } from '@/lib/summarize'
import { Language, Category, NewsResponse } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const PAGE_SIZE = 30
const VALID_CATEGORIES: Category[] = ['tech', 'innovation', 'business', 'economy']

export async function GET(req: NextRequest) {
  const lang = (req.nextUrl.searchParams.get('lang') ?? 'es') as Language
  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get('page') ?? '1', 10))
  const categoryParam = req.nextUrl.searchParams.get('category') as Category | null

  if (lang !== 'en' && lang !== 'es' && lang !== 'fr') {
    return NextResponse.json({ error: 'Invalid language' }, { status: 400 })
  }

  const category = categoryParam && VALID_CATEGORIES.includes(categoryParam) ? categoryParam : undefined

  const allItems = await fetchNews(category)
  const total = allItems.length
  const start = (page - 1) * PAGE_SIZE
  const pageItems = allItems.slice(start, start + PAGE_SIZE)

  const items = await enrichArticles(pageItems, lang)

  const now = new Date()
  const nextRefreshAt = new Date(now)
  const mins = now.getMinutes()
  if (mins < 30) {
    nextRefreshAt.setMinutes(30, 0, 0)
  } else {
    nextRefreshAt.setHours(nextRefreshAt.getHours() + 1, 0, 0, 0)
  }

  const response: NewsResponse & { page: number; total: number; hasMore: boolean } = {
    items,
    fetchedAt: now.toISOString(),
    nextRefreshAt: nextRefreshAt.toISOString(),
    page,
    total,
    hasMore: start + PAGE_SIZE < total,
  }

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
