'use client'

import type { UmamiPageview } from '@/lib/umami'

interface PageviewsChartProps {
  pageviews: UmamiPageview[]
  sessions: UmamiPageview[]
}

export function PageviewsChart({ pageviews, sessions }: PageviewsChartProps) {
  if (!pageviews || pageviews.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Pageviews & Sessions Over Time</h3>
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    )
  }

  const allValues = [...pageviews.map(p => p.y), ...sessions.map(s => s.y)]
  const maxVal = Math.max(...allValues, 1)
  const chartHeight = 120

  function toPath(data: UmamiPageview[], width: number): string {
    if (data.length === 0) return ''
    const step = width / (data.length - 1 || 1)
    return data.map((d, i) => {
      const x = i * step
      const y = chartHeight - (d.y / maxVal) * chartHeight
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ')
  }

  const svgWidth = 600

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Pageviews & Sessions — Last 30 Days</h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-4 rounded-full bg-primary" /> Pageviews
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-4 rounded-full bg-primary/40" /> Sessions
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${chartHeight + 20}`}
          className="w-full"
          style={{ minWidth: 300 }}
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
            <line
              key={i}
              x1={0} y1={(chartHeight * t).toFixed(1)}
              x2={svgWidth} y2={(chartHeight * t).toFixed(1)}
              stroke="currentColor" strokeOpacity={0.08} strokeWidth={1}
            />
          ))}

          {/* Sessions area */}
          <path
            d={`${toPath(sessions, svgWidth)} L ${svgWidth} ${chartHeight} L 0 ${chartHeight} Z`}
            fill="hsl(var(--primary))" fillOpacity={0.1}
          />
          <path d={toPath(sessions, svgWidth)} fill="none" stroke="hsl(var(--primary))" strokeOpacity={0.4} strokeWidth={1.5} />

          {/* Pageviews area */}
          <path
            d={`${toPath(pageviews, svgWidth)} L ${svgWidth} ${chartHeight} L 0 ${chartHeight} Z`}
            fill="hsl(var(--primary))" fillOpacity={0.2}
          />
          <path d={toPath(pageviews, svgWidth)} fill="none" stroke="hsl(var(--primary))" strokeWidth={2} />
        </svg>
      </div>

      {/* X-axis labels — first, middle, last */}
      {pageviews.length > 0 && (
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>{new Date(pageviews[0].x).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
          <span>{new Date(pageviews[Math.floor(pageviews.length / 2)].x).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
          <span>{new Date(pageviews[pageviews.length - 1].x).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
        </div>
      )}
    </div>
  )
}
