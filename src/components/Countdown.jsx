import { useEffect, useRef } from 'react';
import { gsap } from '../gsapSetup';
import { useCountdown } from '../hooks/useCountdown';
import '../styles/Countdown.css';

function CountdownItem({ label, value, refMap }) {
  return (
    <div className="countdown-tile">
      <span className="countdown-bracket bracket-tl" />
      <span className="countdown-bracket bracket-tr" />
      <span className="countdown-bracket bracket-bl" />
      <span className="countdown-bracket bracket-br" />
      <span ref={(element) => { refMap.current[label] = element; }} className="countdown-value">
        {value}
      </span>
      <span className="countdown-label">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown();
  const valuesRef = useRef({});
  const previousRef = useRef({ days, hours, minutes, seconds });

  useEffect(() => {
    const entries = [
      ['DAYS', days],
      ['HOURS', String(hours).padStart(2, '0')],
      ['MINS', String(minutes).padStart(2, '0')],
      ['SECS', String(seconds).padStart(2, '0')],
    ];

    entries.forEach(([label, value]) => {
      const element = valuesRef.current[label];
      if (!element || previousRef.current[label] === value) return;

      gsap.fromTo(
        element,
        { yPercent: 15, rotationX: -90, opacity: 0.25 },
        {
          yPercent: 0,
          rotationX: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power3.out',
          force3D: true,
        },
      );

      previousRef.current[label] = value;
    });
  }, [days, hours, minutes, seconds]);

  return (
    <div className="countdown-grid" aria-live="polite">
      <CountdownItem label="DAYS" value={days} refMap={valuesRef} />
      <CountdownItem label="HOURS" value={String(hours).padStart(2, '0')} refMap={valuesRef} />
      <CountdownItem label="MINS" value={String(minutes).padStart(2, '0')} refMap={valuesRef} />
      <CountdownItem label="SECS" value={String(seconds).padStart(2, '0')} refMap={valuesRef} />
    </div>
  );
}
