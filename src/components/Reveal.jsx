import '../styles/Reveal.css';

export default function Reveal({ titleRef, marqueeRef, subtitleRef, dividerRef, dateRef, revealRef }) {
  return (
    <div ref={revealRef} className="reveal">
      <p ref={marqueeRef} className="reveal-kicker">HOIST THE COLOURS</p>
      <h1 ref={titleRef} className="reveal-title">CSE FEST 2026</h1>
      <p ref={subtitleRef} className="reveal-subtitle">The Department of Computer Science &amp; Engineering sets sail</p>
      <div ref={dividerRef} className="reveal-divider" />
      <p ref={dateRef} className="reveal-date">COMING SOON · 23 NOVEMBER 2026</p>
    </div>
  );
}
