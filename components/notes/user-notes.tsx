"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Trash2, Edit2, Save, X, StickyNote } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"

interface Note {
  id: string
  title: string
  content: string
  date: string
  tags: string[]
}

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

  // Cargar notas (simulado)
  useEffect(() => {
    const saved = localStorage.getItem("biblia-viva-notes")
    if (saved) {
      setNotes(JSON.parse(saved))
    }
  }, [])

  // Guardar notas
  useEffect(() => {
    try {
      localStorage.setItem("biblia-viva-notes", JSON.stringify(notes))
    } catch (error) {
      console.warn("Storage quota exceeded, cannot save notes", error)
      toast.error("No hay espacio suficiente para guardar las notas")
    }
  }, [notes])

  const handleSaveNote = () => {
    if (!currentNote.title || !currentNote.content) {
      toast.error("El título y el contenido son obligatorios")
      return
    }

    if (isEditing && currentNote.id) {
      setNotes(notes.map(n => n.id === currentNote.id ? { ...n, ...currentNote } as Note : n))
      toast.success("Nota actualizada")
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
    }
    setIsDialogOpen(false)
    setCurrentNote({})
    setIsEditing(false)
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id))
    toast.success("Nota eliminada")
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

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mis Notas</h2>
          <p className="text-muted-foreground">Tus reflexiones y estudios personales.</p>
        </div>
        <Button onClick={openNewNote}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Nota
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar en mis notas..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <StickyNote className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No se encontraron notas.</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id} className="group relative hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="line-clamp-1 text-lg">{note.title}</CardTitle>
                <div className="text-xs text-muted-foreground">{note.date}</div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-line">
                  {note.content}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => openEditNote(note)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteNote(note.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Nota" : "Nueva Nota"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Título de la nota"
                value={currentNote.title || ""}
                onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Escribe aquí tu reflexión..."
                className="min-h-[200px]"
                value={currentNote.content || ""}
                onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveNote}>
              <Save className="mr-2 h-4 w-4" /> Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
