'use server';

import { sql } from '@/lib/db';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export async function loginOrRegisterAction(name: string, email: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Check if user exists by email
    const existing = await sql`SELECT * FROM users WHERE email = ${email}`;
    
    if (existing.length > 0) {
      const user = existing[0];
      return { 
        success: true, 
        user: { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            createdAt: new Date(user.created_at).toISOString() 
        } 
      };
    } else {
      // Register new user
      const id = crypto.randomUUID();
      await sql`
        INSERT INTO users (id, name, email)
        VALUES (${id}, ${name}, ${email})
      `;
      return { 
        success: true, 
        user: { 
            id, 
            name, 
            email, 
            createdAt: new Date().toISOString() 
        } 
      };
    }
  } catch (error) {
    console.error('Auth error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export async function syncUserAction(user: User) {
    // Ensure user exists in DB (for migration from localStorage)
    try {
        await sql`
            INSERT INTO users (id, name, email, created_at)
            VALUES (${user.id}, ${user.name}, ${user.email}, ${user.createdAt})
            ON CONFLICT (id) DO NOTHING
        `;
        // If email conflict but different ID, we might have an issue. 
        // But let's assume localStorage is source of truth for ID if it exists there first.
        // Actually, better to check email first.
        return { success: true };
    } catch (error) {
        console.error('Sync user error:', error);
        return { success: false };
    }
}
