'use client'
import { useState } from 'react'
import { Bell, RefreshCw, Search, AlertOctagon } from 'lucide-react'
import { ALERTS } from '@/lib/data'

interface Props {
  onSearch: (q: string) => void
  lastUpdated: string
}

export default function Topbar({ onSearch, lastUpdated }: Props) {
  const [refreshing, setRefreshing] = useState(false)
  const unread = ALERTS.filter((a) => !a.isRead).length

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1800)
  }

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center gap-3 px-5 shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 max-w-xs bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
        <Search className="w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Поиск по отзывам, филиалам..."
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex-1" />

      {/* Last update */}
      <span className="text-xs text-gray-400 hidden md:block">
        Обновлено: {lastUpdated}
      </span>

      {/* Refresh */}
      <button
        onClick={handleRefresh}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
        <span className="hidden md:block">Обновить</span>
      </button>

      {/* Alerts bell */}
      {unread > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-dot" />
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>{unread} критических</span>
        </div>
      )}

      <button className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700">
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        )}
      </button>

      {/* Avatar */}
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0"
        style={{ background: 'var(--accent)' }}>
        АД
      </div>
    </header>
  )
}
