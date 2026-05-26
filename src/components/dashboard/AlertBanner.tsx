'use client'
import { useState } from 'react'
import { AlertOctagon, X, ChevronDown, ChevronUp } from 'lucide-react'
import { ALERTS } from '@/lib/data'
import { formatRelative } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function AlertBanner() {
  const [expanded, setExpanded] = useState(false)
  const critical = ALERTS.filter((a) => !a.isRead && a.type === 'crisis')
  const warnings = ALERTS.filter((a) => !a.isRead && a.type === 'warning')

  if (critical.length === 0 && warnings.length === 0) return null

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="w-2 h-2 rounded-full bg-red-500 pulse-dot shrink-0" />
        <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
        <div className="flex-1 text-sm text-red-800">
          <span className="font-medium">{critical.length} кризисных · {warnings.length} предупреждений</span>
          <span className="ml-2 text-red-600 text-xs">Требуют немедленного внимания</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-red-500 hover:text-red-700 p-1"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded list */}
      {expanded && (
        <div className="border-t border-red-200 divide-y divide-red-100">
          {[...critical, ...warnings].map((alert) => (
            <div key={alert.id} className="px-4 py-2.5 flex items-start gap-3">
              <div className={cn(
                'w-1.5 h-1.5 rounded-full mt-1.5 shrink-0',
                alert.type === 'crisis' ? 'bg-red-600' : 'bg-amber-500'
              )} />
              <div className="flex-1">
                <div className="text-sm font-medium text-red-900">{alert.title}</div>
                <div className="text-xs text-red-700 mt-0.5">{alert.description}</div>
                <div className="text-[10px] text-red-400 mt-1">{formatRelative(alert.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
