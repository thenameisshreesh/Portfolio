import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import { getProjects } from '../../api/client';

const FALLBACK_PROJECTS = [
  { id: 'p1', title: 'Real-time Chat', tech: ['React', 'Flask', 'MongoDB', 'WebSocket'], color: '#FFD700', description: 'End-to-end encrypted real-time chat app with WebSocket rooms, file sharing, and online presence indicators.', github: '#', live: '#', icon: '💬' },
  { id: 'p2', title: 'Neural Art AI', tech: ['Python', 'TensorFlow', 'Flask', 'React'], color: '#00FF9F', description: 'Style transfer engine using deep CNNs. Upload any photo and transform it into artistic styles in real-time.', github: '#', live: '#', icon: '🎨' },
  { id: 'p3', title: 'AI Dashboard', tech: ['Python', 'React', 'D3.js', 'Flask', 'MongoDB'], color: '#00F5FF', description: 'Real-time ML metrics dashboard with live training curves, confusion matrices, and model comparison tools.', github: '#', live: '#', icon: '📊' },
  { id: 'p4', title: 'Smart Inventory', tech: ['React', 'Flask', 'MongoDB', 'Python'], color: '#FF6B6B', description: 'Inventory management system with barcode scanning, auto-reorder triggers, and predictive stock analytics.', github: '#', live: '#', icon: '📦' },
  { id: 'p5', title: 'DS Visualizer', tech: ['React', 'D3.js', 'Framer Motion'], color: '#8A2BE2', description: 'Interactive data structure animations — stacks, queues, trees, and graphs with step-by-step algorithm trace.', github: '#', live: '#', icon: '🌳' },
];

const EDGES = [
  [0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [2, 4], [3, 4], [0, 4],
];

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}` : '0,245,255';
}

const NODE_POSITIONS = [
  { x: -280, y: -80,  z: -60  },
  { x: -100, y: -160, z: 40   },
  { x:  100, y: -60,  z: 80   },
  { x:  260, y: -140, z: -40  },
  { x:    0, y:  140, z: -200 }, // Moved outward for more dramatic rotation
];

export default function GraphProjects() {
  const { data: apiData } = useApi(getProjects);
  
  const projects = (apiData && apiData.length) 
    ? apiData.map((p, i) => ({
        id: p._id || p.id || `p${i}`,
        title: p.title || p.name || 'Untitled Project',
        tech: Array.isArray(p.tech) ? p.tech : [],
        color: p.color || ['#00F5FF', '#00FF9F', '#FFD700', '#FF6B6B', '#8A2BE2'][i % 5],
        description: p.description || 'No description provided.',
        github: p.github || '#',
        live: p.live || '#',
        icon: p.icon || '🚀'
      }))
    : FALLBACK_PROJECTS;

  // Generate dynamic edges connecting nodes in a ring + some cross-connections
  const edges = [];
  if (projects.length > 1) {
    for (let i = 0; i < projects.length; i++) {
      edges.push([i, (i + 1) % projects.length]);
      if (projects.length > 3) {
        edges.push([i, (i + 2) % projects.length]);
      }
    }
  } else if (apiData && apiData.length === 1) {
     // Single project: no edges
  } else {
     // Fallback edges
     edges.push(...[ [0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [2, 4], [3, 4], [0, 4] ]);
  }
  
  const [activeIdx, setActiveIdx] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [angle, setAngle] = useState(0);
  
  const stageRef = useRef(null);
  const targetAngleRef = useRef(null);
  const [stageSize, setStageSize] = useState({ w: 860, h: 540 });

  useEffect(() => {
    const update = () => {
      if (stageRef.current) {
        setStageSize({ w: stageRef.current.clientWidth, h: stageRef.current.clientHeight });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Responsive node positions — scale down for smaller screens
  const responsivePositions = NODE_POSITIONS.map(p => {
    const scale = Math.min(1, Math.max(0.45, stageSize.w / 860));
    return { x: p.x * scale, y: p.y * scale, z: p.z * scale };
  });

  useEffect(() => {
    if (activeIdx !== null) {
      const p = NODE_POSITIONS[activeIdx];
      // Target angle brings the node to the front (x=0, z=max)
      targetAngleRef.current = Math.atan2(p.x, p.z);
    } else {
      targetAngleRef.current = null;
    }
  }, [activeIdx]);

  useEffect(() => {
    let raf;
    const loop = () => {
      setAngle(currentAngle => {
        if (targetAngleRef.current !== null) {
           const target = targetAngleRef.current;
           const diff = target - currentAngle;
           const normalizedDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
           return currentAngle + normalizedDiff * 0.08;
        } else {
           return currentAngle + 0.002;
        }
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cx = stageSize.w / 2;
  const cy = stageSize.h / 2;

  function isEdgeActive(ei, ej) {
    return ei === activeIdx || ej === activeIdx;
  }

  function nodeScreenPos(i) {
    const pos = NODE_POSITIONS[i % NODE_POSITIONS.length];
    const nx = pos.x * Math.cos(angle) - pos.z * Math.sin(angle);
    const nz = pos.x * Math.sin(angle) + pos.z * Math.cos(angle);
    
    const perspective = 800;
    const divisor = perspective - nz;
    const scale = divisor > 0 ? perspective / divisor : 0.01;
    
    return {
      x: cx + nx * scale * 0.7,
      y: cy + pos.y * scale * 0.65,
      scale,
      z: nz,
    };
  }

  return (
    <section id="projects" className="section" aria-label="Projects — Graph data structure" style={{ zIndex: 1, position: 'relative' }}>
      <motion.div className="ds-label" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        GRAPH — Networked Relationships
      </motion.div>
      <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
        My <span>Projects</span>
      </motion.h2>
      <div className="neon-divider" />

      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        style={{ color: 'rgba(232,240,255,0.45)', fontSize: '0.82rem', marginBottom: '32px', fontFamily: "'JetBrains Mono',monospace", textAlign: 'center' }}>
        {activeIdx !== null ? 'graph.closeNode() — Click anywhere to zoom out' : 'graph.focus(node) — Click any node to expand in 3D space'}
      </motion.p>

      {/* 3D Graph Stage */}
      <motion.div
        ref={stageRef}
        onClick={() => setActiveIdx(null)}
        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
        style={{
          width: '100%', maxWidth: '860px',
          height: 'min(540px, 55vh)',
          position: 'relative',
          perspective: '800px',
          perspectiveOrigin: '50% 50%',
          background: 'rgba(255,255,255,0.015)',
          border: '1px solid rgba(0,245,255,0.08)',
          borderRadius: '20px',
          overflow: 'hidden',
          cursor: activeIdx !== null ? 'zoom-out' : 'default',
        }}
      >
        {/* SVG for edges */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            {projects.map((p, i) => (
              <filter key={p.id} id={`edge-glow-${i}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            ))}
          </defs>
          {edges.map(([ei, ej], idx) => {
            const si = nodeScreenPos(ei);
            const sj = nodeScreenPos(ej);
            const active = isEdgeActive(ei, ej);
            const dimBoth = activeIdx !== null && !active;
            const bothColors = `${projects[ei % projects.length].color}`;
            
            return (
              <line
                key={idx}
                x1={si.x} y1={si.y} x2={sj.x} y2={sj.y}
                stroke={active ? bothColors : 'rgba(255,255,255,0.4)'}
                strokeWidth={active ? 2.5 : 1.5}
                strokeOpacity={dimBoth ? 0.1 : active ? 0.9 : 0.6}
                filter={active ? `url(#edge-glow-${ei % projects.length})` : undefined}
                style={{ transition: 'stroke-opacity 0.4s ease, stroke-width 0.4s ease' }}
              />
            );
          })}
        </svg>

        {/* 3D Nodes */}
        {projects.map((p, i) => {
          const pos = nodeScreenPos(i);
          const isExpanded = i === activeIdx;
          const isHov = hovered === i;
          const isDimmed = activeIdx !== null && activeIdx !== i;
          const rgb = hexToRgb(p.color);
          
          const STD_W = 104;
          const STD_H = 104;
          const EXP_W = Math.min(stageSize.w - 40, 560);
          const EXP_H = Math.min(stageSize.h - 40, 320);

          return (
            <motion.div
              key={p.id}
              onClick={(e) => { e.stopPropagation(); setActiveIdx(isExpanded ? null : i); }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              animate={{
                x: isExpanded ? cx - EXP_W/2 : pos.x - STD_W/2,
                y: isExpanded ? cy - EXP_H/2 : pos.y - STD_H/2,
                width: isExpanded ? EXP_W : STD_W,
                height: isExpanded ? EXP_H : STD_H,
                scale: isExpanded ? 1 : isHov ? 1.05 : pos.scale,
                zIndex: isExpanded ? 100 : Math.round(pos.z),
                opacity: isDimmed ? 0.2 : 1,
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              style={{
                position: 'absolute',
                cursor: isExpanded ? 'zoom-out' : 'pointer',
              }}
            >
              <div style={{
                width: '100%', height: '100%',
                background: isExpanded ? `rgba(11,15,25,0.85)` : `rgba(${rgb},0.07)`,
                border: `2px solid ${isExpanded || isHov ? p.color : p.color + '55'}`,
                borderRadius: isExpanded ? '24px' : '50%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: isExpanded || isHov
                  ? `0 0 40px ${p.color}50, inset 0 0 20px ${p.color}15`
                  : `0 0 15px ${p.color}20`,
                transition: 'border-radius 0.4s ease, background 0.4s ease',
                backdropFilter: 'blur(12px)',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <AnimatePresence mode="wait">
                  {!isExpanded ? (
                    <motion.div
                      key="collapsed"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}
                    >
                      <div style={{ fontSize: '1.6rem', lineHeight: 1, marginBottom: '4px' }}>{p.icon}</div>
                      <div style={{
                        fontSize: '0.65rem', fontWeight: 700,
                        color: `${p.color}ee`, textAlign: 'center',
                        lineHeight: 1.2, textShadow: `0 0 10px ${p.color}`,
                      }}>
                        {p.title}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="expanded"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: 0.15, duration: 0.3 }}
                      style={{ width: '100%', height: '100%', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                    >
                      <div style={{ position: 'absolute', top: '16px', right: '20px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: `${p.color}60`, letterSpacing: '0.1em' }}>
                        node_{p.id}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '3rem', filter: `drop-shadow(0 0 16px ${p.color}80)` }}>{p.icon}</div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: p.color, textShadow: `0 0 20px ${p.color}60`, margin: 0 }}>
                          {p.title}
                        </h3>
                      </div>
                      <p style={{ fontSize: '0.95rem', color: 'rgba(232,240,255,0.8)', lineHeight: 1.6, marginBottom: '24px', maxWidth: '460px' }}>
                        {p.description}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 'auto' }}>
                        {p.tech.map(t => (
                          <span key={t} style={{
                            background: `rgba(${rgb},0.15)`, border: `1px solid ${p.color}50`,
                            color: p.color, borderRadius: '999px', padding: '4px 14px',
                            fontSize: '0.75rem', fontFamily: "'JetBrains Mono',monospace",
                          }}>{t}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <a href={p.github || '#'} target="_blank" rel="noreferrer" className="btn-glow" onClick={e => e.stopPropagation()} style={{ fontSize: '0.85rem', padding: '8px 24px' }}>GitHub ↗</a>
                        <a href={p.live || '#'} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                          style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 24px', borderRadius: '999px', border: '1px solid rgba(232,240,255,0.2)', color: 'rgba(232,240,255,0.7)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.3s' }}>
                          Live ↗
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}

        {/* Graph label overlay */}
        <div style={{ position: 'absolute', top: '12px', left: '16px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.52rem', color: 'rgba(0,245,255,0.25)', letterSpacing: '0.1em', pointerEvents: 'none' }}>
          V={projects.length} | E={edges.length} | rotating={activeIdx === null ? 'true' : 'false'}
        </div>
      </motion.div>
    </section>
  );
}
