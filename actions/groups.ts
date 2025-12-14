'use server';

import { sql } from '@/lib/db';

export interface Group {
  id: string;
  name: string;
  members: number;
  description: string;
  active: boolean;
  lastActivity: string;
  currentReading: string;
}

export interface GroupMessage {
  id: string;
  user: string;
  message: string;
  time: string;
  avatar: string;
}

export async function getGroupsAction(): Promise<{ success: boolean; data?: Group[] }> {
  try {
    const rows = await sql`
      SELECT id, name, description, members_count, active, last_activity, current_reading 
      FROM study_groups 
      ORDER BY last_activity DESC
    `;

    const groups: Group[] = rows.map(row => ({
      id: row.id,
      name: row.name,
      members: row.members_count,
      description: row.description,
      active: row.active,
      lastActivity: new Date(row.last_activity).toLocaleDateString(), // Or format relatively
      currentReading: row.current_reading
    }));

    return { success: true, data: groups };
  } catch (error) {
    console.error('Error fetching groups:', error);
    return { success: false };
  }
}

export async function createGroupAction(userId: string, name: string, description: string) {
  try {
    const id = Date.now().toString();
    await sql`
      INSERT INTO study_groups (id, name, description, created_by, members_count)
      VALUES (${id}, ${name}, ${description}, ${userId}, 1)
    `;
    
    // Add creator as member
    await sql`
        INSERT INTO group_members (group_id, user_id, role)
        VALUES (${id}, ${userId}, 'admin')
    `;

    return { success: true, id };
  } catch (error) {
    console.error('Error creating group:', error);
    return { success: false };
  }
}

export async function getGroupMessagesAction(groupId: string): Promise<{ success: boolean; data?: GroupMessage[] }> {
    try {
        const rows = await sql`
            SELECT id, user_name, message, created_at 
            FROM group_messages 
            WHERE group_id = ${groupId} 
            ORDER BY created_at ASC
        `;
        
        const messages: GroupMessage[] = rows.map(row => ({
            id: row.id,
            user: row.user_name,
            message: row.message,
            time: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: row.user_name[0]
        }));
        
        return { success: true, data: messages };
    } catch (error) {
        console.error('Error fetching messages:', error);
        return { success: false };
    }
}

export async function sendGroupMessageAction(groupId: string, userId: string, userName: string, message: string) {
    try {
        const id = Date.now().toString();
        await sql`
            INSERT INTO group_messages (id, group_id, user_id, user_name, message)
            VALUES (${id}, ${groupId}, ${userId}, ${userName}, ${message})
        `;
        
        // Update group activity
        await sql`
            UPDATE study_groups SET last_activity = CURRENT_TIMESTAMP WHERE id = ${groupId}
        `;
        
        return { success: true };
    } catch (error) {
        console.error('Error sending message:', error);
        return { success: false };
    }
}
