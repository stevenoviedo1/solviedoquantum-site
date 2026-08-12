import { useEffect } from 'react';

/** Full-page handoff to the embedded Nanoverse SPA at /nanoverse/ */
export default function NanoversePage() {
  useEffect(() => {
    window.location.replace('/nanoverse/');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-zinc-400 text-sm">
      Opening Nanoverse…
    </div>
  );
}
