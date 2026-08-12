# SolViedo Quantum — Website

Personal portfolio & marketing site for Steven Oviedo (SolViedo Quantum).

**Live:** https://solviedoquantum.com

## Tech

- Vite + React 19 + Tailwind 4
- tsparticles (cosmic background)
- React Router v7 (SPA routes for games & tools)
- Vercel Analytics (visitor tracking)
- EmailJS contact form
- Static Unity WebGL + self-contained HTML experiences served via iframes

## Key Routes (SPA)

- `/` — Homepage (services + portfolio)
- `/waveform` — **Waveform** — original Waveform Strategy genre (quantum tactics campaign, GPU board)
- `/planetary/` — **Walkable Worlds** — Mars-first WebGPU planetary explorer (embedded build)
- `/nanoverse/` — **Nanoverse** — WebGPU regenerative nanotech education lab (embedded build)
- `/zombies` — Zombie Rounds Unity WebGL game (full embed)
- `/quantum-fairness-hub` — Provably fair randomness tools
- `/ww3` — WW3 Simulator (Python/OOP turn-based game)

### Rebuilding embedded WebGPU apps

Sources live next to this repo (`../planetary-webgpu`, `../nanoverse-archive`). After changing them:

```bash
npm run embed:webgpu
```

That builds with `SITE_BASE=/planetary/` and `/nanoverse/`, copies into `public/`, and syncs planetary Cosmic Radio API handlers into `api/`.

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` → `.env.local` and fill in your EmailJS keys (the ones in the repo are example placeholders).

```env
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

## Analytics (Visitor Counts)

**Vercel Analytics** is already integrated via `@vercel/analytics`.

### How to see your visitor numbers:

1. Deploy to Vercel (or you're already there).
2. Go to your project on Vercel → **Analytics** tab (left sidebar).
3. Enable Analytics if not already on.
4. After 24h (or sooner) you will see:
   - **Visitors** (unique visitors)
   - Page views
   - Top pages, referrers, devices, countries, etc.

This is the cleanest, zero-maintenance way to know exactly how many people visited your site.

(Alternative/privacy option: Plausible Analytics can be swapped in later with one script.)

## Deployment

This site is configured for Vercel with `vercel.json` (SPA rewrites + good caching headers).

Just push to the connected Git repo — Vercel will auto-deploy.

## Production Polish Applied

- React Router for true SPA experience (no more broken internal links)
- All sub-experiences (Zombies, QFH, WW3) now feel like part of one site
- Cleaned duplicate code, consolidated project data, fixed encoding issues
- EmailJS keys moved to env vars
- `vercel.json` with SPA fallback + performance headers
- Lazy-loaded portfolio images
- Vercel Analytics wired up for real visitor metrics

## Notes

- The heavy Unity build lives in `public/games/zombies/`
- QFH and WW3 are self-contained single-file experiences in `public/`
- PhishGuard is currently marked as "in development"

---

Built with ❤️ by Steven Oviedo
