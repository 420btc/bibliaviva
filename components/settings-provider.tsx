"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { getUserSettingsAction, saveUserSettingsAction } from "@/actions/settings"

interface SettingsContextType {
  fontSize: number
  setFontSize: (size: number) => void
  language: string
  setLanguage: (lang: string) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(18)
  const [language, setLanguage] = useState("es")
  const { user } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
        let loadedFontSize = 18
        let loadedLanguage = "es"
        let fromDB = false

        if (user?.id) {
            try {
                const result = await getUserSettingsAction(user.id)
                if (result.success && result.data) {
                    loadedFontSize = result.data.fontSize
                    loadedLanguage = result.data.language
                    fromDB = true
                }
            } catch (e) { console.error(e) }
        }

        // Fallback or migration from local storage
        if (!fromDB) {
            const savedFontSize = localStorage.getItem("biblia-viva-font-size")
            if (savedFontSize) {
                loadedFontSize = parseInt(savedFontSize)
            }
            const savedLanguage = localStorage.getItem("biblia-viva-language")
            if (savedLanguage) {
                loadedLanguage = savedLanguage
            }
            
            // If we have a user but no DB settings, migrate now
            if (user?.id) {
                saveUserSettingsAction(user.id, { fontSize: loadedFontSize, language: loadedLanguage })
            }
        }

        setFontSize(loadedFontSize)
        setLanguage(loadedLanguage)
        setIsLoaded(true)
    }
    loadSettings()
  }, [user])

  const updateFontSize = (size: number) => {
    setFontSize(size)
    localStorage.setItem("biblia-viva-font-size", size.toString())
    if (user?.id) {
        saveUserSettingsAction(user.id, { fontSize: size })
    }
  }

  const updateLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("biblia-viva-language", lang)
    if (user?.id) {
        saveUserSettingsAction(user.id, { language: lang })
    }
  }

  return (
    <SettingsContext.Provider value={{ 
      fontSize, 
      setFontSize: updateFontSize,
      language,
      setLanguage: updateLanguage
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
