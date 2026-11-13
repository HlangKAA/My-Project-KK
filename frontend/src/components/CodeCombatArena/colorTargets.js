export const isValidRgb = rgb =>
    Array.isArray(rgb) && rgb.length === 3 &&
    rgb.every(channel => Number.isInteger(channel) && channel >= 0 && channel <= 255);

export const areColorTargetsMatched = (targets, states) =>
    targets.length > 0 && targets.every(target => {
        const actual = states[target.id]?.rgb;
        return isValidRgb(actual) &&
            target.targetRgb.every((channel, index) => actual[index] === channel);
    });
