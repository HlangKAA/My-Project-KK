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
        say(E, 'Krakk drained the color from this shrine and shattered the stone pillars to block the straight road.', 'แคร็กก์ขโมยสีไปจากศาลเจ้านี้และทำลายเสาหินขวางเส้นทางตรงไว้'),
        say(H, 'Then let us weave around the ruins and give this place its first spark.', 'งั้นมาเดินอ้อมซากเสาหินแล้วคืนแสงแรกให้ที่นี่กัน'),
        say(E, "Wind around the fallen pillars to reach the altar at (6, 1), then chant its name with print('Lumina').", "เดินอ้อมเสาหินที่ขวางทางไปยังแท่นบูชาที่ (6, 1) แล้วใช้ print('Lumina') เรียกชื่อมัน", 'teaching'),
    ]),
    '1-2': scene(E, [
        say(E, 'The altar lit four crystals inside alcoves, but their colors are trapped in the wrong vessels.', 'แท่นบูชาปลุกผลึกสี่ชิ้นในซอกหิน แต่สีของมันยังถูกขังอยู่ผิดขวด'),
        say(E, "Walk around the divider walls using hero.pick_up() and hero.put_in('type') to sort each crystal into str, int, float, or bool.", "เดินอ้อมผนังกั้นแล้วใช้ hero.pick_up() กับ hero.put_in('type') แยกแต่ละค่าลงขวด str, int, float หรือ bool", 'teaching'),
    ]),
    '1-3': scene(E, [
        say(E, 'A scattered Rune Shard holds my true name among the ruins.', 'เศษรูนที่ตกอยู่กลางซากหินเก็บชื่อจริงของฉันไว้'),
        say(E, 'Use hero.pick_up() on "ELDRIN_SIGIL" at (6, 1), store it in the [str] pedestal at (3, 3) with hero.put_in("str"), then wind to the altar (1, 1) and chant f"Welcome, {name}!".', 'ใช้ hero.pick_up() เก็บ "ELDRIN_SIGIL" ที่ (6, 1) วางลงแท่น [str] ที่ (3, 3) ด้วย hero.put_in("str") แล้วเดินอ้อมไปแท่น (1, 1) ร่าย f"Welcome, {name}!"', 'teaching'),
    ]),
    '1-4': scene(E, [
        say(E, 'Krakk darkened the crossroads and knocked loose the Lantern Spark.', 'แคร็กก์ปิดเส้นทางแยกด้วยเงามืดและทำให้ประกายตะเกียงหลุดออกมา'),
        say(E, 'Pick up the True spark at (1, 1), place it in the [bool] brazier at (2, 2), and use if/else to choose the steps around the pillars to (6, 4).', 'เก็บประกาย True ที่ (1, 1) ใส่เตา [bool] ที่ (2, 2) แล้วใช้ if/else เลือกจำนวนก้าวอ้อมเสาหินไปยังประตู (6, 4)', 'teaching'),
    ]),
    '1-5': scene(E, [
        say(E, 'Echo Grove repeats every footstep while an Echo Stone rests across the grove.', 'Echo Grove สะท้อนเสียงฝีเท้าซ้ำไปมาและมีศิลาเสียงสะท้อนตกอยู่อีกฝั่ง'),
        say(E, 'Sum steps into total with a for loop, pick up 5 at (6, 1), put it in [int] at (6, 4), and walk back left to the gate (1, 4).', 'ใช้ for loop รวมจำนวนก้าวใน total เก็บศิลา 5 ที่ (6, 1) ใส่โถ [int] ที่ (6, 4) แล้วเดินกลับซ้ายไปยังประตู (1, 4)', 'teaching'),
    ]),
    '1-6': scene(E, [
        say(E, 'Inside the ruined Spell Workshop, the Mana Core fell far from its conduit.', 'ในโรงฝึกคาถาที่พังทลาย แกนมานาตกอยู่ห่างจากแท่นส่งพลัง'),
        say(E, 'Finish double_steps(steps), pick up 4 at (2, 4), place it in [int] at (1, 2), and navigate around the center pillar to the gate (6, 1).', 'เติมฟังก์ชัน double_steps(steps) เก็บแกน 4 ที่ (2, 4) ใส่ช่อง [int] ที่ (1, 2) แล้วเดินอ้อมเสากลางไปยังประตู (6, 1)', 'teaching'),
    ]),
    '1-7': scene(E, [
        say(E, "Beyond this gate lies THE SCHOLAR'S ARCHIVE. Its keeper may know where Krakk carried the stolen color.", 'หลังประตูนี้คือ THE SCHOLAR\'S ARCHIVE ผู้ดูแลที่นั่นอาจรู้ว่าแคร็กก์พาสีที่ขโมยไปไว้ไหน'),
        say(H, 'I will open it. Let us weave past the last ruins and unlock the way.', 'ฉันจะเปิดมัน มาเดินอ้อมซากหินสุดท้ายแล้วเปิดทางกัน'),
        say(E, 'Wind around the pillars, store the string key in the Lock Flask, and speak the opening f-string at the gate.', 'เดินอ้อมเสาหิน เก็บกุญแจ str ใส่ Lock Flask แล้วใช้ f-string พูดคำเปิดประตู', 'teaching'),
    ]),
    '2-1': scene(V, [
        say(V, 'Krakk drained this Chronicle Tome and scattered unstable dimensional portals across the marble floor—stepping on one warps you right back to spawn!', 'แคร็กก์ดูดสีจากตำรานี้และวางประตูมิติบนพื้นหินอ่อนไว้ หากเผลอเดินเหยียบจะถูกดูดกลับจุดเริ่มต้นทันที!'),
        say(H, 'I will watch my footing and recover the fallen volume safely.', 'ฉันจะระวังฝีเท้าและเก็บตำราที่ตกอยู่ขึ้นมาวางแท่นให้เรียบร้อย'),
        say(V, 'Dodge the floor portals, pick up "CHRONICLE_I" at (1, 1), shelve it on the Book Stand at (3, 0) with put_in("str"), and brighten the Chronicle ink at (6, 2) by +40 RGB.', 'หลบประตูมิติ เก็บ "CHRONICLE_I" ที่ (1, 1) วางแท่น (3, 0) ด้วย put_in("str") แล้วเพิ่มแสงหมึก +40 ทุกช่องสีที่ (6, 2)', 'teaching'),
    ]),
    '2-2': scene(P, [
        say(P, 'Two reading lenses and the dropped "OPTICS_TOME" are separated by dimensional portal traps.', 'เลนส์อ่านหนังสือสองอันกับตำรา "OPTICS_TOME" ถูกขวางด้วยกับดักประตูมิติ'),
        say(P, 'Add 50 red to the warm lens, pick up and shelve "OPTICS_TOME" on [str], then add 80 blue to the cool lens without stepping into a portal.', 'เติมสีแดง 50 ให้เลนส์แรก เก็บตำรา "OPTICS_TOME" วางแท่น [str] แล้วเติมสีน้ำเงิน 80 ให้เลนส์สองโดยไม่เหยียบประตูมิติ', 'teaching'),
    ]),
    '2-3': scene(V, [
        say(V, 'The Mirror Gallery inverted two illuminated folios and dropped "MIRROR_CODEX" beside a floor portal.', 'ห้องกระจกกลับสีหน้าหนังสือภาพสองหน้าและทำตำรา "MIRROR_CODEX" ตกไว้ใกล้ประตูมิติ'),
        say(P, 'Invert both folios with 255 minus each RGB channel and shelve "MIRROR_CODEX" on the Codex Stand at (5, 0).', 'กลับสีหน้าหนังสือทั้งสองด้วย 255 ลบค่าสีแต่ละช่อง และเก็บ "MIRROR_CODEX" วางบนแท่นที่ (5, 0)', 'teaching'),
    ]),
    '2-4': scene(V, [
        say(V, 'Past the gallery lie the Memory Book plates, guarded by portal traps on the library floor.', 'ถัดจากห้องกระจกคือแผ่นภาพหนังสือความทรงจำซึ่งมีกับดักประตูมิติขวางอยู่บนพื้นห้องสมุด'),
        say(P, 'Steer safely around the floor portals and compute the integer grayscale average (// 3) for Chapter Plate II.', 'เดินหลบประตูมิติอย่างปลอดภัย แล้วคำนวณค่าเฉลี่ยสีเทาด้วย // 3 ให้แผ่นภาพบทที่สอง', 'teaching'),
    ]),
    '2-5': scene(V, [
        say(V, 'The Grimoire Vault seals locked two volumes behind portal traps. Only grayscale math releases the Silver Grimoire Seal.', 'ห้องนิรภัยคัมภีร์ล็อกตำราไว้หลังประตูมิติ มีเพียงค่าเฉลี่ยสีเทาเท่านั้นที่เปิดผนึกสีเงินได้'),
        say(P, 'Keep away from the row-2 and row-4 portals while calculating shade with (gray_r + gray_g + gray_b) // 3.', 'ระวังประตูมิติในแถวที่ 2 และ 4 แล้วคำนวณตัวแปร shade ด้วย (gray_r + gray_g + gray_b) // 3', 'teaching'),
    ]),
    '2-6': scene(P, [
        say(P, 'The Gilded Compendium cover sits right between two crackling floor portals!', 'ปกตำรา Gilded Compendium วางอยู่ตรงกลางระหว่างประตูมิติสองแห่ง!'),
        say(P, 'Walk straight down the safe center tile and set blue to 0 to mix pure yellow (255, 255, 0).', 'เดินตรงผ่านช่องกลางที่ปลอดภัยแล้วตั้งค่า blue เป็น 0 เพื่อผสมแสงสีเหลืองทอง (255, 255, 0)', 'teaching'),
    ]),
    '2-7': scene(P, [
        say(P, 'The Almanac Corridor flickers with floor portals blocking the direct path between its book seals.', 'ระเบียงตำรา Almanac มีประตูมิติขวางทางตรงระหว่างตราประทับทั้งสอง'),
        say(P, 'Boost the red channel of every seal pixel by 30 inside the loop while the hero walks safely around the portals.', 'เพิ่มช่องสีแดงอีก 30 ให้พิกเซลตรา Almanac ทุกจุดในลูปขณะที่ผู้กล้าเดินอ้อมประตูมิติ', 'teaching'),
    ]),
    '2-8': scene(V, [
        say(V, 'The Living Atlas holds the route into Whispering Caverns, but "ATLAS_INDEX" lies near a floor portal.', 'The Living Atlas เก็บเส้นทางสู่ถ้ำเสียงกระซิบไว้ และดัชนี "ATLAS_INDEX" ตกอยู่ใกล้ประตูมิติ'),
        say(H, 'I will shelve the index, restore both folios, and avoid every portal trap.', 'ฉันจะเก็บดัชนีวางแท่น คืนสีให้หน้าหนังสือทั้งสอง แล้วเปิดประตูโดยไม่ชนประตูมิติ'),
        say(V, 'Pick up "ATLAS_INDEX", put it in [str], solve the Silver Folio grayscale shade, and walk safely to the Atlas Gate.', 'เก็บ "ATLAS_INDEX" วางลงแท่น [str] คำนวณ shade ของหน้าสีเงิน แล้วเดินไปเปิด Atlas Gate', 'teaching'),
    ]),
    '3-1': scene(C, [
        say(C, 'You reached Whispering Caverns! Krakk rigged the dark passages with winding stalagmites and floor portals.', 'เธอมาถึงถ้ำเสียงกระซิบแล้ว! แคร็กก์วางหินงอกและประตูมิติขวางทางเดินในความมืดไว้'),
        say(H, 'I will read the runes pixel by pixel and wind past every trap.', 'ฉันจะอ่านรูนทีละพิกเซลและเดินอ้อมกับดักทั้งหมดเอง'),
        say(C, 'Return [pixels[0], pixels[1], pixels[2]] as your path winds safely around stalagmites and portals.', 'คืนลิสต์ [pixels[0], pixels[1], pixels[2]] พร้อมเดินอ้อมหินงอกและประตูมิติ', 'teaching'),
    ]),
    '3-2': scene(C, [
        say(C, 'Krakk swapped the outer runes and left dimensional portals along the cavern ridges.', 'แคร็กก์สลับรูนริมสองฝั่งและวางประตูมิติไว้ตามแนวสันถ้ำ'),
        say(C, 'Use list indexing to reorder [pixels[2], pixels[1], pixels[0]] while weaving safely through the rocks.', 'ใช้ดัชนีลิสต์เรียง [pixels[2], pixels[1], pixels[0]] กลับคืนขณะเดินหลบแนวหินและประตูมิติ', 'teaching'),
    ]),
    '3-4': scene(C, [
        say(C, 'Tall stalagmites force deep detours between these dim rune stones and floor portals.', 'เสาหินงอกสูงขวางให้ต้องเดินอ้อมไกลระหว่างแผ่นรูนซีดและประตูมิติ'),
        say(C, 'Use a for loop to add 30 to every channel (capped at 255) as you weave around each portal.', 'ใช้ for loop เพิ่มทุกช่องสีอีก 30 (ไม่เกิน 255) ขณะเดินอ้อมหินงอกและประตูมิติ', 'teaching'),
    ]),
    '3-5': scene(C, [
        say(C, 'A corrupted loop scrambled these cavern channels right beside dual floor portals.', 'ลูปที่เสียหายสลับช่องสีภาพในถ้ำข้างประตูมิติทั้งสองบาน'),
        say(C, 'Fix the loop to add 20 to pixel[0] only (capped at 255) while winding safely around the portals.', 'แก้ลูปให้เพิ่มเฉพาะ pixel[0] อีก 20 ไม่เกิน 255 ขณะเดินอ้อมประตูมิติ', 'teaching'),
    ]),
    '3-7': scene(C, [
        say(C, 'The final cavern passage is a dense portal maze guarding the ascent to ASH PEAKS.', 'ทางออกถ้ำสุดท้ายคือเขาวงกตประตูมิติและหินงอกที่ขวางทางขึ้น ASH PEAKS'),
        say(H, 'One wrong step onto a portal sends me back to the cavern mouth. I must stay sharp.', 'ก้าวพลาดไปเหยียบประตูมิติแม้แต่ก้าวเดียวจะถูกดูดกลับปากถ้ำทันที ต้องระวังให้ดี'),
        say(C, 'Turn pixels with pixel[0] > 100 gold to guide the winding route past every portal to the Cavern Gate.', 'เปลี่ยนพิกเซลที่ pixel[0] > 100 เป็นสีทองเพื่อนำทางฝ่าเขาวงกตประตูมิติไปสู่ Cavern Gate', 'teaching'),
    ]),
    '4-1': scene(R, [
        say(R, 'Krakk split the road across ASH PEAKS into light and shadow. The red runes reveal the path.', 'แคร็กก์แยกทางบน ASH PEAKS เป็นแสงกับเงา รูนสีแดงบอกทางที่ถูกต้อง'),
        say(H, 'Show me which runes are bright enough. I will find the way through.', 'บอกฉันว่ารูนไหนสว่างพอ แล้วฉันจะหาทางผ่านเอง'),
        say(R, 'Make pixels white when red is at least 128; otherwise make them black.', 'ถ้าค่าสีแดงตั้งแต่ 128 ขึ้นไปให้เป็นสีขาว ที่เหลือเป็นสีดำ', 'teaching'),
    ]),
    '4-2': scene(R, [
        say(R, 'Three red rune strengths cross the next slope. Each range leads to a different color.', 'รูนสีแดงสามระดับอยู่บนเนินถัดไป แต่ละช่วงใช้สีต่างกัน'),
        say(R, 'Use if/elif/else: below 85 is blue, below 170 is gold, and the rest is white.', 'ใช้ if/elif/else: ต่ำกว่า 85 เป็นสีน้ำเงิน ต่ำกว่า 170 เป็นสีทอง ที่เหลือเป็นสีขาว', 'teaching'),
    ]),
    '4-3': scene(R, [
        say(R, 'Krakk planted decoy runes among the real ones. Their red color reveals the truth.', 'แคร็กก์วางรูนลวงปนกับของจริง ค่าสีแดงช่วยบอกว่ารูนไหนเป็นของจริง'),
        say(R, 'Keep pixels with red above 100; turn all others black.', 'เก็บพิกเซลที่มีค่าสีแดงมากกว่า 100 ที่เหลือเปลี่ยนเป็นสีดำ', 'teaching'),
    ]),
    '4-6': scene(R, [
        say(R, 'Past the traps lies the final seal. Its low-red runes carry the key.', 'หลังกับดักคือผนึกสุดท้าย รูนที่มีค่าสีแดงน้อยเก็บกุญแจไว้'),
        say(R, 'Turn pixels with red below 100 gold. Leave the others as they are.', 'เปลี่ยนพิกเซลที่มีค่าสีแดงน้อยกว่า 100 เป็นสีทอง ที่เหลือคงเดิม', 'teaching'),
    ]),
    '4-7': scene(K, [
        say(K, 'I stole the colors so no one could dream of a kingdom beyond my rule. You cannot undo what I sealed.', 'ข้าขโมยสีไป เพื่อไม่ให้ใครฝันถึงอาณาจักรที่พ้นจากอำนาจข้า เจ้าทำลายผนึกไม่ได้'),
        say(H, 'The colors belong to everyone. I will bring them home.', 'สีเป็นของทุกคน ฉันจะพามันกลับมา'),
        say(R, 'Restore the three seals with two red checks, avoid the shadow tiles, and reach the gate within five minutes of active casting.', 'ใช้เงื่อนไขค่าสีแดงสองช่วงคืนสีให้ผนึกทั้งสาม หลบช่องเงา แล้วไปถึงประตูภายในเวลาร่ายคาถา 5 นาที', 'teaching'),
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
