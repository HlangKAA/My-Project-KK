# 🎮 ปรับปรุงระบบด่าน (Gamification Teaching) + ระบบพัฒนาการตัวละคร (Character Progression)

## สถานะปัจจุบัน & ปัญหา

### ❌ ปัญหาด้านการสอน (Stage Teaching)
| ปัญหา | รายละเอียด |
|---|---|
| **ด่านน้อยเกินไป** | มีแค่ 8 ด่าน ใน 4 regions — ไม่เพียงพอในการสร้าง learning curve ที่ต่อเนื่อง |
| **ไม่มี Scaffolding** | ผู้เล่นได้รับ code สำเร็จรูปมาเลย (เช่น 1-1 ให้ code ครบตั้งแต่ต้น) — ไม่ได้ฝึกคิดเอง |
| **ไม่มี Micro-steps** | กระโดดจาก `print()` ไป `hero.cast_color()` ไป `lists.index()` เร็วเกินไป |
| **ไม่มี Feedback Loop** | ทำถูก/ผิดไม่มี hint แบบ progressive, ไม่มีระบบ retry ที่ฉลาด |
| **ไม่มี Pre-lesson** | NPC Story Intro มีแค่ 2 ด่าน (1-1, 2-1) — ไม่ build context ก่อนสอน concept |
| **Grimoire ไม่ต่อเนื่อง** | เนื้อหาใน Grimoire ไม่สะสมข้ามด่าน ผู้เล่นจำไม่ได้ว่าเรียนอะไรมาบ้าง |
| **ไม่มี Challenge Variation** | ทุกด่านเป็นรูปแบบเดียว = เขียน code → run → ผ่าน, ไม่มีด่าน quiz/fill-in/debug |

### ❌ ปัญหาด้านตัวละคร (Character Progression)  
| ปัญหา | รายละเอียด |
|---|---|
| **ไม่มี Avatar System** | ตัวละครเป็นแค่ icon `fa-hat-wizard` — ไม่มี visual progression |
| **XP เป็น Hardcode** | `XP +450` เป็นตัวเลขตาย ไม่มีระบบ XP จริง |
| **ไม่มี Level System** | ไม่มีระดับตัวละคร (Wizard Level), ไม่มี Experience Bar |
| **Skill ไม่สะสม** | แต่ละด่านแสดง Skills แยกกัน ไม่มี global skill tree |
| **ไม่มี Unlock / Reward** | ผ่านด่านแล้วไม่มีอะไรปลดล็อก (spell ใหม่, outfit, title) |
| **ไม่มี Inventory ที่ใช้งานได้** | ปุ่ม Inventory มีแต่ไม่ทำงาน |

---

## Proposed Changes

### 📋 Phase 1: ปรับโครงสร้างด่านให้สอนแบบ Gamification ต่อเนื่อง

#### ออกแบบ Stage Types (แทนที่จะมีแค่ "เขียน code → run")

เพิ่มประเภทด่านที่หลากหลายเพื่อสร้าง variety ในการเรียนรู้:

```
Stage Types:
├── 📖 "lesson"       — NPC สอน concept ใหม่ + ให้ลอง interactive example
├── ✏️ "guided"       — Scaffolded coding: เติม code ในช่องว่าง (fill-in-the-blank)
├── 🎯 "challenge"    — เขียน code จาก scratch ตาม objective (แบบปัจจุบัน)
├── 🐛 "debug"        — แก้ code ที่มี bug ให้ทำงานได้
├── 🧩 "puzzle"       — Multiple choice / drag-and-drop คำตอบ
└── ⚔️ "boss"         — ด่านรวม concept ทั้ง region
```

#### [MODIFY] [stageData.js](file:///d:/File/Projects/LostSpectrum/MY-PROJECT-KK/frontend/src/data/stageData.js)
ปรับโครงสร้าง stage data เพิ่มฟิลด์ใหม่:

```js
// เพิ่มฟิลด์ใหม่ในแต่ละ stage:
{
    stageType: 'guided',        // lesson | guided | challenge | debug | puzzle | boss
    difficulty: 1,              // 1-5 star difficulty
    xpReward: 200,              // XP ที่ได้จากการผ่าน
    prerequisiteConcepts: [],   // concept ที่ต้องรู้ก่อน
    teachingConcepts: [],       // concept ที่ด่านนี้สอน
    
    // Progressive Hints (แทน hint เดียว)
    hints: [
        { level: 1, text: "Think about what print() does..." },
        { level: 2, text: "f-strings use {curly braces}..." },
        { level: 3, text: "Try: print(f'{name}')" }
    ],
    
    // สำหรับ guided type
    codeTemplate: "name = ___\nprint(f'{___}')",
    blanks: [
        { id: 'blank1', answer: '"Lumina"', hint: 'a string value' },
        { id: 'blank2', answer: 'name', hint: 'the variable you just defined' }
    ],
    
    // สำหรับ debug type
    buggyCode: "name = Lumina\nprint(f{name})",
    bugDescription: "มี 2 bugs ใน code นี้ — หาและแก้ให้ถูกต้อง",
    
    // สำหรับ puzzle type
    puzzleChoices: [...],
    
    // Rewards
    rewards: {
        spellUnlock: 'cast_color',    // ปลดล็อก spell ใหม่
        titleUnlock: 'Apprentice',     // ปลดล็อก title ใหม่
        outfitPart: 'red_robe',        // ปลดล็อกชุด
    }
}
```

#### ปรับเนื้อหาด่าน Region 1 (THE RED FOREST) ให้สอนต่อเนื่อง

**หลักการ: ทุก Region เริ่มด้วย lesson → guided → challenge → debug → boss**

| Stage | Type | Concept | เนื้อหา |
|---|---|---|---|
| 1-1 | `lesson` | print() basics | NPC Eldrin สอน → ลองพิมพ์ print("hello") (เหมือนเดิมแต่เพิ่ม interactive) |
| 1-2 | `guided` | Variables + f-strings | เติม code ในช่องว่าง: `name = ___` + `print(f"___")` |
| 1-3 | `challenge` | Variables + print() | เขียน code จาก scratch: ประกาศ 2 ตัวแปร แล้ว print ด้วย f-string |
| 1-4 | `debug` | Debug print/variables | หา bug ใน code ที่เขียนผิด (ลืม quotes, ลืม f ก่อน string) |
| 1-5 | `lesson` | RGB + cast_color() | NPC สอน RGB → ลองเรียก hero.cast_color(255,0,0) |
| 1-6 | `guided` | RGB mixing | เติมค่า RGB ตาม color target ที่แสดง |
| 1-7 | `challenge` | Functions + RGB | สร้าง function ที่ cast สีตาม input |
| 1-8 | `boss` | All Region 1 concepts | ใช้ทุก concept: variables, print, f-string, RGB, functions, movement |

#### [NEW] [conceptMap.js](file:///d:/File/Projects/LostSpectrum/MY-PROJECT-KK/frontend/src/data/conceptMap.js)
Concept dependency graph สำหรับ tracking ว่าผู้เล่นเรียนอะไรมาบ้าง:

```js
export const CONCEPT_MAP = {
    'print': { name: 'print()', region: 1, prerequisite: [], order: 1 },
    'strings': { name: 'Strings', region: 1, prerequisite: ['print'], order: 2 },
    'variables': { name: 'Variables', region: 1, prerequisite: ['strings'], order: 3 },
    'f-strings': { name: 'f-Strings', region: 1, prerequisite: ['variables', 'strings'], order: 4 },
    'functions-basic': { name: 'Functions', region: 1, prerequisite: ['variables'], order: 5 },
    'rgb': { name: 'RGB Colors', region: 1, prerequisite: ['variables'], order: 6 },
    'int-float': { name: 'Numbers', region: 2, prerequisite: ['variables'], order: 7 },
    'type-checking': { name: 'type()', region: 2, prerequisite: ['int-float', 'strings'], order: 8 },
    'lists': { name: 'Lists', region: 3, prerequisite: ['variables'], order: 9 },
    'indexing': { name: 'Indexing', region: 3, prerequisite: ['lists'], order: 10 },
    'conditionals': { name: 'if/else', region: 4, prerequisite: ['variables'], order: 11 },
    'loops-for': { name: 'for loops', region: 4, prerequisite: ['lists'], order: 12 },
};
```

---

### 📋 Phase 2: ระบบ Progressive Hints (Adaptive Feedback)

#### [MODIFY] [StagePage.jsx](file:///d:/File/Projects/LostSpectrum/MY-PROJECT-KK/frontend/src/pages/StagePage.jsx)
เพิ่มระบบ hint ที่ค่อยๆ เปิดเผยมากขึ้นตามจำนวนครั้งที่พยายามผิด:

```jsx
// State ใหม่
const [attemptCount, setAttemptCount] = useState(0);
const [currentHintLevel, setCurrentHintLevel] = useState(0);
const [showHintPanel, setShowHintPanel] = useState(false);

// เมื่อ run แล้วผิด → เพิ่ม attempt → เปิด hint level ถัดไป
const handleRunFailed = () => {
    setAttemptCount(prev => prev + 1);
    if (attemptCount >= 1 && currentHintLevel < hints.length - 1) {
        setCurrentHintLevel(prev => prev + 1);
    }
};
```

เพิ่ม **Hint Panel** ใน UI:
```jsx
<div className="hint-panel">
    <div className="hint-header">
        <i className="fas fa-lightbulb"></i>
        Hint ({currentHintLevel + 1} / {hints.length})
    </div>
    <p>{hints[currentHintLevel].text}</p>
    {currentHintLevel < hints.length - 1 && (
        <button onClick={requestMoreHint}>Need more help?</button>
    )}
</div>
```

---

### 📋 Phase 3: ระบบพัฒนาการตัวละคร (Character Progression System)

#### [NEW] [characterData.js](file:///d:/File/Projects/LostSpectrum/MY-PROJECT-KK/frontend/src/data/characterData.js)
ระบบ XP, Level, และ unlockables:

```js
export const CHARACTER_SYSTEM = {
    // Level thresholds
    levels: [
        { level: 1,  title: 'Novice',      xpRequired: 0,     icon: 'fas fa-seedling' },
        { level: 2,  title: 'Apprentice',   xpRequired: 500,   icon: 'fas fa-hat-wizard' },
        { level: 3,  title: 'Adept',        xpRequired: 1200,  icon: 'fas fa-fire' },
        { level: 4,  title: 'Mage',         xpRequired: 2500,  icon: 'fas fa-star' },
        { level: 5,  title: 'Sorcerer',     xpRequired: 4000,  icon: 'fas fa-dragon' },
        { level: 6,  title: 'Archmage',     xpRequired: 6000,  icon: 'fas fa-crown' },
        { level: 7,  title: 'Grand Wizard', xpRequired: 9000,  icon: 'fas fa-sun' },
        { level: 8,  title: 'Spectrum Lord', xpRequired: 13000, icon: 'fas fa-infinity' },
    ],

    // XP multipliers
    xpMultipliers: {
        firstAttempt: 1.5,      // ผ่านครั้งแรก +50% XP
        noHints: 1.3,           // ไม่ใช้ hint +30% XP
        speedBonus: 1.2,        // ทำเสร็จภายใน time limit +20%
        perfectCode: 1.1,       // code สั้นกว่า optimal +10%
    },

    // Spell inventory (ปลดล็อกตาม progression)
    spells: {
        'print': { name: 'Voice of Code', unlockAt: '1-1', icon: 'fas fa-comment-dots', color: '#60a5fa' },
        'variables': { name: 'Container Craft', unlockAt: '1-2', icon: 'fas fa-database', color: '#34d399' },
        'f-strings': { name: 'Word Weaving', unlockAt: '1-3', icon: 'fas fa-feather-alt', color: '#a78bfa' },
        'cast_color': { name: 'Chromatic Cast', unlockAt: '1-5', icon: 'fas fa-palette', color: '#f87171' },
        'functions': { name: 'Spell Binding', unlockAt: '1-7', icon: 'fas fa-magic', color: '#fbbf24' },
        'type': { name: "Nature's Eye", unlockAt: '2-2', icon: 'fas fa-eye', color: '#06b6d4' },
        'lists': { name: 'Array Mastery', unlockAt: '3-1', icon: 'fas fa-list', color: '#fb923c' },
        'conditionals': { name: 'Fate Divider', unlockAt: '4-1', icon: 'fas fa-code-branch', color: '#e879f9' },
    },

    // Wizard outfits (cosmetic unlocks)
    outfits: {
        'default': { name: 'Tattered Robes', color: '#6b7280', unlockCondition: 'default' },
        'red_robe': { name: 'Crimson Robe', color: '#dc2626', unlockCondition: 'complete_region_1' },
        'blue_robe': { name: 'Azure Robe', color: '#3b82f6', unlockCondition: 'complete_region_2' },
        'purple_robe': { name: 'Arcane Vestments', color: '#7c3aed', unlockCondition: 'complete_region_3' },
        'white_robe': { name: 'Spectrum Robes', color: '#f5f5f5', unlockCondition: 'complete_region_4' },
        'golden_robe': { name: 'Grand Wizard Garb', color: '#f59e0b', unlockCondition: 'reach_level_7' },
    }
};
```

#### [MODIFY] [GameContext.jsx](file:///d:/File/Projects/LostSpectrum/MY-PROJECT-KK/frontend/src/context/GameContext.jsx)
เพิ่ม Character State ใน Context:

```jsx
const [user, setUser] = useState({
    // ...existing...
    xp: 0,
    wizardLevel: 1,
    wizardTitle: 'Novice',
    unlockedSpells: ['print'],
    equippedOutfit: 'default',
    unlockedOutfits: ['default'],
    completedStages: {},      // { '1-1': { xp: 300, attempts: 1, time: 120, hintsUsed: 0 } }
    conceptsMastered: [],     // ['print', 'variables', 'f-strings']
    totalPlayTime: 0,
});

// XP calculation with multipliers
const awardXP = (baseXP, modifiers) => {
    let multiplier = 1;
    if (modifiers.firstAttempt) multiplier *= 1.5;
    if (modifiers.noHints) multiplier *= 1.3;
    const earnedXP = Math.floor(baseXP * multiplier);
    
    const newXP = user.xp + earnedXP;
    const newLevel = calculateLevel(newXP);
    
    setUser(prev => ({
        ...prev,
        xp: newXP,
        wizardLevel: newLevel.level,
        wizardTitle: newLevel.title
    }));
    
    return earnedXP;
};
```

#### [NEW] [WizardProfile.jsx](file:///d:/File/Projects/LostSpectrum/MY-PROJECT-KK/frontend/src/components/WizardProfile.jsx)
Component แสดงตัวละครพร้อม progression:

```jsx
// แสดง: Avatar + Level + XP Bar + Title + Equipped Outfit
// ใช้ใน Dashboard, StagePage navbar, Level Complete screen
```

#### [NEW] [SpellBook.jsx](file:///d:/File/Projects/LostSpectrum/MY-PROJECT-KK/frontend/src/components/SpellBook.jsx)
Component แสดง Spells ที่ปลดล็อก (แทนที่ Inventory ที่ว่างเปล่า):

```jsx
// Grid ของ spell cards
// ปลดล็อกแล้ว = สีสด + hover animation
// ยังไม่ปลดล็อก = สีเทา + ล็อก icon
// คลิกดู spell details + code example
```

#### [NEW] [SkillTree.jsx](file:///d:/File/Projects/LostSpectrum/MY-PROJECT-KK/frontend/src/components/SkillTree.jsx)
Global Skill Tree ที่แสดง concept progression ทั้งหมด:

```jsx
// Visual graph ของ concepts ที่เรียนมา
// Connected nodes: print → variables → f-strings → functions
// สีเขียว = mastered, สีเหลือง = learning, สีเทา = locked
```

---

### 📋 Phase 4: ปรับปรุง Stage Types ใน StagePage

#### [MODIFY] [StagePage.jsx](file:///d:/File/Projects/LostSpectrum/MY-PROJECT-KK/frontend/src/pages/StagePage.jsx)
เพิ่ม rendering logic สำหรับ stage types ใหม่:

```jsx
// Stage Type Renderer
const renderStageContent = () => {
    switch (currentStage.stageType) {
        case 'lesson':
            return <LessonStage data={currentStage} onComplete={handleLevelComplete} />;
        case 'guided':
            return <GuidedStage data={currentStage} onComplete={handleLevelComplete} />;
        case 'debug':
            return <DebugStage data={currentStage} onComplete={handleLevelComplete} />;
        case 'puzzle':
            return <PuzzleStage data={currentStage} onComplete={handleLevelComplete} />;
        case 'boss':
            return <BossStage data={currentStage} onComplete={handleLevelComplete} />;
        case 'challenge':
        default:
            return /* existing IDE layout */;
    }
};
```

#### [NEW] Stage Type Components:
| File | Description |
|---|---|
| `GuidedStage.jsx` | Code template พร้อมช่องว่างให้เติม — guided practice |
| `DebugStage.jsx` | แสดง buggy code + ให้ผู้เล่นหาและแก้ bug |
| `PuzzleStage.jsx` | Multiple choice / matching / ordering puzzles |
| `BossStage.jsx` | Multi-step challenge ที่รวม concepts |
| `LessonStage.jsx` | Interactive lesson ที่มี NPC + live code demo |

---

### 📋 Phase 5: ปรับ Level Complete ให้แสดง Progression

#### [MODIFY] [LevelComplete.jsx](file:///d:/File/Projects/LostSpectrum/MY-PROJECT-KK/frontend/src/components/LevelComplete.jsx)
ปรับจอจบด่านให้แสดง progression ที่มีความหมาย:

```
┌──────────────────────────────────────────┐
│  ⭐ STAGE COMPLETE! ⭐                    │
│                                          │
│  ┌─────────┐                             │
│  │ Wizard  │  Level 3 → Level 4!         │
│  │ Avatar  │  ████████████░░░ 2100/2500  │
│  └─────────┘                             │
│                                          │
│  XP Earned: +300                         │
│  ├─ Base: 200                            │
│  ├─ First Attempt Bonus: +50%            │
│  └─ No Hints Bonus: +30%                │
│                                          │
│  🔓 New Spell Unlocked: "Word Weaving"   │
│  🎭 New Title: "Adept"                   │
│                                          │
│  📚 Concepts Mastered:                   │
│  [✓] print()  [✓] Variables  [NEW] f-Strings │
│                                          │
│  [Replay] [Continue Journey →]           │
└──────────────────────────────────────────┘
```

---

## User Review Required

> [!IMPORTANT]
> **ขอบเขตงาน:** แผนนี้แบ่งเป็น 5 Phase — แต่ละ Phase สามารถ implement แยกกันได้ ต้องการทำทั้งหมดหรือเลือกบาง Phase?

> [!IMPORTANT]
> **Stage Content:** การเพิ่มด่านจาก 8 เป็น ~30 ด่าน (8 ด่านต่อ region) ต้องการเนื้อหา Python ระดับไหน? เบื้องต้นเสนอ:
> - Region 1: print, variables, f-strings, RGB, functions  
> - Region 2: data types, type(), int/float/str, type conversion
> - Region 3: lists, indexing, searching, for loops
> - Region 4: conditionals, if/elif/else, boolean logic, color mixing

> [!WARNING]
> **Backend ยังไม่พร้อม:** XP, Level, Spell unlocks ต้องเก็บใน database — แต่ตอนนี้ยังไม่มี stage progress API (`POST /api/complete-stage` ยังไม่มี) ถ้าทำ Phase 3 จะต้องสร้าง backend API ด้วย หรือจะเก็บใน localStorage ไปก่อน?

## Open Questions

> [!IMPORTANT]
> 1. **ลำดับความสำคัญ:** อยากให้ focus อะไรก่อน?
>    - A) ปรับเนื้อหาด่าน + เพิ่ม stage types (Phase 1 + 4) — ทำให้เกมมีเนื้อหาเล่นได้จริง
>    - B) ระบบตัวละคร XP/Level (Phase 3 + 5) — ทำให้รู้สึกมี progression
>    - C) ทำทั้ง A + B ไปพร้อมกัน

> [!IMPORTANT]
> 2. **NPC ตัวละครสอน:** อยากให้ NPC ปรากฏแค่ต้น Region หรือทุกด่าน `lesson` type? NPC แต่ละ Region จะเป็นคนละตัวหรือเดิม?

> [!IMPORTANT]
> 3. **ระบบ Guided Stage (เติมช่องว่าง):** อยากได้แบบ text input ในช่องว่าง หรือแบบ drag-and-drop code blocks?

---

## Verification Plan

### Manual Verification
- เล่นจากด่าน 1-1 ถึงด่านสุดท้ายแบบ end-to-end ตรวจว่า concept ต่อเนื่อง
- ตรวจ XP calculation ว่าถูกต้อง (first attempt bonus, no-hint bonus)
- ตรวจ Spell unlock ว่าปลดล็อกตาม stage progression
- ตรวจ Hint system ว่าค่อยๆ เปิดเผยมากขึ้นตาม attempt count
- ตรวจ visual progression ของตัวละคร (level up animation, title change)

### Automated Tests
- ตรวจ concept dependency graph ว่าไม่มี circular dependency
- ตรวจว่าทุก stage มี `stageType`, `xpReward`, `hints`, `teachingConcepts`
- ตรวจว่า XP multiplier calculation ถูกต้อง
