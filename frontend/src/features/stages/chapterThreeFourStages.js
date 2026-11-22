// Each rune or cavern crystal represents one RGB pixel. Only the 10 playable stages
// in Regions 3 and 4 remain here so frontend and backend stay 1:1 synchronized.
const R = [220, 40, 35];
const G = [40, 200, 90];
const B = [35, 90, 220];
const D = [30, 30, 30];
const W = [240, 240, 240];

const stages = {
    '3-1': {
        title: 'The Inscription Wall', concept: 'A digital image is a list of RGB pixels; each rune is one pixel.',
        task: 'Return a new list containing the three pixels in their original order.',
        source: [R, G, B], result: [R, G, B], probe: [[B, R, G], [D, W, R]],
        starter: '# [LESSON STEP 1] Read each pixel by its 0-based index: pixels[0], pixels[1], pixels[2]\n    # [LESSON STEP 2] Return them inside a new list [ ... ]:\n    return [pixels[0], pixels[1], pixels[2]]',
        code: 'return [pixels[0], pixels[1], pixels[2]]',
        clue: 'Make a list with square brackets and read each pixel by its position (index).',
        icon: 'fas fa-th-list', xp: 220, type: 'lesson',
    },
    '3-2': {
        title: 'Rune Positions', concept: 'Pixel indexing locates an exact position in an image row.',
        task: 'The first and last pixels were swapped. Return them in the correct order.',
        source: [B, G, R], result: [R, G, B], probe: [[G, R, B], [W, D, R]],
        starter: 'pass',
        code: 'return [pixels[2], pixels[1], pixels[0]]',
        clue: 'The indexes are 0, 1, 2. Reverse the outer two.',
        icon: 'fas fa-hand-pointer', xp: 240,
    },
    '3-4': {
        title: 'The Echo Loop', concept: 'A for loop applies the same image filter to every pixel.',
        task: 'Brighten every channel by 30, stopping at 255.',
        source: [[50, 70, 90], [140, 40, 70], [240, 220, 200]],
        result: [[80, 100, 120], [170, 70, 100], [255, 250, 230]],
        probe: [[[0, 0, 0], [250, 1, 2], [10, 20, 30]], [[255, 255, 255], [100, 120, 140], [220, 230, 240]]],
        code: 'result = []\n    for pixel in pixels:\n        result.append([min(255, channel + 30) for channel in pixel])\n    return result',
        starter: '# [LESSON STEP 1] Create a list to collect transformed pixels:\n    result = []\n    # [LESSON STEP 2] Loop through each pixel and add 30 to every channel (capped at 255):\n    for pixel in pixels:\n        result.append([min(255, channel + 30) for channel in pixel])\n    return result',
        clue: 'The loop is ready. Use min(255, channel + 30) inside the list.',
        icon: 'fas fa-sync-alt', xp: 290, type: 'lesson',
    },
    '3-5': {
        title: 'Broken Arrays', concept: 'A faulty loop shifts pixel channels and corrupts an image.',
        task: 'Fix the loop so it adds 20 to red only, capped at 255; keep green and blue.',
        source: [[20, 40, 90], [80, 140, 30], [250, 20, 50]],
        result: [[40, 40, 90], [100, 140, 30], [255, 20, 50]],
        probe: [[[0, 100, 200], [240, 10, 10], [15, 15, 15]], [[255, 0, 0], [70, 80, 90], [1, 2, 3]]],
        starter: 'result = []\n    for pixel in pixels:\n        result.append([min(255, pixel[1] + 20), pixel[0], pixel[2]])\n    return result',
        code: 'result = []\n    for pixel in pixels:\n        result.append([min(255, pixel[0] + 20), pixel[1], pixel[2]])\n    return result',
        clue: 'Fix only the broken append line: red is pixel[0], green is pixel[1].',
        icon: 'fas fa-bug', xp: 310,
    },
    '3-7': {
        title: 'The Cavern Trial', concept: 'A loop can spot red cave runes and recolor them one by one.',
        task: 'Turn pixels with red above 100 gold. Keep the others unchanged.',
        source: [[30, 40, 50], [200, 30, 20], [70, 80, 90]],
        result: [[30, 40, 50], [255, 200, 40], [70, 80, 90]],
        probe: [[[230, 0, 0], [40, 50, 60], [10, 20, 30]], [[1, 2, 3], [30, 40, 50], [180, 70, 80]]],
        code: 'result = []\n    for pixel in pixels:\n        if pixel[0] > 100:\n            result.append([255, 200, 40])\n        else:\n            result.append(pixel)\n    return result',
        starter: 'result = []\n    for pixel in pixels:\n        if False:\n            result.append([255, 200, 40])\n        else:\n            result.append(pixel)\n    return result',
        clue: 'Replace False with pixel[0] > 100. The loop and route wind safely past cavern portals.',
        icon: 'fas fa-crown', xp: 450, type: 'boss', gate: 'Cavern Gate',
    },
    '4-1': {
        title: 'The Crossroads', concept: 'A simple color check can reveal bright red pixels.',
        task: 'Make pixels white when red is at least 128; otherwise make them black.',
        source: [[30, 30, 30], [180, 180, 180], [90, 150, 120]],
        result: [[0, 0, 0], [255, 255, 255], [0, 0, 0]],
        probe: [[[128, 128, 128], [127, 127, 127], [0, 0, 255]], [[255, 255, 255], [60, 90, 100], [130, 130, 130]]],
        code: 'result = []\n    for pixel in pixels:\n        if pixel[0] >= 128:\n            result.append([255, 255, 255])\n        else:\n            result.append([0, 0, 0])\n    return result',
        starter: '# [LESSON STEP 1] Loop over every pixel and test its red channel (pixel[0]):\n    result = []\n    for pixel in pixels:\n        # [LESSON STEP 2] Output white [255, 255, 255] if pixel[0] >= 128, else black [0, 0, 0]:\n        if pixel[0] >= 128:\n            result.append([255, 255, 255])\n        else:\n            result.append([0, 0, 0])\n    return result',
        clue: 'Use pixel[0] >= 128.',
        icon: 'fas fa-code-branch', xp: 300, type: 'lesson',
    },
    '4-2': {
        title: 'Path Selection', concept: 'if/elif/else can choose a color from the red value.',
        task: 'Use red below 85 for blue, below 170 for gold, and otherwise white.',
        source: [[30, 30, 30], [120, 120, 120], [220, 220, 220]],
        result: [B, [255, 200, 40], W],
        probe: [[[84, 84, 84], [85, 85, 85], [170, 170, 170]], [[0, 0, 0], [169, 169, 169], [255, 255, 255]]],
        code: 'result = []\n    for pixel in pixels:\n        red = pixel[0]\n        if red < 85:\n            result.append([35, 90, 220])\n        elif red < 170:\n            result.append([255, 200, 40])\n        else:\n            result.append([240, 240, 240])\n    return result',
        starter: 'result = []\n    for pixel in pixels:\n        red = pixel[0]\n        if red < 85:\n            result.append([35, 90, 220])\n        elif False:\n            result.append([255, 200, 40])\n        else:\n            result.append([240, 240, 240])\n    return result',
        clue: 'Replace False with red < 170. The first and last choices are ready.',
        icon: 'fas fa-directions', xp: 320,
    },
    '4-3': {
        title: 'Truth and Lies', concept: 'A color check can hide pixels that are not red enough.',
        task: 'Keep pixels with red above 100; make the others black.',
        source: [[180, 30, 40], [40, 200, 40], [180, 30, 180]],
        result: [[180, 30, 40], [0, 0, 0], [180, 30, 180]],
        probe: [[[101, 0, 99], [100, 0, 99], [101, 0, 100]], [[255, 255, 0], [0, 0, 0], [150, 80, 20]]],
        code: 'result = []\n    for pixel in pixels:\n        if pixel[0] > 100:\n            result.append(pixel)\n        else:\n            result.append([0, 0, 0])\n    return result',
        starter: 'result = []\n    for pixel in pixels:\n        if False:\n            result.append(pixel)\n        else:\n            result.append([0, 0, 0])\n    return result',
        clue: 'Replace False with pixel[0] > 100.',
        icon: 'fas fa-toggle-on', xp: 340,
    },
    '4-6': {
        title: 'The Color Seal', concept: 'A red-channel check can reveal the dark parts of an image.',
        task: 'Turn pixels whose red is below 100 gold. Keep the others unchanged.',
        source: [[20, 30, 40], [180, 60, 40], [40, 150, 240]],
        result: [[255, 200, 40], [180, 60, 40], [255, 200, 40]],
        probe: [[[99, 99, 99], [100, 99, 99], [0, 0, 240]], [[0, 0, 0], [200, 200, 200], [99, 100, 99]]],
        code: 'result = []\n    for r, g, b in pixels:\n        if r < 100:\n            result.append([255, 200, 40])\n        else:\n            result.append([r, g, b])\n    return result',
        starter: 'result = []\n    for r, g, b in pixels:\n        if False:\n            result.append([255, 200, 40])\n        else:\n            result.append([r, g, b])\n    return result',
        clue: 'Replace False with r < 100.',
        icon: 'fas fa-shield-alt', xp: 420,
    },
    '4-7': {
        title: 'The Light Convergence', concept: 'The final image uses simple red checks to restore three color seals.',
        task: 'Make red below 85 white. Add 50 blue when red is above 150. Otherwise keep the pixel.',
        source: [[20, 30, 40], [200, 40, 30], [120, 180, 90]],
        result: [[255, 255, 255], [200, 40, 80], [120, 180, 90]],
        probe: [[[84, 84, 84], [200, 0, 250], [250, 30, 230]], [[85, 85, 85], [200, 10, 240], [0, 200, 0]]],
        code: 'result = []\n    for r, g, b in pixels:\n        if r < 85:\n            result.append([255, 255, 255])\n        elif r > 150:\n            result.append([r, g, min(255, b + 50)])\n        else:\n            result.append([r, g, b])\n    return result',
        starter: 'result = []\n    for r, g, b in pixels:\n        if r < 85:\n            result.append([255, 255, 255])\n        elif False:\n            result.append([r, g, min(255, b + 50)])\n        else:\n            result.append([r, g, b])\n    return result',
        clue: 'Only the elif test is missing: use r > 150. The route is ready.',
        icon: 'fas fa-sun', xp: 600, type: 'boss', gate: 'Spectrum Gate',
    },
};

const probes = {
    '3-1': [[B, R, G], [D, W, R]],
    '3-2': [[B, R, G], [R, D, W]],
    '3-4': [[[30, 30, 30], [255, 31, 32], [40, 50, 60]], [[255, 255, 255], [130, 150, 170], [250, 255, 255]]],
    '3-5': [[[20, 100, 200], [255, 10, 10], [35, 15, 15]], [[255, 0, 0], [90, 80, 90], [21, 2, 3]]],
    '3-7': [[[255, 200, 40], [40, 50, 60], [10, 20, 30]], [[1, 2, 3], [30, 40, 50], [255, 200, 40]]],
    '4-1': [[[255, 255, 255], [0, 0, 0], [0, 0, 0]], [[255, 255, 255], [0, 0, 0], [255, 255, 255]]],
    '4-2': [[B, [255, 200, 40], W], [B, [255, 200, 40], W]],
    '4-3': [[[101, 0, 99], [0, 0, 0], [101, 0, 100]], [[255, 255, 0], [0, 0, 0], [150, 80, 20]]],
    '4-6': [[[255, 200, 40], [100, 99, 99], [255, 200, 40]], [[255, 200, 40], [200, 200, 200], [255, 200, 40]]],
    '4-7': [[[255, 255, 255], [200, 0, 255], [250, 30, 255]], [[85, 85, 85], [200, 10, 255], [255, 255, 255]]],
};

const storyLore = {
    '3-1': 'The cavern runes record where Krakk carried the stolen colors. Mind the dimensional floor portals and winding stalagmites in the dark.',
    '3-7': 'The cavern portal maze protects Krakk\'s final trail upward to Ash Peaks. Navigate carefully past the portal traps.',
    '4-1': 'Krakk is close on Ash Peaks. His spell turns light into shadow, but a careful threshold can reveal the path.',
    '4-7': 'I am Krakk, Summus Magus Monotoniae. I stole this kingdom\'s colors so no one could dream beyond my rule. Your little book cannot undo me.',
};

const STAGE_LAYOUTS = {
    '3-1': {
        spawn: { x: 1, y: 3 },
        targets: [{ x: 2, y: 3 }, { x: 5, y: 1 }, { x: 8, y: 3 }],
        obstacles: [{ x: 3, y: 3 }, { x: 3, y: 2 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 0, y: 0 }, { x: 9, y: 4 }],
        portals: [{ x: 2, y: 0 }, { x: 6, y: 1 }, { x: 4, y: 4 }],
        castPath: 'for index, color in enumerate(colors):\n    hero.cast_color(color[0], color[1], color[2])\n    if index == 0:\n        hero.move_up(2)\n        hero.move_right(3)\n    elif index == 1:\n        hero.move_up(1)\n        hero.move_right(3)\n        hero.move_down(3)',
    },
    '3-2': {
        spawn: { x: 8, y: 1 },
        targets: [{ x: 8, y: 2 }, { x: 5, y: 2 }, { x: 2, y: 2 }],
        obstacles: [{ x: 7, y: 1 }, { x: 6, y: 1 }, { x: 4, y: 3 }, { x: 3, y: 3 }, { x: 0, y: 0 }, { x: 9, y: 4 }],
        portals: [{ x: 6, y: 3 }, { x: 3, y: 1 }, { x: 5, y: 0 }],
        castPath: 'for index, color in enumerate(colors):\n    hero.cast_color(color[0], color[1], color[2])\n    if index == 0:\n        hero.move_down(3)\n        hero.move_left(3)\n        hero.move_up(1)\n    elif index == 1:\n        hero.move_down(1)\n        hero.move_left(3)\n        hero.move_up(1)',
    },
    '3-4': {
        spawn: { x: 2, y: 4 },
        targets: [{ x: 2, y: 3 }, { x: 5, y: 3 }, { x: 8, y: 3 }],
        obstacles: [{ x: 3, y: 4 }, { x: 3, y: 3 }, { x: 6, y: 4 }, { x: 6, y: 3 }, { x: 0, y: 0 }, { x: 9, y: 1 }],
        portals: [{ x: 4, y: 2 }, { x: 7, y: 2 }, { x: 5, y: 0 }],
        castPath: 'for index, color in enumerate(colors):\n    hero.cast_color(color[0], color[1], color[2])\n    if index < 2:\n        # Wind around crystal stalagmites and floor portals.\n        hero.move_up(3)\n        hero.move_right(3)\n        hero.move_down(3)',
    },
    '3-5': {
        spawn: { x: 8, y: 1 },
        targets: [{ x: 8, y: 2 }, { x: 5, y: 2 }, { x: 2, y: 2 }],
        obstacles: [{ x: 7, y: 1 }, { x: 7, y: 2 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 0, y: 4 }, { x: 9, y: 4 }],
        portals: [{ x: 6, y: 3 }, { x: 3, y: 3 }, { x: 5, y: 0 }],
        castPath: 'for index, color in enumerate(colors):\n    hero.cast_color(color[0], color[1], color[2])\n    if index < 2:\n        hero.move_down(3)\n        hero.move_left(3)\n        hero.move_up(3)',
    },
    '3-7': {
        spawn: { x: 1, y: 3 },
        targets: [{ x: 2, y: 3 }, { x: 5, y: 3 }, { x: 8, y: 3 }],
        obstacles: [{ x: 3, y: 3 }, { x: 3, y: 2 }, { x: 6, y: 3 }, { x: 6, y: 2 }, { x: 0, y: 0 }, { x: 7, y: 4 }],
        portals: [{ x: 2, y: 2 }, { x: 5, y: 2 }, { x: 8, y: 2 }],
        gate: { x: 9, y: 1 },
        castPath: 'for index, color in enumerate(colors):\n    hero.cast_color(color[0], color[1], color[2])\n    if index < 2:\n        hero.move_up(2)\n        hero.move_right(3)\n        hero.move_down(2)\nhero.move_up(2)\nhero.move_right(2)',
    },
    '4-1': {
        spawn: { x: 1, y: 1 },
        targets: [{ x: 2, y: 1 }, { x: 5, y: 1 }, { x: 8, y: 1 }],
        obstacles: [{ x: 3, y: 1 }, { x: 6, y: 1 }, { x: 0, y: 4 }, { x: 4, y: 4 }, { x: 9, y: 4 }],
        castPath: 'for index, color in enumerate(colors):\n    hero.cast_color(color[0], color[1], color[2])\n    if index < 2:\n        hero.move_down(2)\n        hero.move_right(3)\n        hero.move_up(2)',
    },
    '4-2': {
        spawn: { x: 8, y: 3 },
        targets: [{ x: 7, y: 3 }, { x: 4, y: 3 }, { x: 1, y: 3 }],
        obstacles: [{ x: 6, y: 3 }, { x: 3, y: 3 }, { x: 0, y: 0 }, { x: 4, y: 0 }, { x: 9, y: 0 }],
        castPath: 'for index, color in enumerate(colors):\n    hero.cast_color(color[0], color[1], color[2])\n    if index < 2:\n        hero.move_up(2)\n        hero.move_left(3)\n        hero.move_down(2)',
    },
    '4-3': {
        spawn: { x: 1, y: 4 },
        targets: [{ x: 1, y: 3 }, { x: 4, y: 2 }, { x: 7, y: 1 }],
        obstacles: [{ x: 3, y: 4 }, { x: 6, y: 3 }, { x: 0, y: 0 }, { x: 5, y: 0 }, { x: 9, y: 4 }],
        castPath: 'for index, color in enumerate(colors):\n    hero.cast_color(color[0], color[1], color[2])\n    if index < 2:\n        hero.move_up(1)\n        hero.move_right(3)',
    },
    '4-6': {
        spawn: { x: 1, y: 0 },
        targets: [{ x: 1, y: 1 }, { x: 4, y: 2 }, { x: 7, y: 3 }],
        obstacles: [{ x: 3, y: 0 }, { x: 6, y: 1 }, { x: 0, y: 4 }, { x: 5, y: 4 }, { x: 9, y: 0 }],
        castPath: 'for index, color in enumerate(colors):\n    hero.cast_color(color[0], color[1], color[2])\n    if index < 2:\n        hero.move_down(1)\n        hero.move_right(3)',
    },
    '4-7': {
        spawn: { x: 1, y: 3 },
        targets: [{ x: 2, y: 3 }, { x: 5, y: 3 }, { x: 8, y: 3 }],
        obstacles: [{ x: 3, y: 2 }, { x: 6, y: 2 }, { x: 0, y: 0 }, { x: 9, y: 4 }],
        hazards: [{ x: 3, y: 3 }, { x: 6, y: 3 }],
        gate: { x: 9, y: 2 },
        castPath: 'for index, color in enumerate(colors):\n    hero.cast_color(color[0], color[1], color[2])\n    if index < 2:\n        hero.move_up(2)\n        hero.move_right(3)\n        hero.move_down(2)\nhero.move_up(1)\nhero.move_right(2)',
    },
};

function createStage(key, stage) {
    const chapter = Number(key[0]);
    const isSimplified = Number(key.split('-')[1]) >= 4;
    const changedPixel = stage.source.findIndex((pixel, i) => JSON.stringify(pixel) !== JSON.stringify(stage.result[i]));
    const workedExample = isSimplified && changedPixel >= 0
        ? ` Example: ${JSON.stringify(stage.source[changedPixel])} becomes ${JSON.stringify(stage.result[changedPixel])}.`
        : '';
    const scene = chapter === 3 ? 'Whispering Caverns' : 'Ash Peaks';
    const isFinalBoss = key === '4-7';
    const layout = STAGE_LAYOUTS[key];
    const castPath = layout.castPath;
    const fullCode = `def transform(pixels):\n    ${stage.code}\n\npixels = ${JSON.stringify(stage.source)}\ncolors = transform(pixels)\n${castPath}`;
    const startBody = stage.starter || 'pass  # Write the pixel filter here';
    const initialCode = fullCode.replace(`    ${stage.code}\n`, `    ${startBody}\n`);
    const visionChecks = stage.probe.slice(0, 1).map((image, index) =>
        `assert transform(${JSON.stringify(image)}) == ${JSON.stringify(probes[key][index])}, "Image filter failed test row ${index + 1}"`
    );
    const colorTargets = stage.source.map((rgb, index) => ({
        id: `${key}-pixel-${index}`, name: `${isFinalBoss ? 'Color Seal' : 'Pixel'} ${index + 1}`, icon: stage.icon,
        x: layout.targets[index].x, y: layout.targets[index].y, sourceRgb: rgb, targetRgb: stage.result[index],
        muralId: `${key}-image`,
    }));
    return {
        title: stage.title, chapter: `Chapter ${chapter}: ${stage.title}`,
        location: `${scene} - ${stage.title}`, stageType: stage.type || 'challenge',
        difficulty: isSimplified ? (stage.type === 'boss' ? 2 : 1) : stage.type === 'boss' ? 4 : chapter === 4 ? 3 : 2,
        xpReward: stage.xp, teachingConcepts: [stage.concept],
        prerequisiteConcepts: chapter === 3 ? ['rgb', 'variables'] : ['rgb', 'lists'],
        hasStoryIntro: true,
        storyIntro: {
            sceneName: stage.title, npcName: isFinalBoss ? 'Krakk' : chapter === 3 ? 'Cave Warden' : 'Rune Keeper',
            npcTitle: isFinalBoss ? 'Summus Magus Monotoniae' : chapter === 3 ? 'Guardian of the Caverns' : 'Guardian of Ash Peaks',
            npcIcon: isFinalBoss ? 'fas fa-hat-wizard' : stage.icon,
            dialogues: [
                ...(storyLore[key] ? [{ speaker: isFinalBoss ? 'Krakk' : chapter === 3 ? 'Cave Warden' : 'Rune Keeper', text: storyLore[key], emotion: 'mysterious' }] : []),
                { speaker: chapter === 3 ? 'Cave Warden' : 'Rune Keeper', text: stage.concept, emotion: 'teaching' },
                { speaker: chapter === 3 ? 'Cave Warden' : 'Rune Keeper', text: stage.task, emotion: 'mysterious' },
            ],
            enterButtonText: 'Restore the Image', enterButtonIcon: stage.icon,
        },
        arena: {
            theme: chapter === 3 ? 'cavern' : 'peaks', blockMovement: true,
            cols: 10, rows: 5, spawn: layout.spawn,
            murals: [{ id: `${key}-image`, name: `${stage.title} image` }],
            colorTargets,
            obstacles: layout.obstacles,
            ...(layout.portals ? { portals: layout.portals } : {}),
            ...(stage.gate ? { gate: { x: layout.gate.x, y: layout.gate.y, name: stage.gate } } : {}),
            ...(isFinalBoss ? {
                boss: { name: 'Krakk, Summus Magus Monotoniae', x: 9, y: 0 },
                hazards: layout.hazards,
            } : {}),
        },
        objective: isFinalBoss
            ? `${stage.task} Avoid the marked shadow tiles, restore all three seals, and reach the gate. <span class="highlight">5-minute time limit.</span>`
            : `${stage.task} <span class="highlight">${stage.concept}</span>${chapter === 3 ? ' Watch out for winding stalagmites and floor portal traps.' : ''}`,
        initialCode, visionChecks,
        completeMessage: isFinalBoss ? 'Krakk is defeated. The stolen colors return to the kingdom!' : `The image at ${stage.title} shines again!`,
        hints: [
            { level: 1, text: stage.clue + workedExample },
            { level: 2, text: isSimplified ? 'The winding path around obstacles and portals is ready. Change only the marked line in transform().' : 'Return exactly three RGB pixels. Your filter also needs to work on one more simple row.' },
            { level: 3, text: `def transform(pixels):\n    ${stage.code}` },
        ],
        grimoire: [{
            leftTitle: stage.title, leftIcon: stage.icon, leftContent: stage.concept,
            leftCode: `def transform(pixels):\n    ${stage.code}`,
            leftNote: 'An image is a grid of RGB pixels. Here, each rune represents one pixel in a row.',
            leftIncantations: [
                { code: 'pixels[index]', desc: 'Read a pixel by position' },
                { code: 'hero.cast_color(r, g, b)', desc: 'Restore a pixel in the arena' },
            ],
            rightTitle: 'The Living Image', rightIcon: 'fas fa-image',
            rightContent: 'Run the Python filter and watch the rune image change one pixel at a time.',
            rightColors: ['#d7884d', '#a8a1c9', '#e4c780'],
            rightQuote: '"A pattern becomes visible when each pixel finds its place."',
        }],
        skills: [{ name: stage.title, type: 'VISION', icon: stage.icon, desc: stage.concept, pct: 100 }],
        rewards: { spellUnlock: null, titleUnlock: stage.type === 'boss' ? (chapter === 3 ? 'Rune Seer' : 'Spectrum Lord') : null, outfitPart: null },
    };
}

export const CHAPTER_THREE_FOUR_STAGES = Object.fromEntries(
    Object.entries(stages).map(([key, stage]) => [key, createStage(key, stage)])
);
