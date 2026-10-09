import { useRef } from 'react';
import { gsap, useGSAP } from './gsapSetup';
import Background from './components/Background';
import Countdown from './components/Countdown';
import Reveal from './components/Reveal';
import SkipButton from './components/SkipButton';
import Stage from './components/Stage';
import { useLightning } from './hooks/useLightning';
import './styles/App.css';

const SKULL_PATH = 'M83 138L115 94L145 72L214 72L246 94L277 138L286 192L258 240L214 271L146 271L112 240L84 192Z';
const GUN_BODY = 'M80 199L155 175L239 175L277 192L285 214L261 236L119 236L80 199Z';
const CHEST_BASE = 'M95 194L265 194L282 239L78 239Z';
const CHEST_LID = 'M78 180L282 180L268 202L92 202Z';

export default function App() {
  const appRef = useRef(null);
  const stageRef = useRef(null);
  const skullRef = useRef(null);
  const gunRef = useRef(null);
  const chestRef = useRef(null);
  const revealRef = useRef(null);
  const titleRef = useRef(null);
  const marqueeRef = useRef(null);
  const subtitleRef = useRef(null);
  const dividerRef = useRef(null);
  const dateRef = useRef(null);
  const timelineRef = useRef(null);
  const { flashRef, boltRef, strike } = useLightning();

  useGSAP(() => {
    const root = appRef.current;
    const skullPath = skullRef.current?.querySelector('.scene-main');
    const gunBody = gunRef.current?.querySelector('.gun-body-shape');
    const chestBase = chestRef.current?.querySelector('.chest-base');
    const chestLid = chestRef.current?.querySelector('.chest-lid');
    const lock = chestRef.current?.querySelector('.chest-lock');
    const coinNodes = chestRef.current?.querySelectorAll('.coin');
    const rays = chestRef.current?.querySelector('.chest-rays');
    const skullCutlasses = skullRef.current?.querySelector('.cutlasses');
    const gunEngravings = gunRef.current?.querySelectorAll('.gun-engraving');
    const skullOutline = skullRef.current?.querySelectorAll('.scene-outline');
    const skullMain = skullRef.current?.querySelector('.scene-main');
    const gunForm = gunRef.current?.querySelectorAll('.gun-form');
    const gunBodyShape = gunRef.current?.querySelector('.gun-body-shape');
    const muzzleFlash = gunRef.current?.querySelector('.muzzle-flash');
    const shockwave = gunRef.current?.querySelector('.shockwave');

    const master = gsap.timeline({
      defaults: { duration: 0.9, ease: 'power3.out', force3D: true },
      onStart: () => {
        gsap.set(root, { autoAlpha: 1 });
      },
    });

    timelineRef.current = master;

    master
      // Skull: draw outline, reveal fills, then idle motion.
      .addLabel('skull')
      .set([skullOutline, skullCutlasses], { drawSVG: '0% 0%', opacity: 1 })
      .to(skullOutline, { drawSVG: '0% 100%', duration: 1.5, stagger: 0.04, ease: 'power1.inOut' })
      .to(skullMain, { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.4')
      .to(skullPath, { opacity: 1, duration: 0.3 }, '-=0.2')
      .to('.eye', { scaleY: 1.15, repeat: -1, yoyo: true, duration: 0.3, stagger: 0.12, ease: 'power1.inOut' }, '-=0.2')
      .to('.jaw-group', { yPercent: 2, repeat: -1, yoyo: true, duration: 1.5, ease: 'sine.inOut' }, '-=0.2')

      // Skull morphs into the gun. The path array is simplified to keep the morph stable.
      .addLabel('gun')
      .call(() => strike({ x: 55, y: 45 }))
      .to(skullRef.current, { scale: 0.9, x: -18, y: 8, duration: 0.7, ease: 'power2.inOut' }, 'gun')
      .to(gunRef.current, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' }, 'gun')
      .to(gunBodyShape, { morphSVG: GUN_BODY, duration: 1, ease: 'power2.inOut', shapeIndex: 0, origin: '50% 50%' }, 'gun')
      .to(skullPath, { morphSVG: GUN_BODY, duration: 1, ease: 'power2.inOut', shapeIndex: 0, origin: '50% 50%' }, 'gun')
      .to(gunForm, { drawSVG: '0% 100%', duration: 0.9, stagger: 0.07, ease: 'power1.out' }, 'gun+=0.25')
      .to(gunEngravings, { drawSVG: '0% 100%', duration: 0.8, stagger: 0.08, ease: 'power1.out' }, 'gun+=0.6')

      // Gun fires: recoil, flash, shockwave, then move to the chest.
      .addLabel('fire')
      .to(gunRef.current, { x: 12, y: 10, duration: 0.12, ease: 'power2.out' })
      .to(gunRef.current, { x: 0, y: 0, duration: 0.25, ease: 'back.out(1.5)' })
      .to(muzzleFlash, { opacity: 1, scale: 1.2, duration: 0.08, ease: 'none' })
      .to(muzzleFlash, { opacity: 0, scale: 1.7, duration: 0.22, ease: 'power2.in' })
      .to(shockwave, { scale: 3.5, opacity: 1, duration: 0.15, ease: 'none' })
      .to(shockwave, { scale: 5, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.1')
      .call(() => strike({ x: 72, y: 35 }))

      // Chest enters and opens with a lightning flash over the transition.
      .addLabel('chest')
      .to(gunRef.current, { opacity: 0, scale: 0.8, x: 20, duration: 0.7, ease: 'power2.in' }, 'chest')
      .to(chestRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 'chest+=0.08')
      .to(chestBase, { morphSVG: CHEST_BASE, duration: 0.95, ease: 'power2.inOut', origin: '50% 50%' }, 'chest+=0.15')
      .to(chestLid, { morphSVG: CHEST_LID, duration: 0.95, ease: 'power2.inOut', origin: '50% 50%' }, 'chest+=0.15')
      .to(lock, { y: -10, scale: 1.2, opacity: 0, duration: 0.3, ease: 'back.in(2)' }, 'chest+=0.55')
      .to(chestRef.current, { x: 2, rotation: 1.6, duration: 0.08, repeat: 6, yoyo: true, ease: 'power1.inOut' }, 'chest+=0.5')
      .to('.chest-lid-group', { rotation: -118, transformOrigin: '50% 100%', duration: 1.2, ease: 'back.out(1.2)' }, 'chest+=0.75')
      .to('.chest-ray', { opacity: 1, duration: 0.3, stagger: 0.04 }, 'chest+=0.8')
      .to(rays, { rotation: 360, duration: 8, repeat: -1, ease: 'none', transformOrigin: '50% 50%' }, 'chest+=0.8')
      .to(coinNodes, { opacity: 1, y: -25, stagger: 0.08, duration: 0.5, ease: 'back.out(1.8)' }, 'chest+=1.1')
      .to('.chest-glow', { scale: 1.15, opacity: 0.8, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut' }, 'chest+=1.2')

      // Final reveal: text and timer appear staggered.
      .addLabel('reveal')
      .to(marqueeRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 'reveal')
      .to(titleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 'reveal+=0.15')
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 'reveal+=0.35')
      .to(dividerRef.current, { scaleX: 1, duration: 0.7, ease: 'power2.out' }, 'reveal+=0.55')
      .to(dateRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 'reveal+=0.75')
      .to('.countdown-grid', { opacity: 1, duration: 0.55, ease: 'power2.out' }, 'reveal+=1.0');

    return () => master.kill();
  }, { scope: appRef });

  const skipToEnd = () => {
    if (timelineRef.current) {
      timelineRef.current.progress(1);
    }
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    gsap.set('.scene-wrap, .reveal, .countdown-grid, .scene-outline, .scene-main', { opacity: 1, scale: 1, clearProps: 'drawSVG' });
    gsap.set('.countdown-grid', { opacity: 1 });
    gsap.set('.reveal-divider', { scaleX: 1 });
  }

  return (
    <div ref={appRef} className="app-shell">
      <Background flashRef={flashRef} boltRef={boltRef} strike={strike} />
      <main className="hero">
        <Stage stageRef={stageRef} skullRef={skullRef} gunRef={gunRef} chestRef={chestRef} />
        <Reveal
          titleRef={titleRef}
          marqueeRef={marqueeRef}
          subtitleRef={subtitleRef}
          dividerRef={dividerRef}
          dateRef={dateRef}
          revealRef={revealRef}
        />
        <Countdown />
      </main>
      <SkipButton onClick={skipToEnd} />
    </div>
  );
}
