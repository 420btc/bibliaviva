"use client"

import { useState, useMemo, useEffect } from "react"
import useSWR from "swr"
import { bibleBooks, type BibleBookLocal } from "@/lib/bible-data"
import { getChapter, type ChapterResponse } from "@/lib/bible-api"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  ChevronLeft, 
  ChevronRight, 
  Book, 
  Search, 
  Highlighter, 
  Share2, 
  Bookmark,
  Volume2,
  Menu,
  Columns,
  ScrollText,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useUserProgress } from "@/hooks/use-user-progress"
import { useSettings } from "@/components/settings-provider"
import { useSearchParams } from "next/navigation"
import { generateVerseAudio } from "@/lib/openai-actions"
import { toast } from "sonner"

const highlightColors = [
  { name: "Amarillo", class: "bg-yellow-500/30", color: "#eab308" },
  { name: "Verde", class: "bg-green-500/30", color: "#22c55e" },
  { name: "Azul", class: "bg-blue-500/30", color: "#3b82f6" },
  { name: "Rosa", class: "bg-pink-500/30", color: "#ec4899" },
  { name: "Naranja", class: "bg-orange-500/30", color: "#f97316" },
]

// Fetcher para SWR
const fetcher = async ([bookId, chapter]: [string, number]): Promise<ChapterResponse> => {
  return getChapter(bookId, chapter)
}

export function BibleReader() {
  const searchParams = useSearchParams()
  const [selectedBook, setSelectedBook] = useState<BibleBookLocal>(bibleBooks.antiguoTestamento[0]) // Génesis por defecto
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [selectedVerses, setSelectedVerses] = useState<number[]>([])
  
  // Efecto para cargar libro/capítulo desde URL
  useEffect(() => {
    const libroParam = searchParams.get("libro")
    const capituloParam = searchParams.get("capitulo")
    const versiculoParam = searchParams.get("versiculo")

    // Resetear audio al cambiar de capítulo/libro
    setAudioUrl(null)
    setIsPlaying(false)
    const audio = document.getElementById("chapter-audio") as HTMLAudioElement
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }

    if (libroParam) {
      const allBooks = [...bibleBooks.antiguoTestamento, ...bibleBooks.nuevoTestamento]
      const foundBook = allBooks.find(b => b.nombre.toLowerCase() === libroParam.toLowerCase())
      
      if (foundBook) {
        setSelectedBook(foundBook)
        if (capituloParam) {
          const capNum = parseInt(capituloParam)
          if (!isNaN(capNum) && capNum > 0 && capNum <= foundBook.capitulos) {
            setSelectedChapter(capNum)
          }
        }
        if (versiculoParam) {
          const versNum = parseInt(versiculoParam)
          if (!isNaN(versNum)) {
            setSelectedVerses([versNum])
            // Intentar hacer scroll al versículo después de un breve delay para asegurar que cargó
            setTimeout(() => {
              const element = document.getElementById(`verse-${versNum}`)
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
            }, 1000)
          }
        }
      }
    }
  }, [searchParams])

  const [highlights, setHighlights] = useState<Record<string, Record<number, string>>>({})
  const [showBookSelector, setShowBookSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"scroll" | "book">("scroll")
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  
  const { addXP, completeChallenge } = useUserProgress()
  const { fontSize } = useSettings()

  const filteredBooks = useMemo(() => {
    if (!searchQuery) {
      return {
        at: bibleBooks.antiguoTestamento,
        nt: bibleBooks.nuevoTestamento,
      }
    }

    const query = searchQuery.toLowerCase()
    return {
      at: bibleBooks.antiguoTestamento.filter(
        (book) => book.nombre.toLowerCase().includes(query) || book.abreviatura.toLowerCase().includes(query),
      ),
      nt: bibleBooks.nuevoTestamento.filter(
        (book) => book.nombre.toLowerCase().includes(query) || book.abreviatura.toLowerCase().includes(query),
      ),
    }
  }, [searchQuery])

  const {
    data: chapterData,
    error,
    isLoading,
  } = useSWR<ChapterResponse>([selectedBook.id, selectedChapter], fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  // Track reading progress
  useEffect(() => {
    if (chapterData && !isLoading) {
      const timer = setTimeout(() => {
        completeChallenge('lectura-diaria', 20)
        addXP(5) // XP extra por tiempo de lectura
      }, 10000) // 10 segundos para probar (idealmente más tiempo)
      return () => clearTimeout(timer)
    }
  }, [chapterData, isLoading])

  // Manejar selección de versículos
  const toggleVerseSelection = (verseNum: number) => {
    setSelectedVerses(prev => 
      prev.includes(verseNum) 
        ? prev.filter(v => v !== verseNum)
        : [...prev, verseNum].sort((a, b) => a - b)
    )
  }

  // Manejar resaltado
  const handleHighlight = (colorClass: string) => {
    const newHighlights = { ...highlights }
    const key = `${selectedBook.id}-${selectedChapter}`
    
    if (!newHighlights[key]) newHighlights[key] = {}
    
    selectedVerses.forEach(verse => {
      newHighlights[key][verse] = colorClass
    })
    
    setHighlights(newHighlights)
    setSelectedVerses([])
  }

  // Navegación entre capítulos
  const nextChapter = () => {
    if (selectedChapter < selectedBook.capitulos) {
      setSelectedChapter(prev => prev + 1)
    } else {
      // Intentar ir al siguiente libro
      // TODO: Implementar lógica para saltar al siguiente libro
    }
    setSelectedVerses([])
    // Resetear audio
    setAudioUrl(null)
    setIsPlaying(false)
  }

  const prevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(prev => prev - 1)
    }
    setSelectedVerses([])
    // Resetear audio
    setAudioUrl(null)
    setIsPlaying(false)
  }

  const handleListenChapter = async () => {
    if (isPlaying && audioUrl) {
      const audio = document.getElementById("chapter-audio") as HTMLAudioElement
      audio.pause()
      setIsPlaying(false)
      return
    }

    if (audioUrl) {
      const audio = document.getElementById("chapter-audio") as HTMLAudioElement
      audio.play()
      setIsPlaying(true)
      return
    }

    try {
      setIsPlaying(true)
      toast.info("Generando audio del capítulo...")
      
      // Construir el texto completo del capítulo
      const fullText = chapterData?.vers.map(v => v.verse).join(" ") || ""
      
      // Limitar caracteres para evitar errores de API (OpenAI tiene límite)
      // En una app real, se debería hacer streaming o dividir en partes
      const truncatedText = fullText.slice(0, 4096) 
      
      const { audio } = await generateVerseAudio(truncatedText, "alloy") // Usar voz 'alloy' para diferenciar
      const url = `data:audio/mp3;base64,${audio}`
      setAudioUrl(url)
      
      setTimeout(() => {
        const audioElement = document.getElementById("chapter-audio") as HTMLAudioElement
        if (audioElement) {
          audioElement.play()
          audioElement.onended = () => setIsPlaying(false)
        }
      }, 100)
    } catch (error) {
      console.error(error)
      setIsPlaying(false)
      toast.error("Error al generar el audio")
    }
  }

  // Renderizado del selector de libros
  const renderBookSelector = () => (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col p-4 animate-in fade-in">
      <div className="flex items-center justify-between mb-4 max-w-2xl mx-auto w-full">
        <div className="relative flex-1 mr-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar libro..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="ghost" onClick={() => setShowBookSelector(false)}>Cerrar</Button>
      </div>
      
      <ScrollArea className="flex-1 max-w-2xl mx-auto w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pb-20">
          {filteredBooks.at.length > 0 && (
            <div className="col-span-full mt-2 mb-1">
              <h3 className="text-sm font-semibold text-muted-foreground">Antiguo Testamento</h3>
            </div>
          )}
          {filteredBooks.at.map(book => (
            <Button
              key={book.id}
              variant={selectedBook.id === book.id ? "default" : "outline"}
              className="justify-start"
              onClick={() => {
                setSelectedBook(book)
                setSelectedChapter(1)
                setShowBookSelector(false)
              }}
            >
              {book.nombre}
            </Button>
          ))}
          
          {filteredBooks.nt.length > 0 && (
            <div className="col-span-full mt-4 mb-1">
              <h3 className="text-sm font-semibold text-muted-foreground">Nuevo Testamento</h3>
            </div>
          )}
          {filteredBooks.nt.map(book => (
            <Button
              key={book.id}
              variant={selectedBook.id === book.id ? "default" : "outline"}
              className="justify-start"
              onClick={() => {
                setSelectedBook(book)
                setSelectedChapter(1)
                setShowBookSelector(false)
              }}
            >
              {book.nombre}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )

  const BookView = () => {
    // Dividir versículos en dos columnas aproximadas
    const verses = chapterData?.vers || []
    const midPoint = Math.ceil(verses.length / 2)
    const leftColumn = verses.slice(0, midPoint)
    const rightColumn = verses.slice(midPoint)

    return (
      <div className="flex-1 overflow-hidden p-4 md:p-8 w-full h-full bg-[#fdfbf7] dark:bg-[#000000]">
        <div className="h-full max-w-7xl mx-auto bg-card rounded-lg shadow-xl border border-border flex flex-col md:flex-row overflow-hidden relative">
          {/* Sombra central del libro */}
          <div className="absolute left-1/2 top-0 bottom-0 w-12 -ml-6 bg-gradient-to-r from-transparent via-black/5 to-transparent z-10 hidden md:block pointer-events-none" />
          
          {/* Página Izquierda */}
          <div className="flex-1 p-8 md:pr-12 overflow-y-auto border-r border-border/10">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-serif font-bold text-foreground/80">{selectedBook.nombre}</h2>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Capítulo {selectedChapter}</span>
            </div>
            <div className="space-y-1 text-justify">
              {leftColumn.map((verse) => {
                const verseNum = parseInt(verse.number)
                const isSelected = selectedVerses.includes(verseNum)
                const highlightClass = highlights[`${selectedBook.id}-${selectedChapter}`]?.[verseNum] || ""
                return (
                  <span 
                    key={verse.id || verse.number}
                    onClick={() => toggleVerseSelection(verseNum)}
                    className={cn(
                      "inline transition-colors cursor-pointer hover:bg-muted/50",
                      isSelected && "bg-primary/10",
                      highlightClass
                    )}
                  >
                    <sup className="text-[0.6em] text-muted-foreground font-medium mr-1 select-none">{verse.number}</sup>
                    <span style={{ fontSize: `${fontSize}px` }} className="leading-relaxed font-serif text-foreground">
                      {verse.verse}{" "}
                    </span>
                  </span>
                )
              })}
            </div>
            <div className="mt-8 text-center text-xs text-muted-foreground">
              {selectedChapter > 1 && (
                <Button variant="ghost" size="sm" onClick={prevChapter} className="text-muted-foreground hover:text-primary">
                  <ChevronLeft className="w-3 h-3 mr-1" /> Anterior
                </Button>
              )}
            </div>
          </div>

          {/* Página Derecha */}
          <div className="flex-1 p-8 md:pl-12 overflow-y-auto bg-card/50">
             {/* En móvil, mostrar título de continuación si es necesario, en PC oculto */}
             <div className="md:hidden mb-6 text-center border-t border-border pt-6">
                <span className="text-xs text-muted-foreground uppercase tracking-widest">Continuación</span>
             </div>

             <div className="space-y-1 text-justify">
              {rightColumn.map((verse) => {
                const verseNum = parseInt(verse.number)
                const isSelected = selectedVerses.includes(verseNum)
                const highlightClass = highlights[`${selectedBook.id}-${selectedChapter}`]?.[verseNum] || ""
                return (
                  <span 
                    key={verse.id || verse.number}
                    onClick={() => toggleVerseSelection(verseNum)}
                    className={cn(
                      "inline transition-colors cursor-pointer hover:bg-muted/50",
                      isSelected && "bg-primary/10",
                      highlightClass
                    )}
                  >
                    <sup className="text-[0.6em] text-muted-foreground font-medium mr-1 select-none">{verse.number}</sup>
                    <span style={{ fontSize: `${fontSize}px` }} className="leading-relaxed font-serif text-foreground">
                      {verse.verse}{" "}
                    </span>
                  </span>
                )
              })}
            </div>

            <div className="mt-8 text-center text-xs text-muted-foreground">
              {selectedChapter < selectedBook.capitulos && (
                <Button variant="ghost" size="sm" onClick={nextChapter} className="text-muted-foreground hover:text-primary">
                  Siguiente <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {showBookSelector && renderBookSelector()}
      
      {/* Header de navegación */}
      <header className="border-b border-border p-4 flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowBookSelector(true)} className="gap-2">
            <Book className="w-4 h-4" />
            <span className="font-semibold">{selectedBook.nombre}</span>
          </Button>
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none" 
              onClick={prevChapter}
              disabled={selectedChapter <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="px-3 text-sm font-medium border-x h-8 flex items-center min-w-[3rem] justify-center">
              {selectedChapter}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none" 
              onClick={nextChapter}
              disabled={selectedChapter >= selectedBook.capitulos}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           {/* Botón de Audio */}
           <Button
             variant="ghost"
             size="icon"
             className={cn("h-9 w-9 rounded-full", isPlaying && "text-primary bg-primary/10")}
             onClick={handleListenChapter}
             disabled={isLoading || isPlaying && !audioUrl}
             title="Escuchar Capítulo"
           >
             {isPlaying && !audioUrl ? (
               <Loader2 className="w-5 h-5 animate-spin" />
             ) : (
               <Volume2 className="w-5 h-5" />
             )}
           </Button>

           {/* Toggle de Vista */}
           <div className="hidden md:flex items-center border rounded-md bg-muted/50 p-1">
             <Button
               variant="ghost"
               size="icon"
               className={cn("h-7 w-7 rounded-sm", viewMode === "scroll" && "bg-background shadow-sm")}
               onClick={() => setViewMode("scroll")}
               title="Vista Scroll"
             >
               <ScrollText className="w-4 h-4" />
             </Button>
             <Button
               variant="ghost"
               size="icon"
               className={cn("h-7 w-7 rounded-sm", viewMode === "book" && "bg-background shadow-sm")}
               onClick={() => setViewMode("book")}
               title="Vista Libro"
             >
               <Columns className="w-4 h-4" />
             </Button>
           </div>

           {/* Acciones de versículos seleccionados */}
           <AnimatePresence>
            {selectedVerses.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-1"
              >
                {highlightColors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => handleHighlight(color.class)}
                    className={`w-6 h-6 rounded-full border border-border transition-transform hover:scale-110`}
                    style={{ backgroundColor: color.color }}
                    title={`Resaltar ${color.name}`}
                  />
                ))}
                <div className="w-px h-6 bg-border mx-2" />
                <Button variant="ghost" size="icon" title="Copiar">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Guardar">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Área de lectura */}
      {viewMode === "book" && !isLoading && !error ? (
        <BookView />
      ) : (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-4 bg-muted rounded" />
                  <div className="flex-1 h-4 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 text-muted-foreground">
              <p>Error al cargar el capítulo. Por favor intenta de nuevo.</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          ) : (
            <div className="space-y-1 pb-20">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold font-serif text-foreground mb-2">
                  {selectedBook.nombre} {selectedChapter}
                </h1>
                <p className="text-sm text-muted-foreground uppercase tracking-widest">Reina-Valera 1960</p>
              </div>
              
              {chapterData?.vers.map((verse) => {
                const verseNum = parseInt(verse.number)
                const isSelected = selectedVerses.includes(verseNum)
                const highlightClass = highlights[`${selectedBook.id}-${selectedChapter}`]?.[verseNum] || ""
                
                return (
                  <div 
                    id={`verse-${verseNum}`}
                    key={verse.id || verse.number}
                    onClick={() => toggleVerseSelection(verseNum)}
                    className={cn(
                      "relative group px-2 py-1 rounded transition-colors cursor-pointer hover:bg-muted/50",
                      isSelected && "bg-primary/10",
                      highlightClass
                    )}
                  >
                    <span className="absolute left-[-1.5rem] top-1.5 text-xs text-muted-foreground opacity-50 font-medium w-4 text-right select-none group-hover:opacity-100">
                      {verse.number}
                    </span>
                    <p 
                      className="leading-relaxed font-serif text-foreground"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {verse.verse}
                    </p>
                  </div>
                )
              })}
              
              <div className="flex justify-between mt-12 pt-8 border-t border-border">
                <Button 
                  variant="outline" 
                  onClick={prevChapter}
                  disabled={selectedChapter <= 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                <Button 
                  variant="outline" 
                  onClick={nextChapter}
                  disabled={selectedChapter >= selectedBook.capitulos}
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Audio Element oculto */}
      {audioUrl && <audio id="chapter-audio" src={audioUrl} className="hidden" />}
    </div>
  )
}
