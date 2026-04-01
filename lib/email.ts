import Anthropic from '@anthropic-ai/sdk'
import { NewsItem, Language } from './types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateSubject(
  articles: NewsItem[],
  lang: Language
): Promise<string> {
  const langName = lang === 'es' ? 'Spanish' : 'English'
  const titles = articles.map((a) => a.title).join('\n')

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: `Based on these 5 tech news headlines, write a short, engaging email subject line in ${langName}.
It should be clear, simple, and reflect the main themes. Max 60 characters. Return ONLY the subject line, no quotes.

Headlines:
${titles}`,
        },
      ],
    })
    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    return text || defaultSubject(lang)
  } catch {
    return defaultSubject(lang)
  }
}

function defaultSubject(lang: Language): string {
  const now = new Date()
  const date = now.toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return lang === 'es'
    ? `⚡ Summly — Noticias del ${date}`
    : `⚡ Summly — Tech news for ${date}`
}

function formatTimeAgo(isoDate: string, lang: Language): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor(diff / 60000)
  if (m < 60) return lang === 'es' ? `${m}m` : `${m}m ago`
  return lang === 'es' ? `${h}h` : `${h}h ago`
}

const SOURCE_COLORS: Record<string, string> = {
  TechCrunch: '#16a34a',
  'The Verge': '#9333ea',
  Wired: '#dc2626',
  'Ars Technica': '#ea580c',
  VentureBeat: '#2563eb',
  'MIT Tech Review': '#0284c7',
  'Hacker News': '#ca8a04',
  Xataka: '#4f46e5',
  Genbeta: '#db2777',
  Hipertextual: '#0d9488',
  FayerWayer: '#0891b2',
}

function articleHtml(item: NewsItem, lang: Language): string {
  const color = SOURCE_COLORS[item.source] || '#7c3aed'
  const summaryLines =
    item.aiSummary && item.aiSummary.length > 0 ? item.aiSummary : [item.summary]
  const readMore = lang === 'es' ? 'Leer artículo completo →' : 'Read full article →'
  const timeAgo = formatTimeAgo(item.publishedAt, lang)

  const lines = summaryLines
    .map(
      (line) =>
        `<li style="margin-bottom:4px;color:#4b5563;font-size:13px;line-height:1.5;">${line}</li>`
    )
    .join('')

  return `
  <div style="background:#ffffff;padding:20px 24px;border-bottom:1px solid #f0f0f0;">
    <div style="margin-bottom:8px;">
      <span style="background:${color}22;color:${color};padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600;">${item.source}</span>
      <span style="color:#9ca3af;font-size:11px;margin-left:8px;">${timeAgo}</span>
    </div>
    <h2 style="font-size:15px;font-weight:700;margin:0 0 10px 0;color:#111827;line-height:1.4;">${item.title}</h2>
    <ul style="margin:0 0 10px 0;padding-left:18px;">
      ${lines}
    </ul>
    <a href="${item.articleUrl}" style="color:#7c3aed;font-size:12px;text-decoration:none;font-weight:500;">${readMore}</a>
  </div>`
}

export function buildEmailHtml(
  articles: NewsItem[],
  lang: Language,
  siteUrl: string,
  unsubscribeUrl: string
): string {
  const now = new Date()
  const dateStr = now.toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const headerTitle = lang === 'es' ? 'Digest Diario' : 'Daily Digest'
  const headerSub = lang === 'es' ? 'Las 5 noticias tech del momento' : 'Top 5 tech stories right now'
  const ctaText = lang === 'es' ? 'Ver más noticias →' : 'See more news →'
  const unsubText = lang === 'es' ? 'Cancelar suscripción' : 'Unsubscribe'
  const footerText =
    lang === 'es'
      ? 'Enviado 2 veces al día · Noticias de fuentes globales de tecnología'
      : 'Sent twice daily · News from global tech sources'

  const articlesHtml = articles.map((a) => articleHtml(a, lang)).join('')

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Summly</title>
</head>
<body style="margin:0;padding:20px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;">

    <!-- Header -->
    <div style="background:#0F0F17;border-radius:12px 12px 0 0;padding:28px 24px;text-align:center;">
      <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span style="font-size:20px;">⚡</span>
        <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">Summly</span>
      </div>
      <div style="color:#a78bfa;font-size:13px;font-weight:600;">${headerTitle}</div>
      <div style="color:#475569;font-size:11px;margin-top:4px;">${headerSub}</div>
      <div style="color:#334155;font-size:11px;margin-top:8px;border-top:1px solid #1e1e2e;padding-top:8px;">${dateStr}</div>
    </div>

    <!-- Articles -->
    <div style="background:#ffffff;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
      ${articlesHtml}
    </div>

    <!-- CTA -->
    <div style="background:#0F0F17;padding:28px 24px;text-align:center;border-radius:0 0 12px 12px;">
      <a href="${siteUrl}"
         style="display:inline-block;background:#7c3aed;color:#ffffff;padding:13px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.2px;">
        ${ctaText}
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:16px 24px;color:#9ca3af;font-size:11px;line-height:1.6;">
      ${footerText}<br>
      <a href="${unsubscribeUrl}" style="color:#6b7280;text-decoration:underline;">${unsubText}</a>
    </div>

  </div>
</body>
</html>`
}
