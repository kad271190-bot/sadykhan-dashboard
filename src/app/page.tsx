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
import { METRICS } from '@/lib/data'

const SECTIONS = ['overview', 'reviews', 'branches', 'analytics', 'competitors'] as const
type Section = typeof SECTIONS[number]

export default function DashboardPage() {
  const [section, setSection] = useState<Section>('overview')
  const [search, setSearch] = useState('')

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar active={section} onNav={(s) => setSection(s as Section)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onSearch={setSearch} lastUpdated="25 мая 2026, 14:38" />

        <main className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* OVERVIEW */}
          {section === 'overview' && (
            <>
              <AlertBanner />
              <MetricCards metrics={METRICS} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  <RatingChart />
                  <NegativeChart />
                </div>
                <div className="space-y-4">
                  <AIInsights />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ComplaintsChart />
                <Heatmap />
              </div>
            </>
          )}

          {/* REVIEWS */}
          {section === 'reviews' && (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-medium text-gray-900">Отзывы и ответы</h1>
                <span className="text-xs text-gray-400">Источник: 2GIS · Яндекс Карты</span>
              </div>
              <ReviewsFeed filter={search} />
            </>
          )}

          {/* BRANCHES */}
          {section === 'branches' && (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-medium text-gray-900">Все филиалы</h1>
                <div className="flex gap-2">
                  <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                    Excel
                  </button>
                  <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                    PDF
                  </button>
                </div>
              </div>
              <BranchTable filter={search} />
              <Heatmap />
            </>
          )}

          {/* ANALYTICS */}
          {section === 'analytics' && (
            <>
              <h1 className="text-lg font-medium text-gray-900">Аналитика</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <RatingChart />
                <NegativeChart />
                <ComplaintsChart />
                <Heatmap />
              </div>
            </>
          )}

          {/* COMPETITORS */}
          {section === 'competitors' && (
            <>
              <h1 className="text-lg font-medium text-gray-900">Конкуренты</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CompetitorsPanel />
                <AIInsights />
              </div>
            </>
          )}

          {/* Other sections placeholder */}
          {!SECTIONS.includes(section as Section) && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-2xl mb-2">🚧</div>
                <div className="text-sm text-gray-500">Раздел в разработке</div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
