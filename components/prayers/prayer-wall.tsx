"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, Send, MessageCircle, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"
import { getPrayersAction, createPrayerAction, togglePrayAction, type Prayer } from "@/actions/prayers"

export function PrayerWall() {
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [newPrayer, setNewPrayer] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const loadPrayers = async () => {
        const result = await getPrayersAction(user?.id)
        if (result.success && result.data) {
            setPrayers(result.data)
        }
    }
    loadPrayers()
  }, [user])

  const handlePostPrayer = async () => {
    if (!newPrayer.trim()) return
    if (!user) {
        toast.error("Debes iniciar sesión para publicar una petición")
        return
    }

    setIsPosting(true)
    
    try {
        const result = await createPrayerAction(user.id, user.name, "/placeholder-user.jpg", newPrayer, "General")
        
        if (result.success) {
            const prayer: Prayer = {
                id: result.id || Date.now().toString(),
                user: user.name,
                avatar: "/placeholder-user.jpg",
                content: newPrayer,
                category: "General",
                prayedCount: 0,
                comments: 0,
                timestamp: "Ahora mismo",
                isPrayed: false
            }
            setPrayers([prayer, ...prayers])
            setNewPrayer("")
            toast.success("Tu petición ha sido publicada")
        } else {
            toast.error("Error al publicar petición")
        }
    } catch (e) {
        console.error(e)
        toast.error("Error de conexión")
    } finally {
        setIsPosting(false)
    }
  }

  const togglePray = async (id: string) => {
    if (!user) {
        toast.error("Debes iniciar sesión para indicar que oraste")
        return
    }

    // Optimistic update
    setPrayers(prayers.map(p => {
      if (p.id === id) {
        const newStatus = !p.isPrayed
        return {
          ...p,
          isPrayed: newStatus,
          prayedCount: p.prayedCount + (newStatus ? 1 : -1)
        }
      }
      return p
    }))

    try {
        const result = await togglePrayAction(user.id, id)
        if (!result.success) {
            toast.error("No se pudo registrar tu oración")
            // Revert could be implemented here
        }
    } catch (e) {
        console.error(e)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Muro de Oración
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Textarea
              placeholder="Comparte tu petición de oración..."
              value={newPrayer}
              onChange={(e) => setNewPrayer(e.target.value)}
              className="min-h-[80px]"
            />
            <Button
              onClick={handlePostPrayer}
              disabled={isPosting || !newPrayer.trim()}
              className="h-auto gradient-primary"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <AnimatePresence>
          {prayers.map((prayer) => (
            <motion.div
              key={prayer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={prayer.avatar} />
                      <AvatarFallback>{prayer.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{prayer.user}</h4>
                          <span className="text-xs text-muted-foreground">{prayer.timestamp}</span>
                        </div>
                        <Badge variant="outline">{prayer.category}</Badge>
                      </div>
                      <p className="mt-2 text-sm">{prayer.content}</p>
                      <div className="flex gap-4 mt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`gap-2 ${prayer.isPrayed ? "text-primary" : ""}`}
                          onClick={() => togglePray(prayer.id)}
                        >
                          <Heart className={`w-4 h-4 ${prayer.isPrayed ? "fill-current" : ""}`} />
                          {prayer.prayedCount} Orando
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <MessageCircle className="w-4 h-4" />
                          {prayer.comments} Comentarios
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
