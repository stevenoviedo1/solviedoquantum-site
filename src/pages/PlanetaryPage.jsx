import { useEffect } from 'react';

/** Full-page handoff to the embedded Walkable Worlds SPA at /planetary/ */
export default function PlanetaryPage() {
  useEffect(() => {
    window.location.replace('/planetary/');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-zinc-400 text-sm">
      Opening Walkable Worlds…
    </div>
  );
}
