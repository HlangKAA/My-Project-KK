// Thai copy for the readable Reference pages. Python examples remain in their original syntax.
const referenceText = {
    '1-1': {
        leftTitle: 'คาถาเดินทาง',
        leftContent: 'ในโลกนี้ เราสั่งตัวละครด้วย <em style="color:#dc2626">คำสั่งเดินของ hero</em>',
        leftNote: 'หนึ่งก้าวคือหนึ่งช่องบนตาราง ตัวเลขบอกว่าจะเดินกี่ช่อง',
        rightTitle: 'คาถา print()',
        rightContent: '<em style="color:#dc2626">print()</em> ใช้แสดงข้อความหรือค่าจากโค้ด สิ่งที่อยู่ในเครื่องหมายคำพูดจะถูกพูดออกมา',
        rightQuote: '"พ่อมดที่ดีพูดให้ชัด เอ่ยชื่อออกมา แล้วแท่นบูชาจะตอบรับ"',
    },
    '1-2': {
        leftTitle: 'ชนิดข้อมูลกับขวดแก้ว',
        leftContent: 'เหมือนยาที่ต้องใส่ขวดให้ถูกชนิด ค่าใน Python ก็มี <em style="color:#dc2626">ชนิดข้อมูล</em> ต่างกัน',
        leftNote: 'ถ้าเอาข้อความไปใส่ขวดสำหรับตัวเลขจะเกิด TypeError ตรวจชนิดข้อมูลก่อนเสมอ',
        rightTitle: 'ทำไมชนิดข้อมูลถึงสำคัญ',
        rightContent: 'สิ่งที่โค้ดทำได้ขึ้นอยู่กับชนิดข้อมูล จำนวนเต็มคูณกันได้ แต่เอาข้อความมาลบกันไม่ได้',
        rightQuote: '"ข้อความเก็บคำ จำนวนเต็มเก็บจำนวน ทศนิยมเก็บเศษส่วน และ boolean เก็บค่าจริงหรือเท็จ รู้ก่อนว่าสิ่งที่ถืออยู่คืออะไร"',
    },
    '1-3': { leftContent: 'ใช้ hero.pick_up() เก็บเศษรูน "ELDRIN" ที่ (6, 1) ใส่แท่น [str] ด้วย hero.put_in("str") ที่ (3, 3) แล้วอ้อมไปทักที่แท่น (1, 1)', leftNote: 'ใส่ตัวแปร name ในวงเล็บปีกกาของ f-string เช่น f"Welcome, {name}!"' },
    '1-4': { leftContent: 'เก็บประกายตะเกียง True ใส่ [bool] ด้วย put_in("bool") แล้วใช้ if/else เลือกจำนวนก้าว 3 หรือ 1 เพื่ออ้อมไปยังประตู (6, 4)', leftNote: 'เมื่อ lantern_lit เป็น True ให้ steps เท่ากับ 3 ถ้าไม่ใช่ให้เท่ากับ 1' },
    '1-5': { leftContent: 'นับจำนวนก้าวในลิสต์ด้วย for loop เดินไปเก็บศิลา 15 ใส่โถ [int] แล้วใช้ผลรวม total ข้ามสวนเสียงสะท้อน', leftNote: 'เริ่ม total ที่ 0 บวกด้วย total += step และอย่าลืม put_in("int")' },
    '1-6': { leftContent: 'เขียนฟังก์ชัน double_steps(steps) คืนค่าสองเท่า เก็บแกนมานา 42 ใส่ [int] แล้วเดินอ้อมเสาหินไปยังประตู (6, 1)', leftNote: 'ให้ฟังก์ชัน return steps * 2 และเรียก put_in("int") ที่ (1, 2)' },
    '1-7': { leftContent: 'เดินอ้อมซากหิน เก็บกุญแจชนิดข้อความ ใส่ขวด Lock Flask เดินไปที่ประตู (7, 2) แล้วพิมพ์คำเปิดด้วย f-string', leftNote: 'ขวดรับกุญแจชนิดข้อความ และต้องพิมพ์คำเปิดใกล้ประตู' },
    '2-1': { leftContent: 'หลบประตูมิติบนพื้น เก็บหนังสือ "CHRONICLE_I" วางบนแท่นวางด้วย put_in("str") แล้วบวก +40 ให้หมึกทั้งสามช่องสี' },
    '2-2': { leftContent: 'หลบประตูมิติ ปรับสีเลนส์อ่านหนังสือทีละช่อง พร้อมเก็บ "OPTICS_TOME" วางแท่น [str]' },
    '2-3': { leftContent: 'เลี่ยงประตูมิติ กลับสีหน้าหนังสือด้วย 255 ลบค่าเดิม แล้ววาง "MIRROR_CODEX" ลงแท่น [str]' },
    '2-4': { leftContent: 'หลบประตูมิติ คืนสีหน้าหนังสือความทรงจำด้วยค่าเฉลี่ยสีเทา (r + g + b) // 3' },
    '2-5': { leftContent: 'หลบประตูมิติ ปลดตัวล็อกคัมภีร์ด้วยความสว่าง +40 และค่าเฉลี่ยสีเทา' },
    '2-6': { leftContent: 'เดินระหว่างประตูมิติเพื่อผสมสีเหลืองทอง (255, 255, 0) ให้ปกตำรา Gilded Compendium' },
    '2-7': { leftContent: 'หลบประตูมิติ ใช้ลูปเพิ่มสีแดง +30 ให้ตราหนังสือ Almanac ทั้งสองจุด' },
    '2-8': { leftContent: 'หลบประตูมิติ วาง "ATLAS_INDEX" ลงแท่น คืนสีหน้าหนังสือด้วย +50 และสีเทา แล้วเปิด Atlas Gate' },
    '3-1': { leftContent: 'ภาพดิจิทัลคือชุดพิกเซล RGB เดินอ้อมเสาหินและประตูมิติในถ้ำเพื่อเรียงพิกเซลตามลำดับเดิม' },
    '3-2': { leftContent: 'ใช้ตำแหน่งพิกเซลแก้แถวที่สลับกัน พร้อมเดินหลบประตูมิติและหินงอกในถ้ำ' },
    '3-4': { leftContent: 'for loop ใช้ตัวกรองภาพเดียวกันกับทุกพิกเซลขณะเดินอ้อมเสาหินและประตูมิติ' },
    '3-5': { leftContent: 'แก้ลูปที่สลับช่องสีแดงกับสีเขียวให้ถูกต้อง พร้อมหลีกเลี่ยงประตูมิติในถ้ำ' },
    '3-7': { leftContent: 'ใช้ลูปตรวจค่าสีแดงของรูนทีละจุดแล้วเปลี่ยนเป็นสีทอง ฝ่าแนวหินงอกและประตูมิติไปสู่ประตูถ้ำ' },
    '4-1': { leftContent: 'เปรียบเทียบค่าสีแดงกับ 128 เพื่อเลือกสีขาวหรือดำ' },
    '4-2': { leftContent: 'ใช้ if/elif/else เลือกสีจากช่วงของค่าสีแดง' },
    '4-3': { leftContent: 'ใช้เงื่อนไขค่าสีแดงเพื่อเลือกพิกเซลที่จะเก็บไว้' },
    '4-6': { leftContent: 'เลือกพิกเซลที่มีค่าสีแดงน้อยกว่า 100 แล้วเปลี่ยนเป็นสีทอง' },
    '4-7': { leftContent: 'ภาพสุดท้ายใช้เงื่อนไขค่าสีแดงสองช่วงเพื่อคืนสีให้ผนึก' },
};

const shared = {
    forest: {
        rightTitle: 'คาถา Python',
        rightContent: 'อ่านเป้าหมาย เดินอ้อมสิ่งกีดขวาง ลองรันคาถา แล้วดูผลในสนาม 2 มิติ',
    },
    archive: {
        leftNote: 'ระวังประตูมิติ (WARP) บนพื้นหากเหยียบจะถูกดูดกลับจุดเกิด! ใช้ pick_up()/put_in("str") วางตำราที่ตกอยู่ และร่ายค่า RGB 0-255',
        rightTitle: 'หอจดหมายเหตุมีชีวิต',
        rightContent: 'ทุกตำราที่วางแท่นและหมึกสีที่ร่ายคืนช่วยชุบชีวิตหอจดหมายเหตุให้กลับมามีสีสันอีกครั้ง',
        rightQuote: '"หลบประตูมิติบนพื้นหินอ่อน รักษาตำราทุกเล่มไว้อย่างปลอดภัย"',
    },
    image: {
        leftNote: 'ระวังประตูมิติและหินงอกที่ขวางทางในถ้ำ ภาพแต่ละแถวประกอบด้วยพิกเซล RGB [r, g, b]',
        rightTitle: 'ภาพที่มีชีวิต',
        rightContent: 'รันตัวกรอง Python แล้วดูภาพรูนเปลี่ยนไปทีละพิกเซลขณะเดินอ้อมสิ่งกีดขวาง',
        rightQuote: '"รูปแบบจะชัดขึ้น เมื่อพิกเซลแต่ละจุดอยู่ถูกตำแหน่ง"',
    },
};

const incantationDescriptions = {
    'hero.move_right(n)': 'เดินไปทางขวา n ช่อง',
    'hero.move_left(n)': 'เดินไปทางซ้าย n ช่อง',
    'hero.move_up(n)': 'เดินขึ้น n ช่อง',
    'hero.move_down(n)': 'เดินลง n ช่อง',
    'hero.pick_up()': 'เก็บไอเทมในช่องที่ยืนอยู่',
    'hero.put_in("str")': 'ใส่ขวดสำหรับข้อความ',
    'hero.put_in("int")': 'ใส่ขวดสำหรับจำนวนเต็ม',
    'hero.put_in("float")': 'ใส่ขวดสำหรับทศนิยม',
    'hero.put_in("bool")': 'ใส่ขวดสำหรับค่า boolean',
    'print(value)': 'แสดงค่าใน Python',
    'hero.cast_color(r, g, b)': 'คืนสีให้วัตถุหรือส่วนของภาพ',
    'pixels[index]': 'อ่านพิกเซลตามตำแหน่ง',
};

export function localGrimoirePage(page, stageKey, stageTitle, isThai) {
    if (!isThai) return page;
    const chapter = Number(stageKey.split('-')[0]);
    const common = chapter === 1 ? shared.forest : chapter === 2 ? shared.archive : shared.image;
    const translated = referenceText[stageKey] || {};
    return {
        ...page,
        ...common,
        leftTitle: translated.leftTitle || stageTitle,
        ...translated,
        leftIncantations: (page.leftIncantations || []).map(inc => ({
            ...inc,
            desc: incantationDescriptions[inc.code] || inc.desc,
        })),
    };
}
