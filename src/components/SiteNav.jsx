import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import mark from '../assets/mark.webp';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' },
];

/** Homepage navigation: transparent over the hero, solid once scrolled, highlights the section in view. */
function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.1, 0.25, 0.5] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        solid
          ? 'bg-black/75 backdrop-blur-md border-purple-900/30 shadow-[0_10px_40px_rgba(0,0,0,0.35)]'
          : 'bg-transparent border-transparent'
      }`}
      aria-label="Primary"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5 min-w-0 group" aria-label="SolViedo Quantum home">
          <img
            src={mark}
            alt=""
            width={40}
            height={40}
            className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 drop-shadow-[0_0_10px_rgba(103,232,249,0.55)] transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent truncate">
            SolViedo Quantum
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 lg:gap-2 text-[15px] lg:text-base font-medium">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              aria-current={active === l.id ? 'true' : undefined}
              className={`relative px-3 py-2 rounded-full transition-colors ${
                active === l.id ? 'text-white' : 'text-gray-300 hover:text-cyan-300'
              }`}
            >
              {l.label}
              <span
                aria-hidden="true"
                className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-opacity duration-300 ${
                  active === l.id ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </a>
          ))}
          <a
            href="#contact"
            className="ml-2 lg:ml-3 px-5 py-2 rounded-full text-sm lg:text-[15px] font-bold text-black bg-gradient-to-r from-cyan-400 to-purple-500 hover:shadow-[0_0_24px_rgba(34,211,238,0.45)] hover:scale-[1.03] transition"
          >
            Start a project
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-3xl leading-none p-2 -mr-2"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="md:hidden bg-black/95 backdrop-blur-lg px-6 py-8 text-xl space-y-6 text-center border-t border-purple-900/30"
        >
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className={`block transition ${active === l.id ? 'text-cyan-300' : 'hover:text-cyan-400'}`}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

export default SiteNav;
