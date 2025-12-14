'use server';

import { sql } from '@/lib/db';

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export async function saveChatMessageAction(userId: string, message: Message) {
  try {
    await sql`
      INSERT INTO chat_messages (id, user_id, role, content, created_at)
      VALUES (${message.id}, ${userId}, ${message.role}, ${message.content}, ${message.timestamp})
    `;
    return { success: true };
  } catch (error) {
    console.error('Error saving chat message:', error);
    return { success: false, error: 'Failed to save chat message' };
  }
}

export async function getChatHistoryAction(userId: string): Promise<{ success: boolean; data?: Message[]; error?: string }> {
  try {
    const rows = await sql`
      SELECT id, role, content, created_at 
      FROM chat_messages 
      WHERE user_id = ${userId} 
      ORDER BY created_at ASC
    `;

    const messages: Message[] = rows.map(row => ({
      id: row.id,
      role: row.role as "user" | "assistant",
      content: row.content,
      timestamp: new Date(row.created_at)
    }));

    return { success: true, data: messages };
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return { success: false, error: 'Failed to fetch chat history' };
  }
}
