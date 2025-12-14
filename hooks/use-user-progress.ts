"use client"

import { useState, useEffect } from "react"
import { defaultUserProgress, type UserProgress, calcularNivel } from "@/lib/gamification"
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
        console.warn("Failed to save progress to localStorage:", e)
      }

      // 2. Guardar en DB si hay usuario
      if (user?.id) {
        saveUserProgressAction(user.id, cleanProgress).catch(e => 
            console.error("Failed to save progress to DB", e)
        )
      }
    }
  }, [progress, isLoaded, user])

  const addXP = (amount: number) => {
    setProgress((prev) => {
      const newXP = prev.xp + amount
      const { nivel, nombre } = calcularNivel(newXP)
      
      // Verificar si subió de nivel
      if (nivel > prev.nivel) {
        console.log(`¡Subiste al nivel ${nivel}: ${nombre}!`)
      }

      return {
        ...prev,
        xp: newXP,
        nivel,
        titulo: nombre,
        // Recalculate xpParaSiguienteNivel logic if needed, 
        // but it seems mostly derived in UI or helper.
      }
    })
  }

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

  return { progress, addXP, setProgress, completeChallenge, completeQuiz }
}
