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
            
            // Check if user is returning (created_at is older than a minute maybe, or just logic)
            // Ideally the action tells us if it was a new registration or existing login
            // For now, let's assume if we got a user back successfully it's a "Welcome"
            // But we can improve the message.
            
            // Let's modify the action to return isNewUser or we can just say "Bienvenido de nuevo" if we want to be generic but warm.
            // Or if we check the creation date.
            const isNew = new Date(result.user.createdAt).getTime() > Date.now() - 60000; // Created in last minute
            if (isNew) {
                toast.success(`¡Bienvenido a Biblia Viva, ${result.user.name}!`)
            } else {
                toast.success(`¡Bienvenido de nuevo, ${result.user.name}!`)
            }
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
    // Opcional: Limpiar otros datos locales si es deseado para seguridad completa en dispositivos compartidos
    // localStorage.clear() 
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
