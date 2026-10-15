import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePythonInterpreter from '../hooks/usePythonInterpreter';
import useCharacterProgression from '../hooks/useCharacterProgression';
import { useGame } from '../context/GameContext';
import { STAGE_DATA, REGIONS } from '../data/stageData';
import Grimoire from '../components/Grimoire';
import LevelComplete from '../components/LevelComplete';
import HintPanel from '../components/HintPanel';
import GuidedStage from '../components/GuidedStage';
import DebugStage from '../components/DebugStage';
import PuzzleStage from '../components/PuzzleStage';
import WizardProfile from '../components/WizardProfile';
import WizardSprite from '../components/WizardSprite';
import SpellBook from '../components/SpellBook';
import CodeCombatArena from '../components/CodeCombatArena/CodeCombatArena';
import './gamepage.css';
import './stagepage.css';

const StagePage = () => {
    const { regionId, stageId } = useParams();
    const navigate = useNavigate();
    const { user, updateStageProgress } = useGame();
    const { runCode, output, isRunning, wizardMessage, clearOutput } = usePythonInterpreter();
    const { character, levelProgress, awardXP, masterConcept, isStageCompleted } = useCharacterProgression();

    const stageKey = `${regionId}-${stageId}`;
    const currentStage = STAGE_DATA[stageKey];
    const region = REGIONS[regionId];

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
    const [showComplete, setShowComplete] = useState(false);
    const [wizardState, setWizardState] = useState('idle');
    const [showSpellBook, setShowSpellBook] = useState(false);

    // Progressive hints state
    const [attemptCount, setAttemptCount] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [showHints, setShowHints] = useState(false);

    // CodeCombat 2D Arena state
    const [arenaActionQueue, setArenaActionQueue] = useState([]);
    const [isArenaExecuting, setIsArenaExecuting] = useState(false);

    // Completion result (XP breakdown, etc.)
    const [completionResult, setCompletionResult] = useState(null);

    const typingRef = useRef(null);
    const completedRef = useRef(false);
    const typingTimeoutRef = useRef(null);

    // Compute next stage
    const nextStageId = String(parseInt(stageId) + 1);
    const nextStageKey = `${regionId}-${nextStageId}`;
    const hasNextStage = STAGE_DATA[nextStageKey] !== undefined;

    // ─── Initialize ───
    useEffect(() => {
        if (!currentStage) {
            navigate('/dashboard');
            return;
        }

        setCode(currentStage.initialCode || '');
        setVisualState({});
        clearOutput();
        setShowComplete(false);
        setActiveTab('spell');
        setWizardState('idle');
        setAttemptCount(0);
        setHintsUsed(0);
        setShowHints(false);
        setCompletionResult(null);
        setArenaActionQueue([]);
        setIsArenaExecuting(false);
        completedRef.current = false;

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
        }
    }, [regionId, stageId, navigate, clearOutput]);

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
        }, 100);
    };

    // ─── Level Complete ───
    const handleLevelComplete = (extraModifiers = {}) => {
        if (completedRef.current) return;
        completedRef.current = true;

        setWizardState('success');

        // Award XP with multipliers
        const modifiers = {
            firstAttempt: (extraModifiers.attempts || attemptCount + 1) === 1,
            noHints: (extraModifiers.hintsUsed || hintsUsed) === 0,
            attempts: extraModifiers.attempts || attemptCount + 1,
            hintsUsed: extraModifiers.hintsUsed || hintsUsed,
        };

        const result = awardXP(stageKey, currentStage.xpReward || 200, modifiers);
        setCompletionResult(result);

        // Master teaching concepts
        if (currentStage.teachingConcepts) {
            currentStage.teachingConcepts.forEach(concept => masterConcept(concept));
        }

        // Update legacy progress
        if (updateStageProgress) {
            updateStageProgress(parseInt(regionId), parseInt(stageId));
        }

        setTimeout(() => setShowComplete(true), 1500);
    };

    // ─── Run Code (for lesson/challenge/boss stages) ───
    const handleRun = () => {
        clearOutput();
        setWizardState('casting');
        setAttemptCount(prev => prev + 1);

        if (currentStage.arena) {
            // Collect all step actions sequentially
            const actions = [];
            const pushStep = (dir) => {
                actions.push({ type: 'move', dir, steps: 1 });
            };

            const arenaCallbacks = {
                move_right: (n = 1) => {
                    const count = Math.max(1, Number(n) || 1);
                    for (let i = 0; i < count; i++) pushStep('right');
                },
                move_left: (n = 1) => {
                    const count = Math.max(1, Number(n) || 1);
                    for (let i = 0; i < count; i++) pushStep('left');
                },
                move_up: (n = 1) => {
                    const count = Math.max(1, Number(n) || 1);
                    for (let i = 0; i < count; i++) pushStep('up');
                },
                move_down: (n = 1) => {
                    const count = Math.max(1, Number(n) || 1);
                    for (let i = 0; i < count; i++) pushStep('down');
                },
                move_to: (x, y) => actions.push({ type: 'move_to', x: Number(x), y: Number(y) }),
                move_to_x: (x) => actions.push({ type: 'move_to_x', targetX: Number(x) }),
                pick_up: () => actions.push({ type: 'pick_up' }),
                collect: () => actions.push({ type: 'pick_up' }),
                put_in: (targetType) => actions.push({ type: 'put_in', targetType: String(targetType) }),
                deposit: (targetType) => actions.push({ type: 'put_in', targetType: String(targetType) }),
                cast_color: (r, g, b) => actions.push({ type: 'cast_color', args: [Number(r), Number(g), Number(b)] }),
                say: (msg) => actions.push({ type: 'print', text: String(msg) }),
                __onPrint: (text) => {
                    const clean = String(text).trim();
                    if (clean && !clean.startsWith('>') && !clean.startsWith('[')) {
                        actions.push({ type: 'print', text: clean });
                    }
                },
                __onSuccess: () => {
                    console.log("[CodeCombat] Queuing actions to Arena:", actions);
                    setIsArenaExecuting(false);
                    setTimeout(() => {
                        setArenaActionQueue([...actions]);
                        setIsArenaExecuting(true);
                    }, 50);
                },
                __onError: (err) => {
                    setIsArenaExecuting(false);
                    setWizardState('idle');
                }
            };

            runCode(code, arenaCallbacks);
            return;
        }

        const callbacks = {
            cast_color: (r, g, b) => {
                setVisualState(prev => ({ ...prev, color: `rgb(${r},${g},${b})` }));
                // Stage-specific validation for hero callbacks
                if (stageKey === '1-5' && r === 255 && g === 0 && b === 0) {
                    handleLevelComplete();
                }
                if (stageKey === '4-6' && r === 255 && g === 255 && b === 255) {
                    handleLevelComplete();
                }
            },
            move_to_x: (x) => {
                setVisualState(prev => ({ ...prev, foundIndex: x }));
                // Stage 3-3: Matrix Search
                if (stageKey === '3-3' && x === 2) {
                    handleLevelComplete();
                }
            },
            say: (msg) => console.log("Hero said:", msg)
        };

        // Output validation for stages with validateOutput
        if (currentStage.validateOutput) {
            setTimeout(() => {
                if (currentStage.validateOutput(output) && !completedRef.current) {
                    handleLevelComplete();
                }
            }, 500);
        }

        runCode(code, callbacks);
    };

    const handleArenaExecutionFinish = (success, msg) => {
        setIsArenaExecuting(false);
        if (success) {
            if (currentStage.validateOutput) {
                setTimeout(() => {
                    if (currentStage.validateOutput(output)) {
                        handleLevelComplete();
                    } else {
                        setTimeout(() => {
                            handleLevelComplete();
                        }, 500);
                    }
                }, 300);
            } else {
                handleLevelComplete();
            }
        } else {
            setWizardState('confused');
        }
    };

    // ─── Validate output for complex stages ───
    useEffect(() => {
        if (completedRef.current) return;
        if (wizardState === 'casting') {
            // Multi-condition stages
            if (stageKey === '1-7') {
                if (visualState.foundIndex === 3 && visualState.color === 'rgb(0,0,255)') {
                    handleLevelComplete();
                }
            } else if (stageKey === '1-8') {
                if (currentStage?.validateOutput && currentStage.validateOutput(output) &&
                    visualState.foundIndex === 5 && visualState.color === 'rgb(0,255,0)') {
                    handleLevelComplete();
                }
            } else if (stageKey === '1-6') {
                if (visualState.color === 'rgb(255,255,0)' && visualState.foundIndex === 2) {
                    handleLevelComplete();
                }
            } else if (stageKey === '3-6') {
                if (visualState.foundIndex === 2 && output.some(l => l.includes('10'))) {
                    handleLevelComplete();
                }
            } else if (stageKey === '4-5') {
                if (visualState.color === 'rgb(0,255,0)') {
                    handleLevelComplete();
                }
            } else if (currentStage?.validateOutput && output.length > 0) {
                if (currentStage.validateOutput(output)) {
                    handleLevelComplete();
                }
            }
        }
    }, [output, visualState, wizardState, currentStage, stageKey]);

    const handleReset = () => {
        setCode(currentStage.initialCode || '');
        setVisualState({});
        clearOutput();
        setWizardState('idle');
        setArenaActionQueue([]);
        setIsArenaExecuting(false);
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

    // Detect errors in output to show confused state
    useEffect(() => {
        if (wizardState === 'success') return;
        const hasError = output.some(line => line.startsWith('[ERROR]'));
        if (hasError && wizardState === 'casting') {
            setWizardState('confused');
            // Go back to idle after a few seconds
            setTimeout(() => {
                if (!completedRef.current) setWizardState('idle');
            }, 3000);
        }
    }, [output]);

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

    const handleHintRequest = () => {
        setHintsUsed(prev => prev + 1);
    };

    // ─── Guard ───
    if (!currentStage || !region) {
        return <div style={{ color: 'white', padding: '20px' }}>Stage not found.</div>;
    }

    const lineCount = code.split('\n').length;
    const stageType = currentStage.stageType || 'challenge';

    // ─── Level Complete Screen ───
    if (showComplete) {
        return (
            <LevelComplete
                level={currentStage}
                levelId={stageKey}
                user={user}
                character={character}
                levelProgress={levelProgress}
                completionResult={completionResult}
                onReplay={() => { setShowComplete(false); handleReset(); }}
                onContinue={handleContinue}
            />
        );
    }

    // ═══════════════════════════════════════════
    //   RENDER: Story Intro Phase
    // ═══════════════════════════════════════════
    if (storyPhase === 'intro' && currentStage.hasStoryIntro) {
        const story = currentStage.storyIntro;
        const currentDialog = story.dialogues[dialogIndex];

        return (
            <div className="stage-story-page">
                {/* Background Scene */}
                <div className="stage-story-bg">
                    {/* Tower silhouette */}
                    <div className="stage-story-tower">
                        <div className="tower-body">
                            <div className="tower-window"></div>
                            <div className="tower-window w2"></div>
                            <div className="tower-window w3"></div>
                        </div>
                        <div className="tower-roof"></div>
                        <div className="tower-spire"></div>
                        <div className="tower-glow"></div>
                    </div>

                    {/* Ambient particles */}
                    <div className="stage-story-particles">
                        {Array.from({ length: 30 }, (_, i) => (
                            <div key={i} className="story-particle" style={{
                                left: `${Math.random() * 100}%`,
                                bottom: `${Math.random() * 40}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 4}s`,
                                width: `${2 + Math.random() * 3}px`,
                                height: `${2 + Math.random() * 3}px`
                            }}></div>
                        ))}
                    </div>

                    {/* Ground fog */}
                    <div className="stage-story-fog"></div>
                </div>

                {/* Region/Stage indicator */}
                <div className="stage-story-indicator">
                    <span className="stage-story-region">{region.name}</span>
                    <span className="stage-story-divider">—</span>
                    <span className="stage-story-stage">{currentStage.title}</span>
                </div>

                {/* NPC Character (using real sprite) */}
                <div className={`stage-npc ${npcVisible ? 'visible' : ''}`}>
                    <div className="stage-npc-sprite">
                        <WizardSprite
                            state="idle"
                            size="lg"
                            showParticles={false}
                            showShadow={true}
                            showGlow={true}
                        />
                    </div>
                    <div className="stage-npc-name-tag">
                        <span className="stage-npc-name">{story.npcName}</span>
                        <span className="stage-npc-title">{story.npcTitle}</span>
                    </div>
                </div>

                {/* Dialog Box */}
                <div className="stage-dialog-area" onClick={handleDialogClick}>
                    {dialogIndex < story.dialogues.length && (
                        <div className={`stage-dialog-box ${currentDialog?.emotion || ''}`}>
                            <div className="stage-dialog-speaker">
                                <i className={story.npcIcon}></i>
                                <span>{currentDialog?.speaker}</span>
                            </div>
                            <p className="stage-dialog-text">{displayedText}</p>
                            {!isTyping && (
                                <div className="stage-dialog-next">
                                    {dialogIndex < story.dialogues.length - 1 ? (
                                        <span>Click to continue <i className="fas fa-chevron-right"></i></span>
                                    ) : (
                                        <span>Click to proceed <i className="fas fa-chevron-right"></i></span>
                                    )}
                                </div>
                            )}
                            {isTyping && (
                                <div className="stage-dialog-typing">
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Enter Tower Button */}
                    {showEnterButton && (
                        <button className="stage-enter-btn" onClick={(e) => { e.stopPropagation(); handleEnterTower(); }}>
                            <i className={story.enterButtonIcon}></i>
                            <span>{story.enterButtonText}</span>
                            <div className="stage-enter-btn-glow"></div>
                        </button>
                    )}
                </div>

                {/* Skip button */}
                <button className="stage-skip-btn" onClick={handleEnterTower}>
                    Skip <i className="fas fa-forward"></i>
                </button>
            </div>
        );
    }

    // ═══════════════════════════════════════════
    //   RENDER: IDE Phase (with stage type routing)
    // ═══════════════════════════════════════════

    // Render specialized stage types in the scene panel area
    const renderStageTypeContent = () => {
        switch (stageType) {
            case 'guided':
                return (
                    <GuidedStage
                        data={currentStage}
                        onComplete={handleLevelComplete}
                        runCode={runCode}
                    />
                );
            case 'debug':
                return (
                    <DebugStage
                        data={currentStage}
                        onComplete={handleLevelComplete}
                        runCode={runCode}
                        output={output}
                        clearOutput={clearOutput}
                    />
                );
            case 'puzzle':
                return (
                    <PuzzleStage
                        data={currentStage}
                        onComplete={handleLevelComplete}
                    />
                );
            default:
                // lesson, challenge, boss — use the standard IDE layout
                return null;
        }
    };

    const specialContent = renderStageTypeContent();

    return (
        <div className={`stage-game-page ${ideSliding ? 'ide-slide-in' : ''}`}>
            {/* ─── Navbar ─── */}
            <nav className="game-navbar">
                <div className="game-nav-brand">
                    <div className="game-nav-brand-icon"><i className="fas fa-chess-rook"></i></div>
                    <span className="game-nav-brand-text">The Lost Spectrum</span>
                </div>

                <div className="game-nav-level">
                    <i className="fas fa-dungeon"></i>
                    Stage {regionId}-{stageId}: {currentStage.title}
                    {currentStage.difficulty && (
                        <span className="game-nav-difficulty">
                            {Array.from({ length: currentStage.difficulty }, (_, i) => (
                                <i key={i} className="fas fa-star" style={{ color: '#fbbf24', fontSize: '0.6rem' }}></i>
                            ))}
                        </span>
                    )}
                </div>

                <div className="game-nav-links">
                    <button className="game-nav-link" onClick={() => navigate(`/region/${regionId}`)}>
                        <i className="fas fa-map"></i> Map
                    </button>
                    <button className="game-nav-link" onClick={() => openGrimoire(0)}>
                        <i className="fas fa-magic"></i> Spells
                    </button>
                    <button className="game-nav-link" onClick={() => setShowSpellBook(true)}>
                        <i className="fas fa-book-open"></i> Spell Book
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
            <div className="game-main">
                {specialContent ? (
                    /* ─── Specialized Stage Types (Guided / Debug / Puzzle) ─── */
                    <div className="game-scene" style={{ flex: 1 }}>
                        <div className="game-scene-view" style={{ padding: 0, overflow: 'auto' }}>
                            {specialContent}
                        </div>
                    </div>
                ) : (
                    /* ─── Standard IDE Layout (Lesson / Challenge / Boss) ─── */
                    <>
                        {/* ─── Scene Panel ─── */}
                        {currentStage.arena ? (
                            <div className="game-scene" style={{ flex: 1, minWidth: 320, overflow: 'hidden' }}>
                                <div className="game-scene-view" style={{ padding: '10px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div className="game-objective" style={{ margin: '4px auto 10px auto', width: '100%', maxWidth: 740 }}>
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
                                        arenaConfig={currentStage.arena}
                                        actionQueue={arenaActionQueue}
                                        isExecuting={isArenaExecuting}
                                        onExecutionFinish={handleArenaExecutionFinish}
                                        onReset={() => {
                                            setArenaActionQueue([]);
                                            setIsArenaExecuting(false);
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

                                    {/* Matrix display (Stage 3-3) */}
                                    {stageKey === '3-3' && (
                                        <div style={{
                                            position: 'absolute', bottom: '25%', right: '8%',
                                            display: 'flex', gap: 8, zIndex: 4
                                        }}>
                                            {[10, 25, 46, 80].map((val, idx) => (
                                                <div key={val} style={{
                                                    width: 44, height: 44,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    border: `2px solid ${visualState.foundIndex === idx ? '#dc2626' : 'rgba(255,255,255,0.15)'}`,
                                                    borderRadius: 6,
                                                    background: visualState.foundIndex === idx ? 'rgba(220,38,38,0.2)' : 'rgba(0,0,0,0.4)',
                                                    color: '#fff', fontSize: '0.8rem',
                                                    fontFamily: "'JetBrains Mono', monospace"
                                                }}>
                                                    {val}
                                                </div>
                                            ))}
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
                            <div className="game-editor-tabs">
                                <button
                                    className={`game-editor-tab ${activeTab === 'spell' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('spell')}
                                >
                                    <i className="fas fa-code"></i> spell_cast.py
                                </button>
                                <button
                                    className={`game-editor-tab ${activeTab === 'readme' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('readme')}
                                >
                                    <i className="fas fa-file-alt"></i> readme.md
                                </button>
                                <span className="game-editor-dots">⋯</span>
                            </div>

                            <div className="game-code-area">
                                <div className="game-line-numbers">
                                    {Array.from({ length: Math.max(lineCount, 15) }, (_, i) => (
                                        <span key={i}>{i + 1}</span>
                                    ))}
                                </div>
                                <textarea
                                    className="game-code-textarea"
                                    value={activeTab === 'spell' ? code : `# ${currentStage.title}\n# ${currentStage.chapter}\n# Location: ${currentStage.location}\n\n## Objective\n# ${currentStage.objective.replace(/<[^>]+>/g, '')}\n\n## Hint\n# ${currentStage.hints?.[0]?.text || 'No hint available'}`}
                                    onChange={handleCodeChange}
                                    spellCheck="false"
                                    readOnly={activeTab !== 'spell'}
                                    placeholder="# Enter your Python spell here..."
                                />
                            </div>

                            {/* Hint Panel (shown after first failed attempt) */}
                            {attemptCount > 0 && currentStage.hints && !completedRef.current && (
                                <div style={{ padding: '0 0.5rem 0.5rem' }}>
                                    <HintPanel
                                        hints={currentStage.hints}
                                        attemptCount={attemptCount}
                                        onRequestHint={handleHintRequest}
                                    />
                                </div>
                            )}

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
                                        <div key={i} className={`game-console-line ${line.startsWith('[ERROR]') ? 'error' : ''}`}>
                                            {line}
                                        </div>
                                    ))}
                                    {output.length === 0 && (
                                        <div className="game-console-line waiting">Waiting for input...</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ─── Bottom Bar (only for IDE stages) ─── */}
            {!specialContent && (
                <div className="game-bottom-bar">
                    <button className="game-btn-reset" onClick={handleReset}>
                        <i className="fas fa-redo"></i> RESET
                    </button>
                    <button className="game-btn-run" onClick={handleRun} disabled={isRunning}>
                        {isRunning ? (
                            <><i className="fas fa-spinner fa-spin"></i> CASTING...</>
                        ) : (
                            <><i className="fas fa-play"></i> RUN SPELL CODE</>
                        )}
                    </button>
                </div>
            )}

            {/* ─── Grimoire Modal ─── */}
            {showGrimoire && (
                <Grimoire
                    level={currentStage}
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
