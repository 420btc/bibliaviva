"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { themes, characters, getAllBooksFlat } from "@/lib/bible-data"
import { searchBible, type SearchResult } from "@/lib/bible-api"
import { Search, ZoomIn, ZoomOut, Maximize2, X, BookOpen, Share2, Loader2, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

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
const createInitialNodes = (width: number, height: number): Node[] => {
  const nodes: Node[] = []
  const centerX = width / 2
  const centerY = height / 2
  const minDim = Math.min(width, height)

  // Agregar temas
  themes.forEach((theme, i) => {
    const angle = (i / themes.length) * Math.PI * 2
    const radius = minDim * 0.35 // 35% del tamaño menor
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
  // Incluimos todos los personajes
  characters.forEach((char, i) => {
    const angle = (i / characters.length) * Math.PI * 2 + Math.PI / 8
    const radius = minDim * 0.2 // 20% del tamaño menor
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
    // Conexiones de María
    { source: "char-maria", target: "theme-fe" },
    { source: "char-maria", target: "theme-gracia" },
    { source: "char-maria", target: "char-jesus" },
  ]
}

export function ThemeExplorer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Usamos ref para la animación fluida sin re-renders constantes
  const nodesRef = useRef<Node[]>([])
  const initializedRef = useRef(false)
  
  // Estado solo para reactividad de UI externa si es necesario, pero la animación va por ref
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [zoom, setZoom] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const animationRef = useRef<number | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [activeSheet, setActiveSheet] = useState<'verses' | 'connections' | null>(null)
  
  // Estados para carga dinámica de versículos
  const [dynamicVerses, setDynamicVerses] = useState<any[]>([])
  const [isLoadingVerses, setIsLoadingVerses] = useState(false)

  // Cargar versículos adicionales cuando se abre el sheet
  useEffect(() => {
    const fetchMoreVerses = async () => {
      if (activeSheet === 'verses' && selectedNode) {
        setIsLoadingVerses(true)
        setDynamicVerses([]) // Limpiar anteriores
        
        try {
          // Obtener versículos base del hardcode (los 2 iniciales)
          const baseData = getSelectedData() as any
          const initialVerses = baseData?.relatedVerses || []
          
          // Buscar más en la API
          // Usamos el nombre del nodo como query (ej: "Amor", "Jesús")
          const searchRes = await searchBible(selectedNode.label, "RV1960", 1, 10)
          
          // Filtrar duplicados y mapear nombres de libros
          const allBooks = getAllBooksFlat()
          
          const newVerses = searchRes.results
            .filter(r => !initialVerses.some((iv: any) => 
               (iv.texto && r.text.includes(iv.texto.substring(0, 10)))
            ))
            .map(r => {
              const bookName = allBooks[r.book - 1]?.nombre || "Biblia"
              return {
                libro: bookName,
                capitulo: r.chapter,
                versiculo: r.verse,
                texto: r.text.replace(/<[^>]*>/g, ''), // Limpiar HTML
                esExtra: true
              }
            })

          setDynamicVerses(newVerses)
        } catch (e) {
          console.error("Error fetching extra verses", e)
        } finally {
          setIsLoadingVerses(false)
        }
      }
    }

    if (activeSheet === 'verses') {
      fetchMoreVerses()
    }
  }, [activeSheet, selectedNode])

  // Manejar redimensionamiento
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current
        setDimensions({ width: clientWidth, height: clientHeight })
      }
    }

    window.addEventListener('resize', updateSize)
    updateSize()

    return () => window.removeEventListener('resize', updateSize)
  }, [])
  
  // Inicialización única
  useEffect(() => {
    if (!initializedRef.current && dimensions.width > 0) {
      nodesRef.current = createInitialNodes(dimensions.width, dimensions.height)
      initializedRef.current = true
    }
  }, [dimensions])

  const [connections] = useState<Connection[]>(createConnections)

  // Simulación de física simplificada (trabaja directamente sobre refs)
  const updatePhysics = useCallback(() => {
    const nodes = nodesRef.current
    const width = dimensions.width
    const height = dimensions.height
    
    if (width === 0 || height === 0) return

    // Aplicar fuerzas
    nodes.forEach((node, i) => {
      // Repulsión entre nodos (AUMENTADA para más separación)
      nodes.forEach((other, j) => {
        if (i === j) return
        const dx = node.x - other.x
        const dy = node.y - other.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        
        // Mucho más fuerza de repulsión y radio de efecto
        const force = 50000 / (dist * dist) 
        node.vx += (dx / dist) * force * 0.05
        node.vy += (dy / dist) * force * 0.05
      })

      // Atracción al centro (suave)
      const centerX = width / 2
      const centerY = height / 2
      node.vx += (centerX - node.x) * 0.0005
      node.vy += (centerY - node.y) * 0.0005

      // Fricción
      node.vx *= 0.92 // Un poco más de fricción para estabilidad
      node.vy *= 0.92

      // Actualizar posición
      node.x += node.vx
      node.y += node.vy

      // Límites dinámicos con margen
      const margin = 50
      node.x = Math.max(margin, Math.min(width - margin, node.x))
      node.y = Math.max(margin, Math.min(height - margin, node.y))
    })
  }, [dimensions])

  // Dibujar en canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustar resolución para pantallas retina/HiDPI
    const dpr = window.devicePixelRatio || 1
    canvas.width = dimensions.width * dpr
    canvas.height = dimensions.height * dpr
    
    // Necesario para que el CSS lo muestre al tamaño correcto
    canvas.style.width = `${dimensions.width}px`
    canvas.style.height = `${dimensions.height}px`

    const draw = () => {
      // Reset transform y clear con el tamaño real en pixels
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Escalar todo por DPR y Zoom
      ctx.scale(dpr * zoom, dpr * zoom)
      
      // Ajustar centro del zoom (opcional, por ahora simple scale)
      // Para centrar el zoom, necesitaríamos trasladar el canvas antes de escalar

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
  const filteredCharacters = characters.filter((c) => c.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  const getSelectedData = () => {
    if (!selectedNode) return null
    if (selectedNode.type === 'theme') {
      return themes.find(t => `theme-${t.id}` === selectedNode.id)
    }
    return characters.find(c => `char-${c.id}` === selectedNode.id)
  }

  const getConnectedNodes = () => {
    if (!selectedNode) return []
    return connections
      .filter(c => c.source === selectedNode.id || c.target === selectedNode.id)
      .map(c => {
        const otherId = c.source === selectedNode.id ? c.target : c.source
        return nodesRef.current.find(n => n.id === otherId)
      })
      .filter(Boolean) as Node[]
  }

  const selectedData = getSelectedData()

  return (
    <div className="h-full flex flex-col">
      <Sheet open={!!activeSheet} onOpenChange={(open) => !open && setActiveSheet(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {activeSheet === 'verses' ? 'Versículos Relacionados' : 'Conexiones'}
            </SheetTitle>
            <SheetDescription>
              {activeSheet === 'verses' 
                ? `Pasajes bíblicos sobre ${selectedNode?.label}`
                : `Explora cómo se conecta ${selectedNode?.label} con otros conceptos`
              }
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-4 pr-4">
            {activeSheet === 'verses' && selectedData && 'relatedVerses' in selectedData && (
              <div className="space-y-4 pb-10">
                {/* Versículos Originales */}
                {(selectedData as any).relatedVerses?.map((verse: any, i: number) => (
                  <Card key={`orig-${i}`} className="p-4 bg-secondary/50 border-0">
                    <p className="text-sm text-foreground italic mb-2">"{verse.texto}"</p>
                    <p className="text-xs font-semibold text-primary text-right">
                      {verse.libro} {verse.capitulo}:{verse.versiculo}
                    </p>
                  </Card>
                ))}

                {/* Versículos Dinámicos */}
                {dynamicVerses.map((verse: any, i: number) => (
                  <Card key={`dyn-${i}`} className="p-4 bg-background/50 border border-border/50 animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-sm text-foreground italic mb-2">"{verse.texto}"</p>
                    <p className="text-xs font-semibold text-primary text-right flex justify-end items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-500/50" />
                      {verse.libro} {verse.capitulo}:{verse.versiculo}
                    </p>
                  </Card>
                ))}

                {isLoadingVerses && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            )}
            
            {activeSheet === 'connections' && (
              <div className="space-y-2">
                {getConnectedNodes().map(node => (
                  <Button
                    key={node.id}
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto p-3"
                    onClick={() => {
                      setSelectedNode(node)
                      setActiveSheet(null) // Opcional: mantener abierto o cerrar
                    }}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: node.color }} />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{node.label}</span>
                      <span className="text-xs text-muted-foreground capitalize">{node.type === 'theme' ? 'Tema' : 'Personaje'}</span>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

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
        <div className="w-64 border-r border-border p-4 hidden lg:block overflow-y-auto">
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
            {filteredCharacters.map((char) => (
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
        <div className="flex-1 relative bg-background" ref={containerRef}>
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-pointer touch-none"
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
                    <Button 
                      className="w-full gap-2 gradient-primary border-0" 
                      size="sm"
                      onClick={() => setActiveSheet('verses')}
                    >
                      Ver versículos
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full bg-transparent" 
                      size="sm"
                      onClick={() => setActiveSheet('connections')}
                    >
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
