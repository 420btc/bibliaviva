"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, Send, MessageCircle, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Prayer {
  id: string
  user: string
  avatar: string
  content: string
  category: string
  prayedCount: number
  comments: number
  timestamp: string
  isPrayed: boolean
}

const initialPrayers: Prayer[] = [
  {
    id: "1",
    user: "María G.",
    avatar: "/placeholder-user.jpg",
    content: "Pido oración por la salud de mi madre, está pasando por un momento difícil en el hospital.",
    category: "Salud",
    prayedCount: 12,
    comments: 4,
    timestamp: "Hace 2 horas",
    isPrayed: false
  },
  {
    id: "2",
    user: "Juan P.",
    avatar: "/placeholder-user.jpg",
    content: "Por sabiduría en mi nuevo trabajo y para ser luz entre mis compañeros.",
    category: "Trabajo",
    prayedCount: 8,
    comments: 2,
    timestamp: "Hace 5 horas",
    isPrayed: false
  },
  {
    id: "3",
    user: "Ana L.",
    avatar: "/placeholder-user.jpg",
    content: "Oren por mi familia, necesitamos restauración y paz en el hogar.",
    category: "Familia",
    prayedCount: 24,
    comments: 7,
    timestamp: "Ayer",
    isPrayed: true
  }
]

export function PrayerWall() {
  const [prayers, setPrayers] = useState<Prayer[]>(initialPrayers)
  const [newPrayer, setNewPrayer] = useState("")
  const [isPosting, setIsPosting] = useState(false)

  const handlePostPrayer = () => {
    if (!newPrayer.trim()) return

    setIsPosting(true)
    setTimeout(() => {
      const prayer: Prayer = {
        id: Date.now().toString(),
        user: "Tú",
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
      setIsPosting(false)
      toast.success("Tu petición ha sido publicada")
    }, 1000)
  }

  const togglePray = (id: string) => {
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
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Muro de Oración</h2>
            <p className="text-muted-foreground">Comparte tus cargas y ora por otros.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nueva Petición</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea 
                placeholder="¿Cómo podemos orar por ti hoy?" 
                value={newPrayer}
                onChange={(e) => setNewPrayer(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button onClick={handlePostPrayer} disabled={!newPrayer.trim() || isPosting}>
                  {isPosting ? "Publicando..." : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Publicar Petición
                    </>
                  )}
                </Button>
              </div>
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
                layout
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={prayer.avatar} />
                        <AvatarFallback>{prayer.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold mr-2">{prayer.user}</span>
                            <span className="text-sm text-muted-foreground">{prayer.timestamp}</span>
                          </div>
                          <Badge variant="secondary">{prayer.category}</Badge>
                        </div>
                        <p className="text-foreground mb-4">{prayer.content}</p>
                        <div className="flex items-center gap-4">
                          <Button 
                            variant={prayer.isPrayed ? "default" : "outline"} 
                            size="sm"
                            onClick={() => togglePray(prayer.id)}
                            className={prayer.isPrayed ? "bg-rose-500 hover:bg-rose-600 text-white" : "hover:text-rose-500"}
                          >
                            <Heart className={`mr-2 h-4 w-4 ${prayer.isPrayed ? "fill-current" : ""}`} />
                            {prayer.isPrayed ? "Oraste" : "Orar"} ({prayer.prayedCount})
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Comentar ({prayer.comments})
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

      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Comunidad Activa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Más de 150 personas están orando en este momento. Tu petición no está sola.
            </p>
            <div className="flex -space-x-2 overflow-hidden mb-4">
              {[1,2,3,4,5].map((i) => (
                <Avatar key={i} className="border-2 border-background w-8 h-8">
                  <AvatarFallback className="text-xs">U{i}</AvatarFallback>
                </Avatar>
              ))}
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-muted text-[10px] font-medium">
                +140
              </div>
            </div>
            <Button variant="outline" className="w-full">Ver estadísticas</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Versículo de Ánimo</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="italic border-l-2 border-primary pl-4 py-2 mb-2 text-muted-foreground">
              "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias."
            </blockquote>
            <p className="text-right text-sm font-semibold">— Filipenses 4:6</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
