// Crop rectangles are always measured in source-image pixels. The old key stored
// editor display pixels, which varied with viewport size and could include a
// neighbouring pose in the game.
export const SPRITE_CROP_STORAGE_KEY = 'wizard-sprite-crops-natural-v2';

export const HERO_POSE_CELLS = {
  idle: { x: 0, y: 0, w: 110, h: 188 },
  alert: { x: 110, y: 0, w: 110, h: 188 },
  'cast-orb': { x: 220, y: 0, w: 110, h: 188 },
  'cast-spell': { x: 330, y: 0, w: 110, h: 188 },
  celebrate: { x: 440, y: 0, w: 110, h: 188 },
  victory: { x: 550, y: 0, w: 111, h: 188 },
  'hold-staff': { x: 0, y: 188, w: 110, h: 189 },
  'magic-channel': { x: 110, y: 188, w: 110, h: 189 },
  point: { x: 220, y: 188, w: 110, h: 189 },
  think: { x: 330, y: 188, w: 110, h: 189 },
  confused: { x: 440, y: 188, w: 110, h: 189 },
  'staff-display': { x: 550, y: 188, w: 111, h: 189 },
};

export function validSpriteCrop(pose, crop) {
  const cell = HERO_POSE_CELLS[pose];
  if (!cell || !crop || !['x', 'y', 'w', 'h'].every(key => Number.isFinite(crop[key]))) return false;
  return crop.w > 0 && crop.h > 0 && crop.x >= cell.x && crop.y >= cell.y
    && crop.x + crop.w <= cell.x + cell.w && crop.y + crop.h <= cell.y + cell.h;
}

export function clampSpriteCrop(pose, crop) {
  const cell = HERO_POSE_CELLS[pose];
  if (!cell) return crop;
  const x = Math.max(cell.x, Math.min(crop.x, cell.x + cell.w - 1));
  const y = Math.max(cell.y, Math.min(crop.y, cell.y + cell.h - 1));
  return {
    x,
    y,
    w: Math.max(0, Math.min(crop.w, cell.x + cell.w - x)),
    h: Math.max(0, Math.min(crop.h, cell.y + cell.h - y)),
  };
}

export function readSpriteCrops() {
  try {
    const saved = JSON.parse(localStorage.getItem(SPRITE_CROP_STORAGE_KEY) || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(Object.entries(saved).filter(([pose, crop]) => validSpriteCrop(pose, crop)));
  } catch {
    return {};
  }
}

export function writeSpriteCrops(crops) {
  const valid = Object.fromEntries(Object.entries(crops).filter(([pose, crop]) => validSpriteCrop(pose, crop)));
  localStorage.setItem(SPRITE_CROP_STORAGE_KEY, JSON.stringify(valid));
}
