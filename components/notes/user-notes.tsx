"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Trash2, Edit2, Save, X, StickyNote } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"
import { getUserNotesAction, saveNoteAction, deleteNoteAction, syncNotesAction, type Note } from "@/actions/notes"

const initialNotes: Note[] = [
  {
    id: "1",
    title: "Reflexión sobre Salmos 23",
    content: "El Señor es mi pastor, nada me faltará. Esta promesa es fundamental para entender la provisión divina...",
    date: "2024-03-10",
    tags: ["Salmos", "Confianza"]
  },
  {
    id: "2",
    title: "Estudio de Romanos",
    content: "La justificación por la fe es el tema central de los primeros capítulos.",
    date: "2024-03-12",
    tags: ["Romanos", "Doctrina"]
  }
]

export function UserNotes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({})
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar notas
  useEffect(() => {
    const loadNotes = async () => {
        let loadedNotes: Note[] = []
        let hasLoadedFromDB = false

        // 1. Load from DB
        if (user?.id) {
            try {
                const dbResult = await getUserNotesAction(user.id)
                if (dbResult.success && dbResult.data && dbResult.data.length > 0) {
                    loadedNotes = dbResult.data
                    hasLoadedFromDB = true
                }
            } catch (e) { console.error(e) }
        }

        // 2. Load from localStorage
        const saved = localStorage.getItem("biblia-viva-notes")
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                // Migration: If DB had nothing but local has data, sync local to DB
                if (!hasLoadedFromDB && parsed.length > 0 && user?.id) {
                    await syncNotesAction(user.id, parsed)
                    loadedNotes = parsed
                } else if (!hasLoadedFromDB) {
                    // Fallback to local if no DB user or DB error
                    loadedNotes = parsed
                }
            } catch (e) { console.error(e) }
        }

        if (loadedNotes.length > 0) {
            setNotes(loadedNotes)
        }
        setIsLoaded(true)
    }
    loadNotes()
  }, [user])

  // Guardar notas (local backup)
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem("biblia-viva-notes", JSON.stringify(notes))
    } catch (error) {
       // Ignorar error de quota, la DB es la fuente principal
       console.warn("Storage quota exceeded, cannot save notes to localStorage")
    }
  }, [notes, isLoaded])

  const handleSaveNote = async () => {
    if (!currentNote.title || !currentNote.content) {
      toast.error("El título y el contenido son obligatorios")
      return
    }

    if (isEditing && currentNote.id) {
      const updatedNote = { ...notes.find(n => n.id === currentNote.id), ...currentNote } as Note
      const updatedNotes = notes.map(n => n.id === currentNote.id ? updatedNote : n)
      setNotes(updatedNotes)
      toast.success("Nota actualizada")
      
      if (user?.id) {
          saveNoteAction(user.id, updatedNote)
      }
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: currentNote.title,
        content: currentNote.content,
        date: new Date().toISOString().split('T')[0],
        tags: [] // Implementar tags luego
      }
      setNotes([newNote, ...notes])
      toast.success("Nota creada")
      
      if (user?.id) {
          saveNoteAction(user.id, newNote)
      }
    }
    setIsDialogOpen(false)
    setCurrentNote({})
    setIsEditing(false)
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id))
    toast.success("Nota eliminada")
    if (user?.id) {
        deleteNoteAction(user.id, id)
    }
  }

  const openNewNote = () => {
    setCurrentNote({})
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  const openEditNote = (note: Note) => {
    setCurrentNote(note)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar en tus notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openNewNote} className="w-full md:w-auto gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Nota
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold line-clamp-1">{note.title}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditNote(note)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{note.date}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
            </CardContent>
            <CardFooter className="pt-2 flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </CardFooter>
          </Card>
        ))}
        {filteredNotes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
            <StickyNote className="h-16 w-16 mb-4" />
            <p>No se encontraron notas</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Nota" : "Nueva Nota"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Título"
                value={currentNote.title || ""}
                onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Escribe tu reflexión aquí..."
                className="min-h-[200px]"
                value={currentNote.content || ""}
                onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveNote} className="gradient-primary">
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
