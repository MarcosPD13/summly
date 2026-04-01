import Anthropic from '@anthropic-ai/sdk'
import { NewsItem, Language } from './types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Module-level cache: survives warm function invocations
// key = `${id}-${lang}`, value = { title, aiSummary }
const summaryCache = new Map<string, { title: string; aiSummary: string[] }>()

interface RawItem {
  id: string
  title: string
  summary: string
}

export async function enrichArticles(
  items: NewsItem[],
  targetLang: Language
): Promise<NewsItem[]> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return items
  }

  const langName = targetLang === 'en' ? 'English' : 'Spanish'

  const toProcess: RawItem[] = []
  const cachedResults = new Map<string, { title: string; aiSummary: string[] }>()

  for (const item of items) {
    const key = `${item.id}-${targetLang}`
    const cached = summaryCache.get(key)
    if (cached) {
      cachedResults.set(item.id, cached)
    } else {
      toProcess.push({ id: item.id, title: item.title, summary: item.summary })
    }
  }

  if (toProcess.length > 0) {
    try {
      const prompt = `You are a tech news summarizer. For each article below, provide in ${langName}:
1. A translated title (if already in ${langName}, keep it as-is; otherwise translate it naturally)
2. Exactly 4 concise lines summarizing the key points of the story

Return ONLY a JSON array with this exact structure, no other text:
[{"id":"...","title":"translated title","lines":["line 1","line 2","line 3","line 4"]},...]

Articles:
${JSON.stringify(toProcess)}`

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 8192,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = response.content[0].type === 'text' ? response.content[0].text.trim() : '[]'
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as Array<{
          id: string
          title: string
          lines: string[]
        }>
        for (const p of parsed) {
          const data = { title: p.title, aiSummary: p.lines.slice(0, 4) }
          cachedResults.set(p.id, data)
          summaryCache.set(`${p.id}-${targetLang}`, data)
        }
      }
    } catch {
      // AI failed — fall back to original titles, no AI summary
    }
  }

  return items.map((item) => {
    const enriched = cachedResults.get(item.id)
    if (enriched) {
      return { ...item, title: enriched.title, aiSummary: enriched.aiSummary }
    }
    return item
  })
}
