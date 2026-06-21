import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NODES = [
  { id: 'll-head', label: 'HEAD', title: 'School', sub: 'Foundation — Mathematics, Logic, C++', year: '2016–2020', color: '#00F5FF', addr: '0xA001', nextAddr: '0xA002', isHead: true },
  { id: 'll-college', label: 'node_1', title: 'College', sub: 'B.Tech CSE — DSA, OS, DBMS, Competitive Programming', year: '2020–2024', color: '#8A2BE2', addr: '0xA002', nextAddr: '0xA003' },
  { id: 'll-projects', label: 'node_2', title: 'Projects', sub: 'Full-stack apps, AI models, Open-source contributions', year: '2022–2024', color: '#00FF9F', addr: '0xA003', nextAddr: '0xA004' },
  { id: 'll-current', label: 'node_3', title: 'Now', sub: 'Building futuristic portfolios and AI-driven products', year: '2024–∞', color: '#FF9500', addr: '0xA004', nextAddr: 'NULL' },
  { id: 'll-null', label: 'NULL', title: '∅', sub: '…to be continued', year: '', color: 'rgba(232,240,255,0.2)', addr: 'NULL', nextAddr: null, isNull: true },
];

function colorRgb(hex) {
  if (hex === '#00F5FF') return '0,245,255';
  if (hex === '#8A2BE2') return '138,43,226';
  if (hex === '#00FF9F') return '0,255,159';
  if (hex === '#FF9500') return '255,149,0';
  return '232,240,255';
}

const NODE_W = 200;
const NULL_W = 100;
const ARROW_W = 52;

function LLNode({ node, isActive, isPast, onClick }) {
  const rgb = node.isNull ? '232,240,255' : colorRgb(node.color);
  const borderColor = node.isNull
    ? 'rgba(232,240,255,0.15)'
    : isActive ? node.color : `${node.color}35`;

  return (
    <motion.div
      onClick={node.isNull ? undefined : onClick}
      animate={{
        scale: isActive ? 1.08 : 0.9,
        y: isActive ? -12 : 0,
        zIndex: isActive ? 10 : 1,
        opacity: isActive ? 1 : 0.45,
      }}
      whileHover={{ scale: isActive ? 1.08 : 0.95, opacity: isActive ? 1 : 0.7 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{
        width: node.isNull ? `${NULL_W}px` : `${NODE_W}px`,
        border: `2px solid ${borderColor}`,
        borderStyle: node.isNull ? 'dashed' : 'solid',
        borderRadius: '10px',
        background: isActive
          ? `rgba(${rgb},0.12)`
          : node.isNull ? 'transparent' : 'rgba(255,255,255,0.02)',
        boxShadow: isActive ? `0 0 40px ${node.color}40, 0 0 80px ${node.color}15, 0 -8px 30px ${node.color}20` : 'none',
        transition: 'border-color 0.4s, background 0.4s, box-shadow 0.4s',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        cursor: node.isNull ? 'default' : 'pointer',
      }}
    >
      <div style={{
        padding: '5px 10px', borderBottom: `1px solid ${isActive ? node.color + '60' : node.color + '20'}`,
        background: isActive ? `rgba(${rgb},0.1)` : 'transparent',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.4s',
      }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.52rem', color: isActive ? node.color : `${node.color}55`, letterSpacing: '0.08em', fontWeight: 700 }}>
          {node.isHead ? 'HEAD' : node.isNull ? 'NULL' : node.label}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.46rem', color: isActive ? `${node.color}90` : `${node.color}30` }}>
          {node.addr}
        </span>
      </div>

      {!node.isNull ? (
        <>
          <div style={{ padding: '12px 10px 8px', borderBottom: `1px dashed ${isActive ? node.color + '40' : 'rgba(255,255,255,0.06)'}` }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.42rem', color: 'rgba(232,240,255,0.3)', marginBottom: '4px', letterSpacing: '0.1em' }}>DATA</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isActive ? node.color : `${node.color}70`, textShadow: isActive ? `0 0 14px ${node.color}` : 'none', marginBottom: '4px', transition: 'all 0.4s' }}>
              {node.title}
            </div>
            {node.year && (
              <div style={{ fontSize: '0.55rem', fontFamily: "'JetBrains Mono',monospace", color: isActive ? node.color : 'rgba(232,240,255,0.25)', marginBottom: '6px', transition: 'color 0.4s' }}>
                {node.year}
              </div>
            )}
            <AnimatePresence>
              {isActive && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(232,240,255,0.7)', lineHeight: 1.5, margin: 0 }}>{node.sub}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.42rem', color: 'rgba(232,240,255,0.3)', letterSpacing: '0.1em' }}>*next</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.48rem', color: isActive ? node.color : `${node.color}40`, transition: 'color 0.4s' }}>
                {node.nextAddr}
              </span>
              {isActive && <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 0.9 }} style={{ color: node.color, fontSize: '0.7rem' }}>→</motion.span>}
            </div>
          </div>
        </>
      ) : (
        <div style={{ padding: '20px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '4px', opacity: 0.4 }}>∅</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', color: 'rgba(232,240,255,0.2)', letterSpacing: '0.1em' }}>NULL</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.46rem', color: 'rgba(232,240,255,0.12)', marginTop: '4px', fontStyle: 'italic' }}>…to be continued</div>
        </div>
      )}
    </motion.div>
  );
}

function LLArrow({ fromNode, toNode, isActive }) {
  return (
    <motion.div animate={{ opacity: isActive ? 1 : 0.3 }} style={{ display: 'flex', alignItems: 'center', flexShrink: 0, width: `${ARROW_W}px`, position: 'relative' }}>
      <div style={{ flex: 1, height: '2px', background: isActive ? `linear-gradient(90deg, ${fromNode.color}, ${toNode.color})` : 'rgba(255,255,255,0.08)', boxShadow: isActive ? `0 0 8px ${fromNode.color}60` : 'none', transition: 'all 0.4s' }} />
      <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `8px solid ${isActive ? toNode.color + 'cc' : 'rgba(255,255,255,0.1)'}`, transition: 'border-left-color 0.4s' }} />
      {isActive && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.42rem', color: fromNode.color, whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>
          →next
        </motion.div>
      )}
    </motion.div>
  );
}

export default function LinkedListExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);

  const activeNode = NODES[activeIndex] || NODES[0];

  function nodeCenter(i) {
    let x = 0;
    for (let j = 0; j < i; j++) x += (NODES[j].isNull ? NULL_W : NODE_W) + ARROW_W;
    x += (NODES[i].isNull ? NULL_W : NODE_W) / 2;
    return x;
  }

  useEffect(() => {
    if (!listRef.current) return;
    const itemLeft = nodeCenter(activeIndex) - (NODES[activeIndex].isNull ? NULL_W : NODE_W) / 2;
    listRef.current.scrollTo({ left: itemLeft - 80, behavior: 'smooth' });
  }, [activeIndex]);

  const ptrX = nodeCenter(activeIndex);

  return (
    <section id="experience" className="section" aria-label="Experience — Linked List data structure" style={{ zIndex: 1, position: 'relative', minHeight: '100vh' }}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', width: '100%' }}>
        <motion.div className="ds-label" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>LINKED LIST — Sequential Traversal</motion.div>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>My <span>Journey</span></motion.h2>
        <div className="neon-divider" />
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ color: 'rgba(232,240,255,0.45)', fontSize: '0.82rem', fontFamily: "'JetBrains Mono',monospace", marginBottom: '40px', textAlign: 'center' }}>
          list.traverse() — Click a node to move the pointer
        </motion.p>

        <div ref={listRef} style={{ overflowX: 'auto', width: '100%', maxWidth: '1100px', paddingBottom: '20px', scrollbarWidth: 'thin', scrollBehavior: 'smooth' }}>
          <div style={{ position: 'relative', height: '70px', minWidth: 'max-content', paddingLeft: '16px' }}>
            <motion.div
              animate={{ left: ptrX }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              style={{ position: 'absolute', bottom: 0, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: '#00FF9F', letterSpacing: '0.1em', whiteSpace: 'nowrap', textShadow: '0 0 8px #00FF9F' }}>ptr</span>
                <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ color: '#00FF9F', fontSize: '0.75rem' }}>↓</motion.span>
              </div>
              <div style={{ width: '1.5px', height: '24px', background: 'linear-gradient(to bottom,#00FF9F,rgba(0,255,159,0.1))' }} />
              <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid #00FF9F', filter: 'drop-shadow(0 0 4px #00FF9F)' }} />
            </motion.div>
          </div>

          <div style={{ display: 'flex', alignItems: 'stretch', minWidth: 'max-content', paddingLeft: '16px', paddingRight: '16px', gap: 0 }}>
            {NODES.map((node, i) => {
              const isActive = i === activeIndex;
              const isPast = i < activeIndex;
              return (
                <div key={node.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <LLNode node={node} isActive={isActive} isPast={isPast} index={i} onClick={() => setActiveIndex(i)} />
                  {i < NODES.length - 1 && <LLArrow fromNode={node} toNode={NODES[i + 1]} isActive={isActive} />}
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeIndex} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} style={{ marginTop: '28px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.7rem', color: 'rgba(0,245,255,0.5)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,245,255,0.1)', borderRadius: '10px', padding: '12px 20px', maxWidth: '680px', width: '100%', marginInline: '20px' }}>
            <span style={{ color: '#00FF9F' }}>current → </span>
            <span style={{ color: activeNode.color }}>{`{`}</span>
            {` data: "${activeNode.title}"  |  *next: `}
            <span style={{ color: activeNode.color }}>{activeNode.nextAddr || 'NULL'}</span>
            {` }`}
          </motion.div>
        </AnimatePresence>

        <div style={{ marginTop: '16px', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: 'rgba(232,240,255,0.35)' }}><div style={{ width: '24px', height: '2px', background: '#00FF9F', boxShadow: '0 0 6px #00FF9F' }} />ptr (current)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: 'rgba(232,240,255,0.35)' }}><div style={{ width: '24px', height: '2px', background: 'rgba(255,255,255,0.15)' }} />→next (link)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: 'rgba(232,240,255,0.35)' }}><div style={{ width: '8px', height: '8px', border: '1.5px dashed rgba(232,240,255,0.2)', borderRadius: '2px' }} />NULL terminator</div>
        </div>
      </div>
    </section>
  );
}
