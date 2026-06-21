import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import * as d3 from 'd3';
import { getSkills } from '../../api/client';

const SKILL_TREE = {
  name: 'Skills',
  children: [
    { name: 'Programming', children: [
      { name: 'Python', level: 90, years: 4, icon: '' },
      { name: 'C++', level: 75, years: 3, icon: '' },
      { name: 'JavaScript', level: 88, years: 4, icon: '' },
      { name: 'TypeScript', level: 72, years: 2, icon: '' },
    ]},
    { name: 'Web', children: [
      { name: 'React', level: 90, years: 3, icon: '' },
      { name: 'Flask', level: 85, years: 3, icon: '' },
      { name: 'D3.js', level: 78, years: 2, icon: '' },
      { name: 'Framer Motion', level: 80, years: 1, icon: '' },
      { name: 'HTML/CSS', level: 92, years: 5, icon: '' },
    ]},
    { name: 'Tools & DB', children: [
      { name: 'MongoDB', level: 82, years: 3, icon: '' },
      { name: 'Git', level: 88, years: 4, icon: '' },
      { name: 'Docker', level: 65, years: 1, icon: '' },
      { name: 'TensorFlow', level: 70, years: 2, icon: '' },
    ]},
  ],
};

const CAT_COLORS = { 'Skills': '#00F5FF', 'Programming': '#8A2BE2', 'Web': '#00FF9F', 'Tools & DB': '#FF9500' };
const LEAF_COLOR = '#00F5FF';

function nodeColor(name) { return CAT_COLORS[name] || LEAF_COLOR; }
function levelLabel(l) { if (!l) return ''; if (l >= 85) return 'Expert'; if (l >= 70) return 'Advanced'; return 'Intermediate'; }

// Build explicit sequential animation steps: root → branch edges+nodes → leaf edges+nodes per branch
function buildSteps(root) {
  const steps = [];
  // Step 0: root node
  steps.push({ type: 'node', d: root, delay: 0 });

  // For each branch in order
  const branchDelay = [400, 900, 1400];
  root.children.forEach((branch, bi) => {
    // Edge from root to branch
    steps.push({ type: 'link', link: { source: root, target: branch }, delay: branchDelay[bi] });
    // Branch node appears after edge
    steps.push({ type: 'node', d: branch, delay: branchDelay[bi] + 350 });
    // Leaves of this branch
    branch.children.forEach((leaf, li) => {
      const leafBase = branchDelay[bi] + 600 + li * 200;
      steps.push({ type: 'link', link: { source: branch, target: leaf }, delay: leafBase });
      steps.push({ type: 'node', d: leaf, delay: leafBase + 220 });
    });
  });
  return steps;
}

export default function TreeSkills() {
  const svgRef = useRef(null);
  const wrapRef = useRef(null);
  const sectionRef = useRef(null);
  const timersRef = useRef([]);
  const isInView = useInView(sectionRef, { amount: 0.2 });
  
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
  const [statusText, setStatusText] = useState('Waiting for scroll…');
  const [skillTree, setSkillTree] = useState(SKILL_TREE);

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    try {
      const { data } = await getSkills();
      if (data && data.length > 0) {
        // Transform the backend data to d3 tree structure
        // Data format: [{ skills: ["A", "B"], category: "X" }, ...]
        const transformed = {
          name: 'Skills',
          children: data.map(item => ({
            name: item.category || 'Dynamic Skills',
            children: (item.skills || []).map(s => {
              if (typeof s === 'string') {
                return { name: s, level: 85, years: 1 };
              }
              return s;
            })
          }))
        };
        setSkillTree(transformed);
      }
    } catch (err) {
      console.error('Failed to fetch skills:', err);
      // Fallback to hardcoded SKILL_TREE is already set as default state
    }
  }

  useEffect(() => {
    // Clear any existing timeouts when view state changes
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (isInView) {
      buildTree();
    } else {
      // Clear SVG and status when out of view
      if (svgRef.current) d3.select(svgRef.current).selectAll('*').remove();
      setStatusText('Waiting for scroll…');
      setTooltip({ visible: false, x: 0, y: 0, content: '' });
    }

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [isInView]);

  function buildTree() {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg) return;

    const W = Math.min(wrap.clientWidth - 40, 880);
    const H = 500;

    d3.select(svg).selectAll('*').remove();
    const root = d3.hierarchy(skillTree);
    const treeLayout = d3.tree().size([W - 80, H - 120]);
    treeLayout(root);

    const svgSel = d3.select(svg).attr('width', W).attr('height', H);

    // Defs: glow filters (fixed filterUnits to prevent clipping of perfectly vertical/horizontal lines)
    const defs = svgSel.append('defs');
    Object.entries(CAT_COLORS).forEach(([name, color]) => {
      const fid = `glow-ts-${name.replace(/[^a-z0-9]/gi, '')}`;
      const f = defs.append('filter')
        .attr('id', fid)
        .attr('filterUnits', 'userSpaceOnUse')
        .attr('x', -W).attr('y', -H).attr('width', W * 3).attr('height', H * 3);
      f.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
      const fm = f.append('feMerge');
      fm.append('feMergeNode').attr('in', 'coloredBlur');
      fm.append('feMergeNode').attr('in', 'SourceGraphic');
    });
    // leaf glow
    const lf = defs.append('filter')
      .attr('id', 'glow-ts-leaf')
      .attr('filterUnits', 'userSpaceOnUse')
      .attr('x', -W).attr('y', -H).attr('width', W * 3).attr('height', H * 3);
    lf.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur');
    const lfm = lf.append('feMerge');
    lfm.append('feMergeNode').attr('in', 'coloredBlur');
    lfm.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svgSel.append('g').attr('transform', 'translate(40, 60)');

    const steps = buildSteps(root);

    setStatusText('Generating skill tree…');

    steps.forEach((step) => {
      if (step.type === 'link') {
        const link = step.link;
        const color = nodeColor(link.source.data.name);
        
        const tid = setTimeout(() => {
          const pathEl = g.append('path')
            .attr('fill', 'none')
            .attr('stroke', color)
            .attr('stroke-width', link.source.depth === 0 ? 2.2 : 1.6)
            .attr('stroke-opacity', 0.5)
            .attr('filter', `url(#glow-ts-${color === LEAF_COLOR ? 'leaf' : link.source.data.name.replace(/[^a-z0-9]/gi, '')})`)
            .attr('d', d3.linkVertical().x(d => d.x).y(d => d.y)(link));

          const length = pathEl.node().getTotalLength();
          pathEl
            .attr('stroke-dasharray', `${length} ${length}`)
            .attr('stroke-dashoffset', length)
            .transition().duration(350).ease(d3.easeCubicOut)
            .attr('stroke-dashoffset', 0);
        }, step.delay);
        timersRef.current.push(tid);
        
      } else {
        // node
        const d = step.d;
        const color = nodeColor(d.data.name);
        const r = d.depth === 0 ? 20 : d.depth === 1 ? 14 : 9;
        const filterId = CAT_COLORS[d.data.name]
          ? `glow-ts-${d.data.name.replace(/[^a-z0-9]/gi, '')}`
          : 'glow-ts-leaf';

        const tid = setTimeout(() => {
          const nodeG = g.append('g')
            .attr('transform', `translate(${d.x},${d.y})`)
            .style('opacity', 0)
            .style('cursor', 'pointer');

          // Pulse ring (appears first, then fades)
          nodeG.append('circle')
            .attr('r', r + 10)
            .attr('fill', 'none')
            .attr('stroke', color)
            .attr('stroke-width', 1)
            .attr('stroke-opacity', 0.5)
            .transition().duration(600).ease(d3.easeCubicOut)
            .attr('r', r + 20)
            .attr('stroke-opacity', 0)
            .remove();

          // Main circle or Icon
          if (!d.children && d.data.icon) {
            // Render user-provided image icon
            nodeG.append('image')
              .attr('href', d.data.icon)
              .attr('x', -r)
              .attr('y', -r)
              .attr('width', r * 2)
              .attr('height', r * 2)
              .attr('opacity', 0)
              .transition().duration(400).ease(d3.easeBackOut.overshoot(1.8))
              .attr('opacity', 1);
              
            // Add a subtle border behind the icon
            nodeG.append('circle')
              .attr('r', r)
              .attr('fill', 'none')
              .attr('stroke', color)
              .attr('stroke-width', 1)
              .attr('stroke-opacity', 0.3)
              .attr('filter', `url(#${filterId})`);
          } else {
            // Standard circle
            nodeG.append('circle')
              .attr('r', 0)
              .attr('fill', `${color}20`)
              .attr('stroke', color)
              .attr('stroke-width', d.depth === 0 ? 2.5 : 1.8)
              .attr('filter', `url(#${filterId})`)
              .transition().duration(400).ease(d3.easeBackOut.overshoot(1.8))
              .attr('r', r);
          }

          // Outer glow ring for root/branches
          if (d.depth <= 1) {
            nodeG.append('circle')
              .attr('r', r + 7)
              .attr('fill', 'none')
              .attr('stroke', color)
              .attr('stroke-width', 0.8)
              .attr('stroke-opacity', 0)
              .transition().delay(200).duration(400)
              .attr('stroke-opacity', 0.2);
          }

          // Label
          nodeG.append('text')
            .attr('dy', d.children ? -r - 8 : r + 15)
            .attr('text-anchor', 'middle')
            .attr('fill', color)
            .attr('font-size', d.depth === 0 ? '13px' : d.depth === 1 ? '11px' : '9px')
            .attr('font-family', "'Outfit', sans-serif")
            .attr('font-weight', d.depth <= 1 ? 700 : 500)
            .attr('opacity', 0)
            .text(d.data.name)
            .transition().delay(200).duration(300)
            .attr('opacity', 1);

          // Skill arc on leaves
          if (!d.children && d.data.level) {
            const circ = 2 * Math.PI * (r + 4);
            const arcLen = (d.data.level / 100) * circ;
            nodeG.append('circle')
              .attr('r', r + 4)
              .attr('fill', 'none')
              .attr('stroke', color)
              .attr('stroke-width', 1.8)
              .attr('stroke-opacity', 0)
              .attr('stroke-dasharray', `0 ${circ}`)
              .attr('transform', 'rotate(-90)')
              .transition().delay(350).duration(600).ease(d3.easeCubicOut)
              .attr('stroke-opacity', 0.65)
              .attr('stroke-dasharray', `${arcLen} ${circ}`);
          }

          // Mouse events
          nodeG.select(d.data.icon && !d.children ? 'image' : 'circle').on('mouseover', function (event) {
            const content = d.data.level
              ? `${d.data.name}  ·  ${levelLabel(d.data.level)}  ·  ${d.data.level}%  ·  ${d.data.years}yr`
              : d.data.name;
            setTooltip({ visible: true, x: event.pageX, y: event.pageY, content });
          }).on('mousemove', function (event) {
            setTooltip(prev => ({ ...prev, x: event.pageX, y: event.pageY }));
          }).on('mouseout', function () {
            setTooltip(prev => ({ ...prev, visible: false }));
          });

          nodeG.transition().duration(50).style('opacity', 1);

          if (d.data.name === 'Skills') setStatusText('root: Skills');
          else if (d.depth === 1) setStatusText(`branch: ${d.data.name}`);
          else if (!d.children) setStatusText(`leaf: ${d.data.name} (${d.data.level}%)`);
        }, step.delay);
        timersRef.current.push(tid);
      }
    });

    // Mark complete after last step
    const lastDelay = steps[steps.length - 1]?.delay || 0;
    const completeTid = setTimeout(() => setStatusText('tree.build() complete ✓'), lastDelay + 600);
    timersRef.current.push(completeTid);
  }

  return (
    <section id="skills" ref={sectionRef} className="section" aria-label="Skills — Tree data structure" style={{ zIndex: 1, position: 'relative' }}>
      <motion.div className="ds-label" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        TREE — Hierarchical Structure
      </motion.div>
      <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
        My <span>Skills</span>
      </motion.h2>
      <div className="neon-divider" />

      {/* Live status ticker */}
      <motion.div
        key={statusText}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: "'JetBrains Mono',monospace", fontSize: '0.68rem',
          color: 'rgba(0,245,255,0.55)', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center',
        }}
      >
        <span style={{ color: '#00FF9F' }}>▶</span>
        {statusText}
      </motion.div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.entries(CAT_COLORS).map(([name, color]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
            <span style={{ fontSize: '0.72rem', color: 'rgba(232,240,255,0.5)', fontFamily: "'JetBrains Mono',monospace" }}>{name}</span>
          </div>
        ))}
      </div>

      {/* SVG Tree */}
      <div
        ref={wrapRef}
        style={{ width: '100%', maxWidth: '920px', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(0,245,255,0.07)', borderRadius: '20px', padding: '24px', overflowX: 'auto', opacity: isInView ? 1 : 0, transition: 'opacity 0.4s ease' }}
        role="img" aria-label="Skills tree visualization"
      >
        <svg ref={svgRef} style={{ display: 'block', margin: '0 auto' }} />
      </div>

      <div style={{ marginTop: '12px', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', color: 'rgba(0,245,255,0.3)', textAlign: 'center' }}>
        Hover nodes to see skill depth
      </div>

      {tooltip.visible && (
        <div role="tooltip" style={{
          position: 'fixed', left: tooltip.x + 16, top: tooltip.y - 16,
          background: 'rgba(11,15,25,0.95)', border: '1px solid rgba(0,245,255,0.3)',
          borderRadius: '10px', padding: '8px 14px', color: '#E8F0FF',
          fontSize: '0.78rem', fontFamily: "'JetBrains Mono',monospace",
          pointerEvents: 'none', zIndex: 2000, boxShadow: '0 0 20px rgba(0,245,255,0.2)',
          backdropFilter: 'blur(12px)',
        }}>
          {tooltip.content}
        </div>
      )}
    </section>
  );
}
