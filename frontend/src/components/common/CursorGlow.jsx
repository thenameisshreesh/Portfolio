import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Don't show custom cursor on touch devices
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot = dotRef.current;
    const ring_ = ringRef.current;
    let animId;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12);
      ring_.style.left = `${ring.current.x}px`;
      ring_.style.top = `${ring.current.y}px`;
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  const base = {
    position: 'fixed',
    pointerEvents: 'none',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
  };

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          ...base,
          width: '8px',
          height: '8px',
          background: '#00F5FF',
          boxShadow: '0 0 10px #00F5FF, 0 0 20px #00F5FF',
          transition: 'background 0.2s',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          ...base,
          width: '36px',
          height: '36px',
          border: '1.5px solid rgba(0, 245, 255, 0.5)',
          boxShadow: '0 0 12px rgba(0, 245, 255, 0.2)',
        }}
      />
    </>
  );
}
