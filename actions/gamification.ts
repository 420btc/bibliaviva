'use server';

import { sql } from '@/lib/db';
import { UserProgress, defaultUserProgress, calcularNivel, niveles } from '@/lib/gamification';

export async function getUserProgressAction(userId: string): Promise<{ success: boolean; data?: UserProgress }> {
  try {
    const rows = await sql`
      SELECT * FROM user_gamification WHERE user_id = ${userId}
    `;

    if (rows.length === 0) {
      return { success: true, data: defaultUserProgress };
    }

    const row = rows[0];
    
    // Fetch achievements
    const achievements = await sql`
        SELECT achievement_id FROM user_achievements WHERE user_id = ${userId}
    `;
    const badges = achievements.map(a => a.achievement_id);

    const { nombre, nivel } = calcularNivel(row.xp);
    
    // Calculate XP for next level
    let nextLevelXP = 100;
    const currentLevelIndex = niveles.findIndex(n => n.nivel === nivel);
    if (currentLevelIndex !== -1 && currentLevelIndex < niveles.length - 1) {
        nextLevelXP = niveles[currentLevelIndex + 1].xpRequerido;
    } else {
        // Max level or not found
        nextLevelXP = niveles[niveles.length - 1].xpRequerido * 1.5; // Placeholder for max level
    }

    const progress: UserProgress = {
      nivel: row.nivel,
      xp: row.xp,
      xpParaSiguienteNivel: nextLevelXP,
      racha: row.racha,
      mejorRacha: row.mejor_racha,
      versiculosLeidos: row.versiculos_leidos,
      capituslosCompletados: row.capitulos_completados,
      librosCompletados: row.libros_completados,
      quizzesCompletados: row.quizzes_completados,
      insignias: badges,
      titulo: nombre,
      desafiosDiariosCompletados: row.daily_challenges_completed || [],
      fechaUltimoDesafio: row.fecha_ultimo_desafio ? new Date(row.fecha_ultimo_desafio).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    };
    
    return { success: true, data: progress };
  } catch (error) {
    console.error('Error getting progress:', error);
    return { success: false };
  }
}

export async function saveUserProgressAction(userId: string, progress: UserProgress) {
  try {
    // Transaction-like approach (though neondb serverless via http doesn't support complex transactions easily unless we use a specific query structure, but we can just run sequential queries)
    
    await sql`
      INSERT INTO user_gamification (
        user_id, nivel, xp, racha, mejor_racha, 
        versiculos_leidos, capitulos_completados, libros_completados, 
        quizzes_completados, fecha_ultimo_desafio, daily_challenges_completed, updated_at
      )
      VALUES (
        ${userId}, ${progress.nivel}, ${progress.xp}, ${progress.racha}, ${progress.mejorRacha},
        ${progress.versiculosLeidos}, ${progress.capituslosCompletados}, ${progress.librosCompletados},
        ${progress.quizzesCompletados}, ${progress.fechaUltimoDesafio}, ${progress.desafiosDiariosCompletados}, CURRENT_TIMESTAMP
      )
      ON CONFLICT (user_id) DO UPDATE SET
        nivel = EXCLUDED.nivel,
        xp = EXCLUDED.xp,
        racha = EXCLUDED.racha,
        mejor_racha = EXCLUDED.mejor_racha,
        versiculos_leidos = EXCLUDED.versiculos_leidos,
        capitulos_completados = EXCLUDED.capitulos_completados,
        libros_completados = EXCLUDED.libros_completados,
        quizzes_completados = EXCLUDED.quizzes_completados,
        fecha_ultimo_desafio = EXCLUDED.fecha_ultimo_desafio,
        daily_challenges_completed = EXCLUDED.daily_challenges_completed,
        updated_at = EXCLUDED.updated_at
    `;

    // Save achievements
    // We only insert new ones. We don't delete.
    if (progress.insignias && progress.insignias.length > 0) {
        for (const badgeId of progress.insignias) {
            await sql`
                INSERT INTO user_achievements (user_id, achievement_id)
                VALUES (${userId}, ${badgeId})
                ON CONFLICT (user_id, achievement_id) DO NOTHING
            `;
        }
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving progress:', error);
    return { success: false, error: 'Failed to save progress' };
  }
}
