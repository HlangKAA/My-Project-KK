/*  ═══════════════════════════════════════════════════
    CONCEPT MAP — Python concept dependency graph
    ═══════════════════════════════════════════════════ */

/**
 * แต่ละ concept มี:
 * - name: ชื่อที่แสดงผล
 * - region: region ที่สอน concept นี้
 * - prerequisites: concept ที่ต้องรู้ก่อน
 * - order: ลำดับการเรียนรู้ (global)
 * - description: อธิบายสั้นๆ
 * - icon: Font Awesome icon
 * - color: สีประจำ concept
 */

export const CONCEPT_MAP = {
    'movement': {
        name: 'Movement', region: 1, prerequisites: [], order: 1,
        description: 'Move the hero around the arena with Python commands.',
        icon: 'fas fa-shoe-prints', color: '#d3b47a'
    },
    'print': {
        name: 'print()',
        region: 1,
        prerequisites: [],
        order: 1,
        description: 'The fundamental incantation — make your code speak to the world.',
        icon: 'fas fa-comment-dots',
        color: '#60a5fa'
    },
    'strings': {
        name: 'Strings',
        region: 1,
        prerequisites: ['print'],
        order: 2,
        description: 'Text wrapped in quotes — the language of spells.',
        icon: 'fas fa-quote-right',
        color: '#a78bfa'
    },
    'variables': {
        name: 'Variables',
        region: 1,
        prerequisites: ['strings'],
        order: 3,
        description: 'Named containers that store magical essence for later use.',
        icon: 'fas fa-database',
        color: '#34d399'
    },
    'data-types': {
        name: 'Data Types', region: 1, prerequisites: ['variables'], order: 3,
        description: 'Recognize strings, integers, floats, and booleans.',
        icon: 'fas fa-shapes', color: '#c9a96b'
    },
    'f-strings': {
        name: 'f-Strings',
        region: 1,
        prerequisites: ['variables', 'strings'],
        order: 4,
        description: 'Weave variables into text with the power of f"...".',
        icon: 'fas fa-feather-alt',
        color: '#c084fc'
    },
    'rgb': {
        name: 'RGB Colors',
        region: 2,
        prerequisites: ['variables'],
        order: 12,
        description: 'Three channels of light — Red, Green, Blue — each from 0 to 255.',
        icon: 'fas fa-palette',
        color: '#f87171'
    },
    'functions-basic': {
        name: 'Functions',
        region: 1,
        prerequisites: ['variables'],
        order: 11,
        description: 'Reusable spells — define once, cast many times.',
        icon: 'fas fa-magic',
        color: '#fbbf24'
    },
    'sequential-execution': {
        name: 'Sequential Execution',
        region: 1,
        prerequisites: ['print'],
        order: 5,
        description: 'Code runs top to bottom — order matters.',
        icon: 'fas fa-sort-numeric-down',
        color: '#2dd4bf'
    },
    'color-brightness': {
        name: 'Brightness', region: 2, prerequisites: ['rgb'], order: 13,
        description: 'Add the same amount to each RGB channel to brighten an image.',
        icon: 'fas fa-sun', color: '#fbbf24'
    },
    'channel-tint': {
        name: 'Channel Tint', region: 2, prerequisites: ['color-brightness'], order: 14,
        description: 'Change one channel to tint a colored lens.',
        icon: 'fas fa-eye', color: '#06b6d4'
    },
    'color-inversion': {
        name: 'Color Inversion', region: 2, prerequisites: ['channel-tint'], order: 15,
        description: 'Subtract each channel from 255 to invert an image.',
        icon: 'fas fa-adjust', color: '#a78bfa'
    },
    'grayscale': {
        name: 'Grayscale', region: 2, prerequisites: ['color-inversion'], order: 16,
        description: 'Use the average of three channels for a gray shade.',
        icon: 'fas fa-image', color: '#cbd5e1'
    },
    'palette-repair': {
        name: 'Palette Repair', region: 2, prerequisites: ['grayscale'], order: 17,
        description: 'Choose the right color transformation for each object.',
        icon: 'fas fa-palette', color: '#f472b6'
    },
    'lists': {
        name: 'Lists',
        region: 1,
        prerequisites: ['variables'],
        order: 9,
        description: 'Ordered collections — like a shelf of labeled potions.',
        icon: 'fas fa-list-ol',
        color: '#fb923c'
    },
    'indexing': {
        name: 'Indexing',
        region: 3,
        prerequisites: ['lists'],
        order: 19,
        description: 'Access any element by its position — starting from 0.',
        icon: 'fas fa-hand-pointer',
        color: '#4ade80'
    },
    'list-methods': {
        name: 'List Methods',
        region: 3,
        prerequisites: ['lists'],
        order: 20,
        description: '.append(), .pop(), .index() — manipulate your collections.',
        icon: 'fas fa-tools',
        color: '#e879f9'
    },
    'for-loops': {
        name: 'for Loops',
        region: 1,
        prerequisites: ['lists'],
        order: 10,
        description: 'Walk through every element — the wizard\'s torch.',
        icon: 'fas fa-sync-alt',
        color: '#22d3ee'
    },
    'conditionals': {
        name: 'if/elif/else',
        region: 1,
        prerequisites: ['variables'],
        order: 6,
        description: 'The wizard\'s crossroads — choose your path based on conditions.',
        icon: 'fas fa-code-branch',
        color: '#e879f9'
    },
    'comparison': {
        name: 'Comparison Operators',
        region: 1,
        prerequisites: ['conditionals'],
        order: 7,
        description: '==, !=, <, >, <=, >= — the tools of judgment.',
        icon: 'fas fa-balance-scale',
        color: '#94a3b8'
    },
    'boolean-logic': {
        name: 'Boolean Logic',
        region: 1,
        prerequisites: ['conditionals'],
        order: 8,
        description: 'True and False — and, or, not — the ultimate truth.',
        icon: 'fas fa-toggle-on',
        color: '#f97316'
    },
    'color-mixing': {
        name: 'Color Mixing',
        region: 2,
        prerequisites: ['rgb', 'conditionals'],
        order: 18,
        description: 'Combine RGB channels with logic to produce any color in the spectrum.',
        icon: 'fas fa-sun',
        color: '#fcd34d'
    }
};

/**
 * Helper: Get all concepts for a specific region
 */
export const getRegionConcepts = (regionId) => {
    return Object.entries(CONCEPT_MAP)
        .filter(([, concept]) => concept.region === regionId)
        .sort((a, b) => a[1].order - b[1].order)
        .map(([key, concept]) => ({ key, ...concept }));
};

/**
 * Helper: Check if a concept's prerequisites are all mastered
 */
export const isConceptReady = (conceptKey, masteredConcepts) => {
    const concept = CONCEPT_MAP[conceptKey];
    if (!concept) return false;
    return concept.prerequisites.every(prereq => masteredConcepts.includes(prereq));
};

/**
 * Helper: Get the concept dependency chain (for skill tree visualization)
 */
export const getConceptChain = (conceptKey) => {
    const chain = [];
    const visited = new Set();

    const traverse = (key) => {
        if (visited.has(key)) return;
        visited.add(key);
        const concept = CONCEPT_MAP[key];
        if (!concept) return;
        concept.prerequisites.forEach(prereq => traverse(prereq));
        chain.push(key);
    };

    traverse(conceptKey);
    return chain;
};
