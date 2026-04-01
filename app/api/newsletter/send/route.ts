import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { fetchNews } from '@/lib/rss'
import { enrichArticles } from '@/lib/summarize'
import { generateSubject, buildEmailHtml } from '@/lib/email'
import { getSupabase } from '@/lib/supabase'
import { Language } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://techpulse.vercel.app'
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'Summly <noticias@techpulse.app>'

  // Fetch all active subscribers
  const { data: subscribers, error: dbError } = await getSupabase()
    .from('newsletter_subscribers')
    .select('email, lang')
    .eq('active', true)

  if (dbError || !subscribers || subscribers.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No active subscribers' })
  }

  // Fetch news once, get top 5
  const allItems = await fetchNews()
  const top5 = allItems.slice(0, 5)

  // Generate enriched versions for each language
  const langs: Language[] = ['es', 'en']
  const enrichedByLang: Record<Language, typeof top5> = { es: top5, en: top5 }
  const subjectByLang: Record<Language, string> = { es: '', en: '' }

  for (const lang of langs) {
    const hasLangSubscribers = subscribers.some((s) => (s.lang ?? 'es') === lang)
    if (!hasLangSubscribers) continue

    enrichedByLang[lang] = await enrichArticles(top5, lang)
    subjectByLang[lang] = await generateSubject(enrichedByLang[lang], lang)
  }

  // Build and send emails in batches of 100
  const BATCH_SIZE = 100
  let totalSent = 0

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE)

    const emails = batch.map((sub) => {
      const lang: Language = sub.lang === 'en' ? 'en' : 'es'
      const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(sub.email)}&lang=${lang}`
      return {
        from: fromEmail,
        to: sub.email,
        subject: subjectByLang[lang],
        html: buildEmailHtml(enrichedByLang[lang], lang, siteUrl, unsubscribeUrl),
      }
    })

    const { data, error } = await resend.batch.send(emails)
    if (!error && data) totalSent += emails.length
  }

  return NextResponse.json({ sent: totalSent, subscribers: subscribers.length })
}
