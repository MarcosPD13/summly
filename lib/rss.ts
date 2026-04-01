import Parser from 'rss-parser'
import { NewsItem, Language } from './types'

const parser = new Parser({
  timeout: 8000,
  headers: {
    'User-Agent': 'Summly/1.0 (RSS Reader)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
  customFields: {
    item: [['content:encoded', 'contentEncoded'], ['description', 'description']],
  },
})

interface FeedSource {
  name: string
  url: string
  siteUrl: string
  language: Language
}

const FEEDS: FeedSource[] = [
  // English
  { name: 'TechCrunch',      url: 'https://techcrunch.com/feed/',                         siteUrl: 'https://techcrunch.com',              language: 'en' },
  { name: 'The Verge',       url: 'https://www.theverge.com/rss/index.xml',               siteUrl: 'https://www.theverge.com',            language: 'en' },
  { name: 'Wired',           url: 'https://www.wired.com/feed/rss',                       siteUrl: 'https://www.wired.com',               language: 'en' },
  { name: 'Ars Technica',    url: 'https://feeds.arstechnica.com/arstechnica/index',      siteUrl: 'https://arstechnica.com',             language: 'en' },
  { name: 'VentureBeat',     url: 'https://venturebeat.com/feed/',                        siteUrl: 'https://venturebeat.com',             language: 'en' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/',               siteUrl: 'https://www.technologyreview.com',    language: 'en' },
  { name: 'Hacker News',     url: 'https://hnrss.org/frontpage',                          siteUrl: 'https://news.ycombinator.com',        language: 'en' },
  // Spanish
  { name: 'Xataka',          url: 'https://feeds.weblogssl.com/xataka2',                  siteUrl: 'https://www.xataka.com',              language: 'es' },
  { name: 'Genbeta',         url: 'https://feeds.weblogssl.com/genbeta',                  siteUrl: 'https://www.genbeta.com',             language: 'es' },
  { name: 'Hipertextual',    url: 'https://hipertextual.com/feed',                        siteUrl: 'https://hipertextual.com',            language: 'es' },
  { name: 'FayerWayer',      url: 'https://www.fayerwayer.com/feed/',                     siteUrl: 'https://www.fayerwayer.com',          language: 'es' },
]

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanSummary(raw: string | undefined, maxLength = 200): string {
  if (!raw) return ''
  const clean = stripHtml(raw)
  if (clean.length <= maxLength) return clean
  const trimmed = clean.slice(0, maxLength)
  const lastSpace = trimmed.lastIndexOf(' ')
  return (lastSpace > 100 ? trimmed.slice(0, lastSpace) : trimmed) + '…'
}

function generateId(url: string, pubDate: string): string {
  return Buffer.from(`${url}|${pubDate}`).toString('base64').slice(0, 16)
}

async function fetchFeed(source: FeedSource): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(source.url)
    const now = Date.now()
    const fiveHoursMs = 5 * 60 * 60 * 1000

    return feed.items
      .filter((item) => {
        if (!item.pubDate && !item.isoDate) return false
        const pubTime = new Date(item.isoDate || item.pubDate || '').getTime()
        return !isNaN(pubTime) && now - pubTime < fiveHoursMs
      })
      .map((item) => {
        const publishedAt = new Date(item.isoDate || item.pubDate || '').toISOString()
        const expiresAt = new Date(new Date(publishedAt).getTime() + fiveHoursMs).toISOString()
        const rawSummary = item.contentSnippet || item.description || item.contentEncoded || ''

        return {
          id: generateId(item.link || item.guid || '', publishedAt),
          title: stripHtml(item.title || 'Untitled'),
          summary: cleanSummary(rawSummary),
          aiSummary: [],
          source: source.name,
          sourceUrl: source.siteUrl,
          articleUrl: item.link || item.guid || source.siteUrl,
          publishedAt,
          expiresAt,
          language: source.language,
        }
      })
  } catch {
    // Silently skip failed feeds
    return []
  }
}

export async function fetchNews(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed))

  const allItems: NewsItem[] = []
  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value)
    }
  }

  // Deduplicate by id
  const seen = new Set<string>()
  const unique = allItems.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })

  // Sort newest first (oldest at bottom)
  return unique.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}
