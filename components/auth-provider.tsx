"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { loginOrRegisterAction, syncUserAction } from "@/actions/auth"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (name: string, email: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("biblia-viva-user")
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
          setIsAuthenticated(true)
          
          // Sync with DB in background to ensure user exists
          syncUserAction(parsedUser).catch(err => 
            console.error("Failed to sync user with DB", err)
          )
        } catch (e) {
          console.error("Error parsing user data", e)
          localStorage.removeItem("biblia-viva-user")
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const login = async (name: string, email: string) => {
    setIsLoading(true)
    try {
        const result = await loginOrRegisterAction(name, email)
        if (result.success && result.user) {
            setUser(result.user)
            setIsAuthenticated(true)
            localStorage.setItem("biblia-viva-user", JSON.stringify(result.user))
            router.push("/")
            toast.success(`Bienvenido, ${result.user.name}`)
        } else {
            toast.error(result.error || "Error al iniciar sesión")
        }
    } catch (e) {
        console.error("Login error", e)
        toast.error("Error de conexión")
    } finally {
        setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("biblia-viva-user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
