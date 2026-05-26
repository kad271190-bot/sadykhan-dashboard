'use client'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { RATING_HISTORY, COMPLAINT_STATS } from '@/lib/data'

export function RatingChart() {
  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">
        Динамика рейтинга сети (12 месяцев)
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={RATING_HISTORY} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
          <YAxis domain={[3.2, 4.0]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} tickFormatter={(v) => v.toFixed(1)} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            formatter={(v: number) => [v.toFixed(2), 'Рейтинг']}
          />
          <Line
            type="monotone" dataKey="rating" stroke="#1a6f4e"
            strokeWidth={2} dot={{ r: 3, fill: '#1a6f4e' }} activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function NegativeChart() {
  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">
        Негативные отзывы по месяцам
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={RATING_HISTORY} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            formatter={(v: number) => [v, 'Негативных']}
          />
          <Bar dataKey="negative" radius={[4, 4, 0, 0]}>
            {RATING_HISTORY.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.negative > 90 ? '#ef4444' : entry.negative > 70 ? '#f59e0b' : '#1a6f4e'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ComplaintsChart() {
  const data = COMPLAINT_STATS.slice(0, 6)
  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">
        Топ категорий жалоб
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
          <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} width={80} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            formatter={(v: number) => [v, 'Жалоб']}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={i === 0 ? '#ef4444' : i <= 2 ? '#f59e0b' : '#1a6f4e'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
