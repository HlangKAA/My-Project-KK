import { useState, useCallback } from 'react';
import { CHARACTER_LEVELS, calculateXP, calculateLevel, getLevelProgress, SPELLS, OUTFITS, checkOutfitUnlock } from '../data/characterData';

/**
 * useCharacterProgression — hook สำหรับจัดการ XP, Level, Spells, Outfits
 * เก็บข้อมูลใน localStorage เพื่อ persist ข้ามเซสชัน (จนกว่าจะมี backend API)
 */

const STORAGE_KEY = 'lost_spectrum_character';

const DEFAULT_CHARACTER = {
    xp: 0,
    wizardLevel: 1,
    wizardTitle: 'Novice',
    equippedOutfit: 'default',
    unlockedOutfits: ['default'],
    unlockedSpells: [],
    completedStages: {},      // { '1-1': { xp: 300, attempts: 1, hintsUsed: 0, completedAt: timestamp } }
    conceptsMastered: [],
    totalPlayTime: 0,
};

const loadCharacter = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return { ...DEFAULT_CHARACTER, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.warn('Failed to load character data:', e);
    }
    return { ...DEFAULT_CHARACTER };
};

const saveCharacter = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Failed to save character data:', e);
    }
};

const useCharacterProgression = () => {
    const [character, setCharacter] = useState(loadCharacter);

    // ─── Persist changes ───
    const updateCharacter = useCallback((updater) => {
        setCharacter(prev => {
            const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
            saveCharacter(next);
            return next;
        });
    }, []);

    // ─── Award XP and handle level ups ───
    const awardXP = useCallback((stageKey, baseXP, modifiers = {}) => {
        const { earnedXP, appliedBonuses } = calculateXP(baseXP, modifiers);

        let levelUpInfo = null;
        let newSpellUnlock = null;
        let newOutfitUnlock = null;
        let newTitleUnlock = null;

        updateCharacter(prev => {
            const newXP = prev.xp + earnedXP;
            const oldLevel = calculateLevel(prev.xp);
            const newLevel = calculateLevel(newXP);
            const leveledUp = newLevel.level > oldLevel.level;

            if (leveledUp) {
                levelUpInfo = {
                    oldLevel: oldLevel.level,
                    newLevel: newLevel.level,
                    oldTitle: oldLevel.title,
                    newTitle: newLevel.title,
                    newIcon: newLevel.icon,
                    newColor: newLevel.color,
                };
            }

            // Check spell unlocks
            const spellToUnlock = Object.entries(SPELLS).find(
                ([key, spell]) => spell.unlockStage === stageKey && !prev.unlockedSpells.includes(key)
            );
            const updatedSpells = [...prev.unlockedSpells];
            if (spellToUnlock) {
                updatedSpells.push(spellToUnlock[0]);
                newSpellUnlock = { key: spellToUnlock[0], ...spellToUnlock[1] };
            }

            // Check outfit unlocks
            const completedRegions = getCompletedRegions({ ...prev.completedStages, [stageKey]: true });
            const updatedOutfits = [...prev.unlockedOutfits];
            Object.entries(OUTFITS).forEach(([key, outfit]) => {
                if (!updatedOutfits.includes(key)) {
                    if (checkOutfitUnlock(outfit.unlockCondition, {
                        completedRegions,
                        wizardLevel: newLevel.level
                    })) {
                        updatedOutfits.push(key);
                        newOutfitUnlock = { key, ...outfit };
                    }
                }
            });

            // Record stage completion
            const updatedCompleted = {
                ...prev.completedStages,
                [stageKey]: {
                    xp: earnedXP,
                    attempts: modifiers.attempts || 1,
                    hintsUsed: modifiers.hintsUsed || 0,
                    completedAt: Date.now(),
                }
            };

            return {
                ...prev,
                xp: newXP,
                wizardLevel: newLevel.level,
                wizardTitle: newLevel.title,
                unlockedSpells: updatedSpells,
                unlockedOutfits: updatedOutfits,
                completedStages: updatedCompleted,
            };
        });

        return {
            earnedXP,
            baseXP,
            appliedBonuses,
            levelUpInfo,
            newSpellUnlock,
            newOutfitUnlock,
            newTitleUnlock,
        };
    }, [updateCharacter]);

    // ─── Master a concept ───
    const masterConcept = useCallback((conceptKey) => {
        updateCharacter(prev => {
            if (prev.conceptsMastered.includes(conceptKey)) return prev;
            return {
                ...prev,
                conceptsMastered: [...prev.conceptsMastered, conceptKey]
            };
        });
    }, [updateCharacter]);

    // ─── Equip outfit ───
    const equipOutfit = useCallback((outfitKey) => {
        updateCharacter(prev => {
            if (!prev.unlockedOutfits.includes(outfitKey)) return prev;
            return { ...prev, equippedOutfit: outfitKey };
        });
    }, [updateCharacter]);

    // ─── Check if stage is completed ───
    const isStageCompleted = useCallback((stageKey) => {
        return !!character.completedStages[stageKey];
    }, [character.completedStages]);

    // ─── Get level progress info ───
    const levelProgress = getLevelProgress(character.xp);

    // ─── Reset character (for testing) ───
    const resetCharacter = useCallback(() => {
        const fresh = { ...DEFAULT_CHARACTER };
        saveCharacter(fresh);
        setCharacter(fresh);
    }, []);

    return {
        character,
        levelProgress,
        awardXP,
        masterConcept,
        equipOutfit,
        isStageCompleted,
        resetCharacter,
    };
};

// ─── Helper: determine which regions are fully completed ───
function getCompletedRegions(completedStages) {
    const regions = [];
    // Region 1: stages 1-1 through 1-8
    if (['1-1','1-2','1-3','1-4','1-5','1-6','1-7','1-8'].every(s => completedStages[s])) regions.push(1);
    // Region 2: stages 2-1 through 2-6
    if (['2-1','2-2','2-3','2-4','2-5','2-6'].every(s => completedStages[s])) regions.push(2);
    // Region 3: stages 3-1 through 3-6
    if (['3-1','3-2','3-3','3-4','3-5','3-6'].every(s => completedStages[s])) regions.push(3);
    // Region 4: stages 4-1 through 4-6
    if (['4-1','4-2','4-3','4-4','4-5','4-6'].every(s => completedStages[s])) regions.push(4);
    return regions;
}

export default useCharacterProgression;
