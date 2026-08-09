import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Save, KeyRound, User as UserIcon, Sun, Moon, Monitor } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { cn } from '@/utils/cn'

const tabs: TabItem[] = [
  { value: 'general', label: 'General' },
  { value: 'hospital', label: 'Hospital Information' },
  { value: 'profile', label: 'Profile' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'security', label: 'Security' },
  { value: 'appearance', label: 'Appearance' },
]

const appearanceOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export default function Settings() {
  const { user } = useAuth()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('general')

  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('Asia/Colombo')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY')
  const [currency, setCurrency] = useState('LKR')

  const [hospitalName, setHospitalName] = useState('Medicare Hospital')
  const [address, setAddress] = useState('No. 45, Hospital Road, Colombo 05, Sri Lanka')
  const [phone, setPhone] = useState('+94 11 234 5678')
  const [email, setEmail] = useState('info@medicare.lk')
  const [regNumber, setRegNumber] = useState('MOH/PVT/2014/00458')
  const [openingHours, setOpeningHours] = useState('OPD: 8:00 AM – 8:00 PM · Emergency: 24 Hours')

  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifySms, setNotifySms] = useState(false)
  const [notifyPush, setNotifyPush] = useState(true)
  const [notifyAppointments, setNotifyAppointments] = useState(true)
  const [notifyPayments, setNotifyPayments] = useState(true)
  const [notifyReports, setNotifyReports] = useState(false)

  const [appearance, setAppearance] = useState('light')

  const saveToast = (section: string) => toast.success('Settings saved', `${section} settings have been updated.`)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Configure system preferences and hospital information." />

      <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

      {activeTab === 'general' && (
        <Card className="max-w-2xl">
          <CardHeader title="General Preferences" description="Regional and display preferences for the system" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Language" value={language} onChange={(e) => setLanguage(e.target.value)} options={[{ value: 'en', label: 'English' }, { value: 'si', label: 'Sinhala' }, { value: 'ta', label: 'Tamil' }]} />
            <Select label="Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} options={[{ value: 'Asia/Colombo', label: 'Asia/Colombo (GMT+5:30)' }]} />
            <Select label="Date Format" value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} options={[{ value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' }, { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' }, { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }]} />
            <Select label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} options={[{ value: 'LKR', label: 'LKR — Sri Lankan Rupee' }, { value: 'USD', label: 'USD — US Dollar' }]} />
          </div>
          <Button className="mt-5" icon={<Save className="size-4" />} onClick={() => saveToast('General')}>
            Save Changes
          </Button>
        </Card>
      )}

      {activeTab === 'hospital' && (
        <Card className="max-w-2xl">
          <CardHeader title="Hospital Information" description="Details shown on invoices, prescriptions and reports" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input label="Hospital Name" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Textarea label="Address" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Registration Number" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} />
            <Input label="Opening Hours" value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} />
          </div>
          <Button className="mt-5" icon={<Save className="size-4" />} onClick={() => saveToast('Hospital information')}>
            Save Changes
          </Button>
        </Card>
      )}

      {activeTab === 'profile' && (
        <Card className="max-w-2xl">
          <CardHeader title="Profile" description="Your personal account information" />
          <div className="flex items-center gap-4">
            <Avatar src={user?.avatar} name={user?.name ?? ''} size="lg" />
            <div>
              <p className="font-semibold text-ink">{user?.name}</p>
              <p className="text-sm text-muted capitalize">{user?.role} · {user?.department}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Full Name" value={user?.name ?? ''} disabled />
            <Input label="Email" value={user?.email ?? ''} disabled />
            <Input label="Phone" value={user?.phone ?? ''} disabled />
            <Input label="Department" value={user?.department ?? ''} disabled />
          </div>
          <Link to="/profile" className="mt-5 inline-block">
            <Button variant="outline" icon={<UserIcon className="size-4" />}>
              Go to Full Profile
            </Button>
          </Link>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card className="max-w-2xl">
          <CardHeader title="Notification Preferences" description="Choose how you want to be notified" />
          <div className="flex flex-col gap-4">
            <Switch checked={notifyEmail} onChange={setNotifyEmail} label="Email Notifications" description="Receive updates via email" />
            <Switch checked={notifySms} onChange={setNotifySms} label="SMS Notifications" description="Receive updates via text message" />
            <Switch checked={notifyPush} onChange={setNotifyPush} label="Push Notifications" description="Receive in-app push notifications" />
          </div>
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="mb-3 text-sm font-medium text-ink">Notify me about</p>
            <div className="flex flex-col gap-4">
              <Switch checked={notifyAppointments} onChange={setNotifyAppointments} label="Appointments" description="New bookings, cancellations and reminders" />
              <Switch checked={notifyPayments} onChange={setNotifyPayments} label="Payments" description="Invoice and payment activity" />
              <Switch checked={notifyReports} onChange={setNotifyReports} label="Reports" description="New medical reports and lab results" />
            </div>
          </div>
          <Button className="mt-5" icon={<Save className="size-4" />} onClick={() => saveToast('Notification')}>
            Save Preferences
          </Button>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card className="max-w-2xl">
          <CardHeader title="Change Password" description="Update your account password" />
          <div className="flex flex-col gap-4">
            <Input label="Current Password" type="password" placeholder="Enter current password" />
            <Input label="New Password" type="password" placeholder="Enter new password" />
            <Input label="Confirm New Password" type="password" placeholder="Re-enter new password" />
          </div>
          <Button className="mt-5" icon={<KeyRound className="size-4" />} onClick={() => saveToast('Security')}>
            Update Password
          </Button>
        </Card>
      )}

      {activeTab === 'appearance' && (
        <Card className="max-w-2xl">
          <CardHeader title="Appearance" description="Customize how Medicare looks for you" />
          <div className="grid grid-cols-3 gap-3">
            {appearanceOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAppearance(opt.value)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border px-4 py-5 transition-colors',
                  appearance === opt.value ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-200 text-muted hover:border-slate-300',
                )}
              >
                <opt.icon className="size-5" />
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
          <Button className="mt-5" icon={<Save className="size-4" />} onClick={() => saveToast('Appearance')}>
            Save Preference
          </Button>
        </Card>
      )}
    </div>
  )
}
