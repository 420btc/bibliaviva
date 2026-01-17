// Sistema de Mascota Virtual - Biblia Viva
// Un Querubín de Luz que crece con la lectura de la Biblia

export type PetMood = 'radiante' | 'feliz' | 'normal' | 'triste' | 'dormido'

export interface PetState {
  // Core stats
  lightPoints: number          // Puntos de luz acumulados (se ganan leyendo)
  energy: number               // Energía actual (0-100), decrece con el tiempo
  level: number                // Nivel del querubín (basado en puntos gastados)
  totalPointsSpent: number     // Total de puntos gastados (para calcular nivel)
  
  // Timestamps
  lastFed: string              // ISO timestamp de última alimentación
  lastDecayCheck: string       // ISO timestamp del último chequeo de decay
  createdAt: string            // Cuando se creó la mascota
  
  // Customization (desbloqueables)
  accessories: string[]        // Accesorios desbloqueados
  selectedAccessory: string | null
  backgroundTheme: string      // Tema visual del fondo
}

export const defaultPetState: PetState = {
  lightPoints: 0,
  energy: 100,
  level: 1,
  totalPointsSpent: 0,
  lastFed: new Date().toISOString(),
  lastDecayCheck: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  accessories: [],
  selectedAccessory: null,
  backgroundTheme: 'celestial'
}

// Constantes del sistema
export const PET_CONFIG = {
  POINTS_PER_CHAPTER: 10,       // Puntos de luz por capítulo leído
  POINTS_TO_FEED: 5,            // Costo de alimentar
  ENERGY_PER_FEED: 15,          // Energía ganada al alimentar
  MAX_ENERGY: 100,
  DECAY_HOURS: 6,               // Horas entre decay
  DECAY_AMOUNT: 10,             // Energía perdida por decay
  POINTS_PER_LEVEL: 100,        // Puntos gastados para subir nivel
  MAX_LEVEL: 10
}

// Calcular el estado de ánimo basado en energía
export function calculateMood(energy: number): PetMood {
  if (energy <= 0) return 'dormido'
  if (energy < 25) return 'triste'
  if (energy < 50) return 'normal'
  if (energy < 80) return 'feliz'
  return 'radiante'
}

// Calcular el nivel basado en puntos gastados
export function calculatePetLevel(totalPointsSpent: number): number {
  const level = Math.floor(totalPointsSpent / PET_CONFIG.POINTS_PER_LEVEL) + 1
  return Math.min(level, PET_CONFIG.MAX_LEVEL)
}

// Calcular la energía después del decay natural
export function calculateDecay(state: PetState): { newEnergy: number; decayOccurred: boolean } {
  const now = new Date()
  const lastCheck = new Date(state.lastDecayCheck)
  const hoursSinceCheck = (now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60)
  
  const decayPeriods = Math.floor(hoursSinceCheck / PET_CONFIG.DECAY_HOURS)
  
  if (decayPeriods <= 0) {
    return { newEnergy: state.energy, decayOccurred: false }
  }
  
  const totalDecay = decayPeriods * PET_CONFIG.DECAY_AMOUNT
  const newEnergy = Math.max(0, state.energy - totalDecay)
  
  return { newEnergy, decayOccurred: true }
}

// Niveles del querubín con nombres temáticos
export const petLevels = [
  { level: 1, name: 'Querubín Semilla', description: 'Un pequeño ser de luz recién nacido' },
  { level: 2, name: 'Querubín Brote', description: 'Sus alas comienzan a brillar' },
  { level: 3, name: 'Querubín Resplandor', description: 'Irradia una luz suave' },
  { level: 4, name: 'Querubín Aurora', description: 'Sus colores danzan como el amanecer' },
  { level: 5, name: 'Querubín Estelar', description: 'Brilla como una estrella' },
  { level: 6, name: 'Querubín Celestial', description: 'Su presencia trae paz' },
  { level: 7, name: 'Querubín Seráfico', description: 'Canta melodías divinas' },
  { level: 8, name: 'Querubín Glorioso', description: 'Su luz ilumina caminos' },
  { level: 9, name: 'Querubín Radiante', description: 'Un faro de esperanza' },
  { level: 10, name: 'Querubín Divino', description: 'Ha alcanzado la plenitud celestial' },
]

// Fondos desbloqueables por nivel
export const backgroundThemes = [
  { id: 'celestial', name: 'Cielo Celestial', requiredLevel: 1 },
  { id: 'jardin', name: 'Jardín del Edén', requiredLevel: 3 },
  { id: 'nubes', name: 'Nubes Doradas', requiredLevel: 5 },
  { id: 'estrellas', name: 'Campo de Estrellas', requiredLevel: 7 },
  { id: 'paraiso', name: 'Paraíso Luminoso', requiredLevel: 10 },
]

// Accesorios desbloqueables
export const accessories = [
  { id: 'halo', name: 'Halo Dorado', requiredLevel: 2 },
  { id: 'arpa', name: 'Pequeña Arpa', requiredLevel: 4 },
  { id: 'corona', name: 'Corona de Olivo', requiredLevel: 6 },
  { id: 'manto', name: 'Manto Brillante', requiredLevel: 8 },
  { id: 'alas-doradas', name: 'Alas Doradas', requiredLevel: 10 },
]
