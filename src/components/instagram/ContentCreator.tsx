'use client'
import { useState } from 'react'
import { Sparkles, Image, Video, BookOpen, Clock, Send, Plus, X } from 'lucide-react'
import { InstagramPost, InstagramPostType } from '@/types'
import { cn } from '@/lib/utils'

const TYPE_OPTIONS: { value: InstagramPostType; label: string; icon: React.ElementType; hint: string }[] = [
  { value: 'post',  label: 'Пост',   icon: Image,    hint: '≤ 10 фото/видео' },
  { value: 'reel',  label: 'Рилс',   icon: Video,    hint: 'Короткое видео' },
  { value: 'story', label: 'Сторис', icon: BookOpen,  hint: 'Исчезает через 24ч' },
]

const STYLE_OPTIONS = [
  { value: 'casual', label: 'Дружелюбный' },
  { value: 'formal', label: 'Деловой' },
  { value: 'promo',  label: 'Рекламный' },
]

interface Props {
  onAdd: (post: Omit<InstagramPost, 'id' | 'createdAt'>) => void
}

export default function ContentCreator({ onAdd }: Props) {
  const [type, setType]         = useState<InstagramPostType>('post')
  const [mediaUrl, setMediaUrl] = useState('')
  const [topic, setTopic]       = useState('')
  const [caption, setCaption]   = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [newTag, setNewTag]     = useState('')
  const [style, setStyle]       = useState('casual')
  const [schedule, setSchedule] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError]   = useState('')

  async function handleAI() {
    if (!topic.trim()) { setAiError('Введите тему'); return }
    setAiLoading(true)
    setAiError('')
    try {
      const res = await fetch('/api/ai/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), type, style }),
      })
      const data = await res.json() as { caption?: string; hashtags?: string[]; error?: string }
      if (data.error) throw new Error(data.error)
      setCaption(data.caption ?? '')
      setHashtags(data.hashtags ?? [])
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Ошибка AI')
    } finally {
      setAiLoading(false)
    }
  }

  function addHashtag() {
    const tag = newTag.replace(/^#/, '').trim()
    if (tag && !hashtags.includes(tag)) setHashtags(prev => [...prev, tag])
    setNewTag('')
  }

  function handleSubmit(immediate: boolean) {
    if (!caption.trim()) return
    onAdd({
      type,
      status: immediate ? 'draft' : 'scheduled',
      mediaUrl: mediaUrl.trim(),
      caption: caption.trim(),
      hashtags,
      scheduledAt: !immediate && schedule ? new Date(schedule).toISOString() : undefined,
      aiGenerated: false,
      topic: topic || undefined,
    })
    setCaption('')
    setHashtags([])
    setMediaUrl('')
    setTopic('')
    setSchedule('')
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
      <h2 className="font-semibold text-gray-900">Создать публикацию</h2>

      {/* Type selector */}
      <div className="flex gap-2">
        {TYPE_OPTIONS.map(opt => {
          const Icon = opt.icon
          return (
            <button
              key={opt.value}
              onClick={() => setType(opt.value)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3 rounded-lg border text-sm transition-colors',
                type === opt.value
                  ? 'border-[#3A9EA5] bg-[#3A9EA5]/5 text-[#3A9EA5]'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{opt.label}</span>
              <span className="text-[10px] text-gray-400">{opt.hint}</span>
            </button>
          )
        })}
      </div>

      {/* Media URL */}
      <div>
        <label className="text-xs font-medium text-gray-500 mb-1 block">URL медиа (фото/видео)</label>
        <input
          value={mediaUrl}
          onChange={e => setMediaUrl(e.target.value)}
          placeholder="https://..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A9EA5]"
        />
      </div>

      {/* AI section */}
      <div className="rounded-lg border border-[#3A9EA5]/30 bg-[#3A9EA5]/3 p-3 space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-[#3A9EA5]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-генерация подписи</span>
        </div>
        <div className="flex gap-2">
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Тема (напр. «Скидки на витамины»)"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A9EA5]"
          />
          <select
            value={style}
            onChange={e => setStyle(e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-[#3A9EA5] text-gray-600"
          >
            {STYLE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <button
          onClick={handleAI}
          disabled={aiLoading || !topic.trim()}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-50"
          style={{ background: '#3A9EA5' }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {aiLoading ? 'Генерирую...' : 'Сгенерировать подпись'}
        </button>
        {aiError && <p className="text-xs text-red-500">{aiError}</p>}
      </div>

      {/* Caption */}
      <div>
        <label className="text-xs font-medium text-gray-500 mb-1 block">Подпись</label>
        <textarea
          value={caption}
          onChange={e => setCaption(e.target.value)}
          rows={4}
          placeholder="Текст публикации..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A9EA5] resize-none"
        />
        <div className="text-right text-xs text-gray-400 mt-0.5">{caption.length} симв.</div>
      </div>

      {/* Hashtags */}
      <div>
        <label className="text-xs font-medium text-gray-500 mb-1 block">Хэштеги</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {hashtags.map(tag => (
            <span key={tag} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              #{tag}
              <button onClick={() => setHashtags(prev => prev.filter(t => t !== tag))} className="hover:text-red-500">
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
            placeholder="#хэштег"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#3A9EA5]"
          />
          <button
            onClick={addHashtag}
            className="p-1.5 rounded-lg border border-gray-200 hover:border-[#3A9EA5] text-gray-500 hover:text-[#3A9EA5]"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Schedule */}
      <div>
        <label className="text-xs font-medium text-gray-500 mb-1 block flex items-center gap-1">
          <Clock className="w-3 h-3" /> Запланировать на (опционально)
        </label>
        <input
          type="datetime-local"
          value={schedule}
          onChange={e => setSchedule(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A9EA5]"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => handleSubmit(true)}
          disabled={!caption.trim()}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
        >
          В очередь (черновик)
        </button>
        <button
          onClick={() => handleSubmit(false)}
          disabled={!caption.trim()}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-40 transition-opacity"
          style={{ background: '#F5813F' }}
        >
          <Send className="w-3.5 h-3.5" />
          {schedule ? 'Запланировать' : 'Опубликовать'}
        </button>
      </div>
    </div>
  )
}
