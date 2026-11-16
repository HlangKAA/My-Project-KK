import test from 'node:test';
import assert from 'node:assert/strict';
import { createArenaCallbacks } from './arenaActions.js';

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
