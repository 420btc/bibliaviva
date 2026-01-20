"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { insignias, desafiosSemanales, niveles } from "@/lib/gamification"
import { Trophy, Flame, Star, Target, Lock, CheckCircle2, ChevronRight, Zap, Medal, BookOpen, Sparkles } from "lucide-react"
import { SpiritPet } from "@/components/journey/spirit-pet"
import { motion } from "framer-motion"
import { useUserProgress } from "@/hooks/use-user-progress"
import { getCompletedChaptersAction } from "@/actions/progress"
import { useAuth } from "@/components/auth-provider"
import { bibleBooks, getAllBooksFlat } from "@/lib/bible-data"

import { getQuizQuestionsAction, recordQuestionAnsweredAction } from "@/actions/quiz"
import { Loader2 } from "lucide-react"

export function JourneyPage() {
  const [activeQuiz, setActiveQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  // Estado para historial de lecturas
  const [completedChapters, setCompletedChapters] = useState<any[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Estado para quiz
  const [quizQuestions, setQuizQuestions] = useState<any[]>([])
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)

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

  // Cargar preguntas cuando se activa el quiz
  useEffect(() => {
    if (activeQuiz && authUser?.id) {
      setIsLoadingQuestions(true)
      getQuizQuestionsAction(authUser.id).then(res => {
        if (res.success && res.questions && res.questions.length > 0) {
          const mappedQuestions = res.questions.map((q: any) => ({
            id: q.id,
            pregunta: q.question,
            opciones: q.options,
            respuestaCorrecta: q.correctAnswer
          }))
          setQuizQuestions(mappedQuestions)
        } else {
          // Fallback si falla la carga o no hay preguntas
          console.error("No se pudieron cargar las preguntas")
        }
        setIsLoadingQuestions(false)
      })
    }
  }, [activeQuiz, authUser?.id])

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)

    // Registrar respuesta en DB
    if (authUser?.id && quizQuestions[currentQuestion]) {
      const q = quizQuestions[currentQuestion]
      const isCorrect = index === q.respuestaCorrecta
      recordQuestionAnsweredAction(authUser.id, q.id, isCorrect)
    }

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
    setQuizQuestions([]) // Limpiar para recargar nuevas
  }

  return (
    <div className="p-4 lg:p-8 pb-64 lg:pb-8 max-w-6xl mx-auto">
      {/* Encabezado */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1.5 lg:mb-2">Mi Viaje Espiritual</h1>
        <p className="text-sm lg:text-base text-muted-foreground">Sigue tu progreso y desbloquea nuevos logros</p>
      </div>

      {/* Resumen de progreso */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card p-3 lg:p-4 border-[#D2B48C]/20 bg-[#D2B48C]/5 hover:bg-[#D2B48C]/10 transition-colors">
            <div className="flex items-center gap-2.5 lg:gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-[#D2B48C]/20 flex items-center justify-center">
                <Star className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-[#D2B48C]" />
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold text-[#D2B48C]">{user.xp}</p>
                <p className="text-[11px] lg:text-xs text-[#D2B48C]/60">XP Total</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card p-3 lg:p-4 border-[#D2B48C]/20 bg-[#D2B48C]/5 hover:bg-[#D2B48C]/10 transition-colors">
            <div className="flex items-center gap-2.5 lg:gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-[#D2B48C]/20 flex items-center justify-center">
                <Flame className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-[#D2B48C]" />
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold text-[#D2B48C]">{user.racha}</p>
                <p className="text-[11px] lg:text-xs text-[#D2B48C]/60">Días racha</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card p-3 lg:p-4 border-[#D2B48C]/20 bg-[#D2B48C]/5 hover:bg-[#D2B48C]/10 transition-colors">
            <div className="flex items-center gap-2.5 lg:gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-[#D2B48C]/20 flex items-center justify-center">
                <Trophy className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-[#D2B48C]" />
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold text-[#D2B48C]">{user.insignias.length}</p>
                <p className="text-[11px] lg:text-xs text-[#D2B48C]/60">Insignias</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card p-3 lg:p-4 border-[#D2B48C]/20 bg-[#D2B48C]/5 hover:bg-[#D2B48C]/10 transition-colors">
            <div className="flex items-center gap-2.5 lg:gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-[#D2B48C]/20 flex items-center justify-center">
                <Target className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-[#D2B48C]" />
              </div>
              <div>
                <p className="text-xl lg:text-2xl font-bold text-[#D2B48C]">{user.quizzesCompletados}</p>
                <p className="text-[11px] lg:text-xs text-[#D2B48C]/60">Quizzes</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="insignias" className="space-y-6 lg:space-y-8">
        <div className="flex justify-center w-full relative z-10 mb-20 lg:mb-8">
          <TabsList className="bg-secondary/50 backdrop-blur-sm p-1 h-auto rounded-3xl border border-border/50 inline-flex flex-wrap justify-center gap-2">
            <TabsTrigger
              value="insignias"
              className="rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              Insignias
            </TabsTrigger>
            <TabsTrigger
              value="leidos"
              className="rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              Leídos
            </TabsTrigger>
            <TabsTrigger
              value="niveles"
              className="rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              Niveles
            </TabsTrigger>
            <TabsTrigger
              value="quiz"
              className="rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              Quiz del Día
            </TabsTrigger>
            <TabsTrigger
              value="desafios"
              className="rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              Desafíos
            </TabsTrigger>
            <TabsTrigger
              value="companero"
              className="rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Compañero
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Insignias */}
        <TabsContent value="insignias">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
            {insignias.map((insignia, index) => {
              const unlocked = user.insignias.includes(insignia.id)
              return (
                <motion.div
                  key={insignia.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`glass-card p-3 lg:p-4 text-center ${!unlocked && "opacity-50"}`}>
                    <div className={`text-3xl lg:text-4xl mb-1.5 ${!unlocked && "grayscale"}`}>{insignia.icono}</div>
                    <h3 className="font-medium text-foreground text-xs sm:text-sm mb-1">{insignia.nombre}</h3>
                    <p className="text-[11px] text-muted-foreground mb-1.5">{insignia.descripcion}</p>
                    <div className="flex items-center justify-center gap-1 text-[11px]">
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
          <Card className="glass-card p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-foreground">Capítulos Completados</h3>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  Has leído {user.capituslosCompletados} capítulos en total
                </p>
              </div>
            </div>

            {completedChapters.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                {completedChapters.map((chapter, i) => {
                  const book = bibleBooks.antiguoTestamento.find(b => b.id === chapter.bookId) ||
                    bibleBooks.nuevoTestamento.find(b => b.id === chapter.bookId) ||
                    getAllBooksFlat().find(b => b.id === chapter.bookId)

                  const bookName = book?.nombre || "Libro desconocido"

                  return (
                    <div key={i} className="p-3 lg:p-4 border rounded-lg bg-secondary/30 border-border animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-semibold text-foreground text-sm">{bookName} {chapter.chapter}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Leído el {new Date(chapter.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p>Aún no has completado ningún capítulo.</p>
                <Button variant="link" className="mt-2 text-primary" onClick={() => window.location.href = '/biblia'}>
                  Ir a la Biblia
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Niveles */}        <TabsContent value="niveles">
          <div className="space-y-2.5 lg:space-y-3">
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
                  <Card className={`glass-card p-3 lg:p-4 ${isCurrentLevel && "ring-2 ring-primary"}`}>
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ${isUnlocked ? "gradient-primary" : "bg-secondary"
                          }`}
                      >
                        {isUnlocked ? (
                          <Medal className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground" />
                        ) : (
                          <Lock className="w-4.5 h-4.5 lg:w-5 lg:h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-foreground text-sm lg:text-base">
                            Nivel {nivel.nivel}: {nivel.nombre}
                          </h3>
                          <span className="text-[11px] lg:text-sm text-muted-foreground">{nivel.xpRequerido} XP</span>
                        </div>
                        {isCurrentLevel && <Progress value={progress} className="h-2" />}
                      </div>
                      {isCurrentLevel && <span className="text-[11px] text-primary font-medium">Actual</span>}
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
            <Card className="glass-card p-5 lg:p-8 text-center max-w-lg mx-auto">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Zap className="w-6 h-6 lg:w-8 lg:h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-foreground mb-1.5 lg:mb-2">Quiz Bíblico del Día</h3>
              <p className="text-sm lg:text-base text-muted-foreground mb-4 lg:mb-6">Pon a prueba tu conocimiento y gana hasta 75 XP</p>
              <Button className="gradient-primary border-0" onClick={() => setActiveQuiz(true)}>
                Comenzar Quiz
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          ) : isLoadingQuestions ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Cargando preguntas...</p>
            </div>
          ) : showResult ? (
            <Card className="glass-card p-5 lg:p-8 text-center max-w-lg mx-auto">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Trophy className="w-6 h-6 lg:w-8 lg:h-8 text-accent" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-foreground mb-1.5 lg:mb-2">¡Quiz Completado!</h3>
              <p className="text-2xl lg:text-3xl font-bold text-primary mb-1.5 lg:mb-2">
                {score}/{quizQuestions.length}
              </p>
              <p className="text-sm lg:text-base text-muted-foreground mb-4 lg:mb-6">Ganaste {score * 25} XP</p>
              <Button variant="outline" onClick={resetQuiz}>
                Intentar de Nuevo
              </Button>
            </Card>
          ) : quizQuestions.length > 0 && quizQuestions[currentQuestion] ? (
            <Card className="glass-card p-4 lg:p-6 max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <span className="text-sm text-muted-foreground">
                  Pregunta {currentQuestion + 1} de {quizQuestions.length}
                </span>
                <span className="text-sm text-primary font-medium">+25 XP</span>
              </div>
              <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="h-2 mb-4 lg:mb-6" />
              <h3 className="text-base lg:text-lg font-semibold text-foreground mb-4 lg:mb-6">{quizQuestions[currentQuestion].pregunta}</h3>
              <div className="space-y-2.5 lg:space-y-3">
                {quizQuestions[currentQuestion].opciones.map((opcion: string, index: number) => {
                  const isSelected = selectedAnswer === index
                  const isCorrect = index === quizQuestions[currentQuestion].respuestaCorrecta
                  const showAnswer = selectedAnswer !== null

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className={`w-full justify-start text-left h-auto py-2.5 lg:py-3 transition-all duration-200 ${showAnswer && isCorrect
                        ? "!border-green-500 !bg-green-100 dark:!bg-green-900/30 !text-green-700 dark:!text-green-400 opacity-100"
                        : showAnswer && isSelected && !isCorrect
                          ? "!border-red-500 !bg-red-100 dark:!bg-red-900/30 !text-red-700 dark:!text-red-400 opacity-100"
                          : showAnswer
                            ? "opacity-50"
                            : ""
                        }`}
                      onClick={() => !showAnswer && handleAnswer(index)}
                      disabled={false}
                    >
                      <span className="mr-3 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {opcion}
                    </Button>
                  )
                })}
              </div>
            </Card>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No hay preguntas disponibles por ahora o hubo un error al cargar.</p>
              <Button onClick={resetQuiz} variant="outline">Volver</Button>
            </div>
          )}
        </TabsContent>

        {/* Desafíos */}
        <TabsContent value="desafios">
          <div className="space-y-3 lg:space-y-4">
            <h3 className="font-semibold text-foreground text-sm lg:text-base">Desafíos Semanales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              {desafiosSemanales.map((desafio, index) => (
                <motion.div
                  key={desafio.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card p-3 lg:p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-medium text-foreground text-sm">{desafio.nombre}</h4>
                      <span className="text-[11px] text-primary flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />+{desafio.xp} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-2">{desafio.descripcion}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={(desafio.progreso / desafio.meta) * 100} className="flex-1 h-2" />
                      <span className="text-[11px] text-muted-foreground">
                        {desafio.progreso}/{desafio.meta}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Compañero Espiritual */}
        <TabsContent value="companero">
          <SpiritPet />
        </TabsContent>
      </Tabs>
    </div>
  )
}
