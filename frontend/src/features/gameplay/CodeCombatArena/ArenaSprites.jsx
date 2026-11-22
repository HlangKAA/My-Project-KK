import React from 'react';

/**
 * Multi-layered 2D SVG Floor & Walkable Path Tile Renderer
 */
export function ArenaTileSvg({
    theme = 'forest',
    isPath = false,
    isObstacle = false,
    isVisited = false,
    x = 0,
    y = 0,
    tileAssetUrl = null,
}) {
    const seed = (x * 7 + y * 13) % 4;

    if (tileAssetUrl) {
        return (
            <img
                src={tileAssetUrl}
                alt=""
                className="cca-tile-external-img"
                draggable={false}
            />
        );
    }

    if (isObstacle) {
        return (
            <svg className="cca-tile-svg cca-tile-obstacle-svg" viewBox="0 0 48 48" aria-hidden="true">
                <rect x="1" y="1" width="46" height="46" rx="4" fill="rgba(10, 14, 24, 0.72)" />
                <path d="M4 44 L12 36 L36 36 L44 44 Z" fill="rgba(0, 0, 0, 0.45)" />
                <rect x="3" y="3" width="42" height="42" rx="4" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            </svg>
        );
    }

    // ─── Walkable Path Tile (Distinct Cobblestone / Carpet / Crystal Causeway / Obsidian Bridge) ───
    if (isPath) {
        if (theme === 'archive') {
            return (
                <svg className="cca-tile-svg cca-tile-path-svg" viewBox="0 0 48 48" aria-hidden="true">
                    {/* Polished marble base */}
                    <rect x="0" y="0" width="48" height="48" fill="#1e2636" />
                    {/* Royal Archive runner carpet + golden trim */}
                    <rect x="3" y="3" width="42" height="42" rx="4" fill="#3a2029" stroke="#d4af37" strokeWidth="1.4" strokeOpacity="0.65" />
                    <rect x="6" y="6" width="36" height="36" rx="2" fill="none" stroke="#facc15" strokeWidth="0.6" strokeDasharray="3 2" strokeOpacity="0.45" />
                    <polygon points="24,14 31,24 24,34 17,24" fill="rgba(250, 204, 21, 0.14)" stroke="rgba(250, 204, 21, 0.35)" strokeWidth="0.8" />
                    {isVisited && <circle cx="24" cy="24" r="4" fill="#fde047" opacity="0.65" />}
                </svg>
            );
        }

        if (theme === 'cavern') {
            return (
                <svg className="cca-tile-svg cca-tile-path-svg" viewBox="0 0 48 48" aria-hidden="true">
                    <rect x="0" y="0" width="48" height="48" fill="#132638" />
                    {/* Carved crystal causeway stone */}
                    <rect x="3" y="3" width="42" height="42" rx="5" fill="#1c354d" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.55" />
                    <path d="M8 24 H40 M24 8 V40" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" />
                    <polygon points="24,16 30,24 24,32 18,24" fill="rgba(56, 189, 248, 0.2)" stroke="#7dd3fc" strokeWidth="0.8" strokeOpacity="0.6" />
                    {isVisited && <circle cx="24" cy="24" r="4.5" fill="#38bdf8" opacity="0.75" />}
                </svg>
            );
        }

        if (theme === 'peaks') {
            return (
                <svg className="cca-tile-svg cca-tile-path-svg" viewBox="0 0 48 48" aria-hidden="true">
                    <rect x="0" y="0" width="48" height="48" fill="#23161c" />
                    {/* Reinforced obsidian bridge slab */}
                    <rect x="3" y="3" width="42" height="42" rx="4" fill="#342229" stroke="#fb923c" strokeWidth="1.2" strokeOpacity="0.55" />
                    <path d="M6 12 H42 M6 36 H42" stroke="rgba(251, 146, 60, 0.28)" strokeWidth="1" />
                    <circle cx="24" cy="24" r="7" fill="none" stroke="rgba(251, 146, 60, 0.35)" strokeWidth="1" strokeDasharray="3 2" />
                    {isVisited && <circle cx="24" cy="24" r="4" fill="#fb923c" opacity="0.8" />}
                </svg>
            );
        }

        if (theme === 'lab') {
            return (
                <svg className="cca-tile-svg cca-tile-path-svg" viewBox="0 0 48 48" aria-hidden="true">
                    <rect x="0" y="0" width="48" height="48" fill="#131f33" />
                    <rect x="3" y="3" width="42" height="42" rx="4" fill="#1d2f4a" stroke="#38bdf8" strokeWidth="1.1" strokeOpacity="0.5" />
                    <circle cx="24" cy="24" r="8" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" />
                    <path d="M24 6 V14 M24 34 V42 M6 24 H14 M34 24 H42" stroke="rgba(56, 189, 248, 0.32)" strokeWidth="1.1" />
                    {isVisited && <circle cx="24" cy="24" r="4" fill="#38bdf8" opacity="0.75" />}
                </svg>
            );
        }

        // Default: Red Forest & Gate — Carved Ancient Cobblestone Rune Path
        return (
            <svg className="cca-tile-svg cca-tile-path-svg" viewBox="0 0 48 48" aria-hidden="true">
                <rect x="0" y="0" width="48" height="48" fill="#211824" />
                {/* Fitted stone slabs */}
                <rect x="3" y="3" width="20" height="19" rx="3" fill="#352838" stroke="#6b4c5b" strokeWidth="1" />
                <rect x="25" y="3" width="20" height="19" rx="3" fill="#312435" stroke="#6b4c5b" strokeWidth="1" />
                <rect x="3" y="25" width="26" height="20" rx="3" fill="#302334" stroke="#6b4c5b" strokeWidth="1" />
                <rect x="31" y="25" width="14" height="20" rx="3" fill="#37293b" stroke="#6b4c5b" strokeWidth="1" />
                {/* Subtle rune etching in center */}
                <circle cx="24" cy="24" r="5" fill="rgba(244, 63, 94, 0.14)" stroke="rgba(251, 113, 133, 0.42)" strokeWidth="0.9" />
                {isVisited && <circle cx="24" cy="24" r="3.8" fill="#fb7185" opacity="0.8" />}
            </svg>
        );
    }

    // ─── Non-Path Ground Terrain Tile (Forest Moss/Grass, Archive Marble, Cavern Mineral, Peaks Lava Rock) ───
    if (theme === 'archive') {
        return (
            <svg className="cca-tile-svg cca-tile-ground-svg" viewBox="0 0 48 48" aria-hidden="true">
                <rect x="0" y="0" width="48" height="48" fill={(x + y) % 2 === 0 ? '#16202e' : '#121a26'} />
                <path d="M4 12 Q20 18 44 8" stroke="rgba(212, 175, 55, 0.1)" strokeWidth="1" fill="none" />
                <rect x="2" y="2" width="44" height="44" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </svg>
        );
    }

    if (theme === 'cavern') {
        return (
            <svg className="cca-tile-svg cca-tile-ground-svg" viewBox="0 0 48 48" aria-hidden="true">
                <rect x="0" y="0" width="48" height="48" fill={(x + y) % 2 === 0 ? '#0f1b29' : '#0b1420'} />
                <circle cx={12 + seed * 6} cy={16 + seed * 4} r="1.6" fill="#38bdf8" opacity="0.28" />
                <circle cx={34 - seed * 4} cy={32 - seed * 3} r="1.2" fill="#818cf8" opacity="0.25" />
                <path d="M6 38 Q24 32 42 40" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="1" fill="none" />
            </svg>
        );
    }

    if (theme === 'peaks') {
        return (
            <svg className="cca-tile-svg cca-tile-ground-svg" viewBox="0 0 48 48" aria-hidden="true">
                <rect x="0" y="0" width="48" height="48" fill={(x + y) % 2 === 0 ? '#1b1116' : '#140c10'} />
                {/* Subsurface glowing lava crack */}
                <path
                    d={seed % 2 === 0 ? 'M8 10 L20 24 L16 38' : 'M38 12 L24 26 L34 40'}
                    stroke="rgba(249, 115, 22, 0.25)"
                    strokeWidth="1.2"
                    fill="none"
                />
            </svg>
        );
    }

    if (theme === 'lab') {
        return (
            <svg className="cca-tile-svg cca-tile-ground-svg" viewBox="0 0 48 48" aria-hidden="true">
                <rect x="0" y="0" width="48" height="48" fill={(x + y) % 2 === 0 ? '#0e1729' : '#0a1120'} />
                <circle cx="6" cy="6" r="1" fill="rgba(56, 189, 248, 0.2)" />
                <circle cx="42" cy="42" r="1" fill="rgba(56, 189, 248, 0.2)" />
            </svg>
        );
    }

    // Default: Red Forest & Gate — Lush Dark Forest Turf with Crimson Moss & Grass Tufts
    return (
        <svg className="cca-tile-svg cca-tile-ground-svg" viewBox="0 0 48 48" aria-hidden="true">
            <rect x="0" y="0" width="48" height="48" fill={(x + y) % 2 === 0 ? '#16111c' : '#120d17'} />
            {/* Moss patches & grass blades */}
            <ellipse cx={16 + seed * 4} cy={28 + seed * 2} rx="8" ry="4" fill="rgba(225, 29, 72, 0.08)" />
            <path
                d={`M${12 + seed * 5} 36 Q${10 + seed * 5} 28 ${14 + seed * 5} 26 M${15 + seed * 5} 36 Q${17 + seed * 5} 29 ${19 + seed * 5} 27`}
                stroke="rgba(244, 63, 94, 0.28)"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    );
}

/**
 * Multi-layered 2D SVG Obstacle Sprites with Idle Animations
 */
export function ArenaObstacleSprite({ theme = 'forest', x = 0, y = 0, spriteUrl = null }) {
    const variant = (x * 3 + y * 5) % 2;

    if (spriteUrl) {
        return <img src={spriteUrl} alt="" className="cca-sprite-external-img" draggable={false} />;
    }

    if (theme === 'archive') {
        return (
            <svg className="cca-svg-sprite cca-obstacle-svg cca-anim-float-slow" viewBox="0 0 48 48" aria-hidden="true">
                <ellipse cx="24" cy="42" rx="16" ry="4" fill="rgba(0,0,0,0.55)" />
                {/* Ornate Archive Bookshelf / Tome Pedestal */}
                <rect x="10" y="10" width="28" height="31" rx="3" fill="#4a321f" stroke="#d4af37" strokeWidth="1.5" />
                <rect x="13" y="14" width="22" height="7" fill="#291b12" />
                <rect x="14" y="15" width="4" height="6" fill="#ef4444" />
                <rect x="19" y="15" width="5" height="6" fill="#3b82f6" />
                <rect x="25" y="15" width="4" height="6" fill="#10b981" />
                <rect x="30" y="15" width="4" height="6" fill="#f59e0b" />
                <rect x="13" y="24" width="22" height="7" fill="#291b12" />
                <rect x="15" y="25" width="5" height="6" fill="#a855f7" />
                <rect x="21" y="25" width="6" height="6" fill="#eab308" />
                <rect x="28" y="25" width="5" height="6" fill="#06b6d4" />
                {/* Glowing floating rune above shelf */}
                <circle cx="24" cy="7" r="3" fill="#fde047" className="cca-svg-pulse" />
            </svg>
        );
    }

    if (theme === 'cavern') {
        return (
            <svg className="cca-svg-sprite cca-obstacle-svg" viewBox="0 0 48 48" aria-hidden="true">
                <ellipse cx="24" cy="42" rx="16" ry="4.5" fill="rgba(0,0,0,0.6)" />
                {/* Multi-faceted glowing crystal stalagmite cluster */}
                <polygon points="14,40 10,22 16,14 21,24 20,40" fill="#0284c7" stroke="#bae6fd" strokeWidth="1" />
                <polygon points="28,40 27,20 33,12 38,24 35,40" fill="#0369a1" stroke="#7dd3fc" strokeWidth="1" />
                <polygon points="18,41 17,15 24,5 31,15 29,41" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="1.2" className="cca-svg-pulse" />
                <polygon points="24,5 27,15 24,39 21,15" fill="rgba(255,255,255,0.28)" />
            </svg>
        );
    }

    if (theme === 'peaks') {
        return (
            <svg className="cca-svg-sprite cca-obstacle-svg" viewBox="0 0 48 48" aria-hidden="true">
                <ellipse cx="24" cy="42" rx="17" ry="4.5" fill="rgba(0,0,0,0.65)" />
                {/* Jagged volcanic obsidian spire with glowing magma seams */}
                <polygon points="10,41 15,18 24,6 34,19 38,41" fill="#271c22" stroke="#fb923c" strokeWidth="1.2" />
                <polygon points="24,6 31,19 28,41 22,41" fill="#1b1218" />
                <path d="M24 12 L21 24 L26 32 L23 40 M17 26 L22 30" stroke="#f97316" strokeWidth="1.6" strokeLinecap="round" fill="none" className="cca-svg-pulse" />
                <circle cx="24" cy="9" r="2" fill="#fde047" className="cca-svg-pulse" />
            </svg>
        );
    }

    if (theme === 'lab') {
        return (
            <svg className="cca-svg-sprite cca-obstacle-svg" viewBox="0 0 48 48" aria-hidden="true">
                <ellipse cx="24" cy="42" rx="16" ry="4" fill="rgba(0,0,0,0.55)" />
                {/* Alchemical Apparatus Bench */}
                <rect x="9" y="28" width="30" height="12" rx="2" fill="#334155" stroke="#64748b" strokeWidth="1.2" />
                <circle cx="19" cy="20" r="6" fill="rgba(56, 189, 248, 0.35)" stroke="#38bdf8" strokeWidth="1.3" />
                <path d="M16 22 Q19 25 22 22" fill="#38bdf8" />
                <path d="M25 18 L31 12 L34 26 L28 26 Z" fill="rgba(168, 85, 247, 0.35)" stroke="#c084fc" strokeWidth="1.2" />
                <circle cx="19" cy="18" r="1.5" fill="#e0f2fe" className="cca-svg-pulse" />
            </svg>
        );
    }

    // Forest & Gate: Variant 0 = Enchanted Crimson Tree with swaying canopy; Variant 1 = Ancient Rune Pillar
    if (variant === 1 || theme === 'gate') {
        return (
            <svg className="cca-svg-sprite cca-obstacle-svg" viewBox="0 0 48 48" aria-hidden="true">
                <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.55)" />
                <rect x="13" y="36" width="22" height="5" rx="1.5" fill="#475569" />
                <rect x="16" y="11" width="16" height="26" rx="2" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
                <rect x="14" y="8" width="20" height="4" rx="1.5" fill="#475569" />
                {/* Glowing carved rune on pillar */}
                <polygon points="24,16 28,23 24,30 20,23" fill="#f43f5e" className="cca-svg-pulse" />
            </svg>
        );
    }

    return (
        <svg className="cca-svg-sprite cca-obstacle-svg cca-tree-sway" viewBox="0 0 48 48" aria-hidden="true">
            <ellipse cx="24" cy="42" rx="15" ry="4" fill="rgba(0,0,0,0.55)" />
            {/* Gnarled dark trunk */}
            <path d="M20 41 L21 25 L27 25 L28 41 Z" fill="#4a2c2a" stroke="#2d1917" strokeWidth="1" />
            {/* Layered crimson & rose magical canopy */}
            <circle cx="17" cy="22" r="9" fill="#9f1239" />
            <circle cx="31" cy="22" r="9" fill="#881337" />
            <circle cx="24" cy="15" r="11" fill="#e11d48" />
            <circle cx="22" cy="13" r="6" fill="#fb7185" opacity="0.55" />
            <circle cx="15" cy="18" r="1.5" fill="#fde047" className="cca-svg-pulse" />
            <circle cx="32" cy="16" r="1.3" fill="#fde047" className="cca-svg-pulse" />
        </svg>
    );
}

/**
 * Multi-layered 2D SVG Awakening Altar with Floating Crystal & Light Beams
 */
export function ArenaAltarSprite({ activated = false }) {
    return (
        <svg className={`cca-svg-sprite cca-altar-svg ${activated ? 'is-activated' : ''}`} viewBox="0 0 48 48" aria-hidden="true">
            <ellipse cx="24" cy="43" rx="18" ry="4" fill="rgba(0,0,0,0.55)" />
            {activated && (
                <g className="cca-altar-beams">
                    <polygon points="14,40 20,4 28,4 34,40" fill="rgba(251, 191, 36, 0.22)" />
                    <circle cx="24" cy="18" r="14" fill="rgba(251, 191, 36, 0.25)" />
                </g>
            )}
            {/* Stepped stone pedestal */}
            <rect x="9" y="37" width="30" height="5" rx="1.5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
            <rect x="13" y="31" width="22" height="6" rx="1.5" fill="#64748b" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M15 31 L18 22 H30 L33 31 Z" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
            {/* Floating rotating crystal above altar */}
            <g className="cca-altar-crystal">
                <polygon
                    points="24,5 31,14 24,23 17,14"
                    fill={activated ? '#fbbf24' : '#38bdf8'}
                    stroke="#ffffff"
                    strokeWidth="1.2"
                />
                <polygon points="24,5 28,14 24,23" fill="rgba(255,255,255,0.35)" />
            </g>
        </svg>
    );
}

/**
 * Multi-layered 2D SVG Alchemist Flask with Animated Liquid & Rising Bubbles
 */
export function ArenaFlaskSprite({ color = '#ec4899', filled = false }) {
    return (
        <svg className={`cca-svg-sprite cca-flask-svg ${filled ? 'is-filled' : ''}`} viewBox="0 0 48 48" aria-hidden="true">
            <ellipse cx="24" cy="42" rx="14" ry="3.5" fill="rgba(0,0,0,0.5)" />
            {/* Flask neck & rim */}
            <rect x="19" y="6" width="10" height="4" rx="2" fill="#cbd5e1" />
            <rect x="21" y="10" width="6" height="7" fill="rgba(226, 232, 240, 0.35)" stroke="#cbd5e1" strokeWidth="1.2" />
            {/* Outer glass bulb */}
            <path
                d="M21 17 L11 33 A5 5 0 0 0 15 40 H33 A5 5 0 0 0 37 33 L27 17 Z"
                fill="rgba(15, 23, 42, 0.65)"
                stroke={color}
                strokeWidth="1.8"
            />
            {/* Bubbling potion liquid inside */}
            <path
                d={filled ? 'M14 25 Q24 22 34 25 L36 33 A4 4 0 0 1 32 38 H16 A4 4 0 0 1 12 33 Z' : 'M15 31 Q24 29 33 31 L35 34 A3 3 0 0 1 32 38 H16 A3 3 0 0 1 13 34 Z'}
                fill={color}
                opacity={filled ? '0.9' : '0.55'}
            />
            {/* Animated potion bubbles */}
            <circle cx="20" cy="33" r="1.6" fill="#ffffff" opacity="0.8" className="cca-bubble-1" />
            <circle cx="27" cy="30" r="1.3" fill="#ffffff" opacity="0.75" className="cca-bubble-2" />
            {filled && <circle cx="24" cy="24" r="1.8" fill="#ffffff" opacity="0.9" className="cca-bubble-1" />}
            {/* Glass specular highlight */}
            <path d="M16 24 L13 32" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

/**
 * Multi-layered 2D SVG Value Crystal / Ground Artifact
 */
export function ArenaCrystalItemSprite({ color = '#ec4899' }) {
    return (
        <svg className="cca-svg-sprite cca-crystal-svg" viewBox="0 0 48 48" aria-hidden="true">
            <ellipse cx="24" cy="40" rx="11" ry="3" fill="rgba(0,0,0,0.45)" />
            <g className="cca-crystal-float">
                <polygon points="24,6 35,18 29,34 19,34 13,18" fill={color} stroke="#ffffff" strokeWidth="1.2" />
                <polygon points="24,6 35,18 24,23 13,18" fill="rgba(255,255,255,0.35)" />
                <polygon points="24,23 35,18 29,34 24,34" fill="rgba(0,0,0,0.22)" />
                <circle cx="19" cy="15" r="1.6" fill="#ffffff" />
            </g>
        </svg>
    );
}

/**
 * Multi-layered 2D SVG RGB Color Target (Archive Frame/Relic, Cavern Rune Stone, Peaks Color Seal)
 */
export function ArenaColorTargetSprite({ theme = 'archive', color = '#94a3b8', matched = false }) {
    if (theme === 'cavern') {
        return (
            <svg className={`cca-svg-sprite cca-target-svg ${matched ? 'is-matched' : ''}`} viewBox="0 0 48 48" aria-hidden="true">
                <ellipse cx="24" cy="42" rx="14" ry="3.5" fill="rgba(0,0,0,0.5)" />
                {/* Carved Cavern Rune Monolith */}
                <polygon points="13,38 11,16 18,7 30,7 37,16 35,38" fill="#1e293b" stroke={color} strokeWidth="2" />
                <polygon points="24,12 31,22 24,32 17,22" fill={color} />
                <circle cx="24" cy="22" r="3.5" fill="#ffffff" opacity={matched ? '0.85' : '0.35'} />
            </svg>
        );
    }

    if (theme === 'peaks') {
        return (
            <svg className={`cca-svg-sprite cca-target-svg ${matched ? 'is-matched' : ''}`} viewBox="0 0 48 48" aria-hidden="true">
                <ellipse cx="24" cy="42" rx="14" ry="3.5" fill="rgba(0,0,0,0.5)" />
                {/* Solar Spectrum Seal */}
                <circle cx="24" cy="22" r="14" fill="#1f1722" stroke={color} strokeWidth="2.2" />
                <polygon points="24,9 28,18 37,22 28,26 24,35 20,26 11,22 20,18" fill={color} />
                <circle cx="24" cy="22" r="4" fill="#ffffff" opacity={matched ? '0.9' : '0.4'} />
            </svg>
        );
    }

    // Archive Illuminated Frame & Prismatic Core
    return (
        <svg className={`cca-svg-sprite cca-target-svg ${matched ? 'is-matched' : ''}`} viewBox="0 0 48 48" aria-hidden="true">
            <ellipse cx="24" cy="42" rx="14" ry="3.5" fill="rgba(0,0,0,0.5)" />
            <rect x="10" y="7" width="28" height="28" rx="4" fill="#1e293b" stroke="#d4af37" strokeWidth="1.8" />
            <rect x="14" y="11" width="20" height="20" rx="2" fill={color} />
            <polygon points="24,14 30,21 24,28 18,21" fill="rgba(255,255,255,0.38)" />
        </svg>
    );
}

/**
 * Multi-layered 2D SVG Ancient Gate / Portal Archway
 */
export function ArenaGateSprite({ unlocked = false }) {
    return (
        <svg className={`cca-svg-sprite cca-gate-svg ${unlocked ? 'is-unlocked' : ''}`} viewBox="0 0 48 48" aria-hidden="true">
            <ellipse cx="24" cy="43" rx="18" ry="4" fill="rgba(0,0,0,0.6)" />
            {/* Portal energy field inside arch */}
            <path
                d="M14 40 V19 A10 10 0 0 1 34 19 V40 Z"
                fill={unlocked ? 'rgba(74, 222, 128, 0.45)' : 'rgba(168, 85, 247, 0.28)'}
            />
            {unlocked ? (
                <circle cx="24" cy="25" r="7" fill="#4ade80" opacity="0.7" className="cca-svg-pulse" />
            ) : (
                <path d="M20 18 V36 M24 15 V38 M28 18 V36" stroke="#c084fc" strokeWidth="1.4" opacity="0.7" />
            )}
            {/* Stone archway pillars & keystone */}
            <path
                d="M9 41 V18 A15 15 0 0 1 39 18 V41 H33 V19 A9 9 0 0 0 15 19 V41 Z"
                fill="#475569"
                stroke={unlocked ? '#4ade80' : '#c084fc'}
                strokeWidth="1.5"
            />
            <polygon points="21,3 27,3 29,9 19,9" fill={unlocked ? '#4ade80' : '#a855f7'} />
        </svg>
    );
}

/**
 * Multi-layered 2D SVG Dimensional Floor Portal Trap
 */
export function ArenaPortalTrapSprite({ active = false }) {
    return (
        <svg className={`cca-svg-sprite cca-portal-svg ${active ? 'is-pulling' : ''}`} viewBox="0 0 48 48" aria-hidden="true">
            <ellipse cx="24" cy="24" rx="20" ry="15" fill="rgba(88, 28, 135, 0.36)" stroke="#a855f7" strokeWidth="1.4" strokeDasharray="4 2" />
            <ellipse cx="24" cy="24" rx="14" ry="10" fill="rgba(14, 165, 233, 0.25)" stroke="#38bdf8" strokeWidth="1.3" className="cca-portal-spin" />
            <g className="cca-portal-vortex">
                <path d="M24 12 C32 14, 34 24, 24 34 C14 26, 16 16, 24 12 Z" fill="rgba(192, 132, 252, 0.55)" />
                <circle cx="24" cy="24" r="5" fill="#e879f9" />
                <circle cx="24" cy="24" r="2.2" fill="#ffffff" />
            </g>
        </svg>
    );
}
