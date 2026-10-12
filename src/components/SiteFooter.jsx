import { Link } from 'react-router-dom';
import mark from '../assets/mark.webp';
import { projectSections } from '../data/projects';

const SECTION_LINKS = [
  { href: '/', label: 'Home', isPage: true },
  { href: '/games', label: 'Games', isPage: true },
  { href: '/how-i-build', label: 'How I Build', isPage: true },
  { href: '/#services', label: 'Services' },
  { href: '/#about', label: 'About' },
  { href: '/#portfolio', label: 'Portfolio' },
  { href: '/#contact', label: 'Contact' },
];

function ProjectLink({ project }) {
  const external = project.link.startsWith('http');
  const cls = 'hover:text-cyan-300 transition';
  if (external) {
    return (
      <a href={project.link} target="_blank" rel="noopener noreferrer" className={cls}>
        {project.title} <span aria-hidden="true">↗</span>
      </a>
    );
  }
  if (project.fullPage) {
    return (
      <a href={project.link} className={cls}>
        {project.title}
      </a>
    );
  }
  return (
    <Link to={project.link} className={cls}>
      {project.title}
    </Link>
  );
}

function SiteFooter() {
  const year = new Date().getFullYear();
  const featured = [
    ...projectSections.find((s) => s.id === 'customer').projects,
    ...projectSections.find((s) => s.id === 'fun').projects.slice(0, 2),
  ];

  return (
    <footer className="relative border-t border-purple-900/30 bg-black/80 backdrop-blur-sm text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img
              src={mark}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 drop-shadow-[0_0_10px_rgba(103,232,249,0.5)]"
            />
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              SolViedo Quantum
            </span>
          </Link>
          <p className="mt-4 text-gray-400 leading-relaxed max-w-xs">
            Custom-coded websites, web apps, and games built for speed. No templates, no monthly
            platform fees, no lock-in.
          </p>
          <p className="mt-4 text-xs text-gray-500">
            Rio Grande Valley, Texas · U.S. Army veteran · UTRGV CS
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300 mb-4">Explore</h2>
          <ul className="space-y-2.5 text-gray-300">
            {SECTION_LINKS.map((l) => (
              <li key={l.href}>
                {l.isPage ? (
                  <Link to={l.href} className="hover:text-cyan-300 transition">
                    {l.label}
                  </Link>
                ) : (
                  <a href={l.href} className="hover:text-cyan-300 transition">
                    {l.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300 mb-4">
            Featured work
          </h2>
          <ul className="space-y-2.5 text-gray-300">
            {featured.map((p) => (
              <li key={p.id}>
                <ProjectLink project={p} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300 mb-4">
            Get in touch
          </h2>
          <ul className="space-y-2.5 text-gray-300">
            <li>
              <a href="tel:+19567981222" className="hover:text-cyan-300 transition">
                (956) 798-1222
              </a>
            </li>
            <li className="break-all">
              <a href="mailto:solviedoquantum@gmail.com" className="hover:text-cyan-300 transition">
                solviedoquantum@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://soviedo1.itch.io"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition"
              >
                itch.io <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
          <a
            href="#contact"
            className="inline-flex mt-5 px-5 py-2.5 rounded-full font-bold text-black bg-gradient-to-r from-cyan-400 to-purple-500 hover:scale-[1.03] transition"
          >
            Start a project
          </a>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {year} SolViedo Quantum · Steven Oviedo. All rights reserved.</p>
          <a href="#home" className="hover:text-cyan-300 transition">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
