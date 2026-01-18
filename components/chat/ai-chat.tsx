"use client"

import { useState, useEffect, useRef, forwardRef, useImperativeHandle, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Sparkles, BookOpen, Lightbulb, Heart, RefreshCw, ImageIcon, ExternalLink, Mic, Square, Volume2, VolumeX, Loader2, SlidersHorizontal } from "lucide-react"
import { motion } from "framer-motion"
import { chatWithBibleAI, generateVerseAudio, transcribeAudio } from "@/lib/openai-actions"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { saveChatMessageAction, getChatHistoryAction, type Message } from "@/actions/chat"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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

const TTS_VOICES = ["onyx", "alloy", "echo", "fable", "nova", "shimmer"] as const
type TTSVoice = typeof TTS_VOICES[number]
const isTTSVoice = (v: string): v is TTSVoice => (TTS_VOICES as readonly string[]).includes(v)

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
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [micDevices, setMicDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedMicId, setSelectedMicId] = useState<string>("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const recordedChunksRef = useRef<BlobPart[]>([])
  const [ttsEnabled, setTtsEnabled] = useState(false)
  const [ttsVoice, setTtsVoice] = useState<TTSVoice>("onyx")
  const ttsCacheRef = useRef<Map<string, string>>(new Map())
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)

  const canUseMediaDevices = useMemo(() => {
    return typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia)
  }, [])

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

  const refreshMicDevices = async () => {
    if (!canUseMediaDevices) return
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const mics = devices.filter((d) => d.kind === "audioinput")
      setMicDevices(mics)
      setSelectedMicId((prev) => prev || mics[0]?.deviceId || "")
    } catch {
      setMicDevices([])
    }
  }

  const stopMicStream = () => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
    mediaStreamRef.current = null
  }

  const stopAudioPlayback = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current.src = ""
    }
  }

  useEffect(() => {
    void refreshMicDevices()
    if (!canUseMediaDevices) return
    const handler = () => void refreshMicDevices()
    navigator.mediaDevices.addEventListener("devicechange", handler)
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handler)
      try {
        mediaRecorderRef.current?.stop()
      } catch (e) {
        console.error(e)
      }
      stopMicStream()
      stopAudioPlayback()
    }
  }, [canUseMediaDevices])

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
      if (ttsEnabled) {
        void speakMessage(aiResponse)
      }
    } catch (error) {
      console.error(error)
      toast.error("Error al obtener respuesta automática")
    } finally {
      setIsTyping(false)
    }
  }

  const getSpeakText = (content: string) => {
    const withoutImages = content.replace(/\[IMAGE_URL:.*?\]/g, " ")
    const singleSpaced = withoutImages.replace(/\s+/g, " ").trim()
    if (!singleSpaced.length) return null
    return singleSpaced.length > 1200 ? singleSpaced.slice(0, 1200) : singleSpaced
  }

  const ensureAudioPlayer = () => {
    if (!audioPlayerRef.current) audioPlayerRef.current = new Audio()
    return audioPlayerRef.current
  }

  const playAudioUrl = async (url: string) => {
    const player = ensureAudioPlayer()
    player.pause()
    player.src = url
    await player.play()
  }

  const speakMessage = async (message: Message) => {
    if (message.role !== "assistant") return
    const speakText = getSpeakText(message.content)
    if (!speakText) return
    if (ttsCacheRef.current.has(message.id)) {
      const url = ttsCacheRef.current.get(message.id)!
      try {
        await playAudioUrl(url)
      } catch (e) {
        console.error(e)
      }
      return
    }

    const res = await generateVerseAudio(speakText, ttsVoice)
    if (!res.audio) return
    const url = `data:audio/mp3;base64,${res.audio}`
    ttsCacheRef.current.set(message.id, url)
    try {
      await playAudioUrl(url)
    } catch (e) {
      console.error(e)
    }
  }

  const startRecording = async () => {
    if (!canUseMediaDevices) {
      toast.error("Tu navegador no permite grabación de audio.")
      return
    }
    if (isTyping || isTranscribing) return

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      await refreshMicDevices()
    } catch {
      toast.error("No se pudo acceder al micrófono.")
      return
    }

    stopAudioPlayback()
    recordedChunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedMicId ? { deviceId: { exact: selectedMicId } } : true,
      })
      mediaStreamRef.current = stream

      const preferredTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"]
      const mimeType = preferredTypes.find((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) || ""
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data)
      }
      recorder.onstop = async () => {
        setIsRecording(false)
        stopMicStream()

        const blob = new Blob(recordedChunksRef.current, { type: mimeType || "audio/webm" })
        recordedChunksRef.current = []
        if (!blob.size) return

        setIsTranscribing(true)
        try {
          const file = new File([blob], "audio.webm", { type: blob.type })
          const fd = new FormData()
          fd.set("audio", file)
          const res = await transcribeAudio(fd)
          if (!res.text) {
            toast.error(res.error || "No se pudo transcribir.")
            return
          }
          await sendMessage(res.text)
        } catch (e) {
          console.error(e)
          toast.error("No se pudo transcribir.")
        } finally {
          setIsTranscribing(false)
        }
      }

      recorder.start()
      setIsRecording(true)
    } catch (e) {
      console.error(e)
      stopMicStream()
      toast.error("No se pudo iniciar la grabación.")
    }
  }

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return
    try {
      mediaRecorderRef.current.stop()
    } catch (e) {
      console.error(e)
      setIsRecording(false)
      stopMicStream()
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
      if (ttsEnabled) {
        void speakMessage(aiResponse)
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
                const isImage = part.startsWith("http") || part.startsWith("data:image")
                if (isImage) {
                    return (
                        <Dialog key={i}>
                            <DialogTrigger asChild>
                                <div className="relative aspect-square w-full max-w-sm rounded-lg overflow-hidden cursor-zoom-in border border-border hover:opacity-90 transition-opacity my-2">
                                    {part.startsWith("data:image") ? (
                                      <img src={part} alt="Generated content" className="absolute inset-0 w-full h-full object-cover" />
                                    ) : (
                                      <Image 
                                          src={part} 
                                          alt="Generated content" 
                                          fill 
                                          className="object-cover"
                                      />
                                    )}
                                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                                        <ImageIcon className="w-3 h-3" />
                                        Click para ampliar
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl w-full p-0 overflow-hidden bg-transparent border-0 shadow-none">
                                <div className="relative w-full h-[80vh]">
                                    {part.startsWith("data:image") ? (
                                      <img src={part} alt="Full size" className="absolute inset-0 w-full h-full object-contain" />
                                    ) : (
                                      <Image 
                                          src={part} 
                                          alt="Full size" 
                                          fill 
                                          className="object-contain"
                                      />
                                    )}
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
                {message.role === "assistant" ? (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => void speakMessage(message)}
                      disabled={isTranscribing || isRecording}
                      title="Escuchar respuesta"
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : null}
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

      <div className="p-3 md:p-4 bg-background/40 backdrop-blur-md border-t border-border/50 z-10">
        <div className="max-w-4xl mx-auto space-y-2">
          <Collapsible open={isSuggestionsOpen} onOpenChange={setIsSuggestionsOpen}>
            <div className="flex items-center justify-between gap-2">
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-lg text-muted-foreground hover:text-foreground"
                  disabled={isTyping}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="ml-2 text-xs hidden sm:inline">Preguntas rápidas</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide mask-fade-right">
                {suggestedQuestions.map((q, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="h-7 px-3 text-xs whitespace-nowrap flex gap-1.5 rounded-full bg-background/60 hover:bg-background hover:border-primary/40 transition-all"
                    onClick={() => void sendMessage(q.text)}
                  >
                    <q.icon className="w-3.5 h-3.5 text-primary" />
                    <span className="hidden sm:inline">{q.text}</span>
                    <span className="sm:hidden">{q.text.slice(0, 14)}…</span>
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              void sendMessage(input)
            }}
            className="flex items-center gap-2"
          >
            {canUseMediaDevices ? (
              <>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className={cn(
                    "h-12 w-12 rounded-lg shrink-0",
                    isRecording && "border-red-500/40 bg-red-500/10 text-red-600"
                  )}
                  onClick={() => (isRecording ? stopRecording() : void startRecording())}
                  disabled={isTyping || isTranscribing}
                  title={isRecording ? "Detener" : "Hablar"}
                >
                  {isTranscribing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isRecording ? (
                    <Square className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </Button>

                {micDevices.length > 1 ? (
                  <Select value={selectedMicId} onValueChange={setSelectedMicId} disabled={isRecording}>
                    <SelectTrigger
                      className="h-12 w-12 rounded-lg bg-background/70 px-0 justify-center [&>svg:last-child]:hidden"
                      title="Micrófono"
                    >
                      <span className="sr-only">Micrófono</span>
                      <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
                    </SelectTrigger>
                    <SelectContent>
                      {micDevices.map((d, idx) => (
                        <SelectItem key={d.deviceId || String(idx)} value={d.deviceId}>
                          {(d.label && d.label.trim().length ? d.label : `Micrófono ${idx + 1}`).slice(0, 60)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : null}
              </>
            ) : null}

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta…"
              className="flex-1 min-w-0 h-12 rounded-lg bg-background text-foreground border border-border/60 focus-visible:ring-primary/30 shadow-inner text-[15px] sm:text-base placeholder:text-muted-foreground/70"
              disabled={isTyping}
            />

            <Button
              type="button"
              size="icon"
              variant="outline"
              className={cn(
                "h-12 w-12 rounded-lg shrink-0",
                ttsEnabled && "border-primary/40 bg-primary/10 text-primary"
              )}
              onClick={() => setTtsEnabled((v) => !v)}
              disabled={isTyping}
              title={ttsEnabled ? "Respuestas con voz: activado" : "Respuestas con voz: desactivado"}
            >
              {ttsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>

            {ttsEnabled ? (
              <Select value={ttsVoice} onValueChange={(v) => isTTSVoice(v) && setTtsVoice(v)}>
                <SelectTrigger className="h-11 w-[92px] sm:w-[120px] rounded-xl bg-background/70 px-3">
                  <SelectValue placeholder="Voz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onyx">Onyx</SelectItem>
                  <SelectItem value="alloy">Alloy</SelectItem>
                  <SelectItem value="echo">Echo</SelectItem>
                  <SelectItem value="fable">Fable</SelectItem>
                  <SelectItem value="nova">Nova</SelectItem>
                  <SelectItem value="shimmer">Shimmer</SelectItem>
                </SelectContent>
              </Select>
            ) : null}

            <Button
              type="submit"
              size="icon"
              disabled={isTyping || !input.trim()}
              className="h-12 w-12 rounded-lg gradient-primary shadow-lg hover:shadow-primary/25 transition-all duration-300 shrink-0"
              title="Enviar"
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
