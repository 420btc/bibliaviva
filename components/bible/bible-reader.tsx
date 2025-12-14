"use client"

import { useState, useMemo, useEffect } from "react"
import useSWR from "swr"
import { bibleBooks, getAllBooksFlat, type BibleBookLocal } from "@/lib/bible-data"
import { getChapter, searchBible, type ChapterResponse, type SearchResponse, type SearchResult } from "@/lib/bible-api"
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
  Pause,
  Play,
  Menu,
  Columns,
  ScrollText,
  Loader2,
  Settings2,
  Trash2,
  X,
  HelpCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useUserProgress } from "@/hooks/use-user-progress"
import { useSettings } from "@/components/settings-provider"
import { useSearchParams, useRouter } from "next/navigation"
import { generateVerseAudio } from "@/lib/openai-actions"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"
import { saveBookmarkAction } from "@/actions/bookmarks"
import { saveProgressAction, getProgressAction } from "@/actions/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedBook, setSelectedBook] = useState<BibleBookLocal>(bibleBooks.antiguoTestamento[0]) // Génesis por defecto
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [selectedVerses, setSelectedVerses] = useState<number[]>([])
  
  // Efecto para cargar libro/capítulo desde URL o DB/LocalStorage
  useEffect(() => {
    const loadInitialState = async () => {
      const libroParam = searchParams.get("libro")
      const capituloParam = searchParams.get("capitulo")
      const versiculoParam = searchParams.get("versiculo")

      // Resetear audio al cambiar de capítulo/libro
      stopAudio()

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
      } else {
        // Cargar última posición desde DB si hay usuario, sino LocalStorage
        if (user?.id) {
          try {
            const { success, data } = await getProgressAction(user.id)
            if (success && data) {
              const allBooks = [...bibleBooks.antiguoTestamento, ...bibleBooks.nuevoTestamento]
              const book = allBooks.find(b => b.id === data.bookId)
              if (book) {
                setSelectedBook(book)
                setSelectedChapter(data.chapter)
                return // Priorizar DB sobre LocalStorage
              }
            }
          } catch (e) {
            console.error("Error loading progress from DB", e)
          }
        }

        // Fallback a LocalStorage
        const savedPosition = localStorage.getItem("biblia-viva-last-position")
        if (savedPosition) {
          try {
            const { bookId, chapter } = JSON.parse(savedPosition)
            const allBooks = [...bibleBooks.antiguoTestamento, ...bibleBooks.nuevoTestamento]
            const book = allBooks.find(b => b.id === bookId)
            if (book) {
              setSelectedBook(book)
              setSelectedChapter(chapter)
            }
          } catch (e) {
            console.error("Error loading saved position", e)
          }
        }
      }
    }
    loadInitialState()
  }, [searchParams, user])

  // Guardar posición al cambiar
  useEffect(() => {
    if (selectedBook && selectedChapter) {
      // Guardar en DB si hay usuario
      if (user?.id) {
        saveProgressAction(user.id, selectedBook.id, selectedChapter).catch(console.error)
      }

      // Guardar en LocalStorage (siempre, como backup/offline)
      try {
        localStorage.setItem("biblia-viva-last-position", JSON.stringify({
          bookId: selectedBook.id,
          chapter: selectedChapter
        }))
      } catch (error) {
        console.warn("Storage quota exceeded when saving position, clearing old cache...", error)
        try {
          // Limpiar caché de audio
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('audio-cache-')) {
              localStorage.removeItem(key)
            }
          })
          // Reintentar
          localStorage.setItem("biblia-viva-last-position", JSON.stringify({
            bookId: selectedBook.id,
            chapter: selectedChapter
          }))
        } catch (retryError) {
          console.error("Failed to save position even after cleanup", retryError)
        }
      }
    }
  }, [selectedBook, selectedChapter, user])

  const [highlights, setHighlights] = useState<Record<string, Record<number, string>>>({})
  const [showBookSelector, setShowBookSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"scroll" | "book">("scroll")
  
  // Search states
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQueryText, setSearchQueryText] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // Audio states
  const [isPlaying, setIsPlaying] = useState(false)
  const [playingVerse, setPlayingVerse] = useState<number | null>(null)
  const [currentVoice, setCurrentVoice] = useState<"alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer">("alloy")
  const [audioCache, setAudioCache] = useState<Record<string, string>>({})
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)

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
  const handleHighlight = (colorClass: string | null) => {
    const newHighlights = { ...highlights }
    const key = `${selectedBook.id}-${selectedChapter}`
    
    if (!newHighlights[key]) newHighlights[key] = {}
    
    selectedVerses.forEach(verse => {
      if (colorClass === null) {
        delete newHighlights[key][verse]
      } else {
        newHighlights[key][verse] = colorClass
      }
    })
    
    setHighlights(newHighlights)
    setSelectedVerses([])
  }

  // Función para guardar Bookmark
  const saveBookmark = async () => {
    if (selectedVerses.length === 0) return

    const versesToSave = selectedVerses.sort((a, b) => a - b).map(v => {
      const verseText = chapterData?.vers.find(verse => parseInt(verse.number) === v)?.verse
      return {
        id: `${selectedBook.id}-${selectedChapter}-${v}-${Date.now()}`,
        user_id: user?.id || "local-user", // Fallback for types
        book_id: selectedBook.id, // Use snake_case for DB compatibility in local object if needed, or map it
        bookId: selectedBook.id, // Keep camelCase for local logic
        bookName: selectedBook.nombre,
        book_name: selectedBook.nombre,
        chapter: selectedChapter,
        verse: v,
        text: verseText || "",
        created_at: new Date().toISOString(),
        date: new Date().toISOString()
      }
    })

    // Guardar en DB si hay usuario
    if (user?.id) {
      for (const verse of versesToSave) {
        await saveBookmarkAction({
          id: verse.id,
          user_id: user.id,
          book_id: verse.book_id,
          book_name: verse.book_name,
          chapter: verse.chapter,
          verse: verse.verse,
          text: verse.text,
          created_at: verse.created_at
        })
      }
    }

    try {
      const existingBookmarks = JSON.parse(localStorage.getItem("biblia-viva-bookmarks") || "[]")
      const newBookmarks = [...existingBookmarks, ...versesToSave]
      localStorage.setItem("biblia-viva-bookmarks", JSON.stringify(newBookmarks))
      toast.success("Versículo(s) guardado(s) en favoritos")
      addXP(5)
      setSelectedVerses([])
    } catch (error) {
      console.warn("Storage quota exceeded when saving bookmark, clearing old cache...", error)
      try {
        // Limpiar caché de audio
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('audio-cache-')) {
            localStorage.removeItem(key)
          }
        })
        
        // Reintentar guardado
        const existingBookmarks = JSON.parse(localStorage.getItem("biblia-viva-bookmarks") || "[]")
        const newBookmarks = [...existingBookmarks, ...versesToSave]
        localStorage.setItem("biblia-viva-bookmarks", JSON.stringify(newBookmarks))
        toast.success("Versículo(s) guardado(s) en favoritos")
        addXP(5)
        setSelectedVerses([])
      } catch (retryError) {
        console.error("Error saving bookmark", retryError)
        toast.error("No se pudo guardar el versículo (Almacenamiento lleno)")
      }
    }
  }

  // Audio Logic
  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (audioElement) {
        audioElement.pause()
        audioElement.src = ""
      }
    }
  }, [audioElement])

  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause()
    }
    setIsPlaying(false)
    setPlayingVerse(null)
  }

  const playVerseAudio = async (verseNum: number) => {
    if (!chapterData) return

    const verse = chapterData.vers.find(v => parseInt(v.number) === verseNum)
    if (!verse) {
      // Fin del capítulo
      stopAudio()
      return
    }

    setPlayingVerse(verseNum)
    setIsPlaying(true)
    setIsLoadingAudio(true)

    try {
      // Scroll al versículo
      const element = document.getElementById(`verse-${verseNum}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }

      // Check cache
      const cacheKey = `${selectedBook.id}-${selectedChapter}-${verseNum}-${currentVoice}`
      let url = audioCache[cacheKey]

      if (!url) {
        const { audio } = await generateVerseAudio(verse.verse, currentVoice)
        url = `data:audio/mp3;base64,${audio}`
        setAudioCache(prev => ({ ...prev, [cacheKey]: url }))
      }

      // Play audio
      if (audioElement) {
        audioElement.pause()
        audioElement.src = url
        audioElement.play().catch(e => console.error("Error playing:", e))
        
        audioElement.onended = () => {
           // Play next verse
           playVerseAudio(verseNum + 1)
        }
      } else {
        const newAudio = new Audio(url)
        newAudio.play().catch(e => console.error("Error playing:", e))
        newAudio.onended = () => {
           playVerseAudio(verseNum + 1)
        }
        setAudioElement(newAudio)
      }
      
    } catch (error) {
      console.error(error)
      toast.error("Error al reproducir audio")
      stopAudio()
    } finally {
      setIsLoadingAudio(false)
    }
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      if (audioElement) audioElement.pause()
      setIsPlaying(false)
    } else {
      if (playingVerse && audioElement) {
        audioElement.play()
        setIsPlaying(true)
      } else {
        // Start from beginning or current verse
        playVerseAudio(playingVerse || 1)
      }
    }
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
    stopAudio()
  }

  const prevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(prev => prev - 1)
    }
    setSelectedVerses([])
    stopAudio()
  }

  // Búsqueda de texto
  const handleSearch = async () => {
    if (!searchQueryText.trim()) return
    
    setIsSearching(true)
    try {
      const response = await searchBible(searchQueryText)
      setSearchResults(response.results)
    } catch (error) {
      console.error("Error searching bible:", error)
      toast.error("Error al buscar en la Biblia")
    } finally {
      setIsSearching(false)
    }
  }

  const goToResult = (result: SearchResult) => {
    // Bolls API devuelve book ID (1-66). 
    // Usamos el ID para encontrar nuestro libro local.
    const flatBooks = getAllBooksFlat()
    const targetBook = flatBooks[result.book - 1]
    
    if (targetBook) {
      setSelectedBook(targetBook)
      setSelectedChapter(result.chapter)
      
      // Marcar el versículo y hacer scroll
      setSelectedVerses([result.verse])
      
      setTimeout(() => {
        const element = document.getElementById(`verse-${result.verse}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 1000)
      
      setIsSearchOpen(false)
    }
  }

  const renderSearchDialog = () => (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col p-4 animate-in fade-in">
      <div className="flex items-center justify-between mb-4 max-w-2xl mx-auto w-full gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar palabra o frase..." 
            value={searchQueryText}
            onChange={(e) => setSearchQueryText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
            autoFocus
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
        </Button>
        <Button variant="ghost" onClick={() => setIsSearchOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 max-w-2xl mx-auto w-full">
        {searchResults.length > 0 ? (
          <div className="space-y-2 pb-20">
            {searchResults.map((result) => {
               const flatBooks = getAllBooksFlat()
               const bookName = flatBooks[result.book - 1]?.nombre || "Desconocido"
               
               return (
                <Card 
                  key={result.pk} 
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => goToResult(result)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-primary">
                      {bookName} {result.chapter}:{result.verse}
                    </h4>
                  </div>
                  <div 
                    className="text-sm text-muted-foreground line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: result.text }} 
                  />
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p>Escribe una palabra para buscar en la Biblia</p>
          </div>
        )}
      </ScrollArea>
    </div>
  )

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
                const isPlayingVerse = playingVerse === verseNum
                const highlightClass = highlights[`${selectedBook.id}-${selectedChapter}`]?.[verseNum] || ""
                return (
                  <span 
                    key={verse.id || verse.number}
                    id={`verse-${verseNum}`}
                    onClick={() => toggleVerseSelection(verseNum)}
                    className={cn(
                      "inline transition-all duration-300 cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1",
                      isSelected && "bg-primary/10",
                      isPlayingVerse && "bg-primary/20 shadow-sm ring-1 ring-primary/30",
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
                const isPlayingVerse = playingVerse === verseNum
                const highlightClass = highlights[`${selectedBook.id}-${selectedChapter}`]?.[verseNum] || ""
                return (
                  <span 
                    key={verse.id || verse.number}
                    id={`verse-${verseNum}`}
                    onClick={() => toggleVerseSelection(verseNum)}
                    className={cn(
                      "inline transition-all duration-300 cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1",
                      isSelected && "bg-primary/10",
                      isPlayingVerse && "bg-primary/20 shadow-sm ring-1 ring-primary/30",
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
      {isSearchOpen && renderSearchDialog()}
      
      {/* Header de navegación */}
      <header className="border-b border-border p-4 flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowBookSelector(true)} className="gap-2">
            <Book className="w-4 h-4" />
            <span className="font-semibold">{selectedBook.nombre}</span>
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} title="Buscar">
            <Search className="w-4 h-4" />
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
           {/* Botón de Audio y Configuración */}
           <div className="flex items-center bg-muted/50 rounded-full p-1 border border-border">
             <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" title="Configurar voz">
                  <Settings2 className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Voz de lectura</h4>
                  <p className="text-sm text-muted-foreground">Selecciona el tono de voz.</p>
                  <Select value={currentVoice} onValueChange={(v: any) => {
                    stopAudio()
                    setCurrentVoice(v)
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una voz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                      <SelectItem value="echo">Echo (Grave)</SelectItem>
                      <SelectItem value="fable">Fable (Británico)</SelectItem>
                      <SelectItem value="onyx">Onyx (Profundo)</SelectItem>
                      <SelectItem value="nova">Nova (Femenino)</SelectItem>
                      <SelectItem value="shimmer">Shimmer (Claro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
             </Popover>

             <Button
               variant="ghost"
               size="icon"
               className={cn("h-9 w-9 rounded-full transition-all", isPlaying && "text-primary bg-primary/10")}
               onClick={togglePlayPause}
               disabled={isLoadingAudio}
               title={isPlaying ? "Pausar" : "Escuchar Capítulo"}
             >
               {isLoadingAudio ? (
                 <Loader2 className="w-5 h-5 animate-spin" />
               ) : isPlaying ? (
                 <Pause className="w-5 h-5" />
               ) : (
                 <Play className="w-5 h-5 ml-0.5" />
               )}
             </Button>

            {/* Botón X para cerrar/cancelar audio */}
             {(isPlaying || playingVerse !== null) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors ml-1"
                  onClick={stopAudio}
                  title="Detener audio y limpiar"
                >
                  <X className="w-4 h-4" />
                </Button>
             )}
           </div>

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
                
                {/* Botón para quitar resaltado */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleHighlight(null)}
                  className="w-8 h-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors ml-1"
                  title="Quitar resaltado"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                {/* Botón para consultar a la IA */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors ml-1"
                  title="Preguntar a la IA"
                  onClick={() => {
                    const versesToAsk = selectedVerses.sort((a, b) => a - b)
                    const verseText = versesToAsk.map(v => 
                      chapterData?.vers.find(verse => parseInt(verse.number) === v)?.verse
                    ).join(" ")
                    
                    const reference = `${selectedBook.nombre} ${selectedChapter}:${versesToAsk.join(",")}`
                    
                    router.push(`/chat?verse=${encodeURIComponent(reference)}&text=${encodeURIComponent(verseText)}`)
                  }}
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-2" />
                <Button variant="ghost" size="icon" title="Copiar">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  title="Guardar en favoritos"
                  onClick={saveBookmark}
                >
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
                const isPlayingVerse = playingVerse === verseNum
                const highlightClass = highlights[`${selectedBook.id}-${selectedChapter}`]?.[verseNum] || ""
                
                return (
                  <div 
                    id={`verse-${verseNum}`}
                    key={verse.id || verse.number}
                    onClick={() => toggleVerseSelection(verseNum)}
                    className={cn(
                      "relative group px-2 py-1 rounded transition-all duration-300 cursor-pointer hover:bg-muted/50",
                      isSelected && "bg-primary/10",
                      isPlayingVerse && "bg-primary/20 shadow-sm ring-1 ring-primary/30",
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
      {/* Audio Element oculto ya no es necesario aquí porque se maneja en el estado */}
    </div>
  )
}
