"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { dailyVerses, getAllBooksFlat } from "@/lib/bible-data"
import { Share2, Bookmark, Volume2, Sparkles, Loader2, X, Copy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { generateVerseImage, generateVerseAudio } from "@/lib/openai-actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUserProgress } from "@/hooks/use-user-progress"
import { toast } from "sonner"

export function VerseOfDay() {
  const [verse, setVerse] = useState(dailyVerses[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isLoadingVerse, setIsLoadingVerse] = useState(true)
  
  const { addXP } = useUserProgress()

  useEffect(() => {
    const loadDailyVerse = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const savedDate = localStorage.getItem("biblia-viva-daily-verse-date")
        const savedVerse = localStorage.getItem("biblia-viva-daily-verse")

        if (savedDate === today && savedVerse) {
          setVerse(JSON.parse(savedVerse))
          setIsLoadingVerse(false)
          return
        }

        // Fetch new random verse
        const res = await fetch('https://bolls.life/get-random-verse/RV1960/')
        if (!res.ok) throw new Error('Failed to fetch verse')
        
        const data = await res.json()
        const books = getAllBooksFlat()
        const bookName = books[data.book - 1]?.nombre || "Biblia"
        
        const newVerse = {
          libro: bookName,
          capitulo: data.chapter,
          versiculo: data.verse,
          texto: data.text,
          version: "Reina-Valera 1960"
        }

        setVerse(newVerse)
        localStorage.setItem("biblia-viva-daily-verse", JSON.stringify(newVerse))
        localStorage.setItem("biblia-viva-daily-verse-date", today)
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
        const { audio } = await generateVerseAudio(`${verse.libro} ${verse.capitulo} versículo ${verse.versiculo}. ${verse.texto}`)
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
    try {
      setIsGeneratingImage(true)
      const { url } = await generateVerseImage(`${verse.texto} (${verse.libro} ${verse.capitulo}:${verse.versiculo})`)
      setGeneratedImage(url || null)
      addXP(15)
    } catch (error) {
      console.error(error)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="relative overflow-hidden glass-card p-6 lg:p-8">
        {isLoadingVerse ? (
           <div className="flex flex-col items-center justify-center py-12 gap-4">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
             <p className="text-sm text-muted-foreground">Buscando inspiración divina...</p>
           </div>
        ) : (
          <>
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Encabezado */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full gradient-primary">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Versículo del Día</span>
          </div>

          {/* Versículo */}
          <blockquote className="verse-text text-xl lg:text-2xl text-foreground mb-4 text-pretty">
            &ldquo;{verse.texto}&rdquo;
          </blockquote>

          {/* Referencia */}
          <p className="text-primary font-semibold mb-6">
            {verse.libro} {verse.capitulo}:{verse.versiculo}
            <span className="text-muted-foreground font-normal ml-2">— {verse.version}</span>
          </p>

          {/* Acciones */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={isPlaying ? "default" : "secondary"} 
              size="sm" 
              className="gap-2"
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
            
            <Button variant="secondary" size="sm" className="gap-2">
              <Bookmark className="w-4 h-4" />
              Guardar
            </Button>
            
            <Button variant="secondary" size="sm" className="gap-2" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Compartir
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              className="gap-2 gradient-primary border-0"
              onClick={handleGenerateArt}
              disabled={isGeneratingImage}
            >
              {isGeneratingImage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isGeneratingImage ? "Generando..." : "Generar Arte IA"}
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
