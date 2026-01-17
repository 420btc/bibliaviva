"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { usePet } from "@/hooks/use-pet"
import { PET_CONFIG, PetMood, petLevels, accessories, backgroundThemes } from "@/lib/pet-system"
import {
    Sparkles,
    Heart,
    Zap,
    Star,
    Sun,
    Moon,
    Lock,
    ChevronUp,
    Palette,
    Crown,
    Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Colores según el estado de ánimo
const moodColors: Record<PetMood, { primary: string; glow: string; bg: string }> = {
    radiante: { primary: "#FFD700", glow: "rgba(255, 215, 0, 0.6)", bg: "from-amber-400/20 to-yellow-500/20" },
    feliz: { primary: "#4ADE80", glow: "rgba(74, 222, 128, 0.5)", bg: "from-emerald-400/20 to-green-500/20" },
    normal: { primary: "#60A5FA", glow: "rgba(96, 165, 250, 0.4)", bg: "from-blue-400/20 to-cyan-500/20" },
    triste: { primary: "#A78BFA", glow: "rgba(167, 139, 250, 0.3)", bg: "from-violet-400/20 to-purple-500/20" },
    dormido: { primary: "#94A3B8", glow: "rgba(148, 163, 184, 0.2)", bg: "from-slate-400/20 to-gray-500/20" }
}

// Expresiones del querubín según el ánimo
const moodExpressions: Record<PetMood, { eyes: string; mouth: string }> = {
    radiante: { eyes: "◕ ◕", mouth: "◡" },
    feliz: { eyes: "◠ ◠", mouth: "‿" },
    normal: { eyes: "• •", mouth: "—" },
    triste: { eyes: "◡ ◡", mouth: "⌓" },
    dormido: { eyes: "— —", mouth: "ᵕ" }
}

// Mensajes según el estado
const moodMessages: Record<PetMood, string[]> = {
    radiante: ["¡Estoy lleno de luz divina!", "¡Tu dedicación me ilumina!", "¡Brillo con todo mi esplendor!"],
    feliz: ["¡Gracias por cuidarme!", "Me siento muy bien hoy", "Tu lectura me da fuerzas"],
    normal: ["Estoy bien, pero podrías leer más", "Un poco más de luz no vendría mal", "Sigo aquí, esperándote"],
    triste: ["Necesito más puntos de luz...", "¿Podrías leer un capítulo?", "Mi luz se está apagando..."],
    dormido: ["zzz... necesito energía...", "Estoy muy débil...", "Aliméntame cuando puedas..."]
}

export function SpiritPet() {
    const { toast } = useToast()
    const {
        petState,
        mood,
        levelInfo,
        canFeed,
        isLoaded,
        isFeeding,
        unlockedAccessories,
        unlockedBackgrounds,
        feedPet,
        updateCustomization
    } = usePet()

    const [showCustomize, setShowCustomize] = useState(false)
    const [feedAnimation, setFeedAnimation] = useState(false)

    const colors = moodColors[mood]
    const expression = moodExpressions[mood]
    const messages = moodMessages[mood]
    const currentMessage = messages[Math.floor(Date.now() / 10000) % messages.length]

    const handleFeed = async () => {
        setFeedAnimation(true)
        const result = await feedPet()

        if (result.success) {
            toast({
                title: "🌟 ¡Alimentado!",
                description: `Tu querubín ha recibido +${PET_CONFIG.ENERGY_PER_FEED} de energía`
            })
        } else {
            toast({
                title: "❌ No se pudo alimentar",
                description: result.message,
                variant: "destructive"
            })
        }

        setTimeout(() => setFeedAnimation(false), 1500)
    }

    if (!isLoaded) {
        return (
            <Card className="glass-card p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Main Pet Card */}
            <Card className={`glass-card overflow-hidden relative`}>
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} transition-colors duration-1000`}>
                    {/* Floating particles */}
                    {mood !== 'dormido' && [...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full opacity-60"
                            style={{ backgroundColor: colors.primary }}
                            initial={{
                                x: Math.random() * 100 + "%",
                                y: "100%",
                                scale: Math.random() * 0.5 + 0.5
                            }}
                            animate={{
                                y: "-20%",
                                x: `${Math.random() * 100}%`,
                                opacity: [0.6, 0.8, 0]
                            }}
                            transition={{
                                duration: 4 + Math.random() * 3,
                                repeat: Infinity,
                                delay: i * 0.5,
                                ease: "easeOut"
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 p-8">
                    {/* Level Badge */}
                    <motion.div
                        className="absolute top-4 right-4 flex items-center gap-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center gap-2">
                            <Crown className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Nivel {petState.level}</span>
                        </div>
                    </motion.div>

                    {/* Cherub Container */}
                    <div className="flex flex-col items-center">
                        {/* The Cherub */}
                        <motion.div
                            className="relative"
                            animate={{
                                y: mood === 'dormido' ? 0 : [0, -8, 0],
                                rotate: mood === 'dormido' ? [0, -5, 0] : 0
                            }}
                            transition={{
                                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                        >
                            {/* Glow Effect */}
                            <motion.div
                                className="absolute inset-0 rounded-full blur-3xl"
                                style={{ backgroundColor: colors.glow }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: mood === 'dormido' ? [0.2, 0.3, 0.2] : [0.4, 0.7, 0.4]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />

                            {/* Cherub Body */}
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                {/* Wings */}
                                <motion.div
                                    className="absolute"
                                    animate={{
                                        rotateY: mood === 'dormido' ? 0 : [0, 10, 0],
                                        scale: mood === 'dormido' ? 0.9 : [1, 1.05, 1]
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <svg viewBox="0 0 200 120" className="w-56 h-32 absolute -left-16 -top-4">
                                        {/* Left Wing */}
                                        <motion.path
                                            d="M20 60 Q5 30 40 15 Q60 5 80 25 Q90 35 85 50 Q80 65 60 70 Q40 75 20 60Z"
                                            fill={`${colors.primary}40`}
                                            stroke={colors.primary}
                                            strokeWidth="2"
                                            animate={{
                                                d: mood !== 'dormido' ? [
                                                    "M20 60 Q5 30 40 15 Q60 5 80 25 Q90 35 85 50 Q80 65 60 70 Q40 75 20 60Z",
                                                    "M15 55 Q0 25 35 10 Q55 0 75 20 Q95 30 90 50 Q85 70 65 75 Q45 80 15 55Z",
                                                    "M20 60 Q5 30 40 15 Q60 5 80 25 Q90 35 85 50 Q80 65 60 70 Q40 75 20 60Z"
                                                ] : undefined
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        {/* Right Wing */}
                                        <motion.path
                                            d="M180 60 Q195 30 160 15 Q140 5 120 25 Q110 35 115 50 Q120 65 140 70 Q160 75 180 60Z"
                                            fill={`${colors.primary}40`}
                                            stroke={colors.primary}
                                            strokeWidth="2"
                                            animate={{
                                                d: mood !== 'dormido' ? [
                                                    "M180 60 Q195 30 160 15 Q140 5 120 25 Q110 35 115 50 Q120 65 140 70 Q160 75 180 60Z",
                                                    "M185 55 Q200 25 165 10 Q145 0 125 20 Q105 30 110 50 Q115 70 135 75 Q155 80 185 55Z",
                                                    "M180 60 Q195 30 160 15 Q140 5 120 25 Q110 35 115 50 Q120 65 140 70 Q160 75 180 60Z"
                                                ] : undefined
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </svg>
                                </motion.div>

                                {/* Main Body Circle */}
                                <motion.div
                                    className="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl"
                                    style={{
                                        background: `radial-gradient(circle at 30% 30%, ${colors.primary}40, ${colors.primary}20)`,
                                        border: `3px solid ${colors.primary}`,
                                        boxShadow: `0 0 40px ${colors.glow}`
                                    }}
                                >
                                    {/* Face */}
                                    <div className="text-center select-none">
                                        <div className="text-2xl mb-1 tracking-widest">{expression.eyes}</div>
                                        <div className="text-xl">{expression.mouth}</div>
                                    </div>

                                    {/* Blush */}
                                    {(mood === 'radiante' || mood === 'feliz') && (
                                        <>
                                            <div className="absolute top-16 left-4 w-4 h-2 rounded-full bg-pink-300/50" />
                                            <div className="absolute top-16 right-4 w-4 h-2 rounded-full bg-pink-300/50" />
                                        </>
                                    )}
                                </motion.div>

                                {/* Halo */}
                                {petState.level >= 2 && (
                                    <motion.div
                                        className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                                        animate={{
                                            rotateZ: [0, 360],
                                            y: [0, -3, 0]
                                        }}
                                        transition={{
                                            rotateZ: { duration: 8, repeat: Infinity, ease: "linear" },
                                            y: { duration: 2, repeat: Infinity }
                                        }}
                                    >
                                        <div
                                            className="w-16 h-4 rounded-full opacity-80"
                                            style={{
                                                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
                                                boxShadow: `0 0 20px ${colors.primary}`
                                            }}
                                        />
                                    </motion.div>
                                )}

                                {/* Selected Accessory Display */}
                                {petState.selectedAccessory === 'corona' && (
                                    <Crown
                                        className="absolute -top-8 text-amber-400 w-10 h-10"
                                        style={{ filter: `drop-shadow(0 0 10px ${colors.primary})` }}
                                    />
                                )}
                            </div>
                        </motion.div>

                        {/* Speech Bubble */}
                        <motion.div
                            className="mt-4 px-4 py-2 rounded-2xl bg-secondary/80 backdrop-blur-sm border border-border/50 max-w-xs"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={currentMessage}
                        >
                            <p className="text-sm text-foreground text-center">{currentMessage}</p>
                        </motion.div>

                        {/* Pet Name & Level Info */}
                        <div className="mt-4 text-center">
                            <h3 className="text-xl font-bold text-foreground">{levelInfo.name}</h3>
                            <p className="text-sm text-muted-foreground">{levelInfo.description}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Stats Card */}
            <div className="grid grid-cols-2 gap-4">
                {/* Energy */}
                <Card className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-rose-500" />
                        <span className="font-medium text-foreground">Energía</span>
                    </div>
                    <Progress value={petState.energy} className="h-3 mb-1" />
                    <p className="text-sm text-muted-foreground text-right">{petState.energy}%</p>
                </Card>

                {/* Light Points */}
                <Card className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <span className="font-medium text-foreground">Puntos de Luz</span>
                    </div>
                    <p className="text-3xl font-bold text-primary">{petState.lightPoints}</p>
                    <p className="text-xs text-muted-foreground">Lee capítulos para ganar más</p>
                </Card>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
                {/* Feed Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        className="w-full h-auto py-4 gradient-primary border-0 relative overflow-hidden"
                        onClick={handleFeed}
                        disabled={!canFeed || isFeeding}
                    >
                        <AnimatePresence>
                            {feedAnimation && (
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 2, opacity: [1, 0] }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    {[...Array(8)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-3 h-3"
                                            initial={{ x: 0, y: 0, scale: 1 }}
                                            animate={{
                                                x: Math.cos(i * 45 * Math.PI / 180) * 60,
                                                y: Math.sin(i * 45 * Math.PI / 180) * 60,
                                                scale: 0,
                                                opacity: 0
                                            }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Star className="w-3 h-3 text-yellow-300" />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="flex flex-col items-center gap-1 relative z-10">
                            {isFeeding ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Sun className="w-6 h-6" />
                                    <span className="font-semibold">Alimentar</span>
                                    <span className="text-xs opacity-80">-{PET_CONFIG.POINTS_TO_FEED} puntos</span>
                                </>
                            )}
                        </div>
                    </Button>
                </motion.div>

                {/* Customize Button */}
                <Button
                    variant="outline"
                    className="h-auto py-4"
                    onClick={() => setShowCustomize(!showCustomize)}
                >
                    <div className="flex flex-col items-center gap-1">
                        <Palette className="w-6 h-6" />
                        <span className="font-semibold">Personalizar</span>
                        <span className="text-xs opacity-60">{unlockedAccessories.length} desbloqueados</span>
                    </div>
                </Button>
            </div>

            {/* Customization Panel */}
            <AnimatePresence>
                {showCustomize && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <Card className="glass-card p-4 space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                                <Palette className="w-4 h-4" />
                                Accesorios
                            </h4>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                {accessories.map((acc) => {
                                    const isUnlocked = petState.level >= acc.requiredLevel
                                    const isSelected = petState.selectedAccessory === acc.id

                                    return (
                                        <Button
                                            key={acc.id}
                                            variant={isSelected ? "default" : "outline"}
                                            className={`h-auto py-2 px-2 flex flex-col items-center gap-1 ${!isUnlocked && "opacity-50"}`}
                                            disabled={!isUnlocked}
                                            onClick={() => updateCustomization({
                                                selectedAccessory: isSelected ? null : acc.id
                                            })}
                                        >
                                            {isUnlocked ? (
                                                <Star className="w-4 h-4" />
                                            ) : (
                                                <Lock className="w-4 h-4" />
                                            )}
                                            <span className="text-xs truncate w-full text-center">{acc.name}</span>
                                            {!isUnlocked && (
                                                <span className="text-[10px] text-muted-foreground">Nv.{acc.requiredLevel}</span>
                                            )}
                                        </Button>
                                    )
                                })}
                            </div>

                            <h4 className="font-semibold flex items-center gap-2 pt-2">
                                <Moon className="w-4 h-4" />
                                Fondos
                            </h4>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                {backgroundThemes.map((bg) => {
                                    const isUnlocked = petState.level >= bg.requiredLevel
                                    const isSelected = petState.backgroundTheme === bg.id

                                    return (
                                        <Button
                                            key={bg.id}
                                            variant={isSelected ? "default" : "outline"}
                                            className={`h-auto py-2 px-2 flex flex-col items-center gap-1 ${!isUnlocked && "opacity-50"}`}
                                            disabled={!isUnlocked}
                                            onClick={() => updateCustomization({ backgroundTheme: bg.id })}
                                        >
                                            {isUnlocked ? (
                                                <Zap className="w-4 h-4" />
                                            ) : (
                                                <Lock className="w-4 h-4" />
                                            )}
                                            <span className="text-xs truncate w-full text-center">{bg.name}</span>
                                            {!isUnlocked && (
                                                <span className="text-[10px] text-muted-foreground">Nv.{bg.requiredLevel}</span>
                                            )}
                                        </Button>
                                    )
                                })}
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Level Progress */}
            <Card className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <ChevronUp className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">Progreso al siguiente nivel</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {petState.totalPointsSpent % PET_CONFIG.POINTS_PER_LEVEL}/{PET_CONFIG.POINTS_PER_LEVEL}
                    </span>
                </div>
                <Progress
                    value={(petState.totalPointsSpent % PET_CONFIG.POINTS_PER_LEVEL) / PET_CONFIG.POINTS_PER_LEVEL * 100}
                    className="h-2"
                />
                {petState.level < 10 && (
                    <p className="text-xs text-muted-foreground mt-2">
                        Alimenta a tu querubín para subir de nivel y desbloquear más contenido
                    </p>
                )}
            </Card>
        </div>
    )
}
