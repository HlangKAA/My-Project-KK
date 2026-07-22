/*  ═══════════════════════════════════════════════════
    STAGE DATA — Region-based stage structure
    ═══════════════════════════════════════════════════ */

/**
 * REGIONS: ข้อมูล Region หลัก (ใช้ใน Dashboard + RegionMap)
 * STAGE_DATA: ข้อมูลด่านย่อยทั้งหมด key = "regionId-stageId"
 */

export const REGIONS = {
    1: {
        id: 1,
        name: 'THE RED FOREST',
        subtitle: 'The Awakening',
        description: 'Where all journeys begin. The ancient tower holds secrets of the first spells.',
        stages: [
            { id: 1, name: 'The Awakening Tower', type: 'story', icon: 'fas fa-dungeon', description: 'Discover the tower and learn the first incantation.' },
            { id: 2, name: 'The Prism Path', type: 'challenge', icon: 'fas fa-palette', description: 'Restore the Red spectrum to cross the chasm.' }
        ]
    },
    2: {
        id: 2,
        name: 'ASH PEAKS',
        subtitle: 'The Matrix',
        description: 'Navigate the ancient arrays inscribed upon the mountain walls.',
        stages: [
            { id: 1, name: 'The Matrix Search', type: 'challenge', icon: 'fas fa-search', description: 'Find value 46 in the ancient list.' }
        ]
    },
    3: {
        id: 3,
        name: 'WHISPERING CAVERNS',
        subtitle: 'The Light',
        description: 'Merge all color channels to awaken the cavern.',
        stages: [
            { id: 1, name: 'The Light Convergence', type: 'challenge', icon: 'fas fa-sun', description: 'Cast White light to illuminate the caverns.' }
        ]
    }
};

export const STAGE_DATA = {
    /* ═══════════════════════════════════════
       REGION 1 — THE RED FOREST
       ═══════════════════════════════════════ */
    '1-1': {
        title: "The Awakening Tower",
        chapter: "Chapter 1: The Awakening",
        location: "The Red Forest — Tower Entrance",
        hasStoryIntro: true,

        // ─── Story Intro Data ───
        storyIntro: {
            sceneName: "The Ancient Tower",
            npcName: "Eldrin",
            npcTitle: "Guardian of the Tower",
            npcIcon: "fas fa-hat-wizard",
            dialogues: [
                {
                    speaker: "Eldrin",
                    text: "Traveler... you have found the Tower of the Lost Spectrum. Few dare to enter these halls.",
                    emotion: "mysterious"
                },
                {
                    speaker: "Eldrin",
                    text: "Long ago, the wizards of this realm commanded magic through incantations — lines of code woven into spells.",
                    emotion: "nostalgic"
                },
                {
                    speaker: "Eldrin",
                    text: "But the knowledge was scattered when the Spectrum shattered. Now, only fragments remain...",
                    emotion: "serious"
                },
                {
                    speaker: "Eldrin",
                    text: "I can teach you the first incantation. Enter the tower, and let us begin with the most basic spell — the power to speak through code.",
                    emotion: "encouraging"
                }
            ],
            enterButtonText: "Enter the Tower",
            enterButtonIcon: "fas fa-door-open"
        },

        // ─── IDE / Game Data ───
        objective: "Use <span class='highlight'>print()</span> with an f-string to speak the ancient name: <span class='highlight'>Lumina</span>.",
        initialCode: '# The tower resonates with an ancient name...\n# Use print() to speak it aloud\n# Try using an f-string!\n\nname = "Lumina"\nprint(f"{name}")',
        hint: 'Use print(f"{variable}") to speak the name. The variable \'name\' holds the answer.',
        completeMessage: "The tower trembles as the name echoes through its halls. Lumina... the first light has been spoken!",

        // ─── Validation ───
        validateOutput: (outputLines) => {
            // Check if any output line contains "Lumina"
            return outputLines.some(line => line.trim() === 'Lumina' || line.includes('Lumina'));
        },

        // ─── Grimoire ───
        grimoire: [
            {
                leftTitle: "The Print Spell",
                leftIcon: "fas fa-comment-dots",
                leftContent: `The <em style="color:#dc2626">print()</em> function is the wizard's voice — it lets your code speak to the world.`,
                leftCode: 'print("Hello, world!")\nprint(42)\nprint("The answer is", 42)',
                leftNote: "Everything inside the parentheses will be displayed in the console. You can print text, numbers, or combinations.",
                leftIncantations: [
                    { code: 'print("text")', desc: "Print a string" },
                    { code: 'print(variable)', desc: "Print a variable" },
                    { code: 'print(a, b)', desc: "Print multiple values" }
                ],
                rightTitle: "f-Strings: Magic Words",
                rightIcon: "fas fa-feather-alt",
                rightContent: `An <em style="color:#dc2626">f-string</em> lets you embed variables directly inside text. Place <strong>f</strong> before the quotes and use <strong>{curly braces}</strong>.`,
                rightColors: [],
                rightQuote: `"f-strings weave variables into your words like runes into a spell scroll. f'{name}' will speak whatever name holds."`
            },
            {
                leftTitle: "Variables: Named Containers",
                leftIcon: "fas fa-database",
                leftContent: `A <em style="color:#dc2626">Variable</em> is a named container for magical essence. Like a labeled potion flask, it stores a value for later use.`,
                leftCode: 'name = "Lumina"\npower = 100\nprint(f"{name} has {power} power")',
                leftNote: "Variables remember their values. You can use them anywhere in your code after defining them.",
                leftIncantations: [
                    { code: "x = 10", desc: "Store a number" },
                    { code: 'name = "Mage"', desc: "Store text (string)" },
                    { code: 'f"{var}"', desc: "Embed in f-string" }
                ],
                rightTitle: "The First Light",
                rightIcon: "fas fa-sun",
                rightContent: `Lumina — the name of the first light that illuminated the Spectrum. Speaking it through code is the key to awakening the tower.`,
                rightColors: ["red"],
                rightQuote: `"Every great wizard began with a single word. print() is your first incantation. Master it, and the Spectrum shall respond."`
            }
        ],

        // ─── Skills Unlocked ───
        skills: [
            { name: "print()", type: "OUTPUT", icon: "fas fa-comment-dots", desc: "Learned the fundamental incantation to make code speak.", pct: 100 },
            { name: "f-Strings", type: "FORMATTING", icon: "fas fa-feather-alt", desc: "Mastered the art of weaving variables into text with f-strings.", pct: 85 },
            { name: "Variables", type: "STORAGE", icon: "fas fa-database", desc: "Understood how to store and recall values with named containers.", pct: 70 }
        ]
    },

    '1-2': {
        title: "The Prism Path",
        chapter: "Chapter 1: The Prism",
        location: "Crystal Archives",
        hasStoryIntro: false,
        objective: "Restore the <span class='highlight'>Red</span> spectrum to the bridge to cross the chasm.",
        initialCode: "# The bridge needs RED light to appear\n# Use hero.cast_color(r, g, b) to cast light\n# Each value ranges from 0 to 255\n\n# Cast pure RED light:\nhero.cast_color(255, 0, 0)",
        hint: "Use hero.cast_color(red, green, blue). Pure red = (255, 0, 0).",
        completeMessage: "The Red spectrum has been restored! The bridge materializes before you.",

        // ─── Validation ───
        validateOutput: null, // uses hero callbacks instead

        grimoire: [
            {
                leftTitle: "Scriptures of Variables",
                leftIcon: "fas fa-database",
                leftContent: `A <em style="color:#dc2626">Variable</em> is a named container for magical essence. Like a labeled potion flask, it stores a value for later use.`,
                leftCode: "red = 255\ngreen = 0\nblue = 0",
                leftNote: "Variables remember their values. You can change them anytime — mutable, like shifting sands.",
                leftIncantations: [
                    { code: "x = 10", desc: "Store a number" },
                    { code: 'name = "Mage"', desc: "Store text (string)" },
                    { code: "x = x + 1", desc: "Update a value" }
                ],
                rightTitle: "The RGB Spectrum",
                rightIcon: "fas fa-palette",
                rightContent: `Light in this realm is made of three channels: <em style="color:#dc2626">Red</em>, <em style="color:#16a34a">Green</em>, and <em style="color:#3b82f6">Blue</em>. Each ranges from 0 (none) to 255 (full power).`,
                rightColors: ["red"],
                rightQuote: `"To cast pure Red, channel all energy to the first flame. Let Green and Blue rest at zero. hero.cast_color(255, 0, 0)"`
            },
            {
                leftTitle: "Understanding Functions",
                leftIcon: "fas fa-magic",
                leftContent: `A <em style="color:#dc2626">Function</em> is a reusable spell — a block of code with a name. Call it whenever you need its magic.`,
                leftCode: "def cast_red():\n    hero.cast_color(255, 0, 0)",
                leftNote: "The <strong>def</strong> keyword defines a function. Indentation matters — it marks what belongs inside the spell.",
                leftIncantations: [
                    { code: "def name():", desc: "Define a function" },
                    { code: "name()", desc: "Call the function" },
                    { code: "return value", desc: "Send back a result" }
                ],
                rightTitle: "The Color Wheel",
                rightIcon: "fas fa-cog",
                rightContent: `The seven colors of the spectrum form a wheel of power. Master them all to restore the Lost Spectrum.`,
                rightColors: ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
                rightQuote: `"When the spectrum is complete, the bridge shall manifest. Do not forget the order of the rainbow, lest you fall into the void."`
            }
        ],
        skills: [
            { name: "Variables", type: "STORAGE", icon: "fas fa-database", desc: "Mastered the art of storing magical essence within named containers for later invocation.", pct: 100 },
            { name: "Functions", type: "SPELLCRAFT", icon: "fas fa-magic", desc: "Learned to define and invoke reusable spells with the def keyword.", pct: 80 },
            { name: "RGB Colors", type: "SPECTRUM", icon: "fas fa-palette", desc: "Understood the three channels of light and how to mix them.", pct: 75 }
        ]
    },

    /* ═══════════════════════════════════════
       REGION 2 — ASH PEAKS
       ═══════════════════════════════════════ */
    '2-1': {
        title: "The Matrix Search",
        chapter: "Chapter 2: The Matrix",
        location: "Ash Peaks",
        hasStoryIntro: false,
        objective: "Find value <span class='highlight'>46</span> in the ancient list and move to its index position.",
        initialCode: "# The values inscribed on the Matrix wall\nvalues = [10, 25, 46, 80]\n\n# Find the position (index) of 46\ntarget = 46\nindex = values.index(target)\n\nprint(f'Found {target} at index {index}')\nhero.move_to_x(index)",
        hint: "Use .index(value) to find where 46 lives in the list.",
        completeMessage: "You've navigated the Matrix! The path through the Ash Peaks reveals itself.",
        validateOutput: null,
        grimoire: [
            {
                leftTitle: "Scriptures of Lists",
                leftIcon: "fas fa-book-open",
                leftContent: `A <em style="color:#dc2626">List</em> is a collection of ancient runes, ordered and changeable. Like ingredients in a potion, order matters.`,
                leftCode: "inventory = ['sword', 'shield', 'potion']",
                leftNote: "Beware! The first item is always at index <strong>0</strong>, not 1. The grand wizard Python dictates it so.",
                leftIncantations: [
                    { code: ".append()", desc: "Add to the end" },
                    { code: ".pop()", desc: "Remove the last" },
                    { code: "len()", desc: "Count the items" },
                    { code: ".index(x)", desc: "Find position of x" }
                ],
                rightTitle: "Matrix Navigation",
                rightIcon: "fas fa-compass",
                rightContent: `In the Matrix realm, every value has a hidden position. To navigate, one must <em style="color:#dc2626">map values to indices</em>.`,
                rightColors: [],
                rightQuote: `"The index is the key to the door. Use .index(value) to reveal where any element hides within the list."`
            },
            {
                leftTitle: "The Art of Searching",
                leftIcon: "fas fa-search",
                leftContent: `The ancient scrolls teach us to <em style="color:#dc2626">search</em> through collections with precision. A skilled wizard never inspects items without purpose.`,
                leftCode: "values = [10, 25, 46, 80]\npos = values.index(46)  # returns 2",
                leftNote: "The <strong>.index()</strong> method reveals the position of any element. But beware — if the element is not found, the spell backfires with a ValueError!",
                leftIncantations: [
                    { code: "x in list", desc: "Check if x exists" },
                    { code: "for x in list:", desc: "Walk through all" },
                    { code: "list[i]", desc: "Access by index" }
                ],
                rightTitle: "Loops & Iteration",
                rightIcon: "fas fa-sync-alt",
                rightContent: `Sometimes you must inspect every rune in a collection. The <em style="color:#dc2626">for loop</em> is the wizard's torch, illuminating each element one by one.`,
                rightColors: [],
                rightQuote: `"for item in collection: — this incantation walks through every element, giving you the power to examine, transform, or collect."`
            }
        ],
        skills: [
            { name: "Lists", type: "STRUCTURE", icon: "fas fa-list-ol", desc: "Acquired the ability to organize multiple incantations into sequential arrays.", pct: 90 },
            { name: "Searching", type: "LOGIC", icon: "fas fa-search", desc: "Learned to locate specific elements within magical arrays.", pct: 70 },
            { name: "Indexing", type: "ACCESS", icon: "fas fa-hand-pointer", desc: "Understood the mapping between position and value in ordered collections.", pct: 85 }
        ]
    },

    /* ═══════════════════════════════════════
       REGION 3 — WHISPERING CAVERNS
       ═══════════════════════════════════════ */
    '3-1': {
        title: "The Light Convergence",
        chapter: "Chapter 3: The Light",
        location: "Whispering Caverns",
        hasStoryIntro: false,
        objective: "Merge all <span class='highlight'>three</span> color channels to cast White light and awaken the cavern.",
        initialCode: "# The cavern needs WHITE light (all channels max)\n# White = Red + Green + Blue at full power\n\nred = 255\ngreen = 255\nblue = 255\n\nhero.cast_color(red, green, blue)\nprint('The cavern awakens with pure white light!')",
        hint: "White light = all channels at 255. hero.cast_color(255, 255, 255)",
        completeMessage: "The caverns illuminate with pure white light! The Lost Spectrum is fully restored!",
        validateOutput: null,
        grimoire: [
            {
                leftTitle: "Conditional Logic",
                leftIcon: "fas fa-code-branch",
                leftContent: `The <em style="color:#dc2626">if</em> statement is the wizard's crossroads. It tests a condition and chooses the path of magic.`,
                leftCode: "if brightness > 200:\n    print('Blinding!')\nelse:\n    print('Too dim...')",
                leftNote: "Use <strong>elif</strong> for additional paths. The <strong>else</strong> catches everything that didn't match above.",
                leftIncantations: [
                    { code: "if x > y:", desc: "Compare values" },
                    { code: "elif:", desc: "Another condition" },
                    { code: "else:", desc: "Default fallback" },
                    { code: "and / or", desc: "Combine conditions" }
                ],
                rightTitle: "Color Mixing Theory",
                rightIcon: "fas fa-lightbulb",
                rightContent: `In the additive light model, combining all three primary colors at full intensity produces <em style="color:#dc2626">White</em>. This is the final spell.`,
                rightColors: ["red", "green", "blue"],
                rightQuote: `"Red + Green + Blue = White. When all three channels burn at 255, the purest light emerges. This is the secret of the Lost Spectrum."`
            },
            {
                leftTitle: "String Formatting",
                leftIcon: "fas fa-font",
                leftContent: `The <em style="color:#dc2626">f-string</em> lets you embed variables inside text. It's the wizard's way of weaving data into words.`,
                leftCode: 'name = "Mage"\npower = 255\nprint(f"{name} casts at {power}!")',
                leftNote: "Place <strong>f</strong> before the quotes, then use <strong>{curly braces}</strong> to insert variables.",
                leftIncantations: [
                    { code: 'f"text {var}"', desc: "Embed a variable" },
                    { code: 'f"{x:.2f}"', desc: "Format decimals" },
                    { code: "str(42)", desc: "Convert to string" }
                ],
                rightTitle: "The Final Spectrum",
                rightIcon: "fas fa-sun",
                rightContent: `You have traveled through the Red Forest, scaled the Ash Peaks, and now stand in the Whispering Caverns. The final challenge awaits.`,
                rightColors: ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
                rightQuote: `"The Lost Spectrum is not a place — it is a state of understanding. When a wizard masters variables, lists, conditions, and light, the spectrum reveals itself."`
            }
        ],
        skills: [
            { name: "Conditions", type: "LOGIC", icon: "fas fa-code-branch", desc: "Learned to branch spell execution based on magical conditions.", pct: 85 },
            { name: "Color Mixing", type: "SPECTRUM", icon: "fas fa-palette", desc: "Mastered the art of combining RGB channels to produce any color.", pct: 100 },
            { name: "f-Strings", type: "OUTPUT", icon: "fas fa-font", desc: "Acquired the power to weave variables into readable text output.", pct: 70 }
        ]
    }
};
