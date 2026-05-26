'use client'
import { useState } from 'react'
import {
  LayoutDashboard, Star, Building2, AlertTriangle,
  TrendingUp, Bell, Settings, ChevronLeft, ChevronRight,
  Activity, Users, BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '#overview', icon: LayoutDashboard, label: 'Обзор' },
  { href: '#reviews', icon: Star, label: 'Отзывы' },
  { href: '#branches', icon: Building2, label: 'Филиалы' },
  { href: '#alerts', icon: AlertTriangle, label: 'Алерты', badge: 3 },
  { href: '#analytics', icon: BarChart3, label: 'Аналитика' },
  { href: '#competitors', icon: TrendingUp, label: 'Конкуренты' },
  { href: '#team', icon: Users, label: 'Команда' },
  { href: '#settings', icon: Settings, label: 'Настройки' },
]

interface Props { active: string; onNav: (id: string) => void }

export default function Sidebar({ active, onNav }: Props) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'flex flex-col bg-white border-r border-gray-100 transition-all duration-200 shrink-0',
      collapsed ? 'w-14' : 'w-56'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-4 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'var(--accent)' }}>
          <Activity className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-sm font-600 text-gray-900 leading-tight">Садыхан</div>
            <div className="text-[10px] text-gray-400 leading-tight">Управление репутацией</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon
          const isActive = active === item.href.slice(1)
          return (
            <button
              key={item.href}
              onClick={() => onNav(item.href.slice(1))}
              className={cn(
                'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors text-sm',
                isActive
                  ? 'text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              )}
              style={isActive ? { background: 'var(--accent)' } : {}}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && (
                <span className="flex-1 text-sm">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white font-medium">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="m-2 p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  )
}
