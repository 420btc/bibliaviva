"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AIChat, type AIChatRef } from "@/components/chat/ai-chat"
import { MessageCircle, X, Minus, Eraser, Maximize2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { clearChatHistoryAction } from "@/actions/chat"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"
import { usePathname } from "next/navigation"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const chatRef = useRef<AIChatRef>(null)
  const { user } = useAuth()
  const pathname = usePathname()

  // No mostrar en login o páginas públicas si es necesario
  if (pathname === '/login' || pathname === '/register') return null

  const handleClear = async () => {
    if (!user?.id) return
    
    // Optimistic clear
    chatRef.current?.clear()
    
    const res = await clearChatHistoryAction(user.id)
    if (res.success) {
        toast.success("Historial borrado")
    } else {
        toast.error("Error al borrar historial")
        chatRef.current?.reload() // Revert if failed
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[90vw] md:w-[450px] h-[80vh] md:h-[600px] bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold text-sm">Asistente IA</span>
              </div>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleClear}>
                                <Eraser className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Limpiar chat</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                  <Minus className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden relative">
                <AIChat ref={chatRef} className="border-0 shadow-none rounded-none bg-transparent" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
            isOpen 
            ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" 
            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25 hover:shadow-[0_0_20px_-5px_var(--color-primary)]"
        }`}
      >
        <AnimatePresence mode="wait">
            {isOpen ? (
                <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                >
                    <X className="w-6 h-6" />
                </motion.div>
            ) : (
                <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                >
                    <MessageCircle className="w-6 h-6" />
                </motion.div>
            )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
