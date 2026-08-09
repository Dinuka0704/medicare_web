import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { appointmentsByMonth } from '@/data/charts'

export function AppointmentsByMonthChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={appointmentsByMonth} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={8} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={36} />
        <Tooltip content={<ChartTooltip formatter={(v) => `${v} appointments`} />} />
        <Line
          type="monotone"
          dataKey="count"
          name="Appointments"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
