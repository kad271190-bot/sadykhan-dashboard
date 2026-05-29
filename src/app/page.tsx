'use client'
import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Topbar from '@/components/dashboard/Topbar'
import MetricCards from '@/components/dashboard/MetricCards'
import AlertBanner from '@/components/dashboard/AlertBanner'
import { RatingChart, NegativeChart, ComplaintsChart } from '@/components/dashboard/Charts'
import BranchTable from '@/components/dashboard/BranchTable'
import ReviewsFeed from '@/components/dashboard/ReviewsFeed'
import CompetitorsPanel from '@/components/dashboard/CompetitorsPanel'
import AIInsights from '@/components/dashboard/AIInsights'
import Heatmap from '@/components/dashboard/Heatmap'
import NPSReport from '@/components/dashboard/NPSReport'
import ReplyComposer from '@/components/dashboard/ReplyComposer'
import SettingsPage from '@/components/dashboard/SettingsPage'
import PlatformAnalytics from '@/components/dashboard/PlatformAnalytics'
import { METRICS } from '@/lib/data'

const SECTIONS = ['overview','reviews','replies','branches','alerts','analytics','nps','competitors','settings'] as const
type Section = typeof SECTIONS[number]

export default function DashboardPage() {
  const [section, setSection] = useState<Section>('overview')
  const [search, setSearch] = useState('')

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar active={section} onNav={(s) => setSection(s as Section)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onSearch={setSearch} lastUpdated="29 мая 2026, 10:00" />
        <main className="flex-1 overflow-y-auto p-5 space-y-4">

          {section === 'overview' && <>
            <AlertBanner />
            <MetricCards metrics={METRICS} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4"><RatingChart /><NegativeChart /></div>
              <AIInsights />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ComplaintsChart /><Heatmap />
            </div>
          </>}

          {section === 'reviews' && <>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-medium text-gray-900">Отзывы</h1>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border bg-white font-medium" style={{ borderColor: '#27AE60', color: '#27AE60' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: '#27AE60' }}/>2GIS
                </span>
                <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border bg-white font-medium" style={{ borderColor: '#FF3333', color: '#FF3333' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: '#FF3333' }}/>Яндекс
                </span>
              </div>
            </div>
            <ReviewsFeed filter={search} />
          </>}

          {section === 'replies' && <>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-medium text-gray-900">Ответы на отзывы</h1>
              <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
                Скоро: автоотправка в 2GIS и Яндекс
              </span>
            </div>
            <ReplyComposer />
          </>}

          {section === 'branches' && <>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-medium text-gray-900">Все филиалы</h1>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Excel</button>
                <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">PDF</button>
              </div>
            </div>
            <BranchTable filter={search} />
            <Heatmap />
          </>}

          {section === 'alerts' && <>
            <h1 className="text-lg font-medium text-gray-900">Алерты</h1>
            <AlertBanner />
            <AIInsights />
          </>}

          {section === 'analytics' && <>
            <h1 className="text-lg font-medium text-gray-900">Аналитика</h1>
            <PlatformAnalytics />
          </>}

          {section === 'nps' && <>
            <h1 className="text-lg font-medium text-gray-900">NPS — Индекс лояльности</h1>
            <NPSReport />
          </>}

          {section === 'competitors' && <>
            <h1 className="text-lg font-medium text-gray-900">Конкуренты</h1>
            <CompetitorsPanel />
          </>}

          {section === 'settings' && <>
            <h1 className="text-lg font-medium text-gray-900">Настройки</h1>
            <SettingsPage />
          </>}

        </main>
      </div>
    </div>
  )
}
