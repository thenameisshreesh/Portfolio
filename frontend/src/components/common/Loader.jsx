import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: '#0B0F19',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          {/* Spinning ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: '#00F5FF',
              borderRightColor: '#8A2BE2',
              boxShadow: '0 0 30px rgba(0,245,255,0.3)',
            }}
          />

          {/* Text */}
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: '#00F5FF',
              textTransform: 'uppercase',
            }}
          >
            Initializing Portfolio...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
