"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Cookie, Shield, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Verificar si ya existe una decisión guardada
    const consent = localStorage.getItem("biblia-viva-cookie-consent")
    if (!consent) {
      // Pequeño retraso para que no sea intrusivo inmediatamente al cargar
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const safeSetItem = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value)
    } catch (e) {
        console.warn("Storage quota exceeded, attempting cleanup...", e)
        try {
            // Limpiar claves antiguas o cachés grandes
            Object.keys(localStorage).forEach(k => {
                if (k.startsWith('audio-cache-') || k.includes('verse')) {
                    localStorage.removeItem(k)
                }
            })
            // Reintentar
            localStorage.setItem(key, value)
        } catch (retryError) {
            console.error("Failed to save cookie consent even after cleanup", retryError)
        }
    }
  }

  const handleAccept = () => {
    safeSetItem("biblia-viva-cookie-consent", "accepted")
    setIsVisible(false)
  }

  const handleReject = () => {
    safeSetItem("biblia-viva-cookie-consent", "rejected")
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md"
        >
          <Card className="p-4 shadow-2xl bg-background/95 backdrop-blur-md border-primary/20">
            <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary shrink-0">
                        <Cookie className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-semibold text-sm">Uso de Cookies y Privacidad</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Utilizamos cookies esenciales para guardar tu progreso y preferencias. 
                            Cumplimos con el RGPD y respetamos tu privacidad. No compartimos tus datos.
                        </p>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 -mt-1 -mr-1 text-muted-foreground hover:text-foreground"
                        onClick={handleReject}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                    <Button variant="outline" size="sm" onClick={handleReject} className="text-xs h-8">
                        Rechazar
                    </Button>
                    <Button size="sm" onClick={handleAccept} className="text-xs h-8 gradient-primary">
                        Aceptar Todo
                    </Button>
                </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
