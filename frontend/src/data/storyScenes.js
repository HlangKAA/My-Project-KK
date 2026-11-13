export const VILLAIN_NAME = 'Krakk, Summus Magus Monotoniae';

export const STORY_SCENES = {
    prologue: {
        en: {
            eyebrow: 'Before the first spell', title: 'The Night Color Vanished',
            lines: [
                'Krakk, Summus Magus Monotoniae stole every color from the kingdom. He left its forests, books, and skies trapped in gray so no one could imagine a different world.',
                'An ancient grimoire escaped his spell. Its pages opened for {name}, a child it had chosen to carry the lost spectrum.',
                'Eldrin waits in the Red Forest. Learn the language of spells, restore each place you cross, and follow the traces of the stolen light to Krakk.',
            ],
            action: 'Begin the journey', skip: 'Skip story',
        },
        th: {
            eyebrow: 'ก่อนคาถาแรก', title: 'คืนที่สีหายไป',
            lines: [
                'แคร็กก์ จอมเวทสูงสุดแห่งความจำเจ ขโมยสีทุกสีไปจากอาณาจักร ป่า หนังสือ และท้องฟ้าเหลือเพียงสีเทา เพื่อไม่ให้ใครจินตนาการถึงโลกแบบอื่นได้',
                'ตำราคาถาโบราณเล่มหนึ่งรอดจากเวทของเขา หน้าหนังสือเปิดออกต่อหน้า {name} เด็กที่มันเลือกให้ตามหาสีที่หายไป',
                'เอลดรินรออยู่ในป่าแดง เรียนรู้ภาษาคาถา คืนสีให้ทุกที่ที่ผ่าน แล้วตามร่องรอยของแสงไปหาแคร็กก์',
            ],
            action: 'เริ่มการเดินทาง', skip: 'ข้ามเรื่องราว',
        },
    },
    epilogue: {
        en: {
            eyebrow: 'The spectrum restored', title: 'A World in Color',
            lines: [
                'The last seal breaks. Krakk, Summus Magus Monotoniae falls, and his spell over the kingdom ends for good.',
                'Color races from the caverns across the Ash Peaks, through the Archive, and into the Red Forest. The people can see their world again.',
                'The grimoire closes in {name}’s hands. Its final page is no longer blank: “The light was always yours to share.”',
            ],
            action: 'Return to the journey', skip: 'Skip ending',
        },
        th: {
            eyebrow: 'สีสันกลับคืนมาแล้ว', title: 'โลกที่มีสีอีกครั้ง',
            lines: [
                'ผนึกสุดท้ายแตกสลาย แคร็กก์ จอมเวทสูงสุดแห่งความจำเจ พ่ายแพ้ และเวทที่ปกคลุมอาณาจักรก็สิ้นสุดลง',
                'สีไหลจากถ้ำข้ามยอดเขาเถ้าถ่าน ผ่านหอจดหมายเหตุ ไปถึงป่าแดง ทุกคนได้เห็นโลกของตัวเองอีกครั้ง',
                'ตำราคาถาปิดลงในมือของ {name} หน้าสุดท้ายที่เคยว่างเปล่ามีข้อความว่า “แสงนี้เป็นของทุกคน”',
            ],
            action: 'กลับไปยังการเดินทาง', skip: 'ข้ามตอนจบ',
        },
    },
};
