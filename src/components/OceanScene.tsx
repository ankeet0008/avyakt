'use client';

import React, { useEffect, useRef } from 'react';
import { gsap, DrawSVGPlugin } from '../utils/gsapPlugins';
import { WAVE_PATHS, PIRATE_SHIP_SVG, LIGHTNING_PATHS } from '../constants/paths';
import { stormAudio } from '../utils/audio';

interface OceanSceneProps {
  onLightningTrigger?: () => void;
}

export const OceanScene: React.FC<OceanSceneProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<SVGSVGElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);
  const lightningPathRef = useRef<SVGPathElement>(null);
  const canvasRainRef = useRef<HTMLCanvasElement>(null);
  const wavesContainerRef = useRef<HTMLDivElement>(null);

  // Rain Canvas animation loop
  useEffect(() => {
    const canvas = canvasRainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const rainDrops: Array<{ x: number; y: number; l: number; v: number; op: number }> = [];
    const count = Math.min(180, Math.floor(width / 7));

    for (let i = 0; i < count; i++) {
      rainDrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        l: 18 + Math.random() * 26,
        v: 12 + Math.random() * 16,
        op: 0.15 + Math.random() * 0.35,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(195, 220, 255, 0.35)';

      for (let i = 0; i < rainDrops.length; i++) {
        const drop = rainDrops[i];
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 3, drop.y + drop.l);
        ctx.stroke();

        drop.y += drop.v;
        drop.x -= 1.5;

        if (drop.y > height) {
          drop.y = -drop.l;
          drop.x = Math.random() * (width + 50);
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Waves & Ship GSAP Animations & Thunder Timer
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Rocking Ship Animation (rotation +/- 3deg, y bob, yoyo: true, sine.inOut, repeat: -1)
    if (shipRef.current) {
      gsap.to(shipRef.current, {
        rotation: 3.5,
        y: -12,
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        transformOrigin: '50% 85%',
      });

      // Secondary subtle sway on sails / flag
      gsap.to('.ship-flag', {
        scaleX: 1.15,
        duration: 0.9,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut',
        transformOrigin: '0% 50%',
      });
    }

    // 2. Continuous horizontal & vertical wave looping
    const waveElements = wavesContainerRef.current?.querySelectorAll('.svg-wave-track');
    if (waveElements) {
      waveElements.forEach((wave, idx) => {
        const speed = WAVE_PATHS[idx]?.speed || (8 + idx * 3);
        // Horizontal roll
        gsap.to(wave, {
          xPercent: -50,
          duration: speed,
          repeat: -1,
          ease: 'none',
        });
        // Gentle vertical bob
        gsap.to(wave, {
          y: 8 + idx * 4,
          duration: 2.2 + idx * 0.7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }

    // 3. Lightning Strike Function
    const triggerLightning = () => {
      const flash = flashOverlayRef.current;
      const bolt = lightningPathRef.current;
      const ship = shipRef.current;
      if (!bolt || !flash) return;

      // Pick a random jagged path
      const randomIdx = Math.floor(Math.random() * LIGHTNING_PATHS.length);
      bolt.setAttribute('d', LIGHTNING_PATHS[randomIdx]);

      // Random position along upper screen (between 15% and 85%)
      const randomLeft = 15 + Math.random() * 70;
      gsap.set(bolt.parentElement, { left: `${randomLeft}%` });

      // Play procedural thunder audio
      stormAudio.playThunder();

      const strikeTl = gsap.timeline();

      // Bolt drawn with DrawSVGPlugin
      strikeTl
        .set(bolt, { opacity: 1, drawSVG: '0% 0%' })
        .to(bolt, {
          drawSVG: '0% 100%',
          duration: 0.12,
          ease: 'power2.in',
        })
        // Full screen white flash with double flicker (opacity 0 -> 0.8 -> 0 in ~0.15s)
        .to(flash, { opacity: 0.85, duration: 0.05, ease: 'none' }, 0)
        .to(flash, { opacity: 0.2, duration: 0.04, ease: 'none' }, '+=0.03')
        .to(flash, { opacity: 0.9, duration: 0.05, ease: 'none' })
        .to(flash, { opacity: 0, duration: 0.35, ease: 'power2.out' })
        // Bolt fade
        .to(bolt, { opacity: 0, duration: 0.18, ease: 'power1.out' }, '-=0.3');

      // Ship highlight during flash
      if (ship) {
        gsap.fromTo(
          ship,
          { filter: 'brightness(2.2) drop-shadow(0 0 15px rgba(244, 248, 255, 0.9))' },
          { filter: 'brightness(1) drop-shadow(0 0 0px rgba(0,0,0,0))', duration: 0.45, ease: 'power2.out' }
        );
      }
    };

    // Randomized lightning every 3 to 7 seconds
    let lightningTimeout: NodeJS.Timeout;
    const scheduleNextLightning = () => {
      const delay = (3 + Math.random() * 4) * 1000; // 3-7s
      lightningTimeout = setTimeout(() => {
        triggerLightning();
        scheduleNextLightning();
      }, delay);
    };

    // First strike after brief pause
    lightningTimeout = setTimeout(() => {
      triggerLightning();
      scheduleNextLightning();
    }, 2800);

    return () => {
      clearTimeout(lightningTimeout);
    };
  }, []);

  return (
    <div ref={containerRef} className="ocean-scene-container">
      {/* Dark Stormy Sky with Moving Dark Clouds */}
      <div className="storm-sky">
        <div className="cloud-layer cloud-layer-back"></div>
        <div className="cloud-layer cloud-layer-mid"></div>
        <div className="cloud-layer cloud-layer-front"></div>
        <div className="sky-moon-glow"></div>
      </div>

      {/* Light Rain Canvas */}
      <canvas ref={canvasRainRef} className="rain-canvas" />

      {/* Lightning Flash Fullscreen Overlay */}
      <div ref={flashOverlayRef} className="lightning-flash-overlay" />

      {/* Jagged Lightning Bolt SVG */}
      <div className="lightning-bolt-wrapper">
        <svg className="lightning-svg" viewBox="0 0 500 500" preserveAspectRatio="none">
          <path
            ref={lightningPathRef}
            className="lightning-path"
            d={LIGHTNING_PATHS[0]}
            fill="none"
            stroke="#f4f8ff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="miter"
            style={{ opacity: 0 }}
          />
        </svg>
      </div>

      {/* Pirate Ship Silhouette */}
      <div className="ship-wrapper">
        <svg
          ref={shipRef}
          className="pirate-ship-svg"
          viewBox="0 0 400 320"
          dangerouslySetInnerHTML={{ __html: PIRATE_SHIP_SVG }}
        />
      </div>

      {/* Layered Stormy Ocean Waves */}
      <div ref={wavesContainerRef} className="waves-container">
        {WAVE_PATHS.map((wave, idx) => (
          <div key={idx} className={`wave-layer wave-layer-${idx + 1}`} style={{ opacity: wave.opacity }}>
            <div className="svg-wave-track">
              {/* Double wave path for seamless infinite horizontal scroll */}
              <svg className="wave-svg" viewBox="0 0 2000 300" preserveAspectRatio="none">
                <path d={wave.d} fill={wave.fill} />
              </svg>
              <svg className="wave-svg" viewBox="0 0 2000 300" preserveAspectRatio="none">
                <path d={wave.d} fill={wave.fill} />
              </svg>
            </div>
          </div>
        ))}
        {/* Ocean Dark Depth Base Gradient */}
        <div className="ocean-abyss-gradient"></div>
      </div>
    </div>
  );
};
