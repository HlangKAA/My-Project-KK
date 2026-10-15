/*  ═══════════════════════════════════════════════════
    CodeCombatArena — 2D Interactive Grid Arena
    Executes Python code commands in real-time step-by-step
    ═══════════════════════════════════════════════════ */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import WizardSprite from '../WizardSprite';
import './CodeCombatArena.css';

const TILE_SIZE = 48; // px per tile

export default function CodeCombatArena({
    arenaConfig,
    actionQueue,
    isExecuting,
    onExecutionFinish,
    onLog,
    onReset,
}) {
    if (!arenaConfig) return null;

    const {
        cols = 10,
        rows = 7,
        theme = 'lab',
        spawn = { x: 1, y: 1 },
        flasks = [],
        items: initialItems = [],
        obstacles = [],
        altar = null,
        braziers = [],
        gate = null,
    } = arenaConfig;

    // ─── Arena State ───
    const [heroPos, setHeroPos] = useState(spawn);
    const [heroDir, setHeroDir] = useState('down');
    const [heroState, setHeroState] = useState('idle');
    const [carriedItem, setCarriedItem] = useState(null);
    const [groundItems, setGroundItems] = useState(initialItems);
    const [gateUnlocked, setGateUnlocked] = useState(false);
    const [flasksState, setFlasksState] = useState(() => {
        const initial = {};
        flasks.forEach(f => {
            initial[f.id] = { filled: false, item: null, error: false };
        });
        return initial;
    });
    const [braziersState, setBraziersState] = useState(() => {
        const initial = {};
        braziers.forEach(b => {
            initial[b.id] = { litColor: null };
        });
        return initial;
    });
    const [altarActivated, setAltarActivated] = useState(false);

    // Speed multiplier: 1x (350ms), 2x (180ms), 3x (90ms)
    const [speedMultiplier, setSpeedMultiplier] = useState(1);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [actionLogBanner, setActionLogBanner] = useState(null);

    const isRunningRef = useRef(false);
    const timerRef = useRef(null);

    // Reset arena to initial state
    const handleResetArena = useCallback((isUserClick = false) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        isRunningRef.current = false;
        setHeroPos(spawn);
        setHeroDir('down');
        setHeroState('idle');
        setCarriedItem(null);
        setGroundItems(initialItems);
        setActionLogBanner(null);
        setCurrentStepIndex(-1);

        const resetFlasks = {};
        flasks.forEach(f => {
            resetFlasks[f.id] = { filled: false, item: null, error: false };
        });
        setFlasksState(resetFlasks);

        const resetBraziers = {};
        braziers.forEach(b => {
            resetBraziers[b.id] = { litColor: null };
        });
        setBraziersState(resetBraziers);
        setAltarActivated(false);
        setGateUnlocked(false);

        if (isUserClick && onReset) onReset();
    }, [spawn, initialItems, flasks, braziers, onReset]);

    // Reset when arenaConfig changes (new stage)
    useEffect(() => {
        handleResetArena(false);
    }, [arenaConfig]);

    // ─── Play Action Queue Step-by-Step ───
    useEffect(() => {
        if (!isExecuting || !actionQueue || actionQueue.length === 0) return;

        // Reset visual positions without triggering parent onReset
        if (timerRef.current) clearTimeout(timerRef.current);
        setHeroPos(spawn);
        setHeroDir('down');
        setHeroState('idle');
        setCarriedItem(null);
        setGroundItems(initialItems);
        setActionLogBanner(null);
        setCurrentStepIndex(-1);

        const resetFlasks = {};
        flasks.forEach(f => {
            resetFlasks[f.id] = { filled: false, item: null, error: false };
        });
        setFlasksState(resetFlasks);

        const resetBraziers = {};
        braziers.forEach(b => {
            resetBraziers[b.id] = { litColor: null };
        });
        setBraziersState(resetBraziers);
        setAltarActivated(false);
        setGateUnlocked(false);

        let curPos = { ...spawn };
        let curCarried = null;
        let curItems = [...initialItems];
        let curFlasks = { ...resetFlasks };
        let curBraziers = { ...resetBraziers };
        let curAltarLit = false;

        isRunningRef.current = true;
        let stepIdx = 0;

        const baseDelay = 350 / speedMultiplier;

        const step = () => {
            if (!isRunningRef.current) return;
            if (stepIdx >= actionQueue.length) {
                // All actions finished — check victory condition
                checkVictory(curPos, curCarried, curFlasks, curBraziers, curAltarLit);
                return;
            }

            const action = actionQueue[stepIdx];
            setCurrentStepIndex(stepIdx);
            stepIdx++;

            // Process action
            let pauseNext = baseDelay;

            switch (action.type) {
                case 'move': {
                    const { dir, steps = 1 } = action;
                    const moves = {
                        right: { dx: 1, dy: 0, dir: 'right' },
                        left:  { dx: -1, dy: 0, dir: 'left' },
                        up:    { dx: 0, dy: -1, dir: 'up' },
                        down:  { dx: 0, dy: 1, dir: 'down' },
                    };
                    const move = moves[dir] || moves.right;
                    const newX = Math.max(0, Math.min(cols - 1, curPos.x + move.dx * steps));
                    const newY = Math.max(0, Math.min(rows - 1, curPos.y + move.dy * steps));

                    curPos = { x: newX, y: newY };
                    setHeroPos({ ...curPos });
                    setHeroDir(move.dir);
                    setHeroState('walking');
                    setActionLogBanner(`🚶 Moved ${dir} (${steps}) → (${newX}, ${newY})`);

                    setTimeout(() => {
                        if (isRunningRef.current) setHeroState('idle');
                    }, baseDelay * 0.8);
                    break;
                }

                case 'move_to': {
                    const targetX = Math.max(0, Math.min(cols - 1, action.x));
                    const targetY = Math.max(0, Math.min(rows - 1, action.y));
                    curPos = { x: targetX, y: targetY };
                    setHeroPos({ ...curPos });
                    setHeroState('walking');
                    setActionLogBanner(`🚶 Moved to (${targetX}, ${targetY})`);

                    setTimeout(() => {
                        if (isRunningRef.current) setHeroState('idle');
                    }, baseDelay * 0.8);
                    break;
                }

                case 'move_to_x': {
                    const targetX = Math.max(0, Math.min(cols - 1, action.targetX));
                    curPos = { ...curPos, x: targetX };
                    setHeroPos({ ...curPos });
                    setHeroState('walking');
                    setActionLogBanner(`🚶 Moved to x=${targetX}`);

                    setTimeout(() => {
                        if (isRunningRef.current) setHeroState('idle');
                    }, baseDelay * 0.8);
                    break;
                }

                case 'pick_up': {
                    setHeroState('casting');
                    // Find item on current tile
                    const itemIdx = curItems.findIndex(it => it.x === curPos.x && it.y === curPos.y);
                    if (itemIdx >= 0) {
                        const item = curItems[itemIdx];
                        curCarried = item;
                        curItems = curItems.filter((_, idx) => idx !== itemIdx);
                        setCarriedItem(item);
                        setGroundItems([...curItems]);
                        setActionLogBanner(`✨ Picked up: ${item.display}`);
                        if (onLog) onLog(`[hero.pick_up] Picked up ${item.display} (${item.type})`);
                    } else {
                        setActionLogBanner(`⚠️ Nothing here to pick up!`);
                        if (onLog) onLog(`[hero.pick_up] Warning: No item at (${curPos.x}, ${curPos.y})`);
                    }

                    setTimeout(() => {
                        if (isRunningRef.current) setHeroState('idle');
                    }, baseDelay * 0.8);
                    break;
                }

                case 'put_in': {
                    const targetFlaskId = action.target || action.targetType;
                    const flask = flasks.find(f => f.id === targetFlaskId || f.type === targetFlaskId);

                    setHeroState('casting');

                    if (!flask) {
                        setActionLogBanner(`❓ Unknown flask: ${targetFlaskId}`);
                        if (onLog) onLog(`[hero.put_in] Error: Flask '${targetFlaskId}' does not exist!`);
                        setHeroState('confused');
                        isRunningRef.current = false;
                        if (onExecutionFinish) onExecutionFinish(false, `Flask '${targetFlaskId}' not found!`);
                        return;
                    }

                    // Check distance to flask
                    const dist = Math.abs(curPos.x - flask.x) + Math.abs(curPos.y - flask.y);
                    if (dist > 1) {
                        setActionLogBanner(`⚠️ Too far from ${flask.label}! Move closer.`);
                        if (onLog) onLog(`[hero.put_in] Hero is too far from ${flask.label} (dist: ${dist}). Move adjacent to it!`);
                        setHeroState('confused');
                        isRunningRef.current = false;
                        if (onExecutionFinish) onExecutionFinish(false, `Hero is too far from ${flask.label}!`);
                        return;
                    }

                    if (!curCarried) {
                        setActionLogBanner(`⚠️ Hero is not carrying any item!`);
                        if (onLog) onLog(`[hero.put_in] Hero is not carrying anything to put into ${flask.label}!`);
                        setHeroState('confused');
                        isRunningRef.current = false;
                        if (onExecutionFinish) onExecutionFinish(false, `Hero is not carrying any item!`);
                        return;
                    }

                    // Real Type Checking!
                    const item = curCarried;
                    const isTypeMatch = item.type === flask.type;

                    if (isTypeMatch) {
                        // Success!
                        curFlasks = {
                            ...curFlasks,
                            [flask.id]: { filled: true, item, error: false },
                        };
                        setFlasksState({ ...curFlasks });
                        curCarried = null;
                        setCarriedItem(null);

                        const filledCount = Object.values(curFlasks).filter(f => f.filled).length;
                        setActionLogBanner(`✨ Stored ${item.display} in [${flask.type}]! (${filledCount}/${flasks.length})`);
                        if (onLog) onLog(`✨ Perfect! Stored ${item.display} (<class '${item.type}'>) into ${flask.label} ✓ (${filledCount}/${flasks.length})`);
                    } else {
                        // Type Error!
                        curFlasks = {
                            ...curFlasks,
                            [flask.id]: { filled: false, item, error: true },
                        };
                        setFlasksState({ ...curFlasks });
                        setActionLogBanner(`❌ TypeError: ${item.display} (${item.type}) ≠ [${flask.type}]!`);
                        if (onLog) {
                            onLog(`❌ TypeError: Cannot store '${item.display}' (${item.type}) into ${flask.label}! Expected a ${flask.type} value.`);
                        }
                        setHeroState('confused');
                        isRunningRef.current = false;
                        if (onExecutionFinish) {
                            onExecutionFinish(false, `TypeError: Cannot store '${item.display}' (${item.type}) into ${flask.label}!`);
                        }
                        return;
                    }

                    setTimeout(() => {
                        if (isRunningRef.current) setHeroState('idle');
                    }, baseDelay * 0.8);
                    break;
                }

                case 'cast_color': {
                    const [r, g, b] = action.args || [255, 0, 0];
                    setHeroState('casting');
                    const colorStr = `rgb(${r}, ${g}, ${b})`;
                    setActionLogBanner(`🎨 Cast light: (${r}, ${g}, ${b})`);

                    // Check if standing near brazier
                    const nearbyBrazier = braziers.find(br => Math.abs(curPos.x - br.x) + Math.abs(curPos.y - br.y) <= 1);
                    if (nearbyBrazier) {
                        curBraziers = {
                            ...curBraziers,
                            [nearbyBrazier.id]: { litColor: colorStr },
                        };
                        setBraziersState({ ...curBraziers });
                        if (onLog) onLog(`✨ Brazier '${nearbyBrazier.name}' ignited with ${colorStr}!`);
                    }

                    setTimeout(() => {
                        if (isRunningRef.current) setHeroState('idle');
                    }, baseDelay * 0.8);
                    break;
                }

                case 'print': {
                    const text = action.text;
                    setActionLogBanner(`💬 "${text}"`);
                    if (altar && curPos.x === altar.x && curPos.y === altar.y) {
                        if (text.toLowerCase().includes(altar.keyword?.toLowerCase() || 'lumina')) {
                            curAltarLit = true;
                            setAltarActivated(true);
                            if (onLog) onLog(`🌟 The Ancient Altar awakens with the sacred word: "${text}"!`);
                        }
                    }
                    break;
                }

                default:
                    break;
            }

            timerRef.current = setTimeout(step, pauseNext);
        };

        timerRef.current = setTimeout(step, 100);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            isRunningRef.current = false;
        };
    }, [isExecuting, actionQueue, speedMultiplier]);

    // ─── Check Victory ───
    const checkVictory = (pos, carried, flasksSt, braziersSt, altarLit) => {
        isRunningRef.current = false;

        // Condition 0: Boss Trial with Gate
        if (gate) {
            const reachedGate = Math.abs(pos.x - gate.x) + Math.abs(pos.y - gate.y) <= 1 || (pos.x === gate.x && pos.y === gate.y);
            const flasksOk = flasks.length === 0 || flasks.every(f => flasksSt[f.id]?.filled);
            const braziersOk = braziers.length === 0 || braziers.every(b => braziersSt[b.id]?.litColor);
            if (reachedGate && flasksOk && braziersOk) {
                setGateUnlocked(true);
                setHeroState('success');
                setActionLogBanner('🎉 The Prism Gate shattered! Boss Trial Conquered!');
                if (onLog) onLog('🎉 VICTORY: The Great Prism Gate has been unlocked!');
                setTimeout(() => {
                    if (onExecutionFinish) onExecutionFinish(true, 'The Prism Gate shattered!');
                }, 1000);
            } else {
                let msg = '';
                if (!flasksOk) msg = 'Must deposit the Key into the Lock Flask!';
                else if (!braziersOk) msg = 'Must ignite the Guardian Brazier with Red light!';
                else if (!reachedGate) msg = `Must move to the Prism Gate at (${gate.x}, ${gate.y})!`;
                setActionLogBanner(`⚠️ Trial Incomplete: ${msg}`);
                if (onLog) onLog(`⚠️ Boss Trial Incomplete: ${msg}`);
                if (onExecutionFinish) onExecutionFinish(false, msg);
            }
            return;
        }

        // Condition 1: Flask Sorting Stage
        if (flasks.length > 0) {
            const allFilled = flasks.every(f => flasksSt[f.id]?.filled);
            if (allFilled) {
                setHeroState('success');
                setActionLogBanner('🎉 All flasks sorted correctly! Level Complete!');
                if (onLog) onLog('🎉 VICTORY: All data types categorized properly into their containers!');
                setTimeout(() => {
                    if (onExecutionFinish) onExecutionFinish(true, 'All flasks filled correctly!');
                }, 1000);
            } else {
                const filled = Object.values(flasksSt).filter(f => f.filled).length;
                setActionLogBanner(`Incomplete: Only ${filled}/${flasks.length} flasks sorted.`);
                if (onLog) onLog(`⚠️ Execution ended: Only ${filled}/${flasks.length} flasks sorted.`);
                if (onExecutionFinish) onExecutionFinish(false, `Only ${filled}/${flasks.length} flasks filled.`);
            }
            return;
        }

        // Condition 2: Altar Stage (Movement + print)
        if (altar) {
            const reachedAltar = pos.x === altar.x && pos.y === altar.y;
            if (reachedAltar && altarLit) {
                setHeroState('success');
                setActionLogBanner('🎉 Altar awakened! Level Complete!');
                setTimeout(() => {
                    if (onExecutionFinish) onExecutionFinish(true, 'Altar awakened!');
                }, 1000);
            } else if (!reachedAltar) {
                setActionLogBanner(`⚠️ Hero did not reach the Altar at (${altar.x}, ${altar.y})!`);
                if (onLog) onLog(`⚠️ Hero stopped at (${pos.x}, ${pos.y}). Must reach the altar at (${altar.x}, ${altar.y})!`);
                if (onExecutionFinish) onExecutionFinish(false, 'Hero did not reach the altar.');
            } else {
                setActionLogBanner(`⚠️ Hero reached altar but did not chant print("${altar.keyword || 'Lumina'}")!`);
                if (onExecutionFinish) onExecutionFinish(false, 'Did not chant the sacred word.');
            }
            return;
        }

        // Condition 3: Braziers Stage (RGB Colors)
        if (braziers.length > 0) {
            const allLit = braziers.every(b => braziersSt[b.id]?.litColor);
            if (allLit) {
                setHeroState('success');
                setActionLogBanner('🎉 All Braziers ignited! Level Complete!');
                setTimeout(() => {
                    if (onExecutionFinish) onExecutionFinish(true, 'All braziers ignited!');
                }, 1000);
            } else {
                setActionLogBanner('⚠️ Not all braziers have been lit with light!');
                if (onExecutionFinish) onExecutionFinish(false, 'Not all braziers lit.');
            }
            return;
        }

        // Default: Hero moved
        setHeroState('success');
        if (onExecutionFinish) onExecutionFinish(true, 'Action completed!');
    };

    return (
        <div className={`cca-container cca-theme-${theme}`}>
            {/* ─── Top Control Bar ─── */}
            <div className="cca-toolbar">
                <div className="cca-toolbar-title">
                    <i className="fas fa-gamepad" />
                    <span>CodeCombat Arena</span>
                    {actionLogBanner && (
                        <span className="cca-log-banner">{actionLogBanner}</span>
                    )}
                </div>

                <div className="cca-toolbar-actions">
                    {/* Speed Selector */}
                    <div className="cca-speed-btns">
                        {[1, 2, 3].map(s => (
                            <button
                                key={s}
                                className={`cca-speed-btn ${speedMultiplier === s ? 'active' : ''}`}
                                onClick={() => setSpeedMultiplier(s)}
                                title={`Speed: ${s}x`}
                            >
                                {s}x
                            </button>
                        ))}
                    </div>

                    <button
                        className="cca-reset-btn"
                        onClick={() => handleResetArena(true)}
                        title="Reset arena positions"
                    >
                        <i className="fas fa-redo" /> Reset
                    </button>
                </div>
            </div>

            {/* ─── Flask Status Bar (if stage has flasks) ─── */}
            {flasks.length > 0 && (
                <div className="cca-flasks-summary">
                    <span className="cca-flasks-summary-label">
                        <i className="fas fa-flask" /> Containers:
                    </span>
                    <div className="cca-flasks-list">
                        {flasks.map(f => {
                            const st = flasksState[f.id];
                            return (
                                <div
                                    key={f.id}
                                    className={`cca-flask-chip ${st?.filled ? 'filled' : ''} ${st?.error ? 'error' : ''}`}
                                    style={{ '--flask-color': f.color }}
                                >
                                    <i className={f.icon || 'fas fa-flask'} />
                                    <span className="cca-flask-chip-name">{f.label}</span>
                                    {st?.filled && (
                                        <span className="cca-flask-chip-val">
                                            {st.item?.display} <i className="fas fa-check" />
                                        </span>
                                    )}
                                    {st?.error && (
                                        <span className="cca-flask-chip-err">
                                            <i className="fas fa-times" />
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ─── Grid Viewport ─── */}
            <div
                className="cca-grid-viewport"
                style={{
                    width: cols * TILE_SIZE,
                    height: rows * TILE_SIZE,
                }}
            >
                {/* ─── Tile Cells ─── */}
                <div
                    className="cca-grid"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, ${TILE_SIZE}px)`,
                        gridTemplateRows: `repeat(${rows}, ${TILE_SIZE}px)`,
                    }}
                >
                    {Array.from({ length: rows * cols }).map((_, idx) => {
                        const x = idx % cols;
                        const y = Math.floor(idx / cols);
                        const isObstacle = obstacles.some(ob => ob.x === x && ob.y === y);
                        return (
                            <div
                                key={idx}
                                className={`cca-cell ${(x + y) % 2 === 0 ? 'cell-even' : 'cell-odd'} ${isObstacle ? 'cell-obstacle' : ''}`}
                                title={`Tile (${x}, ${y})`}
                            >
                                <span className="cca-cell-coord">{x},{y}</span>
                            </div>
                        );
                    })}
                </div>

                {/* ─── Flasks Objects ─── */}
                {flasks.map(flask => {
                    const st = flasksState[flask.id];
                    return (
                        <div
                            key={flask.id}
                            className={`cca-flask-obj ${st?.filled ? 'filled' : ''} ${st?.error ? 'shake-err' : ''}`}
                            style={{
                                left: flask.x * TILE_SIZE,
                                top: flask.y * TILE_SIZE,
                                width: TILE_SIZE,
                                height: TILE_SIZE,
                                '--flask-theme': flask.color,
                            }}
                            title={`${flask.name} — ${flask.label}`}
                        >
                            <div className="cca-flask-icon-wrapper">
                                <i className="fas fa-flask" style={{ color: flask.color }} />
                                {st?.filled && <div className="cca-flask-bubbles" />}
                            </div>
                            <span className="cca-flask-tag">{flask.id}</span>
                            {st?.filled && (
                                <div className="cca-flask-content-badge">
                                    {st.item?.display}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* ─── Ground Items (Value Crystals) ─── */}
                {groundItems.map(item => (
                    <div
                        key={item.id}
                        className="cca-ground-item"
                        style={{
                            left: item.x * TILE_SIZE,
                            top: item.y * TILE_SIZE,
                            width: TILE_SIZE,
                            height: TILE_SIZE,
                            '--item-color': item.color || '#ec4899',
                        }}
                        title={`Value: ${item.display} (${item.type})`}
                    >
                        <div className="cca-item-crystal">
                            <i className={item.icon || 'fas fa-gem'} style={{ color: item.color }} />
                        </div>
                        <span className="cca-item-badge">{item.display}</span>
                    </div>
                ))}

                {/* ─── Altar (if present) ─── */}
                {altar && (
                    <div
                        className={`cca-altar-obj ${altarActivated ? 'activated' : ''}`}
                        style={{
                            left: altar.x * TILE_SIZE,
                            top: altar.y * TILE_SIZE,
                            width: TILE_SIZE,
                            height: TILE_SIZE,
                        }}
                        title={altar.name}
                    >
                        <i className="fas fa-monument" />
                        <span className="cca-altar-label">{altar.name}</span>
                        {altarActivated && <div className="cca-altar-glow" />}
                    </div>
                )}

                {/* ─── Braziers (if present) ─── */}
                {braziers.map(br => {
                    const st = braziersState[br.id];
                    return (
                        <div
                            key={br.id}
                            className={`cca-brazier-obj ${st?.litColor ? 'lit' : ''}`}
                            style={{
                                left: br.x * TILE_SIZE,
                                top: br.y * TILE_SIZE,
                                width: TILE_SIZE,
                                height: TILE_SIZE,
                                '--brazier-color': st?.litColor || '#666',
                            }}
                            title={br.name}
                        >
                            <i className="fas fa-fire" style={{ color: st?.litColor || '#666' }} />
                            <span className="cca-brazier-name">{br.targetColorName}</span>
                        </div>
                    );
                })}

                {/* ─── The Prism Gate (if present) ─── */}
                {gate && (
                    <div
                        className={`cca-gate-obj ${gateUnlocked ? 'unlocked' : ''}`}
                        style={{
                            left: gate.x * TILE_SIZE,
                            top: gate.y * TILE_SIZE,
                            width: TILE_SIZE,
                            height: TILE_SIZE,
                        }}
                        title={gate.name}
                    >
                        <i className={gateUnlocked ? "fas fa-door-open" : "fas fa-dungeon"} />
                        <span className="cca-gate-label">{gate.name}</span>
                        {gateUnlocked && <div className="cca-gate-glow" />}
                    </div>
                )}

                {/* ─── Hero Character ─── */}
                <div
                    className={`cca-hero ${heroDir}`}
                    style={{
                        transform: `translate(${heroPos.x * TILE_SIZE}px, ${heroPos.y * TILE_SIZE}px)`,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                    }}
                >
                    {/* Carried item floating above hero */}
                    {carriedItem && (
                        <div className="cca-hero-carrying">
                            <span className="cca-carrying-badge" style={{ borderColor: carriedItem.color }}>
                                {carriedItem.display}
                            </span>
                        </div>
                    )}

                    <div className="cca-hero-sprite-wrap">
                        <WizardSprite
                            state={heroState}
                            size="sm"
                            showParticles={heroState === 'casting' || heroState === 'success'}
                            showShadow={true}
                            showGlow={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
