import React, { useState, useCallback } from 'react';
import HintPanel from './HintPanel';
import './stagetypes.css';

/**
 * GuidedStage — Fill-in-the-blank coding exercise
 * ผู้เล่นเติม code ในช่องว่าง (___BLANK_N___) ตาม template
 */
const GuidedStage = ({ data, onComplete, runCode }) => {
    const [blankValues, setBlankValues] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [blankResults, setBlankResults] = useState({});
    const [attemptCount, setAttemptCount] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [output, setOutput] = useState([]);
    const [allCorrect, setAllCorrect] = useState(false);

    const blanks = data.blanks || [];
    const template = data.codeTemplate || '';

    // Build the actual code by replacing blanks with user input
    const buildCode = useCallback(() => {
        let code = template;
        blanks.forEach(blank => {
            const value = blankValues[blank.id] || '';
            code = code.replace(`___${blank.id}___`, value);
        });
        return code;
    }, [template, blanks, blankValues]);

    const handleBlankChange = (blankId, value) => {
        setBlankValues(prev => ({ ...prev, [blankId]: value }));
        // Clear previous results when editing
        if (submitted) {
            setSubmitted(false);
            setBlankResults({});
        }
    };

    const handleSubmit = () => {
        setAttemptCount(prev => prev + 1);
        setSubmitted(true);

        // Check each blank
        const results = {};
        let correct = true;

        blanks.forEach(blank => {
            const userValue = (blankValues[blank.id] || '').trim();
            const isCorrect = blank.acceptableAnswers
                ? blank.acceptableAnswers.some(ans => ans.trim() === userValue)
                : userValue === blank.answer.trim();
            results[blank.id] = isCorrect;
            if (!isCorrect) correct = false;
        });

        setBlankResults(results);
        setAllCorrect(correct);

        if (correct) {
            // Run the code to show output
            const finalCode = buildCode();
            if (runCode) {
                setOutput([]);
                runCode(finalCode, {
                    cast_color: () => {},
                    move_to_x: () => {},
                    say: () => {},
                });
            }
            // Delay completion to let animation play
            setTimeout(() => {
                onComplete({
                    attempts: attemptCount + 1,
                    hintsUsed,
                });
            }, 1500);
        }
    };

    const handleHintRequest = () => {
        setHintsUsed(prev => prev + 1);
    };

    // Parse template into segments for rendering
    const renderTemplate = () => {
        const lines = template.split('\n');
        return lines.map((line, lineIdx) => {
            const parts = [];
            let remaining = line;
            let partIdx = 0;

            while (remaining.length > 0) {
                const match = remaining.match(/___([A-Z_0-9]+)___/);
                if (match) {
                    const before = remaining.slice(0, match.index);
                    if (before) {
                        parts.push(<span key={`${lineIdx}-${partIdx++}`} className="guided-code-text">{before}</span>);
                    }

                    const blankId = match[1];
                    const blank = blanks.find(b => b.id === blankId);
                    const isCorrect = blankResults[blankId];
                    const isWrong = submitted && blankResults[blankId] === false;

                    parts.push(
                        <span key={`${lineIdx}-${partIdx++}`} className="guided-blank-wrapper">
                            <input
                                type="text"
                                className={`guided-blank-input ${
                                    isCorrect === true ? 'correct' : 
                                    isWrong ? 'wrong' : ''
                                }`}
                                value={blankValues[blankId] || ''}
                                onChange={(e) => handleBlankChange(blankId, e.target.value)}
                                placeholder={blank?.hint || '???'}
                                spellCheck="false"
                                autoComplete="off"
                                disabled={allCorrect}
                            />
                            {isCorrect === true && <i className="fas fa-check guided-blank-check"></i>}
                            {isWrong && <i className="fas fa-times guided-blank-cross"></i>}
                        </span>
                    );

                    remaining = remaining.slice(match.index + match[0].length);
                } else {
                    parts.push(<span key={`${lineIdx}-${partIdx++}`} className="guided-code-text">{remaining}</span>);
                    break;
                }
            }

            return (
                <div key={lineIdx} className="guided-code-line">
                    <span className="guided-line-number">{lineIdx + 1}</span>
                    <div className="guided-line-content">{parts}</div>
                </div>
            );
        });
    };

    return (
        <div className="stage-type-container guided-stage">
            {/* Instruction */}
            <div className="stage-type-instruction">
                <div className="stage-type-badge guided">
                    <i className="fas fa-pencil-alt"></i>
                    <span>GUIDED EXERCISE</span>
                </div>
                {data.guidedInstruction && (
                    <p className="stage-type-desc" dangerouslySetInnerHTML={{ __html: data.guidedInstruction }} />
                )}
            </div>

            {/* Code Template */}
            <div className="guided-editor">
                <div className="guided-editor-header">
                    <i className="fas fa-code"></i>
                    <span>spell_cast.py</span>
                    <span className="guided-fill-count">
                        {Object.values(blankResults).filter(v => v === true).length} / {blanks.length} blanks filled
                    </span>
                </div>
                <div className="guided-editor-body">
                    {renderTemplate()}
                </div>
            </div>

            {/* Output */}
            {output.length > 0 && (
                <div className="guided-output">
                    <div className="guided-output-header">
                        <i className="fas fa-terminal"></i> Output
                    </div>
                    {output.map((line, i) => (
                        <div key={i} className="guided-output-line">{line}</div>
                    ))}
                </div>
            )}

            {/* Result Feedback */}
            {submitted && !allCorrect && (
                <div className="guided-feedback wrong">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>Some blanks are incorrect. Check the highlighted fields and try again!</span>
                </div>
            )}
            {allCorrect && (
                <div className="guided-feedback correct">
                    <i className="fas fa-check-circle"></i>
                    <span>{data.completeMessage || 'All blanks correct! Well done!'}</span>
                </div>
            )}

            {/* Hints */}
            {!allCorrect && attemptCount > 0 && (
                <HintPanel
                    hints={data.hints}
                    attemptCount={attemptCount}
                    onRequestHint={handleHintRequest}
                />
            )}

            {/* Submit Button */}
            {!allCorrect && (
                <div className="stage-type-actions">
                    <button className="stage-type-btn primary" onClick={handleSubmit}>
                        <i className="fas fa-check"></i> Check Answers
                    </button>
                </div>
            )}
        </div>
    );
};

export default GuidedStage;
