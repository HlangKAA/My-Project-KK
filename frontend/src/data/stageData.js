/*  ═══════════════════════════════════════════════════
    STAGE DATA — Region-based stage structure
    Enhanced with Gamification stage types, progressive
    hints, XP rewards, and teaching concept tracking
    ═══════════════════════════════════════════════════ */

/**
 * REGIONS: ข้อมูล Region หลัก (ใช้ใน Dashboard + RegionMap)
 * STAGE_DATA: ข้อมูลด่านย่อยทั้งหมด key = "regionId-stageId"
 *
 * Stage Types:
 *   lesson    — NPC สอน concept ใหม่ + ให้ลอง interactive example
 *   guided    — Scaffolded coding: เติม code ในช่องว่าง
 *   challenge — เขียน code จาก scratch ตาม objective
 *   debug     — แก้ code ที่มี bug ให้ทำงานได้
 *   puzzle    — Multiple choice / ordering
 *   boss      — ด่านรวม concept ทั้ง region
 */

import { CHAPTER_TWO_STAGES } from './chapterTwoStages.js';
import { CHAPTER_THREE_FOUR_STAGES } from './chapterThreeFourStages.js';

export const REGIONS = {
    1: {
        id: 1,
        name: 'THE RED FOREST',
        subtitle: 'The Prism Path',
        description: 'Where all journeys begin. Master print(), RGB colors, movement, and combining spells.',
        stages: [
            { id: 1, name: 'The Awakening Altar',    type: 'lesson',    icon: 'fas fa-shoe-prints',      description: 'Master grid movement and learn the first incantation: print().' },
            { id: 2, name: "The Alchemist's Flasks", type: 'challenge', icon: 'fas fa-flask',            description: 'Sort variables into Flasks (str, int, float, bool) with real type validation.' },
            { id: 3, name: 'The Prism Crystals',     type: 'challenge', icon: 'fas fa-gem',              description: 'Navigate the crystal cavern and cast RGB colored light into ancient braziers.' },
            { id: 4, name: 'The Prism Gate',         type: 'boss',      icon: 'fas fa-crown',            description: 'The grand trial: navigate obstacles, cast RGB light, and chant the opening phrase.' },
            { id: 5, name: 'The Sleeping Garden',    type: 'challenge', icon: 'fas fa-seedling',         description: 'Mix red and green light to restore a golden flower.' },
            { id: 6, name: 'The Swapped Canvas',     type: 'challenge', icon: 'fas fa-image',            description: 'Fix swapped RGB channels to color two enchanted frames.' },
            { id: 7, name: 'The Three Seasons',      type: 'challenge', icon: 'fas fa-palette',          description: 'Use variables and movement to color three seasonal relics.' }
        ]
    },
    2: {
        id: 2,
        name: "THE SCHOLAR'S ARCHIVE",
        subtitle: 'The Chromatic Archive',
        description: 'Restore faded images and magical mechanisms with brightness, tint, inversion, and grayscale.',
        stages: [
            { id: 1, name: 'The Faded Manuscript', type: 'lesson', icon: 'fas fa-scroll', description: 'Brighten a faded manuscript with RGB arithmetic.' },
            { id: 2, name: 'The Tinted Lenses', type: 'challenge', icon: 'fas fa-eye', description: 'Tint two lenses by changing one color channel at a time.' },
            { id: 3, name: 'The Mirror Gallery', type: 'challenge', icon: 'fas fa-images', description: 'Invert the colors of two enchanted reflections.' },
            { id: 4, name: 'Gray Memory', type: 'challenge', icon: 'fas fa-image', description: 'Restore a three-panel image in grayscale.' },
            { id: 5, name: 'The Palette Lock', type: 'challenge', icon: 'fas fa-lock', description: 'Combine color transformations to open the prism vault.' },
            { id: 6, name: 'The Living Atlas', type: 'boss', icon: 'fas fa-book-open', description: 'Restore three Atlas pages and open the final gate.' }
        ]
    },
    3: {
        id: 3,
        name: 'ASH PEAKS',
        subtitle: 'The Matrix',
        description: 'Decode image pixels on rune walls with lists, indexing, loops, and pattern searches.',
        stages: [
            { id: 1, name: 'The Inscription Wall',   type: 'lesson',    icon: 'fas fa-th-list',         description: 'Learn about lists and how to create them.' },
            { id: 2, name: 'Rune Positions',          type: 'challenge', icon: 'fas fa-hand-pointer',    description: 'Use pixel positions to repair a scrambled image.' },
            { id: 3, name: 'The Matrix Search',       type: 'challenge', icon: 'fas fa-search',          description: 'Find values in lists using .index().' },
            { id: 4, name: 'The Echo Loop',           type: 'lesson',    icon: 'fas fa-sync-alt',        description: 'Learn for loops to iterate over lists.' },
            { id: 5, name: 'Broken Arrays',           type: 'challenge', icon: 'fas fa-bug',             description: 'Repair a broken pixel processing loop.' },
            { id: 7, name: 'Pixel Trail',             type: 'challenge', icon: 'fas fa-route',           description: 'Walk through a row of pixels and restore each color.' },
            { id: 8, name: 'The Hidden Pattern',      type: 'challenge', icon: 'fas fa-chess-board',     description: 'Find a repeated color pattern in the rune image.' },
            { id: 6, name: 'The Peak Trial',          type: 'boss',      icon: 'fas fa-crown',           description: 'Use lists, indexing, and loops to restore the summit image.' }
        ]
    },
    4: {
        id: 4,
        name: 'WHISPERING CAVERNS',
        subtitle: 'The Light',
        description: 'Use image thresholds, masks, edges, and RGB conditions to restore the Lost Spectrum.',
        stages: [
            { id: 1, name: 'The Crossroads',         type: 'lesson',    icon: 'fas fa-code-branch',     description: 'Learn if/elif/else conditional logic.' },
            { id: 2, name: 'Path Selection',          type: 'challenge', icon: 'fas fa-directions',      description: 'Choose an image filter with if, elif, and else.' },
            { id: 3, name: 'Truth and Lies',          type: 'challenge', icon: 'fas fa-toggle-on',       description: 'Combine boolean masks to reveal hidden pixels.' },
            { id: 4, name: 'Broken Bridges',          type: 'challenge', icon: 'fas fa-bug',             description: 'Repair conditional logic in a broken image mask.' },
            { id: 5, name: 'The Color Mixer',         type: 'challenge', icon: 'fas fa-tint',            description: 'Use conditionals to mix colors dynamically.' },
            { id: 7, name: 'Shadow Boundaries',       type: 'challenge', icon: 'fas fa-adjust',          description: 'Detect light and shadow boundaries between pixels.' },
            { id: 8, name: 'The Color Seal',          type: 'challenge', icon: 'fas fa-shield-alt',      description: 'Combine masks and color mixing to open the seal.' },
            { id: 6, name: 'The Light Convergence',   type: 'boss',      icon: 'fas fa-sun',             description: 'Restore the final image with a conditional RGB filter.' }
        ]
    }
};

export const STAGE_DATA = {
    /* ═══════════════════════════════════════
       REGION 1 — THE RED FOREST
       ═══════════════════════════════════════ */

    // ─── Stage 1-1: Lesson — Movement & print() ───
    '1-1': {
        title: "The Awakening Altar",
        chapter: "Chapter 1: The Awakening",
        location: "The Red Forest — Ancient Shrine",
        stageType: 'lesson',
        difficulty: 1,
        xpReward: 150,
        teachingConcepts: ['print', 'movement'],
        prerequisiteConcepts: [],
        hasStoryIntro: true,

        arena: {
            cols: 8,
            rows: 5,
            theme: 'forest',
            spawn: { x: 1, y: 2 },
            altar: { x: 6, y: 2, name: 'Awakening Altar', keyword: 'Lumina' },
            obstacles: [
                { x: 3, y: 0 }, { x: 4, y: 0 },
                { x: 3, y: 4 }, { x: 4, y: 4 },
            ],
        },

        storyIntro: {
            sceneName: "The Ancient Shrine",
            npcName: "Eldrin",
            npcTitle: "Guardian of the Tower",
            npcIcon: "fas fa-hat-wizard",
            dialogues: [
                {
                    speaker: "Eldrin",
                    text: "The grimoire chose you when Krakk stole the kingdom's colors. I am Eldrin. Here in the Red Forest, your first spells will teach the world to move and shine again.",
                    emotion: "mysterious"
                },
                {
                    speaker: "Eldrin",
                    text: "Use hero.move_right(n) to walk forward along the stone tiles.",
                    emotion: "encouraging"
                },
                {
                    speaker: "Eldrin",
                    text: "Reach the Awakening Altar at tile (6, 2) and chant the sacred name: print('Lumina') to awaken the shrine!",
                    emotion: "pointing"
                }
            ],
            enterButtonText: "Begin Incantation",
            enterButtonIcon: "fas fa-play"
        },

        objective: "Command the wizard to walk to the <span class='highlight'>Awakening Altar</span> at (6, 2) and chant <span class='highlight'>print('Lumina')</span>!",
        initialCode: `# Move your hero to the Awakening Altar at (6, 2)
# and speak the sacred name: "Lumina" using print()

hero.move_right(5)
print("Lumina")
`,
        completeMessage: "The shrine awakens with golden light! The first incantation has been mastered.",

        hints: [
            { level: 1, text: "The wizard starts at (1, 2). The altar is at (6, 2). That is 5 steps right!" },
            { level: 2, text: "Use: hero.move_right(5)" },
            { level: 3, text: "hero.move_right(5)\nprint('Lumina')" }
        ],

        grimoire: [
            {
                leftTitle: "Movement Spells",
                leftIcon: "fas fa-shoe-prints",
                leftContent: `In this realm, you control the wizard through <em style="color:#dc2626">hero movement commands</em>.`,
                leftCode: "hero.move_right(3)  # Move 3 tiles right\nhero.move_left(2)   # Move 2 tiles left\nhero.move_up(1)     # Move 1 tile up\nhero.move_down(2)   # Move 2 tiles down",
                leftNote: "Each step moves 1 grid tile. The numbers tell the hero how many tiles to cross.",
                leftIncantations: [
                    { code: "hero.move_right(n)", desc: "Walk right n tiles" },
                    { code: "hero.move_left(n)", desc: "Walk left n tiles" },
                    { code: "hero.move_up(n)", desc: "Walk up n tiles" },
                    { code: "hero.move_down(n)", desc: "Walk down n tiles" }
                ],
                rightTitle: "The Print Spell",
                rightIcon: "fas fa-comment-dots",
                rightContent: `The <em style="color:#dc2626">print()</em> function speaks your code to the world. Anything inside quotes is spoken aloud.`,
                rightColors: [],
                rightQuote: `"A true wizard speaks with clarity. Speak the name, and the altar shall heed your voice."`
            }
        ],

        skills: [
            { name: "Code Movement", type: "CONTROL", icon: "fas fa-shoe-prints", desc: "Learned to guide character movement through code.", pct: 100 },
            { name: "print()", type: "OUTPUT", icon: "fas fa-comment-dots", desc: "Mastered speaking aloud through code.", pct: 100 }
        ],

        rewards: {
            spellUnlock: 'print',
            titleUnlock: 'Novice Walker',
            outfitPart: null
        }
    },

    // ─── Stage 1-2: Lesson — Variables & Data Types (The Alchemist's Flasks) ───
    '1-2': {
        title: "The Alchemist's Flasks",
        chapter: "Chapter 1: The Alchemist's Lab",
        location: "The Red Forest — Alchemist Laboratory",
        stageType: 'lesson',
        difficulty: 2,
        xpReward: 300,
        teachingConcepts: ['variables', 'data-types'],
        prerequisiteConcepts: ['print', 'movement'],
        hasStoryIntro: true,

        arena: {
            cols: 10,
            rows: 7,
            theme: 'lab',
            spawn: { x: 1, y: 2 },
            flasks: [
                { id: 'str', type: 'str', label: '[str] String', name: 'Flask of Strings', x: 2, y: 1, color: '#ec4899', icon: 'fas fa-quote-right' },
                { id: 'int', type: 'int', label: '[int] Integer', name: 'Flask of Integers', x: 4, y: 1, color: '#06b6d4', icon: 'fas fa-hashtag' },
                { id: 'float', type: 'float', label: '[float] Float', name: 'Flask of Floats', x: 6, y: 1, color: '#10b981', icon: 'fas fa-percentage' },
                { id: 'bool', type: 'bool', label: '[bool] Boolean', name: 'Flask of Booleans', x: 8, y: 1, color: '#f59e0b', icon: 'fas fa-toggle-on' },
            ],
            items: [
                { id: 'val-1', value: 'Lumina', display: '"Lumina"', type: 'str', x: 2, y: 4, icon: 'fas fa-gem', color: '#ec4899' },
                { id: 'val-2', value: 255, display: '255', type: 'int', x: 4, y: 5, icon: 'fas fa-dice-d20', color: '#06b6d4' },
                { id: 'val-3', value: 3.14, display: '3.14', type: 'float', x: 6, y: 4, icon: 'fas fa-atom', color: '#10b981' },
                { id: 'val-4', value: true, display: 'True', type: 'bool', x: 8, y: 5, icon: 'fas fa-bolt', color: '#f59e0b' },
            ],
            obstacles: [
                { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
                { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 },
            ]
        },

        storyIntro: {
            sceneName: "The Alchemist's Lab",
            npcName: "Loremaster Vane",
            npcTitle: "Keeper of Types",
            npcIcon: "fas fa-flask",
            dialogues: [
                {
                    speaker: "Loremaster Vane",
                    text: "Welcome to the Alchemist's Laboratory! Here, magic is organized by the fundamental nature of Values.",
                    emotion: "welcoming"
                },
                {
                    speaker: "Loremaster Vane",
                    text: "Every piece of data has a TYPE: text in quotes is a String (str), whole numbers are Integers (int), decimals are Floats, and True/False are Booleans (bool).",
                    emotion: "teaching"
                },
                {
                    speaker: "Loremaster Vane",
                    text: "Look at the 4 glass flasks along the top wall! Walk to each value crystal on the ground, pick it up with hero.pick_up(), and deposit it into the matching flask with hero.put_in('type'). Beware: putting the wrong type in a flask will trigger a TypeError!",
                    emotion: "encouraging"
                }
            ],
            enterButtonText: "Enter Laboratory",
            enterButtonIcon: "fas fa-flask"
        },

        objective: "Sort all 4 value crystals into their matching Data Type flasks: <span class='highlight'>'str'</span>, <span class='highlight'>'int'</span>, <span class='highlight'>'float'</span>, and <span class='highlight'>'bool'</span>!",
        initialCode: `# The Alchemist's Flasks — Variable Types Sorting
# Available commands:
#   hero.move_right(n), hero.move_left(n), hero.move_up(n), hero.move_down(n)
#   hero.pick_up()
#   hero.put_in("str" | "int" | "float" | "bool")

# Step 1: Pick up "Lumina" (String) and place in [str] flask
hero.move_right(1)
hero.move_down(2)
hero.pick_up()
hero.move_up(2)
hero.put_in("str")

# Step 2: Pick up 255 (Integer at 4, 5) and put in "int" flask at (4, 1)


# Step 3: Pick up 3.14 (Float at 6, 4) and put in "float" flask at (6, 1)


# Step 4: Pick up True (Boolean at 8, 5) and put in "bool" flask at (8, 1)

`,
        completeMessage: "Brilliant! Every value has been categorized into its proper container without a single type mismatch!",

        hints: [
            { level: 1, text: "For each item: walk to its tile -> hero.pick_up() -> walk adjacent to the flask -> hero.put_in('flask_name')" },
            { level: 2, text: "255 is at (4, 5). From (2, 2) walk: hero.move_right(2) -> hero.move_down(3) -> hero.pick_up() -> hero.move_up(3) -> hero.put_in('int')" },
            { level: 3, text: "Flask IDs match their types: 'str', 'int', 'float', 'bool'. Do them one by one!" }
        ],

        grimoire: [
            {
                leftTitle: "Data Types & Flasks",
                leftIcon: "fas fa-flask",
                leftContent: `Just like potions require specific glass flasks, Python values belong to distinct <em style="color:#dc2626">Data Types</em>:`,
                leftCode: '# The 4 Core Types:\nname = "Lumina"    # str (String - text)\npower = 255        # int (Integer - whole number)\nratio = 3.14       # float (Decimal number)\nis_alive = True    # bool (Boolean - True or False)',
                leftNote: "Putting text into a number container causes a TypeError! Always match types.",
                leftIncantations: [
                    { code: 'hero.pick_up()', desc: "Lift item from current tile" },
                    { code: 'hero.put_in("str")', desc: "Place in String flask" },
                    { code: 'hero.put_in("int")', desc: "Place in Integer flask" },
                    { code: 'hero.put_in("float")', desc: "Place in Float flask" },
                    { code: 'hero.put_in("bool")', desc: "Place in Boolean flask" }
                ],
                rightTitle: "Why Types Matter",
                rightIcon: "fas fa-microscope",
                rightContent: `In code, operations depend on type. You can multiply integers, but you cannot subtract strings!`,
                rightColors: ["#ec4899", "#06b6d4", "#10b981", "#f59e0b"],
                rightQuote: `"A string holds words. An integer holds counts. A float measures fractions. A boolean holds truth. Know the essence of what you carry."`
            }
        ],

        skills: [
            { name: "Data Types", type: "KNOWLEDGE", icon: "fas fa-shapes", desc: "Mastered the 4 fundamental Python types: str, int, float, bool.", pct: 100 },
            { name: "Variables", type: "STORAGE", icon: "fas fa-database", desc: "Understood how values are stored in type-safe containers.", pct: 100 }
        ],

        rewards: {
            spellUnlock: 'variables',
            titleUnlock: 'Alchemist Apprentice',
            outfitPart: 'flask_belt'
        }
    },

    // ─── Stage 1-3: Challenge — Color Alchemy (Prism Crystals) ───
    '1-3': {
        title: "The Prism Crystals",
        chapter: "Chapter 1: The Prism Cavern",
        location: "The Red Forest — Crystal Cavern",
        stageType: 'challenge',
        difficulty: 2,
        xpReward: 350,
        teachingConcepts: ['rgb', 'functions-basic'],
        prerequisiteConcepts: ['variables', 'movement'],
        hasStoryIntro: true,

        arena: {
            cols: 10,
            rows: 6,
            theme: 'crystals',
            spawn: { x: 1, y: 2 },
            braziers: [
                { id: 'br-red', name: 'Red Brazier', targetColorName: 'Red (255, 0, 0)', x: 3, y: 2 },
                { id: 'br-green', name: 'Green Brazier', targetColorName: 'Green (0, 255, 0)', x: 6, y: 2 },
                { id: 'br-blue', name: 'Blue Brazier', targetColorName: 'Blue (0, 0, 255)', x: 8, y: 2 },
            ],
            obstacles: [
                { x: 3, y: 0 }, { x: 6, y: 0 }, { x: 8, y: 0 },
                { x: 3, y: 5 }, { x: 6, y: 5 }, { x: 8, y: 5 },
            ]
        },

        storyIntro: {
            sceneName: "The Crystal Cavern",
            npcName: "Prisma",
            npcTitle: "Color Sage",
            npcIcon: "fas fa-palette",
            dialogues: [
                {
                    speaker: "Prisma",
                    text: "You have arrived at the Crystal Cavern. Three elemental braziers stand dark and dormant.",
                    emotion: "mysterious"
                },
                {
                    speaker: "Prisma",
                    text: "Light is made of three RGB channels: Red, Green, and Blue (0 to 255).",
                    emotion: "teaching"
                },
                {
                    speaker: "Prisma",
                    text: "Walk to each brazier and cast its designated pure color: hero.cast_color(r, g, b)!",
                    emotion: "encouraging"
                }
            ],
            enterButtonText: "Ignite the Crystals",
            enterButtonIcon: "fas fa-fire"
        },

        objective: "Walk to all three braziers and cast their matching pure colors: <span class='highlight'>Red (255, 0, 0)</span>, <span class='highlight'>Green (0, 255, 0)</span>, and <span class='highlight'>Blue (0, 0, 255)</span>!",
        initialCode: `# Ignite the three elemental braziers with pure RGB light!
# hero.cast_color(red, green, blue)

# Step 1: Walk to Red Brazier at (3, 2) and cast Red
hero.move_right(2)
hero.cast_color(255, 0, 0)

# Step 2: Walk to Green Brazier at (6, 2) and cast Green


# Step 3: Walk to Blue Brazier at (8, 2) and cast Blue

`,
        completeMessage: "All three braziers blaze with pure light! The spectrum flows through the cavern.",

        hints: [
            { level: 1, text: "Pure Red = (255, 0, 0), Pure Green = (0, 255, 0), Pure Blue = (0, 0, 255)" },
            { level: 2, text: "From Red at (3, 2) to Green at (6, 2), move 3 tiles right!" },
            { level: 3, text: "hero.move_right(2)\nhero.cast_color(255, 0, 0)\nhero.move_right(3)\nhero.cast_color(0, 255, 0)\nhero.move_right(2)\nhero.cast_color(0, 0, 255)" }
        ],

        grimoire: [
            {
                leftTitle: "The RGB Color Model",
                leftIcon: "fas fa-palette",
                leftContent: `Digital magic channels light through three prime elements: <em style="color:#dc2626">Red</em>, <em style="color:#16a34a">Green</em>, and <em style="color:#3b82f6">Blue</em>.`,
                leftCode: "hero.cast_color(255, 0, 0)    # Pure Red\nhero.cast_color(0, 255, 0)    # Pure Green\nhero.cast_color(0, 0, 255)    # Pure Blue\nhero.cast_color(255, 255, 0)  # Yellow (Red + Green)",
                leftNote: "Each channel goes from 0 (completely off) to 255 (maximum glow).",
                leftIncantations: [
                    { code: "hero.cast_color(r, g, b)", desc: "Cast colored light" },
                    { code: "(255, 0, 0)", desc: "Pure Red" },
                    { code: "(0, 255, 0)", desc: "Pure Green" },
                    { code: "(0, 0, 255)", desc: "Pure Blue" }
                ],
                rightTitle: "Color Mixing",
                rightIcon: "fas fa-magic",
                rightContent: `Combining light is additive. Red and Green create Yellow. Red and Blue create Magenta. All three maxed create White.`,
                rightColors: ["#dc2626", "#16a34a", "#3b82f6"],
                rightQuote: `"Light without color is void. Color without knowledge is chaos. Blend them with precision."`
            }
        ],

        skills: [
            { name: "RGB Spectrum", type: "SPECTRUM", icon: "fas fa-palette", desc: "Mastered casting colored light channels.", pct: 100 }
        ],

        rewards: {
            spellUnlock: 'cast_color',
            titleUnlock: 'Chroma Weaver',
            outfitPart: null
        }
    },

    // Stages 1-5 to 1-7: RGB practice before the boss
    '1-5': {
        title: 'The Sleeping Garden',
        chapter: 'Chapter 1: The Sleeping Garden',
        location: 'The Red Forest - Faded Garden',
        stageType: 'challenge',
        difficulty: 2,
        xpReward: 375,
        teachingConcepts: ['rgb'],
        prerequisiteConcepts: ['rgb', 'movement'],
        hasStoryIntro: true,
        arena: {
            cols: 8, rows: 5, theme: 'forest', spawn: { x: 1, y: 2 },
            colorTargets: [
                { id: 'golden-flower', name: 'Golden Flower', icon: 'fas fa-seedling', x: 5, y: 2, targetRgb: [255, 255, 0] }
            ]
        },
        storyIntro: {
            sceneName: 'The Faded Garden',
            npcName: 'Prisma',
            npcTitle: 'Color Sage',
            npcIcon: 'fas fa-palette',
            dialogues: [
                { speaker: 'Prisma', text: 'The flower has lost its golden glow. Mix red and green light to bring it back.', emotion: 'teaching' }
            ],
            enterButtonText: 'Restore the Garden',
            enterButtonIcon: 'fas fa-seedling'
        },
        objective: 'Walk beside the Golden Flower at (5, 2) and restore its yellow light with hero.cast_color(255, 255, 0).',
        initialCode: '# The flower needs yellow light (red + green).\n# Walk beside the flower at (5, 2), then cast its color.\n\n',
        completeMessage: 'Golden light returns to the Sleeping Garden!',
        hints: [
            { level: 1, text: 'Yellow light combines full red and full green, with no blue.' },
            { level: 2, text: 'Move right 4 tiles from (1, 2) to reach the flower.' },
            { level: 3, text: 'hero.move_right(4)\nhero.cast_color(255, 255, 0)' }
        ],
        grimoire: [{
            leftTitle: 'Mixing Yellow Light', leftIcon: 'fas fa-palette',
            leftContent: 'RGB channels each range from 0 to 255. Red plus green light makes yellow.',
            leftCode: 'hero.cast_color(255, 255, 0)',
            leftNote: 'Stand on or next to a faded object before casting.',
            leftIncantations: [{ code: 'hero.cast_color(r, g, b)', desc: 'Restore an object with RGB light' }],
            rightTitle: 'The Golden Flower', rightIcon: 'fas fa-seedling',
            rightContent: 'Its glow returns only when all three RGB channels match the target.',
            rightColors: ['#ff0000', '#00ff00', '#ffff00']
        }],
        skills: [{ name: 'Yellow Light', type: 'SPECTRUM', icon: 'fas fa-palette', desc: 'Mixed red and green light.', pct: 100 }],
        rewards: { spellUnlock: null, titleUnlock: 'Garden Restorer', outfitPart: null }
    },

    '1-6': {
        title: 'The Swapped Canvas',
        chapter: 'Chapter 1: The Swapped Canvas',
        location: 'The Red Forest - Gallery Clearing',
        stageType: 'challenge',
        difficulty: 2,
        xpReward: 400,
        teachingConcepts: ['rgb'],
        prerequisiteConcepts: ['rgb', 'movement'],
        hasStoryIntro: true,
        arena: {
            cols: 9, rows: 5, theme: 'forest', spawn: { x: 1, y: 2 },
            colorTargets: [
                { id: 'red-frame', name: 'Red Frame', icon: 'fas fa-image', x: 3, y: 2, targetRgb: [255, 0, 0] },
                { id: 'blue-frame', name: 'Blue Frame', icon: 'fas fa-image', x: 7, y: 2, targetRgb: [0, 0, 255] }
            ]
        },
        storyIntro: {
            sceneName: 'The Gallery Clearing',
            npcName: 'Prisma',
            npcTitle: 'Color Sage',
            npcIcon: 'fas fa-palette',
            dialogues: [
                { speaker: 'Prisma', text: 'The painter swapped red and blue. Correct the two spells to restore both frames.', emotion: 'pointing' }
            ],
            enterButtonText: 'Repair the Frames',
            enterButtonIcon: 'fas fa-image'
        },
        objective: 'Fix the two color spells. The frame at (3, 2) needs red (255, 0, 0); the frame at (7, 2) needs blue (0, 0, 255).',
        initialCode: '# The painter swapped red and blue. Fix both calls!\nhero.move_right(2)\nhero.cast_color(0, 0, 255)  # Red Frame\nhero.move_right(4)\nhero.cast_color(255, 0, 0)  # Blue Frame\n',
        completeMessage: 'Both frames shine with their proper colors!',
        hints: [
            { level: 1, text: 'The argument order is red, green, blue.' },
            { level: 2, text: 'The first frame needs full red; the second needs full blue.' },
            { level: 3, text: 'Use (255, 0, 0) at the first frame and (0, 0, 255) at the second.' }
        ],
        grimoire: [{
            leftTitle: 'RGB Channel Order', leftIcon: 'fas fa-code',
            leftContent: 'hero.cast_color always takes red first, green second, and blue third.',
            leftCode: 'hero.cast_color(255, 0, 0)  # Red\nhero.cast_color(0, 0, 255)  # Blue',
            leftNote: 'A spell can run without an error and still produce the wrong color.',
            leftIncantations: [{ code: 'hero.cast_color(r, g, b)', desc: 'Cast channels in RGB order' }],
            rightTitle: 'Repair Both Frames', rightIcon: 'fas fa-image',
            rightContent: 'Each frame is checked independently. A wrong color can be painted over.',
            rightColors: ['#ff0000', '#0000ff']
        }],
        skills: [{ name: 'RGB Debugging', type: 'LOGIC', icon: 'fas fa-bug', desc: 'Corrected swapped color channels.', pct: 100 }],
        rewards: { spellUnlock: null, titleUnlock: 'Canvas Keeper', outfitPart: null }
    },

    '1-7': {
        title: 'The Three Seasons',
        chapter: 'Chapter 1: The Three Seasons',
        location: 'The Red Forest - Seasonal Grove',
        stageType: 'challenge',
        difficulty: 3,
        xpReward: 450,
        teachingConcepts: ['rgb', 'variables', 'movement'],
        prerequisiteConcepts: ['rgb', 'variables', 'movement'],
        hasStoryIntro: true,
        arena: {
            cols: 10, rows: 5, theme: 'forest', spawn: { x: 1, y: 2 },
            colorTargets: [
                { id: 'summer', name: 'Summer Relic', icon: 'fas fa-sun', x: 2, y: 2, targetRgb: [255, 255, 0] },
                { id: 'spring', name: 'Spring Relic', icon: 'fas fa-leaf', x: 5, y: 2, targetRgb: [0, 255, 255] },
                { id: 'autumn', name: 'Autumn Relic', icon: 'fas fa-gem', x: 8, y: 2, targetRgb: [255, 0, 255] }
            ]
        },
        storyIntro: {
            sceneName: 'The Seasonal Grove',
            npcName: 'Prisma',
            npcTitle: 'Color Sage',
            npcIcon: 'fas fa-palette',
            dialogues: [
                { speaker: 'Prisma', text: 'Three relics await yellow, cyan, and magenta light. Restore them, and the path to the Scholar\'s Archive will finally open.', emotion: 'encouraging' },
                { speaker: 'Prisma', text: 'Krakk took more than colors. He tried to erase every story they carried. Vane may know where the stolen light went.', emotion: 'mysterious' }
            ],
            enterButtonText: 'Restore the Relics',
            enterButtonIcon: 'fas fa-magic'
        },
        objective: 'Color the relics at (2, 2), (5, 2), and (8, 2): yellow (255, 255, 0), cyan (0, 255, 255), and magenta (255, 0, 255).',
        initialCode: '# Use variables to keep track of each RGB channel.\nred = 255\ngreen = 255\nblue = 0\n\nhero.move_right(1)\nhero.cast_color(red, green, blue)  # Summer: yellow\n\n# Move to Spring and cast cyan, then Autumn and cast magenta.\n',
        completeMessage: 'All three seasons return to the grove. The path to the Scholar\'s Archive opens!',
        hints: [
            { level: 1, text: 'Cyan is green plus blue. Magenta is red plus blue.' },
            { level: 2, text: 'The relics stand 3 tiles apart along row 2.' },
            { level: 3, text: 'After yellow: move_right(3), cast (0, 255, 255), move_right(3), cast (255, 0, 255).' }
        ],
        grimoire: [{
            leftTitle: 'Secondary Colors', leftIcon: 'fas fa-palette',
            leftContent: 'Pair two full-strength RGB channels to make yellow, cyan, or magenta.',
            leftCode: 'red = 255\ngreen = 255\nblue = 0\nhero.cast_color(red, green, blue)',
            leftNote: 'You can store channel values in variables and reuse them.',
            leftIncantations: [{ code: 'hero.cast_color(r, g, b)', desc: 'Restore the nearby relic' }],
            rightTitle: 'Three Relics', rightIcon: 'fas fa-gem',
            rightContent: 'Visit each relic and match its exact RGB channels.',
            rightColors: ['#ffff00', '#00ffff', '#ff00ff']
        }],
        skills: [{ name: 'Seasonal Spectrum', type: 'SPECTRUM', icon: 'fas fa-palette', desc: 'Restored three secondary colors.', pct: 100 }],
        rewards: { spellUnlock: null, titleUnlock: 'Season Weaver', outfitPart: null }
    },

    // Stage 1-4: Boss Trial - The Prism Gate
    '1-4': {
        title: "The Prism Gate",
        chapter: "Chapter 1: The Grand Trial",
        location: "The Red Forest — The Great Prism Gate",
        stageType: 'boss',
        difficulty: 3,
        xpReward: 500,
        teachingConcepts: ['print', 'variables', 'movement', 'rgb', 'f-strings'],
        prerequisiteConcepts: ['print', 'variables', 'movement', 'rgb'],
        hasStoryIntro: true,

        arena: {
            cols: 11,
            rows: 6,
            theme: 'gate',
            spawn: { x: 0, y: 3 },
            gate: { x: 10, y: 3, name: 'The Prism Gate', locked: true },
            braziers: [
                { id: 'gate-brazier', name: 'Gate Guardian Brazier', targetColorName: 'Red (255, 0, 0)', x: 5, y: 3 }
            ],
            items: [
                { id: 'gate-key', value: 'SPECTRUM_KEY', display: '"SPECTRUM_KEY"', type: 'str', x: 2, y: 1, icon: 'fas fa-key', color: '#f59e0b' }
            ],
            flasks: [
                { id: 'str', type: 'str', label: '[str] Lock Flask', name: 'Flask of Key', x: 2, y: 5, color: '#f59e0b', icon: 'fas fa-lock-open' }
            ],
            obstacles: [
                { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 4 }, { x: 4, y: 5 },
                { x: 8, y: 0 }, { x: 8, y: 1 }, { x: 8, y: 4 }, { x: 8, y: 5 },
            ]
        },

        storyIntro: {
            sceneName: "The Great Prism Gate",
            npcName: "Eldrin",
            npcTitle: "High Sentinel",
            npcIcon: "fas fa-crown",
            dialogues: [
                {
                    speaker: "Eldrin",
                    text: "You have reached the inner Prism Gate. Beyond it lie the last faded groves of the Red Forest; restore them before taking the road to the Archive.",
                    emotion: "impressed"
                },
                {
                    speaker: "Eldrin",
                    text: "To unlock the gate, you must synthesize every art you have mastered: navigate past stone barriers, collect the Key and insert it into the Lock Flask, cast pure Red light (255, 0, 0) into the Guardian Brazier, walk to the Gate, and chant the opening spell!",
                    emotion: "encouraging"
                }
            ],
            enterButtonText: "Face the Boss Trial",
            enterButtonIcon: "fas fa-crown"
        },

        objective: "1. Pick up the Key at (2, 1) and put it into the Lock Flask at (2, 5)<br/>2. Navigate to the Brazier at (5, 3) and cast <span class='highlight'>hero.cast_color(255, 0, 0)</span><br/>3. Walk to the Gate at (10, 3) and chant: <span class='highlight'>print(f'Open, {spell}!')</span>",

        initialCode: `# The Prism Gate — Boss Trial
# Combine: Movement + Variables + Flasks + RGB Light + f-strings!

spell = "The Prism Gate"

# Step 1: Collect the Key at (2, 1) and deposit it into the 'str' Lock Flask at (2, 5)
hero.move_right(2)
hero.move_up(2)
hero.pick_up()
hero.move_down(4)
hero.put_in("str")

# Step 2: Navigate around the stone wall to the Brazier at (5, 3) and cast Red light
hero.move_up(2)
hero.move_right(3)
hero.cast_color(255, 0, 0)

# Step 3: Move to the Gate at (10, 3) and chant using f-string
hero.move_right(5)
print(f"Open, {spell}!")
`,

        completeMessage: "The inner Prism Gate opens! The final groves still wait for your light.",

        hints: [
            { level: 1, text: "Break the challenge into steps: (1) Key to flask, (2) Walk to Brazier and cast (255, 0, 0), (3) Walk to gate and print." },
            { level: 2, text: "To avoid the stone wall at x=4, you can move straight through the corridor at y=3 between the walls!" },
            { level: 3, text: "Make sure you print: print(f\"Open, {spell}!\") with spell = 'The Prism Gate'." }
        ],

        validateOutput: (outputLines) => {
            return outputLines.some(line => line.includes('Open, The Prism Gate!'));
        },

        grimoire: [
            {
                leftTitle: "The Grand Synthesis",
                leftIcon: "fas fa-crown",
                leftContent: `True mastery is not knowing a single incantation, but weaving them into a harmonious symphony: Movement, Variables, Types, and Colors.`,
                leftCode: `spell = "The Prism Gate"\nhero.move_right(2)\nhero.pick_up()\nhero.put_in("str")\nhero.cast_color(255, 0, 0)\nprint(f"Open, {spell}!")`,
                leftNote: "Each step prepares the realm for the final opening chant.",
                leftIncantations: [
                    { code: "hero.move_right(n)", desc: "Move hero forward" },
                    { code: "hero.pick_up()", desc: "Collect item" },
                    { code: "hero.put_in('str')", desc: "Deposit into Flask" },
                    { code: "hero.cast_color(r, g, b)", desc: "Ignite brazier" },
                    { code: 'print(f"Open, {spell}!")', desc: "Chant opening incantation" }
                ],
                rightTitle: "Region 1 Mastery",
                rightIcon: "fas fa-trophy",
                rightContent: `You have completed the entire Prism Path in the Red Forest. Your spells now run real-time within the arena.`,
                rightColors: ["#dc2626", "#06b6d4", "#f59e0b"],
                rightQuote: `"The light was never lost. It was waiting for a wizard who could speak its language."`
            }
        ],

        skills: [
            { name: "Prism Gatekeeper", type: "MASTERY", icon: "fas fa-crown", desc: "Conquered the Red Forest Boss Trial!", pct: 100 }
        ],

        rewards: {
            spellUnlock: 'f-strings',
            titleUnlock: 'Adept of the Prism',
            outfitPart: 'red_robe'
        }
    },


    /* Chapter 2: animated color stages in chapterTwoStages.js */
    ...CHAPTER_TWO_STAGES,

    ...CHAPTER_THREE_FOUR_STAGES
};
