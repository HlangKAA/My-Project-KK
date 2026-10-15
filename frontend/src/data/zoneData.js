/*  ═══════════════════════════════════════════════════
    ZONE DATA — Tile-based world maps for each Region
    Each zone has a tile map, spawn point, and entities
    ═══════════════════════════════════════════════════ */

/**
 * Tile Types:
 *   0 = grass (walkable)
 *   1 = tree (wall)
 *   2 = path (walkable, lighter color)
 *   3 = water (wall, animated)
 *   4 = stone wall (wall)
 *   5 = flowers (walkable, decorative)
 *   6 = dark grass (walkable, variant)
 *   7 = bridge (walkable, over water)
 *   8 = ruins (wall, decorative)
 */

export const TILE_SIZE = 48; // pixels per tile

export const TILE_TYPES = {
    0: { name: 'grass',      walkable: true,  cssClass: 'tile-grass' },
    1: { name: 'tree',       walkable: false, cssClass: 'tile-tree' },
    2: { name: 'path',       walkable: true,  cssClass: 'tile-path' },
    3: { name: 'water',      walkable: false, cssClass: 'tile-water' },
    4: { name: 'stone',      walkable: false, cssClass: 'tile-stone' },
    5: { name: 'flowers',    walkable: true,  cssClass: 'tile-flowers' },
    6: { name: 'dark-grass', walkable: true,  cssClass: 'tile-dark-grass' },
    7: { name: 'bridge',     walkable: true,  cssClass: 'tile-bridge' },
    8: { name: 'ruins',      walkable: false, cssClass: 'tile-ruins' },
};

export const ZONE_DATA = {
    /* ═══════════════════════════════════════
       ZONE 1 — THE RED FOREST
       ═══════════════════════════════════════ */
    1: {
        id: 1,
        name: 'THE RED FOREST',
        subtitle: 'The Awakening',
        description: 'Where all journeys begin. Master print(), variables, f-strings, RGB colors, and functions.',
        theme: 'forest',
        themeColor: '#dc2626',
        ambientParticles: 'red-leaves',
        mapWidth: 22,
        mapHeight: 16,

        // prettier-ignore
        tileMap: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,6,0,0,5,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1],
            [1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,5,0,0,0,0,1,1],
            [1,0,0,5,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,2,2,1,1,0,0,0,0,5,0,0,0,0,1],
            [1,0,5,0,0,0,0,2,2,0,1,1,0,0,0,0,0,0,0,0,0,1],
            [1,1,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,5,0,0,1],
            [1,1,1,0,0,2,2,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
            [1,1,0,0,2,2,0,0,0,0,5,0,1,1,1,1,0,0,0,0,1,1],
            [1,0,0,2,2,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,1],
            [1,0,2,2,0,0,0,5,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
            [1,0,2,0,0,0,0,0,0,0,0,0,5,0,0,0,1,1,1,1,1,1],
            [1,0,2,0,0,5,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,2,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ],

        spawnPoint: { x: 2, y: 13 },

        entities: [
            // ─── NPCs ───
            {
                id: 'npc-eldrin',
                type: 'npc',
                x: 5, y: 11,
                name: 'Eldrin',
                title: 'Guardian of the Tower',
                icon: 'fas fa-hat-wizard',
                spriteColor: '#7c3aed',
                dialog: [
                    { speaker: 'Eldrin', text: 'Traveler... you have found the Lost Forest. Few dare to walk these faded paths.', emotion: 'mysterious' },
                    { speaker: 'Eldrin', text: 'Long ago, the wizards commanded magic through incantations — lines of code woven into spells.', emotion: 'nostalgic' },
                    { speaker: 'Eldrin', text: 'I can teach you the first spell: print() — the power to speak through code.', emotion: 'encouraging' },
                    { speaker: 'Eldrin', text: 'See that sealed door ahead? Speak the name "Lumina" to open it!', emotion: 'pointing' },
                ],
                questId: 'quest-1-1',
            },
            {
                id: 'npc-prism',
                type: 'npc',
                x: 14, y: 5,
                name: 'Prisma',
                title: 'Color Sage',
                icon: 'fas fa-palette',
                spriteColor: '#f43f5e',
                requiresQuest: 'quest-1-1',
                dialog: [
                    { speaker: 'Prisma', text: 'The trees of this forest have lost their color...', emotion: 'sad' },
                    { speaker: 'Prisma', text: 'Only the cast_color spell can restore them. You need RGB values — Red, Green, Blue.', emotion: 'encouraging' },
                    { speaker: 'Prisma', text: 'Each channel ranges from 0 (none) to 255 (maximum). Try casting RED light: hero.cast_color(255, 0, 0)', emotion: 'teaching' },
                ],
                questId: 'quest-1-2',
            },

            // ─── Doors ───
            {
                id: 'door-tower',
                type: 'door',
                x: 9, y: 9,
                name: 'Sealed Tower Door',
                icon: 'fas fa-door-closed',
                state: 'locked',
                requiresQuest: 'quest-1-1',
                unlockedIcon: 'fas fa-door-open',
                interactPrompt: '🚪 This door is sealed by ancient magic...',
            },
            {
                id: 'door-grove',
                type: 'door',
                x: 12, y: 3,
                name: 'Grove Gate',
                icon: 'fas fa-dungeon',
                state: 'locked',
                requiresQuest: 'quest-1-2',
                unlockedIcon: 'fas fa-dungeon',
                interactPrompt: '🌿 The grove is sealed until color returns...',
            },

            // ─── Puzzle spots ───
            {
                id: 'puzzle-bridge',
                type: 'puzzle',
                x: 15, y: 2,
                name: 'The Shifting Bridge',
                icon: 'fas fa-shoe-prints',
                spriteColor: '#0ea5e9',
                questId: 'quest-1-3',
                interactPrompt: '🌉 Press SPACE to approach the Shifting Bridge',
                requiresQuest: 'quest-1-2',
            },

            // ─── Faded trees (change color when quest-1-2 complete) ───
            {
                id: 'faded-tree-1',
                type: 'scenery',
                x: 16, y: 4,
                name: 'Faded Tree',
                icon: 'fas fa-tree',
                defaultColor: '#666',
                restoredColor: '#dc2626',
                restoreOnQuest: 'quest-1-2',
            },
            {
                id: 'faded-tree-2',
                type: 'scenery',
                x: 18, y: 5,
                name: 'Faded Tree',
                icon: 'fas fa-tree',
                defaultColor: '#666',
                restoredColor: '#b91c1c',
                restoreOnQuest: 'quest-1-2',
            },
            {
                id: 'faded-tree-3',
                type: 'scenery',
                x: 19, y: 3,
                name: 'Faded Tree',
                icon: 'fas fa-tree',
                defaultColor: '#666',
                restoredColor: '#ef4444',
                restoreOnQuest: 'quest-1-2',
            },

            // ─── Boss ───
            {
                id: 'boss-guardian',
                type: 'boss',
                x: 18, y: 2,
                name: 'Prism Guardian',
                icon: 'fas fa-dragon',
                spriteColor: '#dc2626',
                questId: 'quest-1-boss',
                requiresQuests: ['quest-1-1', 'quest-1-2', 'quest-1-3'],
                interactPrompt: '⚔️ Press SPACE to challenge the Prism Guardian',
                bossDialog: [
                    { speaker: 'Prism Guardian', text: 'So... a young wizard dares approach the gate?', emotion: 'threatening' },
                    { speaker: 'Prism Guardian', text: 'You must break THREE seals using everything you have learned!', emotion: 'challenging' },
                ],
            },

            // ─── Decorative items ───
            {
                id: 'signpost-1',
                type: 'sign',
                x: 3, y: 12,
                name: 'Signpost',
                icon: 'fas fa-sign',
                text: '↑ Tower of the Lost Spectrum\n→ Eldrin\'s Camp',
            },
            {
                id: 'campfire',
                type: 'scenery',
                x: 6, y: 12,
                name: 'Campfire',
                icon: 'fas fa-fire',
                defaultColor: '#f59e0b',
                animated: true,
            },
        ],
    },

    /* ═══════════════════════════════════════
       ZONE 2 — THE SCHOLAR'S ARCHIVE
       ═══════════════════════════════════════ */
    2: {
        id: 2,
        name: "THE SCHOLAR'S ARCHIVE",
        subtitle: 'Value & Type',
        description: 'Discover the essence of magic. Learn data types, type checking, conversion, and arithmetic.',
        theme: 'archive',
        themeColor: '#16a34a',
        ambientParticles: 'floating-pages',
        mapWidth: 20,
        mapHeight: 15,

        // prettier-ignore
        tileMap: [
            [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
            [4,2,2,2,2,2,4,0,0,0,0,0,4,2,2,2,2,2,2,4],
            [4,2,0,0,0,2,4,0,0,0,0,0,4,2,0,0,0,0,2,4],
            [4,2,0,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0,2,4],
            [4,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,4],
            [4,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,4],
            [4,2,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,4],
            [4,4,4,4,2,0,0,0,0,0,0,0,0,0,0,2,4,4,4,4],
            [4,2,2,2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,4],
            [4,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,4],
            [4,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,4],
            [4,2,0,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0,2,4],
            [4,2,0,0,0,2,4,0,0,0,0,0,4,2,0,0,0,0,2,4],
            [4,2,2,2,2,2,4,0,0,0,0,0,4,2,2,2,2,2,2,4],
            [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
        ],

        spawnPoint: { x: 9, y: 13 },
        entities: [
            {
                id: 'npc-vane',
                type: 'npc',
                x: 9, y: 11,
                name: 'Loremaster Vane',
                title: 'Archive Keeper',
                icon: 'fas fa-book-reader',
                spriteColor: '#059669',
                dialog: [
                    { speaker: 'Loremaster Vane', text: 'Welcome, young scholar, to the Grand Archive of Lost Spectrum.', emotion: 'welcoming' },
                    { speaker: 'Loremaster Vane', text: 'Beyond this hall lie ancient scrolls governed by Value and Type.', emotion: 'wise' },
                    { speaker: 'Loremaster Vane', text: 'Speak with Archivist Theron ahead to learn how variables hold the fundamental elements of code!', emotion: 'encouraging' },
                ],
            },
            {
                id: 'npc-scholar',
                type: 'npc',
                x: 9, y: 6,
                name: 'Archivist Theron',
                title: 'Master of Types',
                icon: 'fas fa-scroll',
                spriteColor: '#16a34a',
                dialog: [
                    { speaker: 'Theron', text: 'Ah, a seeker of truth! Before you weave advanced spells, you must understand Variables.', emotion: 'wise' },
                    { speaker: 'Theron', text: 'Every value has a Type: text in quotes is a String (str), whole numbers are Integers (int), and truth values are Booleans (bool).', emotion: 'teaching' },
                    { speaker: 'Theron', text: 'To store magic, assign values to variables: variable = value. Declare wizard_name, magic_power, and is_ready to awaken this archive!', emotion: 'encouraging' },
                ],
                questId: 'quest-2-1',
            },
            {
                id: 'puzzle-type-checker',
                type: 'puzzle',
                x: 9, y: 2,
                name: 'The Type Checker Pedestal',
                icon: 'fas fa-microscope',
                spriteColor: '#10b981',
                questId: 'quest-2-2',
                requiresQuest: 'quest-2-1',
                interactPrompt: '🔬 Press SPACE to examine the Type Checker Pedestal',
            },
            {
                id: 'sign-archive-dir',
                type: 'sign',
                x: 7, y: 12,
                name: 'Archive Directory',
                icon: 'fas fa-sign',
                text: '↑ Central Rotunda & Archivist Theron\n↑ Pedestal of Types',
            },
            {
                id: 'tome-integers',
                type: 'scenery',
                x: 4, y: 4,
                name: 'Tome of Integers',
                icon: 'fas fa-book',
                defaultColor: '#3b82f6',
            },
            {
                id: 'tome-strings',
                type: 'scenery',
                x: 15, y: 4,
                name: 'Tome of Strings',
                icon: 'fas fa-book-open',
                defaultColor: '#ec4899',
            },
        ],
    },
};
