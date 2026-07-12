import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import {
  authService,
  type AuthUser,
  type SignInInput,
  type SignUpInput,
} from '@/services/AuthService'

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  signIn: (input: SignInInput) => Promise<AuthUser>
  signUp: (input: SignUpInput) => Promise<AuthUser>
  signOut: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getStoredUser())

  const signIn = useCallback(async (input: SignInInput) => {
    const authenticated = await authService.signIn(input)
    setUser(authenticated)
    return authenticated
  }, [])

  const signUp = useCallback(async (input: SignUpInput) => {
    const created = await authService.signUp(input)
    setUser(created)
    return created
  }, [])

  const signOut = useCallback(() => {
    authService.signOut()
    setUser(null)
  }, [])

  const value = useMemo<AuthState>(
    () => ({ user, isAuthenticated: user !== null, signIn, signUp, signOut }),
    [user, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de <AuthProvider>.')
  }
  return context
}
