"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { themes, characters } from "@/lib/bible-data"
import { Search, ZoomIn, ZoomOut, Maximize2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Node {
  id: string
  type: "theme" | "character" | "verse"
  label: string
  color: string
  x: number
  y: number
  vx: number
  vy: number
  connections: string[]
}

interface Connection {
  source: string
  target: string
}

// Crear nodos iniciales
const createInitialNodes = (): Node[] => {
  const nodes: Node[] = []
  const centerX = 400
  const centerY = 300

  // Agregar temas
  themes.forEach((theme, i) => {
    const angle = (i / themes.length) * Math.PI * 2
    const radius = 200
    nodes.push({
      id: `theme-${theme.id}`,
      type: "theme",
      label: theme.nombre,
      color: theme.color,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      connections: [],
    })
  })

  // Agregar personajes
  characters.slice(0, 6).forEach((char, i) => {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 8
    const radius = 120
    nodes.push({
      id: `char-${char.id}`,
      type: "character",
      label: char.nombre,
      color: "#6366f1",
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      connections: [],
    })
  })

  return nodes
}

// Crear conexiones
const createConnections = (): Connection[] => {
  return [
    { source: "theme-amor", target: "char-jesus" },
    { source: "theme-fe", target: "char-abraham" },
    { source: "theme-sabiduria", target: "char-salomon" },
    { source: "theme-oracion", target: "char-david" },
    { source: "theme-gracia", target: "char-pablo" },
    { source: "theme-esperanza", target: "char-pedro" },
    { source: "char-jesus", target: "theme-perdon" },
    { source: "char-jesus", target: "theme-paz" },
    { source: "char-moises", target: "theme-fe" },
    { source: "char-david", target: "theme-amor" },
  ]
}

export function ThemeExplorer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Usamos ref para la animación fluida sin re-renders constantes
  const nodesRef = useRef<Node[]>([])
  const initializedRef = useRef(false)
  
  // Estado solo para reactividad de UI externa si es necesario, pero la animación va por ref
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [zoom, setZoom] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const animationRef = useRef<number | null>(null)
  
  // Inicialización única
  useEffect(() => {
    if (!initializedRef.current) {
      nodesRef.current = createInitialNodes()
      initializedRef.current = true
    }
  }, [])

  const [connections] = useState<Connection[]>(createConnections)

  // Simulación de física simplificada (trabaja directamente sobre refs)
  const updatePhysics = useCallback(() => {
    const nodes = nodesRef.current
    
    // Aplicar fuerzas
    nodes.forEach((node, i) => {
      // Repulsión entre nodos
      nodes.forEach((other, j) => {
        if (i === j) return
        const dx = node.x - other.x
        const dy = node.y - other.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = 1000 / (dist * dist)
        node.vx += (dx / dist) * force * 0.01
        node.vy += (dy / dist) * force * 0.01
      })

      // Atracción al centro
      const centerX = 400
      const centerY = 300
      node.vx += (centerX - node.x) * 0.0001
      node.vy += (centerY - node.y) * 0.0001

      // Fricción
      node.vx *= 0.95
      node.vy *= 0.95

      // Actualizar posición
      node.x += node.vx
      node.y += node.vy

      // Límites
      node.x = Math.max(50, Math.min(750, node.x))
      node.y = Math.max(50, Math.min(550, node.y))
    })
  }, [])

  // Dibujar en canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Aplicar zoom
      ctx.save()
      ctx.scale(zoom, zoom)

      const nodes = nodesRef.current

      // Dibujar conexiones
      connections.forEach((conn) => {
        const source = nodes.find((n) => n.id === conn.source)
        const target = nodes.find((n) => n.id === conn.target)
        if (!source || !target) return

        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)
        ctx.strokeStyle = "rgba(99, 102, 241, 0.3)"
        ctx.lineWidth = 2
        ctx.stroke()
      })

      // Dibujar nodos
      nodes.forEach((node) => {
        const isSelected = selectedNode?.id === node.id
        const radius = node.type === "theme" ? 30 : 20

        // Glow si está seleccionado
        if (isSelected) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, radius + 10, 0, Math.PI * 2)
          ctx.fillStyle = `${node.color}33`
          ctx.fill()
        }

        // Círculo principal
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()
        ctx.strokeStyle = isSelected ? "#fff" : "rgba(255,255,255,0.3)"
        ctx.lineWidth = isSelected ? 3 : 1
        ctx.stroke()

        // Etiqueta
        ctx.fillStyle = "#fff"
        ctx.font = `${isSelected ? "bold " : ""}12px sans-serif`
        ctx.textAlign = "center"
        ctx.fillText(node.label, node.x, node.y + radius + 16)
      })

      ctx.restore()

      updatePhysics()
      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [connections, selectedNode, zoom, updatePhysics])

  // Manejar clic en canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    const clickedNode = nodesRef.current.find((node) => {
      const radius = node.type === "theme" ? 30 : 20
      const dx = node.x - x
      const dy = node.y - y
      return Math.sqrt(dx * dx + dy * dy) < radius
    })

    setSelectedNode(clickedNode || null)
  }

  const filteredThemes = themes.filter((t) => t.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="h-full flex flex-col">
      {/* Encabezado */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
          <div>
            <h1 className="text-xl font-bold text-foreground">Explorador Temático</h1>
            <p className="text-sm text-muted-foreground">Descubre conexiones entre temas, personajes y pasajes</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar tema..."
                className="pl-10 w-48 bg-secondary border-0"
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Lista de temas */}
        <div className="w-64 border-r border-border p-4 hidden lg:block">
          <h3 className="font-semibold text-foreground mb-3">Temas</h3>
          <div className="space-y-2">
            {filteredThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  const node = nodesRef.current.find((n) => n.id === `theme-${theme.id}`)
                  setSelectedNode(node || null)
                }}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.color }} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{theme.nombre}</p>
                  <p className="text-xs text-muted-foreground">{theme.versiculos} versículos</p>
                </div>
              </button>
            ))}
          </div>

          <h3 className="font-semibold text-foreground mb-3 mt-6">Personajes</h3>
          <div className="space-y-2">
            {characters.slice(0, 6).map((char) => (
              <button
                key={char.id}
                onClick={() => {
                  const node = nodesRef.current.find((n) => n.id === `char-${char.id}`)
                  setSelectedNode(node || null)
                }}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
              >
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{char.nombre}</p>
                  <p className="text-xs text-muted-foreground">{char.menciones} menciones</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas del grafo */}
        <div className="flex-1 relative bg-background">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-pointer"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          />

          {/* Panel de detalles */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-4 right-4 w-72"
              >
                <Card className="glass-card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedNode.color }} />
                      <h3 className="font-semibold text-foreground">{selectedNode.label}</h3>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedNode(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedNode.type === "theme"
                      ? `Explora versículos sobre ${selectedNode.label.toLowerCase()}`
                      : `Descubre pasajes relacionados con ${selectedNode.label}`}
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full gap-2 gradient-primary border-0" size="sm">
                      Ver versículos
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      Ver conexiones
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Leyenda */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500" />
              <span>Temas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span>Personajes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
