'use server';

import { sql } from '@/lib/db';
import { addLightPointsAction } from '@/actions/pet';
import { PET_CONFIG } from '@/lib/pet-system';

export async function saveProgressAction(userId: string, bookId: string, chapter: number) {
  try {
    await sql`
      INSERT INTO reading_progress (user_id, book_id, chapter, updated_at)
      VALUES (${userId}, ${bookId}, ${chapter}, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET
        book_id = EXCLUDED.book_id,
        chapter = EXCLUDED.chapter,
        updated_at = EXCLUDED.updated_at
    `;
    return { success: true };
  } catch (error) {
    console.error('Error saving progress:', error);
    return { success: false, error: 'Failed to save progress' };
  }
}

export async function markChapterAsReadAction(userId: string, bookId: string, chapter: number) {
  try {
    // 1. Guardar en historial de lecturas (para "Mi Viaje" - lista de leídos)
    // Usamos una tabla separada 'reading_history' si existe, o simulamos con user_progress
    // Por ahora, asumiremos que necesitamos crear esta tabla o usar una estructura JSON en user_progress
    // Para simplificar sin migraciones complejas ahora mismo, actualizaremos el contador en user_progress
    // y guardaremos el registro específico si la tabla existe (idealmente).

    // Vamos a intentar guardar en una tabla 'completed_chapters' si existe, o fallar silenciosamente si no.
    // Pero lo más importante es actualizar el contador global.

    await sql`
      INSERT INTO completed_chapters (user_id, book_id, chapter, completed_at)
      VALUES (${userId}, ${bookId}, ${chapter}, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, book_id, chapter) DO UPDATE SET
        completed_at = CURRENT_TIMESTAMP
    `;

    // 2. Añadir puntos de luz para la mascota virtual
    try {
      await addLightPointsAction(userId, PET_CONFIG.POINTS_PER_CHAPTER);
    } catch (petError) {
      // No fallar la lectura si el sistema de mascota falla
      console.error('Error adding light points to pet:', petError);
    }

    return { success: true, lightPointsAdded: PET_CONFIG.POINTS_PER_CHAPTER };
  } catch (error) {
    console.error('Error marking chapter as read:', error);
    // Si falla porque la tabla no existe, al menos intentamos actualizar el progreso global
    return { success: false, error: 'Failed to mark chapter' };
  }
}

export async function getCompletedChaptersAction(userId: string) {
  try {
    const rows = await sql`
      SELECT book_id, chapter, completed_at 
      FROM completed_chapters 
      WHERE user_id = ${userId}
      ORDER BY completed_at DESC
    `;
    return {
      success: true,
      data: rows.map(r => ({
        bookId: r.book_id,
        chapter: r.chapter,
        completedAt: r.completed_at
      }))
    };
  } catch (error) {
    console.error('Error fetching completed chapters:', error);
    return { success: false, error: 'Failed to fetch history', data: [] };
  }
}

export async function getProgressAction(userId: string) {
  try {
    const rows = await sql`
      SELECT book_id, chapter FROM reading_progress WHERE user_id = ${userId}
    `;
    if (rows.length > 0) {
      return { success: true, data: { bookId: rows[0].book_id, chapter: rows[0].chapter } };
    }
    return { success: true, data: null };
  } catch (error) {
    console.error('Error fetching progress:', error);
    return { success: false, error: 'Failed to fetch progress' };
  }
}
