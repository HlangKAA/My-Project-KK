/*  ═══════════════════════════════════════════════════
    GameWorld — 2D Tile-based game world component
    Renders the tile map, entities, wizard, and handles
    keyboard input for movement
    ═══════════════════════════════════════════════════ */

import React, { useEffect, useRef, useState } from 'react';
import { TILE_SIZE, TILE_TYPES } from '../../data/zoneData';
import WizardSprite from '../WizardSprite';
import './GameWorld.css';

// ─── Tile Renderer ───
const TileCell = React.memo(({ type, x, y }) => {
    const tile = TILE_TYPES[type] || TILE_TYPES[0];
    return (
        <div
            className={`gw-tile ${tile.cssClass}`}
            style={{
                left: x * TILE_SIZE,
                top: y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
            }}
        />
    );
});

// ─── Entity Renderer ───
const GameEntity = React.memo(({ entity, entityState, isCompleted, isBlocked }) => {
    const state = entityState || {};
    const isDefeated = state.defeated;
    const isColored = state.colored;
    const isDoorUnlocked = state.state === 'unlocked';
    const isRevealed = state.revealed;

    // Hide defeated bosses
    if (isDefeated && entity.type === 'boss') return null;

    // Hide unrevealed puzzle entities that require reveal
    // (Only hide if the entity has a prerequisite quest that needs to "reveal" it)
    // For now, all entities are visible by default

    let icon = entity.icon;
    let color = entity.spriteColor || entity.defaultColor || '#fff';
    let extraClass = '';

    // Door state
    if (entity.type === 'door') {
        if (isDoorUnlocked) {
            icon = entity.unlockedIcon || 'fas fa-door-open';
            extraClass = 'gw-entity-unlocked';
        } else {
            extraClass = 'gw-entity-locked';
        }
    }

    // Scenery color restoration
    if (entity.type === 'scenery' && entity.restoreOnQuest) {
        color = isColored ? entity.restoredColor : entity.defaultColor;
        if (isColored) extraClass += ' gw-entity-restored';
    }

    // Completed quest marker
    if (isCompleted) {
        extraClass += ' gw-entity-completed';
    }

    // Blocked (prerequisites not met)
    if (isBlocked) {
        extraClass += ' gw-entity-blocked';
    }

    // Animated scenery
    if (entity.animated) {
        extraClass += ' gw-entity-animated';
    }

    return (
        <div
            className={`gw-entity gw-entity-${entity.type} ${extraClass}`}
            style={{
                left: entity.x * TILE_SIZE,
                top: entity.y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
            }}
            title={entity.name}
        >
            <i className={icon} style={{ color }} />
            {entity.type === 'npc' && !isCompleted && (
                <div className="gw-entity-exclaim">!</div>
            )}
            {entity.type === 'boss' && (
                <div className="gw-entity-boss-aura" />
            )}
            {isCompleted && entity.type !== 'scenery' && entity.type !== 'door' && entity.type !== 'sign' && (
                <div className="gw-entity-check">
                    <i className="fas fa-check" />
                </div>
            )}
        </div>
    );
});

// ─── Main GameWorld Component ───
export default function GameWorld({
    zone,
    tileMap,
    wizardPos,
    wizardDir,
    wizardMoving,
    wizardState,
    entityStates,
    completedQuests,
    interactPrompt,
    currentEffect,
    isProcessingEffect,
    onKeyAction,
}) {
    const viewportRef = useRef(null);
    const worldRef = useRef(null);
    const [cameraPos, setCameraPos] = useState({ x: 0, y: 0 });
    const [viewportSize, setViewportSize] = useState({ w: 800, h: 600 });

    // ─── Camera follow wizard ───
    useEffect(() => {
        const vw = viewportSize.w;
        const vh = viewportSize.h;
        const worldW = (zone?.mapWidth || 20) * TILE_SIZE;
        const worldH = (zone?.mapHeight || 15) * TILE_SIZE;

        let camX = wizardPos.x * TILE_SIZE + TILE_SIZE / 2 - vw / 2;
        let camY = wizardPos.y * TILE_SIZE + TILE_SIZE / 2 - vh / 2;

        // Clamp camera
        camX = Math.max(0, Math.min(worldW - vw, camX));
        camY = Math.max(0, Math.min(worldH - vh, camY));

        setCameraPos({ x: camX, y: camY });
    }, [wizardPos, viewportSize, zone]);

    // ─── Track viewport size ───
    useEffect(() => {
        const updateSize = () => {
            if (viewportRef.current) {
                setViewportSize({
                    w: viewportRef.current.clientWidth,
                    h: viewportRef.current.clientHeight,
                });
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // ─── Keyboard input ───
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't handle keys if an input/textarea is focused
            if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') return;

            const keyMap = {
                ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
                w: 'up', s: 'down', a: 'left', d: 'right',
                W: 'up', S: 'down', A: 'left', D: 'right',
            };

            if (keyMap[e.key]) {
                e.preventDefault();
                onKeyAction('move', keyMap[e.key]);
            } else if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onKeyAction('interact');
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onKeyAction('escape');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onKeyAction]);

    if (!zone || !tileMap.length) {
        return <div className="gw-loading">Loading world...</div>;
    }

    const worldW = zone.mapWidth * TILE_SIZE;
    const worldH = zone.mapHeight * TILE_SIZE;

    return (
        <div className="gw-viewport" ref={viewportRef}>
            <div
                className="gw-world"
                ref={worldRef}
                style={{
                    width: worldW,
                    height: worldH,
                    transform: `translate(${-cameraPos.x}px, ${-cameraPos.y}px)`,
                }}
            >
                {/* ─── Tile Map ─── */}
                <div className="gw-tiles">
                    {tileMap.map((row, y) =>
                        row.map((type, x) => (
                            <TileCell key={`${x}-${y}`} type={type} x={x} y={y} />
                        ))
                    )}
                </div>

                {/* ─── Grid overlay (subtle) ─── */}
                <div className="gw-grid-overlay" style={{ width: worldW, height: worldH }} />

                {/* ─── Entities ─── */}
                <div className="gw-entities">
                    {zone.entities.map(entity => {
                        const isCompleted = entity.questId && completedQuests.includes(entity.questId);
                        const isBlocked = (
                            (entity.requiresQuest && !completedQuests.includes(entity.requiresQuest)) ||
                            (entity.requiresQuests && !entity.requiresQuests.every(q => completedQuests.includes(q)))
                        );
                        return (
                            <GameEntity
                                key={entity.id}
                                entity={entity}
                                entityState={entityStates[entity.id]}
                                isCompleted={isCompleted}
                                isBlocked={isBlocked}
                            />
                        );
                    })}
                </div>

                {/* ─── Wizard ─── */}
                <div
                    className={`gw-wizard gw-dir-${wizardDir} ${wizardMoving ? 'gw-moving' : ''}`}
                    style={{
                        left: wizardPos.x * TILE_SIZE,
                        top: wizardPos.y * TILE_SIZE,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                    }}
                >
                    <WizardSprite
                        state={wizardMoving ? 'walking' : wizardState}
                        size="sm"
                        showParticles={wizardState === 'casting' || wizardState === 'success'}
                        showShadow={true}
                        showGlow={false}
                    />
                </div>

                {/* ─── Ambient Particles ─── */}
                <div className="gw-ambient-particles">
                    {Array.from({ length: 15 }, (_, i) => (
                        <div
                            key={i}
                            className={`gw-ambient-particle gw-particle-${zone.theme}`}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 8}s`,
                                animationDuration: `${5 + Math.random() * 5}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* ─── Interaction Prompt ─── */}
            {interactPrompt && !isProcessingEffect && (
                <div className={`gw-interact-prompt ${interactPrompt.completed ? 'completed' : ''}`}>
                    <span>{interactPrompt.text}</span>
                    {!interactPrompt.completed && <span className="gw-prompt-key">SPACE</span>}
                </div>
            )}

            {/* ─── World Effect Message ─── */}
            {currentEffect && isProcessingEffect && (
                <div className="gw-effect-message">
                    <div className="gw-effect-message-inner">
                        <i className="fas fa-magic" />
                        <span>{currentEffect.effect.message}</span>
                    </div>
                </div>
            )}

            {/* ─── Movement hint (first time) ─── */}
            <div className="gw-controls-hint">
                <div className="gw-hint-keys">
                    <span className="gw-key">↑</span>
                    <div>
                        <span className="gw-key">←</span>
                        <span className="gw-key">↓</span>
                        <span className="gw-key">→</span>
                    </div>
                </div>
                <span className="gw-hint-text">Move</span>
            </div>
        </div>
    );
}
