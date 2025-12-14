
export type SeasonType = 'christmas' | 'easter' | 'summer' | 'autumn' | 'default';

export interface SeasonConfig {
  id: SeasonType;
  name: string;
  emoji: string;
  greeting: string;
  colors: { r: number, g: number, b: number };
  accentColor: string;
  icon: string;
}

export function getCurrentSeason(): SeasonConfig {
  const today = new Date();
  const month = today.getMonth() + 1; // 1-12
  const day = today.getDate();

  // Navidad (Dic 15 - Ene 6)
  if ((month === 12 && day >= 15) || (month === 1 && day <= 6)) {
    return {
      id: 'christmas',
      name: 'Natividad',
      emoji: '🎄',
      greeting: '¡Feliz Natividad del Señor!',
      colors: { r: 0.8, g: 0.1, b: 0.1 },
      accentColor: 'text-red-500',
      icon: 'Gift'
    };
  } 
  // Semana Santa (Aprox Mar/Abr)
  else if (month === 3 || month === 4) {
    return {
      id: 'easter',
      name: 'Pascua',
      emoji: '✝️',
      greeting: 'Tiempo de Reflexión y Pascua',
      colors: { r: 0.4, g: 0.1, b: 0.6 },
      accentColor: 'text-purple-500',
      icon: 'Cross'
    };
  }
  // Verano (Jun-Ago)
  else if (month >= 6 && month <= 8) {
    return {
      id: 'summer',
      name: 'Verano',
      emoji: '☀️',
      greeting: '¡Que la luz brille en tu vida!',
      colors: { r: 0.9, g: 0.5, b: 0.1 },
      accentColor: 'text-orange-500',
      icon: 'Sun'
    };
  }
  // Otoño (Sep-Nov)
  else if (month >= 9 && month <= 11) {
    return {
      id: 'autumn',
      name: 'Otoño',
      emoji: '🍂',
      greeting: 'Tiempo de Cosecha Espiritual',
      colors: { r: 0.6, g: 0.4, b: 0.2 },
      accentColor: 'text-amber-600',
      icon: 'Leaf'
    };
  }
  
  return {
    id: 'default',
    name: 'Ordinario',
    emoji: '✨',
    greeting: 'Bienvenido de vuelta',
    colors: { r: 0.0, g: 0.5, b: 0.8 },
    accentColor: 'text-primary',
    icon: 'Sparkles'
  };
}
