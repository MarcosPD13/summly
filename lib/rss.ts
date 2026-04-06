import Parser from 'rss-parser'
import { NewsItem, Language, Category } from './types'

const parser = new Parser({
  timeout: 8000,
  headers: {
    'User-Agent': 'Summly/1.0 (RSS Reader)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure'],
    ],
  },
})

interface FeedSource {
  name: string
  url: string
  siteUrl: string
  language: Language
  category: Category
}

const FEEDS: FeedSource[] = [
  // ── TECH ──────────────────────────────────────────────────────────────────
  { name: 'The Verge',          url: 'https://www.theverge.com/rss/index.xml',                       siteUrl: 'https://www.theverge.com',              language: 'en', category: 'tech' },
  { name: 'Ars Technica',       url: 'https://feeds.arstechnica.com/arstechnica/index',              siteUrl: 'https://arstechnica.com',               language: 'en', category: 'tech' },
  { name: 'Engadget',           url: 'https://www.engadget.com/rss.xml',                             siteUrl: 'https://www.engadget.com',              language: 'en', category: 'tech' },
  { name: 'TechRadar',          url: 'https://www.techradar.com/rss',                                siteUrl: 'https://www.techradar.com',             language: 'en', category: 'tech' },
  { name: 'CNET',               url: 'https://www.cnet.com/rss/news/',                               siteUrl: 'https://www.cnet.com',                  language: 'en', category: 'tech' },
  { name: '9to5Mac',            url: 'https://9to5mac.com/feed/',                                    siteUrl: 'https://9to5mac.com',                   language: 'en', category: 'tech' },
  { name: '9to5Google',         url: 'https://9to5google.com/feed/',                                 siteUrl: 'https://9to5google.com',                language: 'en', category: 'tech' },
  { name: 'Gizmodo',            url: 'https://gizmodo.com/feed/rss',                                 siteUrl: 'https://gizmodo.com',                   language: 'en', category: 'tech' },
  { name: "Tom's Hardware",     url: 'https://www.tomshardware.com/feeds/all',                       siteUrl: 'https://www.tomshardware.com',          language: 'en', category: 'tech' },
  { name: 'Digital Trends',     url: 'https://www.digitaltrends.com/feed/',                          siteUrl: 'https://www.digitaltrends.com',         language: 'en', category: 'tech' },
  { name: 'MacRumors',          url: 'https://feeds.macrumors.com/MacRumors-All',                    siteUrl: 'https://www.macrumors.com',             language: 'en', category: 'tech' },
  { name: 'BGR',                url: 'https://bgr.com/feed/',                                        siteUrl: 'https://bgr.com',                       language: 'en', category: 'tech' },
  { name: 'Android Authority',  url: 'https://www.androidauthority.com/feed/',                       siteUrl: 'https://www.androidauthority.com',      language: 'en', category: 'tech' },
  { name: 'The Next Web',       url: 'https://thenextweb.com/feed/',                                 siteUrl: 'https://thenextweb.com',                language: 'en', category: 'tech' },
  { name: 'AppleInsider',       url: 'https://appleinsider.com/rss/news/',                           siteUrl: 'https://appleinsider.com',              language: 'en', category: 'tech' },
  { name: 'SlashGear',          url: 'https://www.slashgear.com/feed/',                              siteUrl: 'https://www.slashgear.com',             language: 'en', category: 'tech' },
  { name: 'Xataka',             url: 'https://feeds.weblogssl.com/xataka2',                          siteUrl: 'https://www.xataka.com',                language: 'es', category: 'tech' },
  { name: 'Xataka Móvil',       url: 'https://feeds.weblogssl.com/xatakamovil',                      siteUrl: 'https://www.xatakamovil.com',           language: 'es', category: 'tech' },
  { name: 'Xataka Android',     url: 'https://feeds.weblogssl.com/xatakandroid',                     siteUrl: 'https://www.xatakandroid.com',          language: 'es', category: 'tech' },
  { name: 'Applesfera',         url: 'https://feeds.weblogssl.com/applesfera',                       siteUrl: 'https://www.applesfera.com',            language: 'es', category: 'tech' },
  { name: 'MuyComputer',        url: 'https://www.muycomputer.com/feed/',                            siteUrl: 'https://www.muycomputer.com',           language: 'es', category: 'tech' },
  { name: 'ADSLZone',           url: 'https://www.adslzone.net/feed/',                               siteUrl: 'https://www.adslzone.net',              language: 'es', category: 'tech' },
  { name: 'Andro4all',          url: 'https://feeds.weblogssl.com/andro4all',                        siteUrl: 'https://andro4all.com',                 language: 'es', category: 'tech' },
  { name: 'El Androide Libre',  url: 'https://elandroidelibre.elespanol.com/feed',                   siteUrl: 'https://elandroidelibre.elespanol.com', language: 'es', category: 'tech' },
  { name: 'iPhoneros',          url: 'https://iphoneros.com/feed',                                   siteUrl: 'https://iphoneros.com',                 language: 'es', category: 'tech' },

  // ── INNOVATION ────────────────────────────────────────────────────────────
  { name: 'Wired',              url: 'https://www.wired.com/feed/rss',                               siteUrl: 'https://www.wired.com',                 language: 'en', category: 'innovation' },
  { name: 'MIT Tech Review',    url: 'https://www.technologyreview.com/feed/',                       siteUrl: 'https://www.technologyreview.com',      language: 'en', category: 'innovation' },
  { name: 'Hacker News',        url: 'https://hnrss.org/frontpage',                                  siteUrl: 'https://news.ycombinator.com',          language: 'en', category: 'innovation' },
  { name: 'Dev.to',             url: 'https://dev.to/feed',                                          siteUrl: 'https://dev.to',                        language: 'en', category: 'innovation' },
  { name: 'InfoQ',              url: 'https://feed.infoq.com',                                       siteUrl: 'https://www.infoq.com',                 language: 'en', category: 'innovation' },
  { name: 'IEEE Spectrum',      url: 'https://spectrum.ieee.org/feeds/feed.rss',                     siteUrl: 'https://spectrum.ieee.org',             language: 'en', category: 'innovation' },
  { name: 'Singularity Hub',    url: 'https://singularityhub.com/feed/',                             siteUrl: 'https://singularityhub.com',            language: 'en', category: 'innovation' },
  { name: 'Futurism',           url: 'https://futurism.com/feed',                                    siteUrl: 'https://futurism.com',                  language: 'en', category: 'innovation' },
  { name: 'Science Alert',      url: 'https://www.sciencealert.com/feed',                            siteUrl: 'https://www.sciencealert.com',          language: 'en', category: 'innovation' },
  { name: 'Popular Mechanics',  url: 'https://www.popularmechanics.com/rss/all.rss/',                siteUrl: 'https://www.popularmechanics.com',      language: 'en', category: 'innovation' },
  { name: 'Quanta Magazine',    url: 'https://www.quantamagazine.org/feed/',                         siteUrl: 'https://www.quantamagazine.org',        language: 'en', category: 'innovation' },
  { name: 'AI News',            url: 'https://www.artificialintelligence-news.com/feed/',            siteUrl: 'https://www.artificialintelligence-news.com', language: 'en', category: 'innovation' },
  { name: 'VentureBeat AI',     url: 'https://venturebeat.com/category/ai/feed/',                    siteUrl: 'https://venturebeat.com/ai',            language: 'en', category: 'innovation' },
  { name: 'Hipertextual',       url: 'https://hipertextual.com/feed',                                siteUrl: 'https://hipertextual.com',              language: 'es', category: 'innovation' },
  { name: 'WWWhatsnew',         url: 'https://wwwhatsnew.com/feed/',                                 siteUrl: 'https://wwwhatsnew.com',                language: 'es', category: 'innovation' },
  { name: 'Genbeta',            url: 'https://feeds.weblogssl.com/genbeta',                          siteUrl: 'https://www.genbeta.com',               language: 'es', category: 'innovation' },
  { name: 'El País Tech',       url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/tecnologia/portada', siteUrl: 'https://elpais.com/tecnologia', language: 'es', category: 'innovation' },
  { name: 'Xataka Ciencia',     url: 'https://feeds.weblogssl.com/xatakaciencia',                    siteUrl: 'https://www.xatakaciencia.com',         language: 'es', category: 'innovation' },
  { name: 'Muy Interesante',    url: 'https://www.muyinteresante.es/rss',                            siteUrl: 'https://www.muyinteresante.es',         language: 'es', category: 'innovation' },

  // ── BUSINESS ──────────────────────────────────────────────────────────────
  { name: 'TechCrunch',         url: 'https://techcrunch.com/feed/',                                 siteUrl: 'https://techcrunch.com',                language: 'en', category: 'business' },
  { name: 'VentureBeat',        url: 'https://venturebeat.com/feed/',                                siteUrl: 'https://venturebeat.com',               language: 'en', category: 'business' },
  { name: 'ZDNet',              url: 'https://www.zdnet.com/news/rss.xml',                           siteUrl: 'https://www.zdnet.com',                 language: 'en', category: 'business' },
  { name: 'The Register',       url: 'https://www.theregister.com/headlines.atom',                   siteUrl: 'https://www.theregister.com',           language: 'en', category: 'business' },
  { name: 'Fast Company',       url: 'https://www.fastcompany.com/latest/rss',                       siteUrl: 'https://www.fastcompany.com',           language: 'en', category: 'business' },
  { name: 'Mashable Tech',      url: 'https://mashable.com/feeds/rss/tech',                          siteUrl: 'https://mashable.com',                  language: 'en', category: 'business' },
  { name: 'GeekWire',           url: 'https://www.geekwire.com/feed/',                               siteUrl: 'https://www.geekwire.com',              language: 'en', category: 'business' },
  { name: 'Inc.',               url: 'https://www.inc.com/rss',                                      siteUrl: 'https://www.inc.com',                   language: 'en', category: 'business' },
  { name: 'Business Insider',   url: 'https://feeds.businessinsider.com/custom/all',                 siteUrl: 'https://www.businessinsider.com',       language: 'en', category: 'business' },
  { name: 'CNBC Tech',          url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html',         siteUrl: 'https://www.cnbc.com/technology',       language: 'en', category: 'business' },
  { name: 'Fortune',            url: 'https://fortune.com/feed/',                                    siteUrl: 'https://fortune.com',                   language: 'en', category: 'business' },
  { name: 'ReadWrite',          url: 'https://readwrite.com/feed/',                                  siteUrl: 'https://readwrite.com',                 language: 'en', category: 'business' },
  { name: 'FayerWayer',         url: 'https://www.fayerwayer.com/feed/',                             siteUrl: 'https://www.fayerwayer.com',            language: 'es', category: 'business' },
  { name: 'Infobae Tech',       url: 'https://www.infobae.com/feeds/rss/tecno/',                     siteUrl: 'https://www.infobae.com/tecno',         language: 'es', category: 'business' },
  { name: 'Cronista Empresas',  url: 'https://www.cronista.com/rss/empresas.xml',                    siteUrl: 'https://www.cronista.com',              language: 'es', category: 'business' },
  { name: 'iProfesional',       url: 'https://www.iprofesional.com/rss/news.xml',                    siteUrl: 'https://www.iprofesional.com',          language: 'es', category: 'business' },
  { name: 'La Nación Techno',   url: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/tecnologia/', siteUrl: 'https://www.lanacion.com.ar/tecnologia', language: 'es', category: 'business' },

  // ── ECONOMY ───────────────────────────────────────────────────────────────
  { name: 'MarketWatch',        url: 'https://feeds.marketwatch.com/marketwatch/topstories',         siteUrl: 'https://www.marketwatch.com',           language: 'en', category: 'economy' },
  { name: 'Reuters Business',   url: 'https://feeds.reuters.com/reuters/businessNews',               siteUrl: 'https://www.reuters.com',               language: 'en', category: 'economy' },
  { name: 'NYT Economy',        url: 'https://rss.nytimes.com/services/xml/rss/nyt/Economy.xml',     siteUrl: 'https://www.nytimes.com',               language: 'en', category: 'economy' },
  { name: 'The Economist',      url: 'https://www.economist.com/finance-and-economics/rss.xml',      siteUrl: 'https://www.economist.com',             language: 'en', category: 'economy' },
  { name: 'Forbes',             url: 'https://www.forbes.com/real-time/feed2/',                      siteUrl: 'https://www.forbes.com',                language: 'en', category: 'economy' },
  { name: 'CNBC Economy',       url: 'https://www.cnbc.com/id/20910258/device/rss/rss.html',         siteUrl: 'https://www.cnbc.com/economy',          language: 'en', category: 'economy' },
  { name: 'CNBC Finance',       url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html',         siteUrl: 'https://www.cnbc.com/finance',          language: 'en', category: 'economy' },
  { name: 'Reuters Finance',    url: 'https://feeds.reuters.com/reuters/financialsNews',             siteUrl: 'https://www.reuters.com',               language: 'en', category: 'economy' },
  { name: 'Wolf Street',        url: 'https://wolfstreet.com/feed/',                                 siteUrl: 'https://wolfstreet.com',                language: 'en', category: 'economy' },
  { name: 'Expansión',          url: 'https://e00-expansion.uecdn.es/rss/portada.xml',               siteUrl: 'https://www.expansion.com',             language: 'es', category: 'economy' },
  { name: 'El Economista',      url: 'https://www.eleconomista.es/rss/rss-eco-portada.php',          siteUrl: 'https://www.eleconomista.es',           language: 'es', category: 'economy' },
  { name: 'Infobae Economía',   url: 'https://www.infobae.com/feeds/rss/economia/',                  siteUrl: 'https://www.infobae.com/economia',      language: 'es', category: 'economy' },
  { name: 'Ámbito',             url: 'https://www.ambito.com/rss/economia.xml',                      siteUrl: 'https://www.ambito.com',                language: 'es', category: 'economy' },
  { name: 'La Nación Eco',      url: 'https://www.lanacion.com.ar/arc/outboundfeeds/rss/category/economia/', siteUrl: 'https://www.lanacion.com.ar',   language: 'es', category: 'economy' },
  { name: 'El Cronista',        url: 'https://www.cronista.com/rss/economia.xml',                    siteUrl: 'https://www.cronista.com',              language: 'es', category: 'economy' },
  { name: 'iProfesional Eco',   url: 'https://www.iprofesional.com/rss/economia.xml',                siteUrl: 'https://www.iprofesional.com/economia', language: 'es', category: 'economy' },
  { name: 'Clarín Economía',    url: 'https://www.clarin.com/rss/economia/',                         siteUrl: 'https://www.clarin.com/economia',       language: 'es', category: 'economy' },
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

function extractImage(item: Record<string, unknown>): string | undefined {
  const media = item.mediaContent as { $?: { url?: string }; url?: string } | undefined
  if (media?.['$']?.url) return media['$'].url
  if (media?.url) return media.url as string

  const thumb = item.mediaThumbnail as { $?: { url?: string }; url?: string } | undefined
  if (thumb?.['$']?.url) return thumb['$'].url
  if (thumb?.url) return thumb.url as string

  const enc = item.enclosure as { url?: string; type?: string } | undefined
  if (enc?.url && enc.type?.startsWith('image/')) return enc.url

  const html = (item.contentEncoded ?? item.description ?? '') as string
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (match?.[1]) return match[1]

  return undefined
}

async function fetchFeed(source: FeedSource): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(source.url)
    const now = Date.now()
    const threeHoursMs = 3 * 60 * 60 * 1000

    return feed.items
      .filter((item) => {
        if (!item.pubDate && !item.isoDate) return false
        const pubTime = new Date(item.isoDate || item.pubDate || '').getTime()
        return !isNaN(pubTime) && now - pubTime < threeHoursMs
      })
      .map((item) => {
        const publishedAt = new Date(item.isoDate || item.pubDate || '').toISOString()
        // Expire at the next :00 or :30 boundary after 3 hours
        const rawExpiry = new Date(publishedAt).getTime() + threeHoursMs
        const expiryDate = new Date(rawExpiry)
        const mins = expiryDate.getMinutes()
        if (mins < 30) {
          expiryDate.setMinutes(30, 0, 0)
        } else {
          expiryDate.setHours(expiryDate.getHours() + 1, 0, 0, 0)
        }
        const expiresAt = expiryDate.toISOString()
        const rawSummary = item.contentSnippet || item.description || item.contentEncoded || ''
        const imageUrl = extractImage(item as unknown as Record<string, unknown>)

        return {
          id: generateId(item.link || item.guid || '', publishedAt),
          title: stripHtml(item.title || 'Untitled'),
          summary: cleanSummary(rawSummary),
          aiSummary: [],
          source: source.name,
          sourceUrl: source.siteUrl,
          articleUrl: item.link || item.guid || source.siteUrl,
          imageUrl,
          category: source.category,
          publishedAt,
          expiresAt,
          language: source.language,
        }
      })
  } catch {
    return []
  }
}

export async function fetchNews(category?: Category): Promise<NewsItem[]> {
  const feeds = category ? FEEDS.filter(f => f.category === category) : FEEDS
  const results = await Promise.allSettled(feeds.map(fetchFeed))

  const allItems: NewsItem[] = []
  for (const result of results) {
    if (result.status === 'fulfilled') allItems.push(...result.value)
  }

  const seen = new Set<string>()
  const unique = allItems.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })

  return unique.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}
