// Each rune or cave light represents one image pixel. The same Python filter
// must work on the visible image and on unseen images checked at run time.
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
        code: 'return [pixels[0], pixels[1], pixels[2]]',
        clue: 'Make a list with square brackets and read each pixel by its position (index).',
        icon: 'fas fa-th-list', xp: 220, type: 'lesson',
    },
    '3-2': {
        title: 'Rune Positions', concept: 'Pixel indexing locates an exact position in an image row.',
        task: 'The first and last pixels were swapped. Return them in the correct order.',
        source: [B, G, R], result: [R, G, B], probe: [[G, R, B], [W, D, R]],
        code: 'return [pixels[2], pixels[1], pixels[0]]',
        clue: 'The indexes are 0, 1, 2. Reverse the outer two.',
        icon: 'fas fa-hand-pointer', xp: 240,
    },
    '3-3': {
        title: 'The Matrix Search', concept: 'Searching a pixel row finds the brightest red sample, a simple feature detector.',
        task: 'Find the pixel with the most red using .index() and max(). Turn that pixel gold.',
        source: [[20, 50, 90], [180, 30, 50], [70, 70, 70]],
        result: [[20, 50, 90], [255, 200, 40], [70, 70, 70]],
        probe: [[[190, 0, 0], [10, 20, 30], [40, 50, 60]], [[30, 20, 10], [40, 50, 60], [200, 0, 0]]],
        code: 'reds = [pixel[0] for pixel in pixels]\n    position = reds.index(max(reds))\n    result = pixels[:] \n    result[position] = [255, 200, 40]\n    return result',
        clue: 'Build a list of red values, find max(reds), then reds.index(...) gives the pixel position.',
        icon: 'fas fa-search', xp: 280,
    },
    '3-4': {
        title: 'The Echo Loop', concept: 'A for loop applies the same image filter to every pixel.',
        task: 'Brighten every channel by 30, stopping at 255.',
        source: [[50, 70, 90], [140, 40, 70], [240, 220, 200]],
        result: [[80, 100, 120], [170, 70, 100], [255, 250, 230]],
        probe: [[[0, 0, 0], [250, 1, 2], [10, 20, 30]], [[255, 255, 255], [100, 120, 140], [220, 230, 240]]],
        code: 'result = []\n    for pixel in pixels:\n        result.append([min(255, channel + 30) for channel in pixel])\n    return result',
        clue: 'Loop over pixels, then use min(255, channel + 30) for every RGB channel.',
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
        clue: 'RGB uses indexes 0, 1, 2. The broken loop swaps red and green.',
        icon: 'fas fa-bug', xp: 310,
    },
    '3-7': {
        title: 'Pixel Trail', concept: 'Traversing a pixel row restores an image one sample at a time.',
        task: 'Reverse the row with a loop and append(), so the rune trail reads from right to left.',
        source: [B, G, R], result: [R, G, B], probe: [[R, B, G], [D, R, W]],
        code: 'result = []\n    for index in range(len(pixels) - 1, -1, -1):\n        result.append(pixels[index])\n    return result',
        clue: 'Loop over indexes 2, 1, 0 with range(len(pixels) - 1, -1, -1).',
        icon: 'fas fa-route', xp: 330,
    },
    '3-8': {
        title: 'The Hidden Pattern', concept: 'A repeated pixel pattern can reveal a feature hidden in an image.',
        task: 'If the outer pixels match, make the center gold; otherwise leave the row unchanged.',
        source: [R, D, R], result: [R, [255, 200, 40], R],
        probe: [[G, D, B], [B, W, B]],
        code: 'result = pixels[:] \n    if pixels[0] == pixels[2]:\n        result[1] = [255, 200, 40]\n    return result',
        clue: 'Compare pixels[0] with pixels[2]. Change only the middle pixel if they match.',
        icon: 'fas fa-chess-board', xp: 350,
    },
    '3-6': {
        title: 'The Peak Trial', concept: 'Indexing, searching, and loops combine to locate and restore image features.',
        task: 'Brighten every pixel by 20, then mark the brightest original red pixel gold.',
        source: [[30, 40, 50], [200, 30, 20], [70, 80, 90]],
        result: [[50, 60, 70], [255, 200, 40], [90, 100, 110]],
        probe: [[[230, 0, 0], [40, 50, 60], [10, 20, 30]], [[1, 2, 3], [30, 40, 50], [180, 70, 80]]],
        code: 'reds = [pixel[0] for pixel in pixels]\n    result = []\n    for pixel in pixels:\n        result.append([min(255, channel + 20) for channel in pixel])\n    result[reds.index(max(reds))] = [255, 200, 40]\n    return result',
        clue: 'Save the original red values, brighten each pixel, then replace the pixel at reds.index(max(reds)).',
        icon: 'fas fa-crown', xp: 450, type: 'boss', gate: 'Summit Gate',
    },
    '4-1': {
        title: 'The Crossroads', concept: 'Thresholding turns image brightness into a black or white mask.',
        task: 'For every pixel, average its RGB values. Use white when the average is at least 128, otherwise black.',
        source: [[30, 30, 30], [180, 180, 180], [90, 150, 120]],
        result: [[0, 0, 0], [255, 255, 255], [0, 0, 0]],
        probe: [[[128, 128, 128], [127, 127, 127], [0, 0, 255]], [[255, 255, 255], [60, 90, 100], [130, 130, 130]]],
        code: 'result = []\n    for pixel in pixels:\n        if sum(pixel) / 3 >= 128:\n            result.append([255, 255, 255])\n        else:\n            result.append([0, 0, 0])\n    return result',
        clue: 'Use sum(pixel) / 3 as brightness, then an if/else to choose the mask color.',
        icon: 'fas fa-code-branch', xp: 300, type: 'lesson',
    },
    '4-2': {
        title: 'Path Selection', concept: 'if/elif/else selects a different filter for each brightness range.',
        task: 'Classify average brightness: below 85 blue, below 170 gold, otherwise white.',
        source: [[30, 30, 30], [120, 120, 120], [220, 220, 220]],
        result: [B, [255, 200, 40], W],
        probe: [[[84, 84, 84], [85, 85, 85], [170, 170, 170]], [[0, 0, 0], [169, 169, 169], [255, 255, 255]]],
        code: 'result = []\n    for pixel in pixels:\n        light = sum(pixel) / 3\n        if light < 85:\n            result.append([35, 90, 220])\n        elif light < 170:\n            result.append([255, 200, 40])\n        else:\n            result.append([240, 240, 240])\n    return result',
        clue: 'Check the lower threshold first, then use elif for the middle range.',
        icon: 'fas fa-directions', xp: 320,
    },
    '4-3': {
        title: 'Truth and Lies', concept: 'Boolean masks select pixels by combining channel conditions.',
        task: 'Keep a pixel only if red is above 100 AND blue is below 100; make all others black.',
        source: [[180, 30, 40], [40, 200, 40], [180, 30, 180]],
        result: [[180, 30, 40], [0, 0, 0], [0, 0, 0]],
        probe: [[[101, 0, 99], [100, 0, 99], [101, 0, 100]], [[255, 255, 0], [0, 0, 0], [150, 80, 20]]],
        code: 'result = []\n    for pixel in pixels:\n        if pixel[0] > 100 and pixel[2] < 100:\n            result.append(pixel)\n        else:\n            result.append([0, 0, 0])\n    return result',
        clue: 'Use and so both tests must be true. The comparison is strict: > 100 and < 100.',
        icon: 'fas fa-toggle-on', xp: 340,
    },
    '4-4': {
        title: 'Broken Bridges', concept: 'A reversed comparison breaks a threshold mask and hides the wrong pixels.',
        task: 'Fix the comparison: keep pixels whose average brightness is at least 100; black out the rest.',
        source: [[30, 30, 30], [100, 100, 100], [200, 150, 100]],
        result: [[0, 0, 0], [100, 100, 100], [200, 150, 100]],
        probe: [[[99, 99, 99], [101, 101, 101], [0, 150, 150]], [[255, 255, 255], [0, 0, 0], [50, 100, 150]]],
        starter: 'result = []\n    for pixel in pixels:\n        if sum(pixel) / 3 < 100:\n            result.append(pixel)\n        else:\n            result.append([0, 0, 0])\n    return result',
        code: 'result = []\n    for pixel in pixels:\n        if sum(pixel) / 3 >= 100:\n            result.append(pixel)\n        else:\n            result.append([0, 0, 0])\n    return result',
        clue: 'The comparison points the wrong way. Include brightness exactly equal to 100.',
        icon: 'fas fa-bug', xp: 360,
    },
    '4-5': {
        title: 'The Color Mixer', concept: 'Conditional color mixing changes RGB channels based on the source pixel.',
        task: 'If red is strongest, add 40 green; otherwise add 40 blue. Cap the changed channel at 255.',
        source: [[190, 30, 20], [20, 180, 40], [10, 20, 210]],
        result: [[190, 70, 20], [20, 180, 80], [10, 20, 250]],
        probe: [[[250, 250, 10], [20, 255, 250], [255, 0, 255]], [[0, 0, 0], [30, 20, 10], [1, 2, 3]]],
        code: 'result = []\n    for r, g, b in pixels:\n        if r > g and r > b:\n            result.append([r, min(255, g + 40), b])\n        else:\n            result.append([r, g, min(255, b + 40)])\n    return result',
        clue: 'Compare red with both other channels; only then add green. Otherwise add blue.',
        icon: 'fas fa-tint', xp: 380,
    },
    '4-7': {
        title: 'Shadow Boundaries', concept: 'Edge detection compares neighboring pixels to find a light to shadow boundary.',
        task: 'Make a pixel gold if its average brightness differs from the previous pixel by at least 80; keep other pixels.',
        source: [[30, 30, 30], [200, 200, 200], [210, 210, 210]],
        result: [[30, 30, 30], [255, 200, 40], [210, 210, 210]],
        probe: [[[200, 200, 200], [20, 20, 20], [200, 200, 200]], [[50, 50, 50], [129, 129, 129], [209, 209, 209]]],
        code: 'result = [pixels[0]]\n    for index in range(1, len(pixels)):\n        left = sum(pixels[index - 1]) / 3\n        right = sum(pixels[index]) / 3\n        if abs(right - left) >= 80:\n            result.append([255, 200, 40])\n        else:\n            result.append(pixels[index])\n    return result',
        clue: 'Use abs(right - left) to detect a large brightness change between neighbors.',
        icon: 'fas fa-adjust', xp: 400,
    },
    '4-8': {
        title: 'The Color Seal', concept: 'A color mask identifies dark pixels before applying an RGB transformation.',
        task: 'Turn pixels with every channel below 100 into gold. For all others, brighten blue by 20.',
        source: [[20, 30, 40], [180, 60, 40], [40, 150, 240]],
        result: [[255, 200, 40], [180, 60, 60], [40, 150, 255]],
        probe: [[[99, 99, 99], [100, 99, 99], [0, 0, 240]], [[0, 0, 0], [200, 200, 200], [99, 100, 99]]],
        code: 'result = []\n    for r, g, b in pixels:\n        if r < 100 and g < 100 and b < 100:\n            result.append([255, 200, 40])\n        else:\n            result.append([r, g, min(255, b + 20)])\n    return result',
        clue: 'Check all three channels for the dark mask; use min(255, b + 20) on other pixels.',
        icon: 'fas fa-shield-alt', xp: 420,
    },
    '4-6': {
        title: 'The Light Convergence', concept: 'The final image combines thresholding, boolean logic, and RGB color restoration.',
        task: 'If average brightness is below 85, make white. If red is strongest, add 50 blue. Otherwise keep the pixel.',
        source: [[20, 30, 40], [200, 40, 30], [40, 180, 90]],
        result: [[255, 255, 255], [200, 40, 80], [40, 180, 90]],
        probe: [[[84, 84, 84], [200, 0, 250], [250, 30, 230]], [[85, 85, 85], [200, 10, 240], [0, 200, 0]]],
        code: 'result = []\n    for r, g, b in pixels:\n        if (r + g + b) / 3 < 85:\n            result.append([255, 255, 255])\n        elif r > g and r > b:\n            result.append([r, g, min(255, b + 50)])\n        else:\n            result.append([r, g, b])\n    return result',
        clue: 'Test darkness first, then test whether red is the strongest channel. Cap blue at 255.',
        icon: 'fas fa-sun', xp: 600, type: 'boss', gate: 'Spectrum Gate',
    },
};

const probes = {
    '3-1': [[B, R, G], [D, W, R]],
    '3-2': [[B, R, G], [R, D, W]],
    '3-3': [[[255, 200, 40], [10, 20, 30], [40, 50, 60]], [[30, 20, 10], [40, 50, 60], [255, 200, 40]]],
    '3-4': [[[30, 30, 30], [255, 31, 32], [40, 50, 60]], [[255, 255, 255], [130, 150, 170], [250, 255, 255]]],
    '3-5': [[[20, 100, 200], [255, 10, 10], [35, 15, 15]], [[255, 0, 0], [90, 80, 90], [21, 2, 3]]],
    '3-7': [[G, B, R], [W, R, D]],
    '3-8': [[G, D, B], [B, [255, 200, 40], B]],
    '3-6': [[[255, 200, 40], [60, 70, 80], [30, 40, 50]], [[21, 22, 23], [50, 60, 70], [255, 200, 40]]],
    '4-1': [[[255, 255, 255], [0, 0, 0], [0, 0, 0]], [[255, 255, 255], [0, 0, 0], [255, 255, 255]]],
    '4-2': [[B, [255, 200, 40], W], [B, [255, 200, 40], W]],
    '4-3': [[[101, 0, 99], [0, 0, 0], [0, 0, 0]], [[255, 255, 0], [0, 0, 0], [150, 80, 20]]],
    '4-4': [[[0, 0, 0], [101, 101, 101], [0, 150, 150]], [[255, 255, 255], [0, 0, 0], [50, 100, 150]]],
    '4-5': [[[250, 250, 50], [20, 255, 255], [255, 0, 255]], [[0, 0, 40], [30, 60, 10], [1, 2, 43]]],
    '4-7': [[[200, 200, 200], [255, 200, 40], [255, 200, 40]], [[50, 50, 50], [129, 129, 129], [255, 200, 40]]],
    '4-8': [[[255, 200, 40], [100, 99, 119], [0, 0, 255]], [[255, 200, 40], [200, 200, 220], [99, 100, 119]]],
    '4-6': [[[255, 255, 255], [200, 0, 250], [250, 30, 255]], [[85, 85, 85], [200, 10, 240], [255, 255, 255]]],
};

const storyLore = {
    '3-1': 'The mountain runes record where Krakk carried the stolen colors. Read each pixel carefully; his trail is hidden in their order.',
    '3-6': 'The summit image points to the Whispering Caverns. Krakk hid his final spell beyond that darkness.',
    '4-1': 'Krakk is close. His spell turns light into shadow, but a careful threshold can reveal the path.',
    '4-6': 'I am Krakk, Summus Magus Monotoniae. I stole this kingdom\'s colors so no one could dream beyond my rule. Your little book cannot undo me.',
};

function createStage(key, stage) {
    const chapter = Number(key[0]);
    const scene = chapter === 3 ? 'Ash Peaks' : 'Whispering Caverns';
    const isFinalBoss = key === '4-6';
    const castPath = isFinalBoss
        ? 'for index, color in enumerate(colors):\n    hero.cast_color(color[0], color[1], color[2])\n    if index < 2:\n        hero.move_up(1)\n        hero.move_right(3)\n        hero.move_down(1)\nhero.move_right(2)\nhero.move_down(2)'
        : `for color in colors:\n    hero.cast_color(color[0], color[1], color[2])\n    hero.move_right(3)${stage.gate ? '\nhero.move_down(2)' : ''}`;
    const fullCode = `def transform(pixels):\n    ${stage.code}\n\npixels = ${JSON.stringify(stage.source)}\ncolors = transform(pixels)\n${castPath}`;
    const startBody = stage.starter || 'pass  # Write the pixel filter here';
    const initialCode = fullCode.replace(`    ${stage.code}\n`, `    ${startBody}\n`);
    const visionChecks = stage.probe.map((image, index) =>
        `assert transform(${JSON.stringify(image)}) == ${JSON.stringify(probes[key][index])}, "Image filter failed test row ${index + 1}"`
    );
    const colorTargets = stage.source.map((rgb, index) => ({
        id: `${key}-pixel-${index}`, name: `${isFinalBoss ? 'Color Seal' : 'Pixel'} ${index + 1}`, icon: stage.icon,
        x: 2 + index * 3, y: 2, sourceRgb: rgb, targetRgb: stage.result[index],
        muralId: `${key}-image`,
    }));
    return {
        title: stage.title, chapter: `Chapter ${chapter}: ${stage.title}`,
        location: `${scene} - ${stage.title}`, stageType: stage.type || 'challenge',
        difficulty: stage.type === 'boss' ? 4 : chapter === 4 ? 3 : 2,
        xpReward: stage.xp, teachingConcepts: [stage.concept],
        prerequisiteConcepts: chapter === 3 ? ['rgb', 'variables'] : ['rgb', 'lists'],
        hasStoryIntro: true,
        storyIntro: {
            sceneName: stage.title, npcName: isFinalBoss ? 'Krakk' : chapter === 3 ? 'Rune Keeper' : 'Cave Warden',
            npcTitle: isFinalBoss ? 'Summus Magus Monotoniae' : chapter === 3 ? 'Guardian of the Ash Peaks' : 'Guardian of the Caverns',
            npcIcon: isFinalBoss ? 'fas fa-hat-wizard' : stage.icon,
            dialogues: [
                ...(storyLore[key] ? [{ speaker: isFinalBoss ? 'Krakk' : chapter === 3 ? 'Rune Keeper' : 'Cave Warden', text: storyLore[key], emotion: 'mysterious' }] : []),
                { speaker: chapter === 3 ? 'Rune Keeper' : 'Cave Warden', text: stage.concept, emotion: 'teaching' },
                { speaker: chapter === 3 ? 'Rune Keeper' : 'Cave Warden', text: stage.task, emotion: 'mysterious' },
            ],
            enterButtonText: 'Restore the Image', enterButtonIcon: stage.icon,
        },
        arena: {
            theme: chapter === 3 ? 'peaks' : 'cavern', blockMovement: true,
            cols: 10, rows: 5, spawn: { x: 1, y: 2 },
            murals: [{ id: `${key}-image`, name: `${stage.title} image` }],
            colorTargets,
            obstacles: [{ x: 3, y: 0 }, { x: 6, y: 4 }],
            ...(stage.gate ? { gate: { x: 9, y: 4, name: stage.gate } } : {}),
            ...(isFinalBoss ? {
                boss: { name: 'Krakk, Summus Magus Monotoniae', x: 9, y: 0 },
                hazards: [{ x: 3, y: 2 }, { x: 6, y: 2 }],
            } : {}),
        },
        objective: isFinalBoss
            ? `${stage.task} Avoid the marked shadow tiles, restore all three seals, and reach the gate. <span class="highlight">Two minutes of active execution time.</span>`
            : `${stage.task} <span class="highlight">${stage.concept}</span>`,
        initialCode, visionChecks,
        completeMessage: isFinalBoss ? 'Krakk is defeated. The stolen colors return to the kingdom!' : `The image at ${stage.title} shines again!`,
        hints: [
            { level: 1, text: stage.clue },
            { level: 2, text: isFinalBoss ? 'The marked tiles at (3, 2) and (6, 2) are dangerous. Move up, across, and down between seals.' : 'Return exactly three RGB pixels. The same filter must also work for different pixel rows.' },
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
