"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { dailyVerses, getAllBooksFlat } from "@/lib/bible-data"
import { Share2, Bookmark, Volume2, Sparkles, Loader2, X, Copy, BookOpen, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { generateVerseImage, generateVerseAudio } from "@/lib/openai-actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUserProgress } from "@/hooks/use-user-progress"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function VerseOfDay() {
  const router = useRouter()
  const [verse, setVerse] = useState(dailyVerses[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isLoadingVerse, setIsLoadingVerse] = useState(true)
  const [remainingGens, setRemainingGens] = useState(3)
  
  const { addXP } = useUserProgress()

  useEffect(() => {
    // Check limits on mount
    const today = new Date().toISOString().split('T')[0]
    const storageKey = "biblia-viva-image-gen-limit"
    const storedData = localStorage.getItem(storageKey)
    
    if (storedData) {
      try {
        const { count, date } = JSON.parse(storedData)
        if (date === today) {
          setRemainingGens(Math.max(0, 3 - count))
        }
      } catch (e) {
        console.error("Error checking limits", e)
      }
    }
  }, [])

  useEffect(() => {
    const loadDailyVerse = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const savedDate = localStorage.getItem("biblia-viva-daily-verse-date")
        const savedVerse = localStorage.getItem("biblia-viva-daily-verse")

        if (savedDate === today && savedVerse) {
          const parsed = JSON.parse(savedVerse)
          // Limpiar etiquetas HTML residuales si existen
          parsed.texto = parsed.texto.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '')
          setVerse(parsed)
          setIsLoadingVerse(false)
          return
        }

        // Fetch new random verse
        const res = await fetch('https://bolls.life/get-random-verse/RV1960/')
        if (!res.ok) throw new Error('Failed to fetch verse')
        
        const data = await res.json()
        const books = getAllBooksFlat()
        const bookName = books[data.book - 1]?.nombre || "Biblia"
        
        // Limpiar el texto de etiquetas HTML
        const cleanText = data.text.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '')

        const newVerse = {
          libro: bookName,
          capitulo: data.chapter,
          versiculo: data.verse,
          texto: cleanText,
          version: "Reina-Valera 1960"
        }

        setVerse(newVerse)
        
        try {
          localStorage.setItem("biblia-viva-daily-verse", JSON.stringify(newVerse))
          localStorage.setItem("biblia-viva-daily-verse-date", today)
        } catch (storageError) {
           // Ignorar error de quota, el usuario verá el versículo pero se recargará la próxima vez
           console.warn("Storage quota exceeded, daily verse not cached.")
        }
      } catch (error) {
        console.error("Error loading daily verse:", error)
        // Fallback to static list based on date
        const todayDate = new Date().getDate()
        const index = todayDate % dailyVerses.length
        setVerse(dailyVerses[index])
      } finally {
        setIsLoadingVerse(false)
      }
    }

    loadDailyVerse()
  }, [])

  const handleShare = async () => {
    const shareData = {
      title: 'Versículo del Día - Biblia Viva',
      text: `"${verse.texto}" - ${verse.libro} ${verse.capitulo}:${verse.versiculo}`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        addXP(10)
        toast.success("¡Versículo compartido! +10 XP")
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
        toast.success("Copiado al portapapeles")
      }
    } catch (err) {
      console.error('Error sharing:', err)
    }
  }

  const handleListen = async () => {
    if (isPlaying && audioUrl) {
      const audio = document.getElementById("verse-audio") as HTMLAudioElement
      audio.pause()
      setIsPlaying(false)
      return
    }

    try {
      setIsPlaying(true)
      if (!audioUrl) {
        const res = await generateVerseAudio(`${verse.libro} ${verse.capitulo} versículo ${verse.versiculo}. ${verse.texto}`)
        if (!res.audio) throw new Error(res.error || "No se pudo generar el audio")
        const { audio } = res
        const url = `data:audio/mp3;base64,${audio}`
        setAudioUrl(url)
        addXP(5)
        
        // Reproducir automáticamente
        setTimeout(() => {
          const audioElement = document.getElementById("verse-audio") as HTMLAudioElement
          if (audioElement) {
            audioElement.play()
            audioElement.onended = () => setIsPlaying(false)
          }
        }, 100)
      } else {
        const audio = document.getElementById("verse-audio") as HTMLAudioElement
        audio.play()
        audio.onended = () => setIsPlaying(false)
      }
    } catch (error) {
      console.error(error)
      setIsPlaying(false)
    }
  }

  const handleGenerateArt = async () => {
    // Verificar límite diario
    const today = new Date().toISOString().split('T')[0]
    const storageKey = "biblia-viva-image-gen-limit"
    const storedData = localStorage.getItem(storageKey)
    
    let currentCount = 0
    
    if (storedData) {
      try {
        const { count, date } = JSON.parse(storedData)
        if (date === today) {
          currentCount = count
        }
      } catch (e) {
        console.error("Error parsing limit data", e)
      }
    }

    if (currentCount >= 3) {
      toast.error("Has alcanzado el límite diario de 3 imágenes.")
      return
    }

    try {
      setIsGeneratingImage(true)
      const res = await generateVerseImage(`${verse.texto} (${verse.libro} ${verse.capitulo}:${verse.versiculo})`)
      if (!res.url) {
        toast.error(res.error || "No se pudo generar la imagen. Inténtalo de nuevo.")
        return
      }
      setGeneratedImage(res.url)
      addXP(15)
      
      // Actualizar contador
      const newCount = currentCount + 1
      localStorage.setItem(storageKey, JSON.stringify({
        count: newCount,
        date: today
      }))
      setRemainingGens(Math.max(0, 3 - newCount))
      
      toast.success(`Imagen generada. Te quedan ${3 - newCount} usos hoy.`)
    } catch (error) {
      console.error(error)
      const msg =
        typeof error === "object" && error && "message" in error && typeof (error as any).message === "string"
          ? (error as any).message
          : "No se pudo generar la imagen. Inténtalo de nuevo."
      toast.error(msg)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="relative overflow-hidden glass-card p-6 lg:p-8 border-[#D2B48C]/20 bg-[#D2B48C]/5 hover:bg-[#D2B48C]/10 transition-colors">
        {isLoadingVerse ? (
           <div className="flex flex-col items-center justify-center py-12 gap-4">
             <Loader2 className="w-8 h-8 animate-spin text-[#D2B48C]" />
             <p className="text-sm text-[#D2B48C]/60">Buscando inspiración divina...</p>
           </div>
        ) : (
          <>
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D2B48C] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D2B48C] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Encabezado */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D2B48C]/20">
              <Sparkles className="w-4 h-4 text-[#D2B48C]" />
            </div>
            <span className="text-sm font-medium text-[#D2B48C]/60">Versículo del Día</span>
            
            {/* Botón de Ayuda IA */}
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-8 w-8 rounded-full hover:bg-[#D2B48C]/10 hover:text-[#D2B48C] transition-colors"
              title="Explicar con IA"
              onClick={() => router.push(`/chat?verse=${encodeURIComponent(`${verse.libro} ${verse.capitulo}:${verse.versiculo}`)}&text=${encodeURIComponent(verse.texto)}`)}
            >
              <HelpCircle className="w-5 h-5 text-[#D2B48C]" />
            </Button>
          </div>

          {/* Versículo */}
          <blockquote className="verse-text text-2xl lg:text-4xl font-bold text-[#D2B48C] mb-4 text-pretty leading-relaxed drop-shadow-[0_0_15px_rgba(210,180,140,0.3)] tracking-tight italic">
            &ldquo;{verse.texto}&rdquo;
          </blockquote>

          {/* Referencia */}
          <Link href={`/biblia?libro=${verse.libro}&capitulo=${verse.capitulo}&versiculo=${verse.versiculo}`}>
            <div className="inline-flex items-center gap-2 mb-6 group cursor-pointer">
              <p className="text-[#D2B48C] font-semibold group-hover:underline decoration-[#D2B48C]/50 underline-offset-4 transition-all">
                {verse.libro} {verse.capitulo}:{verse.versiculo}
              </p>
              <BookOpen className="w-4 h-4 text-[#D2B48C]/60 opacity-0 group-hover:opacity-100 transition-opacity -ml-1 group-hover:ml-0" />
              <span className="text-[#D2B48C]/60 font-normal text-sm">— {verse.version}</span>
            </div>
          </Link>

          {/* Acciones */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={isPlaying ? "default" : "secondary"} 
              size="sm" 
              className={`gap-2 ${isPlaying ? 'bg-[#D2B48C] text-black hover:bg-[#D2B48C]/90' : 'bg-[#D2B48C]/10 text-[#D2B48C] hover:bg-[#D2B48C]/20 border-0'}`}
              onClick={handleListen}
              disabled={isPlaying && !audioUrl}
            >
              {isPlaying && !audioUrl ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              {isPlaying ? "Reproduciendo..." : "Escuchar"}
            </Button>
            
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-2 bg-[#D2B48C]/10 text-[#D2B48C] hover:bg-[#D2B48C]/20 border-0"
            >
              <Bookmark className="w-4 h-4" />
              Guardar
            </Button>
            
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-2 bg-[#D2B48C]/10 text-[#D2B48C] hover:bg-[#D2B48C]/20 border-0" 
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              className="gap-2 bg-[#D2B48C] text-black hover:bg-[#D2B48C]/90 border-0"
              onClick={handleGenerateArt}
              disabled={isGeneratingImage || remainingGens === 0}
              title={remainingGens === 0 ? "Límite diario alcanzado" : `${remainingGens} generaciones restantes hoy`}
            >
              {isGeneratingImage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isGeneratingImage ? "Generando..." : remainingGens === 0 ? "Límite alcanzado" : "Generar Arte IA"}
            </Button>
          </div>
        </div>
        </>
        )}
      </Card>

      {/* Audio Element oculto */}
      {audioUrl && <audio id="verse-audio" src={audioUrl} className="hidden" />}

      {/* Modal de Imagen Generada */}
      <Dialog open={!!generatedImage} onOpenChange={(open) => !open && setGeneratedImage(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Arte IA Inspirado</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-square w-full rounded-lg overflow-hidden mt-2">
            {generatedImage && (
              <img 
                src={generatedImage} 
                alt="Arte generado por IA" 
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setGeneratedImage(null)}>Cerrar</Button>
            <Button onClick={() => window.open(generatedImage || "", "_blank")}>Descargar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
