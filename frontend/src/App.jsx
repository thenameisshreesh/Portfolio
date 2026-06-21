import { Suspense, lazy, useState, useEffect } from 'react';
import ParticleBackground from './components/common/ParticleBackground';
import CursorGlow         from './components/common/CursorGlow';
import Loader             from './components/common/Loader';
import Navbar             from './components/nav/Navbar';
import StackHero          from './components/hero/StackHero';
import ArrayAbout         from './components/about/ArrayAbout';

// Lazy load heavy D3 sections
const TreeSkills           = lazy(() => import('./components/skills/TreeSkills'));
const GraphProjects        = lazy(() => import('./components/projects/GraphProjects'));
const LinkedListExperience = lazy(() => import('./components/experience/LinkedListExperience'));
const QueueContact         = lazy(() => import('./components/contact/QueueContact'));

function SectionFallback() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.75rem',
        color: 'rgba(0,245,255,0.4)',
        letterSpacing: '0.15em',
      }}>
        Loading component...
      </div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader for at least 1.8s for visual effect
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Loader show={loading} />
      <CursorGlow />
      <ParticleBackground />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />

        <main id="main-content" aria-label="Portfolio main content">
          <StackHero />

          <ArrayAbout />

          <Suspense fallback={<SectionFallback />}>
            <TreeSkills />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <GraphProjects />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <LinkedListExperience />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <QueueContact />
          </Suspense>
        </main>
      </div>
    </>
  );
}
