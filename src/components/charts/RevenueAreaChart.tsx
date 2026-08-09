import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { monthlyRevenue } from '@/data/charts'

function formatCompactCurrency(value: number | string): string {
  const n = typeof value === 'string' ? Number(value) : value
  return `LKR ${(n / 1000).toFixed(0)}K`
}

function formatAxisValue(v: number): string {
  if (v === 0) return '0'
  return `${(v / 1_000_000).toFixed(1)}M`
}

export function RevenueAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={monthlyRevenue} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#64748b', fontSize: 12 }}
          width={44}
          tickFormatter={formatAxisValue}
        />
        <Tooltip content={<ChartTooltip formatter={formatCompactCurrency} />} />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#2563eb"
          strokeWidth={2}
          fill="url(#revenueFill)"
          activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
