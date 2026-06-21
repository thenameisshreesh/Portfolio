import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ARRAY_DATA = [
  { index: 0, key: 'Who I Am', value: 'A passionate full-stack developer and AI enthusiast from India who loves building futuristic interfaces and solving real-world problems through elegant code.', icon: '👨‍💻', color: '#00F5FF', addr: '0x100' },
  { index: 1, key: 'What I Do', value: 'I design and build end-to-end web applications — from intuitive React UIs and D3 visualizations to scalable Flask APIs backed by MongoDB. I speak the language of data structures.', icon: '⚡', color: '#8A2BE2', addr: '0x108' },
  { index: 2, key: 'My Goals', value: 'To contribute to AI-driven products, open-source impact, and eventually build tools that make complex information beautiful and accessible to everyone.', icon: '🎯', color: '#00FF9F', addr: '0x110' },
];

function colorRgb(hex) {
  if (hex === '#00F5FF') return '0,245,255';
  if (hex === '#8A2BE2') return '138,43,226';
  if (hex === '#00FF9F') return '0,255,159';
  return '0,245,255';
}

function ArrayCell({ item, isActive, isFirst, isLast, onClick }) {
  const rgb = colorRgb(item.color);
  return (
    <motion.div
      onClick={onClick}
      animate={{
        scale: isActive ? 1.05 : 1,
        y: isActive ? -10 : 0,
        zIndex: isActive ? 10 : 1,
        opacity: isActive ? 1 : 0.4,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      style={{
        width: '240px',
        flexShrink: 0,
        cursor: 'pointer',
        border: `2px solid ${isActive ? item.color : 'rgba(255,255,255,0.1)'}`,
        borderLeftWidth: isActive || isFirst ? '2px' : '0px',
        borderTopLeftRadius: isFirst || isActive ? '12px' : '0px',
        borderBottomLeftRadius: isFirst || isActive ? '12px' : '0px',
        borderTopRightRadius: isLast || isActive ? '12px' : '0px',
        borderBottomRightRadius: isLast || isActive ? '12px' : '0px',
        background: isActive ? `rgba(${rgb},0.15)` : 'rgba(255,255,255,0.02)',
        boxShadow: isActive ? `0 0 40px ${item.color}30, inset 0 0 20px ${item.color}10` : 'none',
        position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}
      whileHover={{ scale: isActive ? 1.05 : 1.02, opacity: isActive ? 1 : 0.6 }}
    >
      <div style={{
        borderBottom: `1px solid ${isActive ? item.color + '80' : 'rgba(255,255,255,0.1)'}`,
        padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: isActive ? `rgba(${rgb},0.1)` : 'transparent',
      }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.75rem', fontWeight: 800, color: isActive ? item.color : 'rgba(255,255,255,0.5)' }}>[{item.index}]</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.55rem', color: isActive ? `${item.color}90` : 'rgba(255,255,255,0.3)' }}>{item.addr}</span>
      </div>
      <div style={{ padding: '16px 14px', flex: 1 }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px', lineHeight: 1 }}>{item.icon}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isActive ? item.color : 'rgba(255,255,255,0.6)', marginBottom: '10px', textShadow: isActive ? `0 0 20px ${item.color}60` : 'none' }}>{item.key}</div>
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ fontSize: '0.8rem', color: 'rgba(232,240,255,0.75)', lineHeight: 1.6, margin: 0 }}>
              {item.value}
            </motion.p>
          )}
        </AnimatePresence>
        {!isActive && (
          <div style={{ fontSize: '0.65rem', color: 'rgba(232,240,255,0.2)', fontFamily: "'JetBrains Mono',monospace", fontStyle: 'italic', marginTop: '8px' }}>
            // click to read
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ArrayAbout() {
  const [activeIndex, setActiveIndex] = useState(0);
  const item = ARRAY_DATA[activeIndex];

  return (
    <section id="about" aria-label="About me — Array data structure" style={{ minHeight: '100vh', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', zIndex: 1, minHeight: '100dvh' }}>
        <motion.div className="ds-label" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>ARRAY — Ordered, Indexed Access</motion.div>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>About <span>Me</span></motion.h2>
        <div className="neon-divider" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '24px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', color: 'rgba(0,245,255,0.35)' }}>
          <span>about[</span><motion.span key={activeIndex} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ color: item.color, fontWeight: 700, margin: '0 2px' }}>{activeIndex}</motion.span><span>] = </span>
          <motion.span key={`key-${activeIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: item.color, marginLeft: '4px' }}>"{item.key}"</motion.span>
        </div>

        <div className="array-container" style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', paddingTop: '40px', width: '100%', maxWidth: '100vw', overflowX: 'auto', paddingBottom: '20px' }}>
          <style>{`
            @media (max-width: 768px) {
              .array-wrap { overflow-x: auto !important; -webkit-overflow-scrolling: touch; padding-bottom: 20px; }
            }
          `}</style>
          <div className="array-bracket" style={{ display: 'flex', alignItems: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(2rem, 8vw, 4rem)', color: 'rgba(0,245,255,0.2)', paddingBottom: '4px', marginRight: '4px', fontWeight: 300 }}>[</div>
          
          <div className="array-wrap" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {/* Sliding Array Pointer */}
            <motion.div
              animate={{ left: activeIndex * 240 + 120 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              style={{ position: 'absolute', top: '-36px', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 20, pointerEvents: 'none' }}
            >
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.7rem', color: '#FF00FF', fontWeight: 700, letterSpacing: '0.1em', background: 'rgba(255,0,255,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,0,255,0.3)', textShadow: '0 0 8px rgba(255,0,255,0.8)' }}>
                idx={activeIndex}
              </div>
              <motion.div animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid #FF00FF', filter: 'drop-shadow(0 0 4px rgba(255,0,255,0.8))' }} />
              </motion.div>
            </motion.div>

            {ARRAY_DATA.map((d, i) => (
              <ArrayCell 
                key={d.index} 
                item={d} 
                isActive={i === activeIndex} 
                isFirst={i === 0} 
                isLast={i === ARRAY_DATA.length - 1} 
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>

          <div className="array-bracket" style={{ display: 'flex', alignItems: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: 'clamp(2rem, 8vw, 4rem)', color: 'rgba(0,245,255,0.2)', paddingBottom: '4px', marginLeft: '4px', fontWeight: 300 }}>]</div>
        </div>
      </div>
    </section>
  );
}
