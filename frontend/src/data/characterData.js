/*  ═══════════════════════════════════════════════════
    CHARACTER DATA — XP, Levels, Spells, Outfits
    ═══════════════════════════════════════════════════ */

/**
 * CHARACTER_LEVELS: ระดับตัวละครตาม XP
 * SPELLS: spell ที่ปลดล็อกตาม stage
 * OUTFITS: ชุดตัวละครที่ปลดล็อกตามเงื่อนไข
 * XP_MULTIPLIERS: ตัวคูณ XP ตาม performance
 */

// ─── Level Thresholds ───
export const CHARACTER_LEVELS = [
    { level: 1,  title: 'Novice',         xpRequired: 0,     icon: 'fas fa-seedling',    color: '#9ca3af' },
    { level: 2,  title: 'Apprentice',      xpRequired: 400,   icon: 'fas fa-hat-wizard',  color: '#60a5fa' },
    { level: 3,  title: 'Adept',           xpRequired: 1000,  icon: 'fas fa-fire',        color: '#f97316' },
    { level: 4,  title: 'Mage',            xpRequired: 2000,  icon: 'fas fa-star',        color: '#fbbf24' },
    { level: 5,  title: 'Sorcerer',        xpRequired: 3500,  icon: 'fas fa-dragon',      color: '#a78bfa' },
    { level: 6,  title: 'Archmage',        xpRequired: 5500,  icon: 'fas fa-crown',       color: '#f472b6' },
    { level: 7,  title: 'Grand Wizard',    xpRequired: 8000,  icon: 'fas fa-sun',         color: '#fcd34d' },
    { level: 8,  title: 'Spectrum Lord',   xpRequired: 12000, icon: 'fas fa-infinity',    color: '#e2e8f0' },
];

// ─── XP Multipliers ───
export const XP_MULTIPLIERS = {
    firstAttempt: { multiplier: 1.5, label: 'First Attempt Bonus', icon: 'fas fa-bolt' },
    noHints:      { multiplier: 1.3, label: 'No Hints Used',       icon: 'fas fa-brain' },
    speedBonus:   { multiplier: 1.2, label: 'Speed Bonus',         icon: 'fas fa-clock' },
    perfectCode:  { multiplier: 1.1, label: 'Clean Code',          icon: 'fas fa-gem' },
};

// ─── Spell Inventory ───
export const SPELLS = {
    'print': {
        name: 'Voice of Code',
        description: 'The fundamental incantation — make your code speak.',
        unlockStage: '1-1',
        icon: 'fas fa-comment-dots',
        color: '#60a5fa',
        pythonCode: 'print("Hello, World!")',
        category: 'OUTPUT'
    },
    'variables': {
        name: 'Container Craft',
        description: 'Store magical essence in named containers.',
        unlockStage: '1-2',
        icon: 'fas fa-database',
        color: '#34d399',
        pythonCode: 'name = "Lumina"',
        category: 'STORAGE'
    },
    'f-strings': {
        name: 'Word Weaving',
        description: 'Embed variables directly into text.',
        unlockStage: '1-3',
        icon: 'fas fa-feather-alt',
        color: '#a78bfa',
        pythonCode: 'print(f"Hello, {name}!")',
        category: 'FORMATTING'
    },
    'cast_color': {
        name: 'Chromatic Cast',
        description: 'Channel RGB light through three values.',
        unlockStage: '1-5',
        icon: 'fas fa-palette',
        color: '#f87171',
        pythonCode: 'hero.cast_color(255, 0, 0)',
        category: 'SPECTRUM'
    },
    'functions': {
        name: 'Spell Binding',
        description: 'Define reusable spells with def.',
        unlockStage: '1-7',
        icon: 'fas fa-magic',
        color: '#fbbf24',
        pythonCode: 'def my_spell():\n    print("Cast!")',
        category: 'SPELLCRAFT'
    },
    'move': {
        name: 'Phase Step',
        description: 'Move your hero to a specific position.',
        unlockStage: '1-6',
        icon: 'fas fa-shoe-prints',
        color: '#2dd4bf',
        pythonCode: 'hero.move_to_x(3)',
        category: 'MOVEMENT'
    },
    'type': {
        name: "Nature's Eye",
        description: 'Reveal the true type of any value.',
        unlockStage: '2-1',
        icon: 'fas fa-eye',
        color: '#06b6d4',
        pythonCode: 'print(type(42))',
        category: 'INSPECTION'
    },
    'type_convert': {
        name: 'Transmutation',
        description: 'Convert values between types.',
        unlockStage: '2-4',
        icon: 'fas fa-exchange-alt',
        color: '#f472b6',
        pythonCode: 'x = int("42")',
        category: 'CONVERSION'
    },
    'lists': {
        name: 'Array Mastery',
        description: 'Create and manage ordered collections.',
        unlockStage: '3-1',
        icon: 'fas fa-list',
        color: '#fb923c',
        pythonCode: 'items = [1, 2, 3]',
        category: 'STRUCTURE'
    },
    'for_loop': {
        name: 'Infinite Echo',
        description: 'Walk through every element in a collection.',
        unlockStage: '3-4',
        icon: 'fas fa-sync-alt',
        color: '#22d3ee',
        pythonCode: 'for x in items:\n    print(x)',
        category: 'ITERATION'
    },
    'conditionals': {
        name: 'Fate Divider',
        description: 'Branch your code based on conditions.',
        unlockStage: '4-1',
        icon: 'fas fa-code-branch',
        color: '#e879f9',
        pythonCode: 'if x > 10:\n    print("Big!")',
        category: 'LOGIC'
    },
    'boolean': {
        name: 'Truth Seeker',
        description: 'Master True, False, and logical operators.',
        unlockStage: '4-3',
        icon: 'fas fa-toggle-on',
        color: '#f97316',
        pythonCode: 'if x > 0 and x < 100:',
        category: 'LOGIC'
    }
};

// ─── Wizard Outfits ───
export const OUTFITS = {
    'default': {
        name: 'Tattered Robes',
        description: 'The humble garb of a beginning wizard.',
        primaryColor: '#6b7280',
        accentColor: '#4b5563',
        unlockCondition: 'default',
        unlockLabel: 'Starting outfit',
        icon: 'fas fa-tshirt'
    },
    'red_robe': {
        name: 'Crimson Robe',
        description: 'Woven from the embers of the Red Forest.',
        primaryColor: '#dc2626',
        accentColor: '#991b1b',
        unlockCondition: 'complete_region_1',
        unlockLabel: 'Complete The Red Forest',
        icon: 'fas fa-fire'
    },
    'blue_robe': {
        name: 'Azure Robe',
        description: 'Infused with the wisdom of the Scholar\'s Archive.',
        primaryColor: '#3b82f6',
        accentColor: '#1d4ed8',
        unlockCondition: 'complete_region_2',
        unlockLabel: 'Complete The Scholar\'s Archive',
        icon: 'fas fa-book'
    },
    'green_robe': {
        name: 'Emerald Vestments',
        description: 'Forged in the fires of the Ash Peaks.',
        primaryColor: '#16a34a',
        accentColor: '#166534',
        unlockCondition: 'complete_region_3',
        unlockLabel: 'Complete Ash Peaks',
        icon: 'fas fa-mountain'
    },
    'white_robe': {
        name: 'Spectrum Robes',
        description: 'The ultimate garb — woven from all colors of light.',
        primaryColor: '#f5f5f5',
        accentColor: '#d4d4d4',
        unlockCondition: 'complete_region_4',
        unlockLabel: 'Complete Whispering Caverns',
        icon: 'fas fa-sun'
    },
    'golden_robe': {
        name: 'Grand Wizard Garb',
        description: 'Only the highest rank can wear this golden mantle.',
        primaryColor: '#f59e0b',
        accentColor: '#b45309',
        unlockCondition: 'reach_level_7',
        unlockLabel: 'Reach Grand Wizard (Level 7)',
        icon: 'fas fa-crown'
    }
};

// ─── Helper Functions ───

/**
 * Calculate wizard level from total XP
 */
export const calculateLevel = (totalXP) => {
    let currentLevel = CHARACTER_LEVELS[0];
    for (const level of CHARACTER_LEVELS) {
        if (totalXP >= level.xpRequired) {
            currentLevel = level;
        } else {
            break;
        }
    }
    return currentLevel;
};

/**
 * Calculate XP progress to next level
 */
export const getLevelProgress = (totalXP) => {
    const current = calculateLevel(totalXP);
    const currentIndex = CHARACTER_LEVELS.findIndex(l => l.level === current.level);
    const next = CHARACTER_LEVELS[currentIndex + 1];

    if (!next) {
        return { current, next: null, progress: 100, xpInLevel: 0, xpNeeded: 0 };
    }

    const xpInLevel = totalXP - current.xpRequired;
    const xpNeeded = next.xpRequired - current.xpRequired;
    const progress = Math.floor((xpInLevel / xpNeeded) * 100);

    return { current, next, progress, xpInLevel, xpNeeded };
};

/**
 * Calculate earned XP with multipliers
 */
export const calculateXP = (baseXP, modifiers = {}) => {
    let totalMultiplier = 1;
    const appliedBonuses = [];

    Object.entries(modifiers).forEach(([key, active]) => {
        if (active && XP_MULTIPLIERS[key]) {
            totalMultiplier *= XP_MULTIPLIERS[key].multiplier;
            appliedBonuses.push({
                ...XP_MULTIPLIERS[key],
                key,
                bonusXP: Math.floor(baseXP * (XP_MULTIPLIERS[key].multiplier - 1))
            });
        }
    });

    const earnedXP = Math.floor(baseXP * totalMultiplier);

    return { earnedXP, baseXP, totalMultiplier, appliedBonuses };
};

/**
 * Get spells that should be unlocked given completed stages
 */
export const getUnlockedSpells = (completedStages) => {
    const stageKeys = Object.keys(completedStages);
    return Object.entries(SPELLS)
        .filter(([, spell]) => stageKeys.includes(spell.unlockStage))
        .map(([key, spell]) => ({ key, ...spell }));
};

/**
 * Get outfits that should be unlocked given conditions
 */
export const checkOutfitUnlock = (condition, { completedRegions = [], wizardLevel = 1 } = {}) => {
    switch (condition) {
        case 'default':
            return true;
        case 'complete_region_1':
            return completedRegions.includes(1);
        case 'complete_region_2':
            return completedRegions.includes(2);
        case 'complete_region_3':
            return completedRegions.includes(3);
        case 'complete_region_4':
            return completedRegions.includes(4);
        case 'reach_level_7':
            return wizardLevel >= 7;
        default:
            return false;
    }
};
