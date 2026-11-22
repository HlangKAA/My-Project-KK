/*  ═══════════════════════════════════════════════════
    CodeCombatArena — 2D Interactive Grid Arena
    Executes Python code commands in real-time step-by-step
    ═══════════════════════════════════════════════════ */

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import WizardSprite from '@/features/character/WizardSprite';
import { areColorTargetsMatched, isValidRgb } from './colorTargets';
import { colorFailure } from '@/features/gameplay/spellFeedback';
import { computeWalkablePathTiles } from './walkablePath';
import {
    ArenaTileSvg,
    ArenaObstacleSprite,
    ArenaAltarSprite,
    ArenaFlaskSprite,
    ArenaCrystalItemSprite,
    ArenaColorTargetSprite,
    ArenaGateSprite,
    ArenaPortalTrapSprite,
} from './ArenaSprites';
import './CodeCombatArena.css';

const TILE_SIZE = 48; // px per tile
const PLAYFIELD_FIT = 0.9;
const EMPTY_LIST = [];
const DEFAULT_SPAWN = { x: 1, y: 1 };

const THEME_ENVIRONMENT = {
    forest: {
        name: 'The Red Forest',
        nameThai: 'ป่าแดงโบราณ',
        icon: 'fas fa-tree',
        obstacleIcons: ['fas fa-tree', 'fas fa-archway', 'fas fa-mountain'],
        obstacleLabel: 'Ancient Crimson Tree & Ruin Pillar',
        obstacleLabelThai: 'ต้นไม้แดงโบราณและเสาหิน',
        decorIcons: ['fas fa-seedling', 'fas fa-leaf', 'fas fa-feather-alt'],
    },
    lab: {
        name: "Alchemist's Laboratory",
        nameThai: 'ห้องทดลองเล่นแร่แปรธาตุ',
        icon: 'fas fa-flask',
        obstacleIcons: ['fas fa-vial', 'fas fa-mortar-pestle', 'fas fa-burn'],
        obstacleLabel: 'Alchemical Apparatus Table',
        obstacleLabelThai: 'โต๊ะอุปกรณ์เล่นแร่แปรธาตุ',
        decorIcons: ['fas fa-atom', 'fas fa-sparkles', 'fas fa-vials'],
    },
    gate: {
        name: 'Ancient Gate Sanctuary',
        nameThai: 'วิหารประตูโบราณ',
        icon: 'fas fa-dungeon',
        obstacleIcons: ['fas fa-archway', 'fas fa-monument', 'fas fa-tree'],
        obstacleLabel: 'Sanctuary Stone Pillar',
        obstacleLabelThai: 'เสาหินวิหารโบราณ',
        decorIcons: ['fas fa-fire-alt', 'fas fa-shield-alt', 'fas fa-leaf'],
    },
    archive: {
        name: "The Scholar's Archive",
        nameThai: 'หอจดหมายเหตุนักปราชญ์',
        icon: 'fas fa-book-open',
        obstacleIcons: ['fas fa-book', 'fas fa-landmark', 'fas fa-scroll'],
        obstacleLabel: 'Arcane Tome Pedestal & Pillar',
        obstacleLabelThai: 'แท่นคัมภีร์และเสาหอจดหมายเหตุ',
        decorIcons: ['fas fa-feather-alt', 'fas fa-scroll', 'fas fa-compass'],
    },
    cavern: {
        name: 'Whispering Caverns',
        nameThai: 'ถ้ำเสียงกระซิบ',
        icon: 'fas fa-gem',
        obstacleIcons: ['fas fa-gem', 'fas fa-mountain', 'fas fa-icicles'],
        obstacleLabel: 'Crystal Stalagmite Formation',
        obstacleLabelThai: 'หินงอกผลึกคริสตัล',
        decorIcons: ['fas fa-gem', 'fas fa-star', 'fas fa-water'],
    },
    peaks: {
        name: 'Ash Peaks Summit',
        nameThai: 'ยอดเขาเถ้าถ่าน',
        icon: 'fas fa-mountain',
        obstacleIcons: ['fas fa-mountain', 'fas fa-monument', 'fas fa-meteor'],
        obstacleLabel: 'Obsidian Spire & Volcanic Rock',
        obstacleLabelThai: 'เสาหินออบซิเดียนและหินภูเขาไฟ',
        decorIcons: ['fas fa-fire', 'fas fa-bolt', 'fas fa-mountain'],
    },
};

export default function CodeCombatArena(props) {
    if (!props.arenaConfig) return null;
    return <CodeCombatArenaContent {...props} />;
}

function CodeCombatArenaContent({
    arenaConfig,
    actionQueue,
    isExecuting,
    onExecutionFinish,
    onLog,
    onReset,
    isThai = false,
}) {
    const {
        cols = 10,
        rows = 7,
        theme = 'lab',
        spawn = DEFAULT_SPAWN,
        flasks = EMPTY_LIST,
        items: initialItems = EMPTY_LIST,
        obstacles = EMPTY_LIST,
        altar = null,
        braziers = EMPTY_LIST,
        colorTargets = EMPTY_LIST,
        gate = null,
        murals = EMPTY_LIST,
        boss = null,
        hazards = EMPTY_LIST,
        portals = EMPTY_LIST,
        blockMovement = false,
    } = arenaConfig;

    const gridAreaRef = useRef(null);
    const [gridScale, setGridScale] = useState(null);

    useLayoutEffect(() => {
        const area = gridAreaRef.current;
        if (!area) return;

        const fitGrid = () => {
            const { width, height } = area.getBoundingClientRect();
            if (width > 0 && height > 0) {
                const gridWidth = cols * TILE_SIZE + 4;
                const gridHeight = rows * TILE_SIZE + 4;
                setGridScale(Math.min(width / gridWidth, height / gridHeight) * PLAYFIELD_FIT);
            }
        };

        fitGrid();
        const observer = new ResizeObserver(fitGrid);
        observer.observe(area);
        return () => observer.disconnect();
    }, [cols, rows]);

    // ─── Arena State ───
    const [heroPos, setHeroPos] = useState(spawn);
    const [heroDir, setHeroDir] = useState('down');
    const [heroState, setHeroState] = useState('idle');
    const [walkStep, setWalkStep] = useState(0);
    const [stepBurst, setStepBurst] = useState(null);
    const [castBeam, setCastBeam] = useState(null);
    const [portalTrapTile, setPortalTrapTile] = useState(null);
    const [visitedTiles, setVisitedTiles] = useState(() => [`${spawn.x},${spawn.y}`]);
    const [carriedItem, setCarriedItem] = useState(null);
    const [groundItems, setGroundItems] = useState(initialItems);
    const [gateUnlocked, setGateUnlocked] = useState(false);
    const [bossStrike, setBossStrike] = useState(0);
    const envMeta = THEME_ENVIRONMENT[theme] || THEME_ENVIRONMENT.forest;
    const walkablePathSet = useMemo(() => computeWalkablePathTiles({
        cols,
        rows,
        spawn,
        items: initialItems,
        flasks,
        colorTargets,
        braziers,
        altar,
        gate,
        obstacles,
        hazards,
        portals,
    }), [cols, rows, spawn, initialItems, flasks, colorTargets, braziers, altar, gate, obstacles, hazards, portals]);
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
        colorTargets.forEach(target => {
            initial[target.id] = { litColor: null, rgb: null };
        });
        return initial;
    });
    const [altarActivated, setAltarActivated] = useState(false);

    // Speed multiplier: 1x (350ms), 2x (180ms), 3x (90ms)
    const [speedMultiplier, setSpeedMultiplier] = useState(1);
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
        setWalkStep(0);
        setStepBurst(null);
        setCastBeam(null);
        setPortalTrapTile(null);
        setVisitedTiles([`${spawn.x},${spawn.y}`]);
        setCarriedItem(null);
        setGroundItems(initialItems);
        setActionLogBanner(null);

        const resetFlasks = {};
        flasks.forEach(f => {
            resetFlasks[f.id] = { filled: false, item: null, error: false };
        });
        setFlasksState(resetFlasks);

        const resetBraziers = {};
        braziers.forEach(b => {
            resetBraziers[b.id] = { litColor: null };
        });
        colorTargets.forEach(target => {
            resetBraziers[target.id] = { litColor: null, rgb: null };
        });
        setBraziersState(resetBraziers);
        setAltarActivated(false);
        setGateUnlocked(false);
        setBossStrike(0);

        if (isUserClick && onReset) onReset();
    }, [spawn, initialItems, flasks, braziers, colorTargets, onReset]);

    // ─── Play Action Queue Step-by-Step ───
    const checkVictory = useCallback((pos, carried, flasksSt, braziersSt, altarLit) => {
        isRunningRef.current = false;

        const hasObjectives = Boolean(gate || flasks.length > 0 || altar || colorTargets.length > 0 || braziers.length > 0);
        if (!hasObjectives) {
            setHeroState('success');
            if (onExecutionFinish) onExecutionFinish(true, 'Action completed!');
            return;
        }

        const flasksOk = flasks.length === 0 || flasks.every(f => flasksSt[f.id]?.filled);
        const colorsOk = colorTargets.length === 0 || areColorTargetsMatched(colorTargets, braziersSt);
        const braziersOk = braziers.length === 0 || braziers.every(b => braziersSt[b.id]?.litColor);
        const altarOk = !altar || (pos.x === altar.x && pos.y === altar.y && altarLit);
        const reachedGate = !gate || Math.abs(pos.x - gate.x) + Math.abs(pos.y - gate.y) <= 1 || (pos.x === gate.x && pos.y === gate.y);
        const chantOk = !gate?.keyword || altarLit;

        if (!flasksOk) {
            const filled = Object.values(flasksSt).filter(f => f.filled).length;
            setActionLogBanner(`Incomplete: Only ${filled}/${flasks.length} containers filled.`);
            if (onLog) onLog(`⚠️ Execution ended: Only ${filled}/${flasks.length} containers filled.`);
            if (onExecutionFinish) onExecutionFinish(false, { kind: 'flaskIncomplete', name: flasks.find(f => !flasksSt[f.id]?.filled)?.label });
            return;
        }

        if (!colorsOk) {
            setActionLogBanner('Match the RGB color of every faded object.');
            if (onExecutionFinish) onExecutionFinish(false, colorFailure(colorTargets, braziersSt));
            return;
        }

        if (!braziersOk) {
            setActionLogBanner('⚠️ Not all braziers have been lit with light!');
            if (onExecutionFinish) onExecutionFinish(false, { kind: 'brazierMissing', name: braziers.find(b => !braziersSt[b.id]?.litColor)?.name });
            return;
        }

        if (!altarOk) {
            if (pos.x !== altar.x || pos.y !== altar.y) {
                setActionLogBanner(`⚠️ Hero did not reach the Altar at (${altar.x}, ${altar.y})!`);
                if (onLog) onLog(`⚠️ Hero stopped at (${pos.x}, ${pos.y}). Must reach the altar at (${altar.x}, ${altar.y})!`);
                if (onExecutionFinish) onExecutionFinish(false, { kind: 'altarPosition', x: pos.x, y: pos.y });
            } else {
                setActionLogBanner(`⚠️ Hero reached altar but did not chant print("${altar.keyword || 'Lumina'}")!`);
                if (onExecutionFinish) onExecutionFinish(false, { kind: 'altarChant' });
            }
            return;
        }

        if (!chantOk) {
            setActionLogBanner('Trial incomplete. Speak the opening incantation.');
            if (onExecutionFinish) onExecutionFinish(false, { kind: 'gateChant', name: gate.name });
            return;
        }

        if (!reachedGate) {
            setActionLogBanner('Trial incomplete. Reach the gate.');
            if (onExecutionFinish) onExecutionFinish(false, { kind: 'gatePosition', name: gate.name, x: gate.x, y: gate.y });
            return;
        }

        if (gate) setGateUnlocked(true);
        setHeroState('success');
        const msg = gate
            ? `${gate.name} unlocked!`
            : altar
                ? 'Altar awakened!'
                : colorTargets.length > 0
                    ? 'All color targets restored!'
                    : flasks.length > 0
                        ? 'All flasks filled correctly!'
                        : 'All braziers ignited!';
        setActionLogBanner(`🎉 ${msg} Level Complete!`);
        if (onLog) onLog(`🎉 VICTORY: ${msg}`);
        const delayMs = (gate || altar || flasks.length > 0 || braziers.length > 0) ? 700 : 0;
        if (delayMs > 0) {
            setTimeout(() => {
                if (onExecutionFinish) onExecutionFinish(true, msg);
            }, delayMs);
        } else if (onExecutionFinish) {
            onExecutionFinish(true, msg);
        }
    }, [gate, flasks, braziers, colorTargets, altar, onExecutionFinish, onLog]);


    useEffect(() => {
        if (!isExecuting || !actionQueue || actionQueue.length === 0) return;

        // Reset visual positions without triggering parent onReset
        if (timerRef.current) clearTimeout(timerRef.current);
        setHeroPos(spawn);
        setHeroDir('down');
        setHeroState('idle');
        setWalkStep(0);
        setStepBurst(null);
        setCastBeam(null);
        setPortalTrapTile(null);
        setVisitedTiles([`${spawn.x},${spawn.y}`]);
        setCarriedItem(null);
        setGroundItems(initialItems);
        setActionLogBanner(null);

        const resetFlasks = {};
        flasks.forEach(f => {
            resetFlasks[f.id] = { filled: false, item: null, error: false };
        });
        setFlasksState(resetFlasks);

        const resetBraziers = {};
        braziers.forEach(b => {
            resetBraziers[b.id] = { litColor: null };
        });
        colorTargets.forEach(target => {
            resetBraziers[target.id] = { litColor: null, rgb: null };
        });
        setBraziersState(resetBraziers);
        setAltarActivated(false);
        setGateUnlocked(false);
        setBossStrike(0);

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

                    const stepTiles = Array.from({ length: steps }, (_, index) => ({
                        x: Math.max(0, Math.min(cols - 1, curPos.x + move.dx * (index + 1))),
                        y: Math.max(0, Math.min(rows - 1, curPos.y + move.dy * (index + 1))),
                    }));

                    for (const tile of stepTiles) {
                        const hitObs = blockMovement && obstacles.some(ob => ob.x === tile.x && ob.y === tile.y);
                        if (hitObs) {
                            setHeroState('hurt');
                            setActionLogBanner(isThai ? `มีสิ่งกีดขวางที่ (${tile.x}, ${tile.y}) ลองเดินอ้อมนะ` : `An obstacle blocks (${tile.x}, ${tile.y}). Walk around it.`);
                            isRunningRef.current = false;
                            onExecutionFinish?.(false, { kind: 'obstacle', x: tile.x, y: tile.y });
                            return;
                        }
                        const hitPortal = portals.find(p => p.x === tile.x && p.y === tile.y);
                        if (hitPortal) {
                            setHeroPos({ x: hitPortal.x, y: hitPortal.y });
                            setHeroDir(move.dir);
                            setHeroState('hurt');
                            setPortalTrapTile({ x: hitPortal.x, y: hitPortal.y });
                            setActionLogBanner(isThai ? '🌀 ถูกประตูมิติดูดกลับจุดเริ่มต้น!' : '🌀 Pulled into a portal trap! Warping back to spawn...');
                            onLog?.(
                                isThai
                                    ? `[PORTAL] 🌀 ถูกประตูมิติดูดกลับจุดเริ่มต้น! (เหยียบประตูมิติที่ (${hitPortal.x}, ${hitPortal.y}) → วาร์ปกลับไปที่ (${spawn.x}, ${spawn.y}))`
                                    : `[PORTAL] 🌀 Pulled into a dimensional portal trap at (${hitPortal.x}, ${hitPortal.y})! Warped back to spawn (${spawn.x}, ${spawn.y})!`
                            );
                            isRunningRef.current = false;
                            timerRef.current = setTimeout(() => {
                                setHeroPos({ ...spawn });
                                setVisitedTiles([`${spawn.x},${spawn.y}`]);
                                setPortalTrapTile(null);
                                onExecutionFinish?.(false, { kind: 'portal', x: hitPortal.x, y: hitPortal.y });
                            }, 480);
                            return;
                        }
                    }

                    const hitHazard = hazards.some(tile => tile.x === newX && tile.y === newY);
                    if (hitHazard) {
                        setHeroState('hurt');
                        setActionLogBanner(isThai ? 'โดนเงาของแคร็กก์โจมตี! หลบช่องที่ทำเครื่องหมายไว้' : 'Krakk\'s shadow strike hit the hero! Avoid the marked tiles.');
                        isRunningRef.current = false;
                        onExecutionFinish?.(false, { kind: 'hazard' });
                        return;
                    }
                    curPos = { x: newX, y: newY };
                    setHeroPos({ ...curPos });
                    setWalkStep(prev => prev + 1);
                    setStepBurst({ id: stepIdx, x: newX, y: newY, dir: move.dir });
                    setVisitedTiles(prev => {
                        const next = new Set(prev);
                        stepTiles.forEach(t => next.add(`${t.x},${t.y}`));
                        return Array.from(next);
                    });
                    setHeroDir(move.dir);
                    setHeroState('walking');
                    setActionLogBanner(`🚶 Moved ${dir} (${steps}) → (${newX}, ${newY})`);

                    setTimeout(() => {
                        if (isRunningRef.current) setHeroState('idle');
                    }, baseDelay * 0.85);
                    break;
                }

                case 'move_to': {
                    if (blockMovement) {
                        setHeroState('hurt');
                        setActionLogBanner('Use directional moves to navigate the Archive.');
                        isRunningRef.current = false;
                        onExecutionFinish?.(false, { kind: 'directional' });
                        return;
                    }
                    const targetX = Math.max(0, Math.min(cols - 1, action.x));
                    const targetY = Math.max(0, Math.min(rows - 1, action.y));
                    const nextDir = targetX < curPos.x ? 'left' : targetX > curPos.x ? 'right' : targetY < curPos.y ? 'up' : 'down';
                    curPos = { x: targetX, y: targetY };
                    setHeroPos({ ...curPos });
                    setHeroDir(nextDir);
                    setWalkStep(prev => prev + 1);
                    setStepBurst({ id: stepIdx, x: targetX, y: targetY, dir: nextDir });
                    setHeroState('walking');
                    setActionLogBanner(`🚶 Moved to (${targetX}, ${targetY})`);

                    setTimeout(() => {
                        if (isRunningRef.current) setHeroState('idle');
                    }, baseDelay * 0.85);
                    break;
                }

                case 'move_to_x': {
                    if (blockMovement) {
                        setHeroState('hurt');
                        setActionLogBanner('Use directional moves to navigate the Archive.');
                        isRunningRef.current = false;
                        onExecutionFinish?.(false, { kind: 'directional' });
                        return;
                    }
                    const targetX = Math.max(0, Math.min(cols - 1, action.targetX));
                    const nextDir = targetX < curPos.x ? 'left' : 'right';
                    curPos = { ...curPos, x: targetX };
                    setHeroPos({ ...curPos });
                    setHeroDir(nextDir);
                    setWalkStep(prev => prev + 1);
                    setStepBurst({ id: stepIdx, x: targetX, y: curPos.y, dir: nextDir });
                    setHeroState('walking');
                    setActionLogBanner(`🚶 Moved to x=${targetX}`);

                    setTimeout(() => {
                        if (isRunningRef.current) setHeroState('idle');
                    }, baseDelay * 0.85);
                    break;
                }

                case 'pick_up': {
                    setHeroState('casting');
                    setCastBeam({ id: stepIdx, fromX: curPos.x, fromY: curPos.y, toX: curPos.x, toY: curPos.y, color: '#38bdf8' });
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
                        setCastBeam(null);
                    }, baseDelay * 0.85);
                    break;
                }

                case 'put_in': {
                    const targetFlaskId = action.target || action.targetType;
                    const flask = flasks.find(f => f.id === targetFlaskId || f.type === targetFlaskId);

                    setHeroState('casting');

                    if (!flask) {
                        setActionLogBanner(`❓ Unknown flask: ${targetFlaskId}`);
                        if (onLog) onLog(`[hero.put_in] Error: Flask '${targetFlaskId}' does not exist!`);
                        setHeroState('hurt');
                        isRunningRef.current = false;
                        if (onExecutionFinish) onExecutionFinish(false, { kind: 'flaskUnknown', name: targetFlaskId });
                        return;
                    }

                    setCastBeam({ id: stepIdx, fromX: curPos.x, fromY: curPos.y, toX: flask.x, toY: flask.y, color: flask.color || '#a855f7' });

                    // Check distance to flask
                    const dist = Math.abs(curPos.x - flask.x) + Math.abs(curPos.y - flask.y);
                    if (dist > 1) {
                        setActionLogBanner(`⚠️ Too far from ${flask.label}! Move closer.`);
                        if (onLog) onLog(`[hero.put_in] Hero is too far from ${flask.label} (dist: ${dist}). Move adjacent to it!`);
                        setHeroState('hurt');
                        isRunningRef.current = false;
                        if (onExecutionFinish) onExecutionFinish(false, { kind: 'flaskFar', name: flask.label });
                        return;
                    }

                    if (!curCarried) {
                        setActionLogBanner(`⚠️ Hero is not carrying any item!`);
                        if (onLog) onLog(`[hero.put_in] Hero is not carrying anything to put into ${flask.label}!`);
                        setHeroState('hurt');
                        isRunningRef.current = false;
                        if (onExecutionFinish) onExecutionFinish(false, { kind: 'flaskEmpty' });
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
                        setHeroState('hurt');
                        isRunningRef.current = false;
                        if (onExecutionFinish) {
                            onExecutionFinish(false, { kind: 'flaskType', item: item.display, itemType: item.type, flask: flask.label });
                        }
                        return;
                    }

                    setTimeout(() => {
                        if (isRunningRef.current) setHeroState('idle');
                        setCastBeam(null);
                    }, baseDelay * 0.85);
                    break;
                }

                case 'cast_color': {
                    const [r, g, b] = action.args || [255, 0, 0];
                    setHeroState('casting');
                    const colorStr = `rgb(${r}, ${g}, ${b})`;
                    setActionLogBanner(`🎨 Cast light: (${r}, ${g}, ${b})`);

                    const nearbyTarget = colorTargets
                        .map(target => ({ target, distance: Math.abs(curPos.x - target.x) + Math.abs(curPos.y - target.y) }))
                        .filter(({ distance }) => distance <= 1)
                        .sort((left, right) => left.distance - right.distance)[0]?.target;
                    if (nearbyTarget) {
                        setCastBeam({ id: stepIdx, fromX: curPos.x, fromY: curPos.y, toX: nearbyTarget.x, toY: nearbyTarget.y, color: colorStr });
                        if (isValidRgb([r, g, b])) {
                            const wasMatched = curBraziers[nearbyTarget.id]?.rgb?.every((channel, index) => channel === nearbyTarget.targetRgb[index]);
                            curBraziers = {
                                ...curBraziers,
                                [nearbyTarget.id]: { litColor: colorStr, rgb: [r, g, b] },
                            };
                            setBraziersState({ ...curBraziers });
                            if (onLog) onLog(nearbyTarget.name + ' received ' + colorStr + '.');
                            if (!wasMatched && nearbyTarget.targetRgb.every((channel, index) => channel === [r, g, b][index])) {
                                setActionLogBanner(boss
                                    ? (isThai ? 'ผนึกคืนสีแล้ว! โล่ของแคร็กก์แตก' : `${nearbyTarget.name} restored! Krakk's shield cracks.`)
                                    : (isThai ? `${nearbyTarget.name} กลับมามีสีแล้ว!` : `${nearbyTarget.name} restored!`));
                                if (boss) setBossStrike(previous => previous + 1);
                            }
                        } else {
                            const alreadyRestored = curBraziers[nearbyTarget.id]?.rgb?.every((value, index) => value === nearbyTarget.targetRgb[index]);
                            if (!alreadyRestored) {
                                curBraziers = { ...curBraziers, [nearbyTarget.id]: { litColor: null, rgb: null, invalid: true } };
                                setBraziersState({ ...curBraziers });
                            }
                            onLog?.('RGB channels must be integers from 0 to 255.');
                        }
                    } else {
                        setCastBeam({ id: stepIdx, fromX: curPos.x, fromY: curPos.y, toX: curPos.x, toY: curPos.y, color: colorStr });
                    }

                    // Check if standing near brazier
                    const nearbyBrazier = braziers.find(br => Math.abs(curPos.x - br.x) + Math.abs(curPos.y - br.y) <= 1);
                    if (nearbyBrazier) {
                        setCastBeam({ id: stepIdx, fromX: curPos.x, fromY: curPos.y, toX: nearbyBrazier.x, toY: nearbyBrazier.y, color: colorStr });
                        curBraziers = {
                            ...curBraziers,
                            [nearbyBrazier.id]: { litColor: colorStr },
                        };
                        setBraziersState({ ...curBraziers });
                        if (onLog) onLog(`✨ Brazier '${nearbyBrazier.name}' ignited with ${colorStr}!`);
                    }

                    setTimeout(() => {
                        if (isRunningRef.current) setHeroState('idle');
                        setCastBeam(null);
                    }, baseDelay * 0.85);
                    break;
                }

                case 'print': {
                    const text = action.text;
                    setHeroState('casting');
                    setActionLogBanner(`💬 "${text}"`);
                    const chantTarget = altar || gate || curPos;
                    setCastBeam({ id: stepIdx, fromX: curPos.x, fromY: curPos.y, toX: chantTarget.x, toY: chantTarget.y, color: '#fbbf24' });
                    if (gate?.keyword && Math.abs(curPos.x - gate.x) + Math.abs(curPos.y - gate.y) <= 1
                        && text.toLowerCase().includes(gate.keyword.toLowerCase())) {
                        curAltarLit = true;
                    }
                    if (altar && curPos.x === altar.x && curPos.y === altar.y) {
                        if (text.toLowerCase().includes(altar.keyword?.toLowerCase() || 'lumina')) {
                            curAltarLit = true;
                            setAltarActivated(true);
                            if (onLog) onLog(`🌟 The Ancient Altar awakens with the sacred word: "${text}"!`);
                        }
                    }
                    setTimeout(() => {
                        if (isRunningRef.current) setHeroState('idle');
                        setCastBeam(null);
                    }, baseDelay * 0.85);
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
    }, [isExecuting, actionQueue, speedMultiplier, checkVictory, spawn, initialItems, flasks, braziers, colorTargets, cols, rows, obstacles, hazards, portals, blockMovement, boss, gate, altar, onExecutionFinish, onLog, isThai]);

    // ─── Check Victory ───
    const shieldsLeft = boss ? colorTargets.filter(target => {
        const rgb = braziersState[target.id]?.rgb;
        return !rgb || !target.targetRgb.every((channel, index) => rgb[index] === channel);
    }).length : 0;

    return (
        <div className={`cca-container cca-theme-${theme}`}>
            {/* ─── Top Control Bar ─── */}
            <div className="cca-toolbar">
                <div className="cca-toolbar-title">
                    <i className="fas fa-gamepad" />
                    <span>CodeCombat Arena</span>
                    <span className="cca-env-badge" title={isThai ? envMeta.nameThai : envMeta.name}>
                        <i className={envMeta.icon} aria-hidden="true" />
                        {isThai ? envMeta.nameThai : envMeta.name}
                    </span>
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

            {theme === 'archive' && colorTargets.length > 0 && (
                <div className="cca-archive-restoration" aria-label={isThai ? 'ภาพที่กำลังคืนสี' : 'Image being restored'}>
                    <div className="cca-archive-panels">
                        {colorTargets.map(target => {
                            const rgb = braziersState[target.id]?.rgb;
                            const restored = rgb && target.targetRgb.every((channel, index) => rgb[index] === channel);
                            const displayColor = restored ? target.targetRgb : target.sourceRgb;
                            return (
                                <div key={target.id} className={`cca-archive-panel ${restored ? 'restored' : 'faded'}`}
                                    style={{ '--panel-color': `rgb(${displayColor.join(',')})` }}
                                    aria-label={`${target.name}: ${restored ? (isThai ? 'คืนสีแล้ว' : 'restored') : (isThai ? 'สียังจางอยู่' : 'faded')}`}>
                                    <div className="cca-archive-panel-art"><i className={target.icon || 'fas fa-image'} aria-hidden="true" /></div>
                                    <span className="cca-archive-panel-name">{target.name}</span>
                                    <span className="cca-archive-panel-state">{restored ? (isThai ? 'คืนสีแล้ว' : 'RESTORED') : (isThai ? 'สียังจางอยู่' : 'FADED')}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {theme !== 'archive' && murals.length > 0 && (
                <div className="cca-murals" aria-label="Archive murals">
                    {murals.map(mural => {
                        const patches = colorTargets.filter(target => target.muralId === mural.id);
                        const restored = patches.filter(target => {
                            const rgb = braziersState[target.id]?.rgb;
                            return rgb && target.targetRgb.every((channel, index) => rgb[index] === channel);
                        }).length;
                        return (
                            <div className="cca-mural" key={mural.id}>
                                <span className="cca-mural-title"><i className="fas fa-image" /> {mural.name} · {restored}/{patches.length}</span>
                                <div className="cca-mural-patches">
                                    {patches.map(target => (
                                        <span key={target.id} title={`${target.name}: ${target.sourceRgb.join(', ')} → ${target.targetRgb.join(', ')}`}
                                            style={{ backgroundColor: braziersState[target.id]?.litColor || `rgb(${target.sourceRgb.join(',')})` }} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {boss && <div className="cca-boss-status" role="status" aria-live="polite">
                <strong>{boss.name}</strong><span>{shieldsLeft} / {colorTargets.length} {isThai ? 'โล่' : shieldsLeft === 1 ? 'shield' : 'shields'}</span>
            </div>}

            {/* ─── Grid Viewport ─── */}
            <div className="cca-grid-area" ref={gridAreaRef}>
                <div
                    className="cca-grid-viewport"
                    style={{
                        width: cols * TILE_SIZE,
                        height: rows * TILE_SIZE,
                        transform: 'translate(-50%, -50%) scale(' + (gridScale ?? 1) + ')',
                        visibility: gridScale === null ? 'hidden' : 'visible',
                    }}
                >
                {/* ─── Ambient Atmosphere Overlay ─── */}
                <div className="cca-ambient-overlay" aria-hidden="true">
                    <span className="cca-ambient-mote mote-1" />
                    <span className="cca-ambient-mote mote-2" />
                    <span className="cca-ambient-mote mote-3" />
                    <span className="cca-ambient-mote mote-4" />
                </div>

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
                        const obstacleObj = obstacles.find(ob => ob.x === x && ob.y === y);
                        const isObstacle = Boolean(obstacleObj);
                        const isBlockingObstacle = blockMovement && isObstacle;
                        const isSpawn = spawn.x === x && spawn.y === y;
                        const isVisited = visitedTiles.includes(`${x},${y}`);
                        const isPath = !isObstacle && (walkablePathSet.has(`${x},${y}`) || isVisited);
                        const isOccupied = isObstacle
                            || isSpawn
                            || isVisited
                            || (altar && altar.x === x && altar.y === y)
                            || (gate && gate.x === x && gate.y === y)
                            || (boss && boss.x === x && boss.y === y)
                            || hazards.some(h => h.x === x && h.y === y)
                            || portals.some(p => p.x === x && p.y === y)
                            || flasks.some(f => f.x === x && f.y === y)
                            || initialItems.some(it => it.x === x && it.y === y)
                            || braziers.some(b => b.x === x && b.y === y)
                            || colorTargets.some(ct => ct.x === x && ct.y === y);
                        const isBorderTile = x === 0 || x === cols - 1 || y === 0 || y === rows - 1;
                        const showAmbientDecor = !isOccupied && isBorderTile && ((x * 7 + y * 13) % 3 === 0);
                        const decorIcon = envMeta.decorIcons[(x * 5 + y * 11) % envMeta.decorIcons.length];
                        const tileAssetUrl = arenaConfig.tileAssets?.[isObstacle ? 'obstacleTile' : isPath ? 'path' : 'ground'] || null;

                        return (
                            <div
                                key={idx}
                                className={`cca-cell ${(x + y) % 2 === 0 ? 'cell-even' : 'cell-odd'} ${isPath ? 'cell-path' : 'cell-ground'} ${isObstacle ? 'cell-obstacle' : ''} ${isBlockingObstacle ? 'cell-obstacle-blocking' : ''} ${isVisited ? 'cell-visited' : ''} ${isSpawn ? 'cell-spawn' : ''}`}
                                title={isObstacle ? `${isThai ? envMeta.obstacleLabelThai : envMeta.obstacleLabel} (${x}, ${y})` : `${isPath ? 'Walkable Path' : 'Ground'} (${x}, ${y})`}
                            >
                                <ArenaTileSvg
                                    theme={theme}
                                    isPath={isPath}
                                    isObstacle={isObstacle}
                                    isVisited={isVisited}
                                    x={x}
                                    y={y}
                                    tileAssetUrl={tileAssetUrl}
                                />
                                <span className="cca-cell-coord">{x},{y}</span>
                                {isVisited && !isSpawn && (
                                    <span className="cca-trail-dot" aria-hidden="true" />
                                )}
                                {isObstacle && (
                                    <div className="cca-obstacle-prop" aria-hidden="true">
                                        <ArenaObstacleSprite
                                            theme={theme}
                                            x={x}
                                            y={y}
                                            spriteUrl={obstacleObj?.spriteUrl || arenaConfig.tileAssets?.obstacle || null}
                                        />
                                    </div>
                                )}
                                {showAmbientDecor && (
                                    <div className="cca-decor-prop" aria-hidden="true">
                                        <i className={decorIcon} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ─── Arcane Spawn Portal Circle ─── */}
                <div
                    className="cca-spawn-portal"
                    style={{
                        left: spawn.x * TILE_SIZE,
                        top: spawn.y * TILE_SIZE,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                    }}
                    title={isThai ? `จุดเกิดผู้กล้า (${spawn.x}, ${spawn.y})` : `Hero Spawn Point (${spawn.x}, ${spawn.y})`}
                    aria-hidden="true"
                >
                    <div className="cca-spawn-ring" />
                    <span className="cca-spawn-tag">{isThai ? 'จุดเกิด' : 'START'}</span>
                </div>

                {/* ─── Footstep Dust & Spark Ripple on Ground ─── */}
                {stepBurst && (
                    <div
                        key={`step-${stepBurst.id}`}
                        className={`cca-footstep-ripple dir-${stepBurst.dir}`}
                        style={{
                            left: stepBurst.x * TILE_SIZE,
                            top: stepBurst.y * TILE_SIZE,
                            width: TILE_SIZE,
                            height: TILE_SIZE,
                        }}
                        aria-hidden="true"
                    />
                )}

                {/* ─── Directed Spell Beam & Arcane Ring during Casting ─── */}
                {castBeam && (
                    <svg
                        key={`beam-${castBeam.id}`}
                        className="cca-spell-beam-svg"
                        viewBox={`0 0 ${cols * TILE_SIZE} ${rows * TILE_SIZE}`}
                        aria-hidden="true"
                    >
                        <line
                            x1={castBeam.fromX * TILE_SIZE + TILE_SIZE / 2}
                            y1={castBeam.fromY * TILE_SIZE + TILE_SIZE / 2 - 6}
                            x2={castBeam.toX * TILE_SIZE + TILE_SIZE / 2}
                            y2={castBeam.toY * TILE_SIZE + TILE_SIZE / 2}
                            stroke={castBeam.color || '#38bdf8'}
                            strokeWidth="4"
                            strokeLinecap="round"
                            className="cca-spell-beam-line"
                        />
                        <circle
                            cx={castBeam.toX * TILE_SIZE + TILE_SIZE / 2}
                            cy={castBeam.toY * TILE_SIZE + TILE_SIZE / 2}
                            r="16"
                            fill="none"
                            stroke={castBeam.color || '#38bdf8'}
                            strokeWidth="2.5"
                            className="cca-spell-impact-ring"
                        />
                    </svg>
                )}

                {theme === 'archive' && colorTargets.map(target => {
                    const rgb = braziersState[target.id]?.rgb;
                    const restored = rgb && target.targetRgb.every((channel, index) => rgb[index] === channel);
                    return restored && <div key={target.id} className="cca-archive-color-field" aria-hidden="true"
                        style={{ left: (target.x - 1) * TILE_SIZE, top: (target.y - 1) * TILE_SIZE,
                            '--restored-color': `rgb(${target.targetRgb.join(',')})` }} />;
                })}

                {hazards.map(tile => <div key={`${tile.x}-${tile.y}`} className="cca-boss-hazard"
                    style={{ left: tile.x * TILE_SIZE, top: tile.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}
                    title={isThai ? 'เงาของแคร็กก์: ห้ามเดินผ่าน' : "Krakk's shadow strike: avoid this tile"} aria-label={`Shadow hazard at ${tile.x}, ${tile.y}`} />)}

                {/* ─── Dimensional Floor Portal Traps ─── */}
                {portals.map(portal => {
                    const isPulling = portalTrapTile && portalTrapTile.x === portal.x && portalTrapTile.y === portal.y;
                    return (
                        <div
                            key={`portal-${portal.x}-${portal.y}`}
                            className={`cca-portal-obj ${isPulling ? 'pulling' : ''}`}
                            style={{
                                left: portal.x * TILE_SIZE,
                                top: portal.y * TILE_SIZE,
                                width: TILE_SIZE,
                                height: TILE_SIZE,
                            }}
                            title={isThai ? 'ประตูมิติ: เหยียบแล้วถูกดูดกลับจุดเริ่มต้น!' : 'Dimensional Portal Trap: steps here warp you back to spawn!'}
                            aria-label={`Portal trap at ${portal.x}, ${portal.y}`}
                        >
                            <ArenaPortalTrapSprite active={Boolean(isPulling)} />
                            <span className="cca-portal-label">{isThai ? 'วาร์ปกลับ' : 'WARP'}</span>
                        </div>
                    );
                })}

                {boss && <div className={`cca-boss-sprite ${shieldsLeft === 0 ? 'defeated' : ''}`}
                    style={{ left: boss.x * TILE_SIZE, top: boss.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}
                    title={boss.name}>
                    <i className="fas fa-hat-wizard" aria-hidden="true" />
                </div>}
                {boss && bossStrike > 0 && <div key={bossStrike} className="cca-boss-counterattack" aria-hidden="true"
                    style={{ left: boss.x * TILE_SIZE, top: boss.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }} />}

                {/* ─── Flasks Objects (2D Multi-layered SVG) ─── */}
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
                                <ArenaFlaskSprite color={flask.color} filled={Boolean(st?.filled)} />
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

                {/* ─── Ground Items (Value Crystals 2D SVG) ─── */}
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
                            <ArenaCrystalItemSprite color={item.color || '#ec4899'} />
                        </div>
                        <span className="cca-item-badge">{item.display}</span>
                    </div>
                ))}

                {/* ─── Altar (2D Multi-layered SVG with Floating Crystal) ─── */}
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
                        <ArenaAltarSprite activated={altarActivated} />
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

                {colorTargets.map(target => {
                    const state = braziersState[target.id];
                    const matched = state?.rgb && target.targetRgb.every((channel, index) => state.rgb[index] === channel);
                    const displayRgb = state?.litColor || `rgb(${target.sourceRgb.join(',')})`;
                    return (
                        <div
                            key={target.id}
                            className={'cca-color-target' + (matched ? ' matched' : '')}
                            style={{
                                left: target.x * TILE_SIZE,
                                top: target.y * TILE_SIZE,
                                width: TILE_SIZE,
                                height: TILE_SIZE,
                                '--target-color': displayRgb,
                            }}
                            title={target.name + ': ' + target.targetRgb.join(', ')}
                        >
                            <ArenaColorTargetSprite
                                theme={theme}
                                color={displayRgb}
                                matched={Boolean(matched)}
                            />
                            <span className="cca-color-target-name">{target.name}</span>
                            <span className="cca-color-target-rgb">{target.targetRgb.join(', ')}</span>
                        </div>
                    );
                })}

                {/* ─── The Prism Gate (2D Multi-layered SVG Archway) ─── */}
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
                        <ArenaGateSprite unlocked={gateUnlocked} />
                        <span className="cca-gate-label">{gate.name}</span>
                        {gateUnlocked && <div className="cca-gate-glow" />}
                    </div>
                )}

                {/* ─── Hero Character ─── */}
                <div
                    className={`cca-hero dir-${heroDir} state-${heroState} ${portalTrapTile ? 'portal-warping' : ''}`}
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
                            direction={heroDir}
                            walkStep={walkStep}
                            showParticles={heroState === 'casting' || heroState === 'success'}
                            showShadow={true}
                            showGlow={heroState === 'casting' || heroState === 'success'}
                        />
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}
