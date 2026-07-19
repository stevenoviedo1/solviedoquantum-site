import { Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

import HomePage from './pages/HomePage';
import ZombiesPage from './pages/ZombiesPage';
import QuantumFairnessHub from './pages/QuantumFairnessHub';
import WW3Simulator from './pages/WW3Simulator';
import PhishGuardDemo from './pages/PhishGuardDemo';
import NotFound from './pages/NotFound';

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
        <Route path="/zombies" element={<ZombiesPage />} />
        <Route path="/quantum-fairness-hub" element={<QuantumFairnessHub />} />
        <Route path="/ww3" element={<WW3Simulator />} />
        <Route path="/phishguard" element={<PhishGuardDemo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Vercel Analytics — visitor counts in the Vercel dashboard */}
      <Analytics />
    </>
  );
}

export default App;
