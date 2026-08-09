import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-12 text-center">
      <Logo className="mb-10" />
      <div className="flex size-20 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
        <SearchX className="size-10" />
      </div>
      <p className="mt-6 text-6xl font-bold text-ink">404</p>
      <h1 className="mt-2 text-xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The page you're looking for doesn't exist or may have been moved. Check the URL or head back to your dashboard.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  )
}
