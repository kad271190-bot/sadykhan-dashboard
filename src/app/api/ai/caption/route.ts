import { NextRequest, NextResponse } from 'next/server'
import { generateCaption } from '@/lib/ai-content'
import { InstagramPostType } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { topic: string; type: InstagramPostType; style: string; brand?: string }
    const result = await generateCaption(body)
    return NextResponse.json(result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
