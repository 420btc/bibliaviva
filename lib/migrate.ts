import { sql } from '@/lib/db';

export async function migrate() {
  try {
    console.log('Starting migration...');

    // Table: users
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created users table');

    // Table: bookmarks
    await sql`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        book_id TEXT NOT NULL,
        book_name TEXT NOT NULL,
        chapter INTEGER NOT NULL,
        verse INTEGER NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created bookmarks table');

    // Table: reading_progress
    await sql`
      CREATE TABLE IF NOT EXISTS reading_progress (
        user_id TEXT PRIMARY KEY,
        book_id TEXT NOT NULL,
        chapter INTEGER NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created reading_progress table');

    // Table: user_gamification
    await sql`
      CREATE TABLE IF NOT EXISTS user_gamification (
        user_id TEXT PRIMARY KEY,
        nivel INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        racha INTEGER DEFAULT 0,
        mejor_racha INTEGER DEFAULT 0,
        versiculos_leidos INTEGER DEFAULT 0,
        capitulos_completados INTEGER DEFAULT 0,
        libros_completados INTEGER DEFAULT 0,
        quizzes_completados INTEGER DEFAULT 0,
        fecha_ultimo_desafio DATE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created user_gamification table');

    // Table: user_achievements
    await sql`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        achievement_id TEXT NOT NULL,
        unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, achievement_id)
      );
    `;
    console.log('Created user_achievements table');

    // Table: user_notes
    await sql`
      CREATE TABLE IF NOT EXISTS user_notes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        date DATE NOT NULL,
        tags TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created user_notes table');

    // Table: prayers
    await sql`
      CREATE TABLE IF NOT EXISTS prayers (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        avatar TEXT,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        prayed_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        is_prayed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created prayers table');

    // Table: prayer_interactions (to track who prayed for whom)
    await sql`
      CREATE TABLE IF NOT EXISTS prayer_interactions (
        id SERIAL PRIMARY KEY,
        prayer_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        interaction_type TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(prayer_id, user_id, interaction_type)
      );
    `;
    console.log('Created prayer_interactions table');

    // Table: quiz_questions
    await sql`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id TEXT PRIMARY KEY,
        question TEXT NOT NULL,
        options TEXT NOT NULL, -- JSON string array
        correct_answer INTEGER NOT NULL,
        explanation TEXT,
        difficulty TEXT DEFAULT 'medium',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created quiz_questions table');

    // Table: user_answered_questions
    await sql`
      CREATE TABLE IF NOT EXISTS user_answered_questions (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        question_id TEXT NOT NULL,
        is_correct BOOLEAN DEFAULT TRUE,
        answered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, question_id)
      );
    `;
    console.log('Created user_answered_questions table');

    // Table: chat_messages
    await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created chat_messages table');

    // Table: user_settings
    await sql`
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id TEXT PRIMARY KEY,
        font_size INTEGER DEFAULT 18,
        language TEXT DEFAULT 'es',
        theme TEXT DEFAULT 'system',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created user_settings table');

    // Table: study_groups
    await sql`
      CREATE TABLE IF NOT EXISTS study_groups (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        members_count INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        current_reading TEXT,
        created_by TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created study_groups table');

    // Table: group_members
    await sql`
      CREATE TABLE IF NOT EXISTS group_members (
        id SERIAL PRIMARY KEY,
        group_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        role TEXT DEFAULT 'member',
        UNIQUE(group_id, user_id)
      );
    `;
    console.log('Created group_members table');

    // Table: group_messages
    await sql`
      CREATE TABLE IF NOT EXISTS group_messages (
        id TEXT PRIMARY KEY,
        group_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created group_messages table');
    
    console.log('Migration completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
}
