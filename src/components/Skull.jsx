import { useRef } from 'react';
import { useGSAP } from '../gsapSetup';
import { gsap } from '../gsapSetup';
import '../styles/Skull.css';

export default function Skull({ skullRef }) {
  const eyeLeftRef = useRef(null);
  const eyeRightRef = useRef(null);
  const jawRef = useRef(null);

  useGSAP(() => {
    const eyes = [eyeLeftRef.current, eyeRightRef.current];
    gsap.to(eyes, {
      opacity: 0.35,
      scale: 0.95,
      repeat: -1,
      yoyo: true,
      duration: 0.18,
      stagger: 0.15,
      ease: 'power1.inOut',
    });

    gsap.to(jawRef.current, {
      yPercent: 2,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: 'sine.inOut',
      transformOrigin: '50% 25%',
    });
  }, { scope: skullRef });

  return (
    <svg ref={skullRef} className="scene-svg skull-svg" viewBox="0 0 360 360" role="img" aria-label="Animated skull">
      <defs>
        <linearGradient id="goldCol" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#fff7d6" />
          <stop offset="35%" stopColor="#f6d98b" />
          <stop offset="70%" stopColor="#d9a441" />
          <stop offset="100%" stopColor="#996d1b" />
        </linearGradient>
        <radialGradient id="emberEye" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd36b" />
          <stop offset="40%" stopColor="#f39b2f" />
          <stop offset="100%" stopColor="#8c1d18" />
        </radialGradient>
        <linearGradient id="boneFill" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#f3e9d5" />
          <stop offset="100%" stopColor="#d7c4a7" />
        </linearGradient>
      </defs>

      <path className="scene-outline" d="M83 138L115 94L145 72L214 72L246 94L277 138L286 192L258 240L214 271L146 271L112 240L84 192Z" />
      <path className="scene-outline" d="M131 97L160 88L180 86L199 88L228 97L240 110L231 122L208 131L180 140L152 131L129 122L120 110Z" />
      <path className="scene-outline" d="M105 142L133 136L146 163L118 189L96 181Z" />
      <path className="scene-outline" d="M255 142L227 136L213 163L241 189L264 181Z" />
      <path className="scene-outline" d="M116 182L80 208L95 228L134 218L143 191Z" />
      <path className="scene-outline" d="M244 182L280 208L265 228L226 218L217 191Z" />
      <path className="scene-main" d="M83 138L115 94L145 72L214 72L246 94L277 138L286 192L258 240L214 271L146 271L112 240L84 192Z" fill="url(#boneFill)" opacity="0.2" />
      <path className="scene-main" d="M131 97L160 88L180 86L199 88L228 97L240 110L231 122L208 131L180 140L152 131L129 122L120 110Z" fill="url(#boneFill)" opacity="0.25" />

      <g className="skull-hat">
        <path className="scene-outline" d="M108 96L153 48L207 48L252 96L220 111L182 114L178 109L181 106H180L161 106L154 111L140 114L108 96Z" />
        <path className="scene-outline" d="M126 104L153 78L207 78L234 104L222 124L138 124Z" />
        <path className="scene-outline" d="M153 50L180 18L207 50" />
        <path className="scene-outline" d="M166 18L180 2L194 18" />
        <path className="scene-outline" d="M148 86L118 104L136 124L154 112Z" />
        <path className="scene-outline" d="M212 86L242 104L224 124L206 112Z" />
      </g>

      <g className="cutlasses" opacity="0.75">
        <path className="scene-outline" d="M78 146L53 214L73 216L96 150Z" />
        <path className="scene-outline" d="M281 146L306 214L286 216L263 150Z" />
        <path className="scene-outline" d="M88 154L66 214L82 221L103 164Z" />
        <path className="scene-outline" d="M272 154L294 214L278 221L257 164Z" />
        <path className="scene-outline" d="M69 222L90 230L87 239L65 236Z" />
        <path className="scene-outline" d="M291 222L270 230L273 239L295 236Z" />
      </g>

      <g className="skull-eyes">
        <path ref={eyeLeftRef} className="eye" d="M122 170C139 159 154 160 160 170C154 183 139 183 122 170Z" fill="url(#emberEye)" />
        <path ref={eyeRightRef} className="eye" d="M238 170C221 159 206 160 200 170C206 183 221 183 238 170Z" fill="url(#emberEye)" />
      </g>

      <g ref={jawRef} className="jaw-group">
        <path className="scene-outline" d="M123 200L99 236L124 262L165 248L174 223L160 208Z" />
        <path className="scene-outline" d="M236 200L260 236L235 262L194 248L185 223L199 208Z" />
        <path className="scene-main" d="M139 211L158 224L175 211L188 229L170 247L158 254L146 247L128 229Z" fill="url(#boneFill)" opacity="0.3" />
        <path className="scene-outline" d="M129 225L158 236L187 225" />
      </g>

      <g className="face-details">
        <path className="scene-outline" d="M154 183L180 182L206 183" />
        <path className="scene-outline" d="M162 197L180 205L198 197" />
        <path className="scene-outline" d="M126 198L107 209L104 224" />
        <path className="scene-outline" d="M233 198L253 209L256 224" />
      </g>
    </svg>
  );
}
