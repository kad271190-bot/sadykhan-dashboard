'use client'
import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const BRAND_TEAL = '#3A9EA5'
const BRAND_ORANGE = '#F5813F'

const NPS_BY_BRANCH = [
  { name: 'Мамыр-2 (новый)', nps: 72, promoters: 78, neutrals: 16, detractors: 6 },
  { name: 'Аптека №23 (Тараз)', nps: 58, promoters: 70, neutrals: 18, detractors: 12 },
  { name: 'Сейфуллина, 422', nps: 34, promoters: 52, neutrals: 30, detractors: 18 },
  { name: 'Астана, Анет баба', nps: 22, promoters: 45, neutrals: 32, detractors: 23 },
  { name: 'Астана, Момышулы', nps: 18, promoters: 42, neutrals: 34, detractors: 24 },
  { name: 'Аптека №6', nps: 12, promoters: 38, neutrals: 36, detractors: 26 },
  { name: 'Аптека №3', nps: 8, promoters: 35, neutrals: 38, detractors: 27 },
  { name: 'Аптека №2 (Гоголя)', nps: -14, promoters: 22, neutrals: 42, detractors: 36 },
  { name: 'Нурлы тан', nps: -22, promoters: 18, neutrals: 42, detractors: 40 },
  { name: 'Аптека №12 (Достык)', nps: -28, promoters: 16, neutrals: 40, detractors: 44 },
  { name: 'Аптека №9', nps: -44, promoters: 10, neutrals: 36, detractors: 54 },
  { name: 'Аптека №17', nps: -52, promoters: 8, neutrals: 32, detractors: 60 },
  { name: 'Байтерекова, 53', nps: -68, promoters: 5, neutrals: 22, detractors: 73 },
]

const NPS_HISTORY = [
  { month: 'Июн 25', nps: 12 },
  { month: 'Июл 25', nps: 8 },
  { month: 'Авг 25', nps: 4 },
  { month: 'Сен 25', nps: 2 },
  { month: 'Окт 25', nps: -2 },
  { month: 'Ноя 25', nps: -4 },
  { month: 'Дек 25', nps: -4 },
  { month: 'Янв 26', nps: -6 },
  { month: 'Фев 26', nps: -8 },
  { month: 'Мар 26', nps: -6 },
  { month: 'Апр 26', nps: -4 },
  { month: 'Май 26', nps: -3 },
]

function getNPSColor(nps: number) {
  if (nps >= 50) return '#22c55e'
  if (nps >= 30) return BRAND_TEAL
  if (nps >= 0) return '#f59e0b'
  if (nps >= -20) return '#f97316'
  return '#ef4444'
}

function getNPSLabel(nps: number) {
  if (nps >= 50) return 'Отлично'
  if (nps >= 30) return 'Хорошо'
  if (nps >= 0) return 'Удовл.'
  if (nps >= -20) return 'Плохо'
  return 'Критично'
}

export default function NPSReport() {
  const [tab, setTab] = useState<'overview' | 'branches' | 'history'>('overview')

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold" style={{ background: BRAND_TEAL }}>N</div>
          <div>
            <div className="text-sm font-medium text-gray-900">NPS — Индекс лояльности клиентов</div>
            <div className="text-xs text-gray-400">Net Promoter Score · Май 2026</div>
          </div>
          <div className="ml-auto flex gap-2">
            {(['overview', 'branches', 'history'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
                style={tab === t ? { background: BRAND_TEAL, color: 'white', borderColor: BRAND_TEAL } : { borderColor: '#e5e7eb', color: '#6b7280' }}>
                {t === 'overview' ? 'Обзор' : t === 'branches' ? 'Филиалы' : 'История'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="metric-card text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">NPS сети</div>
            <div className="text-3xl font-semibold" style={{ color: getNPSColor(-3) }}>-3</div>
            <div className="text-xs mt-1 font-medium" style={{ color: getNPSColor(-3) }}>Удовл.</div>
          </div>
          <div className="metric-card text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Промоутеры</div>
            <div className="text-3xl font-semibold text-green-600">32%</div>
            <div className="text-xs text-gray-400 mt-1">Оценка 9–10</div>
          </div>
          <div className="metric-card text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Нейтральные</div>
            <div className="text-3xl font-semibold text-amber-500">33%</div>
            <div className="text-xs text-gray-400 mt-1">Оценка 7–8</div>
          </div>
          <div className="metric-card text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Критики</div>
            <div className="text-3xl font-semibold text-red-500">35%</div>
            <div className="text-xs text-gray-400 mt-1">Оценка 0–6</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex rounded-full overflow-hidden h-3">
            <div style={{ width: '32%', background: '#22c55e' }} />
            <div style={{ width: '33%', background: '#f59e0b' }} />
            <div style={{ width: '35%', background: '#ef4444' }} />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>Промоутеры 32%</span>
            <span>Нейтральные 33%</span>
            <span>Критики 35%</span>
          </div>
        </div>
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">Динамика NPS</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={NPS_HISTORY} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [v > 0 ? `+${v}` : v, 'NPS']} />
                <Line type="monotone" dataKey="nps" stroke={BRAND_TEAL} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">AI-рекомендации</div>
            <div className="space-y-2">
              {[
                { dot: 'bg-red-500', text: 'Байтерекова, №17, №9 — NPS ниже −40. Срочный аудит.' },
                { dot: 'bg-orange-500', text: 'Грубость персонала снижает NPS на 20+ пунктов.' },
                { dot: 'bg-amber-500', text: 'Цены выше рынка снижают NPS на 8–12 пунктов.' },
                { dot: 'bg-teal-500', text: 'Мамыр-2 NPS +72 — эталон для сети.' },
                { dot: 'bg-green-500', text: 'Рост ответов до 95% даст +6–8 пунктов NPS.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-2.5 p-2.5 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${item.dot}`} />
                  <div className="text-xs text-gray-600 leading-relaxed">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'branches' && (
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">NPS по филиалам</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-[10px] uppercase text-gray-400 font-medium py-2 px-4">Филиал</th>
                  <th className="text-center text-[10px] uppercase text-gray-400 font-medium py-2 px-3">NPS</th>
                  <th className="text-center text-[10px] uppercase text-gray-400 font-medium py-2 px-3">Промоутеры</th>
                  <th className="text-center text-[10px] uppercase text-gray-400 font-medium py-2 px-3">Нейтральные</th>
                  <th className="text-center text-[10px] uppercase text-gray-400 font-medium py-2 px-3">Критики</th>
                  <th className="text-left text-[10px] uppercase text-gray-400 font-medium py-2 px-3">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {NPS_BY_BRANCH.map((b) => (
                  <tr key={b.name} className="hover:bg-gray-50">
                    <td className="py-2.5 px-4 text-sm font-medium text-gray-800">{b.name}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-sm font-semibold" style={{ color: getNPSColor(b.nps) }}>
                        {b.nps > 0 ? '+' : ''}{b.nps}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-sm text-green-600">{b.promoters}%</td>
                    <td className="py-2.5 px-3 text-center text-sm text-amber-500">{b.neutrals}%</td>
                    <td className="py-2.5 px-3 text-center text-sm text-red-500">{b.detractors}%</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.max(0, (b.nps + 100) / 2)}%`, background: getNPSColor(b.nps) }} />
                        </div>
                        <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: getNPSColor(b.nps) }}>{getNPSLabel(b.nps)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="card p-4">
          <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">NPS по месяцам</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={NPS_HISTORY} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [v > 0 ? `+${v}` : v, 'NPS']} />
              <Bar dataKey="nps" radius={[4, 4, 0, 0]}>
                {NPS_HISTORY.map((entry, i) => (
                  <Cell key={i} fill={getNPSColor(entry.nps)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            <span className="font-medium text-gray-700">Прогноз AI:</span> При устранении топ-3 проблем NPS вырастет до <span className="font-semibold" style={{ color: BRAND_TEAL }}>+15..+25</span> за 3 месяца.
          </div>
        </div>
      )}
    </div>
  )
}
