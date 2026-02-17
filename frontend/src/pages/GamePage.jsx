import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePythonInterpreter from '../hooks/usePythonInterpreter';
import { useGame } from '../context/GameContext';
import CodeEditor from '../components/CodeEditor';
import GameVisualizer from '../components/GameVisualizer';

const LEVEL_DATA = {
  '1': {
    title: "The Prism of Light",
    objective: "Cast a spell to create pure RED light (255, 0, 0).",
    initialCode: "# Cast color(r, g, b)\nhero.cast_color(0, 0, 0)",
    hint: "Use hero.cast_color(red, green, blue). Max value is 255."
  },
  '2': {
    title: "The Matrix Search",
    objective: "Find the value 46 in the list and move to its index.",
    initialCode: "values = [10, 25, 46, 80]\n# Find index of 46\n# hero.move_to_x(index)",
    hint: "Loops or .index() might be useful here."
  }
};

const GamePage = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { updateProgress } = useGame();
  const { runCode, output, isRunning, wizardMessage, clearOutput } = usePythonInterpreter();
  
  const [code, setCode] = useState("");
  const [visualState, setVisualState] = useState({}); // { color: 'rgb(...)', foundIndex: -1 }

  // Load level data
  useEffect(() => {
    const data = LEVEL_DATA[levelId];
    if (data) {
      setCode(data.initialCode);
      setVisualState({});
      clearOutput();
    } else {
      navigate('/dashboard');
    }
  }, [levelId, navigate, clearOutput]);

  const handleLevelComplete = () => {
    // Play success sound/anim
    console.log("Level Complete!");
    updateProgress(parseInt(levelId));
    // Provide feedback delay before showing next button or navigating
  };

  const handleRun = () => {
    clearOutput();
    
    // Define Hero API callbacks
    const callbacks = {
      cast_color: (r, g, b) => {
        setVisualState(prev => ({ ...prev, color: `rgb(${r},${g},${b})` }));
        if (levelId === '1' && r === 255 && g === 0 && b === 0) {
          handleLevelComplete();
        }
      },
      move_to_x: (x) => {
        // Logic for Level 2
        // const targetIndex = 2; // Value 46 is at index 2 (Unused for now)

        // In python code user might pass value or index, let's assume index for simplicity or handle logic
        // For this specifically: "Find 46... move to index"
        // Let's assume input x is the index.
        if (levelId === '2') {
           if (x === 46) { // If they pass the value by mistake
             // Maybe hint them?
           }
        }
      },
      say: (msg) => {
        console.log("Hero said:", msg);
      }
    };

    runCode(code, callbacks);
  };

  const currentLevel = LEVEL_DATA[levelId] || {};

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0d1117', color: '#fff' }}>
      {/* Header */}
      <div style={{ padding: '15px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>LEVEL {levelId}: {currentLevel.title}</h2>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid #555', color: '#fff', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
          EXIT
        </button>
      </div>

      <div style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px', overflow: 'hidden' }}>
        {/* Left: Visuals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           <GameVisualizer levelId={levelId} visuals={{ ...visualState, wizardMessage }} />
           
           <div className="console" style={{ height: '150px', background: '#000', border: '1px solid #333', borderRadius: '8px', padding: '10px', fontFamily: 'monospace', overflowY: 'auto', fontSize: '0.9rem' }}>
              <div style={{ color: '#888', marginBottom: '5px' }}>&gt; System Ready...</div>
              {output.map((line, i) => (
                <div key={i} style={{ color: line.startsWith('[ERROR]') ? '#ff5f56' : '#fff' }}>&gt; {line}</div>
              ))}
           </div>
        </div>

        {/* Right: Code */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
           <div style={{ background: '#161b22', padding: '15px', borderRadius: '8px 8px 0 0', border: '1px solid #333', borderBottom: 'none' }}>
             <h4 style={{ margin: '0 0 10px 0', color: '#27c93f' }}>OBJECTIVE</h4>
             <p style={{ margin: 0, fontSize: '0.9rem', color: '#e6edf3' }}>{currentLevel.objective}</p>
             <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#8b949e', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px' }}>
               💡 HINT: {currentLevel.hint}
             </div>
           </div>
           <CodeEditor code={code} setCode={setCode} onRun={handleRun} isRunning={isRunning} />
        </div>
      </div>
    </div>
  );
};


export default GamePage;
