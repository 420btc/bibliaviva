'use server';

import { sql } from '@/lib/db';

export interface Prayer {
  id: string
  user: string
  avatar: string
  content: string
  category: string
  prayedCount: number
  comments: number
  timestamp: string
  isPrayed: boolean
}

export async function getPrayersAction(currentUserId?: string): Promise<{ success: boolean; data?: Prayer[]; error?: string }> {
  try {
    const rows = await sql`
      SELECT 
        p.id, 
        p.user_name, 
        p.avatar, 
        p.content, 
        p.category, 
        p.prayed_count, 
        p.comments_count, 
        p.created_at,
        CASE WHEN ${currentUserId || 'no_user'} = 'no_user' THEN FALSE
             ELSE EXISTS(SELECT 1 FROM prayer_interactions pi WHERE pi.prayer_id = p.id AND pi.user_id = ${currentUserId} AND pi.interaction_type = 'pray')
        END as is_prayed_by_user
      FROM prayers p
      ORDER BY p.created_at DESC
      LIMIT 50
    `;

    const prayers: Prayer[] = rows.map(row => ({
      id: row.id,
      user: row.user_name,
      avatar: row.avatar || '/placeholder-user.jpg',
      content: row.content,
      category: row.category,
      prayedCount: row.prayed_count,
      comments: row.comments_count,
      timestamp: new Date(row.created_at).toLocaleDateString(),
      isPrayed: row.is_prayed_by_user
    }));

    return { success: true, data: prayers };
  } catch (error) {
    console.error('Error fetching prayers:', error);
    return { success: false, error: 'Failed to fetch prayers' };
  }
}

export async function createPrayerAction(userId: string, userName: string, avatar: string, content: string, category: string) {
  try {
    const id = Date.now().toString(); // Or uuid
    await sql`
      INSERT INTO prayers (id, user_id, user_name, avatar, content, category, created_at)
      VALUES (${id}, ${userId}, ${userName}, ${avatar}, ${content}, ${category}, CURRENT_TIMESTAMP)
    `;
    return { success: true, id };
  } catch (error) {
    console.error('Error creating prayer:', error);
    return { success: false, error: 'Failed to create prayer' };
  }
}

export async function togglePrayAction(userId: string, prayerId: string) {
  try {
    // Check if already prayed
    const existing = await sql`
      SELECT 1 FROM prayer_interactions 
      WHERE prayer_id = ${prayerId} AND user_id = ${userId} AND interaction_type = 'pray'
    `;

    if (existing.length > 0) {
      // Remove prayer
      await sql`
        DELETE FROM prayer_interactions 
        WHERE prayer_id = ${prayerId} AND user_id = ${userId} AND interaction_type = 'pray'
      `;
      await sql`
        UPDATE prayers SET prayed_count = prayed_count - 1 WHERE id = ${prayerId}
      `;
      return { success: true, isPrayed: false };
    } else {
      // Add prayer
      await sql`
        INSERT INTO prayer_interactions (prayer_id, user_id, interaction_type)
        VALUES (${prayerId}, ${userId}, 'pray')
      `;
      await sql`
        UPDATE prayers SET prayed_count = prayed_count + 1 WHERE id = ${prayerId}
      `;
      return { success: true, isPrayed: true };
    }
  } catch (error) {
    console.error('Error toggling prayer:', error);
    return { success: false, error: 'Failed to toggle prayer' };
  }
}
