'use client'
import { useState } from 'react'
import { MessageSquare, ChevronRight, Zap, Send, Star } from 'lucide-react'
import { REVIEWS, AI_RESPONSE_TEMPLATES } from '@/lib/data'
import {
  getSeverityColor, getSeverityLabel, getCategoryLabel,
  formatRelative, cn
} from '@/lib/utils'
import type { Review } from '@/types'

const SENTIMENT_COLORS: Record<Review['sentiment'], string> = {
  positive: 'text-green-600',
  neutral: 'text-gray-500',
  negative: 'text-red-600',
}

interface Props { filter?: string }

export default function ReviewsFeed({ filter = '' }: Props) {
  const [selected, setSelected] = useState<Review | null>(null)
  const [variant, setVariant] = useState<'empathetic' | 'official' | 'short'>('empathetic')
  const [sentFilter, setSentFilter] = useState<'all' | 'negative' | 'positive'>('all')

  const filtered = REVIEWS.filter((r) => {
    const q = filter.toLowerCase()
    const matchQ = !q || r.text.toLowerCase().includes(q) || r.authorName.toLowerCase().includes(q) || r.branchAddress.toLowerCase().includes(q)
    const matchSent = sentFilter === 'all' || r.sentiment === sentFilter
    return matchQ && matchSent
  }).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  const variantLabels = { empathetic: 'Эмпатичный', official: 'Официальный', short: 'Краткий' }

  const getResponseText = (review: Review): string => {
    const cat = review.categories[0]
    if (!cat) return 'Здравствуйте! Благодарим за ваш отзыв. Мы обязательно рассмотрим ваше обращение.'
    const templates = AI_RESPONSE_TEMPLATES[cat]
    if (!templates) return 'Здравствуйте! Благодарим за обратную связь. Ваше обращение передано в отдел качества.'
    return templates[variant] ?? templates['empathetic']
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* List */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Отзывы</span>
          <div className="flex-1" />
          {(['all', 'negative', 'positive'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSentFilter(s)}
              className={cn(
                'text-xs px-2.5 py-1 rounded-full border transition-colors',
                sentFilter === s ? 'text-white border-transparent' : 'text-gray-500 border-gray-200'
              )}
              style={sentFilter === s ? { background: 'var(--accent)' } : {}}
            >
              {s === 'all' ? 'Все' : s === 'negative' ? 'Негативные' : 'Позитивные'}
            </button>
          ))}
        </div>

        <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
          {filtered.map((review) => (
            <div
              key={review.id}
              onClick={() => setSelected(review)}
              className={cn(
                'px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50',
                selected?.id === review.id && 'bg-green-50 border-l-2 border-l-green-600'
              )}
            >
              <div className="flex items-start gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 text-[10px] font-medium shrink-0">
                  {review.authorInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{review.authorName}</span>
                    <span className="text-xs text-gray-400">{review.branchAddress.split(',')[0]}</span>
                    <span className="ml-auto flex items-center gap-0.5 text-amber-500">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{review.text}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {review.categories.map((cat) => (
                  <span key={cat} className="text-[10px] px-1.5 py-0.5 bg-red-50 text-red-700 rounded">
                    {getCategoryLabel(cat)}
                  </span>
                ))}
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium', getSeverityColor(review.severity))}>
                  {getSeverityLabel(review.severity)}
                </span>
                {!review.hasReply && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded">Без ответа</span>
                )}
                <span className="ml-auto text-[10px] text-gray-400">{formatRelative(review.publishedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Response Generator */}
      <div className="card overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <Zap className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--accent)' }}>
            AI-генератор ответа
          </span>
        </div>

        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
            <ChevronRight className="w-8 h-8 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">Выберите отзыв слева</p>
            <p className="text-xs text-gray-300 mt-1">AI сгенерирует профессиональный ответ</p>
          </div>
        ) : (
          <div className="p-4 flex-1 flex flex-col gap-4">
            {/* Selected review */}
            <div className="rounded-lg bg-gray-50 p-3 text-sm">
              <div className="font-medium text-gray-800 mb-1">{selected.authorName} · {selected.branchAddress}</div>
              <p className="text-gray-600 text-xs leading-relaxed">{selected.text}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] text-amber-500">{'★'.repeat(selected.rating)}</span>
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded', getSeverityColor(selected.severity))}>
                  {getSeverityLabel(selected.severity)}
                </span>
                <span className="text-[10px] text-gray-400">AI риск: {selected.aiRiskScore}%</span>
              </div>
            </div>

            {/* Variant selector */}
            <div>
              <div className="text-xs text-gray-400 mb-2">Вариант ответа:</div>
              <div className="flex gap-2">
                {(Object.keys(variantLabels) as Array<keyof typeof variantLabels>).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-lg border transition-colors',
                      variant === v ? 'text-white border-transparent' : 'text-gray-600 border-gray-200 hover:border-gray-300'
                    )}
                    style={variant === v ? { background: 'var(--accent)' } : {}}
                  >
                    {variantLabels[v]}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated response */}
            <div className="flex-1 rounded-lg border border-green-100 bg-green-50 p-3">
              <div className="text-[10px] uppercase tracking-wider text-green-600 font-medium mb-2">
                Готовый ответ
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {getResponseText(selected)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg text-white transition-colors"
                style={{ background: 'var(--accent)' }}
              >
                <Send className="w-3.5 h-3.5" />
                Опубликовать в 2GIS
              </button>
              <button className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                Копировать
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
