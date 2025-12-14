"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Plus, MessageCircle, BookOpen, Search, Crown, Send } from "lucide-react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const initialGrupos = [
  {
    id: "1",
    nombre: "Jóvenes en Cristo",
    miembros: 24,
    descripcion: "Grupo de estudio para jóvenes de 18-30 años",
    activo: true,
    ultimaActividad: "Hace 2 horas",
    lecturaActual: "Romanos 8",
  },
  {
    id: "2",
    nombre: "Mujeres de Fe",
    miembros: 18,
    descripcion: "Estudio bíblico enfocado en mujeres de la Biblia",
    activo: true,
    ultimaActividad: "Hace 5 horas",
    lecturaActual: "Ester 4",
  },
  {
    id: "3",
    nombre: "Matrimonios Bendecidos",
    miembros: 12,
    descripcion: "Parejas explorando principios bíblicos para el matrimonio",
    activo: false,
    ultimaActividad: "Hace 1 día",
    lecturaActual: "Efesios 5",
  },
]

const mensajesGrupo = [
  {
    id: "1",
    usuario: "María",
    mensaje: "¡Buenos días! ¿Qué les pareció la lectura de ayer?",
    hora: "9:30 AM",
    avatar: "M",
  },
  {
    id: "2",
    usuario: "Carlos",
    mensaje: "Muy interesante el versículo 28. Me hizo reflexionar mucho.",
    hora: "9:45 AM",
    avatar: "C",
  },
  {
    id: "3",
    usuario: "Ana",
    mensaje: "Sí, especialmente la parte sobre ser más que vencedores. ¡Qué promesa!",
    hora: "10:02 AM",
    avatar: "A",
  },
  {
    id: "4",
    usuario: "Pedro",
    mensaje: 'Les comparto mi nota: "Nada nos puede separar del amor de Dios" - esto me da paz en tiempos difíciles.',
    hora: "10:15 AM",
    avatar: "P",
  },
]

export function GroupsPage() {
  const [grupos, setGrupos] = useState(initialGrupos)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  
  // Form states
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDesc, setNewGroupDesc] = useState("")
  const [newGroupReading, setNewGroupReading] = useState("")

  const grupo = grupos.find((g) => g.id === selectedGroup)
  
  const handleCreateGroup = () => {
    if (!newGroupName || !newGroupDesc) {
      toast.error("Por favor completa el nombre y la descripción")
      return
    }

    const newGroup = {
      id: Date.now().toString(),
      nombre: newGroupName,
      miembros: 1,
      descripcion: newGroupDesc,
      activo: true,
      ultimaActividad: "Ahora mismo",
      lecturaActual: newGroupReading || "Génesis 1",
    }

    setGrupos([newGroup, ...grupos])
    setSelectedGroup(newGroup.id)
    setIsCreateGroupOpen(false)
    
    // Reset form
    setNewGroupName("")
    setNewGroupDesc("")
    setNewGroupReading("")
    
    toast.success("¡Grupo creado exitosamente!")
  }

  // Mensajes de chat más dinámicos y realistas
  const renderMessageBubble = (msg: typeof mensajesGrupo[0]) => {
    const isMe = msg.usuario === "Tú" // Placeholder para usuario actual si lo hubiera
    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
      >
        <Avatar className="w-8 h-8 mt-1">
          <AvatarFallback className={`text-xs ${isMe ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
             {msg.avatar}
          </AvatarFallback>
        </Avatar>
        <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-medium text-foreground text-xs">{msg.usuario}</span>
            <span className="text-[10px] text-muted-foreground">{msg.hora}</span>
          </div>
          <div className={`
            p-3 rounded-2xl text-sm shadow-sm
            ${isMe 
              ? 'bg-primary text-primary-foreground rounded-tr-none' 
              : 'bg-card border border-border rounded-tl-none'
            }
          `}>
            {msg.mensaje}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="h-full w-full flex overflow-hidden bg-background">
      {/* Lista de grupos */}
      <div 
        className={`
          ${selectedGroup ? "hidden lg:flex" : "flex"} 
          flex-col w-full lg:w-96 border-r border-border h-full bg-card
        `}
      >
        <div className="p-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground">Grupos de Estudio</h1>
            <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
              <DialogTrigger asChild>
                <Button size="icon" className="gradient-primary border-0">
                  <Plus className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear nuevo grupo</DialogTitle>
                  <DialogDescription>
                    Crea un espacio para estudiar la Biblia junto a otros hermanos.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre del grupo</Label>
                    <Input
                      id="name"
                      placeholder="Ej: Jóvenes de Valor"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      placeholder="¿Cuál es el propósito de este grupo?"
                      value={newGroupDesc}
                      onChange={(e) => setNewGroupDesc(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reading">Lectura inicial (Opcional)</Label>
                    <Input
                      id="reading"
                      placeholder="Ej: Salmos 1"
                      value={newGroupReading}
                      onChange={(e) => setNewGroupReading(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)}>Cancelar</Button>
                  <Button className="gradient-primary border-0" onClick={handleCreateGroup}>Crear Grupo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar grupo..." className="pl-10 bg-secondary border-0" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 px-6 space-y-4">
            {grupos.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="px-1 py-1"
              >
                <Card
                  className={`glass-card p-4 cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${
                    selectedGroup === group.id ? "border-primary ring-1 ring-primary/20" : ""
                  }`}
                  onClick={() => setSelectedGroup(group.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground leading-tight">{group.nombre}</h3>
                        {group.activo && <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-snug mb-2">{group.descripcion}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {group.miembros}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {group.lecturaActual}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Card para unirse a más grupos */}
            <Card className="glass-card p-4 border-dashed">
              <div className="text-center">
                <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">Únete a más grupos o crea el tuyo</p>
                <Button variant="outline" size="sm">
                  Explorar Grupos
                </Button>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </div>

      {/* Chat del grupo */}
      {selectedGroup && grupo ? (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
          {/* Header del chat */}
          <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSelectedGroup(null)}>
                ←
              </Button>
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{grupo.nombre}</h2>
                <p className="text-xs text-muted-foreground">{grupo.miembros} miembros</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">{grupo.lecturaActual}</span>
              </Button>
            </div>
          </div>

          {/* Mensajes */}
          <ScrollArea className="flex-1 p-4 bg-secondary/5">
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Info de lectura actual */}
              <div className="flex justify-center my-6">
                 <div className="bg-accent/10 border border-accent/20 rounded-full px-4 py-1 flex items-center gap-2">
                    <BookOpen className="w-3 h-3 text-accent" />
                    <span className="text-xs text-muted-foreground">Lectura actual: <span className="font-semibold text-foreground">{grupo.lecturaActual}</span></span>
                 </div>
              </div>

              {/* Mensajes */}
              {mensajesGrupo.map(renderMessageBubble)}

              {/* Nota compartida */}
              <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex justify-center"
              >
                <Card className="glass-card p-4 max-w-md w-full bg-yellow-500/5 border-yellow-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 rounded bg-yellow-500/10">
                       <Crown className="w-4 h-4 text-yellow-500" />
                    </div>
                    <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Nota destacada del líder</span>
                  </div>
                  <p className="text-sm text-foreground italic relative pl-4 border-l-2 border-yellow-500/30">
                    &ldquo;Romanos 8:28 nos recuerda que Dios trabaja en todas las cosas para el bien de quienes le
                    aman.&rdquo;
                  </p>
                </Card>
              </motion.div>
            </div>
          </ScrollArea>

          {/* Input de mensaje */}
          <div className="p-4 border-t border-border shrink-0 bg-card/50 backdrop-blur-sm">
            <div className="flex gap-3 max-w-4xl mx-auto w-full">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-secondary border-0"
              />
              <Button className="gradient-primary border-0">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-secondary/5 h-full p-6">
          <div className="text-center p-8 max-w-md w-full bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5">
               <MessageCircle className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Comunidad Bíblica</h3>
            <p className="text-muted-foreground text-lg mb-6">
              Selecciona un grupo para comenzar a estudiar y compartir con otros hermanos en la fe.
            </p>
            <Button className="gradient-primary border-0" onClick={() => setSelectedGroup(grupos[0].id)}>
              <Users className="w-4 h-4 mr-2" />
              Ver primer grupo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
