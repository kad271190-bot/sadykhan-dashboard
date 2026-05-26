'use client'
import { useState } from 'react'
import {
  LayoutDashboard, Star, Building2, AlertTriangle,
  TrendingUp, Settings, ChevronLeft, ChevronRight,
  Users, BarChart3
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

function SadykhanLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="16" stroke="#3A9EA5" strokeWidth="2" fill="white"/>
      <path d="M6 21 Q11 10 17 15 Q21 19 28 12" stroke="#F5813F" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M7 25 Q12 14 18 19 Q22 23 29 16" stroke="#F5813F" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  )
}

interface Props { active: string; onNav: (id: string) => void }

export default function Sidebar({ active, onNav }: Props) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'flex flex-col bg-white border-r border-gray-100 transition-all duration-200 shrink-0',
      collapsed ? 'w-14' : 'w-56'
    )}>
      <div className="flex items-center gap-2.5 px-3 py-4 border-b border-gray-100">
        <div className="shrink-0"><SadykhanLogo /></div>
        {!collapsed && (
          <div>
            <div className="text-base font-semibold leading-tight" style={{ color: '#3A9EA5' }}>
              садыхан
            </div>
            <div className="text-[10px] text-gray-400 leading-tight">Репутация 2GIS</div>
          </div>
        )}
      </div>

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
                isActive ? 'text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              )}
              style={isActive ? { background: '#3A9EA5' } : {}}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="flex-1 text-sm">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium"
                  style={{ background: '#F5813F' }}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="m-2 p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  )
}
