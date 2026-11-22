import { useEffect } from 'react';
import { STORY_SCENES } from '@/features/stages/storyScenes';
import worldMap from '@/assets/images/the-lost-spectrum-world-map.png';
import './storyscene.css';

export default function StoryScene({ scene, playerName, isThai, onClose, saving = false, error = '' }) {
    const script = STORY_SCENES[scene]?.[isThai ? 'th' : 'en'];
    useEffect(() => {
        const onKey = event => { if (event.key === 'Escape' && !saving) onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose, saving]);
    if (!script) return null;
    const safeName = playerName?.trim() || (isThai ? 'ผู้ถูกเลือก' : 'the chosen child');
    return (
        <div className="story-scene-backdrop" role="dialog" aria-modal="true" aria-labelledby="story-scene-title">
            <div className={`story-scene story-scene-${scene}`}>
                <span className="story-scene-eyebrow">{script.eyebrow}</span>
                <div className="story-scene-sigil" aria-hidden="true"><i className={scene === 'prologue' ? 'fas fa-book-open' : 'fas fa-sun'} /></div>
                <h1 id="story-scene-title">{script.title}</h1>
                {scene === 'epilogue' && <div className="story-scene-world" aria-hidden="true">
                    <img src={worldMap} alt="" />
                    <img className="story-scene-world-color" src={worldMap} alt="" />
                </div>}
                <div className="story-scene-lines">
                    {script.lines.map((line, index) => <p key={index}>{line.replaceAll('{name}', safeName)}</p>)}
                </div>
                {error && <p role="alert" className="story-scene-error">{error}</p>}
                <button className="story-scene-continue" onClick={onClose} disabled={saving}>{saving ? (isThai ? 'กำลังบันทึก...' : 'Saving...') : script.action}</button>
                <button className="story-scene-skip" onClick={onClose} disabled={saving}>{script.skip}</button>
            </div>
        </div>
    );
}
