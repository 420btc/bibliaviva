"use client"

import { useState, useEffect } from "react"
import { defaultUserProgress, type UserProgress, calcularNivel } from "@/lib/gamification"

const STORAGE_KEY = "biblia-viva-progress"

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultUserProgress)
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar progreso al iniciar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        let loadedProgress = { ...defaultUserProgress, ...parsed }
        
        // Detección de datos "fake" antiguos (Nivel 3 con 450 XP exactos y 8 quizzes)
        // Si el usuario tiene estos datos exactos, asumimos que son los datos de prueba y los reseteamos
        if (loadedProgress.nivel === 3 && loadedProgress.xp === 450 && loadedProgress.quizzesCompletados === 8) {
           console.log("Detectados datos de prueba antiguos. Reseteando a progreso inicial.")
           loadedProgress = { ...defaultUserProgress }
        }

        // Verificar si es un nuevo día para resetear desafíos
        const today = new Date().toISOString().split('T')[0]
        if (loadedProgress.fechaUltimoDesafio !== today) {
           loadedProgress = {
             ...loadedProgress,
             desafiosDiariosCompletados: [],
             fechaUltimoDesafio: today
           }
        }
        
        setProgress(loadedProgress)
      } catch (e) {
        console.error("Error al cargar progreso:", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Guardar progreso cuando cambia
  useEffect(() => {
    if (isLoaded) {
      try {
        // Sanitize progress to ensure only expected fields are saved
        // and avoid saving potentially large accidental objects
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
        
        const serialized = JSON.stringify(cleanProgress)
        localStorage.setItem(STORAGE_KEY, serialized)
      } catch (e) {
        console.error("Error saving progress to localStorage:", e)
        // If quota exceeded, we might want to try to clear some space or notify user
        if (e instanceof DOMException && e.name === "QuotaExceededError") {
             console.warn("LocalStorage quota exceeded. Progress might not be saved.")
        }
      }
    }
  }, [progress, isLoaded])

  const addXP = (amount: number) => {
    setProgress((prev) => {
      const newXP = prev.xp + amount
      const { nivel, nombre, progreso } = calcularNivel(newXP)
      
      // Verificar si subió de nivel
      if (nivel > prev.nivel) {
        // Aquí se podría disparar una notificación de nivel nuevo
        console.log(`¡Subiste al nivel ${nivel}: ${nombre}!`)
      }

      return {
        ...prev,
        xp: newXP,
        nivel,
        titulo: nombre,
        // Recalculamos xpParaSiguienteNivel basado en el nuevo nivel
        // (Esto es una simplificación, idealmente vendría de la config de niveles)
      }
    })
  }

  const completeChallenge = (challengeId: string, xpReward: number) => {
    setProgress((prev) => {
      if (prev.desafiosDiariosCompletados?.includes(challengeId)) {
        return prev
      }

      const newXP = prev.xp + xpReward
      const { nivel, nombre } = calcularNivel(newXP)
      
      if (nivel > prev.nivel) {
        console.log(`¡Subiste al nivel ${nivel}: ${nombre}!`)
      }

      return {
        ...prev,
        xp: newXP,
        nivel,
        titulo: nombre,
        desafiosDiariosCompletados: [...(prev.desafiosDiariosCompletados || []), challengeId]
      }
    })
  }

  return {
    progress,
    isLoaded,
    addXP,
    completeChallenge
  }
}
