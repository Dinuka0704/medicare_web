import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthUser, Role } from '@/types'
import { findDemoAccount } from '@/data/users'

const STORAGE_KEY = 'medicare_auth_user'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string, role: Role) => { success: boolean; error?: string }
  logout: () => void
  updateProfile: (partial: Partial<AuthUser>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const login: AuthContextValue['login'] = (email, password, role) => {
    const account = findDemoAccount(email, role)
    if (!account) {
      return { success: false, error: 'No account found for this email and role combination.' }
    }
    if (account.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account.user))
    setUser(account.user)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const updateProfile = (partial: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...partial }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
