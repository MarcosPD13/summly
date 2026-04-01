import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { email, lang } = await req.json()

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const language = lang === 'en' ? 'en' : 'es'

  const { error } = await getSupabase()
    .from('newsletter_subscribers')
    .upsert({ email: email.toLowerCase().trim(), lang: language, active: true }, { onConflict: 'email' })

  if (error) {
    console.error('Supabase subscribe error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
