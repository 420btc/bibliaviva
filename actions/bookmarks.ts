'use server';

import { sql } from '@/lib/db';

export interface Bookmark {
  id: string;
  user_id: string;
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
  created_at: string;
}

export async function saveBookmarkAction(bookmark: Bookmark) {
  try {
    await sql`
      INSERT INTO bookmarks (id, user_id, book_id, book_name, chapter, verse, text, created_at)
      VALUES (${bookmark.id}, ${bookmark.user_id}, ${bookmark.book_id}, ${bookmark.book_name}, ${bookmark.chapter}, ${bookmark.verse}, ${bookmark.text}, ${bookmark.created_at})
      ON CONFLICT (id) DO UPDATE SET
        text = EXCLUDED.text,
        created_at = EXCLUDED.created_at
    `;
    return { success: true };
  } catch (error) {
    console.error('Error saving bookmark:', error);
    return { success: false, error: 'Failed to save bookmark' };
  }
}

export async function getBookmarksAction(userId: string) {
  try {
    const rows = await sql`
      SELECT * FROM bookmarks WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    return { success: true, data: rows as Bookmark[] };
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return { success: false, error: 'Failed to fetch bookmarks' };
  }
}

export async function deleteBookmarkAction(id: string) {
  try {
    await sql`DELETE FROM bookmarks WHERE id = ${id}`;
    return { success: true };
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return { success: false, error: 'Failed to delete bookmark' };
  }
}
