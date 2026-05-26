import { TrendingUp, TrendingDown, Star, MessageSquare, AlertCircle, Clock, Zap, CheckCircle } from 'lucide-react'
import type { DashboardMetrics } from '@/types'
import { cn } from '@/lib/utils'

interface Props { metrics: DashboardMetrics }

export default function MetricCards({ metrics }: Props) {
  const cards = [
    {
      label: 'Ср. рейтинг сети',
      value: metrics.avgRating.toFixed(2),
      delta: metrics.avgRatingDelta,
      deltaLabel: 'vs прошлый мес.',
      icon: Star,
      color: metrics.avgRating >= 4 ? 'text-green-600' : metrics.avgRating >= 3.5 ? 'text-amber-600' : 'text-red-600',
    },
    {
      label: 'Всего отзывов',
      value: metrics.totalReviews.toLocaleString('ru'),
      delta: metrics.totalReviewsDelta,
      deltaLabel: 'за месяц',
      icon: MessageSquare,
      color: 'text-blue-600',
    },
    {
      label: 'Негативных',
      value: `${metrics.negativeCount}`,
      delta: null,
      deltaLabel: `${metrics.negativePercent.toFixed(1)}% от всех`,
      icon: AlertCircle,
      color: 'text-red-600',
    },
    {
      label: 'Без ответа',
      value: `${metrics.unansweredCount}`,
      delta: null,
      deltaLabel: `${(100 - metrics.answeredPercent).toFixed(0)}% не отвечено`,
      icon: Clock,
      color: 'text-orange-600',
    },
    {
      label: 'Ср. время ответа',
      value: `${metrics.avgResponseHours.toFixed(1)} ч`,
      delta: null,
      deltaLabel: 'Цель: < 4 ч',
      icon: Clock,
      color: metrics.avgResponseHours <= 4 ? 'text-green-600' : 'text-amber-600',
    },
    {
      label: 'AI Health Score',
      value: `${metrics.healthScore}/100`,
      delta: metrics.healthScoreDelta,
      deltaLabel: 'за неделю',
      icon: Zap,
      color: metrics.healthScore >= 70 ? 'text-green-600' : metrics.healthScore >= 50 ? 'text-amber-600' : 'text-red-600',
    },
    {
      label: 'Отвечено %',
      value: `${metrics.answeredPercent}%`,
      delta: 3,
      deltaLabel: 'vs прошлый мес.',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      label: 'Активных жалоб',
      value: `${metrics.activeComplaints}`,
      delta: null,
      deltaLabel: '4 кризисных',
      icon: AlertCircle,
      color: 'text-red-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon
        const isPositiveDelta = (card.delta ?? 0) > 0
        const isNegativeDelta = (card.delta ?? 0) < 0
        return (
          <div key={card.label} className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                {card.label}
              </span>
              <Icon className={cn('w-3.5 h-3.5', card.color)} />
            </div>
            <div className={cn('text-2xl font-500 leading-none mb-1', card.color)}>
              {card.value}
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              {card.delta !== null && card.delta !== 0 && (
                isPositiveDelta
                  ? <TrendingUp className="w-3 h-3 text-green-500" />
                  : <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={cn(
                'text-gray-400',
                card.delta !== null && isPositiveDelta && 'text-green-600',
                card.delta !== null && isNegativeDelta && 'text-red-500',
              )}>
                {card.delta !== null && card.delta !== 0 && (isPositiveDelta ? '+' : '')}
                {card.delta !== null && card.delta !== 0 && card.delta}{' '}
                {card.deltaLabel}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
