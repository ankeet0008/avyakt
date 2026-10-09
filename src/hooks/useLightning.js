import { useCallback, useEffect, useRef } from 'react';
import { gsap } from '../gsapSetup';

export function useLightning() {
  const flashRef = useRef(null);
  const boltRef = useRef(null);

  const strike = useCallback(({ x = 50, y = 50, duration = 0.7 } = {}) => {
    const flash = flashRef.current;
    const bolt = boltRef.current;

    if (!flash || !bolt) return;

    gsap.fromTo(
      flash,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1.2,
        duration: duration * 0.3,
        ease: 'power3.out',
        force3D: true,
        onComplete: () => gsap.to(flash, { opacity: 0, duration: duration * 0.4, ease: 'power2.in' }),
      },
    );

    const boltX = `${x}%`;
    const boltY = `${y}%`;
    gsap.set(bolt, { xPercent: -50, yPercent: -50, left: boltX, top: boltY, opacity: 0 });
    gsap.to(bolt, {
      opacity: 1,
      duration: duration * 0.08,
      ease: 'none',
      force3D: true,
      onComplete: () => gsap.to(bolt, { opacity: 0, duration: duration * 0.25, ease: 'power2.inOut' }),
    });
  }, []);

  useEffect(() => {
    let timeoutId;
    let isCancelled = false;

    const schedule = () => {
      if (isCancelled) return;
      const delay = 6000 + Math.random() * 6000;
      timeoutId = window.setTimeout(() => {
        strike({ x: 25 + Math.random() * 50, y: 20 + Math.random() * 60 });
        schedule();
      }, delay);
    };

    schedule();

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [strike]);

  return { flashRef, boltRef, strike };
}
