import React, { useState, useEffect, useCallback } from 'react';
import { HERO_POSE_CELLS, readSpriteCrops } from './spriteCrops';
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
 *   - character: 'hero' | 'eldrin' | 'prisma' | 'vane' | 'rune-keeper' | 'cave-warden' | 'krakk'
 *   - className: string - additional CSS classes
 */

const SPRITE_SRC = '/wizard-sprites-aligned.png';
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
  hurt: {
    poses: ['alert', 'confused'],
    animClass: 'ws-anim-hurt',
    glowColor: 'rgba(239, 68, 68, 0.55)',
    cycleSpeed: 260,
  },
  victory: {
    poses: ['celebrate', 'victory'],
    animClass: 'ws-anim-success',
    glowColor: 'rgba(100, 255, 100, 0.45)',
    cycleSpeed: 450,
  },
  holdstaff: {
    poses: ['hold-staff'],
    animClass: 'ws-anim-staff',
    glowColor: 'rgba(200, 80, 50, 0.3)',
  },
  walking: {
    poses: ['idle', 'hold-staff', 'point', 'hold-staff'],
    animClass: 'ws-anim-walking',
    glowColor: 'rgba(100, 160, 255, 0.32)',
    cycleSpeed: 120,
  },
};

// Fallback positions (used when no crop data exists)
const FALLBACK_POSITIONS = HERO_POSE_CELLS;

const NPC_SPRITES = {
  eldrin: '/eldrin-sprites.png',
  prisma: '/prisma-sprites.png',
  vane: '/vane-sprites.png',
  'rune-keeper': '/rune-keeper-sprites.png',
  'cave-warden': '/cave-warden-sprites.png',
  krakk: '/krakk-sprites.png',
};

const NPC_POSES = Object.fromEntries(
  Object.keys(FALLBACK_POSITIONS).map((pose, index) => [
    pose,
    { x: (index % 6) * 362, y: Math.floor(index / 6) * 362, w: 362, h: 362 },
  ])
);

// Size configs
const SIZE_MAP = {
  sm: { displayH: 80, containerW: 70, containerH: 100 },
  md: { displayH: 140, containerW: 120, containerH: 170 },
  lg: { displayH: 220, containerW: 200, containerH: 260 },
};

export default function WizardSprite({
  state = 'idle',
  size = 'md',
  character = 'hero',
  direction = 'down',
  walkStep = 0,
  showParticles = true,
  showShadow = true,
  showGlow = true,
  className = '',
}) {
  const [poseState, setPoseState] = useState({ state, index: 0 });
  const [crops, setCrops] = useState(readSpriteCrops);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load crops
  useEffect(() => {
    if (character !== 'hero') return undefined;
    const interval = setInterval(() => setCrops(readSpriteCrops()), 5000);
    return () => clearInterval(interval);
  }, [character]);

  const config = STATE_CONFIG[state] || STATE_CONFIG.idle;
  const npcSprite = NPC_SPRITES[character];
  const sizeConfig = npcSprite && size === 'lg'
    ? { displayH: 240, containerW: 240, containerH: 260 }
    : SIZE_MAP[size] || SIZE_MAP.md;

  // Cycle through poses for multi-pose states (casting, success)
  useEffect(() => {
    if (config.poses.length <= 1 || !config.cycleSpeed) return undefined;
    let transitionTimer;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      transitionTimer = setTimeout(() => {
        setPoseState(prev => ({ state, index: ((prev.state === state ? prev.index : 0) + 1) % config.poses.length }));
        setIsTransitioning(false);
      }, 100);
    }, config.cycleSpeed);

    return () => {
      clearInterval(interval);
      clearTimeout(transitionTimer);
    };
  }, [state, config.poses.length, config.cycleSpeed]);

  // Get the current pose ID
  const currentPoseIdx = poseState.state === state ? poseState.index : 0;
  const currentPose = config.poses[currentPoseIdx] || 'idle';

  // Build sprite style from crop data or fallback
  const getSpriteStyle = useCallback(() => {
    const crop = npcSprite
      ? NPC_POSES[currentPose]
      : crops?.[currentPose] || FALLBACK_POSITIONS[currentPose];
    if (!crop) return {};

    const displayH = sizeConfig.displayH;
    const scale = displayH / crop.h;
    const displayW = crop.w * scale;

    return {
      width: `${displayW}px`,
      height: `${displayH}px`,
      backgroundImage: `url(${npcSprite || SPRITE_SRC})`,
      backgroundPosition: `-${crop.x * scale}px -${crop.y * scale}px`,
      backgroundSize: `${(npcSprite ? 2172 : NAT_W) * scale}px ${(npcSprite ? 724 : NAT_H) * scale}px`,
      backgroundRepeat: 'no-repeat',
    };
  }, [crops, currentPose, npcSprite, sizeConfig.displayH]);

  const spriteStyle = getSpriteStyle();

  const strideClass = walkStep % 2 === 0 ? 'ws-stride-left' : 'ws-stride-right';

  return (
    <div
      className={`wizard-sprite-container ws-size-${size} ${config.animClass} ws-dir-${direction} ${state === 'walking' ? strideClass : ''} ${className}`}
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

      {/* Arcane Casting Circle at Feet */}
      {state === 'casting' && (
        <div className="ws-cast-circle" aria-hidden="true">
          <div className="ws-cast-circle-inner" />
        </div>
      )}

      {/* Billowing Cape Hem (active during walking & casting) */}
      {(state === 'walking' || state === 'casting') && (
        <div className={`ws-cape-hem ws-cape-${state}`} aria-hidden="true" />
      )}

      {/* The actual sprite */}
      <div
        className={`ws-sprite ${npcSprite ? 'ws-sprite-npc' : ''} ${isTransitioning ? 'ws-transitioning' : ''}`}
        style={spriteStyle}
      />

      {/* Animated Staff Swing / Raised Staff Flare */}
      {(state === 'walking' || state === 'casting') && (
        <div className={`ws-staff-rig ws-staff-${state}`} aria-hidden="true">
          <span className="ws-staff-orb" />
        </div>
      )}

      {/* Footstep Dust during Walking */}
      {state === 'walking' && (
        <div className="ws-walk-feet" aria-hidden="true">
          <span key={walkStep} className="ws-step-dust">
            <i className="ws-dust-puff puff-1" />
            <i className="ws-dust-puff puff-2" />
            <i className="ws-dust-spark" />
          </span>
        </div>
      )}

      {/* Magic particles */}
      {showParticles && (state === 'casting' || state === 'success' || state === 'victory') && (
        <div className="ws-particles">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`ws-particle ws-particle-${state === 'victory' ? 'success' : state}`}
              style={{
                left: `${20 + ((i * 37) % 61)}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1 + ((i * 7) % 11) / 10}s`,
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
