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
        descriptionTh: 'ให้โค้ดพูดออกมาเป็นข้อความในคอนโซล',
        unlockStage: '1-1',
        icon: 'fas fa-comment-dots',
        color: '#60a5fa',
        pythonCode: 'print("Hello, World!")',
        guide: {
            en: { when: 'Use print() to show a value or say a required phrase.', note: 'Some stages listen for a specific phrase. Check the objective before choosing the text.' },
            th: { when: 'ใช้ print() แสดงค่าหรือพูดข้อความที่โจทย์ต้องการ', note: 'บางด่านรอฟังคำเฉพาะ ลองดูโจทย์ก่อนว่าจะต้องพิมพ์อะไร' },
        },
        category: 'OUTPUT'
    },
    'variables': {
        name: 'Container Craft',
        description: 'Store magical essence in named containers.',
        descriptionTh: 'เก็บค่าไว้ในตัวแปร แล้วเรียกใช้ทีหลัง',
        unlockStage: '1-2',
        icon: 'fas fa-database',
        color: '#34d399',
        pythonCode: 'name = "Lumina"\nprint(name)',
        guide: {
            en: { when: 'Use a variable when a value will be reused or changed.', note: 'A variable assignment alone does not move the hero or restore a target.' },
            th: { when: 'ใช้ตัวแปรเมื่ออยากเก็บค่าไว้ใช้ซ้ำหรือเปลี่ยนค่า', note: 'แค่กำหนดตัวแปรยังไม่ทำให้ตัวละครเดินหรือคืนสีวัตถุ' },
        },
        category: 'STORAGE'
    },
    'f-strings': {
        name: 'Word Weaving',
        description: 'Embed variables directly into text.',
        descriptionTh: 'นำค่าตัวแปรมาใส่ในข้อความด้วย f-string',
        unlockStage: '1-3',
        icon: 'fas fa-feather-alt',
        color: '#a78bfa',
        pythonCode: 'name = "Lumina"\nprint(f"Hello, {name}!")',
        guide: {
            en: { when: 'Use an f-string when a message must include a variable.', note: 'Define each variable before using it inside {braces}.' },
            th: { when: 'ใช้ f-string เมื่อข้อความต้องมีค่าจากตัวแปร', note: 'กำหนดค่าตัวแปรก่อนใส่ชื่อไว้ใน {วงเล็บปีกกา}' },
        },
        category: 'FORMATTING'
    },
    'cast_color': {
        name: 'Chromatic Cast',
        description: 'Channel RGB light through three values.',
        descriptionTh: 'ร่ายสีด้วยค่าแดง เขียว น้ำเงิน ตามลำดับ',
        unlockStage: '2-1',
        icon: 'fas fa-palette',
        color: '#f87171',
        pythonCode: 'hero.cast_color(255, 0, 0)',
        guide: {
            en: { when: 'Use cast_color(red, green, blue) to restore a nearby object.', note: 'Stand on or beside the target first. Each RGB channel must be an integer from 0 to 255.' },
            th: { when: 'ใช้ cast_color(แดง, เขียว, น้ำเงิน) เพื่อคืนสีให้วัตถุใกล้ๆ', note: 'เดินไปอยู่บนหรือข้างวัตถุก่อน แต่ละช่องสีต้องเป็นจำนวนเต็มตั้งแต่ 0 ถึง 255' },
        },
        category: 'SPECTRUM'
    },
    'functions': {
        name: 'Spell Binding',
        description: 'Define reusable spells with def.',
        descriptionTh: 'สร้างฟังก์ชันไว้เรียกใช้คำสั่งเดิมได้หลายครั้ง',
        unlockStage: '1-6',
        icon: 'fas fa-magic',
        color: '#fbbf24',
        pythonCode: 'def my_spell():\n    print("Cast!")\n\nmy_spell()',
        guide: {
            en: { when: 'Use a function when the same steps are needed more than once.', note: 'Defining a function does not run it. Call it by name after the definition.' },
            th: { when: 'ใช้ฟังก์ชันเมื่อมีชุดคำสั่งที่ต้องเรียกซ้ำ', note: 'แค่ประกาศฟังก์ชันยังไม่รัน ต้องเรียกชื่อฟังก์ชันด้วย' },
        },
        category: 'SPELLCRAFT'
    },
    'move': {
        name: 'Phase Step',
        description: 'Move your hero across the arena one direction at a time.',
        descriptionTh: 'สั่งตัวละครเดินบนตารางทีละทิศทาง',
        unlockStage: '1-1',
        icon: 'fas fa-shoe-prints',
        color: '#2dd4bf',
        pythonCode: 'hero.move_right(1)',
        guide: {
            en: { when: 'Use move_right, move_left, move_up, or move_down to reach a target.', note: 'The number is how many tiles to walk. Obstacles can block a path, so check the grid.' },
            th: { when: 'ใช้ move_right, move_left, move_up หรือ move_down เพื่อเดินไปหาเป้าหมาย', note: 'ตัวเลขคือจำนวนช่องที่เดิน ดูสิ่งกีดขวางบนตารางด้วย' },
        },
        category: 'MOVEMENT'
    },
    'type': {
        name: 'Light Weaver',
        description: 'Brighten a color by adding light to its RGB channels.',
        descriptionTh: 'เพิ่มความสว่างด้วยการบวกค่าให้ช่องสี RGB',
        unlockStage: '2-1',
        icon: 'fas fa-eye',
        color: '#06b6d4',
        pythonCode: 'r, g, b = 30, 40, 50\nhero.cast_color(min(255, r + 20), min(255, g + 20), min(255, b + 20))',
        guide: {
            en: { when: 'Add the same amount to the RGB channels to brighten a color.', note: 'Use min(255, value) to stay in range, then move beside the target before casting.' },
            th: { when: 'บวกค่าให้ช่องสี RGB เท่าๆ กันเพื่อเพิ่มความสว่าง', note: 'ใช้ min(255, ค่า) กันสีเกินช่วง แล้วเดินไปใกล้วัตถุก่อนร่าย' },
        },
        category: 'SPECTRUM'
    },
    'type_convert': {
        name: 'Silver Memory',
        description: 'Turn a color into a gray shade using its channel average.',
        descriptionTh: 'เฉลี่ยค่าสีทั้งสามช่องเพื่อหาค่าสีเทา',
        unlockStage: '2-4',
        icon: 'fas fa-exchange-alt',
        color: '#f472b6',
        pythonCode: 'r, g, b = 30, 90, 150\nshade = (r + g + b) // 3\nprint(shade)',
        guide: {
            en: { when: 'Use an average when every RGB channel should have the same gray value.', note: 'After calculating shade, use it for red, green, and blue when casting near a target.' },
            th: { when: 'ใช้ค่าเฉลี่ยเมื่อต้องการให้ช่องสีทั้งสามเป็นสีเทาค่าเดียวกัน', note: 'คำนวณ shade แล้วใช้ค่านี้กับทั้งแดง เขียว น้ำเงิน ตอนร่ายใกล้วัตถุ' },
        },
        category: 'SPECTRUM'
    },
    'lists': {
        name: 'Array Mastery',
        description: 'Create and manage ordered collections.',
        descriptionTh: 'เก็บค่าหลายค่าเรียงกันในลิสต์',
        unlockStage: '1-5',
        icon: 'fas fa-list',
        color: '#fb923c',
        pythonCode: 'items = [1, 2, 3]\nprint(items[0])',
        guide: {
            en: { when: 'Use a list to store a row of values or pixels in order.', note: 'Index 0 is the first item. Read other positions by changing the index.' },
            th: { when: 'ใช้ลิสต์เก็บชุดค่าหรือแถวพิกเซลตามลำดับ', note: 'ตำแหน่ง 0 คือค่าแรก ถ้าอยากอ่านค่าอื่นให้เปลี่ยนตำแหน่ง' },
        },
        category: 'STRUCTURE'
    },
    'for_loop': {
        name: 'Infinite Echo',
        description: 'Walk through every element in a collection.',
        descriptionTh: 'วนดูค่าทุกตัวในลิสต์ทีละตัว',
        unlockStage: '1-5',
        icon: 'fas fa-sync-alt',
        color: '#22d3ee',
        pythonCode: 'items = [1, 2, 3]\nfor item in items:\n    print(item)',
        guide: {
            en: { when: 'Use a for loop to process each value or pixel in a row.', note: 'The indented lines run once for each item in the list.' },
            th: { when: 'ใช้ for วนจัดการค่าหรือพิกเซลทุกตัวในแถว', note: 'บรรทัดที่เยื้องเข้าไปจะทำซ้ำตามจำนวนค่าในลิสต์' },
        },
        category: 'ITERATION'
    },
    'conditionals': {
        name: 'Fate Divider',
        description: 'Branch your code based on conditions.',
        descriptionTh: 'ใช้เงื่อนไขเลือกว่าจะให้โค้ดทำอะไร',
        unlockStage: '1-4',
        icon: 'fas fa-code-branch',
        color: '#e879f9',
        pythonCode: 'x = 12\nif x > 10:\n    print("Big!")',
        guide: {
            en: { when: 'Use if when an action depends on a value or pixel.', note: 'Indent the action beneath if. Add elif or else for other cases.' },
            th: { when: 'ใช้ if เมื่อคำสั่งขึ้นอยู่กับค่าหรือพิกเซลที่ตรวจ', note: 'เยื้องคำสั่งใต้ if และใช้ elif หรือ else หากมีกรณีอื่น' },
        },
        category: 'LOGIC'
    },
    'boolean': {
        name: 'Truth Seeker',
        description: 'Master True, False, and logical operators.',
        descriptionTh: 'ใช้ True, False และตัวเชื่อมเงื่อนไข',
        unlockStage: '1-4',
        icon: 'fas fa-toggle-on',
        color: '#f97316',
        pythonCode: 'x = 42\nif x > 0 and x < 100:\n    print("In range")',
        guide: {
            en: { when: 'Use and when both conditions must be true; use or when either can be true.', note: 'A condition after if needs an indented body. Boolean values are spelled True and False.' },
            th: { when: 'ใช้ and เมื่อต้องจริงทั้งคู่ หรือใช้ or เมื่อจริงข้อใดข้อหนึ่งก็พอ', note: 'หลัง if ต้องมีคำสั่งที่เยื้องเข้าไป ส่วนค่า boolean เขียนว่า True และ False' },
        },
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
        description: 'Woven from the glowing moss of the Whispering Caverns.',
        primaryColor: '#16a34a',
        accentColor: '#166534',
        unlockCondition: 'complete_region_3',
        unlockLabel: 'Complete Whispering Caverns',
        icon: 'fas fa-mountain'
    },
    'white_robe': {
        name: 'Spectrum Robes',
        description: 'The ultimate garb — woven from all colors of light.',
        primaryColor: '#f5f5f5',
        accentColor: '#d4d4d4',
        unlockCondition: 'complete_region_4',
        unlockLabel: 'Complete Ash Peaks',
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
    let totalBonus = 0;
    const appliedBonuses = [];
    const hintsUsed = Math.min(Math.max(Number(modifiers.hintsUsed ?? (modifiers.noHints === false ? 3 : 0)), 0), 3);

    if (modifiers.firstAttempt && XP_MULTIPLIERS.firstAttempt) {
        const bonusXP = Math.floor(baseXP * (XP_MULTIPLIERS.firstAttempt.multiplier - 1));
        totalBonus += bonusXP;
        appliedBonuses.push({
            ...XP_MULTIPLIERS.firstAttempt,
            key: 'firstAttempt',
            bonusXP
        });
    }

    if (hintsUsed < 3) {
        const tierTenths = 3 - hintsUsed;
        const bonusXP = Math.floor((baseXP * tierTenths) / 10);
        if (bonusXP > 0) {
            totalBonus += bonusXP;
            appliedBonuses.push({
                ...XP_MULTIPLIERS.noHints,
                key: 'noHints',
                label: hintsUsed === 0 ? 'No Hints Used' : `Hint Bonus (${hintsUsed}/3 Hints Used)`,
                bonusXP
            });
        }
    }

    const earnedXP = baseXP + totalBonus;
    const totalMultiplier = baseXP > 0 ? earnedXP / baseXP : 1;

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
