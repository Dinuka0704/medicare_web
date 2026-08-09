import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { departmentWorkload } from '@/data/charts'

export function DepartmentWorkloadChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={departmentWorkload}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
        barCategoryGap="28%"
      >
        <CartesianGrid horizontal={false} stroke="#e2e8f0" strokeDasharray="3 3" />
        <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="department"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#334155', fontSize: 12 }}
          width={120}
        />
        <Tooltip cursor={{ fill: '#f1f5f9' }} content={<ChartTooltip formatter={(v) => `${v} patients`} />} />
        <Bar dataKey="patients" name="Patients" fill="#0ea5e9" radius={[0, 6, 6, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  )
}
