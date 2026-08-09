import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { patientDistribution } from '@/data/charts'

const total = patientDistribution.reduce((sum, d) => sum + d.value, 0)

export function PatientDistributionChart() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <div className="w-full max-w-[200px]">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={patientDistribution}
              dataKey="value"
              nameKey="name"
              innerRadius={56}
              outerRadius={80}
              paddingAngle={3}
              stroke="#fff"
              strokeWidth={2}
            >
              {patientDistribution.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip formatter={(v) => `${v} patients`} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-3">
        {patientDistribution.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2.5">
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm font-medium text-ink w-14">{entry.name}</span>
            <span className="text-sm text-muted">{entry.value}</span>
            <span className="text-xs text-slate-400">({Math.round((entry.value / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}
