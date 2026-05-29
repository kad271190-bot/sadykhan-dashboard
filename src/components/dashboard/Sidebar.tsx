'use client'
import { useState } from 'react'
import { LayoutDashboard, Star, Building2, AlertTriangle, TrendingUp, Settings, ChevronLeft, ChevronRight, BarChart3, MessageSquare, ThumbsUp } from 'lucide-react'
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

function DashboardIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="9" fill="#3A9EA5"/>
      <rect x="6" y="22" width="5" height="8" rx="1.5" fill="white" opacity="0.5"/>
      <rect x="14" y="17" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/>
      <rect x="22" y="10" width="5" height="20" rx="1.5" fill="white"/>
      <path d="M8.5 20 L16.5 15 L24.5 8" stroke="#F5813F" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="24.5" cy="8" r="2.5" fill="#F5813F"/>
    </svg>
  )
}

interface Props { active: string; onNav: (id: string) => void }

export default function Sidebar({ active, onNav }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <aside className={cn('flex flex-col bg-white border-r border-gray-100 transition-all duration-200 shrink-0', collapsed ? 'w-14' : 'w-56')}>
      <div className="flex items-center gap-2.5 px-3 py-4 border-b border-gray-100">
        <div className="shrink-0"><DashboardIcon size={collapsed ? 28 : 36} /></div>
        {!collapsed && (
          <div>
            <div className="text-base font-semibold leading-tight" style={{ color: '#3A9EA5' }}>садыхан</div>
            <div className="text-[10px] text-gray-400 leading-tight">Центр репутации</div>
          </div>
        )}
      </div>
      {!collapsed && (
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-100">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border" style={{ borderColor: '#27AE60', color: '#27AE60', background: '#f0fdf4' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#27AE60' }}/>2GIS
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border" style={{ borderColor: '#FF3333', color: '#FF3333', background: '#fff5f5' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#FF3333' }}/>Яндекс
          </span>
        </div>
      )}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon
          const isActive = active === item.href.slice(1)
          return (
            <button key={item.href} onClick={() => onNav(item.href.slice(1))}
              className={cn('w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors text-sm', isActive ? 'text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900')}
              style={isActive ? { background: '#3A9EA5' } : {}}>
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="flex-1 text-sm">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium" style={{ background: '#F5813F' }}>{item.badge}</span>
              )}
            </button>
          )
        })}
      </nav>
      <button onClick={() => setCollapsed(!collapsed)} className="m-2 p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 flex items-center justify-center">
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  )
}
