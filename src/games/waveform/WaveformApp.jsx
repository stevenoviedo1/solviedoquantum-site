import { useEffect, useMemo, useState } from 'react';
import {
  applyUpgrade,
  clearCampaign,
  completeMission,
  loadCampaign,
  newCampaign,
  saveCampaign,
  startMission,
} from './engine/index.js';
import TitleScreen from './ui/TitleScreen.jsx';
import HowToPlay from './ui/HowToPlay.jsx';
import CampaignMap from './ui/CampaignMap.jsx';
import MissionView from './ui/MissionView.jsx';
import Debrief from './ui/Debrief.jsx';

function detectGpuLabel() {
  const hasGpu = typeof navigator !== 'undefined' && !!navigator.gpu;
  return hasGpu
    ? 'GPU: WebGPU available · rendering WebGL high-performance'
    : 'GPU: WebGL high-performance';
}

/**
 * Root game shell — screens: title | how | map | mission | debrief
 */
export default function WaveformApp() {
  const [screen, setScreen] = useState('title');
  const [save, setSave] = useState(() => loadCampaign());
  const [mission, setMission] = useState(null);
  const [pendingDebrief, setPendingDebrief] = useState(null);
  const [quality] = useState('high');
  const [gpuLabel, setGpuLabel] = useState('GPU: detecting…');

  useEffect(() => {
    setGpuLabel(detectGpuLabel());
  }, []);

  const hasSave = !!save;

  const startNew = () => {
    const s = newCampaign();
    saveCampaign(s);
    setSave(s);
    setScreen('map');
  };

  const cont = () => {
    const s = loadCampaign() || newCampaign();
    setSave(s);
    setScreen('map');
  };

  const playMission = (id) => {
    const s = save || loadCampaign() || newCampaign();
    setSave(s);
    const state = startMission(id, s);
    setMission(state);
    setScreen('mission');
  };

  const onMissionState = (next) => {
    setMission(next);
    if (next.phase === 'won' && !pendingDebrief) {
      // wait for player to click return — handled in MissionView onExit
    }
  };

  const exitMission = () => {
    if (!mission) {
      setScreen('map');
      return;
    }
    if (mission.phase === 'won') {
      const updated = completeMission(save || newCampaign(), mission.missionId, {
        collapsesForced: mission.collapsesForced,
      });
      setSave(updated);
      setPendingDebrief({
        missionId: mission.missionId,
        title: mission.title,
        collapsesForced: mission.collapsesForced,
      });
      setMission(null);
      setScreen('debrief');
      return;
    }
    setMission(null);
    setScreen('map');
  };

  const pickUpgrade = (id) => {
    const updated = applyUpgrade(save || newCampaign(), id);
    setSave(updated);
    setPendingDebrief(null);
    setScreen('map');
  };

  const skipUpgrade = () => {
    setPendingDebrief(null);
    setScreen('map');
  };

  const body = useMemo(() => {
    if (screen === 'how') return <HowToPlay onBack={() => setScreen('title')} />;
    if (screen === 'map' && save)
      return (
        <CampaignMap
          save={save}
          onPlay={playMission}
          onBack={() => setScreen('title')}
        />
      );
    if (screen === 'mission' && mission)
      return (
        <MissionView
          state={mission}
          onState={onMissionState}
          onExit={exitMission}
          quality={quality}
        />
      );
    if (screen === 'debrief' && pendingDebrief)
      return (
        <Debrief
          missionTitle={pendingDebrief.title}
          collapsesForced={pendingDebrief.collapsesForced}
          upgrades={save?.upgrades || []}
          onPick={pickUpgrade}
          onSkip={skipUpgrade}
        />
      );
    return (
      <TitleScreen
        hasSave={hasSave}
        onNew={() => {
          if (hasSave && !window.confirm('Start a new campaign? Current save will be overwritten.'))
            return;
          if (hasSave) clearCampaign();
          startNew();
        }}
        onContinue={cont}
        onHow={() => setScreen('how')}
        gpuLabel={gpuLabel}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, save, mission, pendingDebrief, hasSave, gpuLabel, quality]);

  return body;
}
