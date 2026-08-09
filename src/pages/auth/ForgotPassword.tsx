import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { ArrowLeft, MailCheck, SendHorizonal } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface ForgotPasswordValues {
  email: string
}

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({ defaultValues: { email: '' } })

  const onSubmit = (values: ForgotPasswordValues) => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSentEmail(values.email)
      setSent(true)
    }, 500)
  }

  if (sent) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-success-50 text-success-600">
          <MailCheck className="size-8" />
        </div>
        <h1 className="mt-6 text-xl font-bold text-ink">Check your email</h1>
        <p className="mt-2 text-sm text-muted">
          We've sent password reset instructions to <span className="font-medium text-ink">{sentEmail}</span>. This
          is a demo prototype, so no real email was sent.
        </p>
        <Link to="/login" className="mt-6 inline-block">
          <Button variant="outline" icon={<ArrowLeft className="size-4" />}>
            Back to Sign In
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeft className="size-4" />
        Back to Sign In
      </Link>

      <h1 className="text-2xl font-bold text-ink">Forgot your password?</h1>
      <p className="mt-1 text-sm text-muted">
        Enter the email address associated with your account and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-4">
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
        <Button type="submit" fullWidth size="lg" loading={submitting} icon={<SendHorizonal className="size-4" />}>
          Send Reset Link
        </Button>
      </form>
    </div>
  )
}
