'use server';

import { sql } from '@/lib/db';

export interface UserSettings {
  fontSize: number;
  language: string;
  theme: string;
}

export async function getUserSettingsAction(userId: string): Promise<{ success: boolean; data?: UserSettings }> {
  try {
    const rows = await sql`
      SELECT font_size, language, theme FROM user_settings WHERE user_id = ${userId}
    `;

    if (rows.length > 0) {
      return { 
        success: true, 
        data: {
            fontSize: rows[0].font_size,
            language: rows[0].language,
            theme: rows[0].theme
        }
      };
    }
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return { success: false };
  }
}

export async function saveUserSettingsAction(userId: string, settings: Partial<UserSettings>) {
  try {
    // We need to handle partial updates carefully or just upsert everything
    // Since we usually update one by one in UI, let's try to upsert.
    // If it doesn't exist, we need defaults.
    
    // Check existence first to avoid complex dynamic SQL if possible, or use ON CONFLICT
    // For partial updates via SQL template literals with Neon/Postgres, it's safer to read then update or use COALESCE in query if we pass all fields.
    // But here we might receive only one field.
    
    // Let's implement specific setters or a general upsert if we always pass full object.
    // To simplify, let's assume we can pass the full object or we fetch-merge-save in this action.
    
    // Better approach for partial:
    // We can't easily do dynamic columns in the `sql` tag template without risking injection or syntax errors if not careful.
    // Let's just do individual updates or require full object.
    // Given the context provider has state, it can pass the full state.
    
    if (settings.fontSize !== undefined) {
         await sql`
            INSERT INTO user_settings (user_id, font_size) VALUES (${userId}, ${settings.fontSize})
            ON CONFLICT (user_id) DO UPDATE SET font_size = EXCLUDED.font_size, updated_at = CURRENT_TIMESTAMP
        `;
    }
    
    if (settings.language !== undefined) {
         await sql`
            INSERT INTO user_settings (user_id, language) VALUES (${userId}, ${settings.language})
            ON CONFLICT (user_id) DO UPDATE SET language = EXCLUDED.language, updated_at = CURRENT_TIMESTAMP
        `;
    }

    if (settings.theme !== undefined) {
         await sql`
            INSERT INTO user_settings (user_id, theme) VALUES (${userId}, ${settings.theme})
            ON CONFLICT (user_id) DO UPDATE SET theme = EXCLUDED.theme, updated_at = CURRENT_TIMESTAMP
        `;
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving settings:', error);
    return { success: false };
  }
}
