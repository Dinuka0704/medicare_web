import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { weeklyAppointments } from '@/data/charts'

export function AppointmentsBarChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={weeklyAppointments} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="32%">
        <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#64748b', fontSize: 12 }}
          dy={8}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={36} />
        <Tooltip cursor={{ fill: '#f1f5f9' }} content={<ChartTooltip />} />
        <Bar dataKey="appointments" name="Appointments" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  )
}
