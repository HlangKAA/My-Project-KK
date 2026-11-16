import WizardSprite from '@/features/character/WizardSprite';

import { STORY_SPRITES, STORY_TITLES, STORY_ICONS } from './storyCharacters';

const STORY_PARTICLES = Array.from({ length: 30 }, () => ({
                                left: `${Math.random() * 100}%`,
                                bottom: `${Math.random() * 40}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 4}s`,
                                width: `${2 + Math.random() * 3}px`,
                                height: `${2 + Math.random() * 3}px`
                            }));

export default function StageStoryIntro({ currentStage, region, regionId, introCharacter, isPortraitIntro, dialogIndex, displayedText, isTyping, showEnterButton, npcVisible, user, isThai, onDialogClick, onEnterTower }) {
        const story = currentStage.storyIntro;
        const currentDialog = story.dialogues[dialogIndex];
        const activeStoryName = STORY_SPRITES[currentDialog?.speaker]
            ? currentDialog.speaker
            : story.npcName;
        const activeStoryCharacter = STORY_SPRITES[activeStoryName] || introCharacter;
        const activeStoryTitle = STORY_TITLES[activeStoryName] || story.npcTitle;
        const isPlayerSpeaking = currentDialog?.speaker === 'Player';
        const playerName = user?.username?.trim() || (isThai ? 'ผู้ถูกเลือก' : 'The Chosen');

        return (
            <div className={`stage-story-page ${regionId === '1' ? 'chapter-one-noir' : ''} ${isPortraitIntro ? 'stage-story-page--portrait' : ''}`}>
                {/* Background Scene */}
                <div className="stage-story-bg">
                    {/* Tower silhouette */}
                    <div className="stage-story-tower">
                        <div className="tower-body">
                            <div className="tower-window"></div>
                            <div className="tower-window w2"></div>
                            <div className="tower-window w3"></div>
                        </div>
                        <div className="tower-roof"></div>
                        <div className="tower-spire"></div>
                        <div className="tower-glow"></div>
                    </div>

                    {/* Ambient particles */}
                    <div className="stage-story-particles">
                        {STORY_PARTICLES.map((style, i) => (
                            <div key={i} className="story-particle" style={style}></div>
                        ))}
                    </div>

                    {/* Ground fog */}
                    <div className="stage-story-fog"></div>
                </div>

                {/* Region/Stage indicator */}
                <div className="stage-story-indicator">
                    <span className="stage-story-region">{region.name}</span>
                    <span className="stage-story-divider">—</span>
                    <span className="stage-story-stage">{currentStage.title}</span>
                </div>

                {/* The player stays in the scene while the speaking NPC changes. */}
                <div className={`stage-story-actors ${npcVisible ? 'visible' : ''}`}>
                    <div className={`stage-story-actor stage-story-actor--hero ${isPlayerSpeaking ? 'is-speaking' : ''}`}>
                        <div className="stage-story-actor-sprite">
                            <WizardSprite state="idle" size="lg" character="hero" showParticles={false} showShadow showGlow />
                        </div>
                        <div className="stage-npc-name-tag">
                            <span className="stage-npc-name">{playerName}</span>
                            <span className="stage-npc-title">{isThai ? 'ผู้ถือครองตำรา' : 'Grimoire Bearer'}</span>
                        </div>
                    </div>
                    <div className={`stage-story-actor stage-story-actor--npc ${!isPlayerSpeaking ? 'is-speaking' : ''}`}>
                        <div className="stage-story-actor-sprite" key={activeStoryCharacter}>
                            <WizardSprite state="idle" size="lg" character={activeStoryCharacter} showParticles={false} showShadow showGlow />
                        </div>
                        <div className="stage-npc-name-tag">
                            <span className="stage-npc-name">{activeStoryName}</span>
                            <span className="stage-npc-title">{activeStoryTitle}</span>
                        </div>
                    </div>
                </div>

                {/* Dialog Box */}
                <div className="stage-dialog-area" onClick={onDialogClick}>
                    {dialogIndex < story.dialogues.length && (
                        <div className={`stage-dialog-box ${currentDialog?.emotion || ''}`}>
                            <div className="stage-dialog-speaker">
                                <i className={STORY_ICONS[currentDialog?.speaker] || story.npcIcon}></i>
                                <span>{isPlayerSpeaking ? playerName : currentDialog?.speaker}</span>
                            </div>
                            <p className="stage-dialog-text">{displayedText}</p>
                            {!isTyping && (
                                <div className="stage-dialog-next">
                                    {dialogIndex < story.dialogues.length - 1 ? (
                                        <span>Click to continue <i className="fas fa-chevron-right"></i></span>
                                    ) : (
                                        <span>Click to proceed <i className="fas fa-chevron-right"></i></span>
                                    )}
                                </div>
                            )}
                            {isTyping && (
                                <div className="stage-dialog-typing">
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Enter Tower Button */}
                    {showEnterButton && (
                        <button className="stage-enter-btn" onClick={(e) => { e.stopPropagation(); onEnterTower(); }}>
                            <i className={story.enterButtonIcon}></i>
                            <span>{story.enterButtonText}</span>
                            <div className="stage-enter-btn-glow"></div>
                        </button>
                    )}
                </div>

                {/* Skip button */}
                <button className="stage-skip-btn" onClick={onEnterTower}>
                    Skip <i className="fas fa-forward"></i>
                </button>
            </div>
        );
}
