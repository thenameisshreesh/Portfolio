import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Stack',      href: '#hero',       ds: 'LIFO' },
  { label: 'Array',      href: '#about',      ds: 'INDEXED' },
  { label: 'Tree',       href: '#skills',     ds: 'HIERARCHICAL' },
  { label: 'Graph',      href: '#projects',   ds: 'NETWORKED' },
  { label: 'LinkedList', href: '#experience', ds: 'TRAVERSAL' },
  { label: 'Queue',      href: '#contact',    ds: 'FIFO' },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [progress, setProgress]     = useState(0);
  const [active, setActive]         = useState('');
  const [menuOpen, setMenuOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollTop > 40);
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.4 }
    );
    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.href.slice(1));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, height: '2px',
          background: 'linear-gradient(90deg, #00F5FF, #8A2BE2)',
          zIndex: 10001,
          width: `${progress * 100}%`,
          boxShadow: '0 0 10px #00F5FF',
        }}
      />

      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          padding: '0 32px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled
            ? 'rgba(11,15,25,0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(0,245,255,0.08)'
            : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Logo */}
        <a href="#hero" aria-label="Home" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#00F5FF',
            textShadow: '0 0 20px rgba(0,245,255,0.5)',
          }}>
            {'<Shreesh />'}
          </span>
        </a>

        {/* Desktop Nav */}
        <ul
          role="menubar"
          style={{
            display: 'flex',
            listStyle: 'none',
            gap: '4px',
            alignItems: 'center',
          }}
          className="nav-desktop"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <li key={item.href} role="none">
                <a
                  href={item.href}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: isActive ? '#00F5FF' : 'rgba(232,240,255,0.6)',
                    background: isActive ? 'rgba(0,245,255,0.08)' : 'transparent',
                    transition: 'all 0.2s ease',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#00F5FF';
                      e.currentTarget.style.background = 'rgba(0,245,255,0.06)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(232,240,255,0.6)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {item.label}
                  <span style={{
                    fontSize: '0.55rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    color: isActive ? '#8A2BE2' : 'rgba(138,43,226,0.4)',
                    letterSpacing: '0.08em',
                    marginTop: '1px',
                  }}>
                    {item.ds}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile Hamburger */}
        <button
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
          }}
          className="nav-hamburger"
        >
          <div style={{ width: 24, height: 2, background: '#00F5FF', marginBottom: 5, transition: '0.3s' }} />
          <div style={{ width: 24, height: 2, background: '#00F5FF', marginBottom: 5, transition: '0.3s' }} />
          <div style={{ width: 24, height: 2, background: '#00F5FF', transition: '0.3s' }} />
        </button>
      </motion.nav>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: '72px', left: 0, right: 0,
            background: 'rgba(11,15,25,0.97)',
            backdropFilter: 'blur(20px)',
            zIndex: 999,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            borderBottom: '1px solid rgba(0,245,255,0.1)',
          }}
        >
          {NAV_ITEMS.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                color: 'rgba(232,240,255,0.8)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(0,245,255,0.08)',
              }}
            >
              <span>{item.label}</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                color: '#8A2BE2',
              }}>{item.ds}</span>
            </a>
          ))}
        </motion.div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; flex-direction: column; }
        }
      `}</style>
    </>
  );
}
