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

    await sql`
      CREATE TABLE IF NOT EXISTS completed_chapters (
        user_id TEXT NOT NULL,
        book_id TEXT NOT NULL,
        chapter INTEGER NOT NULL,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, book_id, chapter)
      );
    `;
    console.log('Created completed_chapters table');

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

    // Table: user_pet (mascota virtual - querubín de luz)
    await sql`
      CREATE TABLE IF NOT EXISTS user_pet (
        user_id TEXT PRIMARY KEY,
        light_points INTEGER DEFAULT 0,
        energy INTEGER DEFAULT 100,
        level INTEGER DEFAULT 1,
        total_points_spent INTEGER DEFAULT 0,
        last_fed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_decay_check TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        accessories TEXT[] DEFAULT '{}',
        selected_accessory TEXT,
        background_theme TEXT DEFAULT 'celestial',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created user_pet table');

    // Table: reading_plans
    await sql`
      CREATE TABLE IF NOT EXISTS reading_plans (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        duration_days INTEGER NOT NULL,
        category TEXT NOT NULL, -- 'biblia_completa', 'nuevo_testamento', 'tematico', 'devocional'
        image_gradient TEXT DEFAULT 'bg-gradient-to-br from-blue-500/20 to-purple-500/20',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created reading_plans table');

    // Table: reading_plan_days (contiene qué leer cada día)
    await sql`
      CREATE TABLE IF NOT EXISTS reading_plan_days (
        id SERIAL PRIMARY KEY,
        plan_id INTEGER NOT NULL REFERENCES reading_plans(id) ON DELETE CASCADE,
        day_number INTEGER NOT NULL,
        readings JSONB NOT NULL, -- Array de {book: 'Genesis', chapters: [1, 2, 3]}
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(plan_id, day_number)
      );
    `;
    console.log('Created reading_plan_days table');

    // Table: user_plans (suscripciones de usuarios a planes)
    await sql`
      CREATE TABLE IF NOT EXISTS user_plans (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        plan_id INTEGER NOT NULL REFERENCES reading_plans(id),
        start_date DATE DEFAULT CURRENT_DATE,
        completed_days INTEGER DEFAULT 0,
        is_completed BOOLEAN DEFAULT FALSE,
        last_read_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, plan_id)
      );
    `;
    console.log('Created user_plans table');

    // Table: user_plan_progress (progreso diario específico)
    await sql`
      CREATE TABLE IF NOT EXISTS user_plan_progress (
        id SERIAL PRIMARY KEY,
        user_plan_id INTEGER NOT NULL REFERENCES user_plans(id) ON DELETE CASCADE,
        day_number INTEGER NOT NULL,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_plan_id, day_number)
      );
    `;
    console.log('Created user_plan_progress table');

    // Insert Default Plans if empty
    const plansCount = await sql`SELECT COUNT(*) FROM reading_plans`;
    if (Number(plansCount[0].count) === 0) {
      // 1. Biblia en un Año
      const plan1 = await sql`
        INSERT INTO reading_plans (title, description, duration_days, category, image_gradient)
        VALUES ('Biblia en un Año', 'Lee toda la Biblia en 365 días con pasajes del Antiguo y Nuevo Testamento diariamente.', 365, 'biblia_completa', 'bg-gradient-to-br from-blue-500/20 to-purple-500/20')
        RETURNING id
      `;
      // Insertar días de ejemplo para Plan 1 (simplificado para demo)
      for (let i = 1; i <= 365; i++) {
         // Lógica simple para demo: Gen 1-3, Gen 4-6...
         await sql`INSERT INTO reading_plan_days (plan_id, day_number, readings) VALUES (${plan1[0].id}, ${i}, '[{"book": "Génesis", "chapters": [1]}]')`; 
      }

      // 2. Nuevo Testamento en 90 días
      const plan2 = await sql`
        INSERT INTO reading_plans (title, description, duration_days, category, image_gradient)
        VALUES ('Nuevo Testamento', 'Un recorrido profundo por la vida de Jesús y la iglesia primitiva.', 90, 'nuevo_testamento', 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20')
        RETURNING id
      `;
      
       // 3. Salmos y Proverbios
      await sql`
        INSERT INTO reading_plans (title, description, duration_days, category, image_gradient)
        VALUES ('Salmos y Proverbios', 'Sabiduría diaria y alabanza para fortalecer tu espíritu.', 30, 'tematico', 'bg-gradient-to-br from-amber-500/20 to-orange-500/20')
      `;

      // 4. Evangelios Sinópticos
      await sql`
        INSERT INTO reading_plans (title, description, duration_days, category, image_gradient)
        VALUES ('Evangelios Sinópticos', 'Estudio comparativo de Mateo, Marcos y Lucas.', 45, 'tematico', 'bg-gradient-to-br from-indigo-500/20 to-cyan-500/20')
      `;
      
      console.log('Inserted default reading plans');
    }

    console.log('Migration completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
}
