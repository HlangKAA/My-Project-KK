import test from 'node:test';
import assert from 'node:assert/strict';
import { createArenaCallbacks } from './arenaActions.js';
import { validateStageCode } from './codeValidator.js';
import { calculateXP } from '../character/characterData.js';
import { REGIONS, STAGE_DATA } from '../stages/stageData.js';
import { STAGE_GUIDES, STAGE_PEDAGOGY } from '../stages/stageGuides.js';
import { computeWalkablePathTiles } from './CodeCombatArena/walkablePath.js';

test('Python hero commands preserve movement and spell order', () => {
    let result;
    const hero = createArenaCallbacks(actions => { result = actions; }, () => {});
    hero.move_right(2);
    hero.pick_up();
    hero.move_to_x('4');
    hero.cast_color('12', 34, 56);
    hero.__onPrint('restored');
    hero.__onSuccess();

    assert.deepEqual(result, [
        { type: 'move', dir: 'right', steps: 1 },
        { type: 'move', dir: 'right', steps: 1 },
        { type: 'pick_up' },
        { type: 'move_to_x', targetX: 4 },
        { type: 'cast_color', args: [12, 34, 56] },
        { type: 'print', text: 'restored' },
    ]);
});

test('aliases and errors continue to reach the arena', () => {
    let result;
    let failure;
    const hero = createArenaCallbacks(actions => { result = actions; }, error => { failure = error; });
    hero.collect();
    hero.deposit('str');
    hero.move_up();
    hero.__onError('spell failed');
    hero.__onSuccess();
    assert.deepEqual(result, [
        { type: 'pick_up' },
        { type: 'put_in', targetType: 'str' },
        { type: 'move', dir: 'up', steps: 1 },
    ]);
    assert.equal(failure, 'spell failed');
});

test('calculateXP reduces hint bonus per hint used and hides bonus at 3 hints', () => {
    const xp0 = calculateXP(150, { firstAttempt: true, hintsUsed: 0 });
    const xp1 = calculateXP(150, { firstAttempt: true, hintsUsed: 1 });
    const xp2 = calculateXP(150, { firstAttempt: true, hintsUsed: 2 });
    const xp3 = calculateXP(150, { firstAttempt: true, hintsUsed: 3 });

    assert.equal(xp0.earnedXP, 270);
    assert.equal(xp0.appliedBonuses.length, 2);
    assert.equal(xp0.appliedBonuses[1].label, 'No Hints Used');
    assert.equal(xp0.appliedBonuses[1].bonusXP, 45);

    assert.equal(xp1.earnedXP, 255);
    assert.equal(xp1.appliedBonuses[1].label, 'Hint Bonus (1/3 Hints Used)');
    assert.equal(xp1.appliedBonuses[1].bonusXP, 30);

    assert.equal(xp2.earnedXP, 240);
    assert.equal(xp2.appliedBonuses[1].label, 'Hint Bonus (2/3 Hints Used)');
    assert.equal(xp2.appliedBonuses[1].bonusXP, 15);

    assert.equal(xp3.earnedXP, 225);
    assert.equal(xp3.appliedBonuses.length, 1);
    assert.equal(xp3.appliedBonuses[0].label, 'First Attempt Bonus');
});

test('validateStageCode blocks movement-only bypasses and accepts valid stage solutions', () => {
    assert.equal(validateStageCode('1-3', 'hero.move_up(2)\nhero.move_left(4)\nprint("Welcome, Eldrin!")').valid, false);
    assert.equal(validateStageCode('1-4', 'hero.move_up(2)\nhero.move_right(5)').valid, false);
    assert.equal(validateStageCode('1-5', 'hero.move_right(5)\nhero.move_down(2)').valid, false);
    assert.equal(validateStageCode('1-6', 'hero.move_left(4)\nhero.move_up(3)').valid, false);
    assert.equal(validateStageCode('2-1', 'hero.move_up(2)\nhero.move_right(3)\nhero.cast_color(120, 95, 70)').valid, false);
    assert.equal(validateStageCode('2-4', 'middle_shade = (middle_r + middle_g + middle_b) // 3\nhero.cast_color(90, 90, 90)').valid, false);
    assert.equal(validateStageCode('3-4', 'def transform(pixels):\n    return [[80,100,120],[170,70,100],[255,250,230]]\nhero.cast_color(80,100,120)').valid, false);

    // Every playable stage's full solution passes validation
    const playableKeys = Object.values(REGIONS).flatMap(region =>
        region.stages.map(stage => `${region.id}-${stage.id}`)
    );
    for (const key of playableKeys) {
        const stage = STAGE_DATA[key];
        const hint3 = stage.hints?.find(h => h.level === 3)?.text || '';
        let solutionCode = hint3;
        if (key.startsWith('3-') || key.startsWith('4-')) {
            solutionCode = stage.initialCode.replace(/def transform\(pixels\):[\s\S]*?\n\npixels =/, `${hint3}\n\npixels =`);
        } else if (['2-4', '2-5', '2-6', '2-7', '2-8'].includes(key)) {
            solutionCode = `${stage.initialCode}\n${hint3.replace(/^Inside the loop:\s*/, '        ')}`;
        }
        const check = validateStageCode(key, solutionCode);
        assert.equal(check.valid, true, `Expected stage ${key} canonical solution to pass validation`);
    }
});

test('playable stages use varied spawn coordinates and obstacle layouts', () => {
    const playableKeys = Object.values(REGIONS).flatMap(region =>
        region.stages.map(stage => `${region.id}-${stage.id}`)
    );
    const uniqueSpawns = new Set();
    for (const key of playableKeys) {
        const arena = STAGE_DATA[key].arena;
        assert.ok(arena, `Stage ${key} should have an arena config`);
        assert.equal(arena.blockMovement, true, `Stage ${key} should enable blockMovement`);
        assert.ok(Array.isArray(arena.obstacles) && arena.obstacles.length >= 3, `Stage ${key} should have obstacles`);
        uniqueSpawns.add(`${arena.spawn.x},${arena.spawn.y}`);
    }
    assert.ok(uniqueSpawns.size >= 8, `Expected at least 8 distinct spawn positions across stages, found ${uniqueSpawns.size}`);
});

test('computeWalkablePathTiles connects spawn to targets and avoids obstacles', () => {
    const playableKeys = Object.values(REGIONS).flatMap(region =>
        region.stages.map(stage => `${region.id}-${stage.id}`)
    );
    for (const key of playableKeys) {
        const arena = STAGE_DATA[key].arena;
        const pathSet = computeWalkablePathTiles(arena);
        assert.ok(pathSet.has(`${arena.spawn.x},${arena.spawn.y}`), `Stage ${key} path should include spawn`);
        assert.ok(pathSet.size >= 4, `Stage ${key} should compute a connected walkable path corridor`);
        for (const ob of arena.obstacles) {
            assert.equal(pathSet.has(`${ob.x},${ob.y}`), false, `Stage ${key} walkable path must not overlap obstacle (${ob.x},${ob.y})`);
        }
    }
});

test('STAGE_PEDAGOGY separates Guided Lesson tutorials from Applied Knowledge Challenges', () => {
    const playableStages = Object.values(REGIONS).flatMap(region =>
        region.stages.map(stage => ({ key: `${region.id}-${stage.id}`, type: stage.type }))
    );
    for (const { key, type } of playableStages) {
        const pedagogy = STAGE_PEDAGOGY[key];
        assert.ok(pedagogy, `Stage ${key} should define STAGE_PEDAGOGY`);
        if (type === 'lesson') {
            assert.equal(pedagogy.mode, 'lesson');
            assert.ok(pedagogy.conceptBreakdown?.en && pedagogy.conceptBreakdown?.th);
            assert.ok(pedagogy.syntaxStructure);
            assert.ok(Array.isArray(pedagogy.lineWalkthrough) && pedagogy.lineWalkthrough.length >= 3);
            assert.ok(Array.isArray(pedagogy.steps) && pedagogy.steps.length === 3);
        } else {
            assert.equal(pedagogy.mode, type);
            assert.ok(Array.isArray(pedagogy.appliedFrom) && pedagogy.appliedFrom.length >= 1, `Challenge/Boss ${key} must link prior stages`);
            assert.ok(pedagogy.challengeBrief?.en && pedagogy.challengeBrief?.th);
        }
    }
});

test('obsolete legacy stages are removed across catalogs and Chapter 1-3 mechanics are wired', () => {
    for (const removedKey of ['3-3', '3-6', '4-4', '4-5']) {
        assert.equal(STAGE_DATA[removedKey], undefined, `Legacy stage ${removedKey} must not remain in STAGE_DATA`);
        assert.equal(STAGE_GUIDES[removedKey], undefined, `Legacy stage ${removedKey} must not remain in STAGE_GUIDES`);
        assert.equal(STAGE_PEDAGOGY[removedKey], undefined, `Legacy stage ${removedKey} must not remain in STAGE_PEDAGOGY`);
    }

    for (const key of ['1-2', '1-3', '1-4', '1-5', '1-6', '1-7']) {
        const arena = STAGE_DATA[key].arena;
        assert.ok(Array.isArray(arena.items) && arena.items.length >= 1, `Stage ${key} should define pick_up items`);
        assert.ok(Array.isArray(arena.flasks) && arena.flasks.length >= 1, `Stage ${key} should define put_in flasks`);
    }

    const portalStages = [
        '2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '2-7', '2-8',
        '3-1', '3-2', '3-4', '3-5', '3-7',
    ];
    for (const key of portalStages) {
        const arena = STAGE_DATA[key].arena;
        assert.ok(Array.isArray(arena.portals) && arena.portals.length >= 2, `Stage ${key} should define at least 2 floor portals`);
        const pathSet = computeWalkablePathTiles(arena);
        for (const portal of arena.portals) {
            assert.equal(pathSet.has(`${portal.x},${portal.y}`), false, `Stage ${key} walkable path must not overlap portal (${portal.x},${portal.y})`);
        }
    }
});

test('all playable stages use Skulpt-safe visionChecks and non-overlapping arena tiles', () => {
    const playableKeys = Object.values(REGIONS).flatMap(region =>
        region.stages.map(stage => `${region.id}-${stage.id}`)
    );
    for (const key of playableKeys) {
        const stage = STAGE_DATA[key];
        for (const check of stage.visionChecks || []) {
            assert.equal(/\bdir\s*\(/.test(check), false, `Stage ${key} visionChecks must not call dir() (unsupported in Skulpt 1.2.0)`);
            assert.equal(/\blocals\s*\(/.test(check), false, `Stage ${key} visionChecks must not call locals() (unsupported in Skulpt 1.2.0)`);
        }

        const arena = stage.arena;
        const buckets = [
            ['spawn', [arena.spawn]],
            ['obstacle', arena.obstacles || []],
            ['portal', arena.portals || []],
            ['hazard', arena.hazards || []],
            ['item', arena.items || []],
            ['flask', arena.flasks || []],
            ['colorTarget', arena.colorTargets || []],
            ['altar', arena.altar ? [arena.altar] : []],
            ['gate', arena.gate ? [arena.gate] : []],
            ['boss', arena.boss ? [arena.boss] : []],
        ];
        const occupied = new Map();
        for (const [kind, list] of buckets) {
            for (const obj of list) {
                assert.ok(obj.x >= 0 && obj.x < arena.cols && obj.y >= 0 && obj.y < arena.rows,
                    `Stage ${key} ${kind} (${obj.x},${obj.y}) out of bounds`);
                const tileKey = `${obj.x},${obj.y}`;
                assert.equal(occupied.has(tileKey), false,
                    `Stage ${key} has overlapping ${occupied.get(tileKey)} and ${kind} at (${tileKey})`);
                occupied.set(tileKey, kind);
            }
        }
    }
});
