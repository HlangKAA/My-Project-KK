/*  ═══════════════════════════════════════════════════
    useGameWorld — Game world state management hook
    Manages wizard position, entity states, quest progress,
    and world effects
    ═══════════════════════════════════════════════════ */

import { useState, useCallback, useEffect, useRef } from 'react';
import { ZONE_DATA, TILE_TYPES, TILE_SIZE } from '../data/zoneData';
import { QUEST_DATA } from '../data/questData';

// Load saved state from localStorage
function loadWorldState(storageKey) {
    try {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return null;
}

// Save state to localStorage
function saveWorldState(storageKey, state) {
    try {
        localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (e) { /* ignore */ }
}

export default function useGameWorld(zoneId, userId) {
    const storageKey = `lost-spectrum-world-state-${userId || 'guest'}`;
    const zone = ZONE_DATA[zoneId];

    // ─── World State ───
    const [savedState, setSavedState] = useState(() => loadWorldState(storageKey));
    
    // Refresh state if user changes
    useEffect(() => {
        setSavedState(loadWorldState(storageKey));
    }, [storageKey]);

    const zoneState = savedState?.zones?.[zoneId];

    const [wizardPos, setWizardPos] = useState(
        zoneState?.wizardPos || zone?.spawnPoint || { x: 2, y: 2 }
    );
    const [wizardDir, setWizardDir] = useState('down');
    const [wizardMoving, setWizardMoving] = useState(false);
    const [wizardState, setWizardState] = useState('idle'); // idle, walking, casting, success, confused

    const [completedQuests, setCompletedQuests] = useState(
        savedState?.completedQuests || []
    );
    const [entityStates, setEntityStates] = useState(
        zoneState?.entityStates || {}
    );
    const [activeEntity, setActiveEntity] = useState(null);
    const [activeQuest, setActiveQuest] = useState(null);
    const [showNPCDialog, setShowNPCDialog] = useState(false);
    const [npcDialogData, setNpcDialogData] = useState(null);
    const [interactPrompt, setInteractPrompt] = useState(null);
    const [worldEffectQueue, setWorldEffectQueue] = useState([]);
    const [isProcessingEffect, setIsProcessingEffect] = useState(false);

    // HP / MP system
    const [hp, setHP] = useState(savedState?.hp ?? 100);
    const [mp, setMP] = useState(savedState?.mp ?? 100);
    const [xp, setXP] = useState(savedState?.xp ?? 0);

    const moveTimeoutRef = useRef(null);

    // ─── Save on state change ───
    useEffect(() => {
        const state = {
            completedQuests,
            hp, mp, xp,
            zones: {
                ...savedState?.zones,
                [zoneId]: {
                    wizardPos,
                    entityStates,
                },
            },
        };
        saveWorldState(storageKey, state);
    }, [completedQuests, wizardPos, entityStates, hp, mp, xp, zoneId, storageKey, savedState]);

    // ─── Collision detection ───
    const canMoveTo = useCallback((x, y) => {
        if (!zone) return false;
        if (x < 0 || y < 0 || x >= zone.mapWidth || y >= zone.mapHeight) return false;

        const tileType = zone.tileMap[y]?.[x];
        const tile = TILE_TYPES[tileType];
        if (!tile || !tile.walkable) return false;

        // Check entity collisions (can't walk through NPCs, bosses, locked doors)
        const blockingEntity = zone.entities.find(e => {
            if (e.x !== x || e.y !== y) return false;
            if (e.type === 'npc' || e.type === 'boss') return true;
            if (e.type === 'door') {
                const doorState = entityStates[e.id]?.state || e.state;
                return doorState === 'locked';
            }
            return false;
        });

        return !blockingEntity;
    }, [zone, entityStates]);

    // ─── Get nearby entity ───
    const getNearbyEntity = useCallback((x, y) => {
        if (!zone) return null;

        // Check all 4 directions + current tile
        const positions = [
            { x, y },
            { x: x - 1, y },
            { x: x + 1, y },
            { x, y: y - 1 },
            { x, y: y + 1 },
        ];

        for (const pos of positions) {
            const entity = zone.entities.find(e => {
                if (e.x !== pos.x || e.y !== pos.y) return false;
                if (e.type === 'scenery' || e.type === 'sign') return pos.x === x && pos.y === y;
                return true;
            });
            if (entity) return entity;
        }
        return null;
    }, [zone]);

    // ─── Check interaction prompt ───
    useEffect(() => {
        const nearby = getNearbyEntity(wizardPos.x, wizardPos.y);
        if (nearby && nearby.type !== 'scenery') {
            // Check if quest prerequisites are met
            if (nearby.requiresQuest && !completedQuests.includes(nearby.requiresQuest)) {
                setInteractPrompt(null);
                return;
            }
            if (nearby.requiresQuests && !nearby.requiresQuests.every(q => completedQuests.includes(q))) {
                setInteractPrompt({ text: '🔒 Complete all other quests first', entity: nearby });
                return;
            }

            const isComplete = nearby.questId && completedQuests.includes(nearby.questId);
            if (isComplete) {
                setInteractPrompt({ text: '✅ Quest completed', entity: nearby, completed: true });
            } else if (nearby.interactPrompt) {
                setInteractPrompt({ text: nearby.interactPrompt, entity: nearby });
            } else if (nearby.type === 'npc') {
                setInteractPrompt({ text: `💬 Press SPACE to talk to ${nearby.name}`, entity: nearby });
            } else if (nearby.type === 'sign') {
                setInteractPrompt({ text: `📜 ${nearby.text}`, entity: nearby });
            }
        } else {
            setInteractPrompt(null);
        }
    }, [wizardPos, completedQuests, getNearbyEntity]);

    // ─── Move wizard ───
    const moveWizard = useCallback((direction) => {
        if (activeQuest || showNPCDialog || isProcessingEffect) return;

        const moves = {
            up:    { dx: 0, dy: -1 },
            down:  { dx: 0, dy: 1 },
            left:  { dx: -1, dy: 0 },
            right: { dx: 1, dy: 0 },
        };

        const move = moves[direction];
        if (!move) return;

        setWizardDir(direction);

        const newX = wizardPos.x + move.dx;
        const newY = wizardPos.y + move.dy;

        if (canMoveTo(newX, newY)) {
            setWizardMoving(true);
            setWizardState('walking');
            setWizardPos({ x: newX, y: newY });

            if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
            moveTimeoutRef.current = setTimeout(() => {
                setWizardMoving(false);
                setWizardState('idle');
            }, 200);
        }
    }, [wizardPos, canMoveTo, activeQuest, showNPCDialog, isProcessingEffect]);

    // ─── Interact with entity ───
    const interact = useCallback(() => {
        if (activeQuest || showNPCDialog) return;

        const nearby = getNearbyEntity(wizardPos.x, wizardPos.y);
        if (!nearby) return;

        // Check prerequisites
        if (nearby.requiresQuest && !completedQuests.includes(nearby.requiresQuest)) return;
        if (nearby.requiresQuests && !nearby.requiresQuests.every(q => completedQuests.includes(q))) return;

        // Already completed quest
        if (nearby.questId && completedQuests.includes(nearby.questId)) return;

        switch (nearby.type) {
            case 'npc': {
                // Show NPC dialog first, then open quest
                setNpcDialogData({
                    entity: nearby,
                    dialog: nearby.dialog,
                    questId: nearby.questId,
                });
                setShowNPCDialog(true);
                break;
            }
            case 'puzzle': {
                if (nearby.questId) {
                    const quest = QUEST_DATA[nearby.questId];
                    if (quest) {
                        setActiveQuest({ questId: nearby.questId, quest, entity: nearby });
                    }
                }
                break;
            }
            case 'boss': {
                if (nearby.bossDialog) {
                    setNpcDialogData({
                        entity: nearby,
                        dialog: nearby.bossDialog,
                        questId: nearby.questId,
                    });
                    setShowNPCDialog(true);
                } else if (nearby.questId) {
                    const quest = QUEST_DATA[nearby.questId];
                    if (quest) {
                        setActiveQuest({ questId: nearby.questId, quest, entity: nearby });
                    }
                }
                break;
            }
            case 'door': {
                const doorState = entityStates[nearby.id]?.state || nearby.state;
                if (doorState === 'unlocked') {
                    // Walk through door
                    if (nearby.leadsTo) {
                        setWizardPos(nearby.leadsTo);
                    }
                }
                break;
            }
            default:
                break;
        }
    }, [wizardPos, getNearbyEntity, completedQuests, activeQuest, showNPCDialog, entityStates]);

    // ─── NPC dialog complete → open quest ───
    const handleDialogComplete = useCallback(() => {
        setShowNPCDialog(false);
        if (npcDialogData?.questId) {
            const quest = QUEST_DATA[npcDialogData.questId];
            if (quest && !completedQuests.includes(npcDialogData.questId)) {
                setActiveQuest({
                    questId: npcDialogData.questId,
                    quest,
                    entity: npcDialogData.entity,
                });
            }
        }
        setNpcDialogData(null);
    }, [npcDialogData, completedQuests]);

    // ─── Complete quest ───
    const completeQuest = useCallback((questId, earnedXP = 0) => {
        if (completedQuests.includes(questId)) return;

        setCompletedQuests(prev => [...prev, questId]);
        setXP(prev => prev + earnedXP);
        setActiveQuest(null);
        setWizardState('success');

        // Queue world effect
        const quest = QUEST_DATA[questId];
        if (quest?.worldEffect) {
            setWorldEffectQueue(prev => [...prev, { questId, effect: quest.worldEffect }]);
        }

        setTimeout(() => setWizardState('idle'), 2000);
    }, [completedQuests]);

    // ─── Process world effects ───
    useEffect(() => {
        if (worldEffectQueue.length === 0 || isProcessingEffect) return;

        setIsProcessingEffect(true);
        const { effect } = worldEffectQueue[0];

        // Apply effect based on type
        switch (effect.type) {
            case 'unlock-entity': {
                setTimeout(() => {
                    setEntityStates(prev => ({
                        ...prev,
                        [effect.targetId]: { ...prev[effect.targetId], state: 'unlocked' },
                    }));
                    setIsProcessingEffect(false);
                    setWorldEffectQueue(prev => prev.slice(1));
                }, 1500);
                break;
            }
            case 'reveal-entity': {
                setTimeout(() => {
                    setEntityStates(prev => ({
                        ...prev,
                        [effect.targetId]: { ...prev[effect.targetId], revealed: true },
                    }));
                    setIsProcessingEffect(false);
                    setWorldEffectQueue(prev => prev.slice(1));
                }, 1000);
                break;
            }
            case 'restore-color': {
                if (effect.targetIds) {
                    effect.targetIds.forEach((id, i) => {
                        setTimeout(() => {
                            setEntityStates(prev => ({
                                ...prev,
                                [id]: { ...prev[id], colored: true },
                            }));
                        }, i * 500);
                    });
                }
                if (effect.unlockEntity) {
                    setTimeout(() => {
                        setEntityStates(prev => ({
                            ...prev,
                            [effect.unlockEntity]: { ...prev[effect.unlockEntity], state: 'unlocked' },
                        }));
                    }, (effect.targetIds?.length || 1) * 500);
                }
                setTimeout(() => {
                    setIsProcessingEffect(false);
                    setWorldEffectQueue(prev => prev.slice(1));
                }, (effect.targetIds?.length || 1) * 500 + 500);
                break;
            }
            case 'boss-defeated': {
                setTimeout(() => {
                    setEntityStates(prev => ({
                        ...prev,
                        ['boss-guardian']: { ...prev['boss-guardian'], defeated: true },
                    }));
                    setIsProcessingEffect(false);
                    setWorldEffectQueue(prev => prev.slice(1));
                }, 2000);
                break;
            }
            case 'bridge-repair': {
                setTimeout(() => {
                    setEntityStates(prev => ({
                        ...prev,
                        ['puzzle-bridge']: { ...prev['puzzle-bridge'], repaired: true },
                    }));
                    setIsProcessingEffect(false);
                    setWorldEffectQueue(prev => prev.slice(1));
                }, 1500);
                break;
            }
            case 'complete-zone': {
                setTimeout(() => {
                    setIsProcessingEffect(false);
                    setWorldEffectQueue(prev => prev.slice(1));
                }, 2000);
                break;
            }
            default: {
                setIsProcessingEffect(false);
                setWorldEffectQueue(prev => prev.slice(1));
            }
        }
    }, [worldEffectQueue, isProcessingEffect]);

    // ─── Close quest editor ───
    const closeQuest = useCallback(() => {
        setActiveQuest(null);
    }, []);

    // ─── HP/MP management ───
    const takeDamage = useCallback((amount) => {
        setHP(prev => Math.max(0, prev - amount));
    }, []);

    const useMP = useCallback((amount) => {
        if (mp < amount) return false;
        setMP(prev => prev - amount);
        return true;
    }, [mp]);

    const restoreHP = useCallback((amount) => {
        setHP(prev => Math.min(100, prev + amount));
    }, []);

    const restoreMP = useCallback((amount) => {
        setMP(prev => Math.min(100, prev + amount));
    }, []);

    // ─── Reset Zone ───
    const resetZone = useCallback(() => {
        setWizardPos(zone?.spawnPoint || { x: 2, y: 2 });
        setWizardDir('down');
        
        // Remove completed quests for this zone
        const zoneQuestIds = zone?.entities.map(e => e.questId).filter(Boolean) || [];
        setCompletedQuests(prev => prev.filter(q => !zoneQuestIds.includes(q)));
        
        setEntityStates({});
        setWorldEffectQueue([]);
        setIsProcessingEffect(false);
        setActiveQuest(null);
        setInteractPrompt(null);
    }, [zone]);

    // ─── Quest progress ───
    const totalQuests = zone?.entities.filter(e => e.questId).length || 0;
    const completedInZone = zone?.entities.filter(
        e => e.questId && completedQuests.includes(e.questId)
    ).length || 0;

    // ─── Current world effect message ───
    const currentEffect = worldEffectQueue.length > 0 ? worldEffectQueue[0] : null;

    return {
        // Zone info
        zone,
        tileMap: zone?.tileMap || [],

        // Wizard
        wizardPos,
        wizardDir,
        wizardMoving,
        wizardState,
        setWizardState,
        moveWizard,

        // Entities
        entityStates,
        activeEntity,
        interactPrompt,
        interact,

        // NPC Dialog
        showNPCDialog,
        npcDialogData,
        handleDialogComplete,

        // Quest
        activeQuest,
        completedQuests,
        completeQuest,
        closeQuest,

        // Stats
        hp, mp, xp,
        takeDamage,
        useMP,
        restoreHP,
        restoreMP,

        // Progress
        totalQuests,
        completedInZone,

        // Effects
        currentEffect,
        isProcessingEffect,

        resetZone,
    };
}
