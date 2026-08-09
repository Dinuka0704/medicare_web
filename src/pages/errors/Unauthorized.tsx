import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'
import { useAuth } from '@/context/AuthContext'
import { getDashboardPath } from '@/components/layout/navConfig'

export default function Unauthorized() {
  const { user } = useAuth()
  const homePath = user ? getDashboardPath(user.role) : '/login'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-12 text-center">
      <Logo className="mb-10" />
      <div className="flex size-20 items-center justify-center rounded-2xl bg-danger-50 text-danger-600">
        <ShieldAlert className="size-10" />
      </div>
      <p className="mt-6 text-6xl font-bold text-ink">403</p>
      <h1 className="mt-2 text-xl font-semibold text-ink">Access restricted</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Your current role doesn't have permission to view this page. If you believe this is a mistake, contact your
        hospital administrator.
      </p>
      <Link to={homePath} className="mt-6">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  )
}
