export const VILLAIN_NAME = 'Krakk, Summus Magus Monotoniae';

export const STORY_SCENES = {
    prologue: {
        en: {
            eyebrow: 'Before the first spell', title: 'The Night Color Vanished',
            lines: [
                'Krakk stole the kingdom\'s colors. Forests, books, and skies faded to gray.',
                'An ancient grimoire chose {name}. Its Python commands can awaken what has faded and begin restoring color.',
                'Eldrin waits in THE RED FOREST. Meet him in Stage 1-1 and awaken The Awakening Altar to begin your journey.',
            ],
            action: 'Begin the journey', skip: 'Skip story',
        },
        th: {
            eyebrow: 'ก่อนคาถาแรก', title: 'คืนที่สีหายไป',
            lines: [
                'แคร็กก์ขโมยสีไปจากอาณาจักร ป่า หนังสือ และท้องฟ้าเลยกลายเป็นสีเทา',
                'ตำราคาถาโบราณเลือก {name} คำสั่ง Python ในตำราจะช่วยปลุกสิ่งที่สีจางหาย และเริ่มพาสีกลับคืนมา',
                'เอลดรินรออยู่ที่ THE RED FOREST ไปพบเขาในด่าน 1-1 แล้วปลุก The Awakening Altar เพื่อเริ่มการเดินทาง',
            ],
            action: 'เริ่มการเดินทาง', skip: 'ข้ามเรื่องราว',
        },
    },
    epilogue: {
        en: {
            eyebrow: 'The spectrum restored', title: 'A World in Color',
            lines: [
                'The last seal breaks. Krakk, Summus Magus Monotoniae falls, and his spell over the kingdom ends for good.',
                "Color races from ASH PEAKS through WHISPERING CAVERNS, past THE SCHOLAR'S ARCHIVE, and into THE RED FOREST. The people can see their world again.",
                'The grimoire closes in {name}’s hands. Its final page is no longer blank: “The light was always yours to share.”',
            ],
            action: 'Return to the journey', skip: 'Skip ending',
        },
        th: {
            eyebrow: 'สีสันกลับคืนมาแล้ว', title: 'โลกที่มีสีอีกครั้ง',
            lines: [
                'ผนึกสุดท้ายแตกสลาย แคร็กก์ จอมเวทสูงสุดแห่งความจำเจ พ่ายแพ้ และเวทที่ปกคลุมอาณาจักรก็สิ้นสุดลง',
                "สีไหลจาก ASH PEAKS ผ่าน WHISPERING CAVERNS และ THE SCHOLAR'S ARCHIVE ไปถึง THE RED FOREST ทุกคนได้เห็นโลกของตัวเองอีกครั้ง",
                'ตำราคาถาปิดลงในมือของ {name} หน้าสุดท้ายที่เคยว่างเปล่ามีข้อความว่า “แสงนี้เป็นของทุกคน”',
            ],
            action: 'กลับไปยังการเดินทาง', skip: 'ข้ามตอนจบ',
        },
    },
};
