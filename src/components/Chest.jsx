import { useRef } from 'react';
import { useGSAP } from '../gsapSetup';
import { gsap } from '../gsapSetup';
import '../styles/Chest.css';

export default function Chest({ chestRef }) {
  const lidRef = useRef(null);
  const lockRef = useRef(null);
  const raysRef = useRef(null);
  const coinsRef = useRef([]);

  useGSAP(() => {
    gsap.to('.chest-ray', {
      rotation: 360,
      repeat: -1,
      duration: 20,
      ease: 'none',
      transformOrigin: 'center center',
    });

    gsap.to('.chest-glow', {
      scale: 1.08,
      opacity: 0.9,
      repeat: -1,
      yoyo: true,
      duration: 1.4,
      ease: 'sine.inOut',
      transformOrigin: '50% 50%',
    });
  }, { scope: chestRef });

  return (
    <svg ref={chestRef} className="scene-svg chest-svg" viewBox="0 0 360 360" role="img" aria-label="Treasure chest">
      <defs>
        <linearGradient id="chestWood" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#7a4920" />
          <stop offset="25%" stopColor="#4c2e17" />
          <stop offset="50%" stopColor="#7a4920" />
          <stop offset="100%" stopColor="#2f1d10" />
        </linearGradient>
        <linearGradient id="goldFlash" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#fff7d6" />
          <stop offset="45%" stopColor="#f6d98b" />
          <stop offset="100%" stopColor="#d9a441" />
        </linearGradient>
        <radialGradient id="treasureGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(246,217,139,0.95)" />
          <stop offset="100%" stopColor="rgba(246,217,139,0)" />
        </radialGradient>
      </defs>

      <g className="chest-glow" opacity="0.2">
        <ellipse cx="180" cy="210" rx="113" ry="83" fill="url(#treasureGlow)" />
      </g>

      <g className="chest-base-group">
        <path className="scene-main chest-base" d="M95 194L265 194L281 239L78 239Z" fill="url(#chestWood)" opacity="0.9" />
        <path className="scene-outline" d="M95 194L265 194L281 239L78 239Z" />
        <path className="scene-outline" d="M84 202L275 202M93 213L267 213M105 226L254 226" />
        <path className="scene-outline" d="M106 196L106 239M153 196L153 239M200 196L200 239M247 196L247 239" />
      </g>

      <g ref={lidRef} className="chest-lid-group">
        <path className="scene-main chest-lid" d="M78 180L282 180L268 202L92 202Z" fill="url(#chestWood)" opacity="0.95" />
        <path className="scene-outline" d="M78 180L282 180L268 202L92 202Z" />
        <path className="scene-outline chest-engraving" d="M105 191L255 191M122 176L238 176" />
      </g>

      <g ref={lockRef} className="chest-lock-group">
        <path className="scene-main chest-lock" d="M166 203L194 203L198 229L162 229Z" fill="url(#goldFlash)" opacity="0.9" />
        <path className="scene-outline" d="M166 203L194 203L198 229L162 229Z" />
        <circle className="scene-outline chest-lock-ring" cx="180" cy="215" r="10" />
        <path className="scene-outline chest-lock-peg" d="M180 203V194M180 224V236" />
      </g>

      <g ref={raysRef} className="chest-rays" opacity="0">
        <path className="chest-ray" d="M180 90L184 16L196 90Z" fill="url(#goldFlash)" opacity="0.35" />
        <path className="chest-ray" d="M180 90L230 35L218 102Z" fill="url(#goldFlash)" opacity="0.25" />
        <path className="chest-ray" d="M180 90L128 35L141 102Z" fill="url(#goldFlash)" opacity="0.25" />
        <path className="chest-ray" d="M180 90L255 58L234 116Z" fill="url(#goldFlash)" opacity="0.18" />
        <path className="chest-ray" d="M180 90L105 58L126 116Z" fill="url(#goldFlash)" opacity="0.18" />
      </g>

      <g className="coin-group">
        {Array.from({ length: 8 }).map((_, index) => (
          <g key={index} ref={(element) => { coinsRef.current[index] = element; }} className="coin" opacity="0">
            <circle cx={140 + index * 18} cy={160 + (index % 2) * 12} r="9" fill="url(#goldFlash)" />
            <circle cx={140 + index * 18} cy={160 + (index % 2) * 12} r="5" fill="none" stroke="rgba(6,9,13,0.55)" strokeWidth="1" />
          </g>
        ))}
      </g>
    </svg>
  );
}
