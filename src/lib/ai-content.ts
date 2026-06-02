import Anthropic from '@anthropic-ai/sdk'
import { InstagramPostType } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const STYLE_HINTS: Record<string, string> = {
  formal:  'Деловой, профессиональный тон. Без сленга.',
  casual:  'Дружелюбный, живой тон. Можно использовать эмодзи.',
  promo:   'Рекламный, призывающий к действию тон. Выделяй выгоды.',
}

export async function generateCaption(params: {
  topic: string
  type: InstagramPostType
  style: string
  brand?: string
}): Promise<{ caption: string; hashtags: string[] }> {
  const { topic, type, style, brand = 'садыхан' } = params
  const styleHint = STYLE_HINTS[style] ?? STYLE_HINTS.casual

  const typeHint =
    type === 'story'  ? 'Короткая сторис-подпись (до 80 символов).' :
    type === 'reel'   ? 'Захватывающая подпись для рилс (100-200 символов).' :
                        'Полноценная подпись для поста (150-300 символов).'

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `Ты контент-менеджер Instagram для казахстанской аптечной сети "${brand}".
Тема: "${topic}"
Формат: ${typeHint}
Стиль: ${styleHint}

Ответь строго в JSON:
{
  "caption": "текст подписи без хэштегов",
  "hashtags": ["хэштег1", "хэштег2", "...до10хэштегов"]
}
Только JSON, никакого другого текста.`,
    }],
  })

  const raw = (msg.content[0] as { type: string; text: string }).text.trim()
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('AI returned invalid JSON')
  return JSON.parse(jsonMatch[0]) as { caption: string; hashtags: string[] }
}

export async function generateStoryIdeas(topics: string[], count = 3): Promise<string[]> {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `Придумай ${count} идеи для Instagram-сторис для аптечной сети "садыхан".
Темы для вдохновения: ${topics.join(', ')}.
Ответь строго в JSON: {"ideas": ["идея1", "идея2", "идея3"]}
Только JSON.`,
    }],
  })

  const raw = (msg.content[0] as { type: string; text: string }).text.trim()
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return []
  const parsed = JSON.parse(jsonMatch[0]) as { ideas: string[] }
  return parsed.ideas ?? []
}
