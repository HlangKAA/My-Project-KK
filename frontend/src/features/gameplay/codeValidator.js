/**
 * Validates that the player's Python code uses the required programming construct
 * and item/casting actions for each stage rather than hardcoding answers.
 */

const stripComments = (code) =>
    String(code || '')
        .split('\n')
        .map(line => line.replace(/#.*$/, '').trim())
        .filter(Boolean)
        .join('\n');

const fail = (requirementEn, requirementTh) => ({
    valid: false,
    failure: {
        kind: 'structure',
        requirementEn,
        requirementTh,
    },
});

const RULES = {
    '1-1': (clean) => {
        if (!/\bhero\.move_(?:right|left|up|down)\s*\(/.test(clean) || !/\bprint\s*\(/.test(clean)) {
            return fail(
                'Use hero movement commands to wind around the forest obstacles to the altar and chant print("Lumina").',
                'ต้องใช้คำสั่งเดินของ hero เพื่อเดินอ้อมสิ่งกีดขวางไปที่แท่นบูชา และใช้คำสั่ง print("Lumina")'
            );
        }
        return { valid: true };
    },
    '1-2': (clean) => {
        const pickCount = (clean.match(/\bhero\.(?:pick_up|collect)\s*\(/g) || []).length;
        const putCount = (clean.match(/\bhero\.(?:put_in|deposit)\s*\(/g) || []).length;
        if (pickCount < 4 || putCount < 4) {
            return fail(
                'Pick up all 4 value crystals with hero.pick_up() and deposit each one with hero.put_in().',
                'ต้องเก็บผลึกทั้ง 4 ชิ้นด้วย hero.pick_up() และนำไปใส่ขวดทั้ง 4 ด้วย hero.put_in()'
            );
        }
        return { valid: true };
    },
    '1-3': (clean) => {
        const hasNameVar = /\bname\s*=\s*["']Eldrin["']/.test(clean);
        const hasPickAndPut = /\bhero\.(?:pick_up|collect)\s*\(/.test(clean) && /\bhero\.(?:put_in|deposit)\s*\(\s*["']str["']\s*\)/.test(clean);
        const hasFString = /\bprint\s*\(\s*f["'][^"']*\{\s*name\s*\}[^"']*["']\s*\)/.test(clean);
        if (!hasNameVar || !hasPickAndPut || !hasFString) {
            return fail(
                'Pick up the sigil with hero.pick_up(), deposit it with hero.put_in("str"), keep name = "Eldrin", and use print(f"Welcome, {name}!").',
                'ต้องเก็บแผ่นรูนด้วย hero.pick_up(), วางด้วย hero.put_in("str"), กำหนด name = "Eldrin" และใช้ print(f"Welcome, {name}!")'
            );
        }
        return { valid: true };
    },
    '1-4': (clean) => {
        const hasPickAndPut = /\bhero\.(?:pick_up|collect)\s*\(/.test(clean) && /\bhero\.(?:put_in|deposit)\s*\(\s*["']bool["']\s*\)/.test(clean);
        const hasIfElse = /\bif\s+lantern_lit\b/.test(clean) && /\belse\s*:/.test(clean);
        const usesStepsVar = /\bhero\.move_(?:right|left|up|down)\s*\(\s*steps\s*\)/.test(clean);
        if (!hasPickAndPut || !hasIfElse || !usesStepsVar) {
            return fail(
                'Collect the lantern spark with hero.pick_up(), ignite the brazier with hero.put_in("bool"), use if/else to set steps, and call hero.move_right(steps).',
                'ต้องเก็บผลึกไฟด้วย hero.pick_up(), ใส่แท่นด้วย hero.put_in("bool"), ใช้ if/else กำหนด steps และสั่งเดินด้วยตัวแปร steps'
            );
        }
        return { valid: true };
    },
    '1-5': (clean) => {
        const hasPickAndPut = /\bhero\.(?:pick_up|collect)\s*\(/.test(clean) && /\bhero\.(?:put_in|deposit)\s*\(\s*["']int["']\s*\)/.test(clean);
        const hasForLoop = /\bfor\s+\w+\s+in\s+steps\s*:/.test(clean);
        const accumulatesTotal = /\btotal\s*(?:\+=\s*\w+|=\s*total\s*\+\s*\w+)/.test(clean);
        const usesTotalVar = /\bhero\.move_(?:right|left|up|down)\s*\(\s*total\s*\)/.test(clean);
        if (!hasPickAndPut || !hasForLoop || !accumulatesTotal || !usesTotalVar) {
            return fail(
                'Use a for loop over steps to accumulate total (total += step), move with hero.move_right(total), pick up the stone, and put it in the "int" vessel.',
                'ต้องใช้ลูป for บวกค่าเข้าตัวแปร total แล้วใช้เดินไปเก็บหินด้วย hero.pick_up() และใส่ขวดด้วย hero.put_in("int")'
            );
        }
        return { valid: true };
    },
    '1-6': (clean) => {
        const hasPickAndPut = /\bhero\.(?:pick_up|collect)\s*\(/.test(clean) && /\bhero\.(?:put_in|deposit)\s*\(\s*["']int["']\s*\)/.test(clean);
        const hasDef = /\bdef\s+double_steps\s*\(\s*\w+\s*\)\s*:/.test(clean);
        const hasReturn = /\breturn\s+\w+\s*\*\s*2|\breturn\s+2\s*\*\s*\w+|\breturn\s+\w+\s*\+\s*\w+/.test(clean);
        const callsFuncInMove = /\bhero\.move_(?:right|left|up|down)\s*\([^)]*\bdouble_steps\s*\(/.test(clean);
        if (!hasPickAndPut || !hasDef || !hasReturn || !callsFuncInMove) {
            return fail(
                'Define double_steps(steps) to return steps * 2, collect the Mana Core with hero.pick_up(), and place it in hero.put_in("int").',
                'ต้องสร้างฟังก์ชัน def double_steps(steps): คืนค่า steps * 2 แล้วเดินอ้อมกำแพงไปเก็บ Mana Core ด้วย hero.pick_up() และ hero.put_in("int")'
            );
        }
        return { valid: true };
    },
    '1-7': (clean) => {
        const hasNameVar = /\bname\s*=\s*["']Eldrin["']/.test(clean);
        const hasPickAndPut = /\bhero\.(?:pick_up|collect)\s*\(/.test(clean) && /\bhero\.(?:put_in|deposit)\s*\(/.test(clean);
        const hasFString = /\bprint\s*\(\s*f["'][^"']*\{\s*name\s*\}[^"']*["']\s*\)/.test(clean);
        if (!hasNameVar || !hasPickAndPut || !hasFString) {
            return fail(
                'Collect the key, place it in the flask, and chant at the gate using an f-string with {name}: print(f"Open, {name}!").',
                'ต้องเก็บกุญแจใส่ขวด และร่ายคาถาเปิดประตูด้วย f-string ที่ใช้ตัวแปร {name} เช่น print(f"Open, {name}!")'
            );
        }
        return { valid: true };
    },
    '2-1': (clean) => {
        const hasBookRecovery = /\bhero\.(?:pick_up|collect)\s*\(/.test(clean) && /\bhero\.(?:put_in|deposit)\s*\(\s*["']str["']\s*\)/.test(clean);
        const usesVars = /\br\b/.test(clean) && /\bg\b/.test(clean) && /\bb\b/.test(clean);
        const usesAddition = /\+\s*40|40\s*\+/.test(clean);
        const hardcodedTarget = /cast_color\s*\(\s*120\s*,\s*95\s*,\s*70\s*\)/.test(clean);
        if (!hasBookRecovery || !usesVars || !usesAddition || hardcodedTarget) {
            return fail(
                'Pick up "CHRONICLE_I", shelve it with hero.put_in("str"), and brighten the ink from r, g, b (+ 40) instead of hardcoding (120, 95, 70).',
                'ต้องเก็บหนังสือ "CHRONICLE_I" ด้วย hero.pick_up(), วางด้วย hero.put_in("str") และคำนวณค่าสีจากตัวแปร r, g, b + 40'
            );
        }
        return { valid: true };
    },
    '2-2': (clean) => {
        const hasBookRecovery = /\bhero\.(?:pick_up|collect)\s*\(/.test(clean) && /\bhero\.(?:put_in|deposit)\s*\(\s*["']str["']\s*\)/.test(clean);
        const usesWarmVars = /\bwarm_r\b/.test(clean) && /\bwarm_g\b/.test(clean) && /\bwarm_b\b/.test(clean);
        const usesCoolVars = /\bcool_r\b/.test(clean) && /\bcool_g\b/.test(clean) && /\bcool_b\b/.test(clean);
        const usesAddition = /\+\s*50|50\s*\+/.test(clean) && /\+\s*80|80\s*\+/.test(clean);
        const hardcoded = /cast_color\s*\(\s*95\s*,\s*90\s*,\s*170\s*\)/.test(clean) || /cast_color\s*\(\s*160\s*,\s*90\s*,\s*120\s*\)/.test(clean);
        if (!hasBookRecovery || !usesWarmVars || !usesCoolVars || !usesAddition || hardcoded) {
            return fail(
                'Recover "OPTICS_TOME" with hero.pick_up()/put_in("str"), and tint the lenses using warm_r + 50 and cool_b + 80 arithmetic.',
                'ต้องเก็บหนังสือ "OPTICS_TOME" ด้วย hero.pick_up()/put_in("str") และคำนวณช่องสี warm_r + 50 กับ cool_b + 80'
            );
        }
        return { valid: true };
    },
    '2-3': (clean) => {
        const hasBookRecovery = /\bhero\.(?:pick_up|collect)\s*\(/.test(clean) && /\bhero\.(?:put_in|deposit)\s*\(\s*["']str["']\s*\)/.test(clean);
        const usesVars = /\bfirst_r\b/.test(clean) && /\bsecond_r\b/.test(clean);
        const usesSubtraction = /255\s*-\s*first_r/.test(clean) && /255\s*-\s*second_r/.test(clean);
        if (!hasBookRecovery || !usesVars || !usesSubtraction) {
            return fail(
                'Recover "MIRROR_CODEX" with hero.pick_up()/put_in("str") and invert each channel using 255 - variable arithmetic.',
                'ต้องเก็บหนังสือ "MIRROR_CODEX" ด้วย hero.pick_up()/put_in("str") และกลับสีด้วยสูตร 255 - ตัวแปรช่องสี'
            );
        }
        return { valid: true };
    },
    '2-4': (clean) => {
        const hasFormula = /middle_shade\s*=\s*\(\s*middle_r\s*\+\s*middle_g\s*\+\s*middle_b\s*\)\s*\/\/\s*3/.test(clean);
        const usesShadeInCast = /cast_color\s*\(\s*middle_shade\s*,\s*middle_shade\s*,\s*middle_shade\s*\)/.test(clean);
        if (!hasFormula || !usesShadeInCast) {
            return fail(
                'Calculate middle_shade using the integer average formula: (middle_r + middle_g + middle_b) // 3 and pass it to hero.cast_color().',
                'ต้องคำนวณค่าตัวแปร middle_shade ด้วยสูตรค่าเฉลี่ย: (middle_r + middle_g + middle_b) // 3 และส่งเข้า hero.cast_color()'
            );
        }
        return { valid: true };
    },
    '2-5': (clean) => {
        const hasFormula = /shade\s*=\s*\(\s*gray_r\s*\+\s*gray_g\s*\+\s*gray_b\s*\)\s*\/\/\s*3/.test(clean);
        const usesShadeInCast = /cast_color\s*\(\s*shade\s*,\s*shade\s*,\s*shade\s*\)/.test(clean);
        if (!hasFormula || !usesShadeInCast) {
            return fail(
                'Calculate shade using the integer average formula: (gray_r + gray_g + gray_b) // 3 and pass it to hero.cast_color().',
                'ต้องคำนวณค่าตัวแปร shade ด้วยสูตรค่าเฉลี่ย: (gray_r + gray_g + gray_b) // 3 และส่งเข้า hero.cast_color()'
            );
        }
        return { valid: true };
    },
    '2-6': (clean) => {
        const usesVarsInCast = /cast_color\s*\(\s*red\s*,\s*green\s*,\s*blue\s*\)/.test(clean);
        if (!usesVarsInCast) {
            return fail(
                'Set the red, green, blue variables and pass them into hero.cast_color(red, green, blue).',
                'ต้องกำหนดค่าตัวแปร red, green, blue และส่งตัวแปรทั้งสามเข้าฟังก์ชัน hero.cast_color(red, green, blue)'
            );
        }
        return { valid: true };
    },
    '2-7': (clean) => {
        const hasDefAndLoop = /\bdef\s+restore\s*\(/.test(clean) && /\bfor\s+/.test(clean) && /\.append\s*\(/.test(clean);
        if (!hasDefAndLoop) {
            return fail(
                'Complete the for loop inside restore(pixels) using result.append([r + 30, g, b]).',
                'ต้องเขียนคำสั่ง result.append([r + 30, g, b]) ภายในลูป for ของฟังก์ชัน restore(pixels)'
            );
        }
        return { valid: true };
    },
    '2-8': (clean) => {
        const hasBookRecovery = /\bhero\.(?:pick_up|collect)\s*\(/.test(clean) && /\bhero\.(?:put_in|deposit)\s*\(\s*["']str["']\s*\)/.test(clean);
        const hasFormula = /shade\s*=\s*\(\s*silver_r\s*\+\s*silver_g\s*\+\s*silver_b\s*\)\s*\/\/\s*3/.test(clean);
        const usesShadeInCast = /cast_color\s*\(\s*shade\s*,\s*shade\s*,\s*shade\s*\)/.test(clean);
        if (!hasBookRecovery || !hasFormula || !usesShadeInCast) {
            return fail(
                'Recover "ATLAS_INDEX" with hero.pick_up()/put_in("str"), calculate shade with (silver_r + silver_g + silver_b) // 3, and pass shade to cast_color().',
                'ต้องเก็บ "ATLAS_INDEX" ด้วย hero.pick_up()/put_in("str") และคำนวณตัวแปร shade ด้วยสูตรค่าเฉลี่ย // 3'
            );
        }
        return { valid: true };
    },
    '3-1': (clean) => {
        if (!/\bdef\s+transform\s*\(\s*pixels\s*\)\s*:/.test(clean) || !/pixels\s*\[\s*0\s*\]/.test(clean) || !/colors\s*=\s*transform\s*\(\s*pixels\s*\)/.test(clean)) {
            return fail(
                'Inside transform(pixels), build and return the list using pixel indexing: [pixels[0], pixels[1], pixels[2]].',
                'ในฟังก์ชัน transform(pixels) ต้องเข้าถึงค่าด้วยดัชนีลิสต์ [pixels[0], pixels[1], pixels[2]] แล้ว return ออกมา'
            );
        }
        return { valid: true };
    },
    '3-2': (clean) => {
        if (!/\bdef\s+transform\s*\(\s*pixels\s*\)\s*:/.test(clean) || !/pixels\s*\[\s*2\s*\]/.test(clean) || !/pixels\s*\[\s*0\s*\]/.test(clean)) {
            return fail(
                'Inside transform(pixels), swap the outer pixels using list indexing: [pixels[2], pixels[1], pixels[0]].',
                'ในฟังก์ชัน transform(pixels) ต้องสลับตำแหน่งพิกเซลด้วยดัชนีลิสต์: [pixels[2], pixels[1], pixels[0]]'
            );
        }
        return { valid: true };
    },
    '3-4': (clean) => {
        if (!/\bdef\s+transform\s*\(\s*pixels\s*\)\s*:/.test(clean) || !/\bfor\s+.+\s+in\s+pixels\s*:/.test(clean)) {
            return fail(
                'Use a for loop inside transform(pixels) to brighten every pixel in the list.',
                'ต้องใช้ลูป for ในฟังก์ชัน transform(pixels) เพื่อเพิ่มความสว่างให้ทุกพิกเซลในลิสต์'
            );
        }
        return { valid: true };
    },
    '3-5': (clean) => {
        if (!/\bdef\s+transform\s*\(\s*pixels\s*\)\s*:/.test(clean) || !/\bfor\s+.+\s+in\s+pixels\s*:/.test(clean) || !/pixel\s*\[\s*0\s*\]/.test(clean)) {
            return fail(
                'Keep the for loop in transform(pixels) and fix the channel indexes so red is pixel[0] and green is pixel[1].',
                'ต้องใช้ลูป for ในฟังก์ชัน transform(pixels) และแก้ดัชนีช่องสีให้สีแดงเป็น pixel[0] และสีเขียวเป็น pixel[1]'
            );
        }
        return { valid: true };
    },
    '3-7': (clean) => {
        if (!/\bfor\s+.+\s+in\s+pixels\s*:/.test(clean) || !/\bif\s+/.test(clean) || /\bif\s+False\b/.test(clean)) {
            return fail(
                'Use a for loop and replace if False with a condition checking if the red channel is above 100 (pixel[0] > 100).',
                'ต้องใช้ลูป for ร่วมกับเงื่อนไข if ตรวจสอบว่าช่องสีแดงมากกว่า 100 (pixel[0] > 100)'
            );
        }
        return { valid: true };
    },
    '4-1': (clean) => {
        if (!/\bfor\s+.+\s+in\s+pixels\s*:/.test(clean) || !/\bif\s+/.test(clean) || /\bif\s+False\b/.test(clean)) {
            return fail(
                'Use a for loop and an if/else statement checking whether the red channel is at least 128 (pixel[0] >= 128).',
                'ต้องใช้ลูป for ร่วมกับเงื่อนไข if/else ตรวจสอบว่าช่องสีแดงมีค่าตั้งแต่ 128 ขึ้นไป (pixel[0] >= 128)'
            );
        }
        return { valid: true };
    },
    '4-2': (clean) => {
        if (!/\bfor\s+.+\s+in\s+pixels\s*:/.test(clean) || !/\bif\s+/.test(clean) || !/\belif\s+/.test(clean) || /\belif\s+False\b/.test(clean)) {
            return fail(
                'Use if, elif (red < 170), and else inside the for loop to classify each pixel.',
                'ต้องใช้คำสั่ง if, elif (red < 170) และ else ภายในลูป for เพื่อคัดแยกช่วงสีของพิกเซล'
            );
        }
        return { valid: true };
    },
    '4-3': (clean) => {
        if (!/\bfor\s+.+\s+in\s+pixels\s*:/.test(clean) || !/\bif\s+/.test(clean) || /\bif\s+False\b/.test(clean)) {
            return fail(
                'Use an if/else condition inside the for loop to check if red is above 100 (pixel[0] > 100).',
                'ต้องใช้คำสั่งเงื่อนไข if/else ภายในลูป for เพื่อตรวจว่าช่องสีแดงมากกว่า 100 (pixel[0] > 100)'
            );
        }
        return { valid: true };
    },
    '4-6': (clean) => {
        if (!/\bfor\s+.+\s+in\s+pixels\s*:/.test(clean) || !/\bif\s+/.test(clean) || /\bif\s+False\b/.test(clean)) {
            return fail(
                'Use an if/else condition inside the for loop to check if red is below 100 (r < 100).',
                'ต้องใช้คำสั่งเงื่อนไข if/else ภายในลูป for เพื่อตรวจว่าช่องสีแดงน้อยกว่า 100 (r < 100)'
            );
        }
        return { valid: true };
    },
    '4-7': (clean) => {
        if (!/\bfor\s+.+\s+in\s+pixels\s*:/.test(clean) || !/\bif\s+/.test(clean) || !/\belif\s+/.test(clean) || /\belif\s+False\b/.test(clean)) {
            return fail(
                'Complete the if / elif (r > 150) / else filter inside transform(pixels).',
                'ต้องเติมเงื่อนไข if / elif (r > 150) / else ในฟังก์ชัน transform(pixels) ให้สมบูรณ์'
            );
        }
        return { valid: true };
    },
};

export function validateStageCode(stageKey, rawCode) {
    const rule = RULES[stageKey];
    if (!rule) return { valid: true };
    const clean = stripComments(rawCode);
    return rule(clean);
}
