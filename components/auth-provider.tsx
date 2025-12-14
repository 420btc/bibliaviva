"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (name: string, email: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem("biblia-viva-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        setIsAuthenticated(true)
      } catch (e) {
        console.error("Error parsing user data", e)
        localStorage.removeItem("biblia-viva-user")
      }
    }
  }, [])

  const login = (name: string, email: string) => {
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: new Date().toISOString()
    }
    setUser(newUser)
    setIsAuthenticated(true)
    try {
      localStorage.setItem("biblia-viva-user", JSON.stringify(newUser))
    } catch (e) {
      console.error("Error saving user to localStorage", e)
    }
    router.push("/")
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("biblia-viva-user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
