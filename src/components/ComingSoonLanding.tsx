'use client';

import React, { useEffect, useRef, useState } from 'react';
import { registerGSAP } from '../utils/gsapPlugins';
import { MORPH_PATHS } from '../constants/paths';
import { LAUNCH_DATE, THEME } from '../constants/config';
import { CountdownTimer } from './CountdownTimer';
import { SkipButton } from './SkipButton';

interface AnimationRefs {
  lockupRef: React.RefObject<HTMLDivElement>;
  comingWordRef: React.RefObject<HTMLHeadingElement>;
  soonMorphPathRef: React.RefObject<SVGPathElement>;
  soonSvgRef: React.RefObject<SVGSVGElement>;
  leftPanelRef: React.RefObject<HTMLDivElement>;
  rightPanelRef: React.RefObject<HTMLDivElement>;
  // seamLineRef removed (yellow line eliminated)
  // oceanWrapRef removed (OceanScene replaced by video)
  countdownWrapRef: React.RefObject<HTMLDivElement>;
  skipBtnWrapRef: React.RefObject<HTMLDivElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const ComingSoonLanding: React.FC = () => {
  const [skipVisible, setSkipVisible] = useState<boolean>(true);
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Element Refs
  const lockupRef = useRef<HTMLDivElement>(null);
  const comingWordRef = useRef<HTMLHeadingElement>(null);
  const soonMorphPathRef = useRef<SVGPathElement>(null);
  const soonSvgRef = useRef<SVGSVGElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  // seamLineRef removed (yellow line eliminated)
  // oceanWrapRef removed (OceanScene replaced by video)
  const videoRef = useRef<HTMLVideoElement>(null);
  const countdownWrapRef = useRef<HTMLDivElement>(null);
  const skipBtnWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap, MorphSVGPlugin } = registerGSAP();
    if (!lockupRef.current) return;

    const refs: AnimationRefs = {
      lockupRef,
      comingWordRef,
      soonMorphPathRef,
      soonSvgRef,
      leftPanelRef,
      rightPanelRef,
      countdownWrapRef,
      skipBtnWrapRef,
      videoRef,
    };

    // Check user accessibility preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ==========================================
    // PHASE 1: INTRO (black screen)
    // ==========================================
    const createIntroPhase = (r: AnimationRefs): gsap.core.Timeline => {
      const tl = gsap.timeline({ id: 'phase1-intro' });

      // Initial element state
      gsap.set(r.comingWordRef.current, { opacity: 0, scale: 0.95 });
      gsap.set(r.soonSvgRef.current, { opacity: 0, scale: 0.95 });
      // seamLine removed – no yellow line

      tl.to(r.comingWordRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
      })
      .to(r.soonSvgRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: 'power2.out',
      }, '-=0.5');

      return tl;
    };

    // ==========================================
    // PHASE 2: SOON MORPH LOOP (logo-lockup style)
    // Order: SOON -> SKULL -> PISTOL -> CHEST -> SOON
    // Holds ~0.8s, morphs ~0.7s with power2.inOut, tiny overshoot on landing
    // ==========================================
    const createMorphPhase = (r: AnimationRefs): gsap.core.Timeline => {
      const tl = gsap.timeline({ id: 'phase2-morph' });
      const path = r.soonMorphPathRef.current;
      const svg = r.soonSvgRef.current;
      if (!path || !svg) return tl;

      const { morphHold, morphDuration } = THEME.timings;

      // Landing bump animation helper
      const landingOvershoot = () => {
        return gsap.fromTo(svg,
          { scale: 1.07 },
          { scale: 1.0, duration: 0.22, ease: 'back.out(2.5)' }
        );
      };

      // 1. Hold SOON, then morph SOON -> SKULL
      tl.to({}, { duration: morphHold })
        .to(path, {
          morphSVG: { shape: MORPH_PATHS.skull, shapeIndex: 0, type: 'rotational' },
          duration: morphDuration,
          ease: 'power2.inOut',
          onComplete: () => { landingOvershoot(); }
        })
        // 2. Hold SKULL, then morph SKULL -> CUTLASS SWORD
        .to({}, { duration: morphHold })
        .to(path, {
          morphSVG: { shape: MORPH_PATHS.sword, shapeIndex: 0, type: 'rotational' },
          duration: morphDuration,
          ease: 'power2.inOut',
          onComplete: () => { landingOvershoot(); }
        })
        // 3. Hold PISTOL, then morph PISTOL -> TREASURE CHEST
        .to({}, { duration: morphHold })
        .to(path, {
          morphSVG: { shape: MORPH_PATHS.chest, shapeIndex: 0, type: 'rotational' },
          duration: morphDuration,
          ease: 'power2.inOut',
          onComplete: () => { landingOvershoot(); }
        })
        // 4. Hold CHEST, then morph back to SOON
        .to({}, { duration: morphHold })
        .to(path, {
          morphSVG: { shape: MORPH_PATHS.soon, shapeIndex: 0, type: 'rotational' },
          duration: morphDuration,
          ease: 'power2.inOut',
          onComplete: () => { landingOvershoot(); }
        })
        .to({}, { duration: 0.4 });

      return tl;
    };

    // ==========================================
    // PHASE 3: LIFT-OFF
    // "COMING SOON" lockup moves up (y: -35vh, scale: 0.6)
    // ==========================================
    const createLiftOffPhase = (r: AnimationRefs): gsap.core.Timeline => {
      const tl = gsap.timeline({ id: 'phase3-liftoff' });

      tl.to(r.lockupRef.current, {
        y: '-35vh',
        scale: 0.62,
        duration: THEME.timings.liftOffDuration,
        ease: 'power3.inOut',
      });

      return tl;
    };

    // ==========================================
    // PHASE 4: THE SPLIT
    // Panels slide apart (power4.inOut, ~1.6s) – no seam line
    // ==========================================
    const createSplitPhase = (r: AnimationRefs): gsap.core.Timeline => {
      const tl = gsap.timeline({ id: 'phase4-split' });

      // Doors slide apart horizontally
      tl.addLabel('doorsOpen')
      .to(r.leftPanelRef.current, {
        xPercent: -100,
        duration: THEME.timings.splitDuration,
        ease: 'power4.inOut',
      }, 'doorsOpen')
      .to(r.rightPanelRef.current, {
        xPercent: 100,
        duration: THEME.timings.splitDuration,
        ease: 'power4.inOut',
      }, 'doorsOpen')
      .call(() => {
        setSkipVisible(false);
      }, undefined, 'doorsOpen+=0.6');

      return tl;
    };

    // ==========================================
    // PHASE 5: VIDEO BACKGROUND
    // Storm video fades in with subtle blur
    // ==========================================
    const createOceanPhase = (r: AnimationRefs): gsap.core.Timeline => {
      const tl = gsap.timeline({ id: 'phase5-video' });

      // Start the video playing
      if (r.videoRef.current) {
        r.videoRef.current.play().catch(() => {});
      }

      tl.fromTo(r.videoRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: 'power2.out' }
      );

      return tl;
    };

    // ==========================================
    // PHASE 6: COUNTDOWN
    // Fade/slide in under the ship
    // ==========================================
    const createCountdownPhase = (r: AnimationRefs): gsap.core.Timeline => {
      const tl = gsap.timeline({ id: 'phase6-countdown' });

      tl.fromTo(r.countdownWrapRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );

      return tl;
    };

    // ==========================================
    // MASTER TIMELINE ASSEMBLY
    // ==========================================
    const master = gsap.timeline({
      id: 'master-pirates-timeline',
      defaults: { force3D: true },
    });

    master
      .add(createIntroPhase(refs), 'intro')
      .add(createMorphPhase(refs), 'morph')
      .add(createLiftOffPhase(refs), 'lift-off')
      .add(createSplitPhase(refs), 'split')
      .add(createOceanPhase(refs), 'split+=0.2')
      .add(createCountdownPhase(refs), 'split+=0.8');

    masterTimelineRef.current = master;

    // Accessibility check: immediately finish animation if reduced motion preferred
    if (prefersReducedMotion) {
      master.progress(1);
      setSkipVisible(false);
    }

    return () => {
      master.kill();
    };
  }, []);

  const handleSkipIntro = () => {
    if (masterTimelineRef.current) {
      masterTimelineRef.current.progress(1);
      setSkipVisible(false);
    }
  };

  return (
    <main className="pirates-viewport">
      {/* Skip Button (Phases 1-4) */}
      <div ref={skipBtnWrapRef} className="fixed-skip-wrap">
        <SkipButton onSkip={handleSkipIntro} visible={skipVisible} />
      </div>

      {/* BACKGROUND: Storm Video (revealed upon split, looping with blur) */}
      <video
        ref={videoRef}
        className="storm-video-bg"
        src="/pirate-storm.mp4"
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* FOREGROUND: Split Panels (Intro & Lockup Overlay) – no seam line */}
      <div className="curtain-split-wrapper">
        <div ref={leftPanelRef} className="curtain-panel curtain-panel-left" />
        <div ref={rightPanelRef} className="curtain-panel curtain-panel-right" />
      </div>

      {/* CENTER / HEADER LOCKUP: COMING SOON */}
      <div ref={lockupRef} className="coming-soon-lockup">
        <div className="lockup-inner">
          <h1 ref={comingWordRef} className="coming-title">
            COMING
          </h1>

          {/* Morphing SOON SVG */}
          <div className="soon-svg-container">
            <svg
              ref={soonSvgRef}
              className="soon-morph-svg"
              viewBox="0 0 500 240"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Morphing pirate symbol"
            >
              <defs>
                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="glow" />
                  <feComposite in="SourceGraphic" in2="glow" operator="over" />
                </filter>
                <linearGradient id="pirateGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fff1a0" />
                  <stop offset="12%" stopColor="#f5c842" />
                  <stop offset="35%" stopColor="#d4920e" />
                  <stop offset="55%" stopColor="#b07c10" />
                  <stop offset="75%" stopColor="#8a5e08" />
                  <stop offset="100%" stopColor="#6b4706" />
                </linearGradient>
              </defs>
              <path
                ref={soonMorphPathRef}
                className="soon-morph-path"
                d={MORPH_PATHS.soon}
                fill="url(#pirateGoldGrad)"
                stroke="none"
                filter="url(#goldGlow)"
              />
            </svg>
          </div>
        </div>

        {/* Avyakt Pirate Scroll Emblem (user-provided SVG) */}
        <div className="scroll-banner-wrap">
          <img
            src="/avyakt-scroll.svg"
            alt="Avyakt"
            className="avyakt-scroll-img"
          />
        </div>
      </div>

      {/* COUNTDOWN SECTION (Positioned under the ship) */}
      <div ref={countdownWrapRef} className="countdown-section-container">
        <div className="countdown-title-bar">
          <span className="compass-icon">✦</span>
          <span className="voyage-date-label">SCHEDULED MAIDEN VOYAGE</span>
          <span className="compass-icon">✦</span>
        </div>
        <CountdownTimer targetDate={LAUNCH_DATE} />
      </div>
    </main>
  );
};
