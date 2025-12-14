"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { insignias, desafiosSemanales, niveles } from "@/lib/gamification"
import { Trophy, Flame, Star, Target, Lock, CheckCircle2, ChevronRight, Zap, Medal, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { useUserProgress } from "@/hooks/use-user-progress"
import { getCompletedChaptersAction } from "@/actions/progress"
import { useAuth } from "@/components/auth-provider"
import { bibleBooks, getAllBooksFlat } from "@/lib/bible-data"

const quizQuestions = [
  {
    id: 1,
    pregunta: "¿En qué libro de la Biblia encontramos la historia de Noé y el arca?",
    opciones: ["Éxodo", "Génesis", "Levítico", "Números"],
    respuestaCorrecta: 1,
  },
  {
    id: 2,
    pregunta: "¿Cuántos discípulos tuvo Jesús?",
    opciones: ["10", "11", "12", "13"],
    respuestaCorrecta: 2,
  },
  {
    id: 3,
    pregunta: "¿Quién escribió la mayoría de las epístolas del Nuevo Testamento?",
    opciones: ["Pedro", "Juan", "Pablo", "Santiago"],
    respuestaCorrecta: 2,
  },
]

export function JourneyPage() {
  const [activeQuiz, setActiveQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  
  // Estado para historial de lecturas
  const [completedChapters, setCompletedChapters] = useState<any[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const { progress: user, addXP } = useUserProgress()
  const { user: authUser } = useAuth()

  // Cargar historial de lecturas
  useEffect(() => {
    const loadHistory = async () => {
      if (authUser?.id) {
        setIsLoadingHistory(true)
        try {
          const res = await getCompletedChaptersAction(authUser.id)
          if (res.success && res.data) {
            setCompletedChapters(res.data)
          }
        } catch (e) {
          console.error(e)
        } finally {
          setIsLoadingHistory(false)
        }
      }
    }
    loadHistory()
  }, [authUser])

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
    setTimeout(() => {
      if (index === quizQuestions[currentQuestion].respuestaCorrecta) {
        setScore((s) => s + 1)
        addXP(10) // XP por respuesta correcta
      }
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion((q) => q + 1)
        setSelectedAnswer(null)
      } else {
        setShowResult(true)
        if (score + (index === quizQuestions[currentQuestion].respuestaCorrecta ? 1 : 0) === quizQuestions.length) {
          addXP(50) // Bonus por completar perfecto
        }
      }
    }, 1000)
  }

  const resetQuiz = () => {
    setActiveQuiz(false)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Mi Viaje Espiritual</h1>
        <p className="text-muted-foreground">Sigue tu progreso y desbloquea nuevos logros</p>
      </div>

      {/* Resumen de progreso */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{user.xp}</p>
                <p className="text-xs text-muted-foreground">XP Total</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{user.racha}</p>
                <p className="text-xs text-muted-foreground">Días racha</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{user.insignias.length}</p>
                <p className="text-xs text-muted-foreground">Insignias</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{user.quizzesCompletados}</p>
                <p className="text-xs text-muted-foreground">Quizzes</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="insignias" className="space-y-8">
        <div className="flex justify-center w-full">
          <TabsList className="bg-secondary/50 backdrop-blur-sm p-1.5 h-auto rounded-full border border-border/50 inline-flex flex-wrap justify-center gap-2">
            <TabsTrigger 
              value="insignias" 
              className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              Insignias
            </TabsTrigger>
            <TabsTrigger 
              value="leidos" 
              className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              Leídos
            </TabsTrigger>
            <TabsTrigger 
              value="niveles" 
              className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              Niveles
            </TabsTrigger>
            <TabsTrigger 
              value="quiz" 
              className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              Quiz del Día
            </TabsTrigger>
            <TabsTrigger 
              value="desafios" 
              className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              Desafíos
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Insignias */}
        <TabsContent value="insignias">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {insignias.map((insignia, index) => {
              const unlocked = user.insignias.includes(insignia.id)
              return (
                <motion.div
                  key={insignia.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`glass-card p-4 text-center ${!unlocked && "opacity-50"}`}>
                    <div className={`text-4xl mb-2 ${!unlocked && "grayscale"}`}>{insignia.icono}</div>
                    <h3 className="font-medium text-foreground text-sm mb-1">{insignia.nombre}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{insignia.descripcion}</p>
                    <div className="flex items-center justify-center gap-1 text-xs">
                      {unlocked ? (
                        <span className="text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Desbloqueada
                        </span>
                      ) : (
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Lock className="w-3 h-3" />+{insignia.xp} XP
                        </span>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        {/* Capítulos Leídos */}
        <TabsContent value="leidos">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Capítulos Completados</h3>
                <p className="text-sm text-muted-foreground">
                  Has leído {user.capituslosCompletados} capítulos en total
                </p>
              </div>
            </div>

            {completedChapters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {completedChapters.map((chapter, i) => {
                    const book = bibleBooks.antiguoTestamento.find(b => b.id === chapter.bookId) || 
                                 bibleBooks.nuevoTestamento.find(b => b.id === chapter.bookId) || 
                                 getAllBooksFlat().find(b => b.id === chapter.bookId)
                    
                    const bookName = book?.nombre || "Libro desconocido"
                    
                    return (
                      <div key={i} className="p-4 border rounded-lg bg-secondary/30 border-border animate-in fade-in slide-in-from-bottom-2">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-foreground">{bookName} {chapter.chapter}</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Leído el {new Date(chapter.completedAt).toLocaleDateString()}
                          </p>
                      </div>
                    )
                 })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Aún no has completado ningún capítulo.</p>
                <Button variant="link" className="mt-2 text-primary" onClick={() => window.location.href = '/biblia'}>
                  Ir a la Biblia
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Niveles */}        <TabsContent value="niveles">
          <div className="space-y-3">
            {niveles.map((nivel, index) => {
              const isCurrentLevel = user.nivel === nivel.nivel
              const isUnlocked = user.xp >= nivel.xpRequerido
              const nextLevel = niveles[index + 1]
              const progress = nextLevel
                ? Math.min(100, ((user.xp - nivel.xpRequerido) / (nextLevel.xpRequerido - nivel.xpRequerido)) * 100)
                : 100

              return (
                <motion.div
                  key={nivel.nivel}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`glass-card p-4 ${isCurrentLevel && "ring-2 ring-primary"}`}>
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isUnlocked ? "gradient-primary" : "bg-secondary"
                        }`}
                      >
                        {isUnlocked ? (
                          <Medal className="w-6 h-6 text-primary-foreground" />
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-foreground">
                            Nivel {nivel.nivel}: {nivel.nombre}
                          </h3>
                          <span className="text-sm text-muted-foreground">{nivel.xpRequerido} XP</span>
                        </div>
                        {isCurrentLevel && <Progress value={progress} className="h-2" />}
                      </div>
                      {isCurrentLevel && <span className="text-xs text-primary font-medium">Actual</span>}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        {/* Quiz */}
        <TabsContent value="quiz">
          {!activeQuiz ? (
            <Card className="glass-card p-8 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Quiz Bíblico del Día</h3>
              <p className="text-muted-foreground mb-6">Pon a prueba tu conocimiento y gana hasta 75 XP</p>
              <Button className="gradient-primary border-0" onClick={() => setActiveQuiz(true)}>
                Comenzar Quiz
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ) : showResult ? (
            <Card className="glass-card p-8 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">¡Quiz Completado!</h3>
              <p className="text-3xl font-bold text-primary mb-2">
                {score}/{quizQuestions.length}
              </p>
              <p className="text-muted-foreground mb-6">Ganaste {score * 25} XP</p>
              <Button variant="outline" onClick={resetQuiz}>
                Intentar de Nuevo
              </Button>
            </Card>
          ) : (
            <Card className="glass-card p-6 max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  Pregunta {currentQuestion + 1} de {quizQuestions.length}
                </span>
                <span className="text-sm text-primary font-medium">+25 XP</span>
              </div>
              <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="h-2 mb-6" />
              <h3 className="text-lg font-semibold text-foreground mb-6">{quizQuestions[currentQuestion].pregunta}</h3>
              <div className="space-y-3">
                {quizQuestions[currentQuestion].opciones.map((opcion, index) => {
                  const isSelected = selectedAnswer === index
                  const isCorrect = index === quizQuestions[currentQuestion].respuestaCorrecta
                  const showAnswer = selectedAnswer !== null

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className={`w-full justify-start text-left h-auto py-3 ${
                        showAnswer && isCorrect
                          ? "border-emerald-500 bg-emerald-500/10 text-foreground"
                          : showAnswer && isSelected && !isCorrect
                            ? "border-destructive bg-destructive/10 text-foreground"
                            : ""
                      }`}
                      onClick={() => !showAnswer && handleAnswer(index)}
                      disabled={showAnswer}
                    >
                      <span className="mr-3 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {opcion}
                    </Button>
                  )
                })}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Desafíos */}
        <TabsContent value="desafios">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Desafíos Semanales</h3>
            {desafiosSemanales.map((desafio, index) => (
              <motion.div
                key={desafio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{desafio.nombre}</h4>
                    <span className="text-sm text-primary flex items-center gap-1">
                      <Zap className="w-4 h-4" />+{desafio.xp} XP
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{desafio.descripcion}</p>
                  <div className="flex items-center gap-3">
                    <Progress value={(desafio.progreso / desafio.meta) * 100} className="flex-1 h-2" />
                    <span className="text-sm text-muted-foreground">
                      {desafio.progreso}/{desafio.meta}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
