import React, { useState } from 'react';
import HintPanel from './HintPanel';
import './stagetypes.css';

/**
 * PuzzleStage — Multiple choice quiz / knowledge check
 * แสดงคำถามหลายข้อ ผู้เล่นต้องตอบถูกอย่างน้อย requiredCorrect ข้อ
 */
const PuzzleStage = ({ data, onAttempt }) => {
    const puzzles = data.puzzles || [];
    const requiredCorrect = data.requiredCorrect || puzzles.length;

    const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submittedAnswers, setSubmittedAnswers] = useState({});
    const [showExplanation, setShowExplanation] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const currentPuzzle = puzzles[currentPuzzleIdx];
    const totalCorrect = Object.values(submittedAnswers).filter(v => v === true).length;
    const totalAnswered = Object.keys(submittedAnswers).length;
    const allAnswered = totalAnswered === puzzles.length;

    const handleSelect = (choiceIdx) => {
        if (submittedAnswers[currentPuzzleIdx] !== undefined) return; // already submitted
        setSelectedAnswers(prev => ({ ...prev, [currentPuzzleIdx]: choiceIdx }));
    };

    const handleSubmitAnswer = async () => {
        if (selectedAnswers[currentPuzzleIdx] === undefined) return;

        setAttemptCount(prev => prev + 1);
        const isCorrect = selectedAnswers[currentPuzzleIdx] === currentPuzzle.correctIndex;
        setSubmittedAnswers(prev => ({ ...prev, [currentPuzzleIdx]: isCorrect }));
        setShowExplanation(true);
        if (!isCorrect) {
            await onAttempt({ code: JSON.stringify({ type: 'quiz', question: currentPuzzleIdx, answer: selectedAnswers[currentPuzzleIdx] }),
                result: 'Fail', runtime: 0, submitted_at: new Date().toISOString() }, { attempts: attemptCount + 1, hintsUsed });
        }
    };

    const handleNextPuzzle = () => {
        setShowExplanation(false);
        if (currentPuzzleIdx < puzzles.length - 1) {
            setCurrentPuzzleIdx(prev => prev + 1);
        }
    };

    const handleFinish = async () => {
        if (totalCorrect >= requiredCorrect) {
            const saved = await onAttempt({
                code: JSON.stringify({ type: 'quiz', answers: selectedAnswers }),
                result: 'Success', runtime: 0, submitted_at: new Date().toISOString(),
            }, { attempts: attemptCount, hintsUsed, correctCount: totalCorrect, totalCount: puzzles.length });
            if (saved) setIsComplete(true);
        }
    };

    const handleHintRequest = () => {
        setHintsUsed(prev => prev + 1);
    };

    if (isComplete) {
        return (
            <div className="stage-type-container puzzle-stage">
                <div className="puzzle-complete">
                    <i className="fas fa-check-circle"></i>
                    <h3>Puzzle Complete!</h3>
                    <p>{data.completeMessage || `You got ${totalCorrect} out of ${puzzles.length} correct!`}</p>
                    <div className="puzzle-score">
                        <span className="puzzle-score-num">{totalCorrect}</span>
                        <span className="puzzle-score-sep">/</span>
                        <span className="puzzle-score-den">{puzzles.length}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="stage-type-container puzzle-stage">
            {/* Instruction */}
            <div className="stage-type-instruction">
                <div className="stage-type-badge puzzle">
                    <i className="fas fa-puzzle-piece"></i>
                    <span>KNOWLEDGE PUZZLE</span>
                </div>
                <p className="stage-type-desc">
                    Answer at least <strong>{requiredCorrect}</strong> out of <strong>{puzzles.length}</strong> questions correctly.
                </p>
            </div>

            {/* Progress */}
            <div className="puzzle-progress">
                {puzzles.map((_, i) => (
                    <div
                        key={i}
                        className={`puzzle-progress-dot ${
                            i === currentPuzzleIdx ? 'current' : ''
                        } ${
                            submittedAnswers[i] === true ? 'correct' :
                            submittedAnswers[i] === false ? 'wrong' : ''
                        }`}
                        onClick={() => {
                            if (!showExplanation) {
                                setCurrentPuzzleIdx(i);
                            }
                        }}
                    >
                        {submittedAnswers[i] === true && <i className="fas fa-check"></i>}
                        {submittedAnswers[i] === false && <i className="fas fa-times"></i>}
                        {submittedAnswers[i] === undefined && <span>{i + 1}</span>}
                    </div>
                ))}
            </div>

            {/* Question */}
            <div className="puzzle-question-card">
                <div className="puzzle-question-number">
                    Question {currentPuzzleIdx + 1} of {puzzles.length}
                </div>
                <h3 className="puzzle-question-text">{currentPuzzle.question}</h3>

                {/* Choices */}
                <div className="puzzle-choices">
                    {currentPuzzle.choices.map((choice, i) => {
                        const isSelected = selectedAnswers[currentPuzzleIdx] === i;
                        const isSubmitted = submittedAnswers[currentPuzzleIdx] !== undefined;
                        const isCorrectChoice = i === currentPuzzle.correctIndex;

                        let choiceClass = 'puzzle-choice';
                        if (isSelected) choiceClass += ' selected';
                        if (isSubmitted && isCorrectChoice) choiceClass += ' correct';
                        if (isSubmitted && isSelected && !isCorrectChoice) choiceClass += ' wrong';

                        return (
                            <button
                                key={i}
                                className={choiceClass}
                                onClick={() => handleSelect(i)}
                                disabled={isSubmitted}
                            >
                                <span className="puzzle-choice-letter">
                                    {String.fromCharCode(65 + i)}
                                </span>
                                <span className="puzzle-choice-text">
                                    <code>{choice}</code>
                                </span>
                                {isSubmitted && isCorrectChoice && (
                                    <i className="fas fa-check-circle puzzle-choice-icon correct"></i>
                                )}
                                {isSubmitted && isSelected && !isCorrectChoice && (
                                    <i className="fas fa-times-circle puzzle-choice-icon wrong"></i>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Explanation */}
                {showExplanation && (
                    <div className={`puzzle-explanation ${submittedAnswers[currentPuzzleIdx] ? 'correct' : 'wrong'}`}>
                        <i className={`fas ${submittedAnswers[currentPuzzleIdx] ? 'fa-check-circle' : 'fa-info-circle'}`}></i>
                        <p>{currentPuzzle.explanation}</p>
                    </div>
                )}
            </div>

            {/* Score */}
            <div className="puzzle-score-bar">
                <span>Score: {totalCorrect} / {requiredCorrect} needed</span>
                <div className="puzzle-score-fill" style={{ width: `${(totalCorrect / requiredCorrect) * 100}%` }}></div>
            </div>

            {/* Hints */}
            {attemptCount > 1 && !showExplanation && submittedAnswers[currentPuzzleIdx] === undefined && (
                <HintPanel
                    hints={data.hints}
                    attemptCount={attemptCount}
                    onRequestHint={handleHintRequest}
                />
            )}

            {/* Actions */}
            <div className="stage-type-actions">
                {!showExplanation && submittedAnswers[currentPuzzleIdx] === undefined && (
                    <button
                        className="stage-type-btn primary"
                        onClick={handleSubmitAnswer}
                        disabled={selectedAnswers[currentPuzzleIdx] === undefined}
                    >
                        <i className="fas fa-check"></i> Submit Answer
                    </button>
                )}
                {showExplanation && currentPuzzleIdx < puzzles.length - 1 && (
                    <button className="stage-type-btn primary" onClick={handleNextPuzzle}>
                        Next Question <i className="fas fa-arrow-right"></i>
                    </button>
                )}
                {allAnswered && totalCorrect >= requiredCorrect && (
                    <button className="stage-type-btn primary success" onClick={handleFinish}>
                        <i className="fas fa-trophy"></i> Complete Puzzle!
                    </button>
                )}
                {allAnswered && totalCorrect < requiredCorrect && (
                    <div className="guided-feedback wrong">
                        <i className="fas fa-redo"></i>
                        <span>Not enough correct answers. Review and try the ones you missed!</span>
                        <button onClick={() => { setSubmittedAnswers({}); setSelectedAnswers({}); setCurrentPuzzleIdx(0); setShowExplanation(false); }}>Try again</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PuzzleStage;
