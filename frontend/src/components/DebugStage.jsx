import React, { useState } from 'react';
import HintPanel from './HintPanel';
import './stagetypes.css';

/**
 * DebugStage — Find and fix bugs in code
 * แสดง buggy code ให้ผู้เล่นแก้ แล้วรัน validate output
 */
const DebugStage = ({ data, onAttempt, runCode, output = [], clearOutput }) => {
    const [code, setCode] = useState(data.buggyCode || data.initialCode || '');
    const [attemptCount, setAttemptCount] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [resultStatus, setResultStatus] = useState(null); // null | 'success' | 'error'

    const handleRun = () => {
        if (isRunning) return;
        const started = performance.now();
        const submitted_at = new Date().toISOString();
        const lines = [];
        setAttemptCount(prev => prev + 1);
        setIsRunning(true);
        setResultStatus(null);
        clearOutput?.();
        const record = async result => {
            setResultStatus(result === 'Success' ? 'success' : 'error');
            await onAttempt({ code, result, submitted_at, runtime: (performance.now() - started) / 1000 },
                { attempts: attemptCount + 1, hintsUsed });
            setIsRunning(false);
        };
        runCode(code, {
            cast_color: () => {}, move_to_x: () => {}, say: () => {},
            __onPrint: text => lines.push(text),
            __onSuccess: () => { void record(data.validateOutput?.(lines) ? 'Success' : 'Fail'); },
            __onError: () => { void record('Error'); },
        });
    };

    const handleReset = () => {
        setCode(data.buggyCode || data.initialCode || '');
        setResultStatus(null);
        if (clearOutput) clearOutput();
    };

    const handleHintRequest = () => {
        setHintsUsed(prev => prev + 1);
    };

    const lineCount = code.split('\n').length;

    return (
        <div className="stage-type-container debug-stage">
            {/* Instruction */}
            <div className="stage-type-instruction">
                <div className="stage-type-badge debug">
                    <i className="fas fa-bug"></i>
                    <span>DEBUG CHALLENGE</span>
                </div>
                <p className="stage-type-desc">
                    This code has <strong className="bug-count">{data.bugCount || '?'} bug{(data.bugCount || 0) > 1 ? 's' : ''}</strong>. 
                    Find and fix them!
                </p>
            </div>

            {/* Code Editor */}
            <div className="debug-editor">
                <div className="debug-editor-header">
                    <div className="debug-editor-tab">
                        <i className="fas fa-bug"></i>
                        <span>buggy_spell.py</span>
                    </div>
                    <div className="debug-bug-counter">
                        <i className="fas fa-crosshairs"></i>
                        {data.bugCount || '?'} bugs to fix
                    </div>
                </div>
                <div className="debug-code-area">
                    <div className="debug-line-numbers">
                        {Array.from({ length: Math.max(lineCount, 10) }, (_, i) => (
                            <span key={i}>{i + 1}</span>
                        ))}
                    </div>
                    <textarea
                        className="debug-code-textarea"
                        value={code}
                        readOnly={isRunning}
                        onChange={(e) => {
                            setCode(e.target.value);
                            setResultStatus(null);
                        }}
                        spellCheck="false"
                        placeholder="Fix the bugs in this code..."
                    />
                </div>
            </div>

            {/* Console */}
            <div className="debug-console">
                <div className="debug-console-header">
                    <i className="fas fa-terminal"></i>
                    <span>Console Output</span>
                    {resultStatus === 'success' && (
                        <span className="debug-status-badge success">
                            <i className="fas fa-check-circle"></i> All Bugs Fixed!
                        </span>
                    )}
                    {resultStatus === 'error' && (
                        <span className="debug-status-badge error">
                            <i className="fas fa-times-circle"></i> Error Found
                        </span>
                    )}
                </div>
                <div className="debug-console-body">
                    {output.length === 0 && (
                        <div className="debug-console-line waiting">Run code to test your fixes...</div>
                    )}
                    {output.map((line, i) => (
                        <div key={i} className={`debug-console-line ${line.startsWith('[ERROR]') ? 'error' : ''}`}>
                            {line}
                        </div>
                    ))}
                </div>
            </div>

            {/* Result Feedback */}
            {resultStatus === 'success' && (
                <div className="guided-feedback correct">
                    <i className="fas fa-check-circle"></i>
                    <span>{data.completeMessage || 'All bugs fixed! Well done!'}</span>
                </div>
            )}

            {/* Hints */}
            {attemptCount > 0 && resultStatus !== 'success' && (
                <HintPanel
                    hints={data.hints}
                    attemptCount={attemptCount}
                    onRequestHint={handleHintRequest}
                />
            )}

            {/* Actions */}
            <div className="stage-type-actions">
                <button className="stage-type-btn secondary" onClick={handleReset} disabled={isRunning}>
                    <i className="fas fa-redo"></i> Reset Code
                </button>
                <button
                    className="stage-type-btn primary"
                    onClick={handleRun}
                    disabled={isRunning || resultStatus === 'success'}
                >
                    {isRunning ? (
                        <><i className="fas fa-spinner fa-spin"></i> Running...</>
                    ) : (
                        <><i className="fas fa-play"></i> Run & Test</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DebugStage;
