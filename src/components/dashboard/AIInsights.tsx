import { Zap, AlertTriangle, TrendingDown, TrendingUp, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const INSIGHTS = [
  {
    type: 'crisis' as const,
    title: 'Байтерекова, 53 — рейтинг 2.3 (258 отзывов)',
    desc: 'Худший филиал в сети. Системный провал качества. Требует немедленного аудита и ротации персонала.',
    action: 'Антикризисный план',
  },
  {
    type: 'crisis' as const,
    title: 'Аптека №17 (2.5) и №9 (2.6) — кризисная зона',
    desc: 'Оба ниже 3.0 — системный сигнал. Рекомендуем внеплановые проверки обоих филиалов на этой неделе.',
    action: 'Назначить проверку',
  },
  {
    type: 'warning' as const,
    title: 'Цены vs Каспи — системная проблема',
    desc: 'Клиенты активно сравнивают цены с Каспи и уходят. Разница 15–20% видна в отзывах нескольких филиалов.',
    action: 'Анализ ценовой политики',
  },
  {
    type: 'warning' as const,
    title: 'Среднее время ответа 8.2 часа',
    desc: 'Цель — 4 часа. Europharma отвечает за 2.1 часа. Это один из ключевых факторов потери рейтинга.',
    action: 'Регламент ответов',
  },
  {
    type: 'info' as const,
    title: 'Аптека на Мамыр-2 — эталон сети (4.8 / 329 отз.)',
    desc: 'Рост +0.4 за месяц. Клиенты хвалят персонал, чистоту, скорость. Использовать как внутренний стандарт.',
    action: 'Изучить практику',
  },
  {
    type: 'positive' as const,
    title: 'Аптека №23 (Тараз) — позитивная динамика',
    desc: 'Вежливый персонал, хорошие консультации. Рейтинг растёт. Лучший пример сервиса в сети для обучения.',
    action: 'Тиражировать опыт',
  },
]

const typeConfig = {
  crisis: { icon: AlertTriangle, color: 'text-red-600', dot: 'bg-red-500', bg: 'bg-red-50' },
  warning: { icon: TrendingDown, color: 'text-amber-600', dot: 'bg-amber-500', bg: 'bg-amber-50' },
  info: { icon: Info, color: 'text-blue-600', dot: 'bg-blue-500', bg: 'bg-blue-50' },
  positive: { icon: TrendingUp, color: 'text-green-600', dot: 'bg-green-500', bg: 'bg-green-50' },
}

export default function AIInsights() {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'var(--accent)' }}>
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--accent)' }}>
          AI-оператор — выводы
        </div>
        <div className="ml-auto text-[10px] px-2 py-0.5 rounded-full border font-medium"
          style={{ color: 'var(--accent)', borderColor: 'var(--accent)', opacity: 0.6 }}>
          Live
        </div>
      </div>

      <div className="space-y-2">
        {INSIGHTS.map((item, i) => {
          const cfg = typeConfig[item.type]
          const Icon = cfg.icon
          return (
            <div key={i} className={cn('flex gap-3 p-3 rounded-lg', cfg.bg)}>
              <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', cfg.dot)} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{item.title}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className="flex-1 text-sm font-medium py-2 rounded-lg text-white transition-colors"
          style={{ background: 'var(--accent)' }}
        >
          Ежедневный отчёт
        </button>
        <button className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          Weekly PDF
        </button>
      </div>
    </div>
  )
}
