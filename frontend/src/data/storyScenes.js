export const VILLAIN_NAME = 'Krakk, Summus Magus Monotoniae';

export const STORY_SCENES = {
    prologue: {
        en: {
            eyebrow: 'Before the first spell', title: 'The Night Color Vanished',
            lines: [
                'Krakk stole the kingdom\'s colors. Forests, books, and skies faded to gray.',
                'An ancient grimoire chose {name} to bring those colors back.',
                'Eldrin is waiting in the Red Forest. Learn your first Python spell and begin the journey.',
            ],
            action: 'Begin the journey', skip: 'Skip story',
        },
        th: {
            eyebrow: 'ก่อนคาถาแรก', title: 'คืนที่สีหายไป',
            lines: [
                'แคร็กก์ขโมยสีไปจากอาณาจักร ป่า หนังสือ และท้องฟ้าเลยกลายเป็นสีเทา',
                'ตำราคาถาโบราณเลือก {name} ให้ช่วยพาสีสันกลับมา',
                'เอลดรินรออยู่ที่ป่าแดง ไปเรียนคาถา Python แรก แล้วเริ่มออกเดินทางกัน',
            ],
            action: 'เริ่มการเดินทาง', skip: 'ข้ามเรื่องราว',
        },
    },
    epilogue: {
        en: {
            eyebrow: 'The spectrum restored', title: 'A World in Color',
            lines: [
                'The last seal breaks. Krakk, Summus Magus Monotoniae falls, and his spell over the kingdom ends for good.',
                'Color races from Ash Peaks through the Whispering Caverns, past the Archive, and into the Red Forest. The people can see their world again.',
                'The grimoire closes in {name}’s hands. Its final page is no longer blank: “The light was always yours to share.”',
            ],
            action: 'Return to the journey', skip: 'Skip ending',
        },
        th: {
            eyebrow: 'สีสันกลับคืนมาแล้ว', title: 'โลกที่มีสีอีกครั้ง',
            lines: [
                'ผนึกสุดท้ายแตกสลาย แคร็กก์ จอมเวทสูงสุดแห่งความจำเจ พ่ายแพ้ และเวทที่ปกคลุมอาณาจักรก็สิ้นสุดลง',
                'สีไหลจากยอดเขาเถ้าถ่าน ผ่านถ้ำเสียงกระซิบและหอจดหมายเหตุ ไปถึงป่าแดง ทุกคนได้เห็นโลกของตัวเองอีกครั้ง',
                'ตำราคาถาปิดลงในมือของ {name} หน้าสุดท้ายที่เคยว่างเปล่ามีข้อความว่า “แสงนี้เป็นของทุกคน”',
            ],
            action: 'กลับไปยังการเดินทาง', skip: 'ข้ามตอนจบ',
        },
    },
};
