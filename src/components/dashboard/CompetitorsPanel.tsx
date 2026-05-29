import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const OUR_RATING = 3.48
const BRAND_TEAL = '#3A9EA5'

const COMPETITORS = [
  {
    name: 'Europharma',
    rating: 4.51,
    reviews: 5200,
    city: 'Алматы / Астана',
    topStrength: 'Скорость, наличие товара, электронная очередь',
    real: true,
  },
  {
    name: 'Рауза',
    rating: 4.20,
    reviews: 2800,
    city: 'Алматы',
    topStrength: 'Широкий ассортимент, доступные цены',
    real: true,
  },
  {
    name: 'Зерде',
    rating: 4.15,
    reviews: 1900,
    city: 'Алматы / Астана',
    topStrength: 'Цены, удобное расположение',
    real: true,
  },
  {
    name: 'Биосфера',
    rating: 4.08,
    reviews: 1600,
    city: 'Алматы',
    topStrength: 'Натуральные товары, консультации',
    real: true,
  },
  {
    name: 'Планета Здоровья',
    rating: 4.30,
    reviews: 3100,
    city: 'Алматы',
    topStrength: 'Ассортимент, бонусная программа',
    real: false,
  },
  {
    name: 'Ромашка Аптека',
    rating: 4.18,
    reviews: 1800,
    city: 'Алматы',
    topStrength: 'Низкие цены',
    real: false,
  },
  {
    name: 'Аптека 36.6',
    rating: 4.05,
    reviews: 2200,
    city: 'Алматы',
    topStrength: 'Узнаваемый бренд',
    real: false,
  },
  {
    name: 'Ваша Аптека',
    rating: 3.92,
    reviews: 900,
    city: 'Алматы',
    topStrength: 'Расположение рядом с домом',
    real: false,
  },
]

const WHY_EUROPHARMA = [
  'В 3× меньше жалоб на грубость персонала (31 vs 312)',
  'Время ответа 2.1ч — у нас 8.2ч',
  '94% отвеченных отзывов — у нас 82%',
  'Электронная очередь — ноль жалоб на ожидание',
  'Цены сопоставимы с Каспи — нет оттока клиентов',
]

export default function CompetitorsPanel() {
  return (
    <div className="space-y-4">
      {/* Our position */}
      <div className="card p-4">
        <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">
          Сравнение с конкурентами — 2GIS Алматы / Астана
        </div>

        {/* Sadykhan */}
        <div className="flex items-center gap-3 p-3 rounded-xl mb-3 border-2"
          style={{ background: '#E8F6F7', borderColor: BRAND_TEAL }}>
          <div className="flex-1">
            <div className="text-sm font-semibold" style={{ color: BRAND_TEAL }}>садыхан (наша сеть)</div>
            <div className="text-xs text-gray-500 mt-0.5">56 фил. Алматы · 7 Астана · Тараз</div>
          </div>
          <span className="text-lg font-semibold" style={{ color: BRAND_TEAL }}>★ {OUR_RATING}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium text-white" style={{ background: BRAND_TEAL }}>МЫ</span>
        </div>

        {/* Competitors */}
        <div className="space-y-2">
          {COMPETITORS.map((comp) => {
            const delta = (comp.rating - OUR_RATING).toFixed(2)
            const isAbove = comp.rating > OUR_RATING
            return (
              <div key={comp.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-800">{comp.name}</div>
                    {comp.real && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 font-medium">
                        реальный
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 truncate">{comp.city} · {comp.reviews.toLocaleString('ru')} отз.</div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">✓ {comp.topStrength}</div>
                </div>
                <span className={cn('text-sm font-medium', isAbove ? 'text-red-600' : 'text-green-600')}>
                  ★ {comp.rating.toFixed(2)}
                </span>
                <div className={cn(
                  'flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full font-medium',
                  isAbove ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                )}>
                  {isAbove
                    ? <><TrendingUp className="w-3 h-3" />+{delta}</>
                    : <><TrendingDown className="w-3 h-3" />{delta}</>
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Why Europharma is higher */}
      <div className="card p-4">
        <div className="text-xs font-medium text-amber-800 mb-3 uppercase tracking-wider">
          Почему Europharma выше на +1.03?
        </div>
        <ul className="space-y-2">
          {WHY_EUROPHARMA.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-xs text-gray-600 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Rauza specific */}
      <div className="card p-4">
        <div className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ color: BRAND_TEAL }}>
          Рауза, Зерде, Биосфера — ключевые угрозы
        </div>
        <div className="space-y-3">
          {[
            { name: 'Рауза (4.20)', text: 'Ближайший конкурент в Алматы. Клиенты хвалят ассортимент и цены — два главных минуса садыхан.' },
            { name: 'Зерде (4.15)', text: 'Активно открывает новые точки. Рейтинг растёт. Делают ставку на доступность и цены.' },
            { name: 'Биосфера (4.08)', text: 'Нишевый конкурент — натуральные товары и консультации. Лояльная аудитория.' },
          ].map((item) => (
            <div key={item.name} className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-medium text-gray-800 mb-1">{item.name}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{item.text}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-lg text-xs text-gray-500 bg-amber-50 border border-amber-100">
          Данные конкурентов — на основе открытых данных 2GIS и Яндекс.Карт. Для точных данных подключите API.
        </div>
      </div>
    </div>
  )
}
