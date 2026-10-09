import { useRef } from 'react';
import { useGSAP } from '../gsapSetup';
import { gsap } from '../gsapSetup';
import '../styles/Gun.css';

export default function Gun({ gunRef }) {
  const flashRef = useRef(null);
  const ringRef = useRef(null);
  const barrelRef = useRef(null);

  useGSAP(() => {
    gsap.set('.gun-engraving', { drawSVG: '0% 0%' });
    gsap.to('.gun-engraving', {
      drawSVG: '0% 100%',
      duration: 0.8,
      stagger: 0.08,
      ease: 'power1.out',
      paused: true,
    });
  }, { scope: gunRef });

  return (
    <svg ref={gunRef} className="scene-svg gun-svg" viewBox="0 0 360 360" role="img" aria-label="Flintlock pistol">
      <defs>
        <linearGradient id="gunMetal" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#f6d98b" />
          <stop offset="25%" stopColor="#d9a441" />
          <stop offset="50%" stopColor="#8d6223" />
          <stop offset="100%" stopColor="#e9dfc7" />
        </linearGradient>
        <radialGradient id="muzzleFlash" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7d6" />
          <stop offset="35%" stopColor="#ffb65d" />
          <stop offset="100%" stopColor="#8c1d18" />
        </radialGradient>
      </defs>

      <path className="gun-body-shape" d="M82 199L157 175L242 175L278 192L286 214L259 235L120 235L82 199Z" fill="url(#gunMetal)" opacity="0.35" />
      <path className="gun-body-shape" d="M179 122L229 122L261 157L245 171L188 171L170 157L179 122Z" fill="url(#gunMetal)" opacity="0.25" />
      <path className="gun-body-shape" d="M120 187L90 216L58 225L73 246L119 237L140 206Z" fill="url(#gunMetal)" opacity="0.25" />
      <path ref={barrelRef} className="scene-main gun-barrel" d="M86 184L50 168L30 176L56 198L92 214Z" fill="url(#gunMetal)" opacity="0.4" />
      <path className="gun-form" d="M80 199L155 175L239 175L277 192L285 214L261 236L119 236L80 199Z" />
      <path className="gun-form" d="M179 122L229 122L260 157L244 171L189 171L170 157L179 122Z" />
      <path className="gun-form" d="M120 188L91 217L60 225L75 246L120 237L141 206Z" />
      <path className="gun-form" d="M150 175L174 142L197 175Z" />
      <path className="gun-engraving" d="M128 208L181 208M155 192L211 192" />
      <path className="gun-engraving" d="M122 216L149 216M152 216L181 216" />
      <path className="gun-engraving" d="M200 180L230 158L226 171L253 181M220 170L228 178L220 190" />
      <path className="gun-engraving" d="M71 206L92 209L96 225L73 227Z" />
      <path className="gun-engraving" d="M90 221L118 231L111 249L78 242Z" />

      <g ref={ringRef} className="shockwave-ring">
        <circle className="shockwave" cx="50" cy="180" r="16" fill="none" stroke="rgba(246, 217, 139, 0.72)" strokeWidth="2" />
      </g>
      <g ref={flashRef} className="muzzle-flash">
        <polygon points="22,176 53,163 49,205 10,195" fill="url(#muzzleFlash)" opacity="0.8" />
        <polygon points="22,176 40,142 74,166 53,205" fill="url(#muzzleFlash)" opacity="0.7" />
        <polygon points="22,176 34,218 8,242 6,197" fill="url(#muzzleFlash)" opacity="0.6" />
      </g>
    </svg>
  );
}
