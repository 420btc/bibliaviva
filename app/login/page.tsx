"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Sparkles, BookOpen, MessageCircle, Users, Trophy, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ShaderBackground } from "@/components/ui/digital-aurora"

export default function LoginPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email) {
      login(name, email)
    }
  }

  const features = [
    { icon: BookOpen, text: "Lectura Bíblica Interactiva" },
    { icon: MessageCircle, text: "Asistente IA Espiritual" },
    { icon: Users, text: "Comunidad y Grupos" },
    { icon: Trophy, text: "Gamificación y Logros" }
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 z-0">
          <ShaderBackground />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10">
        
        {/* Columna Izquierda: Formulario */}
        <Card className="w-full p-8 glass-card border-primary/20 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-24 h-24 mb-4 drop-shadow-lg">
                <Image 
                  src="/biblia.png" 
                  alt="Logo Biblia Viva" 
                  fill
                  className="object-contain"
                  priority
                />
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Biblia Viva</h1>
            <p className="text-muted-foreground text-center mt-2">
              Tu compañero espiritual inteligente
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground ml-1">
                Nombre de Usuario
              </label>
              <Input
                id="name"
                placeholder="¿Cómo te llamas?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-secondary/50 border-border/50 focus:border-primary h-11"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground ml-1">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary/50 border-border/50 focus:border-primary h-11"
              />
              <p className="text-xs text-muted-foreground ml-1">
                Usado para guardar y recuperar tu progreso en la nube.
              </p>
            </div>

            <Button 
                type="submit" 
                className="w-full gradient-primary font-bold text-lg h-12 mt-4 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                disabled={isLoading}
            >
              {isLoading ? "Iniciando..." : "Comenzar Viaje"}
            </Button>
            
            <div className="flex justify-center mt-4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground cursor-help hover:text-primary transition-colors bg-secondary/30 px-3 py-1.5 rounded-full border border-border/30">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>100% Gratis y Seguro</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-center p-3">
                            <p>Esta aplicación es totalmente gratuita. No guardamos tus datos personales fuera de tu progreso y no compartimos información con terceros.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
          </form>
        </Card>

        {/* Columna Derecha: Información */}
        <div className="hidden md:flex flex-col space-y-6 text-foreground p-4">
            <div>
                <h2 className="text-4xl font-bold mb-4 text-white-500">
                    Explora la Palabra como nunca antes.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Biblia Viva combina la sabiduría eterna de las Escrituras con tecnología moderna para enriquecer tu vida espiritual diaria.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-card/40 border border-border/50 backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <feature.icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{feature.text}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      {/* Mobile Features (visible only on small screens below form) */}
      <div className="md:hidden mt-8 w-full max-w-md space-y-4">
          <p className="text-center text-sm text-muted-foreground mb-4">Descubre todas las funcionalidades:</p>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-card/30 border border-border/30 text-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                    <span className="text-xs font-medium">{feature.text}</span>
                </div>
            ))}
          </div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <a 
          href="https://carlosfr.es" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-4 py-1.5 rounded-full bg-background/50 backdrop-blur-md border border-border/30 text-[10px] text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          Made by: Carlosfr.es
        </a>
      </div>
    </div>
  )
}
