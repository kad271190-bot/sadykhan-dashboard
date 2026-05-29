'use client'
import { useState } from 'react'
import { Send, Copy, Check, Zap } from 'lucide-react'
import { REVIEWS, AI_RESPONSE_TEMPLATES } from '@/lib/data'
import { getCategoryLabel, formatRelative } from '@/lib/utils'
import type { Review } from '@/types'

const BRAND_TEAL = '#3A9EA5'

function getResponse(review: Review, variant: string): string {
  const cat = review.categories[0]
  if (!cat) return 'Здравствуйте! Благодарим за ваш отзыв. Мы обязательно рассмотрим ваше обращение.'
  const templates = AI_RESPONSE_TEMPLATES[cat] as Record<string, string> | undefined
  if (!templates) return 'Здравствуйте! Благодарим за обратную связь. Ваше обращение передано в отдел качества.'
  return templates[variant] ?? templates['empathetic']
}

export default function ReplyComposer() {
  const [selected, setSelected] = useState<Review | null>(null)
  const [variant, setVariant] = useState('empathetic')
  const [customText, setCustomText] = useState('')
  const [sent, setSent] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unanswered'>('unanswered')

  const reviews = REVIEWS
    .filter(r => filter === 'all' ? true : !r.hasReply)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  const handleSelect = (r: Review) => {
    setSelected(r)
    setCustomText(getResponse(r, variant))
  }

  const handleVariantChange = (v: string) => {
    setVariant(v)
    if (selected) setCustomText(getResponse(selected, v))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(customText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSend = () => {
    if (!selected) return
    setSent(prev => [...prev, selected.id])
    alert('Скопировано! Вставьте ответ в 2GIS Business вручную.')
  }

  const variants = [
    { id: 'empathetic', label: 'Эмпатичный' },
    { id: 'official', label: 'Официальный' },
    { id: 'short', label: 'Краткий' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-medium flex-1">
            Отзывы
          </span>
          <button
            onClick={() => setFilter('unanswered')}
            className="text-xs px-2.5 py-1 rounded-full border transition-colors"
            style={filter === 'unanswered'
              ? { background: BRAND_TEAL, color: 'white', borderColor: BRAND_TEAL }
              : { borderColor: '#e5e7eb', color: '#6b7280' }}
          >
            Без ответа
          </button>
          <button
            onClick={() => setFilter('all')}
            className="text-xs px-2.5 py-1 rounded-full border transition-colors"
            style={filter === 'all'
              ? { background: BRAND_TEAL, color: 'white', borderColor: BRAND_TEAL }
              : { borderColor: '#e5e7eb', color: '#6b7280' }}
          >
            Все
          </button>
        </div>

        <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
          {reviews.map(r => (
            <div
              key={r.id}
              onClick={() => handleSelect(r)}
              className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
              style={selected?.id === r.id
                ? { borderLeft: `3px solid ${BRAND_TEAL}`, background: '#E8F6F7' }
                : {}}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                  style={{ background: '#eff6ff', color: '#1e40af' }}
                >
                  {r.authorInitials}
                </div>
                <span className="text-sm font-medium text-gray-800">{r.authorName}</span>
                <span className="text-xs text-gray-400 truncate">{r.branchAddress.split(',')[0]}</span>
                <span className="ml-auto text-amber-500 text-xs">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mb-1.5">{r.text}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {r.categories.map(c => (
                  <span key={c} className="text-xs px-1.5 py-0.5 bg-red-50 text-red-700 rounded">
                    {getCategoryLabel(c)}
                  </span>
                ))}
                {sent.includes(r.id) && (
                  <span className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{ background: '#E8F6F7', color: BRAND_TEAL }}>
                    Отвечено
                  </span>
                )}
                {!r.hasReply && !sent.includes(r.id) && (
                  <span className="text-xs px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded">
                    Без ответа
                  </span>
                )}
                <span className="ml-auto text-xs text-gray-400">{formatRelative(r.publishedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <Zap className="w-4 h-4" style={{ color: BRAND_TEAL }} />
          <span className="text-xs uppercase tracking-wider font-medium" style={{ color: BRAND_TEAL }}>
            Составить ответ
          </span>
        </div>

        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
            <Send className="w-8 h-8 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">Выберите отзыв слева</p>
            <p className="text-xs text-gray-300 mt-1">AI сгенерирует ответ автоматически</p>
          </div>
        ) : (
          <div className="p-4 flex-1 flex flex-col gap-3">
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-800">{selected.authorName}</span>
                <span className="text-xs text-gray-400">· {selected.branchAddress}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{selected.text}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-amber-400 text-xs">
                  {'★'.repeat(selected.rating)}{'☆'.repeat(5 - selected.rating)}
                </span>
                <span className="text-xs text-gray-400">Риск: {selected.aiRiskScore}%</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-400 mb-2">Стиль ответа:</div>
              <div className="flex gap-2">
                {variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantChange(v.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border transition-colors flex-1"
                    style={variant === v.id
                      ? { background: BRAND_TEAL, color: 'white', borderColor: BRAND_TEAL }
                      : { borderColor: '#e5e7eb', color: '#6b7280' }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="text-xs text-gray-400 mb-1.5">Текст ответа:</div>
              <textarea
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                className="flex-1 min-h-32 text-sm text-gray-700 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none"
                style={{ minHeight: '140px' }}
              />
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-lg border transition-colors"
                style={{ borderColor: BRAND_TEAL, color: BRAND_TEAL }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Скопировано!' : 'Копировать текст'}
              </button>
              <button
                onClick={handleSend}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-lg text-white"
                style={{ background: BRAND_TEAL }}
              >
                <Send className="w-4 h-4" />
                Отправить в 2GIS
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
