import { NextRequest, NextResponse } from 'next/server'
import { generateCaption, generateStoryIdeas } from '@/lib/ai-content'
import { publishNow } from '@/lib/instagram'
import { AutoStoryConfig, InstagramPost } from '@/types'

// POST /api/instagram/auto-story
// Triggers an auto-story generation + publish cycle.
export async function POST(req: NextRequest) {
  try {
    const config = await req.json() as AutoStoryConfig & { imageUrl?: string }
    if (!config.enabled) {
      return NextResponse.json({ error: 'Auto-story is disabled' }, { status: 400 })
    }

    // 1. Pick a topic
    const ideas = await generateStoryIdeas(config.topics, 1)
    const topic = ideas[0] ?? config.topics[0] ?? 'Забота о вашем здоровье'

    // 2. Generate caption
    const { caption, hashtags } = await generateCaption({
      topic,
      type: 'story',
      style: config.style,
    })

    // 3. Build post object (imageUrl must be supplied or a placeholder)
    const post: InstagramPost = {
      id: `auto-${Date.now()}`,
      type: 'story',
      status: 'draft',
      mediaUrl: config.imageUrl ?? '',
      caption,
      hashtags: config.includeHashtags ? hashtags : [],
      aiGenerated: true,
      topic,
      createdAt: new Date().toISOString(),
    }

    // 4. Publish if mediaUrl is provided
    if (post.mediaUrl) {
      const result = await publishNow(post)
      if (!result.success) {
        return NextResponse.json({ error: result.error, draft: post }, { status: 400 })
      }
      post.status = 'published'
      post.publishedAt = new Date().toISOString()
      post.instagramMediaId = result.mediaId
    }

    return NextResponse.json({ post, topic, caption, hashtags })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
