'use server';

import { sql } from '@/lib/db';
import { PetState, defaultPetState, calculateDecay, calculatePetLevel, PET_CONFIG } from '@/lib/pet-system';

export async function getPetStateAction(userId: string): Promise<{ success: boolean; data?: PetState }> {
    try {
        const rows = await sql`
      SELECT * FROM user_pet WHERE user_id = ${userId}
    `;

        if (rows.length === 0) {
            // Create new pet for user
            const newPet = { ...defaultPetState, createdAt: new Date().toISOString() };
            await savePetStateAction(userId, newPet);
            return { success: true, data: newPet };
        }

        const row = rows[0];

        const petState: PetState = {
            lightPoints: row.light_points,
            energy: row.energy,
            level: row.level,
            totalPointsSpent: row.total_points_spent,
            lastFed: row.last_fed ? new Date(row.last_fed).toISOString() : new Date().toISOString(),
            lastDecayCheck: row.last_decay_check ? new Date(row.last_decay_check).toISOString() : new Date().toISOString(),
            createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
            accessories: row.accessories || [],
            selectedAccessory: row.selected_accessory,
            backgroundTheme: row.background_theme || 'celestial'
        };

        // Apply decay if needed
        const { newEnergy, decayOccurred } = calculateDecay(petState);
        if (decayOccurred) {
            petState.energy = newEnergy;
            petState.lastDecayCheck = new Date().toISOString();
            // Save the decayed state
            await savePetStateAction(userId, petState);
        }

        return { success: true, data: petState };
    } catch (error) {
        console.error('Error getting pet state:', error);
        return { success: false };
    }
}

export async function savePetStateAction(userId: string, petState: PetState): Promise<{ success: boolean }> {
    try {
        await sql`
      INSERT INTO user_pet (
        user_id, light_points, energy, level, total_points_spent,
        last_fed, last_decay_check, created_at,
        accessories, selected_accessory, background_theme, updated_at
      )
      VALUES (
        ${userId}, ${petState.lightPoints}, ${petState.energy}, ${petState.level},
        ${petState.totalPointsSpent}, ${petState.lastFed}, ${petState.lastDecayCheck},
        ${petState.createdAt}, ${petState.accessories}, ${petState.selectedAccessory},
        ${petState.backgroundTheme}, CURRENT_TIMESTAMP
      )
      ON CONFLICT (user_id) DO UPDATE SET
        light_points = EXCLUDED.light_points,
        energy = EXCLUDED.energy,
        level = EXCLUDED.level,
        total_points_spent = EXCLUDED.total_points_spent,
        last_fed = EXCLUDED.last_fed,
        last_decay_check = EXCLUDED.last_decay_check,
        accessories = EXCLUDED.accessories,
        selected_accessory = EXCLUDED.selected_accessory,
        background_theme = EXCLUDED.background_theme,
        updated_at = EXCLUDED.updated_at
    `;

        return { success: true };
    } catch (error) {
        console.error('Error saving pet state:', error);
        return { success: false };
    }
}

export async function feedPetAction(userId: string): Promise<{ success: boolean; data?: PetState; message?: string }> {
    try {
        const result = await getPetStateAction(userId);
        if (!result.success || !result.data) {
            return { success: false, message: 'No se pudo obtener el estado de la mascota' };
        }

        const petState = result.data;

        // Check if user has enough points
        if (petState.lightPoints < PET_CONFIG.POINTS_TO_FEED) {
            return { success: false, message: 'No tienes suficientes puntos de luz. ¡Lee más capítulos!' };
        }

        // Feed the pet
        const newLightPoints = petState.lightPoints - PET_CONFIG.POINTS_TO_FEED;
        const newEnergy = Math.min(PET_CONFIG.MAX_ENERGY, petState.energy + PET_CONFIG.ENERGY_PER_FEED);
        const newTotalSpent = petState.totalPointsSpent + PET_CONFIG.POINTS_TO_FEED;
        const newLevel = calculatePetLevel(newTotalSpent);

        const updatedPet: PetState = {
            ...petState,
            lightPoints: newLightPoints,
            energy: newEnergy,
            totalPointsSpent: newTotalSpent,
            level: newLevel,
            lastFed: new Date().toISOString(),
            lastDecayCheck: new Date().toISOString() // Reset decay timer on feed
        };

        await savePetStateAction(userId, updatedPet);

        return { success: true, data: updatedPet };
    } catch (error) {
        console.error('Error feeding pet:', error);
        return { success: false, message: 'Error al alimentar la mascota' };
    }
}

export async function addLightPointsAction(userId: string, points: number): Promise<{ success: boolean; data?: PetState }> {
    try {
        const result = await getPetStateAction(userId);
        if (!result.success || !result.data) {
            return { success: false };
        }

        const petState = result.data;
        const updatedPet: PetState = {
            ...petState,
            lightPoints: petState.lightPoints + points
        };

        await savePetStateAction(userId, updatedPet);
        return { success: true, data: updatedPet };
    } catch (error) {
        console.error('Error adding light points:', error);
        return { success: false };
    }
}

export async function updatePetCustomizationAction(
    userId: string,
    updates: { selectedAccessory?: string | null; backgroundTheme?: string }
): Promise<{ success: boolean; data?: PetState }> {
    try {
        const result = await getPetStateAction(userId);
        if (!result.success || !result.data) {
            return { success: false };
        }

        const petState = result.data;
        const updatedPet: PetState = {
            ...petState,
            ...(updates.selectedAccessory !== undefined && { selectedAccessory: updates.selectedAccessory }),
            ...(updates.backgroundTheme && { backgroundTheme: updates.backgroundTheme })
        };

        await savePetStateAction(userId, updatedPet);
        return { success: true, data: updatedPet };
    } catch (error) {
        console.error('Error updating pet customization:', error);
        return { success: false };
    }
}
