'use client'
import { useState } from 'react'
import { Send, Copy, Check, Zap } from 'lucide-react'
import { REVIEWS, AI_RESPONSE_TEMPLATES } from '@/lib/data'
import { getCategoryLabel, formatRelative, getSeverityColor, getSeverityLabel } from '@/lib/utils'
import type { Review } from '@/types'

const BRAND_TEAL = '#3A9EA5'

const VARIANT_LABELS = {
  empathetic: 'Эмпатичный',
  official: 'Официальный',
  short: 'Краткий',
}

function getResponse(review: Review, variant: string): string {
  const cat = review.categories[0]
  if (!cat) return 'Здравствуйте! Благодарим за ваш отзыв. Мы обязательно рассмотрим ваше обращение.'
  const templates = AI_RESPONSE_TEMPLATES[cat]
  if (!templates) return 'Здравствуйте! Благодарим за обратную связь. Ваше обращение передано в отдел качества.'
  return (templates as Record<string, string>)[variant] ?? templates['empathetic']
}

export default function ReplyComposer() {
  const [selected, setSelected] = useState<Review | null>(null)
  const [variant, setVariant] = useState('empathetic')
  const [customText, setCustomText] = useState('')
  const [sent, setSent] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unanswered'>('unanswered')

  const reviews = REVIEWS.filter(r =>
    filter === 'all' ? true : !r.hasReply
  ).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

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
    alert('✅ Скопировано! Вставьте ответ в 2GIS Business вручную.')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <span className="text-xs uppercase track
