"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Sparkles, BookOpen, Lightbulb, Heart, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simular respuesta de IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(text),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (question: string): string => {
    const lowerQ = question.toLowerCase()

    if (lowerQ.includes("juan 3:16") || lowerQ.includes("juan 3 16")) {
      return `**Juan 3:16** es uno de los versículos más conocidos de la Biblia:\n\n> "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna."\n\n**Significado profundo:**\n\n1. **"De tal manera amó Dios"** - El amor de Dios es inmenso e incondicional\n2. **"al mundo"** - Incluye a toda la humanidad, sin excepción\n3. **"ha dado a su Hijo"** - El mayor sacrificio posible\n4. **"todo aquel que en él cree"** - La salvación está disponible para todos\n5. **"vida eterna"** - No solo duración, sino calidad de vida con Dios\n\n¿Te gustaría explorar más sobre este pasaje o tienes alguna pregunta específica?`
    }

    if (lowerQ.includes("nacer de nuevo")) {
      return `**Nacer de nuevo** es un concepto central en Juan 3, donde Jesús habla con Nicodemo.\n\n**¿Qué significa?**\n\nNo se refiere a un nacimiento físico, sino a una transformación espiritual:\n\n1. **Regeneración espiritual** - Un nuevo comienzo en tu relación con Dios\n2. **El Espíritu Santo** - Es obra del Espíritu, no del esfuerzo humano\n3. **Nueva identidad** - Convertirse en hijo de Dios (Juan 1:12-13)\n\n**Versículo clave:**\n> "Lo que es nacido de la carne, carne es; y lo que es nacido del Espíritu, espíritu es." (Juan 3:6)\n\n¿Quieres que profundicemos más en este tema?`
    }

    if (lowerQ.includes("fe") || lowerQ.includes("fortalecer")) {
      return `**Fortalecer tu fe** es un proceso continuo. Aquí hay algunas prácticas bíblicas:\n\n1. **Lectura diaria de la Palabra**\n   > "La fe viene por el oír, y el oír por la palabra de Dios" (Romanos 10:17)\n\n2. **Oración constante**\n   > "Orad sin cesar" (1 Tesalonicenses 5:17)\n\n3. **Comunidad de creyentes**\n   > "No dejando de congregarnos" (Hebreos 10:25)\n\n4. **Practicar lo aprendido**\n   > "Sed hacedores de la palabra" (Santiago 1:22)\n\n5. **Confiar en las pruebas**\n   > "La prueba de vuestra fe produce paciencia" (Santiago 1:3)\n\n¿Te gustaría un plan de lectura específico para fortalecer tu fe?`
    }

    if (lowerQ.includes("devocional")) {
      return `**Devocional del día**\n\n📖 **Versículo:** Filipenses 4:13\n> "Todo lo puedo en Cristo que me fortalece."\n\n**Reflexión:**\n\nEste versículo no promete que podemos hacer literalmente todo, sino que en **cualquier circunstancia** —abundancia o escasez, alegría o tristeza— podemos encontrar fortaleza en Cristo.\n\n**Aplicación para hoy:**\n\n1. ¿Qué desafío enfrentas hoy?\n2. ¿Estás intentando superarlo con tus propias fuerzas?\n3. Invita a Cristo a ser tu fortaleza\n\n**Oración sugerida:**\n\n*"Señor, reconozco que sin ti nada puedo hacer. Dame tu fortaleza para enfrentar este día. Amén."*\n\n¿Te gustaría explorar otro tema para tu meditación?`
    }

    return `Gracias por tu pregunta. Basándome en las Escrituras, puedo ayudarte a explorar este tema.\n\nTe sugiero comenzar leyendo algunos pasajes relacionados y reflexionando en oración. ¿Hay algún aspecto específico en el que te gustaría profundizar?\n\nTambién puedo:\n- Darte referencias bíblicas relacionadas\n- Explicar el contexto histórico\n- Sugerir un plan de estudio\n\n¿Qué te gustaría explorar?`
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
