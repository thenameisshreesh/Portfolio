import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { postContact } from '../../api/client';

// Queue item shape: { id, label, value, type: 'name'|'email'|'message' }
const TYPE_COLORS = {
  name:    '#00F5FF',
  email:   '#8A2BE2',
  message: '#00FF9F',
};

function colorRgb(hex) {
  if (hex === '#00F5FF') return '0,245,255';
  if (hex === '#8A2BE2') return '138,43,226';
  if (hex === '#00FF9F') return '0,255,159';
  return '0,245,255';
}

export default function QueueContact() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [queue, setQueue]     = useState([]);
  const [phase, setPhase]     = useState('idle');
  // idle | enqueuing | dequeuing | done | error
  const [errMsg, setErrMsg]   = useState('');

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrMsg('Please fill in all fields.');
      return;
    }
    if (phase !== 'idle' && phase !== 'done' && phase !== 'error') return;

    setErrMsg('');
    setPhase('enqueuing');
    setQueue([]);

    // Step 1: Enqueue name
    const qName    = { id: `q-name-${Date.now()}`,    label: 'name',    value: name,    type: 'name'    };
    const qEmail   = { id: `q-email-${Date.now()}`,   label: 'email',   value: email,   type: 'email'   };
    const qMessage = { id: `q-msg-${Date.now()}`,     label: 'message', value: message, type: 'message' };

    setQueue([qName]);
    await sleep(500);
    setQueue(q => [...q, qEmail]);
    await sleep(500);
    setQueue(q => [...q, qMessage]);
    await sleep(600);

    // Post to backend while queue is full
    setPhase('dequeuing');
    try {
      await postContact({ name, email, message });
    } catch {
      // Continue dequeue animation even on error, show error after
    }

    // Step 2: Dequeue one by one (FIFO — name first)
    await sleep(400);
    setQueue(q => q.slice(1));  // dequeue name
    await sleep(500);
    setQueue(q => q.slice(1));  // dequeue email
    await sleep(500);
    setQueue(q => q.slice(1));  // dequeue message

    await sleep(400);
    setPhase('done');
    setName(''); setEmail(''); setMessage('');

    // Reset to idle after 3 sec
    setTimeout(() => setPhase('idle'), 3500);
  };

  const isProcessing = phase === 'enqueuing' || phase === 'dequeuing';

  return (
    <section
      id="contact"
      className="section"
      aria-label="Contact — Queue data structure"
      style={{ zIndex: 1, position: 'relative' }}
    >
      <motion.div
        className="ds-label"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        QUEUE — First In, First Out
      </motion.div>

      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        Get In <span>Touch</span>
      </motion.h2>

      <div className="neon-divider" />

      {/* Queue visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ marginBottom: '36px', width: '100%', maxWidth: '700px' }}
      >
        {/* Labels */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem',
          color: 'rgba(232,240,255,0.3)', marginBottom: '8px',
        }}>
          <span style={{ color: '#00FF9F' }}>DEQUEUE ←</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(0,245,255,0.12)' }} />
          <span style={{ color: '#8A2BE2' }}>→ ENQUEUE</span>
        </div>

        {/* Queue box */}
        <div style={{
          display: 'flex', gap: '8px', minHeight: '60px',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(0,245,255,0.12)',
          borderRadius: '14px', padding: '10px 16px',
          overflowX: 'hidden',
          position: 'relative',
        }}
          role="status" aria-live="polite" aria-label="Message queue"
        >
          <AnimatePresence mode="popLayout">
            {queue.length === 0 ? (
              <motion.span
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem', color: 'rgba(232,240,255,0.2)',
                  fontStyle: 'italic',
                }}
              >
                {phase === 'done' ? '✓ Queue empty — message delivered!' : 'queue is empty'}
              </motion.span>
            ) : (
              queue.map((item, i) => {
                const color = TYPE_COLORS[item.type] || '#00F5FF';
                const rgb = colorRgb(color);
                const isFront = i === 0;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 80, scale: 0.82 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -120, scale: 0.78, transition: { duration: 0.35, ease: 'easeIn' } }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    style={{
                      background: `rgba(${rgb},0.1)`,
                      border: `1px solid ${color}50`,
                      borderRadius: '10px', padding: '8px 14px',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.72rem', color,
                      whiteSpace: 'nowrap', flexShrink: 0,
                      display: 'flex', flexDirection: 'column', gap: '2px',
                      boxShadow: isFront ? `0 0 16px ${color}30` : 'none',
                    }}
                  >
                    <div style={{ fontSize: '0.52rem', opacity: 0.65, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {isFront ? '⬅ FRONT' : ''} {item.label}
                    </div>
                    <div style={{ fontWeight: 700, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.value.length > 18 ? item.value.slice(0, 18) + '…' : item.value}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Queue metadata */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem',
          color: 'rgba(232,240,255,0.22)', marginTop: '6px', padding: '0 16px',
        }}>
          <span>front = 0</span>
          <span>size = {queue.length}</span>
          <span>rear = {queue.length - 1}</span>
        </div>

        {/* Phase status */}
        <AnimatePresence>
          {phase === 'enqueuing' && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginTop: '8px', fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem', color: '#8A2BE2',
              }}
            >
              → Enqueuing fields into queue…
            </motion.div>
          )}
          {phase === 'dequeuing' && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginTop: '8px', fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem', color: '#00FF9F',
              }}
            >
              ← Dequeuing FIFO — name first, then email, then message…
            </motion.div>
          )}
          {phase === 'done' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                marginTop: '8px', fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem', color: '#00FF9F',
                textShadow: '0 0 10px #00FF9F',
              }}
            >
              ✓ queue.isEmpty() = true — Message sent to MongoDB!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Contact form */}
      <motion.form
        id="contact-form"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        aria-label="Contact form"
        style={{
          width: '100%', maxWidth: '560px',
          display: 'flex', flexDirection: 'column', gap: '16px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,245,255,0.08)',
          borderRadius: '20px', padding: '36px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label htmlFor="contact-name" style={{ fontSize: '0.75rem', color: 'rgba(232,240,255,0.5)', marginBottom: '6px', display: 'block' }}>
              Name
              <span style={{ marginLeft: '6px', fontSize: '0.58rem', color: '#00F5FF', fontFamily: "'JetBrains Mono', monospace" }}>
                [enqueue #1]
              </span>
            </label>
            <input
              id="contact-name"
              className="input-neo"
              type="text"
              placeholder="Shreesh"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={isProcessing}
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="contact-email" style={{ fontSize: '0.75rem', color: 'rgba(232,240,255,0.5)', marginBottom: '6px', display: 'block' }}>
              Email
              <span style={{ marginLeft: '6px', fontSize: '0.58rem', color: '#8A2BE2', fontFamily: "'JetBrains Mono', monospace" }}>
                [enqueue #2]
              </span>
            </label>
            <input
              id="contact-email"
              className="input-neo"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isProcessing}
              aria-required="true"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" style={{ fontSize: '0.75rem', color: 'rgba(232,240,255,0.5)', marginBottom: '6px', display: 'block' }}>
            Message
            <span style={{ marginLeft: '6px', fontSize: '0.58rem', color: '#00FF9F', fontFamily: "'JetBrains Mono', monospace" }}>
              [enqueue #3]
            </span>
          </label>
          <textarea
            id="contact-message"
            className="input-neo"
            placeholder="Let's build something amazing together..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            disabled={isProcessing}
            aria-required="true"
            style={{ resize: 'vertical' }}
          />
        </div>

        {errMsg && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: '#FF6B6B', fontSize: '0.8rem', margin: 0 }}
            role="alert"
          >
            {errMsg}
          </motion.p>
        )}

        <motion.button
          id="contact-submit"
          type="submit"
          whileHover={!isProcessing ? { scale: 1.02 } : {}}
          whileTap={!isProcessing ? { scale: 0.97 } : {}}
          disabled={isProcessing}
          className="btn-glow"
          style={{ justifyContent: 'center', opacity: isProcessing ? 0.65 : 1 }}
          aria-busy={isProcessing}
        >
          {phase === 'enqueuing' && '↓ Enqueueing…'}
          {phase === 'dequeuing' && '← Dequeuing (FIFO)…'}
          {phase === 'done'      && '✓ Sent!'}
          {phase === 'error'     && 'Try Again'}
          {phase === 'idle'      && 'Send Message →'}
        </motion.button>

        <p style={{
          textAlign: 'center', fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.62rem', color: 'rgba(232,240,255,0.22)',
        }}>
          queue.enqueue(name) → queue.enqueue(email) → queue.enqueue(message) → dequeue all → MongoDB
        </p>
      </motion.form>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
          marginTop: '80px', textAlign: 'center',
          color: 'rgba(232,240,255,0.2)', fontSize: '0.78rem',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <p>© 2026 Shreesh · Built with React · Flask · D3.js · Framer Motion · MongoDB</p>
        <p style={{ marginTop: '6px', color: 'rgba(0,245,255,0.3)' }}>
          {'/* Data Structures ∩ Design */'}
        </p>
      </motion.div>
    </section>
  );
}
