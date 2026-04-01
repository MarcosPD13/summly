export type Language = 'en' | 'es'

export interface NewsItem {
  id: string
  title: string
  summary: string
  aiSummary: string[]   // 4 AI-generated lines in target language
  source: string
  sourceUrl: string
  articleUrl: string
  publishedAt: string   // ISO string
  expiresAt: string     // ISO string (publishedAt + 12h)
  language: Language
}

export interface NewsResponse {
  items: NewsItem[]
  fetchedAt: string
  nextRefreshAt: string
}
