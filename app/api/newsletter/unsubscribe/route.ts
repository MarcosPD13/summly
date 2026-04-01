import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')

  if (!email) {
    return new NextResponse('Missing email', { status: 400 })
  }

  const decoded = decodeURIComponent(email)

  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ active: false })
    .eq('email', decoded.toLowerCase().trim())

  if (error) {
    return new NextResponse('Failed to unsubscribe', { status: 500 })
  }

  const lang = req.nextUrl.searchParams.get('lang') ?? 'es'
  const message =
    lang === 'en'
      ? 'You have been unsubscribed from TechPulse newsletter.'
      : 'Te diste de baja del newsletter de TechPulse.'

  return new NextResponse(
    `<html><body style="font-family:sans-serif;text-align:center;padding:60px;color:#374151;">
      <h2>⚡ TechPulse</h2><p>${message}</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
