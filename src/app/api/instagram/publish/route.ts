import { NextRequest, NextResponse } from 'next/server'
import { publishNow } from '@/lib/instagram'
import { InstagramPost } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const post = await req.json() as InstagramPost
    const result = await publishNow(post)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ mediaId: result.mediaId })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
