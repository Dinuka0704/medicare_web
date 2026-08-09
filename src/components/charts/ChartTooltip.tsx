interface ChartTooltipProps {
  active?: boolean
  label?: string
  payload?: { name: string; value: number | string; color?: string }[]
  formatter?: (value: number | string) => string
}

export function ChartTooltip({ active, label, payload, formatter }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      {label && <p className="mb-1 text-xs font-semibold text-ink">{label}</p>}
      <div className="flex flex-col gap-0.5">
        {payload.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <span className="size-2 rounded-full" style={{ backgroundColor: item.color ?? '#2563eb' }} />
            <span className="text-muted">{item.name}:</span>
            <span className="font-medium text-ink">{formatter ? formatter(item.value) : item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
