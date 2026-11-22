import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePythonInterpreter from './usePythonInterpreter';
import useCharacterProgression from '@/features/character/useCharacterProgression';
import { useGame } from '@/shared/context/GameContext';
import { STAGE_DATA, REGIONS } from '@/features/stages/stageData';
import { STAGE_PEDAGOGY } from '@/features/stages/stageGuides';
import { useLanguage } from '@/shared/i18n/useLanguage';
import { localStageData, localRegion } from '@/features/stages/stageThai';
import Grimoire from './Grimoire';
import LevelComplete from './LevelComplete';
import HintPanel from './HintPanel';
import WizardProfile from '@/features/character/WizardProfile';
import StageStoryIntro from './StageStoryIntro';
import { createArenaCallbacks } from './arenaActions';
import { STORY_SPRITES } from './storyCharacters';
import SpellBook from './SpellBook';
import CodeCombatArena from '@/features/gameplay/CodeCombatArena/CodeCombatArena';
import SpellFailureFeedback from './SpellFailureFeedback';
import { pythonFailure } from './spellFeedback';
import { validateStageCode } from './codeValidator';
import StoryScene from '@/features/world/StoryScene';
import './gamepage.css';
import './stagepage.css';

const BOSS_TIME_LIMIT_SECONDS = 300;

const StagePage = () => {
    const { regionId, stageId } = useParams();
    const { isThai } = useLanguage();
    const navigate = useNavigate();
    const { saveAttempt, user } = useGame();
    const { runCode, output, isRunning, wizardMessage, clearOutput, log } = usePythonInterpreter();
    const { character, levelProgress, awardXP, masterConcept } = useCharacterProgression();

    const stageKey = `${regionId}-${stageId}`;
    const introNpcName = STAGE_DATA[stageKey]?.storyIntro?.npcName;
    const introCharacter = STORY_SPRITES[introNpcName] || 'hero';
    const isPortraitIntro = introCharacter !== 'hero';
    const playableStage = REGIONS[regionId]?.stages.some(stage => String(stage.id) === stageId);
    const currentStage = useMemo(() => playableStage ? localStageData(STAGE_DATA[stageKey], stageKey, isThai) : null, [playableStage, stageKey, isThai]);
    const region = REGIONS[regionId] && localRegion(REGIONS[regionId], isThai);

    // Story Intro state
    const [storyPhase, setStoryPhase] = useState('intro'); // 'intro' | 'ide'
    const [dialogIndex, setDialogIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showEnterButton, setShowEnterButton] = useState(false);
    const [ideSliding, setIdeSliding] = useState(false);
    const [npcVisible, setNpcVisible] = useState(false);

    // IDE / Game state
    const [code, setCode] = useState('');
    const [activeTab, setActiveTab] = useState('spell');
    const [visualState, setVisualState] = useState({});
    const [showGrimoire, setShowGrimoire] = useState(false);
    const [grimoireStartPage, setGrimoireStartPage] = useState(0);
    const initializedStageRef = useRef(null);
    const [showComplete, setShowComplete] = useState(false);
    const [wizardState, setWizardState] = useState('idle');
    const [showSpellBook, setShowSpellBook] = useState(false);

    // Progressive hints state
    const [attemptCount, setAttemptCount] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const hintsUsedRef = useRef(0);
    const [checkedSteps, setCheckedSteps] = useState({});
    const pedagogy = STAGE_PEDAGOGY[stageKey] || null;

    // CodeCombat 2D Arena state
    const [arenaActionQueue, setArenaActionQueue] = useState([]);
    const [isArenaExecuting, setIsArenaExecuting] = useState(false);
    const bossClockRef = useRef({ remainingMs: BOSS_TIME_LIMIT_SECONDS * 1000, startedAt: null });
    const [bossTimeLeft, setBossTimeLeft] = useState(BOSS_TIME_LIMIT_SECONDS);
    const [bossClockActive, setBossClockActive] = useState(false);
    const [showEpilogue, setShowEpilogue] = useState(false);
    const finishAttemptRef = useRef(null);

    const startBossClock = useCallback(() => {
        bossClockRef.current = { remainingMs: BOSS_TIME_LIMIT_SECONDS * 1000, startedAt: performance.now() };
        setBossTimeLeft(BOSS_TIME_LIMIT_SECONDS);
        setBossClockActive(true);
    }, []);

    // Completion result (XP breakdown, etc.)
    const [completionResult, setCompletionResult] = useState(null);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [spellFailure, setSpellFailure] = useState(null);
    const pendingSave = useRef(null);
    const activeAttempt = useRef(null);
    const saveInFlight = useRef(false);

    useEffect(() => {
        const warn = event => {
            if (pendingSave.current || activeAttempt.current) {
                event.preventDefault();
                event.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, []);

    const typingRef = useRef(null);
    const completedRef = useRef(false);
    const typingTimeoutRef = useRef(null);

    // Compute next stage
    const stageIndex = region?.stages.findIndex(stage => String(stage.id) === stageId) ?? -1;
    const nextStageId = region?.stages[stageIndex + 1]?.id;
    const hasNextStage = nextStageId !== undefined;

    // ─── Initialize ───
    useEffect(() => {
        if (!currentStage) {
            navigate('/dashboard');
            return;
        }
        if (initializedStageRef.current === stageKey) return;
        initializedStageRef.current = stageKey;

        setCode(currentStage.initialCode || '');
        setVisualState({});
        clearOutput();
        setShowComplete(false);
        setActiveTab('spell');
        setWizardState('idle');
        setAttemptCount(0);
        setHintsUsed(0);
        hintsUsedRef.current = 0;
        setCheckedSteps({});
        setCompletionResult(null);
        setArenaActionQueue([]);
        setIsArenaExecuting(false);
        bossClockRef.current = { remainingMs: BOSS_TIME_LIMIT_SECONDS * 1000, startedAt: null };
        setBossTimeLeft(BOSS_TIME_LIMIT_SECONDS);
        setBossClockActive(false);
        setShowEpilogue(false);
        completedRef.current = false;
        activeAttempt.current = null;
        pendingSave.current = null;
        setSaveError('');
        setSpellFailure(null);
        setShowGrimoire(false);
        setGrimoireStartPage(0);

        // Story intro setup
        if (currentStage.hasStoryIntro) {
            setStoryPhase('intro');
            setDialogIndex(0);
            setDisplayedText('');
            setShowEnterButton(false);
            setIdeSliding(false);
            setNpcVisible(false);
            setTimeout(() => setNpcVisible(true), 800);
        } else {
            setStoryPhase('ide');
            setShowGrimoire(true);
            if (stageKey === '4-7') startBossClock();
        }
    }, [stageKey, navigate, clearOutput, currentStage, startBossClock]);

    // ─── Typewriter effect for dialog ───
    useEffect(() => {
        if (storyPhase !== 'intro' || !currentStage?.hasStoryIntro) return;

        const dialogues = currentStage.storyIntro.dialogues;
        if (dialogIndex >= dialogues.length) {
            setShowEnterButton(true);
            return;
        }

        const fullText = dialogues[dialogIndex].text;
        let charIndex = 0;
        setDisplayedText('');
        setIsTyping(true);

        if (typingRef.current) clearInterval(typingRef.current);

        typingRef.current = setInterval(() => {
            charIndex++;
            setDisplayedText(fullText.slice(0, charIndex));
            if (charIndex >= fullText.length) {
                clearInterval(typingRef.current);
                setIsTyping(false);
            }
        }, 30);

        return () => {
            if (typingRef.current) clearInterval(typingRef.current);
        };
    }, [dialogIndex, storyPhase, currentStage]);

    // ─── Dialog handlers ───
    const handleDialogClick = () => {
        if (!currentStage?.hasStoryIntro) return;
        const dialogues = currentStage.storyIntro.dialogues;

        if (isTyping) {
            if (typingRef.current) clearInterval(typingRef.current);
            setDisplayedText(dialogues[dialogIndex].text);
            setIsTyping(false);
        } else if (dialogIndex < dialogues.length - 1) {
            setDialogIndex(prev => prev + 1);
        } else {
            setShowEnterButton(true);
        }
    };

    const handleEnterTower = () => {
        setIdeSliding(true);
        setTimeout(() => {
            setStoryPhase('ide');
            setGrimoireStartPage(0);
            setShowGrimoire(true);
            if (stageKey === '4-7') startBossClock();
        }, 100);
    };

    // ─── Level Complete ───
    const handleLevelComplete = (serverResult, extraModifiers = {}) => {
        if (completedRef.current) return;
        completedRef.current = true;

        setWizardState('success');

        // Award XP with multipliers
        const actualHintsUsed = extraModifiers.hintsUsed ?? hintsUsedRef.current;
        const modifiers = {
            firstAttempt: (extraModifiers.attempts ?? attemptCount) === 1,
            noHints: actualHintsUsed === 0,
            attempts: extraModifiers.attempts ?? attemptCount,
            hintsUsed: actualHintsUsed,
        };

        const result = awardXP(stageKey, currentStage.xpReward || 200, modifiers, {
            earnedXP: serverResult.earnedXP,
            appliedBonuses: serverResult.appliedBonuses,
            totalXP: serverResult.progress.highScore,
        });
        setCompletionResult(result);

        // Master teaching concepts
        if (currentStage.teachingConcepts) {
            currentStage.teachingConcepts.forEach(concept => masterConcept(concept));
        }

        if (stageKey === '4-7') setShowEpilogue(true);
        setTimeout(() => setShowComplete(true), 1500);
    };

    // ─── Run Code (for lesson/challenge/boss stages) ───
    // Retry the exact same attempt instead of inserting a duplicate row.
    const persistAttempt = async (payload, modifiers = {}) => {
        if (saveInFlight.current) return false;
        pendingSave.current = { payload, modifiers };
        saveInFlight.current = true;
        setSaving(true);
        setSaveError('');
        try {
            const currentHints = modifiers.hintsUsed ?? hintsUsedRef.current;
            const saved = await saveAttempt({
                ...payload,
                hints_used: currentHints,
            });
            pendingSave.current = null;
            if (payload.result === 'Success') handleLevelComplete(saved, { ...modifiers, hintsUsed: currentHints });
            return true;
        } catch (error) {
            setSaveError(error.response?.data?.message || 'Could not save. Check your connection and retry.');
            return false;
        } finally {
            saveInFlight.current = false;
            setSaving(false);
        }
    };

    const finishAttempt = (result, failure = null) => {
        const attempt = activeAttempt.current;
        if (!attempt) return;
        activeAttempt.current = null;
        let finalResult = result;
        if (stageKey === '4-7') {
            const clock = bossClockRef.current;
            if (clock.startedAt !== null) {
                const elapsed = performance.now() - clock.startedAt;
                clock.remainingMs = Math.max(0, clock.remainingMs - elapsed);
            }
            if (clock.remainingMs <= 0) {
                finalResult = 'Fail';
                failure = { kind: 'timeout' };
                clock.startedAt = null;
                setBossTimeLeft(0);
                setBossClockActive(false);
            } else if (finalResult === 'Success') {
                clock.startedAt = null;
                setBossTimeLeft(Math.ceil(clock.remainingMs / 1000));
                setBossClockActive(false);
            } else {
                clock.startedAt = performance.now();
                setBossTimeLeft(Math.ceil(clock.remainingMs / 1000));
            }
        }
        setIsArenaExecuting(false);
        setWizardState(finalResult === 'Success' ? 'success' : 'confused');
        setSpellFailure(finalResult === 'Success' ? null : failure || { kind: 'unknown' });
        void persistAttempt({
            stage_key: stageKey, code: attempt.code, result: finalResult,
            runtime: stageKey === '4-7' ? (performance.now() - attempt.started) / 1000 : (attempt.runtime ?? (performance.now() - attempt.started) / 1000),
            submitted_at: attempt.submitted_at,
        }, { attempts: attempt.number, hintsUsed: hintsUsedRef.current });
    };
    finishAttemptRef.current = finishAttempt;

    useEffect(() => {
        if (stageKey !== '4-7' || !bossClockActive) return undefined;
        const timer = setInterval(() => {
            const clock = bossClockRef.current;
            if (clock.startedAt === null) return;
            const left = Math.max(0, clock.remainingMs - (performance.now() - clock.startedAt));
            setBossTimeLeft(Math.ceil(left / 1000));
            if (left <= 0) {
                clock.remainingMs = 0;
                clock.startedAt = null;
                setBossTimeLeft(0);
                setBossClockActive(false);
                setIsArenaExecuting(false);
                setArenaActionQueue([]);
                if (activeAttempt.current) {
                    finishAttemptRef.current?.('Fail', { kind: 'timeout' });
                } else {
                    setWizardState('confused');
                    setSpellFailure({ kind: 'timeout' });
                }
            }
        }, 100);
        return () => clearInterval(timer);
    }, [stageKey, bossClockActive]);

    const handleRun = () => {
        const bossExpired = stageKey === '4-7' && (
            bossTimeLeft <= 0 ||
            bossClockRef.current.remainingMs <= 0 ||
            (bossClockRef.current.startedAt !== null && bossClockRef.current.remainingMs - (performance.now() - bossClockRef.current.startedAt) <= 0)
        );
        if (activeAttempt.current || pendingSave.current || saveInFlight.current || bossExpired) return;
        completedRef.current = false;
        if (stageKey === '4-7' && bossClockRef.current.startedAt === null && bossClockRef.current.remainingMs > 0) {
            bossClockRef.current.startedAt = performance.now();
            setBossClockActive(true);
        }
        activeAttempt.current = { code, submitted_at: new Date().toISOString(), started: performance.now(), number: attemptCount + 1 };
        setSpellFailure(null);
        clearOutput();
        setWizardState('casting');
        setAttemptCount(prev => prev + 1);

        if (currentStage.arena) {
            const arenaCallbacks = createArenaCallbacks(actions => {
                if (!activeAttempt.current) return;
                if (stageKey !== '4-7') activeAttempt.current.runtime = (performance.now() - activeAttempt.current.started) / 1000;
                if (actions.length === 0) {
                    finishAttempt('Fail', { kind: 'noActions' });
                    return;
                }
                const structureCheck = validateStageCode(stageKey, code);
                if (!structureCheck.valid) {
                    finishAttempt('Fail', structureCheck.failure);
                    return;
                }
                setIsArenaExecuting(false);
                setTimeout(() => {
                    if (!activeAttempt.current) return;
                    setArenaActionQueue([...actions]);
                    setIsArenaExecuting(true);
                }, 50);
            }, error => finishAttempt('Error', pythonFailure(error)));

            runCode(currentStage.visionChecks ? `${code}\n${currentStage.visionChecks.join('\n')}` : code, arenaCallbacks);
            return;
        }

        // Validate the final output of this run, not a stale React state snapshot.
        const lines = [];
        const state = {};
        const callbacks = {
            __onPrint: text => lines.push(text),
            cast_color: (r, g, b) => {
                state.color = `rgb(${r},${g},${b})`;
                setVisualState(previous => ({ ...previous, color: state.color }));
            },
            move_to_x: x => {
                state.foundIndex = x;
                setVisualState(previous => ({ ...previous, foundIndex: x }));
            },
            say: () => {},
            __onError: error => finishAttempt('Error', pythonFailure(error)),
            __onSuccess: () => {
                let success = currentStage.validateOutput ? currentStage.validateOutput(lines) : false;
                const failure = { kind: 'output', actual: lines.join('').trim().slice(0, 160) };
                finishAttempt(success ? 'Success' : 'Fail', failure);
            },
        };
        runCode(code, callbacks);
    };

    const handleArenaExecutionFinish = useCallback((success, failure) => finishAttemptRef.current?.(success ? 'Success' : 'Fail', failure), []);

    const handleReset = () => {
        setCode(currentStage.initialCode || '');
        setVisualState({});
        clearOutput();
        setSpellFailure(null);
        setWizardState('idle');
        setArenaActionQueue([]);
        setIsArenaExecuting(false);
        if (stageKey === '4-7') startBossClock();
        completedRef.current = false;
    };

    // Detect typing to show thinking state
    const handleCodeChange = (e) => {
        if (activeTab !== 'spell') return;
        setCode(e.target.value);
        
        // Only change to thinking if not already casting/success
        if (wizardState !== 'casting' && wizardState !== 'success') {
            setWizardState('thinking');
        }
        
        // Return to idle after user stops typing
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            if (wizardState !== 'casting' && wizardState !== 'success') {
                setWizardState('idle');
            }
        }, 2000);
    };

    const openGrimoire = (pageIndex = 0) => {
        setGrimoireStartPage(pageIndex);
        setShowGrimoire(true);
    };

    const handleContinue = () => {
        if (hasNextStage) {
            navigate(`/region/${regionId}/stage/${nextStageId}`);
        } else {
            navigate(`/region/${regionId}`);
        }
    };

    const handleHintRequest = (nextCount) => {
        setHintsUsed(prev => {
            const updated = typeof nextCount === 'number' ? Math.max(prev, nextCount) : prev + 1;
            hintsUsedRef.current = updated;
            return updated;
        });
    };

    // ─── Guard ───
    if (!currentStage || !region) {
        return <div style={{ color: 'white', padding: '20px' }}>Stage not found.</div>;
    }

    const lineCount = code.split('\n').length;
    const stageType = currentStage.stageType || 'challenge';
    const remainingHintBonusPct = Math.max(0, (3 - Math.min(hintsUsed, 3)) * 10);

    // ─── Level Complete Screen ───
    if (showComplete) {
        if (showEpilogue) {
            return <StoryScene scene="epilogue" playerName={user?.username} isThai={isThai} onClose={() => setShowEpilogue(false)} />;
        }
        return (
            <LevelComplete
                level={currentStage}
                character={character}
                levelProgress={levelProgress}
                completionResult={completionResult}
                onReplay={() => { setShowComplete(false); handleReset(); setGrimoireStartPage(0); setShowGrimoire(true); }}
                onContinue={handleContinue}
            />
        );
    }

    // ═══════════════════════════════════════════
    //   RENDER: Story Intro Phase
    // ═══════════════════════════════════════════
    if (storyPhase === 'intro' && currentStage.hasStoryIntro) {
        return <StageStoryIntro
            currentStage={currentStage} region={region} regionId={regionId}
            introCharacter={introCharacter} isPortraitIntro={isPortraitIntro}
            dialogIndex={dialogIndex} displayedText={displayedText} isTyping={isTyping}
            showEnterButton={showEnterButton} npcVisible={npcVisible}
            user={user} isThai={isThai} onDialogClick={handleDialogClick} onEnterTower={handleEnterTower}
        />;
    }

    // ═══════════════════════════════════════════
    //   RENDER: IDE Phase
    // ═══════════════════════════════════════════

    return (
        <div className={`stage-game-page ${ideSliding ? 'ide-slide-in' : ''} ${regionId === '1' ? 'chapter-one-noir' : ''}`}>
            {/* ─── Navbar ─── */}
            <nav className="game-navbar">
                <div className="game-nav-brand">
                    <div className="game-nav-brand-icon"><i className="fas fa-chess-rook"></i></div>
                    <span className="game-nav-brand-text">The Lost Spectrum</span>
                </div>

                <div className="game-nav-level">
                    <i className="fas fa-dungeon"></i>
                    {isThai ? 'ด่าน' : 'Stage'} {regionId}-{regionId === '3' || regionId === '4' ? stageIndex + 1 : stageId}: {currentStage.title}
                    {currentStage.difficulty && (
                        <span className="game-nav-difficulty">
                            {Array.from({ length: currentStage.difficulty }, (_, i) => (
                                <i key={i} className="fas fa-star" style={{ color: '#fbbf24', fontSize: '0.6rem' }}></i>
                            ))}
                        </span>
                    )}
                    

                </div>

                <div className="game-nav-links">
                    <button className="game-nav-link" disabled={isRunning || isArenaExecuting || saving || !!saveError} onClick={() => navigate(`/region/${regionId}`)}>
                        <i className="fas fa-map"></i> {isThai ? 'แผนที่' : 'Map'}
                    </button>
                    <button className="game-nav-link" onClick={() => openGrimoire(0)}>
                        <i className="fas fa-magic"></i> {isThai ? 'คาถา' : 'Spells'}
                    </button>
                    <button className="game-nav-link" onClick={() => setShowSpellBook(true)}>
                        <i className="fas fa-book-open"></i> {isThai ? 'หนังสือคาถา' : 'Spell Book'}
                    </button>
                    <button className="game-nav-link">
                        <i className="fas fa-cog"></i>
                    </button>
                </div>

                <div className="game-nav-user">
                    <WizardProfile
                        character={character}
                        levelProgress={levelProgress}
                        compact={true}
                    />
                </div>
            </nav>

            {/* ─── Main Content ─── */}
            {saveError && <div role="alert" className="game-save-error">
                <span>{saveError}</span>
                <button type="button" disabled={saving} onClick={() => {
                    const pending = pendingSave.current;
                    if (pending) void persistAttempt(pending.payload, pending.modifiers);
                }}>{isThai ? 'ลองบันทึกอีกครั้ง' : 'Retry save'}</button>
            </div>}
            <div className="game-main">
                {/* ─── Scene Panel ─── */}
                {currentStage.arena ? (
                    <div className="game-scene game-arena-scene">
                        <div className="game-scene-view game-arena-scene-view">
                            <div className="game-objective game-arena-objective">
                                {stageKey === '4-7' && <div className={`game-boss-clock ${bossTimeLeft <= 30 ? 'urgent' : ''}`} role="timer" aria-live={bossTimeLeft <= 10 ? 'assertive' : 'off'}>
                                    <i className="fas fa-hourglass-half" /> {isThai ? 'เวลาที่เหลือ' : 'Time left'}: {Math.floor(bossTimeLeft / 60)}:{String(bossTimeLeft % 60).padStart(2, '0')}
                                    {bossTimeLeft === 0 && <small>{isThai ? 'หมดเวลา กดรีเซ็ตเพื่อเริ่มใหม่' : 'Time up. Reset to retry.'}</small>}
                                </div>}
                                <div className="game-objective-badge">
                                    <div className="game-objective-dot"></div>
                                    <span className="game-objective-label">
                                        {stageType === 'boss' ? '⚔️ BOSS TRIAL' :
                                         stageType === 'lesson' ? '📖 CODE-DRIVEN LESSON' : '🎯 2D ARENA OBJECTIVE'}
                                    </span>
                                </div>
                                <div
                                    className="game-objective-text"
                                    dangerouslySetInnerHTML={{ __html: currentStage.objective }}
                                />
                            </div>

                            <CodeCombatArena
                                key={stageKey}
                                arenaConfig={currentStage.arena}
                                isThai={isThai}
                                actionQueue={arenaActionQueue}
                                isExecuting={isArenaExecuting}
                                onLog={log}
                                onExecutionFinish={handleArenaExecutionFinish}
                                onReset={() => {
                                    if (activeAttempt.current) finishAttempt('Fail');
                                    setSpellFailure(null);
                                    setArenaActionQueue([]);
                                    setIsArenaExecuting(false);
                                    if (stageKey === '4-7') startBossClock();
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="game-scene">
                        <div className="game-scene-view">
                            {wizardMessage && (
                                <div className="game-speech">
                                    "{wizardMessage}"
                                </div>
                            )}

                            <div className="game-objective">
                                <div className="game-objective-badge">
                                    <div className="game-objective-dot"></div>
                                    <span className="game-objective-label">
                                        {stageType === 'boss' ? '⚔️ BOSS CHALLENGE' :
                                         stageType === 'lesson' ? '📖 LESSON' : 'Current Objective'}
                                    </span>
                                </div>
                                <div
                                    className="game-objective-text"
                                    dangerouslySetInnerHTML={{ __html: currentStage.objective }}
                                />
                            </div>

                            {/* Character with real sprite animations */}
                            <div className="game-character">
                                <WizardSprite
                                    state={wizardState}
                                    size="md"
                                    showParticles={true}
                                    showShadow={true}
                                    showGlow={true}
                                />
                            </div>

                            {/* Color display */}
                            {visualState.color && (
                                <div className="game-color-slots">
                                    <div className="game-color-slot filled" style={{ backgroundColor: visualState.color, width: 60, height: 60, borderRadius: 8 }}></div>
                                </div>
                            )}

                            <div className="game-scene-controls">
                                <button className="game-scene-ctrl-btn"><i className="fas fa-volume-up"></i></button>
                                <button className="game-scene-ctrl-btn" onClick={() => openGrimoire(0)}>
                                    <i className="fas fa-question"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Code Panel ─── */}
                <div className="game-code-panel">
                    {/* ─── Compact 1-Line Pedagogical Strip (does not crowd the code editor) ─── */}
                    {pedagogy && pedagogy.mode === 'lesson' && (
                        <div className="game-pedagogy-strip is-lesson">
                            <span className="pedagogy-mode-badge badge-lesson">
                                <i className="fas fa-graduation-cap" /> {isThai ? 'บทเรียนจับมือทำ' : 'GUIDED LESSON'}
                            </span>
                            <div className="pedagogy-inline-steps">
                                {pedagogy.steps.map(step => {
                                    const autoDone = typeof step.test === 'function' ? step.test(code, attemptCount) : false;
                                    const isDone = autoDone || Boolean(checkedSteps[step.id]);
                                    return (
                                        <button
                                            key={step.id}
                                            type="button"
                                            className={`pedagogy-mini-pill ${isDone ? 'done' : ''}`}
                                            title={isThai ? step.th : step.en}
                                            onClick={() => setCheckedSteps(prev => ({ ...prev, [step.id]: !prev[step.id] }))}
                                        >
                                            <i className={isDone ? 'fas fa-check-circle' : 'far fa-circle'} />
                                            <span>{isThai ? `ขั้น ${step.id}` : `Step ${step.id}`}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                type="button"
                                className="pedagogy-toggle-btn"
                                onClick={() => setActiveTab(activeTab === 'guide' ? 'spell' : 'guide')}
                            >
                                <i className={`fas ${activeTab === 'guide' ? 'fa-code' : 'fa-book-open'}`} />
                                {activeTab === 'guide'
                                    ? (isThai ? 'กลับหน้าเขียนโค้ด' : 'Back to Code')
                                    : (isThai ? 'คู่มือทีละบรรทัด' : 'Walkthrough')}
                            </button>
                        </div>
                    )}

                    {pedagogy && (pedagogy.mode === 'challenge' || pedagogy.mode === 'boss') && (
                        <div className={`game-pedagogy-strip is-${pedagogy.mode}`}>
                            <span className={`pedagogy-mode-badge badge-${pedagogy.mode}`}>
                                <i className={pedagogy.mode === 'boss' ? 'fas fa-crown' : 'fas fa-bolt'} />
                                {pedagogy.mode === 'boss'
                                    ? (isThai ? 'บอสประยุกต์ความรู้' : 'BOSS SYNTHESIS')
                                    : (isThai ? 'ด่านท้าทาย' : 'APPLIED CHALLENGE')}
                            </span>
                            <div className="pedagogy-applied-inline">
                                <span className="pedagogy-applied-label">
                                    {isThai ? 'ประยุกต์จาก:' : 'Applied:'}
                                </span>
                                {pedagogy.appliedFrom.map(ref => (
                                    <span key={ref.stageKey} className="pedagogy-applied-chip-sm" title={isThai ? ref.conceptTh : ref.conceptEn}>
                                        {ref.stageKey}
                                    </span>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="pedagogy-toggle-btn"
                                onClick={() => setActiveTab(activeTab === 'guide' ? 'spell' : 'guide')}
                            >
                                <i className={`fas ${activeTab === 'guide' ? 'fa-code' : 'fa-info-circle'}`} />
                                {activeTab === 'guide'
                                    ? (isThai ? 'กลับหน้าเขียนโค้ด' : 'Back to Code')
                                    : (isThai ? 'แนวคิดที่ต้องใช้' : 'Stage Brief')}
                            </button>
                        </div>
                    )}

                    <div className="game-editor-tabs">
                        <button
                            className={`game-editor-tab ${activeTab === 'spell' ? 'active' : ''}`}
                            onClick={() => setActiveTab('spell')}
                        >
                            <i className="fas fa-code"></i> spell_cast.py
                        </button>
                        <button
                            className={`game-editor-tab ${activeTab === 'guide' ? 'active' : ''}`}
                            onClick={() => setActiveTab('guide')}
                        >
                            <i className="fas fa-book"></i> {isThai ? 'lesson_guide.md' : 'lesson_guide.md'}
                        </button>
                        {currentStage.hints && !completedRef.current && (
                            <button
                                className={`game-editor-tab game-editor-hint-tab ${activeTab === 'hints' ? 'active' : ''}`}
                                onClick={() => setActiveTab('hints')}
                            >
                                <i className="fas fa-lightbulb"></i>
                                <span>{isThai ? `คำใบ้ (${hintsUsed}/3)` : `Hints (${hintsUsed}/3)`}</span>
                                <span className="tab-xp-pill">+{remainingHintBonusPct}%</span>
                            </button>
                        )}
                    </div>

                    <div className="game-code-area">
                        {activeTab === 'spell' && (
                            <>
                                <div className="game-line-numbers">
                                    {Array.from({ length: Math.max(lineCount, 18) }, (_, i) => (
                                        <span key={i}>{i + 1}</span>
                                    ))}
                                </div>
                                <textarea
                                    className="game-code-textarea"
                                    value={code}
                                    onChange={handleCodeChange}
                                    spellCheck="false"
                                    readOnly={isRunning || isArenaExecuting || saving || !!saveError}
                                    placeholder="# Enter your Python spell here..."
                                />
                            </>
                        )}

                        {activeTab === 'guide' && (
                            <div className="game-guide-tab-view">
                                {pedagogy && pedagogy.mode === 'lesson' ? (
                                    <div className="pedagogy-lesson-tab-card">
                                        <h4 className="pedagogy-concept-title">
                                            <i className="fas fa-graduation-cap" /> {isThai ? pedagogy.conceptTitle.th : pedagogy.conceptTitle.en}
                                        </h4>
                                        <p className="pedagogy-concept-desc">
                                            {isThai ? pedagogy.conceptBreakdown.th : pedagogy.conceptBreakdown.en}
                                        </p>
                                        <div className="pedagogy-grid-2col">
                                            <div className="pedagogy-syntax-box">
                                                <span className="pedagogy-sub-label">
                                                    <i className="fas fa-terminal" /> {isThai ? 'โครงสร้างไวยากรณ์ (Syntax)' : 'Syntax Structure'}
                                                </span>
                                                <pre><code>{pedagogy.syntaxStructure}</code></pre>
                                            </div>
                                            <div className="pedagogy-walkthrough-box">
                                                <span className="pedagogy-sub-label">
                                                    <i className="fas fa-list-ol" /> {isThai ? 'คำอธิบายโค้ดทีละบรรทัด' : 'Line-by-Line Walkthrough'}
                                                </span>
                                                <ul className="pedagogy-walkthrough-list">
                                                    {pedagogy.lineWalkthrough.map((item, idx) => (
                                                        <li key={idx}>
                                                            <code>{item.code}</code>
                                                            <span>{isThai ? item.th : item.en}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="pedagogy-checklist">
                                            <span className="pedagogy-checklist-title">
                                                <i className="fas fa-tasks" /> {isThai ? 'รายการฝึกปฏิบัติทีละขั้น:' : 'Interactive Tutorial Checklist:'}
                                            </span>
                                            <div className="pedagogy-steps-list">
                                                {pedagogy.steps.map(step => {
                                                    const autoDone = typeof step.test === 'function' ? step.test(code, attemptCount) : false;
                                                    const isDone = autoDone || Boolean(checkedSteps[step.id]);
                                                    return (
                                                        <button
                                                            key={step.id}
                                                            type="button"
                                                            className={`pedagogy-step-chip ${isDone ? 'done' : ''}`}
                                                            onClick={() => setCheckedSteps(prev => ({ ...prev, [step.id]: !prev[step.id] }))}
                                                        >
                                                            <i className={isDone ? 'fas fa-check-circle' : 'far fa-circle'} />
                                                            <span>{isThai ? step.th : step.en}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ) : pedagogy ? (
                                    <div className="pedagogy-challenge-tab-card">
                                        <h4 className="pedagogy-concept-title">
                                            <i className="fas fa-bolt" /> {currentStage.title} — {isThai ? 'ความรู้ที่ต้องประยุกต์ใช้' : 'Applied Knowledge Brief'}
                                        </h4>
                                        <div className="pedagogy-applied-chips">
                                            {pedagogy.appliedFrom.map(ref => (
                                                <span key={ref.stageKey} className="pedagogy-applied-chip">
                                                    <strong>{isThai ? `ด่าน ${ref.stageKey} (${ref.titleTh})` : `Stage ${ref.stageKey} (${ref.titleEn})`}</strong>
                                                    <span>· {isThai ? ref.conceptTh : ref.conceptEn}</span>
                                                </span>
                                            ))}
                                        </div>
                                        <p className="pedagogy-challenge-brief" style={{ marginTop: '0.6rem', fontSize: '0.82rem' }}>
                                            {isThai ? pedagogy.challengeBrief.th : pedagogy.challengeBrief.en}
                                        </p>
                                    </div>
                                ) : null}

                                <div className="pedagogy-readme-meta">
                                    <strong>{currentStage.chapter}</strong> · {currentStage.location}
                                    <p>{currentStage.objective.replace(/<[^>]+>/g, '')}</p>
                                </div>
                                <button
                                    type="button"
                                    className="pedagogy-return-btn"
                                    onClick={() => setActiveTab('spell')}
                                >
                                    <i className="fas fa-code" /> {isThai ? 'กลับไปหน้าเขียนโค้ด (spell_cast.py)' : 'Return to Code Editor (spell_cast.py)'}
                                </button>
                            </div>
                        )}

                        {activeTab === 'hints' && currentStage.hints && !completedRef.current && (
                            <div className="game-hints-tab-view">
                                <HintPanel
                                    key={stageKey}
                                    hints={currentStage.hints}
                                    hintsUsed={hintsUsed}
                                    defaultExpanded={true}
                                    onRequestHint={handleHintRequest}
                                />
                                <button
                                    type="button"
                                    className="pedagogy-return-btn"
                                    onClick={() => setActiveTab('spell')}
                                >
                                    <i className="fas fa-code" /> {isThai ? 'กลับไปหน้าเขียนโค้ด (spell_cast.py)' : 'Return to Code Editor (spell_cast.py)'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="game-console">
                        <div className="game-console-header">
                            <span className="game-console-title">
                                <i className="fas fa-terminal"></i> SYSTEM CONSOLE
                            </span>
                            <button className="game-console-clear" onClick={clearOutput}>Clear</button>
                        </div>
                        <div className="game-console-body">
                            <div className="game-console-line system">System initialized.</div>
                            <div className="game-console-line system">Connected to Spectrum Core.</div>
                            {output.map((line, i) => (
                                <div
                                    key={i}
                                    className={`game-console-line ${line.includes('[ERROR]') ? 'error' : line.includes('[PORTAL]') ? 'portal' : ''}`}
                                >
                                    {line}
                                </div>
                            ))}
                            {output.length === 0 && (
                                <div className="game-console-line waiting">Waiting for input...</div>
                            )}
                        </div>
                    </div>
                    <SpellFailureFeedback failure={spellFailure} isThai={isThai} />
                </div>
            </div>

            {/* ─── Bottom Bar ─── */}
            <div className="game-bottom-bar">
                <button className="game-btn-reset" onClick={handleReset} disabled={isRunning || isArenaExecuting || saving || !!saveError}>
                    <i className="fas fa-redo"></i> {isThai ? 'เริ่มใหม่' : 'RESET'}
                </button>
                <button className="game-btn-run" onClick={handleRun} disabled={isRunning || isArenaExecuting || saving || !!saveError || (stageKey === '4-7' && bossTimeLeft === 0)}>
                    {isRunning ? (
                        <><i className="fas fa-spinner fa-spin"></i> {isThai ? 'กำลังร่ายคาถา...' : 'CASTING...'}</>
                    ) : (
                        <><i className="fas fa-play"></i> {isThai ? 'รันโค้ดคาถา' : 'RUN SPELL CODE'}</>
                    )}
                </button>
            </div>

            {/* ─── Grimoire Modal ─── */}
            {showGrimoire && (
                <Grimoire
                    level={currentStage}
                    stageKey={stageKey}
                    isThai={isThai}
                    startPage={grimoireStartPage}
                    onClose={() => setShowGrimoire(false)}
                />
            )}

            {/* ─── Spell Book Modal ─── */}
            {showSpellBook && (
                <SpellBook
                    unlockedSpells={character.unlockedSpells}
                    onClose={() => setShowSpellBook(false)}
                />
            )}
        </div>
    );
};

export default StagePage;
