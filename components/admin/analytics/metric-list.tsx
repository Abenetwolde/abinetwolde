import type { UmamiMetric } from '@/lib/umami'

interface MetricListProps {
  title: string
  data: UmamiMetric[] | null
  emptyText?: string
  valueLabel?: string
}

export function MetricList({ title, data, emptyText = 'No data', valueLabel = 'Visits' }: MetricListProps) {
  const max = data && data.length > 0 ? Math.max(...data.map(d => d.y)) : 1

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      {!data || data.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {data.map((item, i) => (
            <div key={i}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="max-w-[70%] truncate font-medium text-foreground" title={item.x}>
                  {item.x || '(direct)'}
                </span>
                <span className="text-muted-foreground">{item.y.toLocaleString()}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(item.y / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
