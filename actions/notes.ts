'use server';

import { sql } from '@/lib/db';

export interface Note {
  id: string
  title: string
  content: string
  date: string
  tags: string[]
}

export async function getUserNotesAction(userId: string): Promise<{ success: boolean; data?: Note[] }> {
  try {
    const rows = await sql`
      SELECT id, title, content, date, tags 
      FROM user_notes 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    const notes: Note[] = rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      date: new Date(row.date).toISOString().split('T')[0],
      tags: row.tags || []
    }));

    return { success: true, data: notes };
  } catch (error) {
    console.error('Error fetching notes:', error);
    return { success: false };
  }
}

export async function saveNoteAction(userId: string, note: Note) {
  try {
    await sql`
      INSERT INTO user_notes (id, user_id, title, content, date, tags, updated_at)
      VALUES (${note.id}, ${userId}, ${note.title}, ${note.content}, ${note.date}, ${note.tags}, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        date = EXCLUDED.date,
        tags = EXCLUDED.tags,
        updated_at = EXCLUDED.updated_at
    `;
    return { success: true };
  } catch (error) {
    console.error('Error saving note:', error);
    return { success: false, error: 'Failed to save note' };
  }
}

export async function deleteNoteAction(userId: string, noteId: string) {
  try {
    await sql`
      DELETE FROM user_notes WHERE id = ${noteId} AND user_id = ${userId}
    `;
    return { success: true };
  } catch (error) {
    console.error('Error deleting note:', error);
    return { success: false, error: 'Failed to delete note' };
  }
}

export async function syncNotesAction(userId: string, notes: Note[]) {
  try {
    for (const note of notes) {
        await saveNoteAction(userId, note);
    }
    return { success: true };
  } catch (error) {
     console.error('Error syncing notes:', error);
     return { success: false, error: 'Failed to sync notes' };
  }
}
