import { useState } from 'react'
import {
  Users,
  CalendarCheck,
  Award,
  Wallet,
  Building2,
  Download,
  FileBarChart,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DateInput } from '@/components/ui/DateInput'
import { Select } from '@/components/ui/Select'
import { AppointmentsByMonthChart } from '@/components/charts/AppointmentsByMonthChart'
import { RevenueAreaChart } from '@/components/charts/RevenueAreaChart'
import { DepartmentWorkloadChart } from '@/components/charts/DepartmentWorkloadChart'
import { DoctorWorkloadChart } from '@/components/charts/DoctorWorkloadChart'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { departmentNames } from '@/data/departments'

const reportTypes = [
  { key: 'patient', label: 'Patient Report', description: 'Demographics, registrations and visit history', icon: Users, tone: 'primary' as const },
  { key: 'appointment', label: 'Appointment Report', description: 'Booking trends, status breakdown and no-shows', icon: CalendarCheck, tone: 'secondary' as const },
  { key: 'doctor', label: 'Doctor Performance', description: 'Consultations, ratings and workload by doctor', icon: Award, tone: 'warning' as const },
  { key: 'revenue', label: 'Revenue Report', description: 'Income, outstanding balances and payment methods', icon: Wallet, tone: 'success' as const },
  { key: 'department', label: 'Department Report', description: 'Patient volume and utilization by department', icon: Building2, tone: 'danger' as const },
]

const toneClasses = {
  primary: 'bg-primary-50 text-primary-600',
  secondary: 'bg-secondary-50 text-secondary-600',
  success: 'bg-success-50 text-success-600',
  warning: 'bg-warning-50 text-warning-600',
  danger: 'bg-danger-50 text-danger-600',
}

export default function Reports() {
  const { doctors } = useData()
  const toast = useToast()
  const [fromDate, setFromDate] = useState('2026-02-01')
  const [toDate, setToDate] = useState('2026-08-09')
  const [department, setDepartment] = useState('')
  const [doctor, setDoctor] = useState('')
  const [generating, setGenerating] = useState<string | null>(null)

  const handleGenerate = (label: string) => {
    setGenerating(label)
    setTimeout(() => {
      setGenerating(null)
      toast.success(`${label} generated`, 'Your report is ready to view and export.')
    }, 700)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Reports" description="Generate insights across patients, appointments, doctors and revenue." />

      <Card padding="sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <DateInput label="From Date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <DateInput label="To Date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          <Select label="Department" placeholder="All Departments" value={department} onChange={(e) => setDepartment(e.target.value)} options={departmentNames.map((d) => ({ value: d, label: d }))} />
          <Select label="Doctor" placeholder="All Doctors" value={doctor} onChange={(e) => setDoctor(e.target.value)} options={doctors.map((d) => ({ value: d.id, label: d.name }))} />
          <div className="flex items-end">
            <Button fullWidth icon={<FileBarChart className="size-4" />} onClick={() => handleGenerate('Custom Report')}>
              Generate Report
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => (
          <Card key={report.key} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className={`flex size-11 items-center justify-center rounded-lg ${toneClasses[report.tone]}`}>
                <report.icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-ink">{report.label}</p>
              </div>
            </div>
            <p className="text-sm text-muted">{report.description}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-auto self-start"
              loading={generating === report.label}
              icon={<Download className="size-3.5" />}
              onClick={() => handleGenerate(report.label)}
            >
              Generate
            </Button>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Appointments by Month" description="Total appointments booked per month" />
          <AppointmentsByMonthChart />
        </Card>
        <Card>
          <CardHeader title="Revenue by Month" description="Hospital income trend" />
          <RevenueAreaChart />
        </Card>
        <Card>
          <CardHeader title="Patients by Department" description="Active patient volume per department" />
          <DepartmentWorkloadChart />
        </Card>
        <Card>
          <CardHeader title="Doctor Workload" description="Consultations handled per doctor" />
          <DoctorWorkloadChart />
        </Card>
      </div>
    </div>
  )
}
