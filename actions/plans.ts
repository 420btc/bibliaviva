"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type ReadingPlan = {
  id: number
  title: string
  description: string
  duration_days: number
  category: string
  image_gradient: string
  active?: boolean
  progress?: number
  user_plan_id?: number
}

export type PlanDay = {
  id: number
  day_number: number
  readings: { book: string; chapters: number[] }[]
  is_completed?: boolean
}

// Obtener todos los planes (con estado del usuario si existe)
export async function getReadingPlansAction(userId?: string) {
  try {
    const plans = await sql`
      SELECT 
        rp.*,
        up.id as user_plan_id,
        up.completed_days,
        up.is_completed,
        CASE WHEN up.id IS NOT NULL THEN true ELSE false END as active,
        CASE 
          WHEN up.id IS NOT NULL THEN ROUND((up.completed_days::numeric / rp.duration_days::numeric) * 100, 0)
          ELSE 0 
        END as progress
      FROM reading_plans rp
      LEFT JOIN user_plans up ON rp.id = up.plan_id AND up.user_id = ${userId || 'guest'}
      ORDER BY rp.id ASC
    `
    return { success: true, data: plans as unknown as ReadingPlan[] }
  } catch (error) {
    console.error("Error fetching reading plans:", error)
    return { success: false, error: "Failed to fetch plans" }
  }
}

// Unirse a un plan
export async function joinReadingPlanAction(userId: string, planId: number) {
  try {
    await sql`
      INSERT INTO user_plans (user_id, plan_id)
      VALUES (${userId}, ${planId})
      ON CONFLICT (user_id, plan_id) DO NOTHING
    `
    revalidatePath("/planes")
    return { success: true }
  } catch (error) {
    console.error("Error joining plan:", error)
    return { success: false, error: "Failed to join plan" }
  }
}

// Abandonar un plan
export async function leaveReadingPlanAction(userId: string, planId: number) {
  try {
    await sql`
      DELETE FROM user_plans 
      WHERE user_id = ${userId} AND plan_id = ${planId}
    `
    revalidatePath("/planes")
    return { success: true }
  } catch (error) {
    console.error("Error leaving plan:", error)
    return { success: false, error: "Failed to leave plan" }
  }
}

// Obtener detalles de un plan (días y lecturas)
export async function getPlanDetailsAction(planId: number, userId?: string) {
  try {
    const plan = await sql`SELECT * FROM reading_plans WHERE id = ${planId}`
    if (plan.length === 0) return { success: false, error: "Plan not found" }

    let userPlanId = null
    if (userId) {
      const userPlan = await sql`SELECT id FROM user_plans WHERE user_id = ${userId} AND plan_id = ${planId}`
      if (userPlan.length > 0) userPlanId = userPlan[0].id
    }

    const days = await sql`
      SELECT 
        rpd.*,
        CASE 
          WHEN upp.id IS NOT NULL THEN true 
          ELSE false 
        END as is_completed
      FROM reading_plan_days rpd
      LEFT JOIN user_plan_progress upp ON rpd.day_number = upp.day_number AND upp.user_plan_id = ${userPlanId}
      WHERE rpd.plan_id = ${planId}
      ORDER BY rpd.day_number ASC
    `

    return { success: true, plan: plan[0], days: days as unknown as PlanDay[], userPlanId }
  } catch (error) {
    console.error("Error fetching plan details:", error)
    return { success: false, error: "Failed to fetch details" }
  }
}

// Marcar día como completado
export async function completePlanDayAction(userId: string, planId: number, dayNumber: number) {
  try {
    // 1. Get user_plan_id
    const userPlan = await sql`SELECT id, completed_days FROM user_plans WHERE user_id = ${userId} AND plan_id = ${planId}`
    if (userPlan.length === 0) return { success: false, error: "User not subscribed to this plan" }
    
    const userPlanId = userPlan[0].id

    // 2. Mark day as completed
    await sql`
      INSERT INTO user_plan_progress (user_plan_id, day_number)
      VALUES (${userPlanId}, ${dayNumber})
      ON CONFLICT (user_plan_id, day_number) DO NOTHING
    `

    // 3. Update completed_days count
    await sql`
      UPDATE user_plans 
      SET completed_days = (SELECT COUNT(*) FROM user_plan_progress WHERE user_plan_id = ${userPlanId}),
          last_read_at = CURRENT_TIMESTAMP
      WHERE id = ${userPlanId}
    `

    revalidatePath("/planes")
    return { success: true }
  } catch (error) {
    console.error("Error completing day:", error)
    return { success: false, error: "Failed to complete day" }
  }
}
