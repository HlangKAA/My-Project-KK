/*  ═══════════════════════════════════════════════════
    NPCDialog — NPC dialog overlay for game world
    ═══════════════════════════════════════════════════ */

import React, { useState, useEffect, useRef } from 'react';
import './NPCDialog.css';

export default function NPCDialog({ entity, dialog, onComplete }) {
    const [dialogIndex, setDialogIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const typingRef = useRef(null);

    const currentDialog = dialog?.[dialogIndex];

    // ─── Typewriter effect ───
    useEffect(() => {
        if (!currentDialog) return;

        const fullText = currentDialog.text;
        let charIndex = 0;
        setDisplayedText('');
        setIsTyping(true);

        if (typingRef.current) clearInterval(typingRef.current);

        typingRef.current = setInterval(() => {
            charIndex++;
            setDisplayedText(fullText.slice(0, charIndex));
            if (charIndex >= fullText.length) {
                clearInterval(typingRef.current);
                setIsTyping(false);
            }
        }, 25);

        return () => {
            if (typingRef.current) clearInterval(typingRef.current);
        };
    }, [dialogIndex, currentDialog]);

    // ─── Handle click / space to advance ───
    const handleAdvance = () => {
        if (isTyping) {
            // Skip typewriter — show full text
            if (typingRef.current) clearInterval(typingRef.current);
            setDisplayedText(currentDialog.text);
            setIsTyping(false);
        } else if (dialogIndex < dialog.length - 1) {
            setDialogIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    // Keyboard support
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleAdvance();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onComplete();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isTyping, dialogIndex]);

    if (!dialog || dialog.length === 0) return null;

    return (
        <div className="npcd-overlay" onClick={handleAdvance}>
            <div className="npcd-box">
                {/* NPC info */}
                <div className="npcd-speaker">
                    <i className={entity.icon || 'fas fa-user'} style={{ color: entity.spriteColor || '#7c3aed' }} />
                    <div className="npcd-speaker-info">
                        <span className="npcd-speaker-name">{currentDialog?.speaker || entity.name}</span>
                        {entity.title && <span className="npcd-speaker-title">{entity.title}</span>}
                    </div>
                </div>

                {/* Dialog text */}
                <p className="npcd-text">{displayedText}</p>

                {/* Next indicator */}
                <div className="npcd-footer">
                    {isTyping ? (
                        <div className="npcd-typing">
                            <span className="npcd-dot" /><span className="npcd-dot" /><span className="npcd-dot" />
                        </div>
                    ) : dialogIndex < dialog.length - 1 ? (
                        <span className="npcd-next">Click to continue <i className="fas fa-chevron-right" /></span>
                    ) : (
                        <span className="npcd-next npcd-final">Click to proceed <i className="fas fa-chevron-right" /></span>
                    )}
                    <span className="npcd-counter">{dialogIndex + 1} / {dialog.length}</span>
                </div>
            </div>
        </div>
    );
}
