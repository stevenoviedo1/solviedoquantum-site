import { Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

import { lazy, Suspense } from 'react';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import HowIBuildPage from './pages/HowIBuildPage';
import ZombiesPage from './pages/ZombiesPage';
import SpiBridgePage from './pages/SpiBridgePage';
import QuantumFairnessHub from './pages/QuantumFairnessHub';
import WW3Simulator from './pages/WW3Simulator';
import PhishGuardDemo from './pages/PhishGuardDemo';
import PlanetaryPage from './pages/PlanetaryPage';
import NanoversePage from './pages/NanoversePage';
import NotFound from './pages/NotFound';

const WaveformPage = lazy(() => import('./pages/WaveformPage.jsx'));

/** Homepage sections live as #ids, not separate pages — map common paths so /about etc. don't 404. */
const sectionRedirects = ['home', 'services', 'about', 'portfolio', 'contact'];

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {sectionRedirects.map((id) => (
          <Route
            key={id}
            path={`/${id}`}
            element={<Navigate to={{ pathname: '/', hash: id }} replace />}
          />
        ))}
        <Route path="/games" element={<GamesPage />} />
        <Route path="/how-i-build" element={<HowIBuildPage />} />
        <Route path="/zombies" element={<ZombiesPage />} />
        <Route path="/spi-bridge-runner" element={<SpiBridgePage />} />
        <Route path="/quantum-fairness-hub" element={<QuantumFairnessHub />} />
        <Route path="/ww3" element={<WW3Simulator />} />
        <Route path="/phishguard" element={<PhishGuardDemo />} />
        <Route path="/planetary-app" element={<PlanetaryPage />} />
        <Route path="/nanoverse-app" element={<NanoversePage />} />
        <Route
          path="/waveform"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-black text-zinc-400 text-sm">
                  Loading Waveform…
                </div>
              }
            >
              <WaveformPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Vercel Analytics — visitor counts in the Vercel dashboard */}
      <Analytics />
    </>
  );
}

export default App;
