'use client'
import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'

const TWOGIS_COLOR = '#27AE60'
const YANDEX_COLOR = '#FF3333'
const BRAND_TEAL = '#3A9EA5'

const MONTHLY_DATA = [
  { month: 'Июн 25', twogis: 3.72, yandex: 4.10 },
  { month: 'Июл 25', twogis: 3.68, yandex: 4.08 },
  { month: 'Авг 25', twogis: 3.65, yandex: 4.05 },
  { month: 'Сен 25', twogis: 3.60, yandex: 4.02 },
  { month: 'Окт 25', twogis: 3.55, yandex: 3.98 },
  { month: 'Ноя 25', twogis: 3.52, yandex: 3.95 },
  { month: 'Дек 25', twogis: 3.50, yandex: 3.97 },
  { month: 'Янв 26', twogis: 3.48, yandex: 3.94 },
  { month: 'Фев 26', twogis: 3.45, yandex: 3.92 },
  { month: 'Мар 26', twogis: 3.44, yandex: 3.93 },
  { month: 'Апр 26', twogis: 3.46, yandex: 3.95 },
  { month: 'Май 26', twogis: 3.48, yandex: 3.97 },
]

const BRANCH_COMPARISON = [
  { name: 'Мамыр-2', twogis: 4.8, yandex: 5.0 },
  { name: 'Аптека №23', twogis: 4.4, yandex: 4.6 },
  { name: 'Сейфуллина', twogis: 4.2, yandex: 4.4 },
  { name: 'Анет баба', twogis: 3.9, yandex: 4.1 },
  { name: 'Аптека №6', twogis: 3.6, yandex: 3.8 },
  { name: 'Аптека №2', twogis: 3.4, yandex: 3.5 },
  { name: 'Аптека №12', twogis: 3.4, yandex: 3.6 },
  { name: 'Аптека №9', twogis: 2.6, yandex: 2.9 },
  { name: 'Аптека №17', twogis: 2.5, yandex: 2.7 },
  { name: 'Байтерекова', twogis: 2.3, yandex: 2.5 },
]

const TWOGIS_COMPLAINTS = [
  { label: 'Грубость', count: 312 },
  { label: 'Цены', count: 198 },
  { label: 'Очередь', count: 156 },
  { label: 'Нет товара', count: 134 },
  { label: 'Телефон', count: 98 },
]

const YANDEX_COMPLAINTS = [
  { label: 'Очередь', count: 89 },
  { label: 'Грубость', count: 76 },
  { label: 'Цены', count: 54 },
  { label: 'Режим работы', count: 42 },
  { label: 'Нет товара', count: 38 },
]

type Tab = 'compare' | 'twogis' | 'yandex'

export default function PlatformAnalytics() {
  const [tab, setTab] = useState<Tab>('compare')

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {([
          { id: 'compare', label: 'Общая аналитика' },
          { id: 'twogis', label: '2GIS' },
          { id: 'yandex', label: 'Яндекс Карты' },
        ] as { id: Tab; label: string }[]).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors"
            style={tab === t.id
              ? { background: BRAND_TEAL, color: 'white', borderColor: BRAND_TEAL }
              : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'compare' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Рейтинг 2GIS', value: '3.48', color: TWOGIS_COLOR },
              { label: 'Рейтинг Яндекс', value: '3.97', color: YANDEX_COLOR },
              { label: 'Отзывов 2GIS', value: '3 182', color: TWOGIS_COLOR },
              { label: 'Отзывов Яндекс', value: '1 000', color: YANDEX_COLOR },
            ].map((m) => (
              <div key={m.label} className="metric-card">
                <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">{m.label}</div>
                <div className="text-2xl font-medium" style={{ color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>

          <div className="card p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">
              2GIS vs Яндекс — динамика рейтинга
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MONTHLY_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
                <YAxis domain={[3.0, 4.2]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} tickFormatter={v => v.toFixed(1)} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [v.toFixed(2), '']} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="twogis" name="2GIS" stroke={TWOGIS_COLOR} strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="yandex" name="Яндекс" stroke={YANDEX_COLOR} strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">
              Рейтинг по филиалам — 2GIS vs Яндекс
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left text-[10px] uppercase text-gray-400 font-medium py-2 px-2">Филиал</th>
                    <th className="text-center text-[10px] uppercase font-medium py-2 px-2" style={{ color: TWOGIS_COLOR }}>2GIS</th>
                    <th className="text-center text-[10px] uppercase font-medium py-2 px-2" style={{ color: YANDEX_COLOR }}>Яндекс</th>
                    <th className="text-center text-[10px] uppercase text-gray-400 font-medium py-2 px-2">Разница</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {BRANCH_COMPARISON.map((b) => {
                    const diff = (b.yandex - b.twogis).toFixed(1)
                    return (
                      <tr key={b.name} className="hover:bg-gray-50">
                        <td className="py-2 px-2 text-sm font-medium text-gray-800">{b.name}</td>
                        <td className="py-2 px-2 text-center text-sm font-medium" style={{ color: TWOGIS_COLOR }}>★ {b.twogis}</td>
                        <td className="py-2 px-2 text-center text-sm font-medium" style={{ color: YANDEX_COLOR }}>★ {b.yandex}</td>
                        <td className="py-2 px-2 text-center">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">+{diff}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'twogis' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Рейтинг', value: '3.48', color: '#f59e0b' },
              { label: 'Отзывов', value: '3 182', color: TWOGIS_COLOR },
              { label: 'Негативных', value: '1 063', color: '#dc2626' },
              { label: 'Отвечено', value: '82%', color: TWOGIS_COLOR },
            ].map((m) => (
              <div key={m.label} className="metric-card">
                <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">{m.label}</div>
                <div className="text-2xl font-medium" style={{ color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card p-4">
              <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">Динамика рейтинга 2GIS</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={MONTHLY_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
                  <YAxis domain={[3.2, 4.0]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} tickFormatter={v => v.toFixed(1)} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Line type="monotone" dataKey="twogis" name="2GIS" stroke={TWOGIS_COLOR} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-4">
              <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">Топ жалоб в 2GIS</div>
              <div className="space-y-2">
                {TWOGIS_COMPLAINTS.map((c, i) => (
                  <div key={c.label} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-20">{c.label}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.count / 312 * 100}%`, background: i === 0 ? '#ef4444' : TWOGIS_COLOR }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8 text-right">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">Рейтинг по филиалам в 2GIS</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={BRANCH_COMPARISON} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} width={80} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [`★ ${v}`, '2GIS']} />
                <Bar dataKey="twogis" radius={[0, 4, 4, 0]}>
                  {BRANCH_COMPARISON.map((b, i) => (
                    <Cell key={i} fill={b.twogis >= 4 ? TWOGIS_COLOR : b.twogis >= 3.5 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === 'yandex' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Рейтинг', value: '3.97', color: '#f59e0b' },
              { label: 'Отзывов', value: '1 000', color: YANDEX_COLOR },
              { label: 'Негативных', value: '298', color: '#dc2626' },
              { label: 'Отвечено', value: '71%', color: YANDEX_COLOR },
            ].map((m) => (
              <div key={m.label} className="metric-card">
                <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">{m.label}</div>
                <div className="text-2xl font-medium" style={{ color: m.color }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card p-4">
              <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">Динамика рейтинга Яндекс</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={MONTHLY_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
                  <YAxis domain={[3.6, 4.4]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} tickFormatter={v => v.toFixed(1)} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Line type="monotone" dataKey="yandex" name="Яндекс" stroke={YANDEX_COLOR} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-4">
              <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">Топ жалоб в Яндекс.Картах</div>
              <div className="space-y-2">
                {YANDEX_COMPLAINTS.map((c, i) => (
                  <div key={c.label} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-24">{c.label}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.count / 89 * 100}%`, background: i === 0 ? '#ef4444' : YANDEX_COLOR }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8 text-right">{c.count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-lg text-xs text-amber-700 bg-amber-50 border border-amber-100">
                Среднее время ответа на Яндексе: <strong>14.5 часов</strong> — цель: до 4 часов
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">Рейтинг по филиалам в Яндекс.Картах</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={BRANCH_COMPARISON} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} width={80} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [`★ ${v}`, 'Яндекс']} />
                <Bar dataKey="yandex" radius={[0, 4, 4, 0]}>
                  {BRANCH_COMPARISON.map((b, i) => (
                    <Cell key={i} fill={b.yandex >= 4 ? YANDEX_COLOR : b.yandex >= 3.5 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
