import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CharacterDemo.css';

// All 12 poses with metadata
const POSES = [
  // Row 1 (top)
  { id: 'idle',         name: 'ยืนนิ่ง',       nameEn: 'Idle',           emoji: '🧍', dialogue: 'ข้ากำลังรอคำสั่ง...', group: 'emotion' },
  { id: 'alert',        name: 'ตั้งการ์ด',      nameEn: 'Alert',          emoji: '⚡', dialogue: 'มีอะไรอยู่ข้างหน้า... ระวังไว้!', group: 'emotion' },
  { id: 'cast-orb',     name: 'ถือลูกแก้ว',     nameEn: 'Cast Orb',       emoji: '🔮', dialogue: 'พลังวิเศษ... รวมตัวมา!', group: 'emotion' },
  { id: 'cast-spell',   name: 'เสกคาถา',       nameEn: 'Cast Spell',     emoji: '✨', dialogue: 'รับไปซะ! Chromatic Burst!', group: 'emotion' },
  { id: 'celebrate',    name: 'ดีใจ',          nameEn: 'Celebrate',      emoji: '🎉', dialogue: 'เย้! ผ่านด่านแล้ว!', group: 'emotion' },
  { id: 'victory',      name: 'ชนะ',           nameEn: 'Victory',        emoji: '🏆', dialogue: 'The Lost Spectrum is restored!', group: 'emotion' },
  // Row 2 (bottom)
  { id: 'hold-staff',    name: 'ถือไม้เท้า',    nameEn: 'Hold Staff',     emoji: '🪄', dialogue: 'ไม้เท้าแห่งแสงสี... จะนำทางเรา', group: 'action' },
  { id: 'magic-channel', name: 'รวมพลัง',       nameEn: 'Channel Magic',  emoji: '💫', dialogue: '集中... พลังสีกำลังรวมตัว...', group: 'action' },
  { id: 'point',         name: 'ชี้ทาง',        nameEn: 'Point',          emoji: '👉', dialogue: 'ไปทางนั้น! ข้าเห็นแสงสีรุ้งแล้ว!', group: 'action' },
  { id: 'think',         name: 'คิด',           nameEn: 'Think',          emoji: '🤔', dialogue: 'ฮืม... ต้องแก้โค้ดตรงนี้ยังไงดีนะ...', group: 'action' },
  { id: 'confused',      name: 'งง',            nameEn: 'Confused',       emoji: '😵', dialogue: 'เอ๊ะ!? ทำไมมันเป็น Error ล่ะ?', group: 'action' },
  { id: 'staff-display', name: 'โชว์ไม้เท้า',   nameEn: 'Staff Display',  emoji: '⚔️', dialogue: 'อาวุธนี้คือ "คีย์บอร์ด" แห่งอำนาจ!', group: 'action' },
];

const STORAGE_KEY = 'wizard-sprite-crops';
const SPRITE_SRC = '/wizard-sprites.png';
// Natural image dimensions
const NAT_W = 661;
const NAT_H = 377;

// Load saved crops from localStorage (natural pixel coords)
function loadCrops() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return null;
}

// Animation class per pose
const ANIM_CLASS = {
  'idle': 'anim-breathe',
  'alert': 'anim-alert',
  'cast-orb': 'anim-cast',
  'cast-spell': 'anim-cast',
  'celebrate': 'anim-celebrate',
  'victory': 'anim-celebrate',
  'hold-staff': 'anim-staff',
  'magic-channel': 'anim-cast',
  'point': 'anim-point',
  'think': 'anim-think',
  'confused': 'anim-confused',
  'staff-display': 'anim-staff',
};

export default function CharacterDemo() {
  const [currentPose, setCurrentPose] = useState('idle');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(2000);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [crops, setCrops] = useState(null);
  const autoPlayRef = useRef(null);
  const poseIndexRef = useRef(0);

  // Load crops from localStorage on mount and listen for changes
  useEffect(() => {
    setCrops(loadCrops());
    
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setCrops(loadCrops());
      }
    };
    window.addEventListener('storage', handleStorage);
    
    // Also poll for same-tab updates
    const interval = setInterval(() => {
      setCrops(loadCrops());
    }, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const currentPoseData = POSES.find(p => p.id === currentPose) || POSES[0];

  const getStageClass = () => {
    if (['cast-orb', 'cast-spell', 'magic-channel'].includes(currentPose)) return 'casting';
    if (['celebrate', 'victory'].includes(currentPose)) return 'celebrating';
    return '';
  };

  const changePose = useCallback((poseId) => {
    if (poseId === currentPose) return;
    setIsTransitioning(true);
    setCurrentPose(poseId);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [currentPose]);

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        poseIndexRef.current = (poseIndexRef.current + 1) % POSES.length;
        changePose(POSES[poseIndexRef.current].id);
      }, autoPlaySpeed);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, autoPlaySpeed, changePose]);

  useEffect(() => {
    const idx = POSES.findIndex(p => p.id === currentPose);
    if (idx !== -1) poseIndexRef.current = idx;
  }, [currentPose]);

  // Build sprite style from crop data
  const getSpriteStyle = () => {
    const crop = crops?.[currentPose];
    if (!crop) {
      // Fallback: use CSS class-based positions
      return {};
    }

    // Display the cropped area at a fixed display size
    const displayH = 230;
    const scale = displayH / crop.h;
    const displayW = crop.w * scale;

    return {
      width: `${displayW}px`,
      height: `${displayH}px`,
      backgroundImage: `url(${SPRITE_SRC})`,
      backgroundPosition: `-${crop.x * scale}px -${crop.y * scale}px`,
      backgroundSize: `${NAT_W * scale}px ${NAT_H * scale}px`,
      backgroundRepeat: 'no-repeat',
    };
  };

  const hasCropData = crops && crops[currentPose];
  const spriteStyle = getSpriteStyle();
  const animClass = ANIM_CLASS[currentPose] || 'anim-breathe';

  const emotionPoses = POSES.filter(p => p.group === 'emotion');
  const actionPoses = POSES.filter(p => p.group === 'action');

  return (
    <div className="character-demo-container">
      <h1 className="demo-title">✦ Wizard Lumina ✦</h1>
      <p className="demo-subtitle">
        Sprite Animation System — 12 ท่าทางจากภาพจริง
        {!crops && (
          <span style={{ display: 'block', marginTop: 6, color: 'rgba(255,200,100,0.7)', fontSize: '0.8rem' }}>
            ⚠️ ยังไม่ได้ crop — <a href="/sprite-editor" style={{ color: '#64b5f6' }}>เปิด Sprite Editor</a> เพื่อปรับ crop แต่ละท่า
          </span>
        )}
      </p>

      <div className="showcase-area">
        {/* Character Stage */}
        <div className={`character-stage ${getStageClass()}`}>
          <div className="magic-particles">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>

          {/* Sprite display: use crop data if available, else fallback to CSS class */}
          <div
            className={`sprite-display ${!hasCropData ? `pose-${currentPose}` : ''} ${animClass} ${isTransitioning ? 'transitioning' : ''}`}
            style={hasCropData ? spriteStyle : {}}
            onClick={() => {
              const idx = POSES.findIndex(p => p.id === currentPose);
              const next = (idx + 1) % POSES.length;
              changePose(POSES[next].id);
            }}
            title="คลิกเพื่อเปลี่ยนท่า"
          />
        </div>

        {/* Pose name */}
        <div className="pose-name-label">
          <span className="pose-emoji">{currentPoseData.emoji}</span>
          {currentPoseData.nameEn} — {currentPoseData.name}
        </div>

        {/* Dialogue */}
        <div className="dialogue-box">
          {currentPoseData.dialogue}
        </div>

        {/* Controls */}
        <div className="controls-panel">
          <div className="controls-section">
            <div className="controls-section-title">Emotions & Magic</div>
            <div className="controls-grid">
              {emotionPoses.map(pose => (
                <button
                  key={pose.id}
                  className={`pose-btn ${currentPose === pose.id ? 'active' : ''}`}
                  onClick={() => { setIsAutoPlaying(false); changePose(pose.id); }}
                >
                  <span className="btn-emoji">{pose.emoji}</span>
                  {pose.name}
                </button>
              ))}
            </div>
          </div>

          <div className="controls-section">
            <div className="controls-section-title">Actions & Reactions</div>
            <div className="controls-grid">
              {actionPoses.map(pose => (
                <button
                  key={pose.id}
                  className={`pose-btn ${currentPose === pose.id ? 'active' : ''}`}
                  onClick={() => { setIsAutoPlaying(false); changePose(pose.id); }}
                >
                  <span className="btn-emoji">{pose.emoji}</span>
                  {pose.name}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-play & Editor Link */}
          <div className="autoplay-controls">
            <button
              className={`autoplay-btn ${isAutoPlaying ? 'playing' : ''}`}
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            >
              {isAutoPlaying ? '⏹ หยุด Auto-play' : '▶ Auto-play ทุกท่า'}
            </button>
            <div className="speed-control">
              <span>เร็ว</span>
              <input
                type="range"
                min="500"
                max="4000"
                step="250"
                value={autoPlaySpeed}
                onChange={e => setAutoPlaySpeed(Number(e.target.value))}
              />
              <span>ช้า</span>
            </div>
          </div>

          {/* Link to Sprite Editor */}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <a
              href="/sprite-editor"
              style={{
                color: '#ffd700',
                fontSize: '0.85rem',
                textDecoration: 'none',
                padding: '8px 20px',
                border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: '10px',
                display: 'inline-block',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.background = 'rgba(255,215,0,0.1)'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; }}
            >
              🎨 เปิด Sprite Crop Editor
            </a>
          </div>
        </div>
      </div>

      <div className="back-link">
        <a href="/">← กลับหน้าหลัก</a>
      </div>
    </div>
  );
}
