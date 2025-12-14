"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Sparkles, BookOpen, Lightbulb, Heart, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { chatWithBibleAI } from "@/lib/openai-actions"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

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
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsTyping(true)

    try {
      // Convertir mensajes al formato de OpenAI
      const apiMessages = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await chatWithBibleAI(apiMessages)

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error(error)
      toast.error("Hubo un error al conectar con el asistente.")
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Encabezado */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <div className="flex items-center justify-center w-10 h-10 rounded-full gradient-primary">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">Asistente Bíblico IA</h1>
            <p className="text-sm text-muted-foreground">Tu guía de estudio personal</p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-4 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback
                    className={
                      message.role === "assistant" ? "gradient-primary text-primary-foreground" : "bg-secondary"
                    }
                  >
                    {message.role === "assistant" ? <Sparkles className="w-4 h-4" /> : "Tú"}
                  </AvatarFallback>
                </Avatar>
                <Card
                  className={`p-4 max-w-[80%] ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "glass-card"
                  }`}
                >
                  <div className="prose prose-sm prose-invert max-w-none">
                    {message.content.split("\n").map((line, i) => (
                      <p
                        key={i}
                        className={`${i > 0 ? "mt-2" : ""} ${message.role === "user" ? "text-primary-foreground" : "text-foreground"}`}
                      >
                        {line.startsWith(">") ? (
                          <blockquote className="border-l-2 border-primary pl-3 italic text-muted-foreground">
                            {line.slice(1).trim()}
                          </blockquote>
                        ) : line.startsWith("**") ? (
                          <strong>{line.replace(/\*\*/g, "")}</strong>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Indicador de escritura */}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="gradient-primary text-primary-foreground">
                  <Sparkles className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="glass-card p-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </Card>
            </motion.div>
          )}

          {/* Sugerencias (solo si no hay mensajes del usuario) */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6"
            >
              {suggestedQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="h-auto p-4 justify-start gap-3 text-left bg-transparent"
                  onClick={() => sendMessage(q.text)}
                >
                  <q.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{q.text}</span>
                </Button>
              ))}
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Escribe tu pregunta..."
            className="flex-1 bg-secondary border-0"
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="gradient-primary border-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
