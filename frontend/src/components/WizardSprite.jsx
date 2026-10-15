import React, { useState, useEffect, useCallback } from 'react';
import './WizardSprite.css';

/**
 * WizardSprite - Reusable wizard character component using real sprite sheet
 * 
 * Props:
 *   - state: 'idle' | 'casting' | 'success' | 'thinking' | 'alert' - character state
 *   - size: 'sm' | 'md' | 'lg' - display size (default: 'md')
 *   - showParticles: boolean - show magic particles (default: true)
 *   - showShadow: boolean - show ground shadow (default: true)
 *   - showGlow: boolean - show glow ring effect (default: true)
 *   - className: string - additional CSS classes
 */

const STORAGE_KEY = 'wizard-sprite-crops';
const SPRITE_SRC = '/wizard-sprites.png';
const NAT_W = 661;
const NAT_H = 377;

// Map game states to sprite poses and their animations
const STATE_CONFIG = {
  idle: {
    poses: ['idle'],
    animClass: 'ws-anim-idle',
    glowColor: 'rgba(100, 160, 255, 0.3)',
  },
  casting: {
    poses: ['cast-orb', 'cast-spell', 'magic-channel'],
    animClass: 'ws-anim-casting',
    glowColor: 'rgba(255, 150, 50, 0.5)',
    cycleSpeed: 400,
  },
  success: {
    poses: ['celebrate', 'victory'],
    animClass: 'ws-anim-success',
    glowColor: 'rgba(100, 255, 100, 0.4)',
    cycleSpeed: 500,
  },
  thinking: {
    poses: ['think'],
    animClass: 'ws-anim-thinking',
    glowColor: 'rgba(180, 140, 255, 0.3)',
  },
  alert: {
    poses: ['alert'],
    animClass: 'ws-anim-alert',
    glowColor: 'rgba(255, 80, 80, 0.4)',
  },
  pointing: {
    poses: ['point'],
    animClass: 'ws-anim-pointing',
    glowColor: 'rgba(100, 200, 255, 0.3)',
  },
  confused: {
    poses: ['confused'],
    animClass: 'ws-anim-confused',
    glowColor: 'rgba(255, 200, 50, 0.3)',
  },
  holdstaff: {
    poses: ['hold-staff'],
    animClass: 'ws-anim-staff',
    glowColor: 'rgba(200, 80, 50, 0.3)',
  },
  walking: {
    poses: ['idle'],
    animClass: 'ws-anim-walking',
    glowColor: 'rgba(100, 160, 255, 0.2)',
  },
};

// Fallback positions (used when no crop data exists)
const FALLBACK_POSITIONS = {
  'idle':          { x: 0, y: 0, w: 110, h: 188 },
  'alert':         { x: 110, y: 0, w: 110, h: 188 },
  'cast-orb':      { x: 220, y: 0, w: 110, h: 188 },
  'cast-spell':    { x: 330, y: 0, w: 110, h: 188 },
  'celebrate':     { x: 440, y: 0, w: 110, h: 188 },
  'victory':       { x: 550, y: 0, w: 111, h: 188 },
  'hold-staff':    { x: 0, y: 188, w: 110, h: 189 },
  'magic-channel': { x: 110, y: 188, w: 110, h: 189 },
  'point':         { x: 220, y: 188, w: 110, h: 189 },
  'think':         { x: 330, y: 188, w: 110, h: 189 },
  'confused':      { x: 440, y: 188, w: 110, h: 189 },
  'staff-display': { x: 550, y: 188, w: 111, h: 189 },
};

function loadCrops() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return null;
}

// Size configs
const SIZE_MAP = {
  sm: { displayH: 80, containerW: 70, containerH: 100 },
  md: { displayH: 140, containerW: 120, containerH: 170 },
  lg: { displayH: 220, containerW: 200, containerH: 260 },
};

export default function WizardSprite({
  state = 'idle',
  size = 'md',
  showParticles = true,
  showShadow = true,
  showGlow = true,
  className = '',
}) {
  const [currentPoseIdx, setCurrentPoseIdx] = useState(0);
  const [crops, setCrops] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load crops
  useEffect(() => {
    setCrops(loadCrops());
    const interval = setInterval(() => setCrops(loadCrops()), 5000);
    return () => clearInterval(interval);
  }, []);

  const config = STATE_CONFIG[state] || STATE_CONFIG.idle;
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  // Cycle through poses for multi-pose states (casting, success)
  useEffect(() => {
    if (config.poses.length <= 1 || !config.cycleSpeed) {
      setCurrentPoseIdx(0);
      return;
    }

    setCurrentPoseIdx(0);
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPoseIdx(prev => (prev + 1) % config.poses.length);
        setIsTransitioning(false);
      }, 100);
    }, config.cycleSpeed);

    return () => clearInterval(interval);
  }, [state, config.poses.length, config.cycleSpeed]);

  // Get the current pose ID
  const currentPose = config.poses[currentPoseIdx] || 'idle';

  // Build sprite style from crop data or fallback
  const getSpriteStyle = useCallback(() => {
    const crop = crops?.[currentPose] || FALLBACK_POSITIONS[currentPose];
    if (!crop) return {};

    const displayH = sizeConfig.displayH;
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
  }, [crops, currentPose, sizeConfig.displayH]);

  const spriteStyle = getSpriteStyle();

  return (
    <div
      className={`wizard-sprite-container ws-size-${size} ${config.animClass} ${className}`}
      style={{
        width: sizeConfig.containerW,
        height: sizeConfig.containerH,
      }}
    >
      {/* Glow ring */}
      {showGlow && (
        <div
          className={`ws-glow-ring ws-state-${state}`}
          style={{ '--glow-color': config.glowColor }}
        />
      )}

      {/* The actual sprite */}
      <div
        className={`ws-sprite ${isTransitioning ? 'ws-transitioning' : ''}`}
        style={spriteStyle}
      />

      {/* Magic particles */}
      {showParticles && (state === 'casting' || state === 'success') && (
        <div className="ws-particles">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`ws-particle ws-particle-${state}`}
              style={{
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1 + Math.random() * 1.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Ground shadow */}
      {showShadow && (
        <div className={`ws-shadow ws-shadow-${state}`} />
      )}
    </div>
  );
}
