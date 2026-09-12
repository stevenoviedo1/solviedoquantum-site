import { useEffect, useRef } from 'react';
import logoHero from '../assets/logo-hero.webp';

/**
 * The big "S" — transparent cutout of the brand art floating on the particle
 * field, with a slow drift, an ambient aura that follows the cursor, orbiting
 * light points, a periodic shimmer sweep, and a 3D tilt on pointer move.
 * Everything decorative is aria-hidden; the logo itself stays a plain <img>.
 */
function HeroLogo({ reduceMotion = false }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || reduceMotion) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    const zone = el.closest('section') || el;
    let frame = 0;
    let rx = 0;
    let ry = 0;
    let tx = 0;
    let ty = 0;

    const tick = () => {
      rx += (tx - rx) * 0.1;
      ry += (ty - ry) * 0.1;
      el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
      if (Math.abs(tx - rx) > 0.02 || Math.abs(ty - ry) > 0.02) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / r.width;
      const py = (e.clientY - (r.top + r.height / 2)) / r.height;
      tx = Math.max(-1, Math.min(1, py)) * -10;
      ty = Math.max(-1, Math.min(1, px)) * 12;
      el.style.setProperty('--glow-x', `${50 + px * 60}%`);
      el.style.setProperty('--glow-y', `${50 + py * 60}%`);
      schedule();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      el.style.setProperty('--glow-x', '50%');
      el.style.setProperty('--glow-y', '50%');
      schedule();
    };

    zone.addEventListener('pointermove', onMove);
    zone.addEventListener('pointerleave', onLeave);
    return () => {
      zone.removeEventListener('pointermove', onMove);
      zone.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  const maskStyle = {
    WebkitMaskImage: `url(${logoHero})`,
    maskImage: `url(${logoHero})`,
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
  };

  return (
    <div
      ref={wrapRef}
      className="hero-logo relative mx-auto w-full max-w-[360px] sm:max-w-[440px] md:max-w-[500px] lg:max-w-[580px] xl:max-w-[640px]"
    >
      <div aria-hidden="true" className="hero-aura" />
      <div aria-hidden="true" className="hero-ring" />
      <div aria-hidden="true" className="hero-orbit">
        <span className="hero-orbit-dot" />
      </div>
      <div aria-hidden="true" className="hero-orbit hero-orbit--inner">
        <span className="hero-orbit-dot hero-orbit-dot--violet" />
      </div>

      <div className="hero-tilt relative">
        <img
          src={logoHero}
          alt="SolViedo Quantum logo"
          width={724}
          height={760}
          fetchPriority="high"
          decoding="async"
          draggable={false}
          className="hero-logo-img relative w-full h-auto select-none"
        />
        <div aria-hidden="true" className="hero-shimmer absolute inset-0" style={maskStyle} />
      </div>
    </div>
  );
}

export default HeroLogo;
