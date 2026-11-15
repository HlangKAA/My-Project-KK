import { useEffect, useRef, useState } from 'react';
import mapGuide from '@/assets/tutorial/map-guide.jpeg';
import stageGuide from '@/assets/tutorial/stage-guide.jpeg';
import './gameplayWalkthrough.css';

const STEPS = {
    en: [
        {
            icon: 'fas fa-map-marked-alt',
            title: 'Start in the Red Forest',
            body: 'The world map shows four chapters. Open the Red Forest, then choose Stage 1-1: The Awakening Altar.',
            caption: 'Choose the Red Forest chapter button.',
        },
        {
            icon: 'fas fa-code',
            title: 'Read the goal and edit the spell',
            body: 'The goal is above the game board. In the code box, Python commands tell your hero what to do. You do not move the hero with arrow keys.',
            caption: 'Read the objective, then use the code editor.',
        },
        {
            icon: 'fas fa-book-open',
            title: 'Need a spell reminder?',
            body: 'Open Spells for this stage’s guide and examples. Open Spell Book to review Python spells you have unlocked. You can reopen either one while solving the stage.',
            caption: 'Spells and Spell Book are in the top bar of the stage.',
        },
        {
            icon: 'fas fa-play',
            title: 'Run your code and watch',
            body: 'Press Run Spell Code to see your hero act. If it fails, read the message, change the code, and try again. Hints appear after a failed run; Reset restores the starter code. A cleared stage saves your progress.',
            caption: 'Press Run Spell Code to watch your spell work.',
        },
    ],
    th: [
        {
            icon: 'fas fa-map-marked-alt',
            title: 'เริ่มที่ THE RED FOREST',
            body: 'บนแผนที่มี 4 บท ให้เปิด THE RED FOREST แล้วเลือกด่าน 1-1: The Awakening Altar',
            caption: 'เลือกปุ่มบท THE RED FOREST',
        },
        {
            icon: 'fas fa-code',
            title: 'อ่านโจทย์แล้วแก้โค้ดคาถา',
            body: 'โจทย์อยู่เหนือฉากเกม ส่วนช่องโค้ดใช้คำสั่ง Python บอกตัวละครว่าต้องทำอะไร ไม่ต้องกดลูกศรเพื่อเดินเอง',
            caption: 'อ่านโจทย์ แล้วใช้ช่องเขียนโค้ด',
        },
        {
            icon: 'fas fa-book-open',
            title: 'ลืมคาถา? เปิดดูได้เลย',
            body: 'กด คาถา เพื่อดูคำแนะนำกับตัวอย่างของด่านนี้ หรือกด หนังสือคาถา เพื่อทบทวนคาถา Python ที่ปลดล็อกแล้ว กลับมาเปิดดูระหว่างเล่นได้ตลอดนะ',
            caption: 'ปุ่มคาถากับหนังสือคาถาอยู่บนแถบด้านบนของด่าน',
        },
        {
            icon: 'fas fa-play',
            title: 'กดรันแล้วดูผล',
            body: 'กดรันโค้ดคาถาแล้วดูตัวละครทำตามคำสั่ง ถ้ายังไม่ผ่าน อ่านข้อความ แก้โค้ด แล้วลองใหม่ได้ คำใบ้จะขึ้นหลังลองแล้วไม่ผ่าน ส่วนปุ่มเริ่มใหม่จะคืนโค้ดตั้งต้น พอผ่านด่าน เกมจะเซฟให้',
            caption: 'กดรันโค้ดคาถา เพื่อดูผลของคำสั่ง',
        },
    ],
};

const MOBILE_FOCUS = [
    [{ id: 'map', en: 'Red Forest', th: 'THE RED FOREST' }],
    [{ id: 'objective', en: 'Objective', th: 'โจทย์' }, { id: 'editor', en: 'Code editor', th: 'ช่องเขียนโค้ด' }],
    [{ id: 'spells', en: 'Spells', th: 'คาถา' }, { id: 'spellbook', en: 'Spell Book', th: 'หนังสือคาถา' }],
    [{ id: 'run', en: 'Run Spell Code', th: 'รันโค้ดคาถา' }],
];

function ScreenshotGuide({ index, isThai, caption }) {
    const isMap = index === 0;
    const screenshot = isMap ? mapGuide : stageGuide;
    const maskId = `walkthrough-mask-${index}`;
    const width = isMap ? 1397 : 1794;
    const height = isMap ? 660 : 857;
    const spots = isMap
        ? [<ellipse key="forest" cx="265" cy="151" rx="124" ry="98" />]
        : index === 1
            ? [<rect key="objective" x="10" y="105" width="875" height="48" rx="10" />,
               <rect key="editor" x="922" y="114" width="850" height="190" rx="12" />]
            : index === 2
                ? [<rect key="spells" x="1072" y="16" width="106" height="42" rx="8" />,
                   <rect key="spellbook" x="1180" y="16" width="130" height="42" rx="8" />]
                : [<rect key="run" x="133" y="801" width="1647" height="51" rx="10" />];

    return (
        <figure className="walkthrough-figure">
            <div className={`walkthrough-shot ${isMap ? 'is-map' : 'is-stage'}`}>
                <img src={screenshot} alt={caption} />
                <svg className="walkthrough-spotlight" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
                    <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
                        <rect width={width} height={height} fill="white" />
                        {spots.map(spot => <g key={spot.key} fill="black">{spot}</g>)}
                    </mask>
                    <rect width={width} height={height} fill="rgba(2, 5, 6, .76)" mask={`url(#${maskId})`} />
                    <g className="walkthrough-spotlight-outline" fill="none" stroke="#f4d38d" strokeWidth="4">
                        {spots}
                    </g>
                </svg>
            </div>
            <div className="walkthrough-mobile-views" aria-hidden="true">
                {MOBILE_FOCUS[index].map(focus => (
                    <div key={focus.id} className={`walkthrough-mobile-view focus-${focus.id}`}
                        style={{ backgroundImage: `url(${screenshot})` }}>
                        <span>{focus[isThai ? 'th' : 'en']}</span>
                    </div>
                ))}
            </div>
            <figcaption>{caption}</figcaption>
        </figure>
    );
}

export default function GameplayWalkthrough({ isThai, onFinish, saving, error, replay = false }) {
    const [index, setIndex] = useState(0);
    const titleRef = useRef(null);
    const steps = STEPS[isThai ? 'th' : 'en'];
    const step = steps[index];

    useEffect(() => { titleRef.current?.focus(); }, [index]);

    useEffect(() => {
        const onKey = event => {
            if (event.key === 'Escape' && !saving) onFinish();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onFinish, saving]);

    return (
        <div className="walkthrough-backdrop">
            <section className="walkthrough-card" role="dialog" aria-modal="true" aria-labelledby="walkthrough-title">
                <span className="walkthrough-eyebrow">{isThai ? 'วิธีเล่นแบบสั้น ๆ' : 'A quick guide'}</span>
                <div className="walkthrough-progress" aria-label={isThai ? `ขั้นที่ ${index + 1} จาก ${steps.length}` : `Step ${index + 1} of ${steps.length}`}>
                    {steps.map((_, position) => <span key={position} className={position === index ? 'active' : ''} aria-current={position === index ? 'step' : undefined} />)}
                </div>
                <div className="walkthrough-icon" aria-hidden="true"><i className={step.icon} /></div>
                <h2 id="walkthrough-title" tabIndex={-1} ref={titleRef}>{step.title}</h2>
                <p>{step.body}</p>
                <ScreenshotGuide index={index} isThai={isThai} caption={step.caption} />
                {error && <p className="walkthrough-error" role="alert">{error}</p>}
                <div className="walkthrough-actions">
                    {index > 0 && <button type="button" className="walkthrough-secondary" onClick={() => setIndex(index - 1)} disabled={saving}>
                        {isThai ? 'ย้อนกลับ' : 'Back'}
                    </button>}
                    <button type="button" className="walkthrough-primary" disabled={saving}
                        onClick={() => index === steps.length - 1 ? onFinish() : setIndex(index + 1)}>
                        {saving ? (isThai ? 'กำลังบันทึก...' : 'Saving...') : index === steps.length - 1
                            ? (replay ? (isThai ? 'กลับไปแผนที่' : 'Return to map') : (isThai ? 'ไปที่แผนที่ THE RED FOREST' : 'Show Red Forest map'))
                            : (isThai ? 'ถัดไป' : 'Next')}
                    </button>
                </div>
                <button type="button" className="walkthrough-skip" onClick={onFinish} disabled={saving}>
                    {replay ? (isThai ? 'ปิด' : 'Close') : (isThai ? 'ข้ามวิธีเล่น' : 'Skip guide')}
                </button>
            </section>
        </div>
    );
}
