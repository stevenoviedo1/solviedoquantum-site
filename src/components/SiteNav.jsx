import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import mark from '../assets/mark.webp';

const HOMEPAGE_SECTION_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' },
];

const PAGE_LINKS = [
  { path: '/games', label: 'Games' },
  { path: '/how-i-build', label: 'How I Build' },
];

/** Homepage navigation: transparent over the hero, solid once scrolled, highlights the section in view. */
function SiteNav() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
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
    if (!isHomePage || typeof IntersectionObserver === 'undefined') return undefined;
    const sections = HOMEPAGE_SECTION_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
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
  }, [isHomePage]);

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

        <div className="hidden md:flex items-center gap-1 text-[14px] lg:text-[15px] font-medium">
          {isHomePage ? (
            <>
              <a
                href="#home"
                aria-current={active === 'home' ? 'true' : undefined}
                className={`relative px-2.5 py-2 rounded-full transition-colors ${
                  active === 'home' ? 'text-white' : 'text-gray-300 hover:text-cyan-300'
                }`}
              >
                Home
                <span
                  aria-hidden="true"
                  className={`absolute left-2.5 right-2.5 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-opacity duration-300 ${
                    active === 'home' ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </a>
              {PAGE_LINKS.map((pl) => (
                <Link
                  key={pl.path}
                  to={pl.path}
                  className="px-2.5 py-2 rounded-full text-gray-300 hover:text-cyan-300 transition-colors"
                >
                  {pl.label}
                </Link>
              ))}
              {HOMEPAGE_SECTION_LINKS.slice(1).map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  aria-current={active === l.id ? 'true' : undefined}
                  className={`relative px-2.5 py-2 rounded-full transition-colors ${
                    active === l.id ? 'text-white' : 'text-gray-300 hover:text-cyan-300'
                  }`}
                >
                  {l.label}
                  <span
                    aria-hidden="true"
                    className={`absolute left-2.5 right-2.5 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-opacity duration-300 ${
                      active === l.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </a>
              ))}
            </>
          ) : (
            <>
              <Link
                to="/"
                className="px-2.5 py-2 rounded-full text-gray-300 hover:text-cyan-300 transition-colors"
              >
                Home
              </Link>
              {PAGE_LINKS.map((pl) => (
                <Link
                  key={pl.path}
                  to={pl.path}
                  className={`px-2.5 py-2 rounded-full transition-colors ${
                    location.pathname === pl.path ? 'text-white' : 'text-gray-300 hover:text-cyan-300'
                  }`}
                >
                  {pl.label}
                </Link>
              ))}
              <Link
                to="/#services"
                className="px-2.5 py-2 rounded-full text-gray-300 hover:text-cyan-300 transition-colors"
              >
                Services
              </Link>
              <Link
                to="/#about"
                className="px-2.5 py-2 rounded-full text-gray-300 hover:text-cyan-300 transition-colors"
              >
                About
              </Link>
              <Link
                to="/#contact"
                className="px-2.5 py-2 rounded-full text-gray-300 hover:text-cyan-300 transition-colors"
              >
                Contact
              </Link>
            </>
          )}
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
          {isHomePage ? (
            <>
              <a
                href="#home"
                onClick={() => setOpen(false)}
                className={`block transition ${active === 'home' ? 'text-cyan-300' : 'hover:text-cyan-400'}`}
              >
                Home
              </a>
              {PAGE_LINKS.map((pl) => (
                <Link
                  key={pl.path}
                  to={pl.path}
                  onClick={() => setOpen(false)}
                  className="block hover:text-cyan-400 transition"
                >
                  {pl.label}
                </Link>
              ))}
              {HOMEPAGE_SECTION_LINKS.slice(1).map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className={`block transition ${active === l.id ? 'text-cyan-300' : 'hover:text-cyan-400'}`}
                >
                  {l.label}
                </a>
              ))}
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setOpen(false)} className="block hover:text-cyan-400 transition">
                Home
              </Link>
              {PAGE_LINKS.map((pl) => (
                <Link
                  key={pl.path}
                  to={pl.path}
                  onClick={() => setOpen(false)}
                  className={`block transition ${location.pathname === pl.path ? 'text-cyan-300' : 'hover:text-cyan-400'}`}
                >
                  {pl.label}
                </Link>
              ))}
              <Link to="/#services" onClick={() => setOpen(false)} className="block hover:text-cyan-400 transition">
                Services
              </Link>
              <Link to="/#about" onClick={() => setOpen(false)} className="block hover:text-cyan-400 transition">
                About
              </Link>
              <Link to="/#contact" onClick={() => setOpen(false)} className="block hover:text-cyan-400 transition">
                Contact
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default SiteNav;
