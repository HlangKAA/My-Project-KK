import React from 'react';

const CodeEditor = ({ code, setCode, onRun, isRunning }) => {
  return (
    <div className="code-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="ide-header" style={{ padding: '10px', background: '#333', color: '#fff' }}>
        <span>solution.py</span>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck="false"
        style={{
          flexGrow: 1,
          background: '#1e1e1e',
          color: '#d4d4d4',
          border: 'none',
          padding: '15px',
          fontFamily: 'Consolas, monospace',
          resize: 'none',
          outline: 'none'
        }}
      />
      <button 
        onClick={onRun} 
        disabled={isRunning}
        style={{
          padding: '15px',
          background: isRunning ? '#555' : '#27c93f',
          color: '#fff',
          border: 'none',
          cursor: isRunning ? 'not-allowed' : 'pointer',
          fontWeight: 'bold'
        }}
      >
        {isRunning ? "CASTING SPELL..." : "RUN CODE"}
      </button>
    </div>
  );
};

export default CodeEditor;
