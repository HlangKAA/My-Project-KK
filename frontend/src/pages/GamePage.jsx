import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePythonInterpreter from '../hooks/usePythonInterpreter';
import { useGame } from '../context/GameContext';
import Grimoire from '../components/Grimoire';
import LevelComplete from '../components/LevelComplete';
import './gamepage.css';

/* ────────────────────────────────────────
   LEVEL DATA — story-aligned content
   ──────────────────────────────────────── */
const LEVEL_DATA = {
    '1': {
        title: "The Prism Path",
        chapter: "Chapter 1: The Prism",
        location: "Crystal Archives",
        objective: "Restore the <span class='highlight'>Red</span> spectrum to the bridge to cross the chasm.",
        initialCode: "# The bridge needs RED light to appear\n# Use hero.cast_color(r, g, b) to cast light\n# Each value ranges from 0 to 255\n\n# Cast pure RED light:\nhero.cast_color(255, 0, 0)",
        hint: "Use hero.cast_color(red, green, blue). Pure red = (255, 0, 0).",
        completeMessage: "The Red spectrum has been restored! The bridge materializes before you.",
        grimoire: [
            {
                leftTitle: "Scriptures of Variables",
                leftIcon: "fas fa-database",
                leftContent: `A <em style="color:#dc2626">Variable</em> is a named container for magical essence. Like a labeled potion flask, it stores a value for later use.`,
                leftCode: "red = 255\ngreen = 0\nblue = 0",
                leftNote: "Variables remember their values. You can change them anytime — mutable, like shifting sands.",
                leftIncantations: [
                    { code: "x = 10", desc: "Store a number" },
                    { code: 'name = "Mage"', desc: "Store text (string)" },
                    { code: "x = x + 1", desc: "Update a value" }
                ],
                rightTitle: "The RGB Spectrum",
                rightIcon: "fas fa-palette",
                rightContent: `Light in this realm is made of three channels: <em style="color:#dc2626">Red</em>, <em style="color:#16a34a">Green</em>, and <em style="color:#3b82f6">Blue</em>. Each ranges from 0 (none) to 255 (full power).`,
                rightColors: ["red"],
                rightQuote: `"To cast pure Red, channel all energy to the first flame. Let Green and Blue rest at zero. hero.cast_color(255, 0, 0)"`
            },
            {
                leftTitle: "Understanding Functions",
                leftIcon: "fas fa-magic",
                leftContent: `A <em style="color:#dc2626">Function</em> is a reusable spell — a block of code with a name. Call it whenever you need its magic.`,
                leftCode: "def cast_red():\n    hero.cast_color(255, 0, 0)",
                leftNote: "The <strong>def</strong> keyword defines a function. Indentation matters — it marks what belongs inside the spell.",
                leftIncantations: [
                    { code: "def name():", desc: "Define a function" },
                    { code: "name()", desc: "Call the function" },
                    { code: "return value", desc: "Send back a result" }
                ],
                rightTitle: "The Color Wheel",
                rightIcon: "fas fa-cog",
                rightContent: `The seven colors of the spectrum form a wheel of power. Master them all to restore the Lost Spectrum.`,
                rightColors: ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
                rightQuote: `"When the spectrum is complete, the bridge shall manifest. Do not forget the order of the rainbow, lest you fall into the void."`
            }
        ],
        skills: [
            { name: "Variables", type: "STORAGE", icon: "fas fa-database", desc: "Mastered the art of storing magical essence within named containers for later invocation.", pct: 100 },
            { name: "Functions", type: "SPELLCRAFT", icon: "fas fa-magic", desc: "Learned to define and invoke reusable spells with the def keyword.", pct: 80 },
            { name: "RGB Colors", type: "SPECTRUM", icon: "fas fa-palette", desc: "Understood the three channels of light and how to mix them.", pct: 75 }
        ]
    },
    '2': {
        title: "The Matrix Search",
        chapter: "Chapter 2: The Matrix",
        location: "Ash Peaks",
        objective: "Find value <span class='highlight'>46</span> in the ancient list and move to its index position.",
        initialCode: "# The values inscribed on the Matrix wall\nvalues = [10, 25, 46, 80]\n\n# Find the position (index) of 46\ntarget = 46\nindex = values.index(target)\n\nprint(f'Found {target} at index {index}')\nhero.move_to_x(index)",
        hint: "Use .index(value) to find where 46 lives in the list.",
        completeMessage: "You've navigated the Matrix! The path through the Ash Peaks reveals itself.",
        grimoire: [
            {
                leftTitle: "Scriptures of Lists",
                leftIcon: "fas fa-book-open",
                leftContent: `A <em style="color:#dc2626">List</em> is a collection of ancient runes, ordered and changeable. Like ingredients in a potion, order matters.`,
                leftCode: "inventory = ['sword', 'shield', 'potion']",
                leftNote: "Beware! The first item is always at index <strong>0</strong>, not 1. The grand wizard Python dictates it so.",
                leftIncantations: [
                    { code: ".append()", desc: "Add to the end" },
                    { code: ".pop()", desc: "Remove the last" },
                    { code: "len()", desc: "Count the items" },
                    { code: ".index(x)", desc: "Find position of x" }
                ],
                rightTitle: "Matrix Navigation",
                rightIcon: "fas fa-compass",
                rightContent: `In the Matrix realm, every value has a hidden position. To navigate, one must <em style="color:#dc2626">map values to indices</em>.`,
                rightColors: [],
                rightQuote: `"The index is the key to the door. Use .index(value) to reveal where any element hides within the list."`
            },
            {
                leftTitle: "The Art of Searching",
                leftIcon: "fas fa-search",
                leftContent: `The ancient scrolls teach us to <em style="color:#dc2626">search</em> through collections with precision. A skilled wizard never inspects items without purpose.`,
                leftCode: "values = [10, 25, 46, 80]\npos = values.index(46)  # returns 2",
                leftNote: "The <strong>.index()</strong> method reveals the position of any element. But beware — if the element is not found, the spell backfires with a ValueError!",
                leftIncantations: [
                    { code: "x in list", desc: "Check if x exists" },
                    { code: "for x in list:", desc: "Walk through all" },
                    { code: "list[i]", desc: "Access by index" }
                ],
                rightTitle: "Loops & Iteration",
                rightIcon: "fas fa-sync-alt",
                rightContent: `Sometimes you must inspect every rune in a collection. The <em style="color:#dc2626">for loop</em> is the wizard's torch, illuminating each element one by one.`,
                rightColors: [],
                rightQuote: `"for item in collection: — this incantation walks through every element, giving you the power to examine, transform, or collect."`
            }
        ],
        skills: [
            { name: "Lists", type: "STRUCTURE", icon: "fas fa-list-ol", desc: "Acquired the ability to organize multiple incantations into sequential arrays.", pct: 90 },
            { name: "Searching", type: "LOGIC", icon: "fas fa-search", desc: "Learned to locate specific elements within magical arrays.", pct: 70 },
            { name: "Indexing", type: "ACCESS", icon: "fas fa-hand-pointer", desc: "Understood the mapping between position and value in ordered collections.", pct: 85 }
        ]
    },
    '3': {
        title: "The Light Convergence",
        chapter: "Chapter 3: The Light",
        location: "Whispering Caverns",
        objective: "Merge all <span class='highlight'>three</span> color channels to cast White light and awaken the cavern.",
        initialCode: "# The cavern needs WHITE light (all channels max)\n# White = Red + Green + Blue at full power\n\nred = 255\ngreen = 255\nblue = 255\n\nhero.cast_color(red, green, blue)\nprint('The cavern awakens with pure white light!')",
        hint: "White light = all channels at 255. hero.cast_color(255, 255, 255)",
        completeMessage: "The caverns illuminate with pure white light! The Lost Spectrum is fully restored!",
        grimoire: [
            {
                leftTitle: "Conditional Logic",
                leftIcon: "fas fa-code-branch",
                leftContent: `The <em style="color:#dc2626">if</em> statement is the wizard's crossroads. It tests a condition and chooses the path of magic.`,
                leftCode: "if brightness > 200:\n    print('Blinding!')\nelse:\n    print('Too dim...')",
                leftNote: "Use <strong>elif</strong> for additional paths. The <strong>else</strong> catches everything that didn't match above.",
                leftIncantations: [
                    { code: "if x > y:", desc: "Compare values" },
                    { code: "elif:", desc: "Another condition" },
                    { code: "else:", desc: "Default fallback" },
                    { code: "and / or", desc: "Combine conditions" }
                ],
                rightTitle: "Color Mixing Theory",
                rightIcon: "fas fa-lightbulb",
                rightContent: `In the additive light model, combining all three primary colors at full intensity produces <em style="color:#dc2626">White</em>. This is the final spell.`,
                rightColors: ["red", "green", "blue"],
                rightQuote: `"Red + Green + Blue = White. When all three channels burn at 255, the purest light emerges. This is the secret of the Lost Spectrum."`
            },
            {
                leftTitle: "String Formatting",
                leftIcon: "fas fa-font",
                leftContent: `The <em style="color:#dc2626">f-string</em> lets you embed variables inside text. It's the wizard's way of weaving data into words.`,
                leftCode: 'name = "Mage"\npower = 255\nprint(f"{name} casts at {power}!")',
                leftNote: "Place <strong>f</strong> before the quotes, then use <strong>{curly braces}</strong> to insert variables.",
                leftIncantations: [
                    { code: 'f"text {var}"', desc: "Embed a variable" },
                    { code: 'f"{x:.2f}"', desc: "Format decimals" },
                    { code: "str(42)", desc: "Convert to string" }
                ],
                rightTitle: "The Final Spectrum",
                rightIcon: "fas fa-sun",
                rightContent: `You have traveled through the Red Forest, scaled the Ash Peaks, and now stand in the Whispering Caverns. The final challenge awaits.`,
                rightColors: ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
                rightQuote: `"The Lost Spectrum is not a place — it is a state of understanding. When a wizard masters variables, lists, conditions, and light, the spectrum reveals itself."`
            }
        ],
        skills: [
            { name: "Conditions", type: "LOGIC", icon: "fas fa-code-branch", desc: "Learned to branch spell execution based on magical conditions.", pct: 85 },
            { name: "Color Mixing", type: "SPECTRUM", icon: "fas fa-palette", desc: "Mastered the art of combining RGB channels to produce any color.", pct: 100 },
            { name: "f-Strings", type: "OUTPUT", icon: "fas fa-font", desc: "Acquired the power to weave variables into readable text output.", pct: 70 }
        ]
    }
};

const GamePage = () => {
    const { levelId } = useParams();
    const navigate = useNavigate();
    const { user, updateProgress } = useGame();
    const { runCode, output, isRunning, wizardMessage, clearOutput } = usePythonInterpreter();

    const [code, setCode] = useState("");
    const [activeTab, setActiveTab] = useState('spell');
    const [visualState, setVisualState] = useState({});
    const [showGrimoire, setShowGrimoire] = useState(false);
    const [grimoireStartPage, setGrimoireStartPage] = useState(0);
    const [showComplete, setShowComplete] = useState(false);
    const [wizardState, setWizardState] = useState('idle'); // 'idle' | 'casting' | 'success'

    const currentLevel = LEVEL_DATA[levelId] || LEVEL_DATA['1'];
    const nextLevelId = String(parseInt(levelId) + 1);
    const hasNextLevel = LEVEL_DATA[nextLevelId] !== undefined;

    useEffect(() => {
        if (currentLevel) {
            setCode(currentLevel.initialCode);
            setVisualState({});
            clearOutput();
            setShowComplete(false);
            setActiveTab('spell');
        } else {
            navigate('/dashboard');
        }
    }, [levelId, navigate, clearOutput]);

    const handleLevelComplete = () => {
        setWizardState('success');
        updateProgress(parseInt(levelId));
        setTimeout(() => setShowComplete(true), 1500);
    };

    const handleRun = () => {
        clearOutput();
        setWizardState('casting');

        const callbacks = {
            cast_color: (r, g, b) => {
                setVisualState(prev => ({ ...prev, color: `rgb(${r},${g},${b})` }));
                if (levelId === '1' && r === 255 && g === 0 && b === 0) {
                    handleLevelComplete();
                }
                if (levelId === '3' && r === 255 && g === 255 && b === 255) {
                    handleLevelComplete();
                }
            },
            move_to_x: (x) => {
                if (levelId === '2') {
                    setVisualState(prev => ({ ...prev, foundIndex: x }));
                    if (x === 2) { // index of 46 in [10, 25, 46, 80]
                        handleLevelComplete();
                    }
                }
            },
            say: (msg) => console.log("Hero said:", msg)
        };

        runCode(code, callbacks);
    };

    const handleReset = () => {
        setCode(currentLevel.initialCode);
        setVisualState({});
        clearOutput();
        setWizardState('idle');
    };

    const openGrimoire = (pageIndex = 0) => {
        setGrimoireStartPage(pageIndex);
        setShowGrimoire(true);
    };

    const handleContinue = () => {
        if (hasNextLevel) {
            navigate(`/game/${nextLevelId}`);
        } else {
            navigate('/dashboard');
        }
    };

    const lineCount = code.split('\n').length;

    if (showComplete) {
        return (
            <LevelComplete
                level={currentLevel}
                levelId={levelId}
                user={user}
                onReplay={() => { setShowComplete(false); handleReset(); }}
                onContinue={handleContinue}
            />
        );
    }

    return (
        <div className="game-page">
            {/* ─── Navbar ─── */}
            <nav className="game-navbar">
                <div className="game-nav-brand">
                    <div className="game-nav-brand-icon"><i className="fas fa-chess-rook"></i></div>
                    <span className="game-nav-brand-text">The Lost Spectrum</span>
                </div>

                <div className="game-nav-level">
                    <i className="fas fa-dungeon"></i>
                    Level {levelId}: {currentLevel.title}
                </div>

                <div className="game-nav-links">
                    <button className="game-nav-link" onClick={() => navigate('/dashboard')}>
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
                                dangerouslySetInnerHTML={{ __html: currentLevel.objective }}
                            />
                        </div>

                        {/* Character with animations */}
                        <div className="game-character">
                            <div className={`game-character-sprite ${wizardState}`}>
                                <i className="fas fa-hat-wizard" style={{ color: '#fff' }}></i>

                                {/* Magic ring */}
                                <div className={`game-magic-ring ${
                                    wizardState === 'casting' ? 'active' :
                                    wizardState === 'success' ? 'success-ring' : ''
                                }`}></div>

                                {/* Orbiting runes (casting) */}
                                {wizardState === 'casting' && (
                                    <>
                                        <span className="game-rune active">✦</span>
                                        <span className="game-rune active">◆</span>
                                        <span className="game-rune active">✧</span>
                                        <span className="game-rune active">◇</span>
                                    </>
                                )}
                            </div>

                            {/* Ground shadow */}
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

                        {/* Color display (all levels) */}
                        {visualState.color && (
                            <div className="game-color-slots">
                                <div className="game-color-slot filled" style={{ backgroundColor: visualState.color, width: 60, height: 60, borderRadius: 8 }}></div>
                            </div>
                        )}

                        {/* Matrix display (Level 2) */}
                        {levelId === '2' && (
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
                            value={activeTab === 'spell' ? code : `# ${currentLevel.title}\n# ${currentLevel.chapter}\n# Location: ${currentLevel.location}\n\n## Objective\n# ${currentLevel.objective.replace(/<[^>]+>/g, '')}\n\n## Hint\n# ${currentLevel.hint}`}
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
                    level={currentLevel}
                    startPage={grimoireStartPage}
                    onClose={() => setShowGrimoire(false)}
                />
            )}
        </div>
    );
};

export default GamePage;
