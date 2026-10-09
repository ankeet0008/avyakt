'use client';

import React from 'react';

interface SkipButtonProps {
  onSkip: () => void;
  visible: boolean;
}

export const SkipButton: React.FC<SkipButtonProps> = ({ onSkip, visible }) => {
  return (
    <button
      onClick={onSkip}
      className={`skip-intro-btn ${visible ? 'is-visible' : 'is-hidden'}`}
      aria-label="Skip introduction animation"
      tabIndex={visible ? 0 : -1}
    >
      <span className="skip-border-deco">❖</span>
      <span className="skip-label">SKIP INTRO</span>
      <span className="skip-border-deco">❖</span>
    </button>
  );
};
