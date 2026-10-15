/*  ═══════════════════════════════════════════════════
    SpellCastOverlay — Code editor popup for quests
    Opens when wizard interacts with NPC/puzzle/boss
    ═══════════════════════════════════════════════════ */

import React, { useState, useRef, useEffect } from 'react';
import usePythonInterpreter from '../../hooks/usePythonInterpreter';
import { CALLBACK_VALIDATORS } from '../../data/questData';
import Grimoire from '../Grimoire';
import './SpellCastOverlay.css';

export default function SpellCastOverlay({ questId, quest, onComplete, onClose }) {
    const { runCode, output, isRunning, wizardMessage, clearOutput } = usePythonInterpreter();
    const [code, setCode] = useState(quest.initialCode || '');
    const [attemptCount, setAttemptCount] = useState(0);
    const [currentHintLevel, setCurrentHintLevel] = useState(-1);
    const [showGrimoire, setShowGrimoire] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [callLog, setCallLog] = useState([]);

    // Boss battle state
    const [currentPhase, setCurrentPhase] = useState(0);
    const [bossHP, setBossHP] = useState(quest.type === 'boss' ? 100 : null);
    const [bossReaction, setBossReaction] = useState(null);

    const completedRef = useRef(false);
    const textareaRef = useRef(null);

    const isBoss = quest.type === 'boss';
    const currentBossPhase = isBoss ? quest.phases?.[currentPhase] : null;

    // Focus textarea on mount
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, []);

    // Reset code when boss phase changes
    useEffect(() => {
        if (isBoss && currentBossPhase) {
            setCode(currentBossPhase.initialCode || '');
            clearOutput();
            setCallLog([]);
            setAttemptCount(0);
            setCurrentHintLevel(-1);
        }
    }, [currentPhase]);

    // ─── Run Code ───
    const handleRun = () => {
        if (isRunning || isCompleted) return;
        clearOutput();
        setCallLog([]);
        setAttemptCount(prev => prev + 1);

        const newCallLog = [];
        const callbacks = {
            cast_color: (r, g, b) => {
                newCallLog.push({ method: 'cast_color', args: [r, g, b] });
                setCallLog(prev => [...prev, { method: 'cast_color', args: [r, g, b] }]);
                log(`[cast_color] ${r}, ${g}, ${b}`);
            },
            move_to_x: (x) => {
                newCallLog.push({ method: 'move_to_x', args: [x] });
                setCallLog(prev => [...prev, { method: 'move_to_x', args: [x] }]);
                log(`[move_to_x] ${x}`);
            },
            say: (msg) => {
                newCallLog.push({ method: 'say', args: [msg] });
                log(`[say] "${msg}"`);
            },
        };

        // After code runs, validate
        const checkValidation = () => {
            setTimeout(() => {
                let valid = false;

                if (isBoss && currentBossPhase) {
                    // Boss phase validation
                    if (currentBossPhase.validate) {
                        valid = currentBossPhase.validate(output.concat(
                            newCallLog.map(c => `[${c.method}] ${c.args.join(', ')}`)
                        ));
                    }
                    if (!valid && currentBossPhase.validateCallback) {
                        const validator = CALLBACK_VALIDATORS[currentBossPhase.validateCallback];
                        if (validator) valid = validator(newCallLog);
                    }

                    if (valid && !completedRef.current) {
                        // Boss phase complete
                        setBossReaction(currentBossPhase.bossReaction);
                        setBossHP(prev => Math.max(0, prev - (currentBossPhase.hpDamage || 0)));

                        setTimeout(() => {
                            setBossReaction(null);
                            if (currentPhase < quest.phases.length - 1) {
                                setCurrentPhase(prev => prev + 1);
                            } else {
                                // Boss defeated!
                                completedRef.current = true;
                                setIsCompleted(true);
                                setShowSuccess(true);
                                setTimeout(() => onComplete(questId, quest.xpReward || 500), 2000);
                            }
                        }, 1500);
                    }
                } else {
                    // Normal quest validation
                    if (quest.validateOutput) {
                        valid = quest.validateOutput(output.concat(
                            newCallLog.map(c => `[${c.method}] ${c.args.join(', ')}`)
                        ));
                    }
                    if (!valid && quest.validateCallback) {
                        const validator = CALLBACK_VALIDATORS[quest.validateCallback];
                        if (validator) valid = validator(newCallLog);
                    }

                    if (valid && !completedRef.current) {
                        completedRef.current = true;
                        setIsCompleted(true);
                        setShowSuccess(true);
                        setTimeout(() => onComplete(questId, quest.xpReward || 200), 2000);
                    }
                }
            }, 600);
        };

        runCode(code, callbacks);
        // Check validation after a delay for output to populate
        setTimeout(checkValidation, 800);
    };

    // ─── Validate output changes ───
    useEffect(() => {
        if (completedRef.current || isCompleted || (output.length === 0 && callLog.length === 0)) return;

        let valid = false;
        const combinedOutput = output.concat(
            callLog.map(c => `[${c.method}] ${c.args.join(', ')}`)
        );

        if (isBoss && currentBossPhase) {
            if (currentBossPhase.validate) {
                valid = currentBossPhase.validate(combinedOutput);
            }
        } else {
            if (quest.validateOutput) {
                valid = quest.validateOutput(combinedOutput);
            }
        }

        if (!valid && callLog.length > 0) {
            const validatorKey = isBoss ? currentBossPhase?.validateCallback : quest.validateCallback;
            if (validatorKey) {
                const validator = CALLBACK_VALIDATORS[validatorKey];
                if (validator) valid = validator(callLog);
            }
        }

        if (valid && !completedRef.current) {
            completedRef.current = true;
            setIsCompleted(true);
            setShowSuccess(true);

            if (isBoss) {
                setBossReaction(currentBossPhase?.bossReaction);
                setBossHP(prev => Math.max(0, prev - (currentBossPhase?.hpDamage || 0)));
                setTimeout(() => {
                    setBossReaction(null);
                    if (currentPhase < quest.phases.length - 1) {
                        completedRef.current = false;
                        setIsCompleted(false);
                        setShowSuccess(false);
                        setCurrentPhase(prev => prev + 1);
                    } else {
                        setTimeout(() => onComplete(questId, quest.xpReward || 500), 1500);
                    }
                }, 1500);
            } else {
                setTimeout(() => onComplete(questId, quest.xpReward || 200), 2000);
            }
        }
    }, [output, callLog]);

    const handleReset = () => {
        const initialCode = isBoss && currentBossPhase
            ? currentBossPhase.initialCode
            : quest.initialCode;
        setCode(initialCode || '');
        clearOutput();
        setCallLog([]);
    };

    const requestHint = () => {
        if (!quest.hints && !(isBoss && currentBossPhase?.hints)) return;
        const hints = isBoss ? currentBossPhase?.hints : quest.hints;
        if (!hints) return;
        setCurrentHintLevel(prev => Math.min(prev + 1, hints.length - 1));
    };

    const lineCount = code.split('\n').length;
    const objective = isBoss && currentBossPhase ? currentBossPhase.objective : quest.objective;
    const hints = isBoss ? currentBossPhase?.hints : quest.hints;

    // Handle ESC to close
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape' && !isCompleted) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isCompleted, onClose]);

    return (
        <div className="sco-overlay" onClick={(e) => { if (e.target === e.currentTarget && !isCompleted) onClose(); }}>
            <div className={`sco-panel ${isBoss ? 'sco-boss' : ''} ${showSuccess ? 'sco-success' : ''}`}>
                {/* ─── Header ─── */}
                <div className="sco-header">
                    <div className="sco-header-left">
                        <i className={isBoss ? 'fas fa-dragon' : 'fas fa-scroll'} />
                        <div>
                            <h2 className="sco-title">{quest.name}</h2>
                            <span className="sco-difficulty">
                                {Array.from({ length: quest.difficulty || 1 }, (_, i) => (
                                    <i key={i} className="fas fa-star" />
                                ))}
                            </span>
                        </div>
                    </div>
                    {!isCompleted && (
                        <button className="sco-close" onClick={onClose}>
                            <i className="fas fa-times" />
                        </button>
                    )}
                </div>

                {/* ─── Boss HP Bar ─── */}
                {isBoss && (
                    <div className="sco-boss-bar">
                        <div className="sco-boss-info">
                            <i className="fas fa-dragon" />
                            <span>{quest.name}</span>
                            <span className="sco-boss-phase">Phase {currentPhase + 1}/{quest.phases.length}</span>
                        </div>
                        <div className="sco-boss-hp-track">
                            <div
                                className={`sco-boss-hp-fill ${bossReaction || ''}`}
                                style={{ width: `${bossHP}%` }}
                            />
                        </div>
                        {currentBossPhase?.dialog && (
                            <div className={`sco-boss-dialog ${bossReaction || ''}`}>
                                <span className="sco-boss-speaker">{currentBossPhase.dialog.speaker}:</span>
                                <span>{currentBossPhase.dialog.text}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Objective ─── */}
                <div className="sco-objective">
                    <div className="sco-objective-dot" />
                    <span dangerouslySetInnerHTML={{ __html: objective }} />
                </div>

                {/* ─── Code Editor ─── */}
                <div className="sco-editor">
                    <div className="sco-editor-header">
                        <i className="fas fa-code" />
                        <span>spell_cast.py</span>
                    </div>
                    <div className="sco-editor-body">
                        <div className="sco-line-numbers">
                            {Array.from({ length: Math.max(lineCount, 8) }, (_, i) => (
                                <span key={i}>{i + 1}</span>
                            ))}
                        </div>
                        <textarea
                            ref={textareaRef}
                            className="sco-textarea"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck={false}
                            readOnly={isCompleted}
                            placeholder="# Write your Python spell here..."
                            onKeyDown={(e) => {
                                // Tab support
                                if (e.key === 'Tab') {
                                    e.preventDefault();
                                    const start = e.target.selectionStart;
                                    const end = e.target.selectionEnd;
                                    setCode(code.substring(0, start) + '    ' + code.substring(end));
                                    setTimeout(() => {
                                        e.target.selectionStart = e.target.selectionEnd = start + 4;
                                    }, 0);
                                }
                                // Ctrl+Enter to run
                                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                    e.preventDefault();
                                    handleRun();
                                }
                            }}
                        />
                    </div>
                </div>

                {/* ─── Console ─── */}
                <div className="sco-console">
                    <div className="sco-console-header">
                        <i className="fas fa-terminal" />
                        <span>Console</span>
                        <button className="sco-console-clear" onClick={clearOutput}>Clear</button>
                    </div>
                    <div className="sco-console-body">
                        {output.length === 0 ? (
                            <div className="sco-console-line dim">Waiting for spell...</div>
                        ) : (
                            output.map((line, i) => (
                                <div key={i} className={`sco-console-line ${line.startsWith('[ERROR]') ? 'error' : ''}`}>
                                    {line}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ─── Hints ─── */}
                {currentHintLevel >= 0 && hints && (
                    <div className="sco-hint">
                        <i className="fas fa-lightbulb" />
                        <span>{hints[currentHintLevel]?.text}</span>
                        {currentHintLevel < hints.length - 1 && (
                            <button className="sco-hint-more" onClick={requestHint}>
                                More help?
                            </button>
                        )}
                    </div>
                )}

                {/* ─── Actions ─── */}
                <div className="sco-actions">
                    <div className="sco-actions-left">
                        {quest.grimoire && (
                            <button className="sco-btn sco-btn-grimoire" onClick={() => setShowGrimoire(true)}>
                                <i className="fas fa-book-open" /> Grimoire
                            </button>
                        )}
                        {hints && currentHintLevel < 0 && attemptCount > 0 && (
                            <button className="sco-btn sco-btn-hint" onClick={requestHint}>
                                <i className="fas fa-lightbulb" /> Hint
                            </button>
                        )}
                        <button className="sco-btn sco-btn-reset" onClick={handleReset}>
                            <i className="fas fa-redo" /> Reset
                        </button>
                    </div>
                    <button
                        className={`sco-btn sco-btn-run ${isCompleted ? 'success' : ''}`}
                        onClick={handleRun}
                        disabled={isRunning || isCompleted}
                    >
                        {isCompleted ? (
                            <><i className="fas fa-check" /> Spell Succeeded!</>
                        ) : isRunning ? (
                            <><i className="fas fa-spinner fa-spin" /> Casting...</>
                        ) : (
                            <><i className="fas fa-play" /> Cast Spell <span className="sco-shortcut">Ctrl+Enter</span></>
                        )}
                    </button>
                </div>

                {/* ─── Success overlay ─── */}
                {showSuccess && (
                    <div className="sco-success-overlay">
                        <div className="sco-success-content">
                            <div className="sco-success-icon">✨</div>
                            <h3>{isBoss && currentPhase >= quest.phases.length - 1
                                ? '⚔️ Boss Defeated!'
                                : '🎉 Quest Complete!'}</h3>
                            <p>+{quest.xpReward || 200} XP</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Grimoire Modal */}
            {showGrimoire && quest.grimoire && (
                <Grimoire
                    level={{ grimoire: quest.grimoire }}
                    startPage={0}
                    onClose={() => setShowGrimoire(false)}
                />
            )}
        </div>
    );
}
