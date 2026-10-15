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
            { id: 4, name: 'The Prism Gate',         type: 'boss',      icon: 'fas fa-crown',            description: 'The grand trial: navigate obstacles, cast RGB light, and chant the opening phrase.' }
        ]
    },
    2: {
        id: 2,
        name: "THE SCHOLAR'S ARCHIVE",
        subtitle: 'Value & Type',
        description: 'Discover the essence of magic. Learn data types and type checking.',
        stages: [
            { id: 1, name: 'The Essence of Values',  type: 'lesson',    icon: 'fas fa-scroll',          description: 'Learn how to declare variables and understand data types.' },
            { id: 2, name: 'The Type Checker',        type: 'guided',    icon: 'fas fa-microscope',      description: 'Use type() to inspect variables and verify their nature.' }
        ]
    },
    3: {
        id: 3,
        name: 'ASH PEAKS',
        subtitle: 'The Matrix',
        description: 'Navigate the ancient arrays inscribed upon the mountain walls. Master lists, indexing, and loops.',
        stages: [
            { id: 1, name: 'The Inscription Wall',   type: 'lesson',    icon: 'fas fa-th-list',         description: 'Learn about lists and how to create them.' },
            { id: 2, name: 'Rune Positions',          type: 'guided',    icon: 'fas fa-hand-pointer',    description: 'Practice indexing with guided exercises.' },
            { id: 3, name: 'The Matrix Search',       type: 'challenge', icon: 'fas fa-search',          description: 'Find values in lists using .index().' },
            { id: 4, name: 'The Echo Loop',           type: 'lesson',    icon: 'fas fa-sync-alt',        description: 'Learn for loops to iterate over lists.' },
            { id: 5, name: 'Broken Arrays',           type: 'debug',     icon: 'fas fa-bug',             description: 'Fix errors in list operations.' },
            { id: 6, name: 'The Peak Trial',          type: 'boss',      icon: 'fas fa-crown',           description: 'Navigate the matrix using all your list skills.' }
        ]
    },
    4: {
        id: 4,
        name: 'WHISPERING CAVERNS',
        subtitle: 'The Light',
        description: 'Master conditionals, boolean logic, and color mixing to restore the Lost Spectrum.',
        stages: [
            { id: 1, name: 'The Crossroads',         type: 'lesson',    icon: 'fas fa-code-branch',     description: 'Learn if/elif/else conditional logic.' },
            { id: 2, name: 'Path Selection',          type: 'guided',    icon: 'fas fa-directions',      description: 'Practice writing conditionals with guidance.' },
            { id: 3, name: 'Truth and Lies',          type: 'puzzle',    icon: 'fas fa-toggle-on',       description: 'Test your boolean logic understanding.' },
            { id: 4, name: 'Broken Bridges',          type: 'debug',     icon: 'fas fa-bug',             description: 'Fix broken conditional logic.' },
            { id: 5, name: 'The Color Mixer',         type: 'challenge', icon: 'fas fa-tint',            description: 'Use conditionals to mix colors dynamically.' },
            { id: 6, name: 'The Light Convergence',   type: 'boss',      icon: 'fas fa-sun',             description: 'Cast White light to restore the Lost Spectrum!' }
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
                    text: "Traveler... welcome to the Red Forest. In this realm, wizards do not walk by thought alone — we command our steps through CODE.",
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

    // ─── Stage 1-4: Boss Trial — The Prism Gate ───
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
                    text: "You have arrived at the Great Prism Gate, apprentice! Beyond this barrier lies the Scholar's Archive.",
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

        completeMessage: "THE PRISM GATE SHATTERS! The Red Forest is restored, and the way to the Scholar's Archive is unlocked. You have proven yourself a true Adept!",

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


    /* ═══════════════════════════════════════
       REGION 2 — THE SCHOLAR'S ARCHIVE
       ═══════════════════════════════════════ */

    // ─── Stage 2-1: Lesson — Data Types ───
    '2-1': {
        title: "The Essence of Values",
        chapter: "Chapter 2: The Foundation",
        location: "The Scholar's Archive — Main Hall",
        stageType: 'lesson',
        difficulty: 2,
        xpReward: 200,
        teachingConcepts: ['int-float'],
        prerequisiteConcepts: ['variables'],
        hasStoryIntro: true,

        storyIntro: {
            sceneName: "The Scholar's Archive",
            npcName: "Loremaster Vane",
            npcTitle: "Keeper of Types",
            npcIcon: "fas fa-book-reader",
            dialogues: [
                {
                    speaker: "Loremaster Vane",
                    text: "Ah, a new apprentice. Welcome to the Archive. Here, we study the fundamental nature of magical energy.",
                    emotion: "calm"
                },
                {
                    speaker: "Loremaster Vane",
                    text: "You have learned to store magic in Variables. But do you know what kind of magic you are storing?",
                    emotion: "questioning"
                },
                {
                    speaker: "Loremaster Vane",
                    text: "Magic comes in different forms, or 'Types'. An Integer is a solid number. A String is woven text. A Boolean is the ultimate truth or falsehood.",
                    emotion: "serious"
                },
                {
                    speaker: "Loremaster Vane",
                    text: "For your first task here, declare a simple Integer. Prove you understand the essence of a value.",
                    emotion: "encouraging"
                }
            ],
            enterButtonText: "Enter the Archive",
            enterButtonIcon: "fas fa-scroll"
        },

        objective: "Declare a variable named <span class='highlight'>magic_number</span> and assign it the integer value <span class='highlight'>42</span>. Then print it.",
        initialCode: "# Declare your variable below\n\n\n# Print the value to verify\n",
        completeMessage: "A solid Integer! The Archive accepts your offering.",

        hints: [
            { level: 1, text: "An integer is a whole number, written without quotes: 42" },
            { level: 2, text: "Declare: magic_number = 42, then print it." },
            { level: 3, text: "magic_number = 42\nprint(magic_number)" }
        ],

        validateOutput: (outputLines) => {
            return outputLines.some(line => line.includes('42'));
        },

        grimoire: [
            {
                leftTitle: "Data Types: Integers & Strings",
                leftIcon: "fas fa-shapes",
                leftContent: `Every piece of data has a <em style="color:#dc2626">Type</em>. Integers are whole numbers. Strings are text.`,
                leftCode: "age = 25       # Integer\nname = 'Mage'  # String\npi = 3.14      # Float",
                leftNote: "Strings must be wrapped in quotes. Integers and floats are written plainly.",
                leftIncantations: [
                    { code: "x = 10", desc: "Integer" },
                    { code: "s = 'Hello'", desc: "String" },
                    { code: "f = 3.14", desc: "Float" },
                    { code: "b = True", desc: "Boolean" }
                ],
                rightTitle: "The Importance of Form",
                rightIcon: "fas fa-balance-scale",
                rightContent: `Each type has its own rules. You cannot add a String and an Integer without conversion.`,
                rightColors: [],
                rightQuote: `"Know the nature of your magic before you cast it. A misunderstood spell is a dangerous one."`
            }
        ],

        skills: [
            { name: "Data Types", type: "KNOWLEDGE", icon: "fas fa-shapes", desc: "Understood fundamental data types.", pct: 80 }
        ],

        rewards: {
            spellUnlock: 'type',
            titleUnlock: null,
            outfitPart: null
        }
    },

    // ─── Stage 2-2: Guided — type() ───
    '2-2': {
        title: "The Type Checker",
        chapter: "Chapter 2: Inspection",
        location: "The Scholar's Archive — Inspectory",
        stageType: 'guided',
        difficulty: 2,
        xpReward: 200,
        teachingConcepts: ['type-checking'],
        prerequisiteConcepts: ['int-float', 'strings'],
        hasStoryIntro: false,

        objective: "Fill in the blanks to use <span class='highlight'>type()</span> and reveal the type of each variable.",
        guidedInstruction: "Complete the code by filling in the type() calls.",

        codeTemplate: 'number = 42\nword = "Hello"\n\n# Reveal the type of each variable\nprint(___BLANK_1___)\nprint(___BLANK_2___)',
        blanks: [
            { id: 'BLANK_1', answer: 'type(number)', acceptableAnswers: ['type(number)'], hint: 'Use type() with the variable name inside.' },
            { id: 'BLANK_2', answer: 'type(word)', acceptableAnswers: ['type(word)'], hint: 'Use type() with the variable name inside.' }
        ],
        expectedOutput: "<class 'int'>\n<class 'str'>",

        hints: [
            { level: 1, text: "type() takes a variable and returns its type. Put the variable name inside the parentheses." },
            { level: 2, text: "print(type(variable_name)) shows the type in the console." },
            { level: 3, text: "Blanks: type(number) and type(word)" }
        ],

        completeMessage: "The nature of the values has been revealed!",

        validateOutput: (outputLines) => {
            const hasInt = outputLines.some(line => line.includes("<class 'int'>"));
            const hasStr = outputLines.some(line => line.includes("<class 'str'>"));
            return hasInt && hasStr;
        },

        grimoire: [
            {
                leftTitle: "The Type() Spell",
                leftIcon: "fas fa-search",
                leftContent: `The <em style="color:#dc2626">type()</em> spell reveals the underlying class of any value.`,
                leftCode: "x = 10\nprint(type(x))  # <class 'int'>",
                leftNote: "Useful for debugging when your spells misbehave.",
                leftIncantations: [
                    { code: "type(10)", desc: "Returns int" },
                    { code: "type('hi')", desc: "Returns str" },
                    { code: "type(3.14)", desc: "Returns float" },
                    { code: "type(True)", desc: "Returns bool" }
                ],
                rightTitle: "Inspection",
                rightIcon: "fas fa-eye",
                rightContent: `A wise wizard always inspects foreign artifacts before using them.`,
                rightColors: [],
                rightQuote: `"The eye of the beholder sees the surface. The type() spell sees the soul."`
            }
        ],

        skills: [
            { name: "type()", type: "INSPECTION", icon: "fas fa-microscope", desc: "Mastered type inspection.", pct: 100 }
        ],

        rewards: {
            spellUnlock: null,
            titleUnlock: null,
            outfitPart: null
        }
    },

    // ─── Stage 2-3: Debug — Type Errors ───
    '2-3': {
        title: "Mixed Potions",
        chapter: "Chapter 2: Mixed Potions",
        location: "The Scholar's Archive — Potion Lab",
        stageType: 'debug',
        difficulty: 2,
        xpReward: 250,
        teachingConcepts: ['type-checking'],
        prerequisiteConcepts: ['type-checking', 'int-float', 'strings'],
        hasStoryIntro: false,

        objective: "Fix the <span class='highlight'>2 bugs</span> in this potion recipe so it correctly calculates and prints: <span class='highlight'>Total: 75</span>",

        buggyCode: '# Potion recipe calculator\nbase_power = "50"\nboost = 25\n\ntotal = base_power + boost\nprint("Total: " + total)',
        bugCount: 2,
        bugDescriptions: [
            'Line 2: base_power is a string "50", not an integer — it should be converted',
            'Line 6: Cannot concatenate string and integer — convert total to string'
        ],

        initialCode: '# Potion recipe calculator\nbase_power = "50"\nboost = 25\n\ntotal = base_power + boost\nprint("Total: " + total)',

        hints: [
            { level: 1, text: "Look at line 2: \"50\" with quotes is a string, not a number!" },
            { level: 2, text: "Use int() to convert a string to integer: int(\"50\") → 50" },
            { level: 3, text: "Fix 1: base_power = int(\"50\") or base_power = 50. Fix 2: print(\"Total: \" + str(total))" }
        ],

        completeMessage: "The potion is brewed correctly! Type awareness is crucial for a wizard.",

        validateOutput: (outputLines) => {
            return outputLines.some(line => line.includes('Total: 75'));
        },

        grimoire: [
            {
                leftTitle: "Type Errors",
                leftIcon: "fas fa-exclamation-triangle",
                leftContent: `Mixing types without conversion causes <em style="color:#dc2626">TypeError</em>. Always convert first!`,
                leftCode: '# Wrong:\n"50" + 25  # TypeError!\n\n# Right:\nint("50") + 25  # 75\n"Total: " + str(75)  # "Total: 75"',
                leftNote: "Python doesn't auto-convert types. You must explicitly use int(), str(), float().",
                leftIncantations: [
                    { code: "int('50')", desc: "String → Integer" },
                    { code: "str(75)", desc: "Integer → String" },
                    { code: "float('3.14')", desc: "String → Float" }
                ],
                rightTitle: "Conversion Spells",
                rightIcon: "fas fa-exchange-alt",
                rightContent: `Type conversion is the art of transforming one form of magic into another.`,
                rightColors: [],
                rightQuote: `"You cannot mix oil and water without a catalyst. Use int(), str(), float() as your catalysts."`
            }
        ],

        skills: [
            { name: "Type Debugging", type: "MASTERY", icon: "fas fa-bug", desc: "Fixed type-related bugs.", pct: 85 }
        ],

        rewards: { spellUnlock: null, titleUnlock: null, outfitPart: null }
    },

    // ─── Stage 2-4: Challenge — Type Conversion ───
    '2-4': {
        title: "The Transmuter",
        chapter: "Chapter 2: Transmutation",
        location: "The Scholar's Archive — Transmutation Room",
        stageType: 'challenge',
        difficulty: 3,
        xpReward: 300,
        teachingConcepts: ['type-conversion'],
        prerequisiteConcepts: ['type-checking'],
        hasStoryIntro: false,

        objective: "Convert the string <span class='highlight'>\"255\"</span> to an integer, multiply it by <span class='highlight'>2</span>, and print the result: <span class='highlight'>510</span>",
        initialCode: '# The input arrives as a string\nvalue_str = "255"\n\n# Convert to integer, multiply by 2, and print the result\n',
        completeMessage: "Transmutation complete! You can now convert between types freely.",

        hints: [
            { level: 1, text: "Use int() to convert a string to a number." },
            { level: 2, text: "value_int = int(value_str) then result = value_int * 2" },
            { level: 3, text: "value_int = int(value_str)\nresult = value_int * 2\nprint(result)" }
        ],

        validateOutput: (outputLines) => {
            return outputLines.some(line => line.includes('510'));
        },

        grimoire: [
            {
                leftTitle: "Type Conversion",
                leftIcon: "fas fa-exchange-alt",
                leftContent: `Convert between types: <em style="color:#dc2626">int()</em>, <em style="color:#dc2626">str()</em>, <em style="color:#dc2626">float()</em>.`,
                leftCode: 'x = int("255")    # 255\ny = float("3.14") # 3.14\nz = str(510)      # "510"',
                leftNote: "Conversion is essential when dealing with user input (always strings).",
                leftIncantations: [
                    { code: 'int("42")', desc: "String → Integer" },
                    { code: "str(42)", desc: "Integer → String" },
                    { code: 'float("3.14")', desc: "String → Float" }
                ],
                rightTitle: "Math Operations",
                rightIcon: "fas fa-calculator",
                rightContent: `Once you have numbers, you can perform arithmetic: +, -, *, /, //, %, **`,
                rightColors: [],
                rightQuote: `"Transmutation is the bridge between forms. Master it, and no type shall stop you."`
            }
        ],

        skills: [
            { name: "Type Conversion", type: "CONVERSION", icon: "fas fa-exchange-alt", desc: "Mastered converting between types.", pct: 90 }
        ],

        rewards: { spellUnlock: 'type_convert', titleUnlock: null, outfitPart: null }
    },

    // ─── Stage 2-5: Puzzle — Arithmetic ───
    '2-5': {
        title: "Rune Arithmetic",
        chapter: "Chapter 2: Rune Arithmetic",
        location: "The Scholar's Archive — Calculation Chamber",
        stageType: 'puzzle',
        difficulty: 2,
        xpReward: 200,
        teachingConcepts: ['arithmetic'],
        prerequisiteConcepts: ['int-float'],
        hasStoryIntro: false,

        objective: "Answer the arithmetic puzzles correctly to unlock the chamber.",
        puzzleInstruction: "Select the correct answer for each question.",
        puzzles: [
            {
                question: "What is the result of: 10 + 5 * 2?",
                choices: ["30", "20", "25", "15"],
                correctIndex: 1,
                explanation: "Python follows math order of operations (PEMDAS). 5 * 2 = 10, then 10 + 10 = 20."
            },
            {
                question: "What is the result of: 17 // 5?",
                choices: ["3", "3.4", "2", "4"],
                correctIndex: 0,
                explanation: "// is integer division (floor). 17 ÷ 5 = 3.4, floor = 3."
            },
            {
                question: "What is the result of: 17 % 5?",
                choices: ["3", "2", "3.4", "12"],
                correctIndex: 1,
                explanation: "% is modulo (remainder). 17 ÷ 5 = 3 remainder 2."
            },
            {
                question: "What is the result of: 2 ** 3?",
                choices: ["6", "5", "8", "9"],
                correctIndex: 2,
                explanation: "** is exponentiation. 2^3 = 2 × 2 × 2 = 8."
            }
        ],
        requiredCorrect: 3,

        hints: [
            { level: 1, text: "Remember Python's math operators: +, -, *, /, //, %, **" },
            { level: 2, text: "// is floor division (rounds down). % gives the remainder." },
            { level: 3, text: "** is power/exponent. 2**3 means 2 to the power of 3 = 8" }
        ],

        completeMessage: "Your arithmetic skills are sharp! The chamber unlocks.",

        validateOutput: null,

        grimoire: [
            {
                leftTitle: "Python Arithmetic",
                leftIcon: "fas fa-calculator",
                leftContent: `Python supports all standard math operations plus some special ones.`,
                leftCode: "10 + 5    # 15 (addition)\n10 - 5    # 5  (subtraction)\n10 * 5    # 50 (multiplication)\n10 / 3    # 3.33 (division)\n10 // 3   # 3  (floor division)\n10 % 3    # 1  (modulo/remainder)\n2 ** 3    # 8  (power)",
                leftNote: "Remember: * (multiply), ** (power), // (floor divide), % (remainder)",
                leftIncantations: [
                    { code: "+, -", desc: "Add, Subtract" },
                    { code: "*, /", desc: "Multiply, Divide" },
                    { code: "//", desc: "Floor Division" },
                    { code: "%", desc: "Modulo (remainder)" },
                    { code: "**", desc: "Power" }
                ],
                rightTitle: "Order of Operations",
                rightIcon: "fas fa-sort-amount-down",
                rightContent: `Python follows PEMDAS: Parentheses, Exponents, Multiply/Divide, Add/Subtract.`,
                rightColors: [],
                rightQuote: `"The order of operations is the law of the land. Break it, and your calculations crumble."`
            }
        ],

        skills: [
            { name: "Arithmetic", type: "CALCULATION", icon: "fas fa-calculator", desc: "Mastered Python arithmetic operators.", pct: 90 }
        ],

        rewards: { spellUnlock: null, titleUnlock: null, outfitPart: null }
    },

    // ─── Stage 2-6: Boss — Archive Exam ───
    '2-6': {
        title: "The Archive Exam",
        chapter: "Chapter 2: The Archive Exam",
        location: "The Scholar's Archive — Grand Hall",
        stageType: 'boss',
        difficulty: 3,
        xpReward: 500,
        teachingConcepts: [],
        prerequisiteConcepts: ['int-float', 'type-checking', 'type-conversion', 'arithmetic'],
        hasStoryIntro: true,

        storyIntro: {
            sceneName: "The Grand Hall",
            npcName: "Loremaster Vane",
            npcTitle: "Keeper of Types",
            npcIcon: "fas fa-book-reader",
            dialogues: [
                {
                    speaker: "Loremaster Vane",
                    text: "Impressive progress, apprentice. But knowledge must be proven through examination.",
                    emotion: "serious"
                },
                {
                    speaker: "Loremaster Vane",
                    text: "For this final exam: take the string input, convert it, perform arithmetic, and present the result. Show me you understand types!",
                    emotion: "encouraging"
                }
            ],
            enterButtonText: "Begin the Exam",
            enterButtonIcon: "fas fa-scroll"
        },

        objective: "Convert <span class='highlight'>\"100\"</span> and <span class='highlight'>\"50\"</span> to integers, add them, and print: <span class='highlight'>The sum is 150 (type: &lt;class 'int'&gt;)</span>",
        initialCode: '# The Archive Exam\na_str = "100"\nb_str = "50"\n\n# Convert both to integers\n\n# Calculate the sum\n\n# Print the result with its type\n# Expected: The sum is 150 (type: <class \'int\'>)\n',
        completeMessage: "You have passed the Archive Exam! Loremaster Vane nods with approval.",

        hints: [
            { level: 1, text: "Convert strings to integers with int(). Then add them together." },
            { level: 2, text: "a = int(a_str), b = int(b_str), total = a + b" },
            { level: 3, text: 'a = int(a_str)\nb = int(b_str)\ntotal = a + b\nprint(f"The sum is {total} (type: {type(total)})")' }
        ],

        validateOutput: (outputLines) => {
            return outputLines.some(line => line.includes('150') && line.includes("type:") && line.includes("int"));
        },

        grimoire: [],

        skills: [
            { name: "Boss Clear", type: "MASTERY", icon: "fas fa-crown", desc: "Passed the Archive Exam!", pct: 100 }
        ],

        rewards: { spellUnlock: null, titleUnlock: 'Mage', outfitPart: 'blue_robe' }
    },


    /* ═══════════════════════════════════════
       REGION 3 — ASH PEAKS
       ═══════════════════════════════════════ */

    // ─── Stage 3-1: Lesson — Lists ───
    '3-1': {
        title: "The Inscription Wall",
        chapter: "Chapter 3: The Inscription",
        location: "Ash Peaks — Entrance",
        stageType: 'lesson',
        difficulty: 2,
        xpReward: 200,
        teachingConcepts: ['lists'],
        prerequisiteConcepts: ['variables'],
        hasStoryIntro: true,

        storyIntro: {
            sceneName: "The Ash Peaks",
            npcName: "Sentinel Kael",
            npcTitle: "Warden of Arrays",
            npcIcon: "fas fa-mountain",
            dialogues: [
                {
                    speaker: "Sentinel Kael",
                    text: "Welcome to the Ash Peaks, wizard. The mountain walls are inscribed with ancient arrays — ordered collections of values.",
                    emotion: "calm"
                },
                {
                    speaker: "Sentinel Kael",
                    text: "A List in Python is like a shelf of labeled potions. Each has a position, starting from 0. You can add, remove, and search within them.",
                    emotion: "serious"
                },
                {
                    speaker: "Sentinel Kael",
                    text: "Your first task: create a list of three magic elements and print it. Let's see if you can handle arrays.",
                    emotion: "encouraging"
                }
            ],
            enterButtonText: "Scale the Peaks",
            enterButtonIcon: "fas fa-mountain"
        },

        objective: "Create a list named <span class='highlight'>elements</span> with values <span class='highlight'>[\"Fire\", \"Water\", \"Earth\"]</span> and print it.",
        initialCode: '# Create a list of three elements\n\n\n# Print the list\n',
        completeMessage: "The inscriptions glow! You've created your first list.",

        hints: [
            { level: 1, text: "Lists use square brackets: [item1, item2, item3]" },
            { level: 2, text: "String items need quotes: [\"Fire\", \"Water\", \"Earth\"]" },
            { level: 3, text: 'elements = ["Fire", "Water", "Earth"]\nprint(elements)' }
        ],

        validateOutput: (outputLines) => {
            return outputLines.some(line => line.includes('Fire') && line.includes('Water') && line.includes('Earth'));
        },

        grimoire: [
            {
                leftTitle: "Scriptures of Lists",
                leftIcon: "fas fa-book-open",
                leftContent: `A <em style="color:#dc2626">List</em> is a collection of values, ordered and changeable.`,
                leftCode: "inventory = ['sword', 'shield', 'potion']\nnumbers = [10, 25, 46, 80]",
                leftNote: "The first item is always at index 0, not 1!",
                leftIncantations: [
                    { code: "[a, b, c]", desc: "Create a list" },
                    { code: "list[0]", desc: "First element" },
                    { code: "len(list)", desc: "Count items" }
                ],
                rightTitle: "List Operations",
                rightIcon: "fas fa-tools",
                rightContent: `Lists can be modified: add, remove, find, and sort items.`,
                rightColors: [],
                rightQuote: `"A list is a wizard's inventory — ordered, accessible, and always ready."`
            }
        ],

        skills: [
            { name: "Lists", type: "STRUCTURE", icon: "fas fa-list-ol", desc: "Created your first list.", pct: 70 }
        ],

        rewards: { spellUnlock: 'lists', titleUnlock: null, outfitPart: null }
    },

    // ─── Stage 3-2: Guided — Indexing ───
    '3-2': {
        title: "Rune Positions",
        chapter: "Chapter 3: Rune Positions",
        location: "Ash Peaks — Rune Gallery",
        stageType: 'guided',
        difficulty: 2,
        xpReward: 200,
        teachingConcepts: ['indexing'],
        prerequisiteConcepts: ['lists'],
        hasStoryIntro: false,

        objective: "Fill in the blanks to access specific elements from the list by their index.",
        guidedInstruction: "Use square bracket notation to access list elements by index.",

        codeTemplate: 'runes = ["Alpha", "Beta", "Gamma", "Delta"]\n\n# Print the first element (index 0)\nprint(runes[___BLANK_1___])\n\n# Print the third element (index 2)\nprint(runes[___BLANK_2___])\n\n# Print the last element (index -1 or 3)\nprint(runes[___BLANK_3___])',
        blanks: [
            { id: 'BLANK_1', answer: '0', acceptableAnswers: ['0'], hint: 'The first element is at index 0' },
            { id: 'BLANK_2', answer: '2', acceptableAnswers: ['2'], hint: 'The third element is at index 2 (0, 1, 2)' },
            { id: 'BLANK_3', answer: '-1', acceptableAnswers: ['-1', '3'], hint: 'Use -1 for the last element, or 3 (the last index)' }
        ],
        expectedOutput: 'Alpha\nGamma\nDelta',

        hints: [
            { level: 1, text: "Python lists are zero-indexed: first item = index 0, second = index 1, etc." },
            { level: 2, text: "You can also use negative indexing: -1 is the last item, -2 is second to last." },
            { level: 3, text: "Blanks: 0, 2, -1 (or 3)" }
        ],

        completeMessage: "You can navigate arrays like a true Sentinel!",

        validateOutput: (outputLines) => {
            return outputLines.some(l => l.includes('Alpha')) &&
                   outputLines.some(l => l.includes('Gamma')) &&
                   outputLines.some(l => l.includes('Delta'));
        },

        grimoire: [
            {
                leftTitle: "Indexing",
                leftIcon: "fas fa-hand-pointer",
                leftContent: `Access any element by its position: <em style="color:#dc2626">list[index]</em>`,
                leftCode: 'runes = ["Alpha", "Beta", "Gamma"]\nprint(runes[0])  # Alpha\nprint(runes[-1]) # Gamma',
                leftNote: "Index starts at 0. Negative indices count from the end.",
                leftIncantations: [
                    { code: "list[0]", desc: "First element" },
                    { code: "list[-1]", desc: "Last element" },
                    { code: "list[1:3]", desc: "Slice (items 1-2)" }
                ],
                rightTitle: "Zero-Based Counting",
                rightIcon: "fas fa-sort-numeric-down",
                rightContent: `In Python, counting starts at 0. This is a universal rule in programming.`,
                rightColors: [],
                rightQuote: `"The index is the key to the door. 0 opens the first chamber, 1 the second..."`
            }
        ],

        skills: [
            { name: "Indexing", type: "ACCESS", icon: "fas fa-hand-pointer", desc: "Mastered accessing elements by index.", pct: 85 }
        ],

        rewards: { spellUnlock: null, titleUnlock: null, outfitPart: null }
    },

    // ─── Stage 3-3: Challenge — .index() search ───
    '3-3': {
        title: "The Matrix Search",
        chapter: "Chapter 3: The Matrix",
        location: "Ash Peaks — Matrix Wall",
        stageType: 'challenge',
        difficulty: 3,
        xpReward: 300,
        teachingConcepts: ['list-methods'],
        prerequisiteConcepts: ['lists', 'indexing'],
        hasStoryIntro: false,

        objective: "Find value <span class='highlight'>46</span> in the ancient list and move to its index position.",
        initialCode: "# The values inscribed on the Matrix wall\nvalues = [10, 25, 46, 80]\n\n# Find the position (index) of 46\n# Use .index() method\n\n# Print the result and move to that position\n",
        completeMessage: "You've navigated the Matrix! The path through the Ash Peaks reveals itself.",

        hints: [
            { level: 1, text: "The .index(value) method returns the position of a value in a list." },
            { level: 2, text: "target_index = values.index(46) — this gives you 2." },
            { level: 3, text: "target_index = values.index(46)\nprint(f'Found 46 at index {target_index}')\nhero.move_to_x(target_index)" }
        ],

        validateOutput: null,

        grimoire: [
            {
                leftTitle: "List Methods",
                leftIcon: "fas fa-search",
                leftContent: `Lists have built-in methods for searching, adding, and removing items.`,
                leftCode: "values = [10, 25, 46, 80]\npos = values.index(46)  # returns 2",
                leftNote: ".index() returns the position. But beware — if the element is not found, it raises ValueError!",
                leftIncantations: [
                    { code: ".index(x)", desc: "Find position of x" },
                    { code: ".append(x)", desc: "Add to end" },
                    { code: ".pop()", desc: "Remove last" },
                    { code: "len(list)", desc: "Count items" }
                ],
                rightTitle: "Matrix Navigation",
                rightIcon: "fas fa-compass",
                rightContent: `In the Matrix realm, every value has a hidden position. Map values to indices to navigate.`,
                rightColors: [],
                rightQuote: `"Use .index(value) to reveal where any element hides within the list."`
            }
        ],

        skills: [
            { name: "Searching", type: "LOGIC", icon: "fas fa-search", desc: "Learned to search lists.", pct: 85 }
        ],

        rewards: { spellUnlock: null, titleUnlock: null, outfitPart: null }
    },

    // ─── Stage 3-4: Lesson — for loops ───
    '3-4': {
        title: "The Echo Loop",
        chapter: "Chapter 3: The Echo Loop",
        location: "Ash Peaks — Echo Canyon",
        stageType: 'lesson',
        difficulty: 3,
        xpReward: 250,
        teachingConcepts: ['for-loops'],
        prerequisiteConcepts: ['lists'],
        hasStoryIntro: true,

        storyIntro: {
            sceneName: "Echo Canyon",
            npcName: "Sentinel Kael",
            npcTitle: "Warden of Arrays",
            npcIcon: "fas fa-mountain",
            dialogues: [
                {
                    speaker: "Sentinel Kael",
                    text: "Well done with lists, wizard. But what if you need to examine every element? One by one?",
                    emotion: "questioning"
                },
                {
                    speaker: "Sentinel Kael",
                    text: "The 'for loop' is the wizard's torch. It walks through every item in a collection, illuminating each one.",
                    emotion: "serious"
                },
                {
                    speaker: "Sentinel Kael",
                    text: "The syntax is: for item in list: — then indented code runs for each item. Try it!",
                    emotion: "encouraging"
                }
            ],
            enterButtonText: "Enter the Canyon",
            enterButtonIcon: "fas fa-sync-alt"
        },

        objective: "Use a <span class='highlight'>for loop</span> to print each element from the list <span class='highlight'>[10, 20, 30, 40]</span> on its own line.",
        initialCode: '# The values on the canyon wall\nvalues = [10, 20, 30, 40]\n\n# Use a for loop to print each value\n',
        completeMessage: "The canyon echoes with each value! You've mastered the for loop.",

        hints: [
            { level: 1, text: "A for loop iterates over each item: for item in list:" },
            { level: 2, text: "Remember to indent the code inside the loop with spaces." },
            { level: 3, text: "for val in values:\n    print(val)" }
        ],

        validateOutput: (outputLines) => {
            const has10 = outputLines.some(l => l.trim() === '10');
            const has20 = outputLines.some(l => l.trim() === '20');
            const has30 = outputLines.some(l => l.trim() === '30');
            const has40 = outputLines.some(l => l.trim() === '40');
            return has10 && has20 && has30 && has40;
        },

        grimoire: [
            {
                leftTitle: "For Loops",
                leftIcon: "fas fa-sync-alt",
                leftContent: `The <em style="color:#dc2626">for</em> loop walks through every element in a collection.`,
                leftCode: "items = [10, 20, 30]\nfor item in items:\n    print(item)",
                leftNote: "The indented block runs once for each element. 'item' takes on each value in turn.",
                leftIncantations: [
                    { code: "for x in list:", desc: "Iterate over list" },
                    { code: "for i in range(5):", desc: "Loop 0 to 4" },
                    { code: "for char in 'hello':", desc: "Iterate over string" }
                ],
                rightTitle: "Indentation",
                rightIcon: "fas fa-indent",
                rightContent: `In Python, indentation (4 spaces) defines what's inside the loop. No curly braces needed!`,
                rightColors: [],
                rightQuote: `"for item in collection: — this incantation walks through every element, giving you the power to examine, transform, or collect."`
            }
        ],

        skills: [
            { name: "for Loops", type: "ITERATION", icon: "fas fa-sync-alt", desc: "Learned to iterate over collections.", pct: 80 }
        ],

        rewards: { spellUnlock: 'for_loop', titleUnlock: null, outfitPart: null }
    },

    // ─── Stage 3-5: Debug — List errors ───
    '3-5': {
        title: "Broken Arrays",
        chapter: "Chapter 3: Broken Arrays",
        location: "Ash Peaks — Damaged Wall",
        stageType: 'debug',
        difficulty: 3,
        xpReward: 300,
        teachingConcepts: ['lists', 'for-loops'],
        prerequisiteConcepts: ['lists', 'indexing', 'for-loops'],
        hasStoryIntro: false,

        objective: "Fix the <span class='highlight'>2 bugs</span> so the code correctly prints each item and then the total count.",

        buggyCode: 'items = ["sword", "shield", "potion"]\n\nfor item in items\n    print(item)\n\nprint(f"Total items: {len(item)}")',
        bugCount: 2,
        bugDescriptions: [
            "Line 3: Missing colon at the end of the for statement",
            "Line 6: Should be len(items) not len(item) — 'items' is the list, 'item' is the loop variable"
        ],

        initialCode: 'items = ["sword", "shield", "potion"]\n\nfor item in items\n    print(item)\n\nprint(f"Total items: {len(item)}")',

        hints: [
            { level: 1, text: "for loops need a colon at the end: for item in items:" },
            { level: 2, text: "Check the variable name in len() — are you measuring the list or the last item?" },
            { level: 3, text: "Fix 1: Add ':' → for item in items:\nFix 2: len(items) instead of len(item)" }
        ],

        completeMessage: "Array restored! Your debugging skills are mountain-strong.",

        validateOutput: (outputLines) => {
            return outputLines.some(l => l.includes('sword')) &&
                   outputLines.some(l => l.includes('Total items: 3'));
        },

        grimoire: [],

        skills: [
            { name: "List Debugging", type: "MASTERY", icon: "fas fa-bug", desc: "Fixed list and loop bugs.", pct: 85 }
        ],

        rewards: { spellUnlock: null, titleUnlock: null, outfitPart: null }
    },

    // ─── Stage 3-6: Boss — Peak Trial ───
    '3-6': {
        title: "The Peak Trial",
        chapter: "Chapter 3: The Peak Trial",
        location: "Ash Peaks — Summit",
        stageType: 'boss',
        difficulty: 4,
        xpReward: 500,
        teachingConcepts: [],
        prerequisiteConcepts: ['lists', 'indexing', 'list-methods', 'for-loops'],
        hasStoryIntro: true,

        storyIntro: {
            sceneName: "The Summit",
            npcName: "Sentinel Kael",
            npcTitle: "Warden of Arrays",
            npcIcon: "fas fa-mountain",
            dialogues: [
                {
                    speaker: "Sentinel Kael",
                    text: "The summit is near. But the final trial of the Ash Peaks demands mastery of lists, loops, and searching.",
                    emotion: "serious"
                },
                {
                    speaker: "Sentinel Kael",
                    text: "Create a list, find a specific value, loop through it, and navigate to the correct position. Show me everything!",
                    emotion: "encouraging"
                }
            ],
            enterButtonText: "Reach the Summit",
            enterButtonIcon: "fas fa-mountain"
        },

        objective: "Create a list <span class='highlight'>[10, 25, 46, 80, 99]</span>, find the index of <span class='highlight'>46</span>, print each value using a for loop, then move to the index of 46.",
        initialCode: "# The Peak Trial\n# 1. Create the list\n\n# 2. Find the index of 46\n\n# 3. Print each value with a for loop\n\n# 4. Move to the index of 46\n",
        completeMessage: "You've conquered the Ash Peaks! The Whispering Caverns await.",

        hints: [
            { level: 1, text: "Start by creating: values = [10, 25, 46, 80, 99]" },
            { level: 2, text: "Use .index(46) to find position, then a for loop to print all values." },
            { level: 3, text: "values = [10, 25, 46, 80, 99]\nidx = values.index(46)\nfor v in values:\n    print(v)\nhero.move_to_x(idx)" }
        ],

        validateOutput: null,

        grimoire: [],

        skills: [
            { name: "Boss Clear", type: "MASTERY", icon: "fas fa-crown", desc: "Conquered the Ash Peaks!", pct: 100 }
        ],

        rewards: { spellUnlock: null, titleUnlock: 'Sorcerer', outfitPart: 'green_robe' }
    },


    /* ═══════════════════════════════════════
       REGION 4 — WHISPERING CAVERNS
       ═══════════════════════════════════════ */

    // ─── Stage 4-1: Lesson — Conditionals ───
    '4-1': {
        title: "The Crossroads",
        chapter: "Chapter 4: The Crossroads",
        location: "Whispering Caverns — Entrance",
        stageType: 'lesson',
        difficulty: 3,
        xpReward: 250,
        teachingConcepts: ['conditionals'],
        prerequisiteConcepts: ['variables'],
        hasStoryIntro: true,

        storyIntro: {
            sceneName: "The Whispering Caverns",
            npcName: "Oracle Seren",
            npcTitle: "Voice of the Spectrum",
            npcIcon: "fas fa-eye",
            dialogues: [
                {
                    speaker: "Oracle Seren",
                    text: "Welcome, wizard. You have come far. But the caverns test not just your skill — they test your judgment.",
                    emotion: "mysterious"
                },
                {
                    speaker: "Oracle Seren",
                    text: "The 'if' statement is the wizard's crossroads. It tests a condition and chooses a path. If true — one way. If false — another.",
                    emotion: "serious"
                },
                {
                    speaker: "Oracle Seren",
                    text: "Write an if/else that checks a number. If it's greater than 100, print 'Powerful'. Otherwise, print 'Weak'.",
                    emotion: "encouraging"
                }
            ],
            enterButtonText: "Enter the Caverns",
            enterButtonIcon: "fas fa-eye"
        },

        objective: "Write an if/else: if <span class='highlight'>power</span> is greater than 100, print <span class='highlight'>Powerful</span>. Otherwise, print <span class='highlight'>Weak</span>. (power = 150)",
        initialCode: '# The power level to test\npower = 150\n\n# Write an if/else statement\n',
        completeMessage: "Wise choice! You understand the power of conditional logic.",

        hints: [
            { level: 1, text: "if condition: runs code when condition is True. else: runs when False." },
            { level: 2, text: "if power > 100:\n    print(\"Powerful\")\nelse:\n    print(\"Weak\")" },
            { level: 3, text: "Make sure to indent with 4 spaces inside the if and else blocks." }
        ],

        validateOutput: (outputLines) => {
            return outputLines.some(line => line.includes('Powerful'));
        },

        grimoire: [
            {
                leftTitle: "Conditional Logic",
                leftIcon: "fas fa-code-branch",
                leftContent: `The <em style="color:#dc2626">if</em> statement tests a condition and chooses a path.`,
                leftCode: "if brightness > 200:\n    print('Blinding!')\nelse:\n    print('Too dim...')",
                leftNote: "Use elif for additional paths. else catches everything that didn't match.",
                leftIncantations: [
                    { code: "if x > y:", desc: "Compare values" },
                    { code: "elif:", desc: "Another condition" },
                    { code: "else:", desc: "Default fallback" },
                    { code: "and / or", desc: "Combine conditions" }
                ],
                rightTitle: "Comparison Operators",
                rightIcon: "fas fa-balance-scale",
                rightContent: `== (equal), != (not equal), < (less), > (greater), <= (less or equal), >= (greater or equal)`,
                rightColors: [],
                rightQuote: `"At every crossroads, the wizard must choose. The 'if' statement is your compass."`
            }
        ],

        skills: [
            { name: "Conditionals", type: "LOGIC", icon: "fas fa-code-branch", desc: "Learned if/else conditional logic.", pct: 70 }
        ],

        rewards: { spellUnlock: 'conditionals', titleUnlock: null, outfitPart: null }
    },

    // ─── Stage 4-2: Guided — Conditionals practice ───
    '4-2': {
        title: "Path Selection",
        chapter: "Chapter 4: Path Selection",
        location: "Whispering Caverns — Forked Path",
        stageType: 'guided',
        difficulty: 3,
        xpReward: 250,
        teachingConcepts: ['conditionals', 'comparison'],
        prerequisiteConcepts: ['conditionals'],
        hasStoryIntro: false,

        objective: "Fill in the blanks to complete the if/elif/else chain.",
        guidedInstruction: "Complete the conditional logic to classify a temperature value.",

        codeTemplate: 'temp = 35\n\nif temp ___BLANK_1___ 30:\n    print("Hot!")\n___BLANK_2___ temp >= 20:\n    print("Warm")\n___BLANK_3___:\n    print("Cold")',
        blanks: [
            { id: 'BLANK_1', answer: '>', acceptableAnswers: ['>', '>='], hint: 'Use a comparison operator: > means greater than' },
            { id: 'BLANK_2', answer: 'elif', acceptableAnswers: ['elif'], hint: 'elif is used for additional conditions after if' },
            { id: 'BLANK_3', answer: 'else', acceptableAnswers: ['else'], hint: 'else handles all remaining cases' }
        ],
        expectedOutput: 'Hot!',

        hints: [
            { level: 1, text: "if checks the first condition. elif adds more conditions. else is the default." },
            { level: 2, text: "Comparison operators: > (greater), >= (greater or equal), < (less), == (equal)" },
            { level: 3, text: "Blanks: >, elif, else" }
        ],

        completeMessage: "Perfect path selection! Your conditional logic is strong.",

        validateOutput: (outputLines) => {
            return outputLines.some(line => line.includes('Hot!'));
        },

        grimoire: [
            {
                leftTitle: "if / elif / else",
                leftIcon: "fas fa-directions",
                leftContent: `Chain multiple conditions with <em style="color:#dc2626">elif</em>. Only the first matching block executes.`,
                leftCode: "if temp > 30:\n    print('Hot')\nelif temp >= 20:\n    print('Warm')\nelse:\n    print('Cold')",
                leftNote: "Python checks conditions top-to-bottom. The first True condition wins.",
                leftIncantations: [
                    { code: "if:", desc: "First condition" },
                    { code: "elif:", desc: "Additional condition" },
                    { code: "else:", desc: "Default (no condition)" }
                ],
                rightTitle: "When to Use What",
                rightIcon: "fas fa-lightbulb",
                rightContent: `Use if alone for simple checks. Add elif for multiple options. else is optional but recommended.`,
                rightColors: [],
                rightQuote: `"A wise wizard considers all paths before choosing. elif is your second sight."`
            }
        ],

        skills: [
            { name: "elif/else", type: "LOGIC", icon: "fas fa-directions", desc: "Mastered multi-path conditionals.", pct: 85 }
        ],

        rewards: { spellUnlock: null, titleUnlock: null, outfitPart: null }
    },

    // ─── Stage 4-3: Puzzle — Boolean logic ───
    '4-3': {
        title: "Truth and Lies",
        chapter: "Chapter 4: Truth and Lies",
        location: "Whispering Caverns — Truth Chamber",
        stageType: 'puzzle',
        difficulty: 3,
        xpReward: 250,
        teachingConcepts: ['boolean-logic'],
        prerequisiteConcepts: ['conditionals'],
        hasStoryIntro: false,

        objective: "Answer the boolean logic puzzles correctly.",
        puzzleInstruction: "Select the correct result for each expression.",
        puzzles: [
            {
                question: "What is: True and False?",
                choices: ["True", "False", "None", "Error"],
                correctIndex: 1,
                explanation: "'and' requires BOTH to be True. Since one is False, the result is False."
            },
            {
                question: "What is: True or False?",
                choices: ["True", "False", "None", "Error"],
                correctIndex: 0,
                explanation: "'or' requires at least ONE to be True. Since one is True, the result is True."
            },
            {
                question: "What is: not True?",
                choices: ["True", "False", "None", "Error"],
                correctIndex: 1,
                explanation: "'not' inverts the value. not True = False."
            },
            {
                question: "What is: (5 > 3) and (10 < 20)?",
                choices: ["True", "False", "None", "5"],
                correctIndex: 0,
                explanation: "5 > 3 is True. 10 < 20 is True. True and True = True."
            }
        ],
        requiredCorrect: 3,

        hints: [
            { level: 1, text: "'and' = both must be True. 'or' = at least one True. 'not' = invert." },
            { level: 2, text: "True and True = True. True and False = False. True or False = True." },
            { level: 3, text: "Answers: False, True, False, True" }
        ],

        completeMessage: "The truth has been spoken! Boolean logic mastered.",

        validateOutput: null,

        grimoire: [
            {
                leftTitle: "Boolean Logic",
                leftIcon: "fas fa-toggle-on",
                leftContent: `Boolean values are either <em style="color:#dc2626">True</em> or <em style="color:#dc2626">False</em>. Combine them with and, or, not.`,
                leftCode: "print(True and False)  # False\nprint(True or False)   # True\nprint(not True)        # False",
                leftNote: "'and' needs both True. 'or' needs one True. 'not' flips the value.",
                leftIncantations: [
                    { code: "and", desc: "Both must be True" },
                    { code: "or", desc: "At least one True" },
                    { code: "not", desc: "Invert the value" }
                ],
                rightTitle: "Truth Tables",
                rightIcon: "fas fa-table",
                rightContent: `Think of 'and' as strict, 'or' as lenient, and 'not' as the rebel.`,
                rightColors: [],
                rightQuote: `"In the caverns, truth and lies are the same — it depends on the logic you apply."`
            }
        ],

        skills: [
            { name: "Boolean Logic", type: "LOGIC", icon: "fas fa-toggle-on", desc: "Mastered and, or, not.", pct: 90 }
        ],

        rewards: { spellUnlock: 'boolean', titleUnlock: null, outfitPart: null }
    },

    // ─── Stage 4-4: Debug — Conditional bugs ───
    '4-4': {
        title: "Broken Bridges",
        chapter: "Chapter 4: Broken Bridges",
        location: "Whispering Caverns — Bridge Room",
        stageType: 'debug',
        difficulty: 3,
        xpReward: 300,
        teachingConcepts: ['conditionals'],
        prerequisiteConcepts: ['conditionals', 'comparison'],
        hasStoryIntro: false,

        objective: "Fix the <span class='highlight'>2 bugs</span> in the conditional logic so it correctly prints <span class='highlight'>Bridge is safe!</span>",

        buggyCode: 'weight = 50\nmax_weight = 100\n\nif weight < max_weight\n    print("Bridge is safe!")\nelse\n    print("Too heavy!")',
        bugCount: 2,
        bugDescriptions: [
            "Line 4: Missing colon after the if condition",
            "Line 6: Missing colon after else"
        ],

        initialCode: 'weight = 50\nmax_weight = 100\n\nif weight < max_weight\n    print("Bridge is safe!")\nelse\n    print("Too heavy!")',

        hints: [
            { level: 1, text: "Both if and else statements need a colon (:) at the end." },
            { level: 2, text: "if condition: ← colon here. else: ← colon here too." },
            { level: 3, text: "Fix: if weight < max_weight: and else:" }
        ],

        completeMessage: "Bridge repaired! Colons are small but mighty.",

        validateOutput: (outputLines) => {
            return outputLines.some(line => line.includes('Bridge is safe!'));
        },

        grimoire: [],

        skills: [
            { name: "Syntax Debugging", type: "MASTERY", icon: "fas fa-bug", desc: "Fixed conditional syntax errors.", pct: 85 }
        ],

        rewards: { spellUnlock: null, titleUnlock: null, outfitPart: null }
    },

    // ─── Stage 4-5: Challenge — Color mixing with conditionals ───
    '4-5': {
        title: "The Color Mixer",
        chapter: "Chapter 4: The Color Mixer",
        location: "Whispering Caverns — Color Chamber",
        stageType: 'challenge',
        difficulty: 4,
        xpReward: 350,
        teachingConcepts: ['color-mixing'],
        prerequisiteConcepts: ['conditionals', 'rgb'],
        hasStoryIntro: false,

        objective: "Use an if/elif/else to cast the correct color based on the <span class='highlight'>command</span> variable. If command is \"red\" → cast (255,0,0). If \"green\" → (0,255,0). If \"blue\" → (0,0,255). Else → cast (255,255,255).",
        initialCode: '# The command to execute\ncommand = "green"\n\n# Use if/elif/else to cast the correct color\n',
        completeMessage: "The chamber glows with the correct color! Conditional color magic mastered.",

        hints: [
            { level: 1, text: "Use if to check command == \"red\", elif for \"green\", elif for \"blue\", else for default." },
            { level: 2, text: "if command == \"red\":\n    hero.cast_color(255, 0, 0)\nelif command == \"green\":\n    hero.cast_color(0, 255, 0)" },
            { level: 3, text: "if command == \"red\":\n    hero.cast_color(255, 0, 0)\nelif command == \"green\":\n    hero.cast_color(0, 255, 0)\nelif command == \"blue\":\n    hero.cast_color(0, 0, 255)\nelse:\n    hero.cast_color(255, 255, 255)" }
        ],

        validateOutput: null,

        grimoire: [
            {
                leftTitle: "Conditionals + Functions",
                leftIcon: "fas fa-tint",
                leftContent: `Combining conditionals with function calls lets you create dynamic, responsive spells.`,
                leftCode: 'if color == "red":\n    hero.cast_color(255, 0, 0)\nelif color == "blue":\n    hero.cast_color(0, 0, 255)',
                leftNote: "Use == to compare strings. = is assignment, == is comparison!",
                leftIncantations: [
                    { code: '== "text"', desc: "Compare strings" },
                    { code: "if/elif/else", desc: "Multi-path logic" }
                ],
                rightTitle: "Dynamic Spells",
                rightIcon: "fas fa-bolt",
                rightContent: `By combining conditionals with hero commands, your spells can adapt to any situation.`,
                rightColors: ["red", "green", "blue"],
                rightQuote: `"A wizard who adapts is a wizard who survives. Let conditions guide your magic."`
            }
        ],

        skills: [
            { name: "Dynamic Logic", type: "LOGIC", icon: "fas fa-bolt", desc: "Combined conditionals with actions.", pct: 90 }
        ],

        rewards: { spellUnlock: null, titleUnlock: null, outfitPart: null }
    },

    // ─── Stage 4-6: Boss — The Light Convergence ───
    '4-6': {
        title: "The Light Convergence",
        chapter: "Chapter 4: The Light Convergence",
        location: "Whispering Caverns — Heart",
        stageType: 'boss',
        difficulty: 5,
        xpReward: 600,
        teachingConcepts: [],
        prerequisiteConcepts: ['conditionals', 'boolean-logic', 'rgb', 'color-mixing'],
        hasStoryIntro: true,

        storyIntro: {
            sceneName: "The Heart of the Caverns",
            npcName: "Oracle Seren",
            npcTitle: "Voice of the Spectrum",
            npcIcon: "fas fa-eye",
            dialogues: [
                {
                    speaker: "Oracle Seren",
                    text: "This is it, wizard. The final trial. The Lost Spectrum can only be restored by casting White light — all three channels at maximum.",
                    emotion: "serious"
                },
                {
                    speaker: "Oracle Seren",
                    text: "But first, you must prove your understanding. Set all three channels to 255, verify they are correct, then cast the light. The spectrum depends on you!",
                    emotion: "encouraging"
                },
                {
                    speaker: "Oracle Seren",
                    text: "Remember: White = Red + Green + Blue, all at 255. Use variables, conditionals, and cast_color to complete the ritual.",
                    emotion: "mysterious"
                }
            ],
            enterButtonText: "Restore the Spectrum",
            enterButtonIcon: "fas fa-sun"
        },

        objective: "Set <span class='highlight'>red, green, blue</span> all to 255. Use an <span class='highlight'>if</span> to verify all are 255, then cast White light and print: <span class='highlight'>The Lost Spectrum is restored!</span>",
        initialCode: "# The Final Challenge\n# Set all three channels\nred = 255\ngreen = 255\nblue = 255\n\n# Verify all channels are at maximum\n# If all are 255, cast white light and print the message\n",
        completeMessage: "THE LOST SPECTRUM IS RESTORED! The caverns illuminate with pure white light! You are a true Spectrum Lord!",

        hints: [
            { level: 1, text: "Check all three: if red == 255 and green == 255 and blue == 255:" },
            { level: 2, text: "Inside the if block: hero.cast_color(red, green, blue) and print()" },
            { level: 3, text: "if red == 255 and green == 255 and blue == 255:\n    hero.cast_color(red, green, blue)\n    print(\"The Lost Spectrum is restored!\")" }
        ],

        validateOutput: (outputLines) => {
            return outputLines.some(line => line.includes('The Lost Spectrum is restored!'));
        },

        grimoire: [
            {
                leftTitle: "The Final Spell",
                leftIcon: "fas fa-sun",
                leftContent: `Combine conditionals, boolean logic, and RGB to cast the ultimate spell.`,
                leftCode: 'if r == 255 and g == 255 and b == 255:\n    hero.cast_color(r, g, b)\n    print("Restored!")',
                leftNote: "White light = all channels at 255. This is the secret of the Lost Spectrum.",
                leftIncantations: [
                    { code: "and", desc: "All conditions True" },
                    { code: "== 255", desc: "Check for max value" },
                    { code: "cast_color(r,g,b)", desc: "Cast the light" }
                ],
                rightTitle: "The Spectrum Complete",
                rightIcon: "fas fa-rainbow",
                rightContent: `You have mastered: print, variables, f-strings, RGB, functions, types, lists, loops, conditionals, and boolean logic. You ARE the Spectrum Lord.`,
                rightColors: ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
                rightQuote: `"The Lost Spectrum is not a place — it is a state of understanding. When a wizard masters all elements, the spectrum reveals itself."`
            }
        ],

        skills: [
            { name: "Spectrum Lord", type: "MASTERY", icon: "fas fa-sun", desc: "Restored the Lost Spectrum!", pct: 100 },
            { name: "Conditionals", type: "LOGIC", icon: "fas fa-code-branch", desc: "Mastered conditional branching.", pct: 100 },
            { name: "Color Mixing", type: "SPECTRUM", icon: "fas fa-palette", desc: "Combined all RGB channels.", pct: 100 }
        ],

        rewards: {
            spellUnlock: null,
            titleUnlock: 'Archmage',
            outfitPart: 'white_robe'
        }
    }
};
