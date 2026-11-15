// Each scene advances the same journey. Keep both languages beside each other so
// speaker changes and story beats stay in sync.
const scene = (npcName, lines) => ({ npcName, lines });
const say = (speaker, text, textThai, emotion = 'mysterious') => ({
    speaker, text, textThai, emotion,
});

const E = 'Eldrin';
const V = 'Loremaster Vane';
const P = 'Prisma';
const C = 'Cave Warden';
const R = 'Rune Keeper';
const K = 'Krakk';
const H = 'Player';

export const STAGE_STORIES = {
    '1-1': scene(E, [
        say(E, 'Krakk drained the color from this shrine. Your grimoire brought you here because its spells can wake the altar.', 'แคร็กก์ขโมยสีไปจากศาลเจ้านี้ ตำราพาเธอมาที่นี่เพราะคาถาของเธอปลุกแท่นบูชาได้'),
        say(H, 'Then let us give this place its first spark.', 'งั้นมาเริ่มคืนแสงแรกให้ที่นี่กัน'),
        say(E, "Use hero.move_right(n) to reach the altar at (6, 2), then say its name with print('Lumina').", "ใช้ hero.move_right(n) ไปที่แท่นบูชา (6, 2) แล้วใช้ print('Lumina') เรียกชื่อมัน", 'teaching'),
    ]),
    '1-2': scene(E, [
        say(E, 'The altar lit four crystals, but their colors are trapped in the wrong vessels. One crystal bears a tiny mark from Krakk.', 'แท่นบูชาปลุกผลึกสี่ชิ้นขึ้นมา แต่สีของมันยังถูกขังอยู่ผิดขวด หนึ่งในนั้นมีรอยของแคร็กก์'),
        say(E, "Use hero.pick_up() and hero.put_in('type') to sort each value into its str, int, float, or bool flask.", "ใช้ hero.pick_up() และ hero.put_in('type') แยกแต่ละค่าใส่ขวด str, int, float หรือ bool ให้ตรงชนิด", 'teaching'),
    ]),
    '1-3': scene(E, [
        say(E, 'The crystals revealed a rune that listens for a name. A greeting made from a variable will wake it and warn us of the path ahead.', 'ผลึกเผยรูนที่รอฟังชื่ออยู่ คำทักทายที่สร้างจากตัวแปรจะปลุกมันและบอกทางข้างหน้า'),
        say(E, 'Use an f-string to greet me, reach the rune at (5, 2), and print the greeting there.', 'ใช้ f-string ทักทายฉัน เดินไปที่รูน (5, 2) แล้วใช้ print() พูดคำทักทายนั้น', 'teaching'),
    ]),
    '1-4': scene(E, [
        say(E, 'The rune warned us: Krakk split the road with a false shadow. The lantern reveals which route is safe.', 'รูนเตือนว่าแคร็กก์แยกทางด้วยเงาลวง โคมไฟจะบอกว่าทางไหนปลอดภัย'),
        say(E, 'Use if/else: take five steps when the lantern is lit and two when it is dark. Reach the gate at (7, 2).', 'ใช้ if/else เดินห้าก้าวเมื่อโคมสว่าง หรือสองก้าวเมื่อมืด แล้วไปให้ถึงประตู (7, 2)', 'teaching'),
    ]),
    '1-5': scene(E, [
        say(E, 'Echo Grove repeats every footstep. The echoes hide the number of steps to the next gate.', 'Echo Grove สะท้อนเสียงฝีเท้าซ้ำไปมา ในเสียงนั้นมีจำนวนก้าวไปสู่ประตูถัดไปซ่อนอยู่'),
        say(E, 'Add the steps in the list with a for loop, then walk the total distance.', 'ใช้ for loop รวมจำนวนก้าวในลิสต์ แล้วเดินตามผลรวมที่ได้', 'teaching'),
    ]),
    '1-6': scene(E, [
        say(E, 'The grove led us to an old workshop. Its gate responds to the same spell with different step counts.', 'ทางจากป่าพามาถึงโรงฝึกเก่า ประตูที่นี่ตอบรับคาถาเดิมแม้จำนวนก้าวจะต่างกัน'),
        say(E, 'Make a function that doubles the step count, then use its result to reach the gate.', 'สร้างฟังก์ชันคูณจำนวนก้าวเป็นสองเท่า แล้วใช้ผลลัพธ์ไปถึงประตู', 'teaching'),
    ]),
    '1-7': scene(E, [
        say(E, "Beyond this gate lies THE SCHOLAR'S ARCHIVE. Its keeper may know where Krakk carried the stolen color.", 'หลังประตูนี้คือ THE SCHOLAR\'S ARCHIVE ผู้ดูแลที่นั่นอาจรู้ว่าแคร็กก์พาสีที่ขโมยไปไว้ไหน'),
        say(H, 'I will open it. There is still a trail to follow.', 'ฉันจะเปิดมัน เรายังตามรอยต่อได้'),
        say(E, 'Collect the string key, place it in the Lock Flask, then speak the opening words with an f-string at the gate.', 'เก็บกุญแจชนิด str ใส่ Lock Flask แล้วใช้ f-string พูดคำเปิดประตูที่หน้าประตู', 'teaching'),
    ]),
    '2-1': scene(V, [
        say(V, 'Krakk drained the ink from this manuscript, yet its pages remember a set of RGB lenses.', 'แคร็กก์ดูดสีหมึกจากต้นฉบับนี้ แต่หน้ากระดาษยังจำเลนส์ RGB ได้'),
        say(H, 'If we restore the ink, perhaps it will show where the lenses lead.', 'ถ้าเราคืนสีหมึกได้ อาจเห็นว่าเลนส์พาไปที่ไหน'),
        say(V, 'Add 40 to each channel of (80, 55, 30), move beside the manuscript, and cast the new color.', 'เพิ่มค่าแต่ละช่องของ (80, 55, 30) อีก 40 เดินไปข้างต้นฉบับแล้วร่ายสีใหม่', 'teaching'),
    ]),
    '2-2': scene(P, [
        say(P, 'A manuscript points to two lenses. They reveal a hidden Mirror Gallery only when each tint is right.', 'ต้นฉบับชี้มาที่เลนส์สองอัน เลนส์จะเผย Mirror Gallery เมื่อปรับสีถูกต้อง'),
        say(P, 'Add 50 red to the first lens and 80 blue to the second; leave the other channels as they are.', 'เพิ่มสีแดง 50 ให้เลนส์แรก และสีน้ำเงิน 80 ให้เลนส์ที่สอง ช่องสีอื่นคงเดิม', 'teaching'),
    ]),
    '2-3': scene(V, [
        say(V, 'The gallery shows two memories backward. Krakk hid a trail inside their inverted colors.', 'กระจกสองบานฉายความทรงจำกลับด้าน แคร็กก์ซ่อนร่องรอยไว้ในสีที่กลับกัน'),
        say(P, 'Invert each RGB channel with 255 minus its value, then restore both reflections.', 'กลับสีแต่ละช่อง RGB ด้วย 255 ลบค่าของช่องนั้น แล้วคืนภาพสะท้อนทั้งสอง', 'teaching'),
    ]),
    '2-4': scene(V, [
        say(V, 'Beyond the mirrors are three memories washed pale. Their shapes may reveal the mark we seek.', 'หลังกระจกมีภาพความทรงจำสามช่องที่ซีดจาง รูปร่างในภาพอาจเผยรอยที่เราตามหา'),
        say(P, 'For each panel, average its RGB values with // 3 and use that value in all three channels.', 'แต่ละช่องภาพ ให้หาค่าเฉลี่ย RGB ด้วย // 3 แล้วใช้ค่านั้นกับทั้งสามช่องสี', 'teaching'),
    ]),
    '2-5': scene(V, [
        say(V, 'A vault stands behind the memory panels. Krakk used a different color trick on each of its three locks.', 'หลังภาพความทรงจำมีห้องนิรภัย แคร็กก์ใช้วิธีเปลี่ยนสีต่างกันกับแม่กุญแจทั้งสามชิ้น'),
        say(P, 'Open them in order: brighten by 40, invert the colors, then turn the last image grayscale.', 'เปิดตามลำดับ: เพิ่มความสว่าง 40 กลับสี แล้วแปลงภาพสุดท้ายเป็นสีเทา', 'teaching'),
    ]),
    '2-6': scene(P, [
        say(P, 'Two dull relics in the vault point toward the next clue. Their colors are waiting to be mixed.', 'วัตถุซีดสองชิ้นในห้องนิรภัยชี้ไปยังเบาะแสต่อไป สีของมันรอให้เราผสมคืน'),
        say(P, 'Restore yellow with red and green, and magenta with red and blue.', 'คืนสีเหลืองด้วยแดงกับเขียว และสีม่วงแดงด้วยแดงกับน้ำเงิน', 'teaching'),
    ]),
    '2-7': scene(P, [
        say(P, 'A narrow trail made of pixels leads to the Atlas. Each one must glow before the path appears.', 'ทางแคบที่สร้างจากพิกเซลทอดไปยัง Atlas ทุกจุดต้องสว่างก่อนเส้นทางจะปรากฏ'),
        say(P, 'Use a function and a loop to add 30 red to every pixel, then cast each restored color along the trail.', 'ใช้ฟังก์ชันกับลูปเพิ่มสีแดง 30 ให้ทุกพิกเซล แล้วร่ายสีที่ได้ไปตามทาง', 'teaching'),
    ]),
    '2-8': scene(V, [
        say(V, 'The Living Atlas holds the route Krakk took. Three damaged pages keep that route hidden.', 'The Living Atlas เก็บเส้นทางที่แคร็กก์ใช้ไว้ แต่หน้ากระดาษเสียหายสามหน้าบังมันอยู่'),
        say(H, 'His trail is still here. We can bring it back into view.', 'รอยของเขายังอยู่ เราจะทำให้มันมองเห็นอีกครั้ง'),
        say(V, 'Brighten the first page by 50, invert the second, and turn the third grayscale. Then reach the Atlas Gate.', 'เพิ่มความสว่างหน้าแรก 50 กลับสีหน้าที่สอง ทำหน้าที่สามเป็นสีเทา แล้วไปที่ Atlas Gate', 'teaching'),
    ]),
    '3-1': scene(C, [
        say(C, 'The Atlas brought you to these runes. Each pixel in their row marks part of Krakk\'s route through the caverns.', 'Atlas พาเธอมาถึงรูนเหล่านี้ พิกเซลแต่ละจุดในแถวบอกทางที่แคร็กก์ผ่านในถ้ำ'),
        say(H, 'Then I will read the image one pixel at a time.', 'งั้นฉันจะอ่านภาพทีละพิกเซล'),
        say(C, 'Return the three RGB pixels as a list in their original order.', 'คืนพิกเซล RGB ทั้งสามเป็นลิสต์ตามลำดับเดิม', 'teaching'),
    ]),
    '3-2': scene(C, [
        say(C, 'Krakk swapped the first and last runes to make the route point the wrong way.', 'แคร็กก์สลับรูนตัวแรกกับตัวสุดท้ายเพื่อให้เส้นทางชี้ผิดทาง'),
        say(C, 'Use their list positions to put the pixels back in the right order.', 'ใช้ตำแหน่งในลิสต์เรียงพิกเซลให้กลับมาถูกลำดับ', 'teaching'),
    ]),
    '3-3': scene(C, [
        say(C, 'One rune still carries a trace of stolen red. The strongest red pixel marks the next fragment.', 'รูนหนึ่งตัวยังมีรอยสีแดงที่ถูกขโมย พิกเซลสีแดงที่เด่นที่สุดบอกตำแหน่งชิ้นส่วนถัดไป'),
        say(C, 'Find it with max() and .index(), then turn only that pixel gold.', 'หาให้เจอด้วย max() และ .index() แล้วเปลี่ยนแค่พิกเซลนั้นเป็นสีทอง', 'teaching'),
    ]),
    '3-4': scene(C, [
        say(C, 'A fragment catches the light on a row of faded runes. Brightening every pixel will show the next passage.', 'ชิ้นส่วนรับแสงบนรูนซีดทั้งแถว เพิ่มความสว่างทุกพิกเซลแล้วทางต่อไปจะปรากฏ'),
        say(C, 'Use a for loop to add 30 to every channel, without letting any value exceed 255.', 'ใช้ for loop เพิ่มทุกช่องสีอีก 30 โดยไม่ให้ค่าเกิน 255', 'teaching'),
    ]),
    '3-5': scene(C, [
        say(C, 'This passage is covered by a corrupted image. A broken spell has mixed up its color channels.', 'ทางนี้ถูกภาพที่เสียหายบังไว้ คาถาที่ผิดพลาดสลับช่องสีของภาพ'),
        say(C, 'Fix the loop so it adds 20 to red only, caps it at 255, and keeps green and blue unchanged.', 'แก้ลูปให้เพิ่มเฉพาะสีแดง 20 ไม่เกิน 255 และคงสีเขียวกับน้ำเงินไว้', 'teaching'),
    ]),
    '3-6': scene(C, [
        say(C, 'This image repeats the same color at both ends. The matching pair hides a signal.', 'ภาพนี้มีสีเดียวกันอยู่สองข้าง คู่สีที่ตรงกันซ่อนสัญญาณไว้'),
        say(C, 'If the outer pixels match, turn the center gold; otherwise leave the row unchanged.', 'ถ้าพิกเซลริมทั้งสองตรงกัน ให้เปลี่ยนตรงกลางเป็นสีทอง ถ้าไม่ตรงให้คงแถวเดิม', 'teaching'),
    ]),
    '3-7': scene(C, [
        say(C, 'The cavern wall points upward to ASH PEAKS. Find its brightest red marker to open the last passage.', 'ผนังถ้ำชี้ขึ้นไปยัง ASH PEAKS หาจุดสีแดงที่เด่นที่สุดเพื่อเปิดทางออกสุดท้าย'),
        say(H, 'Krakk is close now. I can feel the color waiting beyond the peaks.', 'แคร็กก์อยู่ใกล้แล้ว ฉันรู้สึกได้ว่าสียังรออยู่หลังยอดเขา'),
        say(C, 'Find the pixel with the most red and turn it gold. Keep every other pixel unchanged.', 'หาพิกเซลที่มีสีแดงมากที่สุดแล้วเปลี่ยนเป็นสีทอง พิกเซลอื่นคงเดิม', 'teaching'),
    ]),
    '4-1': scene(R, [
        say(R, 'Krakk split the road across ASH PEAKS into light and shadow. The true path lies inside the brightness of each pixel.', 'แคร็กก์แยกทางบน ASH PEAKS เป็นแสงกับเงา ทางจริงซ่อนอยู่ในความสว่างของแต่ละพิกเซล'),
        say(H, 'Show me the threshold. I will find the way through.', 'บอกเกณฑ์ให้ฉัน ฉันจะหาทางผ่านเอง'),
        say(R, 'Average each RGB pixel; make it white at 128 or above and black below 128.', 'หาค่าเฉลี่ย RGB ของแต่ละพิกเซล ถ้าตั้งแต่ 128 ขึ้นไปให้เป็นสีขาว ต่ำกว่านั้นเป็นสีดำ', 'teaching'),
    ]),
    '4-2': scene(R, [
        say(R, 'Three bands of light cross the next slope. Each brightness range leads to a different path.', 'แสงสามระดับพาดผ่านเนินถัดไป แต่ละช่วงความสว่างพาไปคนละทาง'),
        say(R, 'Use if/elif/else: below 85 is blue, below 170 is gold, and the rest is white.', 'ใช้ if/elif/else: ต่ำกว่า 85 เป็นสีน้ำเงิน ต่ำกว่า 170 เป็นสีทอง ที่เหลือเป็นสีขาว', 'teaching'),
    ]),
    '4-3': scene(R, [
        say(R, 'Krakk planted decoy runes among the real ones. Two color conditions together reveal the truth.', 'แคร็กก์วางรูนลวงปนกับของจริง เงื่อนไขสีสองข้อรวมกันจะบอกความจริง'),
        say(R, 'Keep pixels with red above 100 AND blue below 100; turn all others black.', 'เก็บพิกเซลที่สีแดงมากกว่า 100 และสีน้ำเงินน้อยกว่า 100 ที่เหลือเปลี่ยนเป็นสีดำ', 'teaching'),
    ]),
    '4-4': scene(R, [
        say(R, 'A broken mask hides the bridge. It selects the shadows instead of the stones.', 'หน้ากากภาพที่เสียทำให้สะพานหายไป มันเลือกเงาแทนหิน'),
        say(R, 'Repair the comparison: keep pixels with average brightness at least 100, and black out the rest.', 'แก้การเปรียบเทียบให้เก็บพิกเซลที่สว่างเฉลี่ยตั้งแต่ 100 ขึ้นไป ที่เหลือทำเป็นสีดำ', 'teaching'),
    ]),
    '4-5': scene(R, [
        say(R, 'The bridge ends at a wall of red shadows. Their sharp boundaries reveal where Krakk placed his traps.', 'ปลายสะพานมีเงาสีแดงกั้นอยู่ ขอบที่เปลี่ยนฉับพลันบอกตำแหน่งกับดักของแคร็กก์'),
        say(R, 'Compare each red value with the previous pixel. Mark differences of 80 or more in gold.', 'เทียบค่าสีแดงกับพิกเซลก่อนหน้า ถ้าต่างกันตั้งแต่ 80 ให้ทำเครื่องหมายสีทอง', 'teaching'),
    ]),
    '4-6': scene(R, [
        say(R, 'Past the traps lies the final seal. Only its darkest pixels carry the key.', 'หลังกับดักคือผนึกสุดท้าย มีเพียงพิกเซลที่มืดที่สุดที่เก็บกุญแจไว้'),
        say(R, 'Turn pixels whose three channels are all below 100 gold. Leave the others as they are.', 'เปลี่ยนพิกเซลที่ทั้งสามช่องสีต่ำกว่า 100 เป็นสีทอง ที่เหลือคงเดิม', 'teaching'),
    ]),
    '4-7': scene(K, [
        say(K, 'I stole the colors so no one could dream of a kingdom beyond my rule. You cannot undo what I sealed.', 'ข้าขโมยสีไป เพื่อไม่ให้ใครฝันถึงอาณาจักรที่พ้นจากอำนาจข้า เจ้าทำลายผนึกไม่ได้'),
        say(H, 'The colors belong to everyone. I will bring them home.', 'สีเป็นของทุกคน ฉันจะพามันกลับมา'),
        say(R, 'Restore the three seals with brightness and RGB conditions, avoid the shadow tiles, and reach the gate before the active five-minute clock runs out.', 'ใช้เงื่อนไขความสว่างและ RGB คืนสีให้ผนึกทั้งสาม หลบช่องเงา แล้วไปถึงประตูก่อนเวลาร่ายคาถา 5 นาทีจะหมด', 'teaching'),
    ]),
};

export function withStageStory(stage, key) {
    const story = STAGE_STORIES[key];
    if (!story) return stage;
    const original = stage.storyIntro || {};
    const npcTitle = story.npcName === V ? 'Keeper of the Chromatic Archive'
        : story.npcName === C ? 'Guardian of the Caverns'
            : story.npcName === R ? 'Guardian of Ash Peaks' : original.npcTitle;
    return {
        ...stage,
        hasStoryIntro: true,
        storyIntro: {
            ...original,
            sceneName: original.sceneName || stage.title,
            npcName: story.npcName,
            npcTitle,
            npcIcon: original.npcIcon || 'fas fa-book-reader',
            dialogues: story.lines,
            enterButtonText: original.enterButtonText || 'Restore the Color',
            enterButtonIcon: original.enterButtonIcon || 'fas fa-palette',
        },
    };
}
