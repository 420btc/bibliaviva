"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getDailyQuizQuestions, type QuizQuestion } from "@/lib/quiz-data"
import { useUserProgress } from "@/hooks/use-user-progress"
import { CheckCircle2, XCircle, Trophy, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

interface DailyQuizModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DailyQuizModal({ open, onOpenChange }: DailyQuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const { completeChallenge, completeQuiz } = useUserProgress()

  // Cargar preguntas al abrir
  useEffect(() => {
    if (open) {
      const dailyQuestions = getDailyQuizQuestions()
      setQuestions(dailyQuestions)
      setCurrentQuestionIndex(0)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setScore(0)
      setShowResults(false)
    }
  }, [open])

  const handleAnswer = (index: number) => {
    if (isAnswered) return
    setSelectedAnswer(index)
    setIsAnswered(true)

    const isCorrect = index === questions[currentQuestionIndex].correctAnswer
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = () => {
    setShowResults(true)
    const passed = score >= questions.length * 0.6 // 60% para aprobar, o podemos requerir menos
    if (passed) {
      completeChallenge("quiz-dia", 25)
      completeQuiz(score, questions.length)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  if (questions.length === 0) return null

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex) / questions.length) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <div className="flex items-center justify-between mb-2">
                  <DialogTitle>Quiz del Día</DialogTitle>
                  <span className="text-sm text-muted-foreground">
                    {currentQuestionIndex + 1}/{questions.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </DialogHeader>

              <div className="py-6">
                <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    let variant = "outline"
                    let className = "w-full justify-start text-left h-auto py-3 px-4"
                    
                    if (isAnswered) {
                      if (index === currentQuestion.correctAnswer) {
                        className += " !border-green-500 !bg-green-100 dark:!bg-green-900/30 !text-green-700 dark:!text-green-400 opacity-100"
                      } else if (index === selectedAnswer) {
                        className += " !border-red-500 !bg-red-100 dark:!bg-red-900/30 !text-red-700 dark:!text-red-400 opacity-100"
                      } else {
                        className += " opacity-50"
                      }
                    }

                    return (
                      <Button
                        key={index}
                        variant={variant as any}
                        className={className}
                        onClick={() => !isAnswered && handleAnswer(index)}
                        disabled={false}
                      >
                        <div className="flex items-center w-full">
                          <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full border text-xs">
                            {String.fromCharCode(65 + index)}
                          </span>
                          {option}
                          {isAnswered && index === currentQuestion.correctAnswer && (
                            <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />
                          )}
                          {isAnswered && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                            <XCircle className="ml-auto h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </Button>
                    )
                  })}
                </div>

                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-muted rounded-md text-sm"
                  >
                    <p className="font-medium mb-1">Explicación:</p>
                    <p className="text-muted-foreground">{currentQuestion.explanation}</p>
                  </motion.div>
                )}
              </div>

              <DialogFooter>
                <Button onClick={handleNext} disabled={!isAnswered} className="w-full sm:w-auto">
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>
                      Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Finalizar"
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Trophy className="w-16 h-16 text-yellow-500" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full"
                  >
                    +{score >= questions.length * 0.6 ? 25 : 5} XP
                  </motion.div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">
                {score === questions.length ? "¡Perfecto!" : 
                 score >= questions.length * 0.6 ? "¡Bien hecho!" : "Sigue practicando"}
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Has acertado {score} de {questions.length} preguntas
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Precisión</p>
                  <p className="text-2xl font-bold">{Math.round((score / questions.length) * 100)}%</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">XP Ganado</p>
                  <p className="text-2xl font-bold text-yellow-500">+{score >= questions.length * 0.6 ? 25 : 5}</p>
                </div>
              </div>

              <Button onClick={() => onOpenChange(false)} className="w-full">
                Continuar
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
