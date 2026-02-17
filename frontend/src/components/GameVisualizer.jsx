import React from 'react';

const GameVisualizer = ({ levelId, visuals }) => {
  return (
    <div className="visual-panel" style={{ 
      background: '#000', 
      flexGrow: 1, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '12px',
      border: '2px solid #333'
    }}>
      {/* Level 1: Red Channel */}
      {levelId === '1' && (
        <div style={{
          width: '200px',
          height: '200px',
          backgroundColor: visuals.color || 'rgb(0,0,0)',
          border: '4px solid #fff',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
          transition: 'background-color 0.5s ease'
        }}>
           <div style={{ color: '#fff', textAlign: 'center', marginTop: '210px' }}>
             {visuals.color || 'RGB(0,0,0)'}
           </div>
        </div>
      )}

      {/* Level 2: Matrix */}
      {levelId === '2' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {[10, 25, 46, 80].map((val, idx) => (
             <div key={val} style={{
               padding: '20px',
               background: visuals.foundIndex === idx ? '#9333ea' : 'rgba(255,255,255,0.1)',
               color: '#fff',
               border: '1px solid #444',
               borderRadius: '8px'
             }}>
               {idx}: [{val}]
             </div>
          ))}
        </div>
      )}

      {/* Wizard Overlay */}
      {visuals.wizardMessage && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          background: '#fff',
          color: '#000',
          padding: '10px 15px',
          borderRadius: '15px',
          borderBottomLeftRadius: '0',
          maxWidth: '200px',
          animation: 'popIn 0.3s ease'
        }}>
          🧙‍♂️ {visuals.wizardMessage}
        </div>
      )}
    </div>
  );
};

export default GameVisualizer;
