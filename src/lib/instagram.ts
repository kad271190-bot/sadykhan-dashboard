import { InstagramPost } from '@/types'

const BASE = 'https://graph.instagram.com/v20.0'
const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN ?? ''
const USER_ID = process.env.INSTAGRAM_USER_ID ?? ''

export type PublishResult = { success: true; mediaId: string } | { success: false; error: string }

async function igFetch(path: string, body: Record<string, unknown>): Promise<{ id?: string; error?: { message: string } }> {
  const res = await fetch(`${BASE}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, access_token: TOKEN }),
  })
  return res.json()
}

async function createContainer(post: InstagramPost): Promise<{ id?: string; error?: { message: string } }> {
  const isVideo = post.type === 'reel' || post.mediaUrl.match(/\.(mp4|mov|avi)$/i)
  const captionFull = [post.caption, ...post.hashtags.map(h => `#${h}`)].join('\n')

  const params: Record<string, unknown> = {
    caption: captionFull,
  }

  if (post.type === 'story') {
    params.media_type = 'STORIES'
    if (isVideo) params.video_url = post.mediaUrl
    else params.image_url = post.mediaUrl
  } else if (post.type === 'reel') {
    params.media_type = 'REELS'
    params.video_url = post.mediaUrl
    params.share_to_feed = true
  } else {
    // regular post
    if (isVideo) {
      params.media_type = 'VIDEO'
      params.video_url = post.mediaUrl
    } else {
      params.image_url = post.mediaUrl
    }
  }

  return igFetch(`${USER_ID}/media`, params)
}

async function publishContainer(containerId: string): Promise<{ id?: string; error?: { message: string } }> {
  return igFetch(`${USER_ID}/media_publish`, { creation_id: containerId })
}

export async function publishNow(post: InstagramPost): Promise<PublishResult> {
  if (!TOKEN || !USER_ID) {
    return { success: false, error: 'Instagram credentials not configured (INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_USER_ID)' }
  }
  const container = await createContainer(post)
  if (container.error || !container.id) {
    return { success: false, error: container.error?.message ?? 'Failed to create media container' }
  }
  // Instagram requires a short wait for video processing
  if (post.type === 'reel') await new Promise(r => setTimeout(r, 5000))

  const published = await publishContainer(container.id)
  if (published.error || !published.id) {
    return { success: false, error: published.error?.message ?? 'Failed to publish media' }
  }
  return { success: true, mediaId: published.id }
}
