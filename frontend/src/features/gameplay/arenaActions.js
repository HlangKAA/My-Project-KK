/** Translate the Python hero API into actions consumed by CodeCombatArena. */
export function createArenaCallbacks(onSuccess, onError) {
    const actions = [];
    const move = dir => (n = 1) => {
        const count = Math.max(1, Number(n) || 1);
        for (let i = 0; i < count; i++) actions.push({ type: 'move', dir, steps: 1 });
    };
    const pickUp = () => actions.push({ type: 'pick_up' });
    const putIn = targetType => actions.push({ type: 'put_in', targetType: String(targetType) });

    return {
        move_right: move('right'), move_left: move('left'),
        move_up: move('up'), move_down: move('down'),
        move_to: (x, y) => actions.push({ type: 'move_to', x: Number(x), y: Number(y) }),
        move_to_x: x => actions.push({ type: 'move_to_x', targetX: Number(x) }),
        pick_up: pickUp, collect: pickUp,
        put_in: putIn, deposit: putIn,
        cast_color: (r, g, b) => actions.push({ type: 'cast_color', args: [Number(r), Number(g), Number(b)] }),
        say: msg => actions.push({ type: 'print', text: String(msg) }),
        __onPrint: text => {
            const clean = String(text).trim();
            if (clean && !clean.startsWith('>') && !clean.startsWith('[')) {
                actions.push({ type: 'print', text: clean });
            }
        },
        __onSuccess: () => onSuccess(actions),
        __onError: onError,
    };
}
