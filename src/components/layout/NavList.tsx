import { NavLink } from 'react-router-dom'
import type { NavItem } from './navConfig'
import { cn } from '@/utils/cn'

interface NavListProps {
  items: NavItem[]
  onNavigate?: () => void
}

export function NavList({ items, onNavigate }: NavListProps) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-ink',
            )
          }
        >
          <item.icon className="size-[18px] shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
