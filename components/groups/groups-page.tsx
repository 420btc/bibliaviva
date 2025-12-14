"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Plus, MessageCircle, BookOpen, Search, Crown, Send } from "lucide-react"
import { motion } from "framer-motion"

const grupos = [
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
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [chatMessage, setChatMessage] = useState("")

  const grupo = grupos.find((g) => g.id === selectedGroup)

  return (
    <div className="h-full flex">
      {/* Lista de grupos */}
      <div className={`${selectedGroup ? "hidden lg:flex" : "flex"} flex-col w-full lg:w-80 border-r border-border`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground">Grupos de Estudio</h1>
            <Button size="icon" className="gradient-primary border-0">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar grupo..." className="pl-10 bg-secondary border-0" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {grupos.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`glass-card p-4 cursor-pointer transition-all hover:border-primary/50 ${
                    selectedGroup === group.id && "border-primary"
                  }`}
                  onClick={() => setSelectedGroup(group.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{group.nombre}</h3>
                        {group.activo && <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{group.descripcion}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
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
        <div className="flex-1 flex flex-col">
          {/* Header del chat */}
          <div className="p-4 border-b border-border flex items-center justify-between">
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
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {/* Info de lectura actual */}
              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Lectura actual del grupo</p>
                <p className="font-semibold text-foreground">{grupo.lecturaActual}</p>
                <Button variant="link" size="sm" className="text-primary">
                  Abrir en lector
                </Button>
              </div>

              {/* Mensajes */}
              {mensajesGrupo.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-secondary text-sm">{msg.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-foreground text-sm">{msg.usuario}</span>
                      <span className="text-xs text-muted-foreground">{msg.hora}</span>
                    </div>
                    <p className="text-foreground/90 text-sm mt-1">{msg.mensaje}</p>
                  </div>
                </motion.div>
              ))}

              {/* Nota compartida */}
              <Card className="glass-card p-4 ml-11">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Nota destacada del líder</span>
                </div>
                <p className="text-sm text-foreground italic">
                  &ldquo;Romanos 8:28 nos recuerda que Dios trabaja en todas las cosas para el bien de quienes le
                  aman.&rdquo;
                </p>
              </Card>
            </div>
          </ScrollArea>

          {/* Input de mensaje */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-3">
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
        <div className="hidden lg:flex flex-1 items-center justify-center bg-secondary/20">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Selecciona un grupo</h3>
            <p className="text-muted-foreground">Elige un grupo de la lista para ver el chat</p>
          </div>
        </div>
      )}
    </div>
  )
}
