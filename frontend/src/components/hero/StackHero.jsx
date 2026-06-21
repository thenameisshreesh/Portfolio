import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const CARDS = [
  { id: 'card-2', index: 0, content: 'AI + Futuristic UI Builder', sub: 'Crafting interfaces from the future', color: '#00FF9F', op: 'stack.pop() → "passion"', addr: '0xFF02' },
  { id: 'card-1', index: 1, content: 'Full Stack Developer', sub: 'React · Flask · MongoDB · D3.js', color: '#8A2BE2', op: 'stack.pop() → "role"', addr: '0xFF03' },
  { id: 'card-0', index: 2, content: "Hi, I'm Shreesh", sub: 'Welcome to my portfolio', color: '#00F5FF', op: 'stack.pop() → "greeting"', addr: '0xFF04' },
];

function colorRgb(hex) {
  if (hex === '#00F5FF') return '0,245,255';
  if (hex === '#8A2BE2') return '138,43,226';
  if (hex === '#00FF9F') return '0,255,159';
  return '0,245,255';
}

function StackVisual({ poppedCount }) {
  const displayCards = CARDS.slice(0, CARDS.length - poppedCount);
  return (
    <div style={{ width: '240px', flexShrink: 0 }}>
      <div style={{ textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.52rem', color: 'rgba(0,245,255,0.5)', letterSpacing: '0.14em', marginBottom: '6px' }}>
        ↑ OPEN TOP — pop / push
      </div>
      <div style={{
        position: 'relative',
        borderLeft: '3px solid rgba(0,245,255,0.55)',
        borderRight: '3px solid rgba(0,245,255,0.55)',
        borderBottom: '3px solid rgba(0,245,255,0.65)',
        borderRadius: '0 0 16px 16px',
        background: 'linear-gradient(180deg,rgba(0,245,255,0.015),rgba(0,245,255,0.055))',
        minHeight: '240px',
        display: 'flex', flexDirection: 'column-reverse', justifyContent: 'flex-start',
        padding: '10px 10px 12px', gap: '6px',
        boxShadow: 'inset 0 -30px 60px rgba(0,245,255,0.04),0 0 40px rgba(0,245,255,0.08)',
      }}>
        <div style={{ position: 'absolute', left: '-42px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.42rem', color: 'rgba(0,245,255,0.22)', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>STACK MEMORY</div>
        {displayCards.length > 0 && (
          <div style={{ position: 'absolute', right: '-76px', top: '10px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.46rem', color: '#00FF9F', whiteSpace: 'nowrap' }}>
            SP→ <span style={{ color: 'rgba(0,255,159,0.6)' }}>{CARDS[displayCards.length - 1]?.addr}</span>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,transparent,rgba(0,245,255,0.7),transparent)', borderRadius: '0 0 14px 14px' }} />
        <AnimatePresence>
          {displayCards.map((card, i) => {
            const isTop = i === displayCards.length - 1;
            return (
              <motion.div key={card.id}
                initial={{ opacity: 0, y: -80, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -160, x: -160, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                style={{
                  background: isTop ? `rgba(${colorRgb(card.color)},0.12)` : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${isTop ? card.color + 'aa' : card.color + '30'}`,
                  borderRadius: '8px', padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  boxShadow: isTop ? `0 0 20px ${card.color}30` : 'none',
                  transition: 'all 0.4s ease',
                  zIndex: isTop ? 10 : 1,
                }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', color: card.color, opacity: 0.7, minWidth: '28px', textAlign: 'center' }}>[{card.index}]</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isTop ? card.color : '#E8F0FF', textShadow: isTop ? `0 0 12px ${card.color}80` : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.content}</div>
                  <div style={{ fontSize: '0.55rem', color: 'rgba(232,240,255,0.3)', fontFamily: "'JetBrains Mono',monospace", marginTop: '2px' }}>{card.addr}</div>
                </div>
                {isTop && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.45rem', color: '#00FF9F', background: 'rgba(0,255,159,0.1)', border: '1px solid rgba(0,255,159,0.35)', borderRadius: '999px', padding: '2px 7px', whiteSpace: 'nowrap', flexShrink: 0 }}>TOP</div>}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {displayCards.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', color: 'rgba(0,245,255,0.25)', padding: '40px 0', fontStyle: 'italic' }}>
            stack.isEmpty() = true
          </motion.div>
        )}
      </div>
      <div style={{ marginTop: '10px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', color: 'rgba(0,245,255,0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#00FF9F' }}>peek() →</span>
        <span style={{ color: 'rgba(232,240,255,0.5)' }}>{displayCards.length > 0 ? `"${displayCards[displayCards.length - 1].content}"` : 'StackUnderflowError'}</span>
      </div>
    </div>
  );
}

function PoppedPanel({ poppedCount }) {
  // Cards pop in LIFO order: card-0 first, then card-1, then card-2
  const popped = [];
  if (poppedCount >= 1) popped.push(CARDS[2]);
  if (poppedCount >= 2) popped.push(CARDS[1]);
  if (poppedCount >= 3) popped.push(CARDS[0]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px', paddingRight: '16px', minWidth: 0 }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.52rem', color: 'rgba(0,245,255,0.35)', letterSpacing: '0.14em', marginBottom: '2px' }}>← POPPED ELEMENTS</div>
      <AnimatePresence mode="popLayout">
        {popped.map((card, i) => (
          <motion.div key={card.id}
            initial={{ x: 260, y: -200, opacity: 0, scale: 0.5, rotateZ: 10 }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1, rotateZ: 0 }}
            exit={{ x: 260, y: -200, opacity: 0, scale: 0.5, rotateZ: 10 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            style={{
              background: `rgba(${colorRgb(card.color)},0.08)`,
              border: `2px solid ${card.color}`,
              borderRadius: '14px', padding: '16px 20px',
              boxShadow: `0 0 36px ${card.color}28,0 8px 24px rgba(0,0,0,0.3)`,
              position: 'relative',
              transformOrigin: 'top right',
            }}>
            <div style={{ position: 'absolute', top: '-11px', left: '16px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.48rem', color: card.color, background: '#0B0F19', padding: '2px 10px', border: `1px solid ${card.color}60`, borderRadius: '999px', letterSpacing: '0.12em', fontWeight: 700 }}>{card.op}</div>
            <div style={{ fontSize: 'clamp(0.95rem,2.2vw,1.4rem)', fontWeight: 800, color: '#E8F0FF', textShadow: `0 0 18px ${card.color}60`, marginBottom: '5px' }}>{card.content}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(232,240,255,0.5)', fontFamily: "'JetBrains Mono',monospace" }}>{card.sub}</div>
          </motion.div>
        ))}
      </AnimatePresence>
      {poppedCount === 0 && (
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', color: 'rgba(232,240,255,0.12)', fontStyle: 'italic' }}>// elements will appear here…</div>
      )}
    </div>
  );
}

export default function StackHero() {
  const [poppedCount, setPoppedCount] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.4 }); // Trigger when 40% of section is visible

  useEffect(() => {
    if (isInView) {
      const t1 = setTimeout(() => setPoppedCount(1), 1600); // Increased delay
      const t2 = setTimeout(() => setPoppedCount(2), 2400); // Increased delay
      const t3 = setTimeout(() => setPoppedCount(3), 3200); // Increased delay
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else {
      setPoppedCount(0); // Reset stack when scrolled out of view
    }
  }, [isInView]);

  return (
    <section id="hero" ref={containerRef} aria-label="Introduction — Stack data structure" style={{ minHeight: '100vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 16px', overflow: 'hidden', zIndex: 1 }} className="hero-container">
        <style>{`
          @media (min-width: 481px) {
            .hero-container { padding: 20px 60px !important; }
          }
          @media (max-width: 640px) {
            .hero-stack-row { flex-direction: column !important; gap: 20px !important; }
            .hero-stack-row .popped-panel { padding-right: 0 !important; }
            .hero-stack-row .arrow-col { flex-direction: row !important; }
            .hero-stack-row .arrow-col .pop-label { writing-mode: horizontal-tb !important; transform: none !important; }
            .hero-stack-row .arrow-col .pop-arrow { transform: rotate(90deg) !important; }
          }
        `}</style>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="ds-label" aria-label="Data structure: Stack — Last In, First Out">
          STACK — Last In, First Out
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.68rem', color: 'rgba(0,245,255,0.4)', marginBottom: '24px', letterSpacing: '0.1em' }}>
          Loading portfolio… stack.pop() × 3
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 24 }}
          style={{ display: 'flex', alignItems: 'center', gap: '36px', width: '100%', maxWidth: '800px' }}
          className="hero-stack-row">
          <PoppedPanel poppedCount={poppedCount} />
          <div className="arrow-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <motion.div className="pop-arrow" animate={{ x: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }} style={{ fontSize: '1.2rem', color: 'rgba(0,245,255,0.5)' }}>←</motion.div>
            <div className="pop-label" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.46rem', color: 'rgba(0,245,255,0.25)', letterSpacing: '0.1em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>pop()</div>
          </div>
          <StackVisual poppedCount={poppedCount} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6 }} style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#projects" className="btn-glow" id="hero-cta-projects">View Projects</a>
          <a href="#contact" id="hero-cta-contact"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 28px', borderRadius: '999px', border: '1px solid rgba(232,240,255,0.15)', background: 'transparent', color: 'rgba(232,240,255,0.7)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s ease' }}
            onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(0,245,255,0.4)'; e.currentTarget.style.color = '#00F5FF'; }}
            onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(232,240,255,0.15)'; e.currentTarget.style.color = 'rgba(232,240,255,0.7)'; }}>
            Contact Me
          </a>
        </motion.div>
      </div>
    </section>
  );
}
