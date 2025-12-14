'use server';

import { sql } from '@/lib/db';

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
