import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Tooltip({ children, content, color = '#00F5FF' }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => setVisible(true);
    const hide = () => setVisible(false);
    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);
    el.addEventListener('focus', show);
    el.addEventListener('blur', hide);
    return () => {
      el.removeEventListener('mouseenter', show);
      el.removeEventListener('mouseleave', hide);
      el.removeEventListener('focus', show);
      el.removeEventListener('blur', hide);
    };
  }, []);

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 10px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(11,15,25,0.95)',
              border: `1px solid ${color}40`,
              borderRadius: '8px',
              color: '#E8F0FF',
              fontSize: '0.78rem',
              padding: '8px 14px',
              whiteSpace: 'nowrap',
              maxWidth: '260px',
              whiteSpace: 'normal',
              textAlign: 'center',
              zIndex: 1000,
              boxShadow: `0 0 16px ${color}30`,
              backdropFilter: 'blur(12px)',
              pointerEvents: 'none',
            }}
          >
            {content}
            {/* Arrow */}
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `6px solid ${color}40`,
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
