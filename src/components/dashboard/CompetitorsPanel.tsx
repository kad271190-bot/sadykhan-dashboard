import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { COMPETITORS } from '@/lib/data'
import { getRatingBg, cn } from '@/lib/utils'

export default function CompetitorsPanel() {
  const ourRating = 3.48

  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">
        Сравнение с конкурентами (2GIS Алматы)
      </div>

      {/* Our position */}
      <div className="flex items-center gap-3 p-3 rounded-lg mb-3 border-2"
        style={{ background: 'var(--accent-light)', borderColor: 'var(--accent)' }}>
        <div className="flex-1">
          <div className="text-sm font-medium" style={{ color: 'var(--accent)' }}>SADYKHAN (наша сеть)</div>
          <div className="text-xs text-gray-500 mt-0.5">56 фил. Алматы · 7 Астана</div>
        </div>
        <span className="text-lg font-medium" style={{ color: 'var(--accent)' }}>
          ★ {ourRating.toFixed(2)}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: 'var(--accent)', color: 'white' }}>МЫ</span>
      </div>

      <div className="space-y-2">
        {COMPETITORS.map((comp) => {
          const isAbove = comp.rating > ourRating
          return (
            <div key={comp.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800">{comp.name}</div>
                <div className="text-xs text-gray-400 mt-0.5 truncate">
                  ✓ {comp.topStrength}
                </div>
              </div>
              <span className={cn('text-sm font-medium', isAbove ? 'text-red-600' : 'text-green-600')}>
                ★ {comp.rating.toFixed(2)}
              </span>
              <div className={cn(
                'flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full font-medium',
                isAbove ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
              )}>
                {isAbove
                  ? <><TrendingUp className="w-3 h-3" />{`+${comp.delta.toFixed(2)}`}</>
                  : <><TrendingDown className="w-3 h-3" />{comp.delta.toFixed(2)}</>
                }
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
        <div className="text-xs font-medium text-amber-800 mb-1">Почему Europharma выше на 0.27?</div>
        <ul className="text-xs text-amber-700 space-y-1">
          <li>• В 3× меньше жалоб на грубость персонала</li>
          <li>• Время ответа 2.1ч (у нас 8.2ч)</li>
          <li>• 94% отвеченных отзывов (у нас 82%)</li>
          <li>• Электронная очередь — ноль жалоб на ожидание</li>
        </ul>
      </div>
    </div>
  )
}
