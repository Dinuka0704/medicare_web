import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Camera, Save, KeyRound, Mail, Phone, Building2, ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

interface ProfileFormValues {
  name: string
  email: string
  phone: string
  department: string
  designation: string
}

interface PasswordFormValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const toast = useToast()
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      department: user?.department ?? '',
      designation: user?.designation ?? '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({ defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' } })

  const newPassword = watch('newPassword')

  const onProfileSubmit = (values: ProfileFormValues) => {
    setSavingProfile(true)
    setTimeout(() => {
      updateProfile(values)
      setSavingProfile(false)
      toast.success('Profile updated', 'Your profile information has been saved.')
    }, 400)
  }

  const onPasswordSubmit = () => {
    setSavingPassword(true)
    setTimeout(() => {
      setSavingPassword(false)
      resetPassword()
      toast.success('Password updated', 'Your password has been changed successfully.')
    }, 400)
  }

  if (!user) return null

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Profile" description="Manage your personal account information and security." />

      <Card>
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="relative">
            <Avatar src={user.avatar} name={user.name} size="xl" />
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-primary-600 text-white shadow-sm hover:bg-primary-700"
              aria-label="Change profile picture"
              onClick={() => toast.info('Photo upload', 'Photo upload is simulated in this demo.')}
            >
              <Camera className="size-3.5" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">{user.name}</h2>
            <Badge variant="primary" className="mt-1 capitalize">
              {user.role}
            </Badge>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-muted sm:justify-start">
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5" /> {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="size-3.5" /> {user.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="size-3.5" /> {user.department}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Edit Profile" description="Update your personal information" />
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} noValidate className="flex flex-col gap-4">
            <Input label="Full Name" required error={profileErrors.name?.message} {...registerProfile('name', { required: 'Name is required' })} />
            <Input
              label="Email Address"
              type="email"
              required
              error={profileErrors.email?.message}
              {...registerProfile('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })}
            />
            <Input label="Phone Number" required error={profileErrors.phone?.message} {...registerProfile('phone', { required: 'Phone is required' })} />
            <Input label="Department" {...registerProfile('department')} />
            <Input label="Designation" {...registerProfile('designation')} />
            <Button type="submit" loading={savingProfile} icon={<Save className="size-4" />} className="self-start">
              Save Changes
            </Button>
          </form>
        </Card>

        <Card>
          <CardHeader title="Change Password" description="Keep your account secure with a strong password" />
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} noValidate className="flex flex-col gap-4">
            <Input
              label="Current Password"
              type="password"
              required
              error={passwordErrors.currentPassword?.message}
              {...registerPassword('currentPassword', { required: 'Current password is required' })}
            />
            <Input
              label="New Password"
              type="password"
              required
              hint="At least 8 characters"
              error={passwordErrors.newPassword?.message}
              {...registerPassword('newPassword', { required: 'New password is required', minLength: { value: 8, message: 'Must be at least 8 characters' } })}
            />
            <Input
              label="Confirm New Password"
              type="password"
              required
              error={passwordErrors.confirmPassword?.message}
              {...registerPassword('confirmPassword', {
                required: 'Please confirm your new password',
                validate: (value) => value === newPassword || 'Passwords do not match',
              })}
            />
            <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-muted">
              <ShieldCheck className="size-4 shrink-0 text-primary-600" />
              Use a strong password with a mix of letters, numbers and symbols. This is a demo — no password is actually changed.
            </div>
            <Button type="submit" loading={savingPassword} icon={<KeyRound className="size-4" />} className="self-start">
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
