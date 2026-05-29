'use client'
import { useState } from 'react'
import {
  LayoutDashboard, Star, Building2, AlertTriangle,
  TrendingUp, Settings, ChevronLeft, ChevronRight,
  BarChart3, MessageSquare, ThumbsUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '#overview', icon: LayoutDashboard, label: 'Обзор' },
  { href: '#reviews', icon: Star, label: 'Отзывы' },
  { href: '#replies', icon: MessageSquare, label: 'Ответы', badge: 4 },
  { href: '#branches', icon: Building2, label: 'Филиалы' },
  { href: '#alerts', icon: AlertTriangle, label: 'Алерты', badge: 3 },
  { href: '#analytics', icon: BarChart3, label: 'Аналитика' },
  { href: '#nps', icon: ThumbsUp, label: 'NPS' },
  { href: '#competitors', icon: TrendingUp, label: 'Конкуренты' },
  { href: '#settings', icon: Settings, label: 'Настройки' },
]

function SadykhanLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Бирюзовый незамкнутый круг */}
      <path
        d="M 85 50 A 35 35 0 1 1 72 79"
        stroke="#3A9EA5"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />
      {/* Оранжевая полоса 1 — верхняя */}
      <path
        d="M 28 38 Q 50 22 75 34"
        stroke="#F5813F"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      {/* Оранжевая полоса 2 — средняя */}
      <path
        d="M 24 52 Q 50 36 78 48"
        stroke="#F5813F"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      {/* Оранжевая полоса 3 — нижняя */}
      <path
        d="M 26 66 Q 52 50 76 62"
        stroke="#F5813F"
        strokeWidth="6.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.65"
      />
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
        <div className="shrink-0">
          <SadykhanLogo size={collapsed ? 28 : 36} />
        </div>
        {!collapsed && (
          <div>
            <div className="text-base font-semibold leading-tight" style={{ color: '#3A9EA5' }}>
              садыхан
            </div>
            <div className="text-[10px] text-gray-400 leading-tight">Центр репутации</div>
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
              {!collapsed && (
                <span className="flex-1 text-sm">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium"
                  style={{ background: '#F5813F' }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="m-2 p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  )
}
