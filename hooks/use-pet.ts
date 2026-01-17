"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"
import {
    PetState,
    defaultPetState,
    calculateMood,
    calculateDecay,
    PetMood,
    PET_CONFIG,
    petLevels,
    accessories,
    backgroundThemes
} from "@/lib/pet-system"
import {
    getPetStateAction,
    savePetStateAction,
    feedPetAction,
    addLightPointsAction,
    updatePetCustomizationAction
} from "@/actions/pet"

const LOCAL_STORAGE_KEY = "biblia-viva-pet"

export function usePet() {
    const [petState, setPetState] = useState<PetState>(defaultPetState)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isFeeding, setIsFeeding] = useState(false)
    const { user } = useAuth()

    // Load pet state
    useEffect(() => {
        const loadPetState = async () => {
            let loadedState = defaultPetState

            // Try loading from DB if user is logged in
            if (user?.id) {
                try {
                    const result = await getPetStateAction(user.id)
                    if (result.success && result.data) {
                        loadedState = result.data

                        // Migrate from localStorage if DB is empty but localStorage has data
                        if (loadedState.lightPoints === 0 && loadedState.totalPointsSpent === 0) {
                            const local = localStorage.getItem(LOCAL_STORAGE_KEY)
                            if (local) {
                                try {
                                    const parsed = JSON.parse(local)
                                    loadedState = { ...loadedState, ...parsed }
                                    await savePetStateAction(user.id, loadedState)
                                } catch (e) {
                                    console.error("Error migrating pet data from localStorage", e)
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error("Error loading pet from DB:", e)
                }
            } else {
                // Fallback to localStorage
                const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
                if (saved) {
                    try {
                        loadedState = { ...defaultPetState, ...JSON.parse(saved) }
                    } catch (e) {
                        console.error("Error loading pet from localStorage:", e)
                    }
                }
            }

            // Apply decay
            const { newEnergy, decayOccurred } = calculateDecay(loadedState)
            if (decayOccurred) {
                loadedState = {
                    ...loadedState,
                    energy: newEnergy,
                    lastDecayCheck: new Date().toISOString()
                }
            }

            setPetState(loadedState)
            setIsLoaded(true)
        }

        loadPetState()
    }, [user])

    // Save pet state when it changes
    useEffect(() => {
        if (!isLoaded) return

        // Save to localStorage (backup)
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(petState))
        } catch (e) {
            console.warn("Failed to save pet to localStorage")
        }

        // Save to DB if logged in
        if (user?.id) {
            savePetStateAction(user.id, petState).catch(e =>
                console.error("Failed to save pet to DB:", e)
            )
        }
    }, [petState, isLoaded, user])

    // Feed the pet
    const feedPet = useCallback(async (): Promise<{ success: boolean; message?: string }> => {
        if (isFeeding) return { success: false, message: "Ya estás alimentando" }

        if (petState.lightPoints < PET_CONFIG.POINTS_TO_FEED) {
            return { success: false, message: "No tienes suficientes puntos de luz" }
        }

        setIsFeeding(true)

        try {
            if (user?.id) {
                const result = await feedPetAction(user.id)
                if (result.success && result.data) {
                    setPetState(result.data)
                    return { success: true }
                }
                return { success: false, message: result.message }
            } else {
                // Local-only feeding
                const newLightPoints = petState.lightPoints - PET_CONFIG.POINTS_TO_FEED
                const newEnergy = Math.min(PET_CONFIG.MAX_ENERGY, petState.energy + PET_CONFIG.ENERGY_PER_FEED)
                const newTotalSpent = petState.totalPointsSpent + PET_CONFIG.POINTS_TO_FEED
                const newLevel = Math.floor(newTotalSpent / PET_CONFIG.POINTS_PER_LEVEL) + 1

                setPetState(prev => ({
                    ...prev,
                    lightPoints: newLightPoints,
                    energy: newEnergy,
                    totalPointsSpent: newTotalSpent,
                    level: Math.min(newLevel, PET_CONFIG.MAX_LEVEL),
                    lastFed: new Date().toISOString(),
                    lastDecayCheck: new Date().toISOString()
                }))
                return { success: true }
            }
        } finally {
            setIsFeeding(false)
        }
    }, [petState, isFeeding, user])

    // Add light points (called when reading chapters)
    const addLightPoints = useCallback(async (points: number = PET_CONFIG.POINTS_PER_CHAPTER) => {
        if (user?.id) {
            const result = await addLightPointsAction(user.id, points)
            if (result.success && result.data) {
                setPetState(result.data)
            }
        } else {
            setPetState(prev => ({
                ...prev,
                lightPoints: prev.lightPoints + points
            }))
        }
    }, [user])

    // Update customization
    const updateCustomization = useCallback(async (updates: {
        selectedAccessory?: string | null;
        backgroundTheme?: string
    }) => {
        if (user?.id) {
            const result = await updatePetCustomizationAction(user.id, updates)
            if (result.success && result.data) {
                setPetState(result.data)
            }
        } else {
            setPetState(prev => ({
                ...prev,
                ...updates
            }))
        }
    }, [user])

    // Derived values
    const mood: PetMood = calculateMood(petState.energy)
    const levelInfo = petLevels.find(l => l.level === petState.level) || petLevels[0]
    const canFeed = petState.lightPoints >= PET_CONFIG.POINTS_TO_FEED && petState.energy < PET_CONFIG.MAX_ENERGY

    // Unlocked items
    const unlockedAccessories = accessories.filter(a => petState.level >= a.requiredLevel)
    const unlockedBackgrounds = backgroundThemes.filter(b => petState.level >= b.requiredLevel)

    return {
        petState,
        mood,
        levelInfo,
        canFeed,
        isLoaded,
        isFeeding,
        unlockedAccessories,
        unlockedBackgrounds,
        feedPet,
        addLightPoints,
        updateCustomization
    }
}
