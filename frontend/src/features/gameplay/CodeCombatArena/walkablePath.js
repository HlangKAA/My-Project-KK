/**
 * Computes a connected set of walkable path tiles ("x,y") between the hero's
 * spawn position and all interactive targets (items, flasks, colorTargets,
 * braziers, altar, gate) while avoiding blocking obstacles and hazards.
 */
export function computeWalkablePathTiles({
    cols = 10,
    rows = 7,
    spawn = { x: 1, y: 1 },
    items = [],
    flasks = [],
    colorTargets = [],
    braziers = [],
    altar = null,
    gate = null,
    obstacles = [],
    hazards = [],
    portals = [],
}) {
    const blocked = new Set([
        ...obstacles.map(o => `${o.x},${o.y}`),
        ...hazards.map(h => `${h.x},${h.y}`),
        ...portals.map(p => `${p.x},${p.y}`),
    ]);
    const pathSet = new Set([`${spawn.x},${spawn.y}`]);

    const waypoints = [
        spawn,
        ...items,
        ...flasks,
        ...colorTargets,
        ...braziers,
        ...(altar ? [altar] : []),
        ...(gate ? [gate] : []),
    ];

    const bfsSegment = (start, goal) => {
        const startKey = `${start.x},${start.y}`;
        const goalKey = `${goal.x},${goal.y}`;
        if (startKey === goalKey) return [start];

        const queue = [start];
        const parent = new Map([[startKey, null]]);
        const dirs = [
            { dx: 0, dy: -1 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
        ];

        while (queue.length > 0) {
            const cur = queue.shift();
            const curKey = `${cur.x},${cur.y}`;
            if (curKey === goalKey) break;

            for (const { dx, dy } of dirs) {
                const nx = cur.x + dx;
                const ny = cur.y + dy;
                const nKey = `${nx},${ny}`;
                if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
                if (parent.has(nKey)) continue;
                if (blocked.has(nKey) && nKey !== goalKey) continue;
                parent.set(nKey, cur);
                queue.push({ x: nx, y: ny });
            }
        }

        if (!parent.has(goalKey)) return [];
        const segment = [];
        let node = goal;
        while (node) {
            segment.push(node);
            node = parent.get(`${node.x},${node.y}`);
        }
        return segment;
    };

    for (let i = 0; i < waypoints.length - 1; i++) {
        const seg = bfsSegment(waypoints[i], waypoints[i + 1]);
        seg.forEach(pt => pathSet.add(`${pt.x},${pt.y}`));
    }

    return pathSet;
}
