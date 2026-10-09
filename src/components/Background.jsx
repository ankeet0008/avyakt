import { useEffect, useRef } from 'react';
import { gsap } from '../gsapSetup';
import { useGSAP } from '../gsapSetup';
import '../styles/Background.css';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function createRainParticles(width, height) {
  return Array.from({ length: 120 }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    length: 18 + Math.random() * 22,
    speed: 10 + Math.random() * 18,
    opacity: 0.12 + Math.random() * 0.3,
    offset: index * 0.23,
  }));
}

function createEmbers(width, height) {
  return Array.from({ length: 26 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 1 + Math.random() * 2.5,
    drift: -10 + Math.random() * 20,
    speed: 4 + Math.random() * 9,
    opacity: 0.2 + Math.random() * 0.8,
  }));
}

export default function Background({ flashRef, boltRef, strike }) {
  const canvasRef = useRef(null);
  const embersRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    const image = imageRef.current;
    const timeline = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } });
    timeline
      .fromTo(image, { scale: 1.1, x: -2, y: 1 }, { scale: 1.22, x: 4, y: -3, duration: 22 })
      .to(image, { scale: 1.15, x: -5, y: 4, duration: 18 });

    return () => timeline.kill();
  }, { scope: imageRef });

  useEffect(() => {
    const canvas = canvasRef.current;
    const embersCanvas = embersRef.current;
    if (!canvas || !embersCanvas) return;

    const context = canvas.getContext('2d');
    const emberContext = embersCanvas.getContext('2d');
    const particles = createRainParticles(canvas.width, canvas.height);
    const embers = createEmbers(embersCanvas.width, embersCanvas.height);
    let frameId;

    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        const y = (particle.y + (performance.now() * 0.06 * particle.speed + particle.offset) * 0.8) % (canvas.height + particle.length);
        context.beginPath();
        context.moveTo(particle.x, y);
        context.lineTo(particle.x - 2.5, y + particle.length);
        context.strokeStyle = `rgba(170, 225, 255, ${particle.opacity})`;
        context.lineWidth = 1;
        context.stroke();
      });

      emberContext.clearRect(0, 0, embersCanvas.width, embersCanvas.height);
      embers.forEach((ember) => {
        ember.y += ember.speed * 0.1;
        ember.x += ember.drift * 0.04;
        if (ember.y > embersCanvas.height + 8) ember.y = -8;
        if (ember.x < -8) ember.x = embersCanvas.width + 8;
        if (ember.x > embersCanvas.width + 8) ember.x = -8;

        emberContext.beginPath();
        emberContext.fillStyle = `rgba(255, 188, 96, ${ember.opacity})`;
        emberContext.arc(ember.x, ember.y, ember.radius, 0, Math.PI * 2);
        emberContext.fill();
      });

      frameId = requestAnimationFrame(render);
    };

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const { clientWidth, clientHeight } = document.documentElement;

      canvas.width = Math.max(1, Math.round(clientWidth * ratio));
      canvas.height = Math.max(1, Math.round(clientHeight * ratio));
      canvas.style.width = `${clientWidth}px`;
      canvas.style.height = `${clientHeight}px`;

      embersCanvas.width = Math.max(1, Math.round(clientWidth * ratio));
      embersCanvas.height = Math.max(1, Math.round(clientHeight * ratio));
      embersCanvas.style.width = `${clientWidth}px`;
      embersCanvas.style.height = `${clientHeight}px`;

      const rain = createRainParticles(canvas.width, canvas.height);
      const emberSet = createEmbers(embersCanvas.width, embersCanvas.height);
      particles.length = 0;
      particles.push(...rain);
      embers.length = 0;
      embers.push(...emberSet);
    };

    resize();
    render();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    let frameId;
    let lastTime = performance.now();

    const animate = (time) => {
      const delta = time - lastTime;
      lastTime = time;
      const min = clamp(0.7 - delta * 0.0005, 0.35, 0.7);
      if (flashRef.current) flashRef.current.style.opacity = `${min}`;
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [flashRef]);

  return (
    <div className="background" aria-hidden="true">
      <img ref={imageRef} className="background-image" src="/assets/background.jpg" alt="" />
      <div className="background-gradient" />
      <canvas ref={canvasRef} className="rain-canvas" />
      <canvas ref={embersRef} className="embers-canvas" />
      <div ref={flashRef} className="lightning-flash" />
      <div ref={boltRef} className="lightning-bolt" />
      <div className="vignette" />
      <button type="button" className="strike-trigger" onClick={() => strike({ x: 50, y: 50 })}>
        Lightning
      </button>
    </div>
  );
}
