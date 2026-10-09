'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeRemaining(target: Date): TimeRemaining {
  const total = target.getTime() - Date.now();
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, isExpired: false };
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [time, setTime] = useState<TimeRemaining>(() => calculateTimeRemaining(targetDate));
  const prevTimeRef = useRef<TimeRemaining>(time);

  const daysRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextTime = calculateTimeRemaining(targetDate);

      // Trigger GSAP vertical slide/flip animation on digit change
      if (nextTime.seconds !== prevTimeRef.current.seconds && secondsRef.current) {
        animateDigit(secondsRef.current);
      }
      if (nextTime.minutes !== prevTimeRef.current.minutes && minutesRef.current) {
        animateDigit(minutesRef.current);
      }
      if (nextTime.hours !== prevTimeRef.current.hours && hoursRef.current) {
        animateDigit(hoursRef.current);
      }
      if (nextTime.days !== prevTimeRef.current.days && daysRef.current) {
        animateDigit(daysRef.current);
      }

      prevTimeRef.current = nextTime;
      setTime(nextTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const animateDigit = (el: HTMLElement) => {
    gsap.fromTo(
      el,
      { y: -25, opacity: 0.2, rotateX: -30 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.45, ease: 'back.out(2)' }
    );
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  if (time.isExpired) {
    return (
      <div className="countdown-expired-container">
        <div className="pirate-crest">☠ ⚓ ☠</div>
        <h2 className="landed-title">WE HAVE LANDED</h2>
        <p className="landed-subtitle">THE SHORES OF TREASURE HAVE BEEN REACHED</p>
      </div>
    );
  }

  return (
    <div className="countdown-wrapper">
      <div className="countdown-grid">
        {/* DAYS */}
        <div className="countdown-card">
          <div className="card-rivet rivet-tl"></div>
          <div className="card-rivet rivet-tr"></div>
          <div className="card-rivet rivet-bl"></div>
          <div className="card-rivet rivet-br"></div>
          <div className="card-inner">
            <div ref={daysRef} className="card-digit">
              {pad(time.days)}
            </div>
            <div className="card-label">DAYS</div>
          </div>
        </div>

        <div className="countdown-separator">:</div>

        {/* HOURS */}
        <div className="countdown-card">
          <div className="card-rivet rivet-tl"></div>
          <div className="card-rivet rivet-tr"></div>
          <div className="card-rivet rivet-bl"></div>
          <div className="card-rivet rivet-br"></div>
          <div className="card-inner">
            <div ref={hoursRef} className="card-digit">
              {pad(time.hours)}
            </div>
            <div className="card-label">HOURS</div>
          </div>
        </div>

        <div className="countdown-separator">:</div>

        {/* MINUTES */}
        <div className="countdown-card">
          <div className="card-rivet rivet-tl"></div>
          <div className="card-rivet rivet-tr"></div>
          <div className="card-rivet rivet-bl"></div>
          <div className="card-rivet rivet-br"></div>
          <div className="card-inner">
            <div ref={minutesRef} className="card-digit">
              {pad(time.minutes)}
            </div>
            <div className="card-label">MINUTES</div>
          </div>
        </div>

        <div className="countdown-separator">:</div>

        {/* SECONDS */}
        <div className="countdown-card">
          <div className="card-rivet rivet-tl"></div>
          <div className="card-rivet rivet-tr"></div>
          <div className="card-rivet rivet-bl"></div>
          <div className="card-rivet rivet-br"></div>
          <div className="card-inner">
            <div ref={secondsRef} className="card-digit">
              {pad(time.seconds)}
            </div>
            <div className="card-label">SECONDS</div>
          </div>
        </div>
      </div>
    </div>
  );
};
