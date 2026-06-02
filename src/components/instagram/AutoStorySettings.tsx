'use client'
import { useState } from 'react'
import { Sparkles, Plus, X, Play, Clock, Zap, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { AutoStoryConfig } from '@/types'
import { cn } from '@/lib/utils'

const FREQ_OPTIONS = [
  { value: 'daily',    label: 'Ежедневно' },
  { value: '2x_daily', label: '2 раза в день' },
  { value: 'weekly',   label: 'Еженедельно' },
]

const STYLE_OPTIONS = [
  { value: 'casual',  label: 'Дружелюбный' },
  { value: 'formal',  label: 'Деловой' },
  { value: 'promo',   label: 'Рекламный' },
]

const DEFAULT_TOPICS = [
  'Акции и скидки', 'Советы по здоровью', 'Новые поступления', 'Витамины и БАДы',
]

const DEFAULT_CONFIG: AutoStoryConfig = {
  enabled: false,
  frequency: 'daily',
  topics: DEFAULT_TOPICS,
  style: 'casual',
  includeHashtags: true,
  scheduledTime: '10:00',
}

interface RunResult {
  success: boolean
  topic?: string
  caption?: string
  hashtags?: string[]
  error?: string
}

export default function AutoStorySettings() {
  const [config, setConfig] = useState<AutoStoryConfig>(DEFAULT_CONFIG)
  const [newTopic, setNewTopic]     = useState('')
  const [imageUrl, setImageUrl]     = useState('')
  const [running, setRunning]       = useState(false)
  const [result, setResult]         = useState<RunResult | null>(null)

  function toggle(key: keyof AutoStoryConfig, value: unknown) {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  function addTopic() {
    const t = newTopic.trim()
    if (t && !config.topics.includes(t)) toggle('topics', [...config.topics, t])
    setNewTopic('')
  }

  function removeTopic(topic: string) {
    toggle('topics', config.topics.filter(t => t !== topic))
  }

  async function handleRun() {
    if (!config.enabled) { alert('Сначала включите авто-сторис'); return }
    setRunning(true)
    setResult(null)
    try {
      const res = await fetch('/api/instagram/auto-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, imageUrl: imageUrl || undefined }),
      })
      const data = await res.json() as { topic?: string; caption?: string; hashtags?: string[]; error?: string }
      if (data.error && !data.caption) {
        setResult({ success: false, error: data.error })
      } else {
        setResult({ success: true, topic: data.topic, caption: data.caption, hashtags: data.hashtags })
      }
    } catch (e) {
      setResult({ success: false, error: e instanceof Error ? e.message : 'Ошибка запроса' })
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Авто-сторис</h2>
        <button
          onClick={() => toggle('enabled', !config.enabled)}
          className={cn(
            'relative w-10 h-5.5 rounded-full transition-colors',
            config.enabled ? 'bg-[#3A9EA5]' : 'bg-gray-200'
          )}
          style={{ height: 22, width: 40 }}
        >
          <span
            className={cn(
              'absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform',
              config.enabled ? 'translate-x-5' : 'translate-x-0.5'
            )}
            style={{ width: 18, height: 18, top: 2 }}
          />
        </button>
      </div>

      {/* Status */}
      <div className={cn(
        'flex items-center gap-2 text-sm px-3 py-2 rounded-lg',
        config.enabled ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'
      )}>
        <Zap className="w-4 h-4" />
        {config.enabled ? 'Авто-сторис включены. ИИ будет публиковать по расписанию.' : 'Авто-сторис отключены.'}
      </div>

      {/* Frequency */}
      <div>
        <label className="text-xs font-medium text-gray-500 mb-2 block">Частота</label>
        <div className="flex gap-2">
          {FREQ_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => toggle('frequency', opt.value)}
              className={cn(
                'flex-1 py-2 rounded-lg border text-sm transition-colors',
                config.frequency === opt.value
                  ? 'border-[#3A9EA5] bg-[#3A9EA5]/5 text-[#3A9EA5] font-medium'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time */}
      <div>
        <label className="text-xs font-medium text-gray-500 mb-1 block flex items-center gap-1">
          <Clock className="w-3 h-3" /> Время публикации
        </label>
        <input
          type="time"
          value={config.scheduledTime}
          onChange={e => toggle('scheduledTime', e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A9EA5]"
        />
      </div>

      {/* Style */}
      <div>
        <label className="text-xs font-medium text-gray-500 mb-2 block">Стиль текста</label>
        <div className="flex gap-2">
          {STYLE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => toggle('style', opt.value)}
              className={cn(
                'flex-1 py-2 rounded-lg border text-sm transition-colors',
                config.style === opt.value
                  ? 'border-[#F5813F] bg-[#F5813F]/5 text-[#F5813F] font-medium'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div>
        <label className="text-xs font-medium text-gray-500 mb-2 block flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Темы для ИИ
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {config.topics.map(topic => (
            <span key={topic} className="flex items-center gap-1 text-xs bg-[#3A9EA5]/10 text-[#3A9EA5] px-2 py-1 rounded-full">
              {topic}
              <button onClick={() => removeTopic(topic)} className="hover:text-red-500">
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newTopic}
            onChange={e => setNewTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTopic())}
            placeholder="Добавить тему..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#3A9EA5]"
          />
          <button
            onClick={addTopic}
            className="p-1.5 rounded-lg border border-gray-200 hover:border-[#3A9EA5] text-gray-500 hover:text-[#3A9EA5]"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hashtags toggle */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={config.includeHashtags}
          onChange={e => toggle('includeHashtags', e.target.checked)}
          className="rounded"
        />
        <span className="text-sm text-gray-700">Добавлять хэштеги автоматически</span>
      </label>

      {/* Manual trigger */}
      <div className="border-t border-gray-100 pt-4 space-y-3">
        <p className="text-xs font-medium text-gray-500">Запустить сейчас (тест)</p>
        <input
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          placeholder="URL фото для сторис (необязательно)"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3A9EA5]"
        />
        <button
          onClick={handleRun}
          disabled={running || !config.enabled}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-opacity"
          style={{ background: '#3A9EA5' }}
        >
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? 'Генерирую...' : 'Запустить авто-сторис'}
        </button>

        {result && (
          <div className={cn(
            'rounded-lg p-3 space-y-1.5 text-sm',
            result.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
          )}>
            <div className={cn('flex items-center gap-1.5 font-medium', result.success ? 'text-green-700' : 'text-red-600')}>
              {result.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {result.success ? 'Успешно!' : 'Ошибка'}
            </div>
            {result.error && <p className="text-red-600 text-xs">{result.error}</p>}
            {result.topic && <p className="text-gray-600 text-xs"><span className="font-medium">Тема:</span> {result.topic}</p>}
            {result.caption && <p className="text-gray-800 text-xs">{result.caption}</p>}
            {result.hashtags && result.hashtags.length > 0 && (
              <p className="text-[#3A9EA5] text-xs">{result.hashtags.map(h => `#${h}`).join(' ')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
