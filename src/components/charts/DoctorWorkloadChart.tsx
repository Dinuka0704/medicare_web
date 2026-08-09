import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { doctorWorkload } from '@/data/charts'

export function DoctorWorkloadChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={doctorWorkload} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="32%">
        <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
        <XAxis
          dataKey="doctor"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#64748b', fontSize: 11 }}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={50}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={36} />
        <Tooltip cursor={{ fill: '#f1f5f9' }} content={<ChartTooltip formatter={(v) => `${v} consultations`} />} />
        <Bar dataKey="consultations" name="Consultations" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  )
}
