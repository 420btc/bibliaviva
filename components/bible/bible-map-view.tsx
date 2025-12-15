"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { getGeographicContext } from "@/lib/openai-actions"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Info } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Importar mapa dinámicamente para evitar errores de SSR
const MapDisplay = dynamic(() => import("./map-display"), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center text-muted-foreground">Cargando mapa...</div>
})

interface BibleMapViewProps {
    book: string
    chapter: number
}

interface Location {
    name: string
    description: string
    coordinates: { lat: number; lng: number }
    type: string
}

export function BibleMapView({ book, chapter }: BibleMapViewProps) {
    const [locations, setLocations] = useState<Location[]>([])
    const [summary, setSummary] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        let mounted = true

        const fetchContext = async () => {
            setLoading(true)
            setError(false)
            try {
                const data = await getGeographicContext(book, chapter)
                if (mounted && data) {
                    setLocations(data.locations || [])
                    setSummary(data.summary || "")
                }
            } catch (err) {
                console.error(err)
                if (mounted) setError(true)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        fetchContext()

        return () => { mounted = false }
    }, [book, chapter])

    if (loading) {
        return (
            <div className="flex flex-col gap-4 h-full w-full p-4">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="w-full flex-1 rounded-lg" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                    <Info className="w-8 h-8 opacity-50" />
                    <p>No se pudo cargar el contexto geográfico.</p>
                </div>
            </div>
        )
    }

    if (locations.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                    <MapPin className="w-8 h-8 opacity-50" />
                    <p>No se encontraron lugares geográficos específicos en este capítulo.</p>
                    <p className="text-xs max-w-xs">{summary}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full md:flex-row gap-4 p-4 pt-0">
            <div className="w-full md:w-3/4 h-[400px] md:h-full rounded-lg overflow-hidden border shadow-sm relative z-0">
                <MapDisplay locations={locations} />
            </div>
            
            <div className="w-full md:w-1/4 flex flex-col gap-4 h-full overflow-hidden">
                <div className="bg-secondary/20 p-4 rounded-lg border shrink-0">
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2 text-primary">
                        <Info className="w-4 h-4" /> 
                        Contexto Histórico
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
                </div>
                
                <div className="flex-1 flex flex-col min-h-0">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 px-1">
                        <MapPin className="w-4 h-4" />
                        Lugares ({locations.length})
                    </h3>
                    <ScrollArea className="flex-1 pr-4 -mr-4">
                        <div className="space-y-3 pr-4 pb-4">
                            {locations.map((loc, idx) => (
                                <Card key={idx} className="p-3 text-sm hover:bg-accent/50 transition-colors cursor-default border-l-4 border-l-primary/20 hover:border-l-primary">
                                    <div className="flex items-start gap-2">
                                        <div className="mt-0.5 bg-primary/10 p-1.5 rounded-full shrink-0">
                                            <MapPin className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">{loc.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1 leading-snug">{loc.description}</p>
                                            <span className="text-[10px] uppercase tracking-wider text-primary/70 mt-2 block font-medium bg-primary/5 w-fit px-1.5 py-0.5 rounded">
                                                {loc.type}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}
