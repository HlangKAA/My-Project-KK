const copy = {
    en: {
        heading: 'Spell needs another try',
        next: 'Try next:',
        unknown: ['The spell finished, but the objective is still incomplete.', 'Check the objective and the last action in the console.'],
        noActions: ['Your code ran without an arena action.', 'Call a hero movement or color spell to affect the scene.'],
        timeout: ['The spell ran out of time during execution.', 'Reset the trial, then shorten the actions your code repeats.'],
        hazard: ['The hero stepped onto a marked shadow tile.', 'Change the movement path to go around the marked tile.'],
        obstacle: ({ x, y }) => [`A bookshelf blocked the path at (${x}, ${y}).`, 'Change the movement steps to go around it.'],
        directional: ['This area requires step-by-step movement.', 'Use hero.move_up/down/left/right instead of moving directly to a tile.'],
        flaskUnknown: ({ name }) => [`There is no flask named ${name}.`, 'Check the flask labels in the arena and the argument to put_in().'],
        flaskFar: ({ name }) => [`The hero is too far from ${name}.`, 'Move to the flask or an adjacent tile before using put_in().'],
        flaskEmpty: ['The hero is not carrying an item.', 'Move onto an item and use pick_up() before put_in().'],
        flaskType: ({ item, itemType, flask }) => [`${item} has type ${itemType} and does not fit ${flask}.`, 'Compare the item type with the flask label before depositing it.'],
        flaskIncomplete: ({ name }) => [`${name} is still empty.`, 'Pick up its matching item and deposit it in that flask.'],
        altarPosition: ({ x, y }) => [`The hero stopped at (${x}, ${y}), away from the altar.`, 'Adjust the movement commands to reach the altar.'],
        altarChant: ['The hero reached the altar, but the chant did not activate it.', 'Check the print() call and the word shown in the objective.'],
        colorMissing: ({ name }) => [`${name} has not received a color spell.`, 'Move beside it and call cast_color() with your calculated RGB values.'],
        colorInvalid: ({ name }) => [`${name} received an invalid RGB value.`, 'Make each channel a whole number from 0 to 255.'],
        colorMismatch: ({ name, channel, actual }) => [`${name} received ${channel} = ${actual}, which does not match.`, `Recheck how your code calculates the ${channel} channel for this object.`],
        brazierMissing: ({ name }) => [`${name} is still unlit.`, 'Move beside it and cast a color spell.'],
        gatePosition: ({ name, x, y }) => [`The hero has not reached ${name} at (${x}, ${y}).`, 'Finish the other tasks, then move beside the gate.'],
        python: ({ error }) => [error || 'Python could not run this spell.', 'Check the highlighted error in the console and correct that line.'],
        syntax: ({ error }) => [error, 'Check punctuation, brackets, and the line named in the error.'],
        name: ({ error }) => [error, 'Check the spelling of that variable or function and where it was defined.'],
        indent: ({ error }) => [error, 'Check the spaces at the start of the line and the block above it.'],
        type: ({ error }) => [error, 'Check the types of the values used in that operation.'],
        assertion: ({ row }) => [`The image filter failed on test row ${row}.`, 'Check that transform() handles every pixel in the row, not just the example image.'],
        output: ({ actual }) => [actual ? `The spell printed: ${actual}` : 'The spell produced no matching output.', 'Compare the printed result with the stage objective.'],
        foundIndex: ({ actual }) => [actual === undefined ? 'The spell did not identify an image position.' : `The spell chose position ${actual}.`, 'Check how your code finds the requested position.'],
        wrongColor: ['The cast color did not satisfy the objective.', 'Recheck each RGB channel calculation in your code.'],
        blank: ({ labels }) => [`These fields need another look: ${labels.join(', ')}.`, 'Check the expression and the nearby code for each marked field.'],
    },
    th: {
        heading: 'คาถายังไม่ผ่าน ลองอีกครั้ง',
        next: 'ลองแก้ตรงนี้:',
        unknown: ['รันคาถาแล้ว แต่ยังทำเป้าหมายไม่ครบ', 'ดูโจทย์และคำสั่งล่าสุดในคอนโซลอีกครั้ง'],
        noActions: ['โค้ดรันแล้ว แต่ไม่มีคำสั่งที่ส่งผลกับฉาก', 'ลองใช้คำสั่งเดินหรือร่ายสีของ hero'],
        timeout: ['เวลาร่ายคาถาหมดระหว่างรัน', 'รีเซ็ตด่าน แล้วลดจำนวนคำสั่งที่โค้ดทำซ้ำ'],
        hazard: ['ตัวละครเหยียบช่องเงาที่ทำเครื่องหมายไว้', 'ลองเปลี่ยนเส้นทางเดินเพื่อหลบช่องนั้น'],
        obstacle: ({ x, y }) => [`ชั้นหนังสือขวางทางที่ (${x}, ${y})`, 'ลองเปลี่ยนคำสั่งเดินให้เลี่ยงสิ่งกีดขวาง'],
        directional: ['พื้นที่นี้ต้องเดินทีละขั้น', 'ใช้ hero.move_up/down/left/right แทนการย้ายไปยังช่องโดยตรง'],
        flaskUnknown: ({ name }) => [`ไม่มีขวดชื่อ ${name}`, 'ดูชื่อขวดในฉากและค่าที่ส่งให้ put_in() อีกครั้ง'],
        flaskFar: ({ name }) => [`ตัวละครอยู่ไกลจาก ${name} เกินไป`, 'เดินไปที่ขวดหรือช่องข้างๆ ก่อนใช้ put_in()'],
        flaskEmpty: ['ตัวละครยังไม่ได้ถือไอเทม', 'เดินไปที่ไอเทมแล้วใช้ pick_up() ก่อน put_in()'],
        flaskType: ({ item, itemType, flask }) => [`${item} เป็นชนิด ${itemType} จึงใส่ใน ${flask} ไม่ได้`, 'เทียบชนิดของไอเทมกับป้ายบนขวดก่อนใส่'],
        flaskIncomplete: ({ name }) => [`${name} ยังว่างอยู่`, 'เก็บไอเทมชนิดที่ตรงกันแล้วนำมาใส่ขวดนี้'],
        altarPosition: ({ x, y }) => [`ตัวละครหยุดที่ (${x}, ${y}) ยังไม่ถึงแท่นบูชา`, 'ลองปรับคำสั่งเดินให้ไปถึงแท่นบูชา'],
        altarChant: ['ตัวละครถึงแท่นบูชาแล้ว แต่คำร่ายยังไม่ทำงาน', 'ดูคำสั่ง print() และคำที่โจทย์กำหนดอีกครั้ง'],
        colorMissing: ({ name }) => [`${name} ยังไม่ได้รับคาถาสี`, 'เดินไปใกล้แล้วใช้ cast_color() กับค่า RGB ที่คำนวณไว้'],
        colorInvalid: ({ name }) => [`${name} ได้ค่า RGB ที่ใช้ไม่ได้`, 'ให้แต่ละช่องสีเป็นจำนวนเต็มตั้งแต่ 0 ถึง 255'],
        colorMismatch: ({ name, channel, actual }) => [`${name} ได้ค่าสี ${channel} = ${actual} ซึ่งยังไม่ตรง`, `ลองตรวจวิธีคำนวณช่องสี ${channel} ของวัตถุนี้`],
        brazierMissing: ({ name }) => [`${name} ยังไม่ติดไฟ`, 'เดินไปใกล้แล้วใช้คาถาสี'],
        gatePosition: ({ name, x, y }) => [`ตัวละครยังไม่ถึง ${name} ที่ (${x}, ${y})`, 'ทำเป้าหมายอื่นให้ครบ แล้วเดินไปใกล้ประตู'],
        python: ({ error }) => [error || 'Python รันคาถานี้ไม่ได้', 'ดูข้อผิดพลาดในคอนโซลแล้วแก้บรรทัดที่ระบุ'],
        syntax: ({ error }) => [error, 'ดูเครื่องหมาย วงเล็บ และบรรทัดที่แจ้งข้อผิดพลาด'],
        name: ({ error }) => [error, 'ตรวจชื่อและจุดที่ประกาศตัวแปรหรือฟังก์ชันนี้'],
        indent: ({ error }) => [error, 'ดูจำนวนช่องว่างต้นบรรทัดและบล็อกด้านบน'],
        type: ({ error }) => [error, 'ตรวจชนิดข้อมูลที่ใช้ในคำสั่งนี้'],
        assertion: ({ row }) => [`ฟิลเตอร์ภาพยังไม่ผ่านแถวทดสอบที่ ${row}`, 'ตรวจว่า transform() จัดการทุกพิกเซลในแถว ไม่ใช่แค่ภาพตัวอย่าง'],
        output: ({ actual }) => [actual ? `คาถาพิมพ์ออกมา: ${actual}` : 'คาถายังไม่พิมพ์ผลลัพธ์ที่ตรงโจทย์', 'เทียบผลที่พิมพ์กับสิ่งที่โจทย์ต้องการ'],
        foundIndex: ({ actual }) => [actual === undefined ? 'คาถายังไม่ระบุตำแหน่งในภาพ' : `คาถาเลือกตำแหน่ง ${actual}`, 'ลองตรวจวิธีหาตำแหน่งที่โจทย์ต้องการ'],
        wrongColor: ['สีที่ร่ายยังไม่ตรงกับโจทย์', 'ลองตรวจการคำนวณ RGB แต่ละช่อง'],
        blank: ({ labels }) => [`ลองดูช่องเหล่านี้อีกครั้ง: ${labels.join(', ')}`, 'ตรวจนิพจน์และโค้ดรอบช่องที่ไฮไลต์'],
    },
};

export function pythonFailure(error) {
    const raw = String(error || '').trim();
    const row = raw.match(/Image filter failed test row (\d+)/);
    if (row) return { kind: 'assertion', row: Number(row[1]) };
    const kind = raw.includes('IndentationError') ? 'indent'
        : raw.includes('SyntaxError') ? 'syntax'
            : raw.includes('NameError') ? 'name'
                : raw.includes('TypeError') ? 'type' : 'python';
    return { kind, error: raw };
}

export function colorFailure(targets, states) {
    for (const target of targets) {
        const state = states[target.id];
        if (state?.invalid) return { kind: 'colorInvalid', name: target.name };
        if (!state?.rgb) return { kind: 'colorMissing', name: target.name };
        const mismatch = target.targetRgb.findIndex((value, index) => value !== state.rgb[index]);
        if (mismatch !== -1) {
            return { kind: 'colorMismatch', name: target.name, channel: ['R', 'G', 'B'][mismatch], actual: state.rgb[mismatch] };
        }
    }
    return { kind: 'unknown' };
}

export function spellFeedback(failure, isThai = false) {
    if (!failure) return null;
    const language = copy[isThai ? 'th' : 'en'];
    const entry = language[failure.kind] || language.unknown;
    const [observed, nextStep] = typeof entry === 'function' ? entry(failure) : entry;
    return { heading: language.heading, observed, next: language.next, nextStep };
}
