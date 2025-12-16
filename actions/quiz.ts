"use server"

import { sql } from "@/lib/db"
import { initialQuizQuestions } from "@/lib/initial-quiz-questions"

export async function getQuizQuestionsAction(userId: string) {
  try {
    // 1. Check if we need to seed
    const countResult = await sql`SELECT COUNT(*) as count FROM quiz_questions`
    const count = parseInt(countResult[0].count)

    // Si hay menos preguntas de las esperadas (ej. 50), re-sembrar las nuevas
    if (count < initialQuizQuestions.length) {
      console.log(`Seeding quiz questions (Current: ${count}, Target: ${initialQuizQuestions.length})...`)
      for (const q of initialQuizQuestions) {
        await sql`
          INSERT INTO quiz_questions (id, question, options, correct_answer, explanation, difficulty)
          VALUES (${q.id}, ${q.question}, ${JSON.stringify(q.options)}, ${q.correctAnswer}, ${q.explanation}, ${q.difficulty})
          ON CONFLICT (id) DO UPDATE SET 
            question = EXCLUDED.question,
            options = EXCLUDED.options,
            correct_answer = EXCLUDED.correct_answer,
            explanation = EXCLUDED.explanation,
            difficulty = EXCLUDED.difficulty
        `
      }
    }

    // 2. Get unanswered questions
    // We want 3 random questions that the user has NOT answered correctly yet.
    let questions = await sql`
      SELECT * FROM quiz_questions
      WHERE id NOT IN (
        SELECT question_id FROM user_answered_questions 
        WHERE user_id = ${userId} AND is_correct = TRUE
      )
      ORDER BY RANDOM()
      LIMIT 3
    `

    // 3. Fallback if user answered everything (or almost everything)
    if (questions.length < 3) {
      const needed = 3 - questions.length
      const existingIds = questions.map(q => q.id)
      
      // Get random questions from the ones already answered (recycle)
      // We exclude the ones we already picked in the first query
      let recycledQuestions: any[] = []
      
      if (existingIds.length > 0) {
        // Correct way to pass array to neon/postgres
        recycledQuestions = await sql`
            SELECT * FROM quiz_questions
            WHERE id != ALL(${existingIds})
            ORDER BY RANDOM()
            LIMIT ${needed}
        `
      } else {
         recycledQuestions = await sql`
            SELECT * FROM quiz_questions
            ORDER BY RANDOM()
            LIMIT ${needed}
        `
      }
      
      questions = [...questions, ...recycledQuestions]
    }

    return {
      success: true,
      questions: questions.map(q => ({
        id: q.id,
        question: q.question,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
        difficulty: q.difficulty
      }))
    }
  } catch (error) {
    console.error("Error fetching quiz questions:", error)
    // Fallback to initial questions if DB fails
    const shuffled = [...initialQuizQuestions].sort(() => 0.5 - Math.random())
    return { 
        success: true, 
        questions: shuffled.slice(0, 3) 
    }
  }
}

export async function recordQuestionAnsweredAction(userId: string, questionId: string, isCorrect: boolean) {
  try {
    await sql`
      INSERT INTO user_answered_questions (user_id, question_id, is_correct, answered_at)
      VALUES (${userId}, ${questionId}, ${isCorrect}, NOW())
      ON CONFLICT (user_id, question_id) 
      DO UPDATE SET is_correct = ${isCorrect}, answered_at = NOW()
    `
    return { success: true }
  } catch (error) {
    console.error("Error recording answer:", error)
    return { success: false, error: "Failed to record answer" }
  }
}
