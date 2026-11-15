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
import { CHAPTER_ONE_BASICS } from './chapterOneBasics.js';
import { withStageStory } from './stageStories.js';

export const REGIONS = {
    1: {
        id: 1,
        name: 'THE RED FOREST',
        subtitle: 'The Apprentice Path',
        description: 'Learn Python spellcraft: output, values, strings, decisions, loops, and functions.',
        stages: [
            { id: 1, name: 'The Awakening Altar',    type: 'lesson',    icon: 'fas fa-shoe-prints',      description: 'Master grid movement and learn the first incantation: print().' },
            { id: 2, name: "The Alchemist's Flasks", type: 'lesson',    icon: 'fas fa-flask',            description: 'Sort variables into Flasks (str, int, float, bool) with real type validation.' },
            { id: 3, name: 'The Whispering Runes',   type: 'challenge', icon: 'fas fa-feather-alt',      description: 'Use a variable and an f-string to greet Eldrin.' },
            { id: 4, name: 'The Forked Path',        type: 'challenge', icon: 'fas fa-code-branch',      description: 'Use booleans and if/else to choose a route.' },
            { id: 5, name: 'Echo Grove',             type: 'challenge', icon: 'fas fa-sync-alt',         description: 'Count a list of steps with a for loop.' },
            { id: 6, name: 'Spell Workshop',         type: 'challenge', icon: 'fas fa-magic',            description: 'Build a reusable Python function with a parameter.' },
            { id: 7, name: 'The Apprentice Gate',    type: 'boss',      icon: 'fas fa-crown',            description: 'Combine Python basics to open the gate without RGB spells.' }
        ]
    },
    2: {
        id: 2,
        name: "THE SCHOLAR'S ARCHIVE",
        subtitle: 'The Chromatic Archive',
        description: 'Begin computer vision with RGB pixels, color changes, brightness, inversion, and grayscale.',
        stages: [
            { id: 1, name: 'The Faded Manuscript', type: 'lesson', icon: 'fas fa-scroll', description: 'Brighten a faded manuscript with RGB arithmetic.' },
            { id: 2, name: 'The Tinted Lenses', type: 'challenge', icon: 'fas fa-eye', description: 'Tint two lenses by changing one color channel at a time.' },
            { id: 3, name: 'The Mirror Gallery', type: 'challenge', icon: 'fas fa-images', description: 'Invert the colors of two enchanted reflections.' },
            { id: 4, name: 'Gray Memory', type: 'challenge', icon: 'fas fa-image', description: 'Restore two image panels in grayscale.' },
            { id: 5, name: 'The Palette Lock', type: 'challenge', icon: 'fas fa-lock', description: 'Brighten one lock and turn another to grayscale.' },
            { id: 6, name: 'The Color Mixer', type: 'challenge', icon: 'fas fa-tint', description: 'Mix RGB channels to restore the Golden Relic.' },
            { id: 7, name: 'Pixel Trail', type: 'challenge', icon: 'fas fa-route', description: 'Use a loop to recolor two pixels in a row.' },
            { id: 8, name: 'The Living Atlas', type: 'boss', icon: 'fas fa-book-open', description: 'Restore two Atlas pages and open the final gate.' }
        ]
    },
    3: {
        id: 3,
        name: 'WHISPERING CAVERNS',
        subtitle: 'The Matrix',
        description: 'Decode image pixels on cavern rune walls with lists, indexing, loops, and pattern searches.',
        stages: [
            { id: 1, name: 'The Inscription Wall',   type: 'lesson',    icon: 'fas fa-th-list',         description: 'Learn about lists and how to create them.' },
            { id: 2, name: 'Rune Positions',          type: 'challenge', icon: 'fas fa-hand-pointer',    description: 'Use pixel positions to repair a scrambled image.' },
            { id: 3, name: 'The Matrix Search',       type: 'challenge', icon: 'fas fa-search',          description: 'Find values in lists using .index().' },
            { id: 4, name: 'The Echo Loop',           type: 'lesson',    icon: 'fas fa-sync-alt',        description: 'Learn for loops to iterate over lists.' },
            { id: 5, name: 'Broken Arrays',           type: 'challenge', icon: 'fas fa-bug',             description: 'Repair a broken pixel processing loop.' },
            { id: 6, name: 'The Hidden Pattern',      type: 'challenge', icon: 'fas fa-chess-board',     description: 'Find a repeated color pattern in the rune image.' },
            { id: 7, name: 'The Cavern Trial',        type: 'boss',      icon: 'fas fa-crown',           description: 'Find the strongest red pixel and restore the cavern image.' }
        ]
    },
    4: {
        id: 4,
        name: 'ASH PEAKS',
        subtitle: 'The Light',
        description: 'Climb Ash Peaks and use thresholds, masks, edges, and RGB conditions to restore the Lost Spectrum.',
        stages: [
            { id: 1, name: 'The Crossroads',         type: 'lesson',    icon: 'fas fa-code-branch',     description: 'Learn if/elif/else conditional logic.' },
            { id: 2, name: 'Path Selection',          type: 'challenge', icon: 'fas fa-directions',      description: 'Choose an image filter with if, elif, and else.' },
            { id: 3, name: 'Truth and Lies',          type: 'challenge', icon: 'fas fa-toggle-on',       description: 'Combine boolean masks to reveal hidden pixels.' },
            { id: 4, name: 'Broken Bridges',          type: 'challenge', icon: 'fas fa-bug',             description: 'Repair conditional logic in a broken image mask.' },
            { id: 5, name: 'Shadow Boundaries',       type: 'challenge', icon: 'fas fa-adjust',          description: 'Find color boundaries by comparing neighboring red values.' },
            { id: 6, name: 'The Color Seal',          type: 'challenge', icon: 'fas fa-shield-alt',      description: 'Use a dark-pixel mask to open the seal.' },
            { id: 7, name: 'The Light Convergence',   type: 'boss',      icon: 'fas fa-sun',             description: 'Restore the final image with a conditional RGB filter.' }
        ]
    }
};

const BASE_STAGE_DATA = {
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
                    text: "I am Eldrin. The grimoire led you to THE RED FOREST. Your Python commands can wake this shrine and begin restoring color. First, awaken The Awakening Altar.",
                    emotion: "mysterious"
                },
                {
                    speaker: "Eldrin",
                    text: "Use hero.move_right(n) to walk forward along the stone tiles.",
                    emotion: "encouraging"
                },
                {
                    speaker: "Eldrin",
                    text: "Reach The Awakening Altar at tile (6, 2) and chant the sacred name: print('Lumina') to awaken the shrine!",
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
                { id: 'val-1', value: 'Lumina', display: '"Lumina"', type: 'str', x: 2, y: 3, icon: 'fas fa-gem', color: '#ec4899' },
                { id: 'val-2', value: 255, display: '255', type: 'int', x: 4, y: 3, icon: 'fas fa-dice-d20', color: '#06b6d4' },
                { id: 'val-3', value: 3.14, display: '3.14', type: 'float', x: 6, y: 3, icon: 'fas fa-atom', color: '#10b981' },
                { id: 'val-4', value: true, display: 'True', type: 'bool', x: 8, y: 3, icon: 'fas fa-bolt', color: '#f59e0b' },
            ],
            obstacles: [
                { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
                { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 },
            ]
        },

        storyIntro: {
            sceneName: "The Alchemist's Lab",
            npcName: "Eldrin",
            npcTitle: "Guardian of the Tower",
            npcIcon: "fas fa-flask",
            dialogues: [
                {
                    speaker: "Eldrin",
                    text: "Welcome to the Alchemist's Laboratory! Here, magic is organized by the fundamental nature of Values.",
                    emotion: "welcoming"
                },
                {
                    speaker: "Eldrin",
                    text: "Every piece of data has a TYPE: text in quotes is a String (str), whole numbers are Integers (int), decimals are Floats, and True/False are Booleans (bool).",
                    emotion: "teaching"
                },
                {
                    speaker: "Eldrin",
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
hero.move_down(1)
hero.pick_up()
hero.move_up(1)
hero.put_in("str")

# Step 2: Pick up 255 (Integer at 4, 3) and put in "int" flask at (4, 1)


# Step 3: Pick up 3.14 (Float at 6, 3) and put in "float" flask at (6, 1)


# Step 4: Pick up True (Boolean at 8, 3) and put in "bool" flask at (8, 1)

`,
        completeMessage: "Brilliant! Every value has been categorized into its proper container without a single type mismatch!",

        hints: [
            { level: 1, text: "For each item: walk to its tile -> hero.pick_up() -> walk adjacent to the flask -> hero.put_in('flask_name')" },
            { level: 2, text: "255 is at (4, 3). From (2, 2) walk: hero.move_right(2) -> hero.move_down(1) -> hero.pick_up() -> hero.move_up(1) -> hero.put_in('int')" },
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

    // Python foundations before the Archive introduces RGB image processing.
    ...CHAPTER_ONE_BASICS,

    /* Chapter 2: animated color stages in chapterTwoStages.js */
    ...CHAPTER_TWO_STAGES,

    ...CHAPTER_THREE_FOUR_STAGES
};

export const STAGE_DATA = Object.fromEntries(
    Object.entries(BASE_STAGE_DATA).map(([key, stage]) => [key, withStageStory(stage, key)])
);
