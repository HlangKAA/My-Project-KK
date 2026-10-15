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
        region: 1,
        prerequisites: ['variables'],
        order: 5,
        description: 'Three channels of light — Red, Green, Blue — each from 0 to 255.',
        icon: 'fas fa-palette',
        color: '#f87171'
    },
    'functions-basic': {
        name: 'Functions',
        region: 1,
        prerequisites: ['variables'],
        order: 6,
        description: 'Reusable spells — define once, cast many times.',
        icon: 'fas fa-magic',
        color: '#fbbf24'
    },
    'sequential-execution': {
        name: 'Sequential Execution',
        region: 1,
        prerequisites: ['print'],
        order: 7,
        description: 'Code runs top to bottom — order matters.',
        icon: 'fas fa-sort-numeric-down',
        color: '#2dd4bf'
    },
    'int-float': {
        name: 'Numbers (int/float)',
        region: 2,
        prerequisites: ['variables'],
        order: 8,
        description: 'Integers are whole, floats have decimals — the building blocks of computation.',
        icon: 'fas fa-calculator',
        color: '#fb923c'
    },
    'type-checking': {
        name: 'type()',
        region: 2,
        prerequisites: ['int-float', 'strings'],
        order: 9,
        description: 'Reveal the true nature of any value with the type() inspection spell.',
        icon: 'fas fa-microscope',
        color: '#06b6d4'
    },
    'type-conversion': {
        name: 'Type Conversion',
        region: 2,
        prerequisites: ['type-checking'],
        order: 10,
        description: 'Transform one type into another — str(), int(), float().',
        icon: 'fas fa-exchange-alt',
        color: '#f472b6'
    },
    'arithmetic': {
        name: 'Arithmetic',
        region: 2,
        prerequisites: ['int-float'],
        order: 11,
        description: 'The ancient math operations — +, -, *, /, //, %, **.',
        icon: 'fas fa-plus-minus',
        color: '#818cf8'
    },
    'lists': {
        name: 'Lists',
        region: 3,
        prerequisites: ['variables'],
        order: 12,
        description: 'Ordered collections — like a shelf of labeled potions.',
        icon: 'fas fa-list-ol',
        color: '#fb923c'
    },
    'indexing': {
        name: 'Indexing',
        region: 3,
        prerequisites: ['lists'],
        order: 13,
        description: 'Access any element by its position — starting from 0.',
        icon: 'fas fa-hand-pointer',
        color: '#4ade80'
    },
    'list-methods': {
        name: 'List Methods',
        region: 3,
        prerequisites: ['lists'],
        order: 14,
        description: '.append(), .pop(), .index() — manipulate your collections.',
        icon: 'fas fa-tools',
        color: '#e879f9'
    },
    'for-loops': {
        name: 'for Loops',
        region: 3,
        prerequisites: ['lists'],
        order: 15,
        description: 'Walk through every element — the wizard\'s torch.',
        icon: 'fas fa-sync-alt',
        color: '#22d3ee'
    },
    'conditionals': {
        name: 'if/elif/else',
        region: 4,
        prerequisites: ['variables'],
        order: 16,
        description: 'The wizard\'s crossroads — choose your path based on conditions.',
        icon: 'fas fa-code-branch',
        color: '#e879f9'
    },
    'comparison': {
        name: 'Comparison Operators',
        region: 4,
        prerequisites: ['conditionals'],
        order: 17,
        description: '==, !=, <, >, <=, >= — the tools of judgment.',
        icon: 'fas fa-balance-scale',
        color: '#94a3b8'
    },
    'boolean-logic': {
        name: 'Boolean Logic',
        region: 4,
        prerequisites: ['conditionals'],
        order: 18,
        description: 'True and False — and, or, not — the ultimate truth.',
        icon: 'fas fa-toggle-on',
        color: '#f97316'
    },
    'color-mixing': {
        name: 'Color Mixing',
        region: 4,
        prerequisites: ['rgb', 'conditionals'],
        order: 19,
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
