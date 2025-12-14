"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, Send, MessageCircle, Users, BookOpen } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { bibleBooks } from "@/lib/bible-data"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"
import { getPrayersAction, createPrayerAction, togglePrayAction, type Prayer } from "@/actions/prayers"

export function PrayerWall() {
  const [prayers, setPrayers] = useState<Prayer[]>([])
  const [newPrayer, setNewPrayer] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [selectedVerse, setSelectedVerse] = useState("")
  const [isVerseSelectorOpen, setIsVerseSelectorOpen] = useState(false)
  const [selectionStep, setSelectionStep] = useState<'book' | 'chapter' | 'verse'>('book')
  const [tempBook, setTempBook] = useState<any>(null)
  const [tempChapter, setTempChapter] = useState<number>(1)
  const { user } = useAuth()

  // Simplified book list for verse selector
  const allBooks = [...bibleBooks.antiguoTestamento, ...bibleBooks.nuevoTestamento]

  const resetSelection = () => {
    setSelectionStep('book')
    setTempBook(null)
    setTempChapter(1)
  }

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
        const content = selectedVerse 
            ? `${newPrayer}\n\n"${selectedVerse}"` 
            : newPrayer

        const result = await createPrayerAction(user.id, user.name, "/placeholder-user.jpg", content, "General")
        
        if (result.success) {
            const prayer: Prayer = {
                id: result.id || Date.now().toString(),
                user: user.name,
                avatar: "/placeholder-user.jpg",
                content: content,
                category: "General",
                prayedCount: 0,
                comments: 0,
                timestamp: "Ahora mismo",
                isPrayed: false
            }
            setPrayers([prayer, ...prayers])
            setNewPrayer("")
            setSelectedVerse("")
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
          <div className="flex gap-4 items-start">
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="Comparte tu petición de oración..."
                value={newPrayer}
                onChange={(e) => setNewPrayer(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              
              <div className="flex items-center gap-2">
                <Popover 
                    open={isVerseSelectorOpen} 
                    onOpenChange={(open) => {
                        setIsVerseSelectorOpen(open)
                        if (!open) resetSelection()
                    }}
                >
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 text-muted-foreground h-9">
                            <BookOpen className="w-4 h-4" />
                            {selectedVerse ? "Versículo seleccionado" : "Añadir versículo"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[300px]" align="start">
                        <Command>
                            <CommandInput 
                                placeholder={
                                    selectionStep === 'book' ? "Buscar libro..." : 
                                    selectionStep === 'chapter' ? `Capítulo de ${tempBook?.nombre}...` : 
                                    "Versículo..."
                                } 
                            />
                            <CommandList>
                                <CommandEmpty>No encontrado.</CommandEmpty>
                                
                                {selectionStep === 'book' && (
                                    <CommandGroup heading="Libros">
                                        {allBooks.map(book => (
                                            <CommandItem 
                                                key={book.id}
                                                onSelect={() => {
                                                    setTempBook(book)
                                                    setSelectionStep('chapter')
                                                }}
                                            >
                                                {book.nombre}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}

                                {selectionStep === 'chapter' && tempBook && (
                                    <CommandGroup heading={`Capítulos de ${tempBook.nombre}`}>
                                        <CommandItem onSelect={() => setSelectionStep('book')} className="text-muted-foreground">
                                            ← Volver a libros
                                        </CommandItem>
                                        {Array.from({ length: tempBook.capitulos }, (_, i) => i + 1).map(cap => (
                                            <CommandItem 
                                                key={cap}
                                                onSelect={() => {
                                                    setTempChapter(cap)
                                                    setSelectionStep('verse')
                                                }}
                                            >
                                                Capítulo {cap}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}

                                {selectionStep === 'verse' && (
                                    <CommandGroup heading={`Versículo de ${tempBook.nombre} ${tempChapter}`}>
                                        <CommandItem onSelect={() => setSelectionStep('chapter')} className="text-muted-foreground">
                                            ← Volver a capítulos
                                        </CommandItem>
                                        {/* Mostramos hasta 176 versículos genéricos ya que no tenemos la data exacta por capítulo */}
                                        {Array.from({ length: 50 }, (_, i) => i + 1).map(verse => (
                                            <CommandItem 
                                                key={verse}
                                                onSelect={() => {
                                                    setSelectedVerse(`${tempBook.nombre} ${tempChapter}:${verse}`) 
                                                    setIsVerseSelectorOpen(false)
                                                    resetSelection()
                                                    toast.success("Versículo añadido")
                                                }}
                                            >
                                                Versículo {verse}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                
                {selectedVerse && (
                    <Badge variant="secondary" className="gap-1 pr-1">
                        {selectedVerse}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 hover:bg-transparent"
                            onClick={() => setSelectedVerse("")}
                        >
                            <span className="sr-only">Quitar</span>
                            <span aria-hidden>×</span>
                        </Button>
                    </Badge>
                )}
              </div>
            </div>

            <Button
              onClick={handlePostPrayer}
              disabled={isPosting || !newPrayer.trim()}
              className="h-[80px] w-14 gradient-primary flex flex-col items-center justify-center gap-1"
            >
              <Send className="w-5 h-5" />
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
