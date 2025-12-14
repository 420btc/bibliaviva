"use client"

import { useState, useEffect } from "react"
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
import { useAuth } from "@/components/auth-provider"
import { getGroupsAction, createGroupAction, getGroupMessagesAction, sendGroupMessageAction, type Group, type GroupMessage } from "@/actions/groups"

export function GroupsPage() {
  const [grupos, setGrupos] = useState<Group[]>([])
  const [selectedGrupo, setSelectedGrupo] = useState<Group | null>(null)
  const [mensajes, setMensajes] = useState<GroupMessage[]>([])
  const [nuevoMensaje, setNuevoMensaje] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [newGroupData, setNewGroupData] = useState({ nombre: "", descripcion: "" })
  const { user } = useAuth()

  // Cargar grupos
  useEffect(() => {
    const loadGroups = async () => {
        const result = await getGroupsAction()
        if (result.success && result.data) {
            setGrupos(result.data)
        }
    }
    loadGroups()
  }, [])

  // Cargar mensajes cuando se selecciona un grupo
  useEffect(() => {
    if (selectedGrupo) {
        const loadMessages = async () => {
            const result = await getGroupMessagesAction(selectedGrupo.id)
            if (result.success && result.data) {
                setMensajes(result.data)
            } else {
                setMensajes([])
            }
        }
        loadMessages()
        // Could set up polling here
    }
  }, [selectedGrupo])

  const handleCreateGroup = async () => {
    if (!newGroupData.nombre || !newGroupData.descripcion) {
      toast.error("Por favor completa todos los campos")
      return
    }
    
    if (!user) {
        toast.error("Debes iniciar sesión para crear un grupo")
        return
    }

    const result = await createGroupAction(user.id, newGroupData.nombre, newGroupData.descripcion)
    
    if (result.success) {
        const nuevoGrupo: Group = {
            id: result.id || Date.now().toString(),
            name: newGroupData.nombre,
            members: 1,
            description: newGroupData.descripcion,
            active: true,
            lastActivity: "Ahora mismo",
            currentReading: "Inicio",
        }
        setGrupos([nuevoGrupo, ...grupos])
        setIsCreating(false)
        setNewGroupData({ nombre: "", descripcion: "" })
        toast.success("Grupo creado exitosamente")
    } else {
        toast.error("Error al crear el grupo")
    }
  }

  const handleSendMessage = async () => {
    if (!nuevoMensaje.trim() || !selectedGrupo || !user) return

    const result = await sendGroupMessageAction(selectedGrupo.id, user.id, user.name, nuevoMensaje)

    if (result.success) {
        const mensaje: GroupMessage = {
            id: Date.now().toString(),
            user: user.name,
            message: nuevoMensaje,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: user.name[0],
        }
        setMensajes([...mensajes, mensaje])
        setNuevoMensaje("")
    } else {
        toast.error("Error al enviar mensaje")
    }
  }

  const filteredGrupos = grupos.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comunidad y Grupos</h1>
          <p className="text-muted-foreground">Conecta con otros creyentes y estudien juntos</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              Crear Grupo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Grupo de Estudio</DialogTitle>
              <DialogDescription>
                Invita a otros a estudiar la Biblia juntos.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Grupo</Label>
                <Input 
                  id="nombre" 
                  placeholder="Ej: Jóvenes en Victoria" 
                  value={newGroupData.nombre}
                  onChange={(e) => setNewGroupData({...newGroupData, nombre: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea 
                  id="descripcion" 
                  placeholder="¿De qué trata este grupo?" 
                  value={newGroupData.descripcion}
                  onChange={(e) => setNewGroupData({...newGroupData, descripcion: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
              <Button onClick={handleCreateGroup}>Crear Grupo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Lista de Grupos */}
        <Card className="lg:col-span-1 flex flex-col h-full glass-card">
          <div className="p-4 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar grupos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {filteredGrupos.map((grupo) => (
                <div
                  key={grupo.id}
                  onClick={() => setSelectedGrupo(grupo)}
                  className={`p-4 rounded-xl cursor-pointer transition-all hover:bg-secondary/50 border ${
                    selectedGrupo?.id === grupo.id
                      ? "bg-secondary border-primary/50 shadow-sm"
                      : "bg-background/50 border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{grupo.name}</h3>
                    {grupo.active && <span className="w-2 h-2 rounded-full bg-green-500 mt-2" />}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{grupo.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {grupo.members}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {grupo.currentReading}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat del Grupo */}
        <Card className="lg:col-span-2 flex flex-col h-full glass-card relative overflow-hidden">
          {selectedGrupo ? (
            <>
              <div className="p-4 border-b border-border/50 flex justify-between items-center bg-background/50 backdrop-blur-sm z-10">
                <div>
                  <h2 className="font-bold flex items-center gap-2">
                    {selectedGrupo.name}
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedGrupo.members} miembros • {selectedGrupo.currentReading}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Crown className="w-5 h-5 text-yellow-500" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {mensajes.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.user === user?.name ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{msg.avatar}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.user === user?.name
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-secondary text-secondary-foreground rounded-tl-none"
                        }`}
                      >
                        <div className="flex justify-between items-baseline gap-4 mb-1">
                          <span className="text-xs font-bold opacity-80">{msg.user}</span>
                          <span className="text-[10px] opacity-60">{msg.time}</span>
                        </div>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  {mensajes.length === 0 && (
                      <div className="text-center text-muted-foreground mt-10">
                          <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
                      </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 bg-background/50 backdrop-blur-sm border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    placeholder="Escribe un mensaje..."
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button size="icon" onClick={handleSendMessage} className="gradient-primary">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
              <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-lg font-semibold mb-2">Selecciona un grupo</h3>
              <p className="text-center max-w-sm">
                Elige un grupo de la lista para ver el chat y unirte a la conversación.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
