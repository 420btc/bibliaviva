"use client"

import { useState, useEffect } from "react"
import { defaultUserProgress, type UserProgress, calcularNivel, insignias } from "@/lib/gamification"
import { useAuth } from "@/components/auth-provider"
import { getUserProgressAction, saveUserProgressAction } from "@/actions/gamification"

const STORAGE_KEY = "biblia-viva-progress"

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultUserProgress)
  const [isLoaded, setIsLoaded] = useState(false)
  const { user } = useAuth()

  // Cargar progreso
  useEffect(() => {
    const loadProgress = async () => {
      let loadedProgress = defaultUserProgress

      // 1. Intentar cargar desde DB si hay usuario
      if (user?.id) {
        try {
          const dbResult = await getUserProgressAction(user.id)
          if (dbResult.success && dbResult.data) {
            loadedProgress = dbResult.data
            
            // Si es un usuario nuevo en DB (XP 0), verificar si hay datos locales para migrar
            if (loadedProgress.xp === 0 && loadedProgress.nivel === 1) {
                const local = localStorage.getItem(STORAGE_KEY)
                if (local) {
                    try {
                        const parsed = JSON.parse(local)
                        loadedProgress = { ...loadedProgress, ...parsed }
                        // Guardar inmediatamente en DB
                        await saveUserProgressAction(user.id, loadedProgress)
                    } catch (e) { console.error("Error migrando datos locales", e) }
                }
            }
          }
        } catch (e) {
          console.error("Error cargando desde DB", e)
        }
      } else {
        // 2. Fallback a localStorage si no hay usuario o falló DB
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            loadedProgress = { ...defaultUserProgress, ...parsed }
          } catch (e) {
            console.error("Error al cargar progreso local:", e)
          }
        }
      }

      // Validaciones y reseteos diarios (lógica original)
      const today = new Date().toISOString().split('T')[0]
      if (loadedProgress.fechaUltimoDesafio !== today) {
         loadedProgress = {
           ...loadedProgress,
           desafiosDiariosCompletados: [],
           fechaUltimoDesafio: today
         }
      }

      setProgress(loadedProgress)
      setIsLoaded(true)
    }

    loadProgress()
  }, [user])

  // Guardar progreso cuando cambia
  useEffect(() => {
    if (isLoaded) {
      // 1. Guardar en localStorage (backup/offline)
      const cleanProgress: UserProgress = {
        nivel: progress.nivel,
        xp: progress.xp,
        xpParaSiguienteNivel: progress.xpParaSiguienteNivel,
        racha: progress.racha,
        mejorRacha: progress.mejorRacha,
        versiculosLeidos: progress.versiculosLeidos,
        capituslosCompletados: progress.capituslosCompletados,
        librosCompletados: progress.librosCompletados,
        quizzesCompletados: progress.quizzesCompletados,
        insignias: progress.insignias || [],
        titulo: progress.titulo,
        desafiosDiariosCompletados: progress.desafiosDiariosCompletados || [],
        fechaUltimoDesafio: progress.fechaUltimoDesafio || new Date().toISOString().split('T')[0]
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanProgress))
      } catch (e) {
        // Ignorar quota exceeded
        console.warn("Failed to save progress to localStorage (QuotaExceeded)")
      }

      // 2. Guardar en DB si hay usuario
      if (user?.id) {
        saveUserProgressAction(user.id, cleanProgress).catch(e => 
            console.error("Failed to save progress to DB", e)
        )
      }
    }
  }, [progress, isLoaded, user])

  const checkInsignias = (currentProgress: UserProgress) => {
    let newInsignias = [...currentProgress.insignias]
    let xpGained = 0

    // 1. Primera Lectura
    if (currentProgress.capituslosCompletados > 0 && !newInsignias.includes("primera-lectura")) {
      newInsignias.push("primera-lectura")
      xpGained += insignias.find(i => i.id === "primera-lectura")?.xp || 0
    }

    // 2. Racha 7 días (Simulado si racha >= 7)
    if (currentProgress.racha >= 7 && !newInsignias.includes("racha-7")) {
      newInsignias.push("racha-7")
      xpGained += insignias.find(i => i.id === "racha-7")?.xp || 0
    }

    // 3. Maestro de Quizzes
    if (currentProgress.quizzesCompletados >= 10 && !newInsignias.includes("quiz-maestro")) {
       newInsignias.push("quiz-maestro")
       xpGained += insignias.find(i => i.id === "quiz-maestro")?.xp || 0
    }

    // TODO: Agregar más chequeos según la lógica de insignias

    if (newInsignias.length > currentProgress.insignias.length) {
       return { hasNew: true, insignias: newInsignias, xp: xpGained }
    }
    
    return { hasNew: false, insignias: [], xp: 0 }
  }

  const addXP = (amount: number) => {
    setProgress((prev) => {
      let newXP = prev.xp + amount
      const { nivel, nombre } = calcularNivel(newXP)
      
      // Verificar si subió de nivel
      if (nivel > prev.nivel) {
        console.log(`¡Subiste al nivel ${nivel}: ${nombre}!`)
      }

      // Check insignias with updated stats (simplified version, usually would pass full new state)
      // We do a partial check here or inside useEffect
      
      return {
        ...prev,
        xp: newXP,
        nivel,
        titulo: nombre,
      }
    })
  }

  // Effect to check badges whenever progress stats change
  useEffect(() => {
    if (!isLoaded) return

    const { hasNew, insignias: newBadgesList, xp } = checkInsignias(progress)
    
    if (hasNew) {
        // Update state to include new badges and XP
        setProgress(prev => ({
            ...prev,
            insignias: newBadgesList,
            xp: prev.xp + xp
        }))
        // Toast or notification could go here
        console.log("¡Nueva insignia desbloqueada!")
    }
  }, [progress.capituslosCompletados, progress.racha, progress.quizzesCompletados, isLoaded])


  const completeChallenge = (id: string, xp: number) => {
    if (progress.desafiosDiariosCompletados.includes(id)) return
    
    addXP(xp)
    setProgress(prev => ({
        ...prev,
        desafiosDiariosCompletados: [...prev.desafiosDiariosCompletados, id]
    }))
  }

  const completeQuiz = (score: number, totalQuestions: number) => {
      const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0
      
      setProgress(prev => ({
          ...prev,
          quizzesCompletados: prev.quizzesCompletados + 1
      }))
      
      // Bonus XP for perfect score
      addXP(percentage >= 100 ? 50 : 20)
  }

  const incrementChapters = () => {
    setProgress(prev => ({
        ...prev,
        capituslosCompletados: prev.capituslosCompletados + 1
    }))
  }

  return { progress, addXP, setProgress, completeChallenge, completeQuiz, incrementChapters }
}
