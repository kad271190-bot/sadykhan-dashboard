import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Branch, Review, ComplaintCategory } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-emerald-600'
  if (rating >= 4.0) return 'text-green-600'
  if (rating >= 3.5) return 'text-amber-600'
  if (rating >= 3.0) return 'text-orange-600'
  return 'text-red-600'
}

export function getRatingBg(rating: number): string {
  if (rating >= 4.5) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (rating >= 4.0) return 'bg-green-50 text-green-700 border-green-200'
  if (rating >= 3.5) return 'bg-amber-50 text-amber-700 border-amber-200'
  if (rating >= 3.0) return 'bg-orange-50 text-orange-700 border-orange-200'
  return 'bg-red-50 text-red-800 border-red-200'
}

export function getStatusLabel(status: Branch['status']): string {
  const map = { good: 'Хорошо', warning: 'Нужно внимание', critical: 'Критично', crisis: 'Кризис' }
  return map[status]
}

export function getStatusColor(status: Branch['status']): string {
  const map = {
    good: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    critical: 'bg-red-50 text-red-700 border border-red-200',
    crisis: 'bg-red-900 text-red-100',
  }
  return map[status]
}

export function getSeverityColor(severity: Review['severity']): string {
  const map = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-amber-50 text-amber-700',
    high: 'bg-orange-50 text-orange-700',
    critical: 'bg-red-900 text-red-100',
  }
  return map[severity]
}

export function getSeverityLabel(severity: Review['severity']): string {
  const map = { low: 'Низкий', medium: 'Средний', high: 'Высокий', critical: 'Кризисный' }
  return map[severity]
}

export function getCategoryLabel(cat: ComplaintCategory): string {
  const map: Record<ComplaintCategory, string> = {
    rudeness: 'Грубость', queue: 'Очередь', out_of_stock: 'Нет товара',
    price: 'Цены', expiry: 'Просрочка', consultation: 'Консультация',
    cleanliness: 'Чистота', speed: 'Скорость', delivery: 'Доставка',
    app: 'Приложение', return: 'Возврат', subscription: 'Подписка',
    phone: 'Телефон', schedule: 'Режим работы', other: 'Другое',
  }
  return map[cat]
}

export function getHealthColor(score: number): string {
  if (score >= 75) return 'text-green-600'
  if (score >= 50) return 'text-amber-600'
  if (score >= 30) return 'text-orange-600'
  return 'text-red-600'
}

export function getHealthBg(score: number): string {
  if (score >= 75) return 'bg-green-500'
  if (score >= 50) return 'bg-amber-500'
  if (score >= 30) return 'bg-orange-500'
  return 'bg-red-600'
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'только что'
  if (h < 24) return `${h} ч. назад`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d} дн. назад`
  return formatDate(iso)
}

export function stars(rating: number): string {
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
}
