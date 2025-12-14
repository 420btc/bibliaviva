"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Sparkles, BookOpen, Lightbulb, Heart, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { chatWithBibleAI } from "@/lib/openai-actions"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { saveChatMessageAction, getChatHistoryAction, type Message } from "@/actions/chat"

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

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const searchParams = useSearchParams()
  const hasInitialized = useRef(false)
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Cargar historial
  useEffect(() => {
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

  return (
    <div className="flex flex-col h-[600px] glass-card rounded-2xl border border-primary/20 overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${message.role === "assistant" ? "" : "flex-row-reverse"}`}
            >
              <Avatar className={message.role === "assistant" ? "bg-primary/20" : "bg-secondary"}>
                <AvatarFallback>{message.role === "assistant" ? "AI" : "Tú"}</AvatarFallback>
              </Avatar>
              <Card
                className={`p-3 max-w-[80%] ${
                  message.role === "assistant"
                    ? "bg-background/80 border-primary/20"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </Card>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-muted-foreground p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              Escribiendo...
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 bg-background/50 border-t border-border/50">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {suggestedQuestions.map((q, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="whitespace-nowrap flex gap-2"
              onClick={() => sendMessage(q.text)}
            >
              <q.icon className="w-3 h-3" />
              {q.text}
            </Button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage(input)
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Haz una pregunta sobre la Biblia..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={isTyping || !input.trim()} className="gradient-primary">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
