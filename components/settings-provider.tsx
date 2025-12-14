"use client"

import { createContext, useContext, useEffect, useState } from "react"

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

  useEffect(() => {
    const savedFontSize = localStorage.getItem("biblia-viva-font-size")
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize))
    }
    
    const savedLanguage = localStorage.getItem("biblia-viva-language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const updateFontSize = (size: number) => {
    setFontSize(size)
    localStorage.setItem("biblia-viva-font-size", size.toString())
  }

  const updateLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("biblia-viva-language", lang)
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
