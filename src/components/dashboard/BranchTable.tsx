'use client'
import { useState } from 'react'
import { ChevronUp, ChevronDown, ExternalLink } from 'lucide-react'
import { BRANCHES } from '@/lib/data'
import {
  getRatingBg, getStatusLabel, getStatusColor,
  getHealthBg, getHealthColor, cn
} from '@/lib/utils'
import type { Branch } from '@/types'

type SortKey = 'rating' | 'reviewCount' | 'healthScore' | 'negativeCount'

interface Props { filter?: string }

export default function BranchTable({ filter = '' }: Props) {
  const [sort, setSort] = useState<SortKey>('healthScore')
  const [dir, setDir] = useState<'asc' | 'desc'>('asc')
  const [cityFilter, setCityFilter] = useState('Все')

  const toggleSort = (key: SortKey) => {
    if (sort === key) setDir(dir === 'asc' ? 'desc' : 'asc')
    else { setSort(key); setDir('asc') }
  }

  const cities = ['Все', ...Array.from(new Set(BRANCHES.map((b) => b.city)))]

  const sorted = [...BRANCHES]
    .filter((b) => {
      const q = filter.toLowerCase()
      const matchQ = !q || b.name.toLowerCase().includes(q) || b.address.toLowerCase().includes(q)
      const matchCity = cityFilter === 'Все' || b.city === cityFilter
      return matchQ && matchCity
    })
    .sort((a, b) => {
      const mul = dir === 'asc' ? 1 : -1
      return (a[sort] - b[sort]) * mul
    })

  const SortIcon = ({ k }: { k: SortKey }) =>
    sort === k
      ? dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3 opacity-30" />

  const Th = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-medium py-2 px-3 cursor-pointer hover:text-gray-600 select-none"
      onClick={() => toggleSort(k)}
    >
      <span className="flex items-center gap-1">{label}<SortIcon k={k} /></span>
    </th>
  )

  return (
    <div className="card overflow-hidden">
      {/* Filters */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">Филиалы</div>
        <div className="flex-1" />
        {cities.map((c) => (
          <button
            key={c}
            onClick={() => setCityFilter(c)}
            className={cn(
              'text-xs px-3 py-1 rounded-full border transition-colors',
              cityFilter === c
                ? 'text-white border-transparent'
                : 'text-gray-500 border-gray-200 hover:border-gray-300'
            )}
            style={cityFilter === c ? { background: 'var(--accent)' } : {}}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-medium py-2 px-3">Филиал / Адрес</th>
              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-medium py-2 px-3">Город</th>
              <Th label="Рейтинг" k="rating" />
              <Th label="Отзывов" k="reviewCount" />
              <Th label="Негативных" k="negativeCount" />
              <Th label="Health Score" k="healthScore" />
              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-medium py-2 px-3">Статус</th>
              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-medium py-2 px-3">Топ-проблема</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((b: Branch) => (
              <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-2.5 px-3">
                  <div className="font-medium text-gray-900 text-sm">{b.name}</div>
                  <div className="text-xs text-gray-400">{b.address}</div>
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{b.city}</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', getRatingBg(b.rating))}>
                    ★ {b.rating.toFixed(1)}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-sm text-gray-700">{b.reviewCount.toLocaleString('ru')}</td>
                <td className="py-2.5 px-3">
                  <span className="text-sm text-red-600 font-medium">{b.negativeCount}</span>
                  <span className="text-xs text-gray-400 ml-1">
                    ({Math.round(b.negativeCount / b.reviewCount * 100)}%)
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${b.healthScore}%`, background: b.healthScore >= 70 ? '#22c55e' : b.healthScore >= 40 ? '#f59e0b' : '#ef4444' }}
                      />
                    </div>
                    <span className={cn('text-xs font-medium', getHealthColor(b.healthScore))}>
                      {b.healthScore}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', getStatusColor(b.status))}>
                    {getStatusLabel(b.status)}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-xs text-gray-500">{b.topIssue || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 border-t border-gray-100 text-xs text-gray-400">
        {sorted.length} из {BRANCHES.length} филиалов · Источник: 2GIS (май 2026)
      </div>
    </div>
  )
}
