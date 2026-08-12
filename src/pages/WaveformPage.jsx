import { lazy, Suspense } from 'react';
import SubPageLayout from '../components/SubPageLayout';

const WaveformApp = lazy(() => import('../games/waveform/WaveformApp.jsx'));

export default function WaveformPage() {
  return (
    <SubPageLayout
      title="Waveform"
      titleClass="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-400"
      badge="Original Genre · Waveform Strategy"
    >
      <Suspense
        fallback={
          <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-black text-zinc-400 text-sm">
            Loading Waveform…
          </div>
        }
      >
        <WaveformApp />
      </Suspense>
    </SubPageLayout>
  );
}
