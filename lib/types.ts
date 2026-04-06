export type Language = 'en' | 'es'
export type Category = 'tech' | 'innovation' | 'business' | 'economy'

export interface NewsItem {
  id: string
  title: string
  summary: string
  aiSummary: string[]   // 4 AI-generated lines in target language
  source: string
  sourceUrl: string
  articleUrl: string
  imageUrl?: string     // article hero image if available
  category: Category
  publishedAt: string   // ISO string
  expiresAt: string     // ISO string (publishedAt + 5h)
  language: Language
}

export interface NewsResponse {
  items: NewsItem[]
  fetchedAt: string
  nextRefreshAt: string
}
