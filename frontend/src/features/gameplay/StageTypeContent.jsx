import GuidedStage from './GuidedStage';
import DebugStage from './DebugStage';
import PuzzleStage from './PuzzleStage';

export default function StageTypeContent({ stageType, currentStage, stageKey, onAttempt, runCode, output, clearOutput }) {
    switch (stageType) {
        case 'guided':
            return <GuidedStage data={currentStage} key={stageKey} onAttempt={onAttempt} runCode={runCode} />;
        case 'debug':
            return <DebugStage data={currentStage} key={stageKey} onAttempt={onAttempt} runCode={runCode} output={output} clearOutput={clearOutput} />;
        case 'puzzle':
            return <PuzzleStage data={currentStage} key={stageKey} onAttempt={onAttempt} />;
        default:
            return null;
    }
}
