"use client"

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Sparkles, BookOpen, Lightbulb, Heart, RefreshCw, ImageIcon, Download, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { chatWithBibleAI } from "@/lib/openai-actions"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { saveChatMessageAction, getChatHistoryAction, type Message } from "@/actions/chat"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import { cn } from "@/lib/utils"

const suggestedQuestions = [
  { icon: BookOpen, text: "¿Qué significa nacer de nuevo?" },
  { icon: Lightbulb, text: "Explícame Juan 3:16" },
  { icon: Heart, text: "¿Cómo puedo fortalecer mi fe?" },
  { icon: RefreshCw, text: "Dame un devocional para hoy" },
]

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "¡Hola! Soy tu asistente bíblico con IA. Estoy aquí para ayudarte a profundizar en las Escrituras, responder tus preguntas y guiarte en tu estudio bíblico. ¿En qué puedo ayudarte hoy?",
    timestamp: new Date(),
  },
]

export interface AIChatRef {
  clear: () => void
  reload: () => Promise<void>
}

export const AIChat = forwardRef<AIChatRef, { className?: string }>(({ className }, ref) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const searchParams = useSearchParams()
  const hasInitialized = useRef(false)
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const loadHistory = async () => {
    if (user?.id) {
        try {
            const res = await getChatHistoryAction(user.id)
            if (res.success && res.data && res.data.length > 0) {
                setMessages(res.data)
            } else {
                setMessages(initialMessages)
            }
        } catch (e) {
            console.error(e)
            setMessages(initialMessages)
        }
    } else {
        setMessages(initialMessages)
    }
  }

  useImperativeHandle(ref, () => ({
    clear: () => setMessages(initialMessages),
    reload: loadHistory
  }))

  // Cargar historial
  useEffect(() => {
    loadHistory()
  }, [user])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Efecto para detectar si venimos del Versículo del Día
  useEffect(() => {
    const verseRef = searchParams.get("verse")
    const verseText = searchParams.get("text")

    if (verseRef && verseText && !hasInitialized.current) {
      hasInitialized.current = true
      
      // Crear un mensaje especial de "Versículo del Día"
      const specialMessage: Message = {
        id: "verse-context",
        role: "user",
        content: `Hola, me gustaría entender mejor este versículo: **${verseRef}**\n\n> "${verseText}"\n\n¿Podrías explicármelo?`,
        timestamp: new Date()
      }
      
      // Añadirlo inmediatamente y pedir respuesta
      setMessages(prev => [...prev, specialMessage])
      
      if (user?.id) {
          saveChatMessageAction(user.id, specialMessage)
      }
      
      // Trigger AI response automatically
      setTimeout(() => {
        handleAutoResponse(specialMessage.content)
      }, 500)
    }
  }, [searchParams, user])

  const handleAutoResponse = async (text: string) => {
    setIsTyping(true)
    try {
      // Use messages from state + new user message for context
      // Note: we might want to limit context window size
      const apiMessages = [
        ...messages, 
        { role: "user" as const, content: text }
      ].map(msg => ({ role: msg.role, content: msg.content }))

      const response = await chatWithBibleAI(apiMessages)
      
      const aiResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      
      if (user?.id) {
          saveChatMessageAction(user.id, aiResponse)
      }
    } catch (error) {
      console.error(error)
      toast.error("Error al obtener respuesta automática")
    } finally {
      setIsTyping(false)
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    
    if (user?.id) {
        saveChatMessageAction(user.id, userMessage)
    }

    setIsTyping(true)
    try {
      const apiMessages = [
          ...messages, 
          userMessage
      ].map(msg => ({ role: msg.role, content: msg.content }))

      const response = await chatWithBibleAI(apiMessages)

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      
      if (user?.id) {
          saveChatMessageAction(user.id, aiResponse)
      }
    } catch (error) {
      console.error(error)
      toast.error("Error al obtener respuesta")
    } finally {
      setIsTyping(false)
    }
  }

  // Render message content with potential images
  const renderContent = (content: string) => {
    const imageRegex = /\[IMAGE_URL:(.*?)\]/g
    const parts = content.split(imageRegex)
    
    if (parts.length === 1) {
        return <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{content}</p>
    }

    return (
        <div className="space-y-4">
            {parts.map((part, i) => {
                if (part.startsWith("http")) {
                    return (
                        <Dialog key={i}>
                            <DialogTrigger asChild>
                                <div className="relative aspect-square w-full max-w-sm rounded-lg overflow-hidden cursor-zoom-in border border-border hover:opacity-90 transition-opacity my-2">
                                    <Image 
                                        src={part} 
                                        alt="Generated content" 
                                        fill 
                                        className="object-cover"
                                    />
                                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                                        <ImageIcon className="w-3 h-3" />
                                        Click para ampliar
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl w-full p-0 overflow-hidden bg-transparent border-0 shadow-none">
                                <div className="relative w-full h-[80vh]">
                                    <Image 
                                        src={part} 
                                        alt="Full size" 
                                        fill 
                                        className="object-contain"
                                    />
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => window.open(part, '_blank')}>
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Abrir original
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )
                }
                if (!part.trim()) return null
                return <p key={i} className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{part}</p>
            })}
        </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-full w-full glass-card rounded-2xl border border-primary/20 overflow-hidden shadow-sm relative", className)}>
      <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        <div className="space-y-6 max-w-4xl mx-auto pb-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${message.role === "assistant" ? "" : "flex-row-reverse"}`}
            >
              <Avatar className={`w-10 h-10 border ${message.role === "assistant" ? "bg-primary/10 border-primary/20" : "bg-secondary border-secondary/20"}`}>
                <AvatarFallback>{message.role === "assistant" ? "AI" : "Tú"}</AvatarFallback>
              </Avatar>
              <div className={`flex flex-col max-w-[85%] md:max-w-[75%] space-y-1`}>
                <span className={`text-xs text-muted-foreground ${message.role === "assistant" ? "text-left" : "text-right"}`}>
                   {message.role === "assistant" ? "Asistente Bíblico" : "Tú"}
                </span>
                <Card
                  className={`p-4 shadow-sm ${
                    message.role === "assistant"
                      ? "bg-card/95 border-border/40 text-card-foreground"
                      : "bg-primary text-primary-foreground border-primary"
                  }`}
                >
                  {renderContent(message.content)}
                </Card>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-muted-foreground p-2 pl-14">
              <Sparkles className="w-4 h-4 animate-spin text-primary" />
              <span className="animate-pulse">Escribiendo respuesta...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      <div className="p-4 md:p-6 bg-background/40 backdrop-blur-md border-t border-border/50 z-10">
        <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-fade-right">
              {suggestedQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap flex gap-2 rounded-full bg-background/50 hover:bg-background hover:border-primary/50 transition-all shadow-sm"
                  onClick={() => sendMessage(q.text)}
                >
                  <q.icon className="w-3.5 h-3.5 text-primary" />
                  {q.text}
                </Button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage(input)
              }}
              className="flex gap-3 items-center relative"
            >
              <div className="relative flex-1">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Haz una pregunta sobre la Biblia, teología o vida cristiana..."
                  className="flex-1 pr-12 h-12 rounded-xl border-primary/20 focus-visible:ring-primary/30 bg-background/60 shadow-inner"
                  disabled={isTyping}
                />
              </div>
              <Button 
                type="submit" 
                size="icon" 
                disabled={isTyping || !input.trim()} 
                className="h-12 w-12 rounded-xl gradient-primary shadow-lg hover:shadow-primary/25 transition-all duration-300 shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
        </div>
      </div>
    </div>
  )
})
AIChat.displayName = "AIChat"
