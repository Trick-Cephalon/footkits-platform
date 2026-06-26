'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { authLogin, authRegister, authMe, type AuthUser } from '@/lib/api'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<(AuthState & AuthActions) | null>(null)

const TOKEN_KEY = 'fk_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setState((s) => ({ ...s, isLoading: false }))
      return
    }
    authMe()
      .then((user) => setState({ user, token, isLoading: false, isAuthenticated: true }))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setState({ user: null, token: null, isLoading: false, isAuthenticated: false })
      })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await authLogin({ email, password })
    localStorage.setItem(TOKEN_KEY, token)
    setState({ user, token, isLoading: false, isAuthenticated: true })
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { user, token } = await authRegister({ name, email, password })
    localStorage.setItem(TOKEN_KEY, token)
    setState({ user, token, isLoading: false, isAuthenticated: true })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
