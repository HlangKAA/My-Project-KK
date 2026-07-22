import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePythonInterpreter from '../hooks/usePythonInterpreter';
import { useGame } from '../context/GameContext';
import { STAGE_DATA, REGIONS } from '../data/stageData';
import Grimoire from '../components/Grimoire';
import LevelComplete from '../components/LevelComplete';
import './gamepage.css';
import './stagepage.css';

const StagePage = () => {
    const { regionId, stageId } = useParams();
    const navigate = useNavigate();
    const { user, updateStageProgress } = useGame();
    const { runCode, output, isRunning, wizardMessage, clearOutput } = usePythonInterpreter();

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

    const typingRef = useRef(null);

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

        // Story intro setup
        if (currentStage.hasStoryIntro) {
            setStoryPhase('intro');
            setDialogIndex(0);
            setDisplayedText('');
            setShowEnterButton(false);
            setIdeSliding(false);
            // NPC appear with delay
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
            // Skip typing, show full text
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
    const handleLevelComplete = () => {
        setWizardState('success');
        if (updateStageProgress) {
            updateStageProgress(parseInt(regionId), parseInt(stageId));
        }
        setTimeout(() => setShowComplete(true), 1500);
    };

    // ─── Run Code ───
    const handleRun = () => {
        clearOutput();
        setWizardState('casting');

        const collectedOutput = [];

        const callbacks = {
            cast_color: (r, g, b) => {
                setVisualState(prev => ({ ...prev, color: `rgb(${r},${g},${b})` }));
                // Stage 1-2: Red
                if (stageKey === '1-2' && r === 255 && g === 0 && b === 0) {
                    handleLevelComplete();
                }
                // Stage 3-1: White
                if (stageKey === '3-1' && r === 255 && g === 255 && b === 255) {
                    handleLevelComplete();
                }
            },
            move_to_x: (x) => {
                if (stageKey === '2-1') {
                    setVisualState(prev => ({ ...prev, foundIndex: x }));
                    if (x === 2) {
                        handleLevelComplete();
                    }
                }
            },
            say: (msg) => console.log("Hero said:", msg)
        };

        // Intercept output for validation (stage 1-1)
        const originalRunCode = runCode;
        if (currentStage.validateOutput) {
            // We need to collect output and check after run
            const wrappedCallbacks = { ...callbacks };

            // We'll check output after a short delay
            setTimeout(() => {
                if (currentStage.validateOutput(output)) {
                    handleLevelComplete();
                }
            }, 500);
        }

        runCode(code, callbacks);
    };

    // ─── Validate output for print-based stages ───
    useEffect(() => {
        if (currentStage?.validateOutput && output.length > 0 && wizardState === 'casting') {
            if (currentStage.validateOutput(output)) {
                handleLevelComplete();
            }
        }
    }, [output]);

    const handleReset = () => {
        setCode(currentStage.initialCode || '');
        setVisualState({});
        clearOutput();
        setWizardState('idle');
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

    // ─── Guard ───
    if (!currentStage || !region) {
        return <div style={{ color: 'white', padding: '20px' }}>Stage not found.</div>;
    }

    const lineCount = code.split('\n').length;

    // ─── Level Complete Screen ───
    if (showComplete) {
        return (
            <LevelComplete
                level={currentStage}
                levelId={stageKey}
                user={user}
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

                {/* NPC Character */}
                <div className={`stage-npc ${npcVisible ? 'visible' : ''}`}>
                    <div className="stage-npc-sprite">
                        <i className={story.npcIcon}></i>
                        <div className="stage-npc-glow"></div>
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
    //   RENDER: IDE Phase (with slide-in animation)
    // ═══════════════════════════════════════════
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
                </div>

                <div className="game-nav-links">
                    <button className="game-nav-link" onClick={() => navigate(`/region/${regionId}`)}>
                        <i className="fas fa-map"></i> Map
                    </button>
                    <button className="game-nav-link" onClick={() => openGrimoire(0)}>
                        <i className="fas fa-magic"></i> Spells
                    </button>
                    <button className="game-nav-link">
                        <i className="fas fa-archive"></i> Inventory
                    </button>
                    <button className="game-nav-link">
                        <i className="fas fa-cog"></i>
                    </button>
                </div>

                <div className="game-nav-user">
                    <div className="game-nav-user-label">
                        <span>Archmage</span><br />
                        <span className="game-nav-user-name">{user?.username || 'Explorer'}</span>
                    </div>
                    <div className="game-nav-avatar">
                        <i className="fas fa-hat-wizard"></i>
                    </div>
                </div>
            </nav>

            {/* ─── Main ─── */}
            <div className="game-main">
                {/* ─── Scene Panel ─── */}
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
                                <span className="game-objective-label">Current Objective</span>
                            </div>
                            <div
                                className="game-objective-text"
                                dangerouslySetInnerHTML={{ __html: currentStage.objective }}
                            />
                        </div>

                        {/* Character with animations */}
                        <div className="game-character">
                            <div className={`game-character-sprite ${wizardState}`}>
                                <i className="fas fa-hat-wizard" style={{ color: '#fff' }}></i>

                                <div className={`game-magic-ring ${
                                    wizardState === 'casting' ? 'active' :
                                    wizardState === 'success' ? 'success-ring' : ''
                                }`}></div>

                                {wizardState === 'casting' && (
                                    <>
                                        <span className="game-rune active">✦</span>
                                        <span className="game-rune active">◆</span>
                                        <span className="game-rune active">✧</span>
                                        <span className="game-rune active">◇</span>
                                    </>
                                )}
                            </div>
                            <div className="game-character-shadow"></div>
                        </div>

                        {/* Magic Particles */}
                        {wizardState === 'casting' && (
                            <div className="game-particles">
                                <div className="game-particle casting-particle p1"></div>
                                <div className="game-particle casting-particle p2"></div>
                                <div className="game-particle casting-particle p3"></div>
                                <div className="game-particle casting-particle p4"></div>
                                <div className="game-particle casting-particle p5"></div>
                                <div className="game-particle casting-particle p6"></div>
                            </div>
                        )}
                        {wizardState === 'success' && (
                            <div className="game-particles">
                                <div className="game-particle success-particle sp1"></div>
                                <div className="game-particle success-particle sp2"></div>
                                <div className="game-particle success-particle sp3"></div>
                                <div className="game-particle success-particle sp4"></div>
                                <div className="game-particle success-particle sp5"></div>
                                <div className="game-particle success-particle sp6"></div>
                            </div>
                        )}

                        {/* Color display */}
                        {visualState.color && (
                            <div className="game-color-slots">
                                <div className="game-color-slot filled" style={{ backgroundColor: visualState.color, width: 60, height: 60, borderRadius: 8 }}></div>
                            </div>
                        )}

                        {/* Matrix display (Stage 2-1) */}
                        {stageKey === '2-1' && (
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
                            value={activeTab === 'spell' ? code : `# ${currentStage.title}\n# ${currentStage.chapter}\n# Location: ${currentStage.location}\n\n## Objective\n# ${currentStage.objective.replace(/<[^>]+>/g, '')}\n\n## Hint\n# ${currentStage.hint}`}
                            onChange={(e) => activeTab === 'spell' && setCode(e.target.value)}
                            spellCheck="false"
                            readOnly={activeTab !== 'spell'}
                            placeholder="# Enter your Python spell here..."
                        />
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
            </div>

            {/* ─── Bottom Bar ─── */}
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

            {/* ─── Grimoire Modal ─── */}
            {showGrimoire && (
                <Grimoire
                    level={currentStage}
                    startPage={grimoireStartPage}
                    onClose={() => setShowGrimoire(false)}
                />
            )}
        </div>
    );
};

export default StagePage;
