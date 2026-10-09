'use client';

import React, { useState } from 'react';
import { stormAudio } from '../utils/audio';

interface SoundToggleProps {
  className?: string;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ className = '' }) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const handleToggle = () => {
    const isNowActive = stormAudio.toggleMute();
    setIsMuted(!isNowActive);
  };

  return (
    <button
      onClick={handleToggle}
      className={`sound-toggle-btn ${className}`}
      aria-label={isMuted ? 'Unmute storm audio' : 'Mute storm audio'}
      title={isMuted ? 'Unmute Thunder & Sea Audio' : 'Mute Audio'}
    >
      <span className="sound-icon">
        {isMuted ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#c9a227" opacity="0.4" />
            <line x1="23" y1="9" x2="17" y2="15" stroke="#e64c4c" strokeWidth="2.5" />
            <line x1="17" y1="9" x2="23" y2="15" stroke="#e64c4c" strokeWidth="2.5" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#c9a227" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#ffd768" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="#ffd768" />
          </svg>
        )}
      </span>
      <span className="sound-text">{isMuted ? 'SOUND OFF' : 'SOUND ON'}</span>
    </button>
  );
};
