// Sistema de gamificación para Biblia Viva

export interface UserProgress {
  nivel: number
  xp: number
  xpParaSiguienteNivel: number
  racha: number
  mejorRacha: number
  versiculosLeidos: number
  capituslosCompletados: number
  librosCompletados: number
  quizzesCompletados: number
  insignias: string[]
  titulo: string
  desafiosDiariosCompletados: string[]
  fechaUltimoDesafio: string
}

export const niveles = [
  { nivel: 1, nombre: "Explorador del Génesis", xpRequerido: 0 },
  { nivel: 2, nombre: "Discípulo Principiante", xpRequerido: 100 },
  { nivel: 3, nombre: "Buscador de Sabiduría", xpRequerido: 300 },
  { nivel: 4, nombre: "Estudiante de la Palabra", xpRequerido: 600 },
  { nivel: 5, nombre: "Guardián de Versículos", xpRequerido: 1000 },
  { nivel: 6, nombre: "Maestro de Parábolas", xpRequerido: 1500 },
  { nivel: 7, nombre: "Profeta en Formación", xpRequerido: 2200 },
  { nivel: 8, nombre: "Apóstol Digital", xpRequerido: 3000 },
  { nivel: 9, nombre: "Sabio Bíblico", xpRequerido: 4000 },
  { nivel: 10, nombre: "Maestro del Apocalipsis", xpRequerido: 5500 },
]

export const insignias = [
  { id: "primera-lectura", nombre: "Primera Lectura", descripcion: "Lee tu primer versículo", icono: "📖", xp: 10 },
  { id: "racha-7", nombre: "Semana Santa", descripcion: "7 días de lectura consecutiva", icono: "🔥", xp: 50 },
  { id: "racha-30", nombre: "Mes de Fe", descripcion: "30 días de lectura consecutiva", icono: "⭐", xp: 200 },
  {
    id: "explorador-at",
    nombre: "Explorador AT",
    descripcion: "Lee de 5 libros del Antiguo Testamento",
    icono: "📜",
    xp: 100,
  },
  {
    id: "explorador-nt",
    nombre: "Explorador NT",
    descripcion: "Lee de 5 libros del Nuevo Testamento",
    icono: "✝️",
    xp: 100,
  },
  {
    id: "quiz-maestro",
    nombre: "Maestro de Quizzes",
    descripcion: "Completa 10 quizzes con 100%",
    icono: "🏆",
    xp: 150,
  },
  { id: "compartidor", nombre: "Compartidor de Luz", descripcion: "Comparte 5 versículos", icono: "💡", xp: 75 },
  { id: "anotador", nombre: "Escriba Diligente", descripcion: "Escribe 20 notas personales", icono: "✍️", xp: 80 },
  { id: "colaborador", nombre: "Compañero de Fe", descripcion: "Únete a un grupo de estudio", icono: "👥", xp: 50 },
  {
    id: "genesis-completo",
    nombre: "Génesis Completado",
    descripcion: "Lee todo el libro de Génesis",
    icono: "🌍",
    xp: 300,
  },
]

export const desafiosDiarios = [
  {
    id: "lectura-diaria",
    nombre: "Lectura Diaria",
    descripcion: "Lee al menos un capítulo",
    xp: 20,
    completado: false,
  },
  {
    id: "verso-reflexion",
    nombre: "Verso y Reflexión",
    descripcion: "Escribe una nota sobre un versículo",
    xp: 15,
    completado: false,
  },
  { id: "quiz-dia", nombre: "Quiz del Día", descripcion: "Completa el quiz diario", xp: 25, completado: false },
  { id: "compartir", nombre: "Compartir la Palabra", descripcion: "Comparte un versículo", xp: 10, completado: false },
]

export const desafiosSemanales = [
  {
    id: "lectura-semanal",
    nombre: "Maratón de Lectura",
    descripcion: "Lee 10 capítulos esta semana",
    xp: 100,
    progreso: 0,
    meta: 10,
  },
  {
    id: "exploracion",
    nombre: "Explorador Temático",
    descripcion: "Explora 3 temas diferentes",
    xp: 75,
    progreso: 0,
    meta: 3,
  },
  {
    id: "estudio-profundo",
    nombre: "Estudio Profundo",
    descripcion: "Usa el chat IA 5 veces",
    xp: 60,
    progreso: 0,
    meta: 5,
  },
]

export function calcularNivel(xp: number): { nivel: number; nombre: string; progreso: number } {
  let nivelActual = niveles[0]
  let siguienteNivel = niveles[1]

  for (let i = niveles.length - 1; i >= 0; i--) {
    if (xp >= niveles[i].xpRequerido) {
      nivelActual = niveles[i]
      siguienteNivel = niveles[i + 1] || niveles[i]
      break
    }
  }

  const xpEnNivel = xp - nivelActual.xpRequerido
  const xpParaSiguiente = siguienteNivel.xpRequerido - nivelActual.xpRequerido
  const progreso = xpParaSiguiente > 0 ? (xpEnNivel / xpParaSiguiente) * 100 : 100

  return {
    nivel: nivelActual.nivel,
    nombre: nivelActual.nombre,
    progreso: Math.min(progreso, 100),
  }
}

export const defaultUserProgress: UserProgress = {
  nivel: 1,
  xp: 0,
  xpParaSiguienteNivel: 100,
  racha: 0,
  mejorRacha: 0,
  versiculosLeidos: 0,
  capituslosCompletados: 0,
  librosCompletados: 0,
  quizzesCompletados: 0,
  insignias: [],
  titulo: "Explorador del Génesis",
  desafiosDiariosCompletados: [],
  fechaUltimoDesafio: new Date().toISOString().split('T')[0],
}
