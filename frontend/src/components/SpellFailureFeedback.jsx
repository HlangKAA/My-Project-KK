import React from 'react';
import { spellFeedback } from './spellFeedback';
import './spellFeedback.css';

export default function SpellFailureFeedback({ failure, isThai }) {
    const feedback = spellFeedback(failure, isThai);
    if (!feedback) return null;

    return (
        <div className="spell-failure-feedback" role="alert">
            <strong><i className="fas fa-compass" aria-hidden="true" /> {feedback.heading}</strong>
            <p>{feedback.observed}</p>
            <p><b>{feedback.next}</b> {feedback.nextStep}</p>
        </div>
    );
}
