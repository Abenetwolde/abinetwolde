import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  icon: ReactNode
  previous?: number
  format?: 'number' | 'time' | 'percent'
  color?: string
}

function formatValue(value: number, format: StatCardProps['format']) {
  if (format === 'time') {
    const mins = Math.floor(value / 60)
    const secs = value % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }
  if (format === 'percent') return `${value.toFixed(1)}%`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toLocaleString()
}

export function StatCard({ label, value, icon, previous, format = 'number', color = 'text-primary' }: StatCardProps) {
  const numValue = typeof value === 'number' ? value : 0
  const displayValue = typeof value === 'string' ? value : formatValue(numValue, format)

  let changePercent: number | null = null
  if (previous !== undefined && previous > 0) {
    changePercent = ((numValue - previous) / previous) * 100
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className={`${color}`}>{icon}</span>
      </div>
      <p className="text-3xl font-bold text-foreground">{displayValue}</p>
      {changePercent !== null && (
        <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${
          changePercent > 0 ? 'text-emerald-500' : changePercent < 0 ? 'text-red-500' : 'text-muted-foreground'
        }`}>
          {changePercent > 0 ? <TrendingUp className="h-3.5 w-3.5" /> :
           changePercent < 0 ? <TrendingDown className="h-3.5 w-3.5" /> :
           <Minus className="h-3.5 w-3.5" />}
          {Math.abs(changePercent).toFixed(1)}% vs prev 30d
        </div>
      )}
    </div>
  )
}
