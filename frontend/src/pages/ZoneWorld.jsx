/*  ═══════════════════════════════════════════════════
    ZoneWorld — Main game page with walkable 2D world
    Combines GameWorld + SpellCastOverlay + NPCDialog
    ═══════════════════════════════════════════════════ */

import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import useGameWorld from '../hooks/useGameWorld';
import useCharacterProgression from '../hooks/useCharacterProgression';
import GameWorld from '../components/GameWorld/GameWorld';
import SpellCastOverlay from '../components/SpellCastOverlay/SpellCastOverlay';
import NPCDialog from '../components/NPCDialog/NPCDialog';
import StatusBar from '../components/StatusBar/StatusBar';
import WizardProfile from '../components/WizardProfile';
import './zoneworld.css';

const ZoneWorld = () => {
    const { zoneId } = useParams();
    const navigate = useNavigate();
    const { user } = useGame();
    const { character, levelProgress, awardXP, masterConcept } = useCharacterProgression();

    const {
        zone,
        tileMap,
        wizardPos,
        wizardDir,
        wizardMoving,
        wizardState,
        setWizardState,
        moveWizard,
        entityStates,
        interactPrompt,
        interact,
        showNPCDialog,
        npcDialogData,
        handleDialogComplete,
        activeQuest,
        completedQuests,
        completeQuest,
        closeQuest,
        hp, mp, xp,
        totalQuests,
        completedInZone,
        currentEffect,
        isProcessingEffect,
        resetZone,
    } = useGameWorld(parseInt(zoneId), user?.id);

    // ─── Keyboard action handler ───
    const handleKeyAction = useCallback((action, direction) => {
        if (action === 'move') {
            moveWizard(direction);
        } else if (action === 'interact') {
            interact();
        } else if (action === 'escape') {
            if (activeQuest) {
                closeQuest();
            }
        }
    }, [moveWizard, interact, activeQuest, closeQuest]);

    // ─── Quest completion handler ───
    const handleQuestComplete = useCallback((questId, questXP) => {
        completeQuest(questId, questXP);

        // Also award XP through character progression
        const quest = activeQuest?.quest;
        if (quest) {
            awardXP(questId, questXP, { firstAttempt: true, noHints: true });
            if (quest.teachingConcepts) {
                quest.teachingConcepts.forEach(concept => masterConcept(concept));
            }
        }
    }, [completeQuest, awardXP, masterConcept, activeQuest]);

    // ─── Guard ───
    if (!zone) {
        return (
            <div className="zw-error">
                <h2>Zone not found</h2>
                <button onClick={() => navigate('/dashboard')}>Back to Map</button>
            </div>
        );
    }

    return (
        <div className="zw-page">
            {/* ─── Navbar ─── */}
            <nav className="zw-navbar">
                <div className="zw-nav-brand">
                    <div className="zw-nav-brand-icon">
                        <i className="fas fa-chess-rook" />
                    </div>
                    <span className="zw-nav-brand-text">The Lost Spectrum</span>
                </div>

                <div className="zw-nav-zone">
                    <i className="fas fa-map-marked-alt" />
                    <span>{zone.name}</span>
                    <span className="zw-nav-subtitle">{zone.subtitle}</span>
                </div>

                <div className="zw-nav-actions">
                    <button className="zw-nav-btn" onClick={resetZone} title="Restart this zone">
                        <i className="fas fa-redo" /> Reset
                    </button>
                    <button className="zw-nav-btn" onClick={() => navigate('/dashboard')}>
                        <i className="fas fa-arrow-left" /> World Map
                    </button>
                </div>

                <div className="zw-nav-profile">
                    <WizardProfile
                        character={character}
                        levelProgress={levelProgress}
                        compact={true}
                    />
                </div>
            </nav>

            {/* ─── Game World ─── */}
            <div className="zw-game-area">
                <GameWorld
                    zone={zone}
                    tileMap={tileMap}
                    wizardPos={wizardPos}
                    wizardDir={wizardDir}
                    wizardMoving={wizardMoving}
                    wizardState={wizardState}
                    entityStates={entityStates}
                    completedQuests={completedQuests}
                    interactPrompt={interactPrompt}
                    currentEffect={currentEffect}
                    isProcessingEffect={isProcessingEffect}
                    onKeyAction={handleKeyAction}
                />
            </div>

            {/* ─── Status Bar ─── */}
            <StatusBar
                hp={hp}
                mp={mp}
                xp={xp}
                questProgress={completedInZone}
                totalQuests={totalQuests}
                zoneName={zone.name}
            />

            {/* ─── NPC Dialog ─── */}
            {showNPCDialog && npcDialogData && (
                <NPCDialog
                    entity={npcDialogData.entity}
                    dialog={npcDialogData.dialog}
                    onComplete={handleDialogComplete}
                />
            )}

            {/* ─── SpellCast Overlay (Code Editor) ─── */}
            {activeQuest && (
                <SpellCastOverlay
                    questId={activeQuest.questId}
                    quest={activeQuest.quest}
                    onComplete={handleQuestComplete}
                    onClose={closeQuest}
                />
            )}
        </div>
    );
};

export default ZoneWorld;
