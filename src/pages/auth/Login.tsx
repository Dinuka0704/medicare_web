import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, ShieldCheck, Stethoscope, UserCog } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { cn } from '@/utils/cn'
import { useAuth } from '@/context/AuthContext'
import { getDashboardPath } from '@/components/layout/navConfig'
import type { Role } from '@/types'
import { demoAccounts } from '@/data/users'

interface LoginFormValues {
  email: string
  password: string
}

const roleOptions: { value: Role; label: string; icon: LucideIcon }[] = [
  { value: 'admin', label: 'Administrator', icon: UserCog },
  { value: 'doctor', label: 'Doctor', icon: Stethoscope },
  { value: 'receptionist', label: 'Receptionist', icon: ShieldCheck },
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [role, setRole] = useState<Role>('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({ defaultValues: { email: '', password: '' } })

  const onSubmit = (values: LoginFormValues) => {
    setFormError(null)
    setSubmitting(true)
    setTimeout(() => {
      const result = login(values.email, values.password, role)
      setSubmitting(false)
      if (result.success) {
        navigate(getDashboardPath(role), { replace: true })
      } else {
        setFormError(result.error ?? 'Unable to sign in. Please check your details.')
      }
    }, 400)
  }

  const fillDemo = (r: Role) => {
    const account = demoAccounts.find((a) => a.role === r)
    if (!account) return
    setRole(r)
    setValue('email', account.email)
    setValue('password', account.password)
    setFormError(null)
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Welcome to Medicare</h1>
        <p className="mt-1 text-sm text-muted">Hospital Management System</p>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-ink">Sign in as</p>
        <div className="grid grid-cols-3 gap-2">
          {roleOptions.map((opt) => {
            const active = opt.value === role
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition-colors',
                  active
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-slate-200 text-muted hover:border-slate-300 hover:bg-slate-50',
                )}
              >
                <opt.icon className="size-5" />
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {formError && (
        <Alert variant="danger" className="mb-4" onClose={() => setFormError(null)}>
          {formError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@medicare.lk"
          required
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
          })}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            required
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-[34px] text-muted hover:text-ink"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" loading={submitting} icon={<LogIn className="size-4" />}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Demo accounts</p>
        <div className="flex flex-col gap-1.5">
          {demoAccounts.map((account) => (
            <button
              key={account.role}
              type="button"
              onClick={() => fillDemo(account.role)}
              className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs hover:bg-white transition-colors"
            >
              <span className="font-medium capitalize text-ink">{account.role}</span>
              <span className="text-muted">{account.email}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
