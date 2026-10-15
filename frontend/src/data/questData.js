/*  ═══════════════════════════════════════════════════
    QUEST DATA — Quest definitions for the RPG world
    CodeCombat-style: walk → talk → code → world changes

    Zone 1: The Prism Path (3 quests + 1 boss)
    Zone 2: Value & Type (2 quests)
    ═══════════════════════════════════════════════════ */

export const QUEST_DATA = {
    /* ═══════════════════════════════════════
       ZONE 1 QUESTS — THE RED FOREST
       "The Prism Path"
       ═══════════════════════════════════════ */

    // ─── Quest 1-1: print() — The Sealed Door ───
    'quest-1-1': {
        name: 'The Sealed Door',
        zoneId: 1,
        description: 'The tower door is sealed by ancient magic. Speak the name "Lumina" using the print() spell to open it.',
        type: 'code',
        difficulty: 1,
        xpReward: 150,
        teachingConcepts: ['print'],
        prerequisiteConcepts: [],

        objective: 'Use <span class="hl">print()</span> to speak the ancient name: <span class="hl">"Lumina"</span>',
        initialCode: '# The tower door is sealed...\n# Speak the name "Lumina" to open it\n# Use the print() spell!\n\n',
        hints: [
            { level: 1, text: 'print() is a spell that speaks words aloud. Try: print("something")' },
            { level: 2, text: 'The name you need to speak is "Lumina". Put it inside print().' },
            { level: 3, text: 'Type exactly: print("Lumina")' },
        ],
        validateOutput: (lines) => lines.some(l => l.trim() === 'Lumina' || l.includes('Lumina')),

        // What happens in the world when completed
        worldEffect: {
            type: 'unlock-entity',
            targetId: 'door-tower',
            animation: 'glow-unlock',
            message: '🚪 The tower door glows with golden light and swings open!',
        },

        grimoire: [
            {
                leftTitle: 'The Print Spell',
                leftIcon: 'fas fa-comment-dots',
                leftContent: `The <em style="color:#dc2626">print()</em> function is the wizard's voice — it lets your code speak to the world.`,
                leftCode: 'print("Hello, world!")\nprint(42)\nprint("The answer is", 42)',
                leftNote: 'Everything inside the parentheses will be displayed in the console.',
                leftIncantations: [
                    { code: 'print("text")', desc: 'Speak a message' },
                    { code: 'print(variable)', desc: "Speak a variable's value" },
                    { code: 'print(a, b)', desc: 'Speak multiple values' },
                ],
                rightTitle: 'How It Works',
                rightContent: 'print() takes whatever you give it and displays it in the console. Think of it as your wizard shouting a spell aloud.',
                rightCode: '# Examples:\nprint("Lumina")      # → Lumina\nprint(100)           # → 100\nprint("HP:", 100)    # → HP: 100',
            },
        ],
    },

    // ─── Quest 1-2: RGB Red — The Fading Trees ───
    'quest-1-2': {
        name: 'The Fading Trees',
        zoneId: 1,
        description: 'The forest trees have lost their color. Cast RED light using hero.cast_color() to restore them.',
        type: 'code',
        difficulty: 2,
        xpReward: 250,
        teachingConcepts: ['rgb', 'cast_color', 'functions-basic'],
        prerequisiteConcepts: ['print'],

        objective: 'Use <span class="hl">hero.cast_color(255, 0, 0)</span> to cast RED light and restore the trees!',
        initialCode: '# The trees need RED light to come alive!\n# RGB = Red, Green, Blue (each 0-255)\n# RED = R:255, G:0, B:0\n\n# Cast the red color spell:\nhero.cast_color(___,  ___,  ___)\n',
        hints: [
            { level: 1, text: 'RGB means Red-Green-Blue. Each value goes from 0 to 255.' },
            { level: 2, text: 'Pure RED means max red (255), no green (0), no blue (0).' },
            { level: 3, text: 'Type: hero.cast_color(255, 0, 0)' },
        ],
        // Validated via hero callback
        validateOutput: null,
        validateCallback: 'cast_color_red',

        worldEffect: {
            type: 'restore-color',
            targetIds: ['faded-tree-1', 'faded-tree-2', 'faded-tree-3'],
            unlockEntity: 'door-grove',
            animation: 'color-wave',
            message: '🌲 The trees flush with crimson light — the forest awakens!',
        },

        grimoire: [
            {
                leftTitle: 'RGB Color Magic',
                leftIcon: 'fas fa-palette',
                leftContent: 'Colors in the digital world are made of three channels: <b>Red</b>, <b>Green</b>, and <b>Blue</b>.',
                leftCode: 'hero.cast_color(255, 0, 0)    # Pure Red\nhero.cast_color(0, 255, 0)    # Pure Green\nhero.cast_color(0, 0, 255)    # Pure Blue\nhero.cast_color(255, 255, 0)  # Yellow',
                leftNote: 'Each value ranges from 0 (none) to 255 (maximum).',
                leftIncantations: [
                    { code: 'hero.cast_color(r, g, b)', desc: 'Cast a color spell' },
                    { code: '(255, 0, 0)', desc: 'Red' },
                    { code: '(0, 255, 0)', desc: 'Green' },
                    { code: '(0, 0, 255)', desc: 'Blue' },
                    { code: '(255, 255, 255)', desc: 'White' },
                ],
                rightTitle: 'How RGB Works',
                rightContent: 'By mixing different amounts of Red, Green, and Blue, you can create any color. Like mixing paints, but with light!',
                rightCode: '# Color mixing:\n# Red + Green = Yellow\nhero.cast_color(255, 255, 0)\n\n# Red + Blue = Purple\nhero.cast_color(255, 0, 255)\n\n# All max = White\nhero.cast_color(255, 255, 255)',
            },
        ],
    },

    // ─── Quest 1-3: The Shifting Path — Move + Cast ───
    'quest-1-3': {
        name: 'The Shifting Path',
        zoneId: 1,
        description: 'The bridge ahead is broken. Move to position 3 and cast BLUE light to repair it.',
        type: 'code',
        difficulty: 2,
        xpReward: 300,
        teachingConcepts: ['movement', 'sequential-execution'],
        prerequisiteConcepts: ['cast_color', 'rgb'],

        objective: 'Move to position <span class="hl">3</span> using hero.move_to_x(3), then cast <span class="hl">BLUE</span> light (0, 0, 255)',
        initialCode: '# The bridge needs repair!\n# Step 1: Move to position 3\n# Step 2: Cast BLUE light to repair\n\n',
        hints: [
            { level: 1, text: 'You need two commands: one to move, one to cast color.' },
            { level: 2, text: 'hero.move_to_x(3) moves you to position 3. Blue = (0, 0, 255).' },
            { level: 3, text: 'hero.move_to_x(3)\nhero.cast_color(0, 0, 255)' },
        ],
        validateOutput: null,
        validateCallback: 'move_and_cast_blue',

        worldEffect: {
            type: 'bridge-repair',
            animation: 'bridge-build',
            message: '🌉 Blue light flows along the bridge — the path is restored!',
        },

        grimoire: [
            {
                leftTitle: 'Movement Spells',
                leftIcon: 'fas fa-shoe-prints',
                leftContent: 'The <em style="color:#dc2626">hero.move_to_x()</em> function moves your wizard to a specific position on the path.',
                leftCode: 'hero.move_to_x(0)  # Position 0\nhero.move_to_x(3)  # Position 3\nhero.move_to_x(5)  # Position 5',
                leftNote: 'Positions start from 0. Think of them like numbered tiles on a path.',
                leftIncantations: [
                    { code: 'hero.move_to_x(n)', desc: 'Move to position n' },
                    { code: 'hero.cast_color(r,g,b)', desc: 'Cast colored light' },
                ],
                rightTitle: 'Sequential Execution',
                rightContent: 'Code runs top to bottom, line by line. The order matters! Move first, then cast your spell.',
                rightCode: '# Order matters!\nhero.move_to_x(3)         # First: move\nhero.cast_color(0, 0, 255) # Then: cast\n\n# If you reverse them, you\n# cast at the wrong spot!',
            },
        ],
    },

    // ─── Quest 1-Boss: The Prism Gate ───
    'quest-1-boss': {
        name: 'The Prism Gate',
        zoneId: 1,
        description: 'The gate to the next realm is sealed by three seals. Prove your mastery of all skills to open it!',
        type: 'boss',
        difficulty: 4,
        xpReward: 500,
        teachingConcepts: ['mastery-region-1'],
        prerequisiteConcepts: ['print', 'rgb', 'cast_color', 'movement'],

        phases: [
            {
                phase: 1,
                bossHP: 100,
                bossMaxHP: 100,
                dialog: {
                    speaker: 'Prism Guardian',
                    text: 'The first seal requires the power of VOICE! Declare the phrase and speak it!',
                    emotion: 'challenging',
                },
                objective: 'Phase 1: Use an f-string to print <span class="hl">"Open, Gate of the Forest!"</span>',
                initialCode: '# Speak the ancient phrase!\nphrase = "Gate of the Forest"\n\n# Print: "Open, Gate of the Forest!" using an f-string\n',
                hints: [
                    { level: 1, text: 'Use an f-string to embed the variable: f"text {variable} text"' },
                    { level: 2, text: 'print(f"Open, {phrase}!")' },
                ],
                validate: (output) => output.some(l => l.includes('Open,') && l.includes('Gate of the Forest')),
                bossReaction: 'shield-crack',
                hpDamage: 35,
            },
            {
                phase: 2,
                bossHP: 65,
                bossMaxHP: 100,
                dialog: {
                    speaker: 'Prism Guardian',
                    text: 'The second seal needs the light of nature! Cast GREEN!',
                    emotion: 'angry',
                },
                objective: 'Phase 2: Cast <span class="hl">GREEN</span> light (0, 255, 0) to break the second seal!',
                initialCode: '# Cast GREEN light to break the seal!\n\n',
                hints: [
                    { level: 1, text: 'Green means: no Red, max Green, no Blue.' },
                    { level: 2, text: 'hero.cast_color(0, 255, 0)' },
                ],
                validate: null,
                validateCallback: 'cast_color_green',
                bossReaction: 'take-damage',
                hpDamage: 35,
            },
            {
                phase: 3,
                bossHP: 30,
                bossMaxHP: 100,
                dialog: {
                    speaker: 'Prism Guardian',
                    text: 'The final seal... you must combine EVERYTHING you have learned!',
                    emotion: 'desperate',
                },
                objective: 'Phase 3: Move to position <span class="hl">5</span>, cast <span class="hl">GREEN</span>, and print <span class="hl">"Open, Gate of the Forest!"</span>',
                initialCode: '# Combine all your skills!\nphrase = "Gate of the Forest"\n\n# Move to position 5\n\n# Cast GREEN light\n\n# Print the opening phrase\n',
                hints: [
                    { level: 1, text: 'Three steps: move, cast, print. In that order.' },
                    { level: 2, text: 'hero.move_to_x(5)\nhero.cast_color(0, 255, 0)\nprint(f"Open, {phrase}!")' },
                ],
                validate: (output) => {
                    const hasPrint = output.some(l => l.includes('Open,') && l.includes('Gate of the Forest'));
                    const hasMoved = output.some(l => l.includes('[move_to_x]') && l.includes('5'));
                    const hasCast = output.some(l => l.includes('[cast_color]') && l.includes('0, 255, 0'));
                    return hasPrint && hasMoved && hasCast;
                },
                bossReaction: 'defeated',
                hpDamage: 30,
            },
        ],

        worldEffect: {
            type: 'boss-defeated',
            animation: 'boss-dissolve',
            unlockZone: 2,
            message: '🏆 The Prism Gate shatters! The path to the Scholar\'s Archive opens!',
        },
    },


    /* ═══════════════════════════════════════
       ZONE 2 QUESTS — THE SCHOLAR'S ARCHIVE
       "Value & Type"
       ═══════════════════════════════════════ */

    // ─── Quest 2-1: Variable Declaration ───
    'quest-2-1': {
        name: 'The Essence of Values',
        zoneId: 2,
        description: 'Learn to declare variables correctly. Every value has a type — string, integer, or boolean.',
        type: 'code',
        difficulty: 1,
        xpReward: 200,
        teachingConcepts: ['variables', 'variable-declaration'],
        prerequisiteConcepts: ['print'],

        objective: 'Declare 3 variables: <span class="hl">wizard_name</span> = "Lumina", <span class="hl">magic_power</span> = 255, <span class="hl">is_ready</span> = True. Then print all three.',
        initialCode: '# Declare these variables correctly:\n# wizard_name = a string "Lumina"\n# magic_power = the number 255\n# is_ready = the boolean True\n\n\n# Print all three\nprint(wizard_name)\nprint(magic_power)\nprint(is_ready)\n',
        hints: [
            { level: 1, text: 'Strings need quotes: "Lumina". Numbers don\'t: 255. Booleans are True or False (capital T/F).' },
            { level: 2, text: 'wizard_name = "Lumina"\nmagic_power = 255\nis_ready = True' },
            { level: 3, text: 'Just write those three lines before the print statements!' },
        ],
        validateOutput: (lines) => {
            const hasLumina = lines.some(l => l.includes('Lumina'));
            const has255 = lines.some(l => l.includes('255'));
            const hasTrue = lines.some(l => l.includes('True'));
            return hasLumina && has255 && hasTrue;
        },

        worldEffect: {
            type: 'reveal-entity',
            targetId: 'puzzle-type-checker',
            animation: 'fade-in',
            message: '📚 Knowledge flows through the archive — the Type Checker is revealed!',
        },

        grimoire: [
            {
                leftTitle: 'Variables — Containers of Power',
                leftIcon: 'fas fa-database',
                leftContent: 'A <em style="color:#dc2626">Variable</em> stores a value. Use <strong>=</strong> to assign.',
                leftCode: 'wizard_name = "Lumina"    # String\nmagic_power = 255         # Integer\nis_ready = True           # Boolean\nhealth = 99.5             # Float',
                leftNote: "Strings need quotes. Numbers don't. Booleans are True or False (capital letter!).",
                leftIncantations: [
                    { code: 'x = 42', desc: 'Store a number (int)' },
                    { code: 'name = "Mage"', desc: 'Store text (str)' },
                    { code: 'hp = 99.5', desc: 'Store decimal (float)' },
                    { code: 'ready = True', desc: 'Store boolean (bool)' },
                ],
                rightTitle: 'Data Types',
                rightContent: "Every value has a type. Python has four basic types: int (whole numbers), str (text), float (decimals), bool (True/False).",
                rightCode: '# Types of values:\n42          # int (integer)\n"Hello"     # str (string)\n3.14        # float (decimal)\nTrue        # bool (boolean)',
            },
        ],
    },

    // ─── Quest 2-2: Type Checking with type() ───
    'quest-2-2': {
        name: 'The Type Checker',
        zoneId: 2,
        description: 'Every value has a type. Use the type() spell to reveal the true nature of your variables.',
        type: 'code',
        difficulty: 2,
        xpReward: 250,
        teachingConcepts: ['type-checking', 'type-function'],
        prerequisiteConcepts: ['variables', 'variable-declaration'],

        objective: 'Declare variables so that: <span class="hl">name</span> is str, <span class="hl">level</span> is int, <span class="hl">health</span> is float. Use <span class="hl">type()</span> to verify.',
        initialCode: '# Declare the variables so that:\n# name → must be str (string)\n# level → must be int (integer)\n# health → must be float (decimal)\n\n\n# Use type() to verify each variable\'s type\nprint(type(name))\nprint(type(level))\nprint(type(health))\n',
        hints: [
            { level: 1, text: 'A string uses quotes: "text". An integer is a whole number: 5. A float has a decimal point: 100.0' },
            { level: 2, text: 'name = "Lumina" (str), level = 5 (int), health = 100.0 (float)' },
            { level: 3, text: 'name = "Lumina"\nlevel = 5\nhealth = 100.0' },
        ],
        validateOutput: (lines) => {
            const hasStr = lines.some(l => l.includes("<class 'str'>"));
            const hasInt = lines.some(l => l.includes("<class 'int'>"));
            const hasFloat = lines.some(l => l.includes("<class 'float'>"));
            return hasStr && hasInt && hasFloat;
        },

        worldEffect: {
            type: 'complete-zone',
            animation: 'golden-burst',
            message: '🏆 You have mastered Values and Types! The archive recognizes your wisdom!',
        },

        grimoire: [
            {
                leftTitle: 'The type() Spell',
                leftIcon: 'fas fa-microscope',
                leftContent: 'The <em style="color:#dc2626">type()</em> function reveals the type of any value or variable.',
                leftCode: "x = 42\nprint(type(x))      # <class 'int'>\n\nname = \"Wizard\"\nprint(type(name))   # <class 'str'>\n\nhp = 99.5\nprint(type(hp))     # <class 'float'>",
                leftNote: 'Useful for debugging when your spells misbehave — always check the type!',
                leftIncantations: [
                    { code: 'type(42)', desc: "Returns <class 'int'>" },
                    { code: 'type("hi")', desc: "Returns <class 'str'>" },
                    { code: 'type(3.14)', desc: "Returns <class 'float'>" },
                    { code: 'type(True)', desc: "Returns <class 'bool'>" },
                ],
                rightTitle: 'Why Types Matter',
                rightContent: "Different types have different powers. You can't add a string and a number without converting first!",
                rightCode: '# This will ERROR:\n# "age: " + 25  ← TypeError!\n\n# This works:\n"age: " + str(25)  # "age: 25"\n\n# Or use f-strings:\nf"age: {25}"       # "age: 25"',
            },
        ],
    },
};


/**
 * Helper: Validate hero callbacks for specific quests
 */
export const CALLBACK_VALIDATORS = {
    'cast_color_red': (callLog) => {
        return callLog.some(c => c.method === 'cast_color' && c.args[0] === 255 && c.args[1] === 0 && c.args[2] === 0);
    },
    'cast_color_green': (callLog) => {
        return callLog.some(c => c.method === 'cast_color' && c.args[0] === 0 && c.args[1] === 255 && c.args[2] === 0);
    },
    'cast_color_blue': (callLog) => {
        return callLog.some(c => c.method === 'cast_color' && c.args[0] === 0 && c.args[1] === 0 && c.args[2] === 255);
    },
    'cast_color_yellow': (callLog) => {
        return callLog.some(c => c.method === 'cast_color' && c.args[0] === 255 && c.args[1] === 255 && c.args[2] === 0);
    },
    'move_and_cast_blue': (callLog) => {
        const moved = callLog.some(c => c.method === 'move_to_x' && c.args[0] === 3);
        const casted = callLog.some(c => c.method === 'cast_color' && c.args[0] === 0 && c.args[1] === 0 && c.args[2] === 255);
        return moved && casted;
    },
    'move_cast_green': (callLog) => {
        const moved = callLog.some(c => c.method === 'move_to_x' && c.args[0] === 5);
        const casted = callLog.some(c => c.method === 'cast_color' && c.args[0] === 0 && c.args[1] === 255 && c.args[2] === 0);
        return moved && casted;
    },
};
