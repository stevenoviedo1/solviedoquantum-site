import { memo, useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useMediaQuery } from '../lib/hooks';

/**
 * Cosmic particle field behind the homepage.
 *
 * Isolated + memoized on purpose: the tsparticles React wrapper destroys and
 * re-creates its container whenever its props object changes, so rendering it
 * inline in HomePage meant every state change (menu toggle, service tabs…)
 * rebuilt the whole particle system. Fixed positioning also keeps the canvas at
 * viewport size instead of the full page height.
 */
const CosmicBackground = memo(function CosmicBackground({ disabled = false }) {
  const [ready, setReady] = useState(false);
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    let cancelled = false;
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const options = useMemo(
    () => ({
      background: { color: { value: 'transparent' } },
      fullScreen: { enable: false },
      fpsLimit: isMobile ? 30 : 60,
      particles: {
        color: { value: ['#8b5cf6', '#06b6d4'] },
        links: { color: '#8b5cf6', distance: 150, enable: true, opacity: 0.25, width: 1 },
        move: { enable: true, speed: 0.8 },
        number: { density: { enable: true, area: 800 }, value: isMobile ? 14 : 40 },
        opacity: { value: { min: 0.3, max: 0.6 } },
        shape: { type: 'circle' },
        size: { value: { min: 1, max: 3.5 } },
      },
      detectRetina: true,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
    }),
    [isMobile]
  );

  if (!ready || disabled) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
});

export default CosmicBackground;
