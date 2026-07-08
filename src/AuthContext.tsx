import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type AuthUser = {
  name: string
  email: string
}

type AuthContextValue = {
  isAuthenticated: boolean
  user: AuthUser | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  const value = useMemo(
    () => ({
      isAuthenticated: user !== null,
      user,
      login: () => {
        setUser({
          name: 'Aegon',
          email: 'aegon@musylium.com',
        })
      },
      logout: () => {
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
