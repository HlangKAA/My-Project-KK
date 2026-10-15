import React, { useState, useRef, useEffect, useCallback } from 'react';
import './SpriteEditor.css';

// Pose definitions
const POSES = [
  { id: 'idle',          name: 'ยืนนิ่ง',      emoji: '🧍' },
  { id: 'alert',         name: 'ตั้งการ์ด',    emoji: '⚡' },
  { id: 'cast-orb',      name: 'ถือลูกแก้ว',   emoji: '🔮' },
  { id: 'cast-spell',    name: 'เสกคาถา',     emoji: '✨' },
  { id: 'celebrate',     name: 'ดีใจ',        emoji: '🎉' },
  { id: 'victory',       name: 'ชนะ',         emoji: '🏆' },
  { id: 'hold-staff',    name: 'ถือไม้เท้า',  emoji: '🪄' },
  { id: 'magic-channel', name: 'รวมพลัง',     emoji: '💫' },
  { id: 'point',         name: 'ชี้ทาง',      emoji: '👉' },
  { id: 'think',         name: 'คิด',         emoji: '🤔' },
  { id: 'confused',      name: 'งง',          emoji: '😵' },
  { id: 'staff-display', name: 'โชว์ไม้เท้า', emoji: '⚔️' },
];

const STORAGE_KEY = 'wizard-sprite-crops';
const SPRITE_SRC = '/wizard-sprites.png';

// Load saved crops from localStorage
function loadCrops() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return {};
}

// Save crops to localStorage
function saveCrops(crops) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(crops));
}

export default function SpriteEditor() {
  const [selectedPose, setSelectedPose] = useState(0);
  const [crops, setCrops] = useState(loadCrops);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 }); // displayed image size
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 }); // actual image size
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null); // 'move' | 'resize-XX'
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropStart, setCropStart] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [statusMsg, setStatusMsg] = useState(null);

  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const pose = POSES[selectedPose];
  const cropKey = pose.id;

  // Current crop rect (in displayed pixels)
  const currentCrop = crops[cropKey] || null;

  // Scale factor between displayed and natural image size
  const scaleX = naturalSize.w > 0 ? imgSize.w / naturalSize.w : 1;
  const scaleY = naturalSize.h > 0 ? imgSize.h / naturalSize.h : 1;

  // On image load
  const handleImageLoad = useCallback((e) => {
    const img = e.target;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    setImgSize({ w: img.clientWidth, h: img.clientHeight });
  }, []);

  // Update displayed size on window resize
  useEffect(() => {
    const handleResize = () => {
      if (imgRef.current) {
        setImgSize({
          w: imgRef.current.clientWidth,
          h: imgRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get mouse position relative to canvas
  const getRelPos = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(e.clientX - rect.left, imgSize.w)),
      y: Math.max(0, Math.min(e.clientY - rect.top, imgSize.h)),
    };
  }, [imgSize]);

  // Start drawing/dragging
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    const pos = getRelPos(e);

    if (currentCrop) {
      // Check if clicking on resize handles
      const c = currentCrop;
      const handleSize = 12;
      const handles = [
        { name: 'top-left', x: c.x, y: c.y },
        { name: 'top-right', x: c.x + c.w, y: c.y },
        { name: 'bottom-left', x: c.x, y: c.y + c.h },
        { name: 'bottom-right', x: c.x + c.w, y: c.y + c.h },
        { name: 'top-mid', x: c.x + c.w / 2, y: c.y },
        { name: 'bottom-mid', x: c.x + c.w / 2, y: c.y + c.h },
        { name: 'left-mid', x: c.x, y: c.y + c.h / 2 },
        { name: 'right-mid', x: c.x + c.w, y: c.y + c.h / 2 },
      ];

      for (const h of handles) {
        if (Math.abs(pos.x - h.x) < handleSize && Math.abs(pos.y - h.y) < handleSize) {
          setIsDragging(true);
          setDragMode(`resize-${h.name}`);
          setDragStart(pos);
          setCropStart({ ...c });
          return;
        }
      }

      // Check if clicking inside crop box (move)
      if (pos.x >= c.x && pos.x <= c.x + c.w && pos.y >= c.y && pos.y <= c.y + c.h) {
        setIsDragging(true);
        setDragMode('move');
        setDragStart(pos);
        setCropStart({ ...c });
        return;
      }
    }

    // Start new crop
    setIsDragging(true);
    setDragMode('new');
    setDragStart(pos);
    setCropStart({ x: pos.x, y: pos.y, w: 0, h: 0 });
    setCrops(prev => ({
      ...prev,
      [cropKey]: { x: pos.x, y: pos.y, w: 0, h: 0 },
    }));
  }, [currentCrop, cropKey, getRelPos]);

  // Mouse move
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const pos = getRelPos(e);
    const dx = pos.x - dragStart.x;
    const dy = pos.y - dragStart.y;

    setCrops(prev => {
      let newCrop;

      if (dragMode === 'new') {
        const x = Math.min(dragStart.x, pos.x);
        const y = Math.min(dragStart.y, pos.y);
        const w = Math.abs(pos.x - dragStart.x);
        const h = Math.abs(pos.y - dragStart.y);
        newCrop = { x, y, w, h };
      } else if (dragMode === 'move') {
        let nx = cropStart.x + dx;
        let ny = cropStart.y + dy;
        // Clamp
        nx = Math.max(0, Math.min(nx, imgSize.w - cropStart.w));
        ny = Math.max(0, Math.min(ny, imgSize.h - cropStart.h));
        newCrop = { x: nx, y: ny, w: cropStart.w, h: cropStart.h };
      } else if (dragMode?.startsWith('resize-')) {
        const handle = dragMode.replace('resize-', '');
        let { x, y, w, h } = cropStart;

        if (handle.includes('right')) { w = Math.max(10, cropStart.w + dx); }
        if (handle.includes('left')) { x = cropStart.x + dx; w = Math.max(10, cropStart.w - dx); }
        if (handle.includes('bottom')) { h = Math.max(10, cropStart.h + dy); }
        if (handle.includes('top')) { y = cropStart.y + dy; h = Math.max(10, cropStart.h - dy); }

        // Handle mid-edge (only resize one axis)
        if (handle === 'top-mid') { y = cropStart.y + dy; h = Math.max(10, cropStart.h - dy); }
        if (handle === 'bottom-mid') { h = Math.max(10, cropStart.h + dy); }
        if (handle === 'left-mid') { x = cropStart.x + dx; w = Math.max(10, cropStart.w - dx); }
        if (handle === 'right-mid') { w = Math.max(10, cropStart.w + dx); }

        // Clamp
        x = Math.max(0, x);
        y = Math.max(0, y);
        if (x + w > imgSize.w) w = imgSize.w - x;
        if (y + h > imgSize.h) h = imgSize.h - y;

        newCrop = { x, y, w, h };
      }

      return { ...prev, [cropKey]: newCrop };
    });
  }, [isDragging, dragMode, dragStart, cropStart, cropKey, imgSize, getRelPos]);

  // Mouse up
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragMode(null);
      // Save to localStorage whenever crop changes
      setTimeout(() => {
        setCrops(prev => {
          saveCrops(prev);
          return prev;
        });
      }, 0);
    }
  }, [isDragging]);

  // Bind global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Convert displayed crop to natural coordinates
  const getNaturalCrop = (crop) => {
    if (!crop || naturalSize.w === 0) return null;
    return {
      x: Math.round(crop.x / scaleX),
      y: Math.round(crop.y / scaleY),
      w: Math.round(crop.w / scaleX),
      h: Math.round(crop.h / scaleY),
    };
  };

  // Update crop from input fields (natural coordinates)
  const handleInputChange = (field, value) => {
    const num = parseInt(value) || 0;
    const natCrop = getNaturalCrop(currentCrop) || { x: 0, y: 0, w: 100, h: 100 };
    natCrop[field] = num;
    // Convert back to displayed
    setCrops(prev => {
      const updated = {
        ...prev,
        [cropKey]: {
          x: natCrop.x * scaleX,
          y: natCrop.y * scaleY,
          w: natCrop.w * scaleX,
          h: natCrop.h * scaleY,
        },
      };
      saveCrops(updated);
      return updated;
    });
  };

  // Apply crops to CharacterDemo
  const handleApply = () => {
    saveCrops(crops);
    setStatusMsg({ type: 'success', text: '✅ บันทึกค่า crop ทั้งหมดแล้ว! กลับไปหน้า Demo เพื่อดูผลลัพธ์' });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Export JSON
  const handleExport = () => {
    const naturalCrops = {};
    for (const [key, crop] of Object.entries(crops)) {
      naturalCrops[key] = getNaturalCrop(crop);
    }
    const json = JSON.stringify(naturalCrops, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setStatusMsg({ type: 'info', text: '📋 คัดลอก JSON ไปยัง Clipboard แล้ว!' });
      setTimeout(() => setStatusMsg(null), 3000);
    }).catch(() => {
      // Fallback: show in console
      console.log('Sprite Crops:', json);
      setStatusMsg({ type: 'info', text: '📋 ดูค่า crop ใน Console (F12)' });
      setTimeout(() => setStatusMsg(null), 3000);
    });
  };

  // Reset current pose
  const handleReset = () => {
    setCrops(prev => {
      const updated = { ...prev };
      delete updated[cropKey];
      saveCrops(updated);
      return updated;
    });
  };

  const croppedCount = Object.keys(crops).length;
  const natCrop = getNaturalCrop(currentCrop);

  return (
    <div className="sprite-editor-container">
      <div className="editor-header">
        <h1>🎨 Sprite Crop Editor</h1>
        <p>ลากกรอบเพื่อ crop ตัวละครแต่ละท่า — ค่าจะถูกบันทึกอัตโนมัติ</p>
        <div className="crop-progress">
          <span>{croppedCount}/{POSES.length} ท่า</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(croppedCount / POSES.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="editor-main">
        {/* Left: Canvas */}
        <div className="editor-canvas-panel">
          <div
            ref={canvasRef}
            className="canvas-wrapper"
            onMouseDown={handleMouseDown}
          >
            <img
              ref={imgRef}
              src={SPRITE_SRC}
              alt="Wizard Sprite Sheet"
              onLoad={handleImageLoad}
              draggable={false}
            />

            {/* Crop box */}
            {currentCrop && currentCrop.w > 0 && currentCrop.h > 0 && (
              <div
                className="crop-box"
                style={{
                  left: currentCrop.x,
                  top: currentCrop.y,
                  width: currentCrop.w,
                  height: currentCrop.h,
                }}
              >
                {/* Resize handles */}
                <div className="crop-handle top-left" />
                <div className="crop-handle top-right" />
                <div className="crop-handle bottom-left" />
                <div className="crop-handle bottom-right" />
                <div className="crop-handle top-mid" />
                <div className="crop-handle bottom-mid" />
                <div className="crop-handle left-mid" />
                <div className="crop-handle right-mid" />

                {/* Size label */}
                <div className="crop-size-label">
                  {natCrop ? `${natCrop.w} × ${natCrop.h}` : ''}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="editor-right-panel">
          {/* Pose Selector */}
          <div className="pose-selector">
            <h3>เลือกท่า ({selectedPose + 1}/12)</h3>
            <div className="pose-selector-grid">
              {POSES.map((p, idx) => (
                <button
                  key={p.id}
                  className={`pose-select-btn ${idx === selectedPose ? 'active' : ''} ${crops[p.id] ? 'has-crop' : ''}`}
                  onClick={() => setSelectedPose(idx)}
                >
                  <span className="pose-select-emoji">{p.emoji}</span>
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="preview-panel">
            <h3>Preview: {pose.emoji} {pose.name}</h3>
            <div className="preview-box">
              {natCrop ? (
                <div
                  className="preview-sprite"
                  style={{
                    width: natCrop.w,
                    height: natCrop.h,
                    backgroundImage: `url(${SPRITE_SRC})`,
                    backgroundPosition: `-${natCrop.x}px -${natCrop.y}px`,
                    backgroundSize: `${naturalSize.w}px ${naturalSize.h}px`,
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
                  ลาก crop บนรูปด้านซ้าย
                </span>
              )}
              <span className="preview-dark-label">dark bg</span>
            </div>
          </div>

          {/* Values */}
          <div className="values-panel">
            <h3>ค่า Crop (pixels จริง)</h3>
            <div className="values-grid">
              <div className="value-field">
                <label>X</label>
                <input
                  type="number"
                  value={natCrop?.x ?? ''}
                  onChange={e => handleInputChange('x', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="value-field">
                <label>Y</label>
                <input
                  type="number"
                  value={natCrop?.y ?? ''}
                  onChange={e => handleInputChange('y', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="value-field">
                <label>Width</label>
                <input
                  type="number"
                  value={natCrop?.w ?? ''}
                  onChange={e => handleInputChange('w', e.target.value)}
                  placeholder="100"
                />
              </div>
              <div className="value-field">
                <label>Height</label>
                <input
                  type="number"
                  value={natCrop?.h ?? ''}
                  onChange={e => handleInputChange('h', e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="editor-actions">
            <button className="action-btn primary" onClick={handleApply}>
              💾 บันทึก & ใช้กับ Demo
            </button>
            <button className="action-btn secondary" onClick={handleExport}>
              📋 Export JSON
            </button>
            <button className="action-btn danger" onClick={handleReset}>
              🗑️ ล้าง crop ท่านี้
            </button>
          </div>

          {/* Status */}
          {statusMsg && (
            <div className={`status-message ${statusMsg.type}`}>
              {statusMsg.text}
            </div>
          )}
        </div>
      </div>

      <div className="editor-back-link">
        <a href="/demo-characters">← กลับหน้า Character Demo</a>
        {' | '}
        <a href="/">← กลับหน้าหลัก</a>
      </div>
    </div>
  );
}
