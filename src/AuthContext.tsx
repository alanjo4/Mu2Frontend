import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'mu2-web-auth'

type RegisterResponse = {
  user: {
    accountGuid: number
    username: string
    email: string | null
  }
  tokens: {
    accessToken: string
    expiresIn: number
  }
}

type AuthUser = {
  accountGuid: number
  name: string
  email: string
  accessToken: string
  expiresAt: number
}

type AuthContextValue = {
  isAuthenticated: boolean
  user: AuthUser | null
  registerSession: (payload: RegisterResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadStoredUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed.expiresAt || parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return parsed
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadStoredUser())

  const value = useMemo(
    () => ({
      isAuthenticated: user !== null,
      user,
      registerSession: (payload: RegisterResponse) => {
        const nextUser: AuthUser = {
          accountGuid: payload.user.accountGuid,
          name: payload.user.username,
          email: payload.user.email ?? '',
          accessToken: payload.tokens.accessToken,
          expiresAt: Date.now() + payload.tokens.expiresIn * 1000,
        }

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
        setUser(nextUser)
      },
      logout: () => {
        window.localStorage.removeItem(STORAGE_KEY)
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
