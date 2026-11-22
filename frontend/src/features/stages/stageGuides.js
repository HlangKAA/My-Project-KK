// Short, spoiler-light introductions for the playable stages. The existing
// grimoire pages remain available as the detailed Reference tab.
const guide = (goal, idea, first, example, thaiGoal, thaiIdea, thaiFirst) => ({
    en: { goal, idea, first, example },
    th: { goal: thaiGoal, idea: thaiIdea, first: thaiFirst, example },
});

export const STAGE_GUIDES = {
    '1-1': guide('Wind around the pillars to the altar and speak its word.', 'Movement commands navigate obstacles; print() speaks a word.', 'Trace the winding path around the ruins from (1, 4) to (6, 1) before printing "Lumina".', "hero.move_up(2)\nhero.move_right(2)\nprint('Lumina')", 'เดินอ้อมเสาหินไปยังแท่นบูชาแล้วพูดคำที่กำหนด', 'คำสั่งเดินใช้นำทางอ้อมสิ่งกีดขวาง ส่วน print() ใช้พูดข้อความ', 'ไล่ตามเส้นทางคดเคี้ยวจาก (1, 4) ไป (6, 1) แล้วค่อยพิมพ์ "Lumina"'),
    '1-2': guide('Put each crystal in its matching flask.', 'Python values have types: text, whole number, decimal, and true/false.', 'Walk around alcove dividers, inspect each crystal type, pick it up, and deposit into the matching flask.', "type(42)  # int", 'ใส่คริสตัลแต่ละชิ้นลงขวดชนิดข้อมูลที่ตรงกัน', 'ค่าของ Python มีทั้งข้อความ จำนวนเต็ม ทศนิยม และจริง/เท็จ', 'เดินอ้อมผนังกั้น ดูคริสตัลทีละชิ้น แล้วเก็บใส่ขวดชนิดข้อมูลที่ตรงกัน'),
    '1-3': guide('Store the Rune Shard, wind past ruins, and greet Eldrin.', 'pick_up() and put_in("str") store string crystals; f-strings insert variables.', 'Pick up "ELDRIN_SIGIL" at (6, 1), put it in [str] at (3, 3), then wind to (1, 1) and chant f"Welcome, {name}!".', "hero.pick_up()\nhero.put_in('str')\nprint(f'Welcome, {name}!')", 'เก็บเศษรูนใส่แท่น str เดินอ้อมซากหิน แล้วทัก Eldrin', 'hero.pick_up() กับ put_in("str") ใช้จัดเก็บข้อความ ส่วน f-string แทรกตัวแปร', 'เก็บ "ELDRIN_SIGIL" ที่ (6, 1) ใส่ [str] ที่ (3, 3) แล้วเดินอ้อมไปทัก Eldrin ที่ (1, 1)'),
    '1-4': guide('Collect the Lantern Spark, use if/else, and reach the gate.', 'Store the bool crystal in [bool], then branch steps using lantern_lit.', 'Pick up True at (1, 1), put_in("bool") at (2, 2), and set steps to 3 if lantern_lit else 1.', 'hero.pick_up()\nhero.put_in("bool")\nsteps = 3 if lantern_lit else 1', 'เก็บประกายตะเกียง เลือกทางด้วย if/else แล้วไปถึงประตู', 'ใส่ค่า boolean ลงเตา [bool] แล้วกำหนดจำนวนก้าวตามค่า lantern_lit', 'เก็บ True ที่ (1, 1) ใส่ [bool] ที่ (2, 2) แล้วกำหนด steps เป็น 3 หรือ 1'),
    '1-5': guide('Accumulate steps, bank the Echo Stone, and cross Echo Grove.', 'Sum a list with a for loop, then store the int stone in [int].', 'Add step to total, pick_up() 5 at (6, 1), put_in("int") at (6, 4), then walk left.', 'total += step\nhero.pick_up()\nhero.put_in("int")', 'สะสมจำนวนก้าว เก็บศิลาเสียงสะท้อน แล้วข้าม Echo Grove', 'บวกค่าจากลิสต์ด้วย for loop แล้วเก็บผลึกจำนวนเต็มใส่โถ [int]', 'บวก step เข้า total เก็บ 5 ที่ (6, 1) ใส่ [int] ที่ (6, 4) แล้วเดินซ้าย'),
    '1-6': guide('Use double_steps(), bank the Mana Core, and reach the gate.', 'Return steps * 2 from the function and store the int core in [int].', 'Return steps * 2, pick_up() 4 at (2, 4), put_in("int") at (1, 2), then climb to (6, 1).', 'def double_steps(steps):\n    return steps * 2', 'ใช้ double_steps() เก็บแกนมานา แล้วไปถึงประตู', 'ฟังก์ชันคืนค่า steps * 2 และใส่แกนพลังลงช่อง [int]', 'คืนค่า steps * 2 เก็บ 4 ที่ (2, 4) ใส่ [int] ที่ (1, 2) แล้วขึ้นไป (6, 1)'),
    '1-7': guide("Collect the key, wind past ruins, and open the Apprentice Gate.", "Combine winding movement, flask sorting, and f-string chanting.", "Complete the final greeting incantation at the gate.", "print(f\"Open, {name}!\")", "เก็บกุญแจ อ้อมซากหิน แล้วเปิดประตูฝึกหัด", "ประยุกต์การเดินอ้อมสิ่งกีดขวาง การแยกชนิดข้อมูล และการพูดด้วย f-string", "เติมคำร่ายเปิดประตูในบรรทัดสุดท้ายให้สมบูรณ์"),
    '2-1': guide('Dodge portals, shelve CHRONICLE_I, and brighten its ink.', 'Floor portals warp you back to spawn! Use put_in("str") and add +40 RGB.', 'Avoid portals at (2, 4) and (4, 2): pick_up() at (1, 1), put_in("str"), then cast r+40, g+40, b+40.', 'hero.pick_up()\nhero.put_in("str")\nhero.cast_color(r + 40, g + 40, b + 40)', 'หลบประตูมิติ วางหนังสือ CHRONICLE_I และเพิ่มแสงหมึก RGB', 'ประตูมิติบนพื้นดูดกลับจุดเกิด! วางหนังสือด้วย put_in("str") แล้วบวกสี +40', 'หลบ (2, 4) กับ (4, 2) เก็บหนังสือวางแท่น แล้วร่ายแสง r+40, g+40, b+40'),
    '2-2': guide('Dodge portals, tint both book lenses, and shelve OPTICS_TOME.', 'Single-channel math tints lenses; pick_up/put_in("str") shelves the tome.', 'Avoid portal (4, 1): cast warm (+50 red), pick_up() OPTICS_TOME at (2, 3), put_in("str"), then cool (+80 blue).', 'hero.cast_color(warm_r + 50, warm_g, warm_b)\nhero.pick_up()\nhero.put_in("str")', 'หลบประตูมิติ เติมสีเลนส์สองชิ้น และวางหนังสือ OPTICS_TOME', 'ปรับช่องสีเดียวเปลี่ยนโทนสี และใช้ pick_up/put_in("str") วางตำรา', 'หลบประตู (4, 1) เติมแดงเลนส์แรก เก็บตำราวางแท่น แล้วเติมน้ำเงินเลนส์สอง'),
    '2-3': guide('Avoid portals, invert both mirror folios, and shelve MIRROR_CODEX.', 'An inverted channel is 255 minus its value; place recovered books onto [str].', 'Go around portal (5, 3): invert folio 1, pick_up() MIRROR_CODEX at (7, 1), put_in("str"), then folio 2.', 'hero.cast_color(255 - first_r, 255 - first_g, 255 - first_b)\nhero.put_in("str")', 'เลี่ยงประตูมิติ กลับสีหน้าหนังสือ และวาง MIRROR_CODEX', 'สีตรงข้ามคำนวณจาก 255 ลบค่าเดิม แล้ววางหนังสือลงแท่น [str]', 'อ้อมประตู (5, 3) กลับสีหน้าแรก เก็บ MIRROR_CODEX วางแท่น แล้วกลับสีหน้าสอง'),
    '2-4': guide("Avoid portals and restore both Memory Book plates.", "Floor portals guard columns 3 and 5; compute the grayscale integer average.", "Calculate middle_shade using integer division // 3 while following the safe corridor.", "middle_shade = (middle_r + middle_g + middle_b) // 3", "หลบประตูมิติแล้วคืนภาพหน้าหนังสือความทรงจำ", "ประตูมิติขวางอยู่ตามแนวพื้น ใช้ // 3 คำนวณค่าเฉลี่ยสีเทา", "คำนวณค่าเฉลี่ย RGB ให้ตัวแปร middle_shade ด้วย // 3"),
    '2-5': guide("Dodge portals and unlock both Grimoire Vault clasps.", "Portals guard rows 2 and 4; the silver clasp needs the grayscale average.", "Calculate the shade variable using integer average // 3.", "shade = (gray_r + gray_g + gray_b) // 3", "หลบประตูมิติแล้วปลดตัวล็อกคัมภีร์ทั้งสอง", "ประตูมิติขวางแถวที่ 2 และ 4 ส่วนตัวล็อกสีเงินต้องใช้ค่าเฉลี่ยสีเทา", "คำนวณค่าเฉลี่ย RGB ให้ตัวแปร shade ด้วย // 3"),
    '2-6': guide("Step between portals and gild the Compendium cover.", "Portals flank columns 4 and 6; yellow combines red and green without blue.", "Turn blue down to 0 so (red, green, blue) equals (255, 255, 0).", "red, green, blue = 255, 255, 0", "เดินผ่านกลางระหว่างประตูมิติแล้วคืนสีทองปกตำรา", "ประตูมิติขนาบคอลัมน์ 4 และ 6 สีเหลืองเกิดจากแดงและเขียวโดยไม่มีน้ำเงิน", "ปรับค่าตัวแปร blue ให้เป็น 0"),
    '2-7': guide("Dodge portals and recolor both Almanac seals.", "Portals block (3, 1) and (2, 2); boost red by 30 inside the pixel loop.", "Append [r + 30, g, b] inside restore(pixels).", "result.append([r + 30, g, b])", "หลบประตูมิติแล้วคืนสีตราหนังสือทั้งสองจุด", "ประตูมิติขวางที่ (3, 1) และ (2, 2) ใช้ลูปเพิ่มค่าช่องสีแดงให้แต่ละพิกเซล", "เติม result.append([r + 30, g, b]) ในลูป"),
    '2-8': guide("Shelve ATLAS_INDEX, dodge portals, and unlock the Atlas Gate.", "Collect ATLAS_INDEX, dodge floor portals, and solve the grayscale average.", "The route shelves the index; calculate shade = (silver_r + silver_g + silver_b) // 3.", "shade = (silver_r + silver_g + silver_b) // 3", "เก็บ ATLAS_INDEX หลบประตูมิติ และเปิดประตู Atlas Gate", "เก็บหนังสือวางแท่น หลีกเลี่ยงประตูมิติ และคำนวณค่าเฉลี่ยสีเทา", "คำนวณค่า shade ด้วยการหารตัดเศษ // 3"),
    '3-1': guide('Return the pixels in their original order around cavern obstacles.', 'An image row is a list of RGB pixels; cavern stalagmites and floor portals block shortcuts.', 'Return [pixels[0], pixels[1], pixels[2]] to complete the winding rune path.', 'return [pixels[0], pixels[1], pixels[2]]', 'เรียงพิกเซลกลับเป็นลำดับเดิมและหลบประตูมิติในถ้ำ', 'แถวพิกเซลคือ list ของสี RGB โดยในถ้ำมีหินงอกและประตูมิติขวางทางลัด', 'คืนค่า [pixels[0], pixels[1], pixels[2]] แล้วเดินตามเส้นทางคดเคี้ยว'),
    '3-2': guide('Fix the swapped pixel row while weaving past cavern portals.', 'List indexes start at 0; reversing outer tiles avoids corrupting the route.', 'Swap pixels[0] and pixels[2] in the returned list.', 'return [pixels[2], pixels[1], pixels[0]]', 'แก้แถวพิกเซลที่สลับตำแหน่งและหลีกเลี่ยงประตูมิติ', 'ดัชนีใน list เริ่มจาก 0 และเส้นทางถ้ำต้องเดินอ้อมหินงอกกับประตูมิติ', 'คืนค่า [pixels[2], pixels[1], pixels[0]]'),
    '3-4': guide("Brighten every cavern rune pixel by 30 across winding rocks.", "A for loop visits each RGB pixel while the hero winds past stalagmites and portals.", "Add 30 to every channel inside the loop while capping at 255.", "result.append([min(255, c + 30) for c in pixel])", "เพิ่มความสว่างให้รูนทุกจุดอีก 30 และเดินอ้อมประตูมิติ", "ใช้ for loop วนปรับค่าสีทุกพิกเซลขณะเดินอ้อมเสาหินและประตูมิติ", "เพิ่มค่าทุกช่องสีอีก 30 ในลูปโดยไม่ให้เกิน 255"),
    '3-5': guide("Repair the broken color loop in the portal cavern.", "Red is channel 0, green is 1, blue is 2; steer clear of cavern portals.", "Fix the swapped pixel[0] and pixel[1] indexes inside the loop.", "result.append([min(255, pixel[0] + 20), pixel[1], pixel[2]])", "ซ่อมลูปสีที่สลับช่องสีผิดในถ้ำประตูมิติ", "สีแดงคือ pixel[0] สีเขียวคือ pixel[1] สีน้ำเงินคือ pixel[2]", "แก้ดัชนี pixel[0] และ pixel[1] ในลูปให้ถูกต้อง"),
    '3-7': guide('Turn red cave runes gold and survive the cavern portal maze.', 'Combine a pixel loop with a red-channel check through the winding portal maze.', 'Replace False with pixel[0] > 100 to unlock the Cavern Gate.', 'if pixel[0] > 100:', 'เปลี่ยนรูนสีแดงเป็นสีทองผ่านเขาวงกตประตูมิติ', 'ผสมผสานลูปพิกเซลกับเงื่อนไขค่าสีแดงฝ่าแนวเสาหินและประตูมิติ', 'แทนที่ False ด้วยเงื่อนไข pixel[0] > 100'),
    '4-1': guide('Turn pixels into light or shadow.', 'Check the red value to choose white or black.', 'Use a threshold comparison of at least 128 on channel 0.', 'if pixel[0] >= 128:', 'แยกพิกเซลเป็นแสงหรือเงา', 'ดูค่าสีแดงเพื่อเลือกสีขาวหรือดำด้วยเงื่อนไข if/else', 'เขียนเงื่อนไขตรวจว่าค่าสีแดงตั้งแต่ 128 ขึ้นไปหรือไม่'),
    '4-2': guide('Choose a color from the red value.', 'if/elif/else checks each red range in order.', 'Complete the middle range condition in elif.', 'elif red < 170:', 'เลือกสีจากค่าสีแดงตามช่วง', 'if/elif/else ตรวจช่วงของสีแดงตามลำดับจากน้อยไปมาก', 'เติมเงื่อนไขช่วงกลางในบล็อก elif'),
    '4-3': guide('Reveal red pixels.', 'Keep a pixel when its red value is above the threshold.', 'Write the threshold check on the red channel.', 'if pixel[0] > 100:', 'เผยพิกเซลที่มีสีแดงเด่น', 'เก็บพิกเซลเดิมไว้เมื่อค่าสีแดงสูงกว่าเกณฑ์ที่กำหนด', 'เขียนเงื่อนไขตรวจสอบค่าสีแดงของแต่ละพิกเซล'),
    '4-6': guide('Turn low-red pixels gold.', 'Unpack r, g, b in the loop and test the red channel.', 'Write the condition checking whether r is below 100.', 'if r < 100:', 'เปลี่ยนพิกเซลที่มีสีแดงน้อยเป็นสีทอง', 'แยกตัวแปร r, g, b ในลูปแล้วตรวจค่าสีแดง', 'เขียนเงื่อนไขตรวจว่าค่า r ต่ำกว่าเกณฑ์ที่กำหนดหรือไม่'),
    '4-7': guide('Restore the final three seals within five minutes.', 'Combine for-loop unpacking with if/elif/else color filters.', 'Complete the multi-branch red threshold filter before time runs out.', 'elif r > 150:', 'คืนสีให้ผนึกสามจุดภายในห้านาที', 'ประยุกต์ใช้ลูปพิกเซลร่วมกับเงื่อนไขหลายทางเลือก if/elif/else', 'เติมเงื่อนไขแยกช่วงค่าสีแดงเพื่อปลดผนึกทั้งสามก่อนหมดเวลา'),
};

/**
 * Structured Pedagogical Metadata separating Lesson stages (Guided Concept Breakdown,
 * Syntax Structure, Line-by-Line Annotated Walkthrough, Interactive 3-Step Checklist)
 * from Challenge & Boss stages (Applied Knowledge links to earlier Lesson stages).
 */
export const STAGE_PEDAGOGY = {
    // ═══════════════════════════════════════════════════
    // LESSON STAGES (Guided Tutorial + Line Walkthrough + Checklist)
    // ═══════════════════════════════════════════════════
    '1-1': {
        mode: 'lesson',
        conceptTitle: {
            en: 'Lesson 1: Sequential Commands & print()',
            th: 'บทเรียนที่ 1: คำสั่งลำดับขั้นและการแสดงผลด้วย print()',
        },
        conceptBreakdown: {
            en: 'Python executes your code from top to bottom, one line at a time. Combining hero.move_* calls winds around obstacles on the grid, while print("text") outputs a spoken incantation.',
            th: 'Python จะรันคำสั่งจากบนลงล่างทีละบรรทัด การเรียงคำสั่ง hero.move_* ช่วยเดินอ้อมสิ่งกีดขวางบนตาราง ส่วน print("ข้อความ") ใช้แสดงผลคำร่ายออกทางหน้าจอและแท่นบูชา',
        },
        syntaxStructure: 'hero.move_up(steps)     # Move up N tiles\nhero.move_right(steps)  # Move right N tiles\nhero.move_down(steps)   # Move down N tiles\nprint("SacredWord")     # Speak a text string',
        lineWalkthrough: [
            { code: 'hero.move_up(2); hero.move_right(2)', en: 'Step 1: Walk up from spawn (1, 4) and turn right around the first ruin to (3, 2).', th: 'ขั้นที่ 1: เดินขึ้นจากจุดเกิด (1, 4) แล้วเลี้ยวขวาอ้อมซากเสาแรกไปยัง (3, 2)' },
            { code: 'hero.move_down(1); hero.move_right(3); hero.move_up(2)', en: 'Step 2: Detour around the central pillar and climb up to the altar at (6, 1).', th: 'ขั้นที่ 2: เดินอ้อมเสากลางฉากแล้วขึ้นไปยังแท่นบูชาที่พิกัด (6, 1)' },
            { code: 'print("Lumina")', en: 'Step 3: Speak the string "Lumina" to awaken the altar.', th: 'ขั้นที่ 3: แสดงผลข้อความ "Lumina" เพื่อปลุกแท่นบูชา' },
        ],
        steps: [
            { id: 1, en: 'Step 1: Trace the winding moves around obstacles to tile (6, 1)', th: 'ขั้นที่ 1: สังเกตคำสั่งเดินวนอ้อมสิ่งกีดขวางไปยังพิกัด (6, 1)', test: (code) => /hero\.move_up\s*\(\s*2\s*\)/.test(code) && /hero\.move_right\s*\(\s*3\s*\)/.test(code) },
            { id: 2, en: 'Step 2: Ensure print("Lumina") is written on the final line', th: 'ขั้นที่ 2: ตรวจสอบคำสั่ง print("Lumina") ในบรรทัดสุดท้าย', test: (code) => /print\s*\(\s*["']Lumina["']\s*\)/.test(code) },
            { id: 3, en: 'Step 3: Click "RUN SPELL CODE" to watch the hero wind and chant', th: 'ขั้นที่ 3: กดปุ่ม "รันโค้ดคาถา" เพื่อดูการเดินอ้อมสิ่งกีดขวางและร่ายเวท', test: (_, attempts) => attempts > 0 },
        ],
    },
    '1-2': {
        mode: 'lesson',
        conceptTitle: {
            en: 'Lesson 2: Python Data Types (str, int, float, bool)',
            th: 'บทเรียนที่ 2: ชนิดข้อมูลพื้นฐานใน Python (str, int, float, bool)',
        },
        conceptBreakdown: {
            en: 'Every value in Python has a data type: Strings (str) are text inside quotes ("Lumina"), Integers (int) are whole numbers (255), Floats (float) have a decimal point (3.14), and Booleans (bool) are True or False.',
            th: 'ข้อมูลทุกค่าใน Python มีชนิดข้อมูลกำกับ: String (str) คือข้อความในเครื่องหมายคำพูด ("Lumina"), Integer (int) คือจำนวนเต็ม (255), Float (float) คือทศนิยม (3.14) และ Boolean (bool) คือค่าความจริง True หรือ False',
        },
        syntaxStructure: 'hero.pick_up()        # Pick up crystal on current tile\nhero.put_in("str")    # Deposit into matching type flask\n# Valid types: "str", "int", "float", "bool"',
        lineWalkthrough: [
            { code: 'hero.move_right(1); hero.move_up(1)', en: 'Step around the alcove divider to reach the "Lumina" crystal at (2, 4).', th: 'เดินอ้อมผนังกั้นไปยังผลึก "Lumina" ที่พิกัด (2, 4)' },
            { code: 'hero.pick_up()', en: 'Pick up the crystal value from the ground.', th: 'เก็บผลึกข้อมูลขึ้นมาจากพื้น' },
            { code: 'hero.move_up(2); hero.put_in("str")', en: 'Carry it adjacent to the [str] flask at (2, 1) and deposit.', th: 'เดินไปหน้าขวด [str] ที่ (2, 1) แล้วบรรจุลงขวดชนิดข้อความ' },
            { code: 'hero.put_in("int" | "float" | "bool")', en: 'Repeat around each alcove wall for 255 (int), 3.14 (float), and True (bool).', th: 'เดินอ้อมซอกหินทำซ้ำกับค่า 255 (int), 3.14 (float) และ True (bool)' },
        ],
        steps: [
            { id: 1, en: 'Step 1: Review how "Lumina" (str) and 255 (int) are picked up and sorted', th: 'ขั้นที่ 1: สังเกตโค้ดส่วนที่เก็บค่า "Lumina" (str) และ 255 (int) ลงขวด', test: (code) => /put_in\s*\(\s*["']str["']\s*\)/.test(code) && /put_in\s*\(\s*["']int["']\s*\)/.test(code) },
            { id: 2, en: 'Step 2: Verify all 4 flasks ("str", "int", "float", "bool") are targeted', th: 'ขั้นที่ 2: ตรวจสอบว่าโค้ดบรรจุครบทั้ง 4 ชนิด ("str", "int", "float", "bool")', test: (code) => ['str', 'int', 'float', 'bool'].every(t => new RegExp(`put_in\\s*\\(\\s*["']${t}["']\\s*\\)`).test(code)) },
            { id: 3, en: 'Step 3: Click "RUN SPELL CODE" to validate each data type in the lab', th: 'ขั้นที่ 3: กดปุ่ม "รันโค้ดคาถา" เพื่อดูการตรวจชนิดข้อมูลลงขวดทั้ง 4', test: (_, attempts) => attempts > 0 },
        ],
    },
    '2-1': {
        mode: 'lesson',
        conceptTitle: {
            en: 'Lesson 3: RGB Color Channels, Portals & Archive Books',
            th: 'บทเรียนที่ 3: ช่องสี RGB, ประตูมิติ และการเก็บตำราหอจดหมายเหตุ',
        },
        conceptBreakdown: {
            en: 'Digital images store color as three numbers (Red, Green, Blue) from 0 to 255. Adding (+ 40) to each channel brightens the Chronicle ink—but watch out for dimensional floor portals that warp you back to spawn, and shelve dropped books with pick_up() and put_in("str")!',
            th: 'ภาพดิจิทัลเก็บค่าสีเป็นตัวเลข 3 ช่อง คือ แดง (R), เขียว (G), น้ำเงิน (B) มีค่าระหว่าง 0 ถึง 255 การบวก (+ 40) ให้ทุกช่องจะช่วยเพิ่มความสว่างหมึกหนังสือ พร้อมทั้งต้องระวังประตูมิติบนพื้นที่จะดูดผู้เล่นกลับจุดเริ่มต้น และเก็บหนังสือที่ตกอยู่ขึ้นแท่นด้วย pick_up() และ put_in("str")',
        },
        syntaxStructure: 'r, g, b = 80, 55, 30\nhero.pick_up(); hero.put_in("str")\nhero.cast_color(r + 40, g + 40, b + 40)',
        lineWalkthrough: [
            { code: 'hero.move_up(3); hero.pick_up()', en: 'Avoid portal (2, 4), walk up from (1, 4) to (1, 1), and pick up "CHRONICLE_I".', th: 'เดินขึ้นจาก (1, 4) เลี่ยงประตูมิติ (2, 4) ไปเก็บหนังสือ "CHRONICLE_I" ที่ (1, 1)' },
            { code: 'hero.move_right(2); hero.put_in("str")', en: 'Step right to (3, 1) and shelve "CHRONICLE_I" onto the Book Stand at (3, 0).', th: 'เดินขวาไป (3, 1) แล้ววางหนังสือลงบนแท่นวาง [str] ที่ (3, 0)' },
            { code: 'hero.move_right(2); hero.move_down(1); hero.cast_color(r + 40, g + 40, b + 40)', en: 'Detour around portal (4, 2) to stand at (5, 2) and brighten the Chronicle Tome ink at (6, 2) by +40.', th: 'เดินอ้อมประตูมิติ (4, 2) มายืนที่ (5, 2) แล้วร่ายแสงเพิ่มค่า RGB ช่องละ +40 ให้หมึกหนังสือที่ (6, 2)' },
        ],
        steps: [
            { id: 1, en: 'Step 1: Collect "CHRONICLE_I" with hero.pick_up() and shelve it via hero.put_in("str")', th: 'ขั้นที่ 1: เก็บหนังสือ "CHRONICLE_I" ด้วย hero.pick_up() และวางแท่นด้วย hero.put_in("str")', test: (code) => /pick_up\s*\(/.test(code) && /put_in\s*\(\s*["']str["']\s*\)/.test(code) },
            { id: 2, en: 'Step 2: Write hero.cast_color(...) adding 40 to r, g, and b', th: 'ขั้นที่ 2: เขียนคำสั่ง hero.cast_color(...) โดยนำ r, g, b มาบวก 40 ในแต่ละช่องสี', test: (code) => /cast_color\s*\([^)]*r\s*\+\s*40[^)]*g\s*\+\s*40[^)]*b\s*\+\s*40/.test(code) },
            { id: 3, en: 'Step 3: Click "RUN SPELL CODE" while dodging all floor portals', th: 'ขั้นที่ 3: กดปุ่ม "รันโค้ดคาถา" เพื่อเก็บตำราและร่ายแสงคืนสีโดยไม่เหยียบประตูมิติ', test: (_, attempts) => attempts > 0 },
        ],
    },
    '3-1': {
        mode: 'lesson',
        conceptTitle: {
            en: 'Lesson 4: Image Rows as Python Lists & Portal Caverns',
            th: 'บทเรียนที่ 4: แถวพิกเซลภาพในรูปแบบลิสต์และการเดินอ้อมในถ้ำ',
        },
        conceptBreakdown: {
            en: 'A row of pixels in an image is stored as a Python list: [pixel_0, pixel_1, pixel_2]. Access each pixel using 0-based indexing (pixels[0], pixels[1], pixels[2]) while winding around cavern stalagmites and floor portals.',
            th: 'แถวของพิกเซลในภาพดิจิทัลถูกเก็บเป็นลิสต์ (List) ใน Python: [pixel_0, pixel_1, pixel_2] เราเข้าถึงพิกเซลแต่ละจุดด้วยเลขดัชนี (Index) เริ่มจาก 0 (pixels[0], pixels[1], pixels[2]) ขณะเดินอ้อมหินงอกและประตูมิติในถ้ำ',
        },
        syntaxStructure: 'def transform(pixels):\n    return [pixels[0], pixels[1], pixels[2]]',
        lineWalkthrough: [
            { code: 'def transform(pixels):', en: 'Define an image filter function receiving a list of 3 RGB pixels.', th: 'สร้างฟังก์ชันแปลงภาพที่รับลิสต์ของพิกเซล 3 จุดเข้ามาในพารามิเตอร์ pixels' },
            { code: 'return [pixels[0], pixels[1], pixels[2]]', en: 'Build and return a new list reading index 0, index 1, and index 2.', th: 'สร้างและส่งคืนลิสต์ใหม่โดยอ่านค่าจากตำแหน่งที่ 0, 1 และ 2 ตามลำดับ' },
            { code: 'colors = transform(pixels)', en: 'The hero winds around cavern stalagmites and floor portals to restore all 3 runes.', th: 'ผู้กล้าจะเดินอ้อมเสาหินงอกและประตูมิติเพื่อนำสีที่คืนค่าไปร่ายลงรูนทั้ง 3 จุด' },
        ],
        steps: [
            { id: 1, en: 'Step 1: Inspect the transform(pixels) function header and pixel list below it', th: 'ขั้นที่ 1: สังเกตหัวฟังก์ชัน def transform(pixels): และลิสต์พิกเซลด้านล่าง', test: (code) => /def\s+transform\s*\(\s*pixels\s*\)\s*:/.test(code) },
            { id: 2, en: 'Step 2: Inside transform(), return [pixels[0], pixels[1], pixels[2]]', th: 'ขั้นที่ 2: ในฟังก์ชัน transform() ให้เขียน return [pixels[0], pixels[1], pixels[2]]', test: (code) => /return\s*\[\s*pixels\s*\[\s*0\s*\]\s*,\s*pixels\s*\[\s*1\s*\]\s*,\s*pixels\s*\[\s*2\s*\]\s*\]/.test(code) },
            { id: 3, en: 'Step 3: Click "RUN SPELL CODE" to restore all 3 cavern runes around the traps', th: 'ขั้นที่ 3: กดปุ่ม "รันโค้ดคาถา" เพื่อคืนสีให้รูนทั้ง 3 จุดและหลบประตูมิติ', test: (_, attempts) => attempts > 0 },
        ],
    },
    '3-4': {
        mode: 'lesson',
        conceptTitle: {
            en: 'Lesson 5: Iterating Over Pixels with a For Loop Filter',
            th: 'บทเรียนที่ 5: การวนลูปปรับค่าทุกพิกเซลในภาพด้วย For Loop',
        },
        conceptBreakdown: {
            en: 'Instead of indexing each pixel by hand, a for loop visits every pixel in the list automatically. Inside the loop, brighten each channel (+ 30, capped at 255 with min()) while the hero detours around stalagmites and portal traps.',
            th: 'แทนที่จะเขียนดัชนีทีละตัว ลูป for จะช่วยวนอ่านพิกเซลทุกจุดในลิสต์โดยอัตโนมัติ ในแต่ละรอบเราจะเพิ่มความสว่างทุกช่องสีอีก 30 (จำกัดไม่ให้เกิน 255 ด้วย min()) ขณะผู้กล้าเดินอ้อมหินงอกและประตูมิติ',
        },
        syntaxStructure: 'result = []\nfor pixel in pixels:\n    result.append([min(255, channel + 30) for channel in pixel])\nreturn result',
        lineWalkthrough: [
            { code: 'result = []', en: 'Create an empty list to collect the brightened pixels.', th: 'สร้างลิสต์ว่างชื่อ result สำหรับเก็บพิกเซลที่ปรับค่าสีแล้ว' },
            { code: 'for pixel in pixels:', en: 'Loop through each [r, g, b] pixel in the input row.', th: 'วนลูปดึงพิกเซล [r, g, b] ออกมาจากลิสต์ pixels ทีละจุด' },
            { code: 'result.append([min(255, channel + 30) for channel in pixel])', en: 'Add 30 to each channel (capped at 255) and wind safely past cavern portals.', th: 'บวก 30 ให้ทุกช่องสี (ไม่เกิน 255) และเดินอ้อมเสาหินกับประตูมิติไปยังรูนถัดไป' },
        ],
        steps: [
            { id: 1, en: 'Step 1: Observe the result = [] list and for pixel in pixels: loop structure', th: 'ขั้นที่ 1: สังเกตการสร้างลิสต์ result = [] และโครงสร้างลูป for pixel in pixels:', test: (code) => /for\s+pixel\s+in\s+pixels\s*:/.test(code) },
            { id: 2, en: 'Step 2: Update result.append(...) to add 30 to each channel (capped at 255)', th: 'ขั้นที่ 2: แก้บรรทัด result.append(...) ให้บวก 30 ในทุกช่องสีโดยใช้ min(255, ...)', test: (code) => /min\s*\(\s*255/.test(code) && /\+\s*30/.test(code) },
            { id: 3, en: 'Step 3: Click "RUN SPELL CODE" to brighten the cavern rune row', th: 'ขั้นที่ 3: กดปุ่ม "รันโค้ดคาถา" เพื่อดูผลลัพธ์การวนลูปคืนสีรูน', test: (_, attempts) => attempts > 0 },
        ],
    },
    '4-1': {
        mode: 'lesson',
        conceptTitle: {
            en: 'Lesson 6: Image Thresholding with Conditional Logic (if/else)',
            th: 'บทเรียนที่ 6: การคัดแยกสีพิกเซลด้วยเงื่อนไข (if/else Thresholding)',
        },
        conceptBreakdown: {
            en: 'Image thresholding separates bright features from dark backgrounds. By checking if pixel[0] >= 128 inside our pixel loop, we output pure white [255, 255, 255] when the condition is True and pure black [0, 0, 0] when False.',
            th: 'การทำ Thresholding คือการแยกจุดที่สว่างออกจากพื้นหลังที่มืด โดยใช้เงื่อนไข if pixel[0] >= 128 ภายในลูป หากค่าสีแดงตั้งแต่ 128 ขึ้นไปให้เป็นสีขาว [255, 255, 255] มิฉะนั้นให้เป็นสีดำ [0, 0, 0]',
        },
        syntaxStructure: 'for pixel in pixels:\n    if pixel[0] >= 128:\n        result.append([255, 255, 255])  # White\n    else:\n        result.append([0, 0, 0])        # Black',
        lineWalkthrough: [
            { code: 'for pixel in pixels:', en: 'Inspect each pixel in the image row one by one.', th: 'วนลูปตรวจสอบพิกเซลในแถวทีละจุด' },
            { code: 'if pixel[0] >= 128:', en: 'Test if the red channel (index 0) is at least the threshold 128.', th: 'ตรวจเงื่อนไขว่าค่าช่องสีแดง (pixel[0]) มีค่าตั้งแต่ 128 ขึ้นไปหรือไม่' },
            { code: 'result.append([255, 255, 255]) / [0, 0, 0]', en: 'Append white when True, or black in the else branch.', th: 'ถ้าเป็นจริงให้เพิ่มสีขาว [255, 255, 255] ถ้าเป็นเท็จ (else) ให้เพิ่มสีดำ [0, 0, 0]' },
        ],
        steps: [
            { id: 1, en: 'Step 1: Examine the if/else branches inside transform(pixels)', th: 'ขั้นที่ 1: สังเกตโครงสร้างทางเลือก if และ else ภายในลูปพิกเซล', test: (code) => /\bif\b/.test(code) && /\belse\s*:/.test(code) },
            { id: 2, en: 'Step 2: Replace the placeholder condition with pixel[0] >= 128', th: 'ขั้นที่ 2: แทนที่เงื่อนไขหลัง if ด้วย pixel[0] >= 128', test: (code) => /pixel\s*\[\s*0\s*\]\s*>=\s*128/.test(code) },
            { id: 3, en: 'Step 3: Click "RUN SPELL CODE" to threshold the 3 pixels on Ash Peaks', th: 'ขั้นที่ 3: กดปุ่ม "รันโค้ดคาถา" เพื่อคัดแยกพิกเซลขาว-ดำบนยอดเขา', test: (_, attempts) => attempts > 0 },
        ],
    },

    // ═══════════════════════════════════════════════════
    // CHALLENGE & BOSS STAGES (Applied Knowledge Links)
    // ═══════════════════════════════════════════════════
    '1-3': {
        mode: 'challenge',
        appliedFrom: [
            { stageKey: '1-1', titleEn: 'The Awakening Altar', titleTh: 'แท่นบูชาแห่งการตื่น', conceptEn: 'Winding Navigation & print()', conceptTh: 'การเดินอ้อมสิ่งกีดขวางและคำสั่ง print()' },
            { stageKey: '1-2', titleEn: "The Alchemist's Flasks", titleTh: 'ขวดแก้วของนักเล่นแร่แปรธาตุ', conceptEn: 'pick_up() & put_in("str")', conceptTh: 'การเก็บผลึกข้อความและใส่แท่น str' },
        ],
        challengeBrief: {
            en: 'Pick up the Rune Shard "ELDRIN_SIGIL" at (6, 1) with hero.pick_up(), place it into the [str] pedestal at (3, 3) with hero.put_in("str"), then wind around the ruins to the altar (1, 1) and print f"Welcome, {name}!".',
            th: 'เก็บเศษรูน "ELDRIN_SIGIL" ที่ (6, 1) ด้วย hero.pick_up() ใส่แท่น [str] ที่ (3, 3) ด้วย hero.put_in("str") แล้วเดินอ้อมซากหินไปร่าย f"Welcome, {name}!" ที่แท่นบูชา (1, 1)',
        },
    },
    '1-4': {
        mode: 'challenge',
        appliedFrom: [
            { stageKey: '1-1', titleEn: 'The Awakening Altar', titleTh: 'แท่นบูชาแห่งการตื่น', conceptEn: 'Winding Obstacle Navigation', conceptTh: 'การเดินอ้อมสิ่งกีดขวางบนตาราง' },
            { stageKey: '1-2', titleEn: "The Alchemist's Flasks", titleTh: 'ขวดแก้วของนักเล่นแร่แปรธาตุ', conceptEn: 'put_in("bool") & Integer Steps', conceptTh: 'การใช้ผลึก boolean [bool] และตัวเลขจำนวนเต็ม' },
        ],
        challengeBrief: {
            en: 'Collect the True Lantern Spark at (1, 1), deposit it into the [bool] brazier at (2, 2) with hero.put_in("bool"), then use lantern_lit inside if/else so the hero winds around the pillars to reach the gate at (6, 4).',
            th: 'เก็บประกายตะเกียง True ที่ (1, 1) ใส่เตา [bool] ที่ (2, 2) ด้วย hero.put_in("bool") แล้วใช้เงื่อนไข if/else บนตัวแปร lantern_lit กำหนดระยะก้าวอ้อมเสาไปยังประตู (6, 4)',
        },
    },
    '1-5': {
        mode: 'challenge',
        appliedFrom: [
            { stageKey: '1-1', titleEn: 'The Awakening Altar', titleTh: 'แท่นบูชาแห่งการตื่น', conceptEn: 'Grid Navigation', conceptTh: 'การสั่งเดินอ้อมสิ่งกีดขวางบนตาราง' },
            { stageKey: '1-2', titleEn: "The Alchemist's Flasks", titleTh: 'ขวดแก้วของนักเล่นแร่แปรธาตุ', conceptEn: 'put_in("int") & Integer Accumulation', conceptTh: 'การใส่โถ [int] และการบวกสะสมจำนวนเต็ม' },
        ],
        challengeBrief: {
            en: 'Accumulate each step from the list into total using a for loop, pick up the Echo Stone 5 at (6, 1), deposit it into the [int] vessel at (6, 4) with hero.put_in("int"), then walk left using total to reach the gate at (1, 4).',
            th: 'ใช้ลูป for สะสมระยะจากลิสต์ลงใน total เดินเก็บศิลา 5 ที่ (6, 1) ใส่โถ [int] ที่ (6, 4) ด้วย hero.put_in("int") แล้วเดินซ้ายด้วยระยะ total ไปยังประตู (1, 4)',
        },
    },
    '1-6': {
        mode: 'challenge',
        appliedFrom: [
            { stageKey: '1-1', titleEn: 'The Awakening Altar', titleTh: 'แท่นบูชาแห่งการตื่น', conceptEn: 'Multi-Directional Winding Movement', conceptTh: 'การเดินวนหลายทิศทางอ้อมสิ่งกีดขวาง' },
            { stageKey: '1-2', titleEn: "The Alchemist's Flasks", titleTh: 'ขวดแก้วของนักเล่นแร่แปรธาตุ', conceptEn: 'put_in("int") & Arithmetic Return', conceptTh: 'การใส่ช่อง [int] และการคำนวณจำนวนเต็ม' },
        ],
        challengeBrief: {
            en: 'Complete double_steps(steps) to return steps * 2, collect the Mana Core 4 at (2, 4), place it into the [int] conduit at (1, 2) with hero.put_in("int"), and wind around the center pillar to the gate at (6, 1).',
            th: 'เติมฟังก์ชัน double_steps(steps) ให้คืนค่า steps * 2 เก็บแกนมานา 4 ที่ (2, 4) ใส่ช่อง [int] ที่ (1, 2) ด้วย hero.put_in("int") แล้วเดินอ้อมเสากลางไปยังประตู (6, 1)',
        },
    },
    '1-7': {
        mode: 'boss',
        appliedFrom: [
            { stageKey: '1-1', titleEn: 'The Awakening Altar', titleTh: 'แท่นบูชาแห่งการตื่น', conceptEn: 'Movement & print() Chant', conceptTh: 'การเดินและร่ายคำพูดด้วย print()' },
            { stageKey: '1-2', titleEn: "The Alchemist's Flasks", titleTh: 'ขวดแก้วของนักเล่นแร่แปรธาตุ', conceptEn: 'pick_up() & put_in("str")', conceptTh: 'การเก็บผลึกและใส่ขวดชนิดข้อมูล str' },
            { stageKey: '1-3', titleEn: 'The Whispering Runes', titleTh: 'รูนกระซิบ', conceptEn: 'f-string Variable Interpolation', conceptTh: 'การแทรกตัวแปรลงในข้อความด้วย f-string' },
        ],
        challengeBrief: {
            en: 'Boss Trial: Combine winding movement around ruins, key collection, flask type validation, and an f-string incantation using {name} to unlock The Apprentice Gate.',
            th: 'ศึกบอสประจำบทที่ 1: ผสมผสานการเดินอ้อมซากหิน เก็บกุญแจ การใส่ขวดชนิดข้อมูล และการร่ายคาถาเปิดประตูด้วย f-string ที่ดึงค่าจากตัวแปร {name}',
        },
    },
    '2-2': {
        mode: 'challenge',
        appliedFrom: [
            { stageKey: '2-1', titleEn: 'The Faded Manuscript', titleTh: 'ต้นฉบับที่สีจาง', conceptEn: 'RGB Channel Math, Portals & Book Shelving', conceptTh: 'การคำนวณสี RGB ประตูมิติ และการวางตำรา' },
        ],
        challengeBrief: {
            en: 'Dodging the dimensional floor portals at (4, 1) and (4, 2), boost Red (+50) on the Warm Book Lens, pick up and shelve "OPTICS_TOME" via put_in("str"), and boost Blue (+80) on the Cool Folio Lens.',
            th: 'หลบประตูมิติบนพื้นที่ (4, 1) และ (4, 2) เพิ่มสีแดง (+50) ให้เลนส์แรก เก็บตำรา "OPTICS_TOME" วางแท่นด้วย put_in("str") แล้วเพิ่มสีน้ำเงิน (+80) ให้เลนส์สอง',
        },
    },
    '2-3': {
        mode: 'challenge',
        appliedFrom: [
            { stageKey: '2-1', titleEn: 'The Faded Manuscript', titleTh: 'ต้นฉบับที่สีจาง', conceptEn: '0-255 RGB Inversion & Tome Recovery', conceptTh: 'การกลับสี 0-255 และการเก็บตำรา' },
        ],
        challengeBrief: {
            en: 'Steer around floor portals at (5, 3) and (4, 2), invert both Mirror Folios with 255 minus each RGB channel, and shelve "MIRROR_CODEX" onto the Codex Stand with pick_up() / put_in("str").',
            th: 'หลบประตูมิติที่ (5, 3) และ (4, 2) กลับสีหน้าหนังสือกระจกทั้งสองด้วย 255 ลบค่าสี และเก็บตำรา "MIRROR_CODEX" วางบนแท่นด้วย pick_up() / put_in("str")',
        },
    },
    '2-4': {
        mode: 'challenge',
        appliedFrom: [
            { stageKey: '1-2', titleEn: "The Alchemist's Flasks", titleTh: 'ขวดแก้วของนักเล่นแร่แปรธาตุ', conceptEn: 'Integer Division (int)', conceptTh: 'การหารแบบจำนวนเต็ม (int)' },
            { stageKey: '2-1', titleEn: 'The Faded Manuscript', titleTh: 'ต้นฉบับที่สีจาง', conceptEn: 'Combining R, G, B Channels & Avoiding Portals', conceptTh: 'การคำนวณค่าสี RGB และหลบประตูมิติ' },
        ],
        challengeBrief: {
            en: 'Avoid floor portals at (3, 4) and (5, 1) while computing the grayscale luminance for Chapter Plate II of the Memory Book with integer division (// 3).',
            th: 'หลีกเลี่ยงประตูมิติที่ (3, 4) และ (5, 1) พร้อมคำนวณค่าความสว่างสีเทาให้แผ่นภาพบทที่สองของหนังสือความทรงจำด้วย // 3',
        },
    },
    '2-5': {
        mode: 'challenge',
        appliedFrom: [
            { stageKey: '2-1', titleEn: 'The Faded Manuscript', titleTh: 'ต้นฉบับที่สีจาง', conceptEn: 'RGB Brightness (+40) & Portal Dodging', conceptTh: 'การเพิ่มความสว่าง RGB (+40) และหลบประตูมิติ' },
            { stageKey: '2-4', titleEn: 'Gray Memory', titleTh: 'ความทรงจำสีเทา', conceptEn: 'Grayscale Average (// 3)', conceptTh: 'การหาค่าเฉลี่ยสีเทา (// 3)' },
        ],
        challengeBrief: {
            en: 'Dodging the portals at (6, 4) and (4, 2), combine brightness and grayscale transformations to unlock both Grimoire Vault clasps.',
            th: 'หลบประตูมิติที่ (6, 4) และ (4, 2) และใช้ทั้งการเพิ่มความสว่างกับการคำนวณค่าเฉลี่ยสีเทาเพื่อปลดตัวล็อกคัมภีร์ทั้งสอง',
        },
    },
    '2-6': {
        mode: 'challenge',
        appliedFrom: [
            { stageKey: '2-1', titleEn: 'The Faded Manuscript', titleTh: 'ต้นฉบับที่สีจาง', conceptEn: 'RGB Channel Composition & Portal Navigation', conceptTh: 'องค์ประกอบแม่สีแสง (R, G, B) และการเดินหลบประตูมิติ' },
        ],
        challengeBrief: {
            en: 'Walk safely between the flanking floor portals at (4, 3) and (6, 3) to gild the Compendium cover in pure yellow (255, 255, 0) by setting blue to 0.',
            th: 'เดินผ่านช่องกลางระหว่างประตูมิติที่ (4, 3) และ (6, 3) เพื่อคืนสีทองให้ปกตำรา Compendium เป็นสีเหลือง (255, 255, 0) โดยปรับค่า blue เป็น 0',
        },
    },
    '2-7': {
        mode: 'challenge',
        appliedFrom: [
            { stageKey: '1-5', titleEn: 'Echo Grove', titleTh: 'ป่าเสียงสะท้อน', conceptEn: 'For Loop over a List', conceptTh: 'การวนลูป for บนลิสต์' },
            { stageKey: '1-6', titleEn: 'Spell Workshop', titleTh: 'ห้องฝึกคาถา', conceptEn: 'Function Definition & Return', conceptTh: 'การเขียนฟังก์ชันและ return ค่า' },
            { stageKey: '2-1', titleEn: 'The Faded Manuscript', titleTh: 'ต้นฉบับที่สีจาง', conceptEn: 'RGB Addition & Portal Dodging', conceptTh: 'การบวกค่าสี RGB และหลบประตูมิติ' },
        ],
        challengeBrief: {
            en: 'Combine functions, loops, and RGB channel math to boost the red channel of both Almanac margin seals by +30 while routing past the portals at (3, 1) and (2, 2).',
            th: 'ผสมผสานฟังก์ชัน ลูป for และค่าสี RGB เพื่อเพิ่มค่าช่องสีแดงอีก +30 ให้ตราประทับหนังสือ Almanac ทั้งสองจุดโดยเดินเลี่ยงประตูมิติ (3, 1) และ (2, 2)',
        },
    },
    '2-8': {
        mode: 'boss',
        appliedFrom: [
            { stageKey: '2-1', titleEn: 'The Faded Manuscript', titleTh: 'ต้นฉบับที่สีจาง', conceptEn: 'Tome Recovery (pick_up/put_in) & Brightness', conceptTh: 'การเก็บตำราวางแท่นและการเพิ่มความสว่าง RGB' },
            { stageKey: '2-4', titleEn: 'Gray Memory', titleTh: 'ความทรงจำสีเทา', conceptEn: 'Grayscale Average & Portal Avoidance', conceptTh: 'ค่าเฉลี่ยสีเทาและการหลบประตูมิติ' },
        ],
        challengeBrief: {
            en: 'Boss Trial: Recover and shelve "ATLAS_INDEX" via pick_up() / put_in("str"), restore both Sunlit and Silver Atlas folios, and avoid all floor portals before unlocking the Atlas Gate.',
            th: 'ศึกบอสประจำบทที่ 2: เก็บดัชนี "ATLAS_INDEX" วางบนแท่นด้วย pick_up() / put_in("str") คืนสีหน้าหนังสือทั้งสอง และหลบประตูมิติเพื่อเปิดประตู Atlas Gate',
        },
    },
    '3-2': {
        mode: 'challenge',
        appliedFrom: [
            { stageKey: '3-1', titleEn: 'The Inscription Wall', titleTh: 'ผนังจารึก', conceptEn: '0-Based List Indexing (pixels[i])', conceptTh: 'การอ้างอิงตำแหน่งลิสต์ด้วยดัชนี pixels[i]' },
        ],
        challengeBrief: {
            en: 'Apply 0-based list indexing to swap pixels[0] and pixels[2] back into order as the hero weaves past cavern stalagmites and floor portals.',
            th: 'ประยุกต์การอ้างอิงดัชนีลิสต์เพื่อสลับพิกเซล pixels[0] และ pixels[2] กลับสู่ลำดับที่ถูกต้อง ขณะผู้กล้าเดินอ้อมหินงอกและประตูมิติในถ้ำ',
        },
    },
    '3-5': {
        mode: 'challenge',
        appliedFrom: [
            { stageKey: '3-1', titleEn: 'The Inscription Wall', titleTh: 'ผนังจารึก', conceptEn: 'RGB Channel Positions [0, 1, 2]', conceptTh: 'ลำดับดัชนีช่องสี RGB [0, 1, 2]' },
            { stageKey: '3-4', titleEn: 'The Echo Loop', titleTh: 'ลูปแห่งเสียงสะท้อน', conceptEn: 'For Loop Pixel Filter & Cavern Portals', conceptTh: 'ลูปปรับค่าสีและการเดินอ้อมประตูมิติ' },
        ],
        challengeBrief: {
            en: 'Debug the corrupted pixel loop so Red is pixel[0] and Green is pixel[1] while the route winds past twin stalagmites and floor portals.',
            th: 'แก้บั๊กในลูปแปลงค่าสีให้ช่องสีแดงคือ pixel[0] และสีเขียวคือ pixel[1] พร้อมเส้นทางเดินอ้อมแนวหินงอกและประตูมิติ',
        },
    },
    '3-7': {
        mode: 'boss',
        appliedFrom: [
            { stageKey: '1-4', titleEn: 'The Forked Path', titleTh: 'ทางแยก', conceptEn: 'if/else Decision Branches', conceptTh: 'การเลือกทำคำสั่งด้วยเงื่อนไข if/else' },
            { stageKey: '3-1', titleEn: 'The Inscription Wall', titleTh: 'ผนังจารึก', conceptEn: 'Red Channel Index (pixel[0])', conceptTh: 'การอ่านค่าช่องสีแดงจากดัชนี pixel[0]' },
            { stageKey: '3-4', titleEn: 'The Echo Loop', titleTh: 'ลูปแห่งเสียงสะท้อน', conceptEn: 'For Loop & Cavern Portal Maze', conceptTh: 'การวนลูปและฝ่าเขาวงกตประตูมิติ' },
        ],
        challengeBrief: {
            en: 'Boss Trial: Combine pixel list indexing, for-loop iteration, and pixel[0] > 100 checks to navigate the stalagmite & dimensional portal maze and unlock the Cavern Gate.',
            th: 'ศึกบอสประจำบทที่ 3: ผสมผสานการอ่านดัชนีช่องสีแดง ลูป for และเงื่อนไข pixel[0] > 100 เพื่อฝ่าเขาวงกตหินงอกและประตูมิติไปเปิดประตูถ้ำ Cavern Gate',
        },
    },
    '4-2': {
        mode: 'challenge',
        appliedFrom: [
            { stageKey: '3-4', titleEn: 'The Echo Loop', titleTh: 'ลูปแห่งเสียงสะท้อน', conceptEn: 'For Loop Pixel Filter', conceptTh: 'การวนลูปประมวลผลพิกเซล' },
            { stageKey: '4-1', titleEn: 'The Crossroads', titleTh: 'ทางแยก', conceptEn: 'Red-Channel Threshold Comparison', conceptTh: 'การเปรียบเทียบค่าเกณฑ์ช่องสีแดง (Threshold)' },
        ],
        challengeBrief: {
            en: 'Extend the binary threshold from Stage 4-1 into a 3-way if/elif/else classifier that separates dark (< 85), mid-tone (< 170), and bright pixels.',
            th: 'ต่อยอดการคัดแยก 2 ทางจากด่าน 4-1 เป็นเงื่อนไข 3 ช่วง (if/elif/else) เพื่อแยกสีตามระดับค่าสีแดง (< 85, < 170 และตั้งแต่ 170 ขึ้นไป)',
        },
    },
    '4-3': {
        mode: 'challenge',
        appliedFrom: [
            { stageKey: '3-7', titleEn: 'The Cavern Trial', titleTh: 'บททดสอบแห่งถ้ำ', conceptEn: 'Selective Pixel Filtering', conceptTh: 'การคัดกรองพิกเซลตามเงื่อนไข' },
            { stageKey: '4-1', titleEn: 'The Crossroads', titleTh: 'ทางแยก', conceptEn: 'Blackout Threshold Masking', conceptTh: 'การซ่อนพิกเซลที่ไม่ผ่านเกณฑ์ให้เป็นสีดำ [0, 0, 0]' },
        ],
        challengeBrief: {
            en: 'Build a red-channel mask that preserves pixels whose red value exceeds 100 while masking out all others as black [0, 0, 0].',
            th: 'สร้างหน้ากากคัดกรองสี (Color Mask) โดยคงค่าพิกเซลเดิมไว้เมื่อสีแดงมากกว่า 100 และเปลี่ยนจุดอื่นให้เป็นสีดำ [0, 0, 0]',
        },
    },
    '4-6': {
        mode: 'challenge',
        appliedFrom: [
            { stageKey: '2-7', titleEn: 'Pixel Trail', titleTh: 'รอยทางพิกเซล', conceptEn: 'Loop Unpacking (for r, g, b in pixels)', conceptTh: 'การแยกตัวแปร for r, g, b in pixels ในลูป' },
            { stageKey: '4-1', titleEn: 'The Crossroads', titleTh: 'ทางแยก', conceptEn: 'Threshold Classification', conceptTh: 'การแยกกลุ่มสีพิกเซลด้วยเงื่อนไข if/else' },
        ],
        challengeBrief: {
            en: 'Combine tuple unpacking (for r, g, b in pixels:) with a low-red threshold check (r < 100) to illuminate dark pixels in gold.',
            th: 'ประยุกต์การแยกตัวแปร r, g, b ในลูป for ร่วมกับเงื่อนไขตรวจค่าสีแดงต่ำ (r < 100) เพื่อเปลี่ยนจุดที่มืดให้เป็นสีทอง',
        },
    },
    '4-7': {
        mode: 'boss',
        appliedFrom: [
            { stageKey: '2-1', titleEn: 'The Faded Manuscript', titleTh: 'ต้นฉบับที่สีจาง', conceptEn: 'Channel Clamping min(255, b + 50)', conceptTh: 'การเพิ่มค่าช่องสีและจำกัดไม่ให้เกิน 255' },
            { stageKey: '3-4', titleEn: 'The Echo Loop', titleTh: 'ลูปแห่งเสียงสะท้อน', conceptEn: 'For Loop Pixel Filter', conceptTh: 'การวนลูปประมวลผลแถวพิกเซล' },
            { stageKey: '4-1', titleEn: 'The Crossroads', titleTh: 'ทางแยก', conceptEn: 'Multi-Branch Thresholds (if/elif/else)', conceptTh: 'การคัดแยกหลายเงื่อนไข (if/elif/else)' },
        ],
        challengeBrief: {
            en: 'Final Boss Trial: Synthesize all four chapters—loop unpacking, multi-branch red thresholding (r < 85 and r > 150), and clamped channel arithmetic—to defeat Krakk within 5 minutes!',
            th: 'ศึกบอสใหญ่ตัดสิน: บูรณาการความรู้ทั้ง 4 บท (ลูปพิกเซล เงื่อนไขหลายทางเลือก if/elif/else และการเพิ่มค่าช่องสี) เพื่อคลายผนึกทั้งสามและปราบแคร็กก์ภายใน 5 นาที!',
        },
    },
};
