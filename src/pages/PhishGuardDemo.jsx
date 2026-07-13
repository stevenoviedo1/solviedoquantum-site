import { useMemo, useState } from 'react';
import SubPageLayout from '../components/SubPageLayout';
import { analyzeEmail, analyzeUrlOnly, FEATURE_CATALOG } from '../lib/phishguardEngine';
import phishingRules from '../data/phishing_rules.json';

const SAMPLES = {
  cloud: {
    label: 'Cloud storage scam',
    tone: 'danger',
    text: `From: "iCloud Security" <alerts@icloud-secure-login.xyz>
Reply-To: support@totally-not-apple.top
Subject: Your cloud storage is almost full

Dear user@outlook.com,

Your iCloud storage has reached 95% capacity.
Photos, videos, and backups may not be saved.

Upgrade now to avoid data loss: https://icloud-secure-login.xyz/upgrade?verify=1

This special offer expires in a few hours. Act now!`,
  },
  paypal: {
    label: 'PayPal brand spoof',
    tone: 'danger',
    text: `From: "PayPal Security" <security@paypal-account-review.tk>
Subject: Unusual activity — verify your identity

Hello,

We noticed unusual activity on your PayPal account.
Your account will be suspended within 24 hours unless you verify:

https://paypal.com.secure-session-login.tk/webscr/login

Enter your password immediately to secure your profile.`,
  },
  crypto: {
    label: 'Crypto wallet bait',
    tone: 'warn',
    text: `From: Airdrop Desk <claim@wallet-sync.online>
Subject: Claim free crypto — connect wallet

Congratulations! You were selected for an exclusive airdrop.
Connect your wallet and enter your seed phrase to validate:

https://airdrop-claim.pages.dev/wallet/connect

Limited time — expires soon.`,
  },
  legit: {
    label: 'Legitimate team note',
    tone: 'ok',
    text: `From: Sarah Chen <sarah@company.com>
Subject: Weekly team update

Hi team,

Just a quick reminder about our meeting tomorrow at 10am in the main conference room.
Agenda is in the shared drive.

Best,
Sarah`,
  },
};

const LEVEL_STYLES = {
  CRITICAL: {
    bar: 'from-rose-500 to-red-700',
    chip: 'bg-rose-600/90 text-white',
    ring: '#f43f5e',
    text: 'text-rose-400',
  },
  HIGH: {
    bar: 'from-orange-500 to-rose-500',
    chip: 'bg-orange-600/90 text-white',
    ring: '#fb7185',
    text: 'text-orange-300',
  },
  MEDIUM: {
    bar: 'from-amber-400 to-orange-500',
    chip: 'bg-amber-500/90 text-black',
    ring: '#f59e0b',
    text: 'text-amber-300',
  },
  LOW: {
    bar: 'from-emerald-400 to-cyan-500',
    chip: 'bg-emerald-600/90 text-white',
    ring: '#34d399',
    text: 'text-emerald-300',
  },
};

const SIGNAL_COLORS = {
  rules: '#22d3ee',
  url: '#8b5cf6',
  brand: '#f43f5e',
  header: '#f59e0b',
  structure: '#a78bfa',
  ml: '#34d399',
};

function RiskGauge({ score, level }) {
  const style = LEVEL_STYLES[level] || LEVEL_STYLES.LOW;
  const p = Math.max(0, Math.min(100, score));
  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <div
        className="w-28 h-28 rounded-full grid place-items-center shrink-0 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
        style={{
          background: `radial-gradient(#0a0e1a 58%, transparent 59%), conic-gradient(${style.ring} ${p}%, rgba(148,163,184,0.15) 0)`,
        }}
      >
        <span className={`text-3xl font-extrabold ${style.text}`}>{score}</span>
      </div>
      <div className="text-center sm:text-left">
        <div className="text-xs uppercase tracking-[0.14em] text-gray-500 mb-1">Threat verdict</div>
        <div className={`text-3xl sm:text-4xl font-extrabold ${style.text}`}>{level}</div>
        <div className="text-sm text-gray-400 mt-1">Risk score {score}/100</div>
      </div>
    </div>
  );
}

function SignalMix({ signals = {} }) {
  const entries = Object.entries(signals).filter(([, v]) => v > 0);
  const total = entries.reduce((a, [, v]) => a + v, 0) || 1;
  if (!entries.length) {
    return <div className="h-2.5 rounded-full bg-white/5" />;
  }
  return (
    <div>
      <div className="flex h-2.5 rounded-full overflow-hidden bg-white/5">
        {entries.map(([k, v]) => (
          <div
            key={k}
            title={`${k}: ${v}`}
            style={{ width: `${(v / total) * 100}%`, background: SIGNAL_COLORS[k] || '#64748b' }}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
        {entries.map(([k, v]) => (
          <span key={k}>
            <span style={{ color: SIGNAL_COLORS[k] || '#94a3b8' }}>{k}</span> {v}
          </span>
        ))}
      </div>
    </div>
  );
}

const PhishGuardDemo = () => {
  const [emailText, setEmailText] = useState('');
  const [urlText, setUrlText] = useState('');
  const [result, setResult] = useState(null);
  const [urlResult, setUrlResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const [sensitivity, setSensitivity] = useState('balanced');
  const [enableMl, setEnableMl] = useState(true);
  const [activeTab, setActiveTab] = useState('analyze'); // analyze | url | features

  const featureCount = useMemo(
    () => FEATURE_CATALOG.reduce((n, g) => n + g.items.length, 0),
    []
  );

  const runAnalysis = (text = emailText) => {
    if (!String(text || '').trim()) return;
    setIsAnalyzing(true);
    // Brief delay so the UI feels intentional without faking heavy work
    window.setTimeout(() => {
      try {
        const analysis = analyzeEmail(text, { sensitivity, enableMl });
        setResult(analysis);
      } catch (err) {
        setResult({
          risk_score: 0,
          risk_level: 'LOW',
          confidence: 0,
          flags: [`Analysis error: ${err?.message || 'unknown'}`],
          findings: [],
          signals: {},
          explanation: 'Something went wrong while analyzing. Try a shorter paste or refresh the page.',
          removal_playbook: '',
          safe_reply_template: '',
          urls_found: [],
          brands_mentioned: [],
        });
      } finally {
        setIsAnalyzing(false);
      }
    }, 280);
  };

  const handleClear = () => {
    setEmailText('');
    setResult(null);
    setCopyStatus('');
  };

  const loadSample = (key) => {
    const sample = SAMPLES[key];
    if (!sample) return;
    setEmailText(sample.text);
    setActiveTab('analyze');
    runAnalysis(sample.text);
  };

  const copyTemplate = async () => {
    if (!result?.safe_reply_template) return;
    try {
      await navigator.clipboard.writeText(result.safe_reply_template);
      setCopyStatus('Copied');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch {
      setCopyStatus('Copy failed');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  const runUrl = () => {
    if (!urlText.trim()) return;
    try {
      setUrlResult(analyzeUrlOnly(urlText.trim()));
    } catch (err) {
      setUrlResult({
        risk_score: 0,
        risk_level: 'LOW',
        findings: [{ message: err?.message || 'URL parse failed', severity: 'low' }],
      });
    }
  };

  return (
    <SubPageLayout title="PhishGuard" titleClass="text-cyan-300" badge={`Rules v${phishingRules.version}`}>
      <div className="relative overflow-hidden">
        {/* ambient brand glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[420px] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.14),transparent_60%)]" />
        <div className="pointer-events-none absolute top-40 right-0 w-[420px] h-[320px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.12),transparent_65%)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Hero */}
          <div className="text-center mb-10 sm:mb-12">
            <div className="mx-auto mb-5 w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-[#070b14] border border-cyan-400/30 shadow-[0_0_48px_rgba(34,211,238,0.35)] overflow-hidden flex items-center justify-center">
              <img
                src="/phishguard-icon.png"
                alt="PhishGuard"
                className="w-[92%] h-[92%] object-contain object-center select-none"
                width={144}
                height={144}
                decoding="async"
              />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4">
              PhishGuard
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Multi-signal phishing defense — brand spoofing, URL forensics, header intel, and an on-device ML ensemble.
              This live demo runs entirely in your browser.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                Local · no upload
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-purple-500/30 bg-purple-500/10 text-purple-300">
                Rules v{phishingRules.version}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                {featureCount}+ capabilities
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {[
              { id: 'analyze', label: 'Analyze email' },
              { id: 'url', label: 'URL inspector' },
              { id: 'features', label: `All features (${featureCount})` },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${
                  activeTab === t.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-transparent text-black'
                    : 'border-purple-800/60 text-gray-300 hover:border-cyan-500/40 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'analyze' && (
            <>
              <div className="bg-gradient-to-br from-[#0d1424] to-black border border-purple-800/40 rounded-3xl p-5 sm:p-8 mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Analyze an email</h2>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="self-start sm:self-auto text-sm px-4 py-2 border border-purple-700/70 rounded-full hover:bg-purple-900/30 transition"
                  >
                    Clear
                  </button>
                </div>

                {/* Controls */}
                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  <label className="flex flex-col gap-1.5 text-sm text-gray-400">
                    Sensitivity
                    <select
                      value={sensitivity}
                      onChange={(e) => setSensitivity(e.target.value)}
                      className="bg-black/70 border border-purple-800/60 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="quiet">Quiet — fewer alerts</option>
                      <option value="balanced">Balanced (recommended)</option>
                      <option value="strict">Strict — more aggressive</option>
                    </select>
                  </label>
                  <label className="flex items-center justify-between gap-3 text-sm text-gray-300 bg-black/40 border border-purple-800/40 rounded-xl px-4 py-3 mt-auto">
                    <span>
                      <span className="font-semibold text-cyan-300">On-device ML ensemble</span>
                      <span className="block text-xs text-gray-500 mt-0.5">Logistic model over threat features — no cloud</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={enableMl}
                      onChange={(e) => setEnableMl(e.target.checked)}
                      className="w-5 h-5 accent-cyan-400"
                    />
                  </label>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">Quick samples</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(SAMPLES).map(([key, s]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => loadSample(key)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${
                          s.tone === 'ok'
                            ? 'bg-emerald-950/50 border-emerald-700/60 hover:bg-emerald-900/40 text-emerald-200'
                            : s.tone === 'warn'
                              ? 'bg-amber-950/40 border-amber-700/50 hover:bg-amber-900/30 text-amber-100'
                              : 'bg-rose-950/40 border-rose-700/50 hover:bg-rose-900/30 text-rose-100'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  placeholder="Paste full email (headers + body preferred)..."
                  className="w-full h-48 sm:h-64 bg-black/80 border border-purple-800/60 rounded-2xl p-4 sm:p-5 text-white font-mono text-sm resize-y focus:outline-none focus:border-cyan-400/80 placeholder:text-gray-600"
                />

                <button
                  type="button"
                  onClick={() => runAnalysis()}
                  disabled={!emailText.trim() || isAnalyzing}
                  className="mt-5 w-full py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 text-black shadow-[0_10px_40px_rgba(34,211,238,0.2)]"
                >
                  {isAnalyzing ? 'Running multi-signal analysis…' : 'Analyze threat'}
                </button>
              </div>

              {result && (
                <div className="space-y-6 mb-10">
                  <div className="bg-gradient-to-br from-[#0d1424] to-black border border-purple-800/40 rounded-3xl p-5 sm:p-8">
                    <RiskGauge score={result.risk_score} level={result.risk_level} />

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                      {[
                        { label: 'Confidence', value: `${result.confidence ?? 0}%` },
                        { label: 'Findings', value: String(result.findings?.length ?? 0) },
                        { label: 'URLs', value: String(result.urls_found?.length ?? 0) },
                        {
                          label: 'ML',
                          value: result.ml_used
                            ? `${Math.round((result.ml_probability || 0) * 100)}%`
                            : 'Off',
                        },
                      ].map((m) => (
                        <div key={m.label} className="rounded-2xl border border-white/5 bg-black/40 p-4 text-center">
                          <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">{m.label}</div>
                          <div className="text-xl font-bold text-cyan-300">{m.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Signal mix</div>
                      <SignalMix signals={result.signals} />
                    </div>

                    {result.brands_mentioned?.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {result.brands_mentioned.map((b) => (
                          <span
                            key={b}
                            className="text-xs px-3 py-1 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-200"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="mt-5 text-sm text-gray-300 leading-relaxed">{result.explanation}</p>

                    {(result.subject || result.from_addr) && (
                      <p className="mt-3 text-xs text-gray-500 font-mono break-all">
                        From: {result.from_addr || '—'} · Subject: {result.subject || '—'}
                      </p>
                    )}
                  </div>

                  {/* Findings */}
                  <div className="bg-[#0d1424]/90 border border-purple-800/40 rounded-3xl p-5 sm:p-8">
                    <h3 className="text-lg font-bold text-cyan-300 mb-4">Structured findings</h3>
                    <div className="space-y-2.5">
                      {(result.findings?.length ? result.findings : [{ severity: 'info', message: result.flags?.[0], signal: 'rules', category: 'none', score: 0 }]).map((f, i) => {
                        const sev = (f.severity || 'low').toLowerCase();
                        return (
                          <div
                            key={`${f.category}-${i}`}
                            className="grid grid-cols-[88px_1fr] gap-3 rounded-xl border border-white/5 bg-black/40 p-3"
                          >
                            <div
                              className={`text-[10px] font-bold uppercase tracking-wide text-center py-1.5 rounded-lg h-fit border ${
                                sev === 'critical'
                                  ? 'text-rose-300 border-rose-500/40 bg-rose-500/10'
                                  : sev === 'high'
                                    ? 'text-orange-200 border-orange-500/40 bg-orange-500/10'
                                    : sev === 'medium'
                                      ? 'text-amber-200 border-amber-500/40 bg-amber-500/10'
                                      : 'text-emerald-200 border-emerald-500/30 bg-emerald-500/10'
                              }`}
                            >
                              {sev}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-100">{f.message}</div>
                              <div className="text-[11px] text-gray-500 font-mono mt-1">
                                {f.signal || 'rules'} · {f.category || '—'}
                                {typeof f.score === 'number' ? ` · +${f.score}` : ''}
                                {f.evidence ? ` · ${String(f.evidence).slice(0, 100)}` : ''}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* URLs */}
                  {result.urls_found?.length > 0 && (
                    <div className="bg-[#0d1424]/90 border border-purple-800/40 rounded-3xl p-5 sm:p-8">
                      <h3 className="text-lg font-bold text-cyan-300 mb-4">URL forensics</h3>
                      <div className="space-y-2">
                        {result.urls_found.map((u, i) => (
                          <div
                            key={i}
                            className={`font-mono text-xs break-all rounded-xl p-3 border ${
                              u.trusted
                                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-100'
                                : u.risk >= 12
                                  ? 'border-rose-500/30 bg-rose-500/5 text-rose-100'
                                  : 'border-white/10 bg-black/40 text-gray-300'
                            }`}
                          >
                            <span className="text-cyan-300 font-bold mr-2">
                              {u.trusted ? 'trusted' : `risk ${u.risk}`}
                            </span>
                            {u.url}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-[#0d1424]/90 border border-purple-800/40 rounded-3xl p-5 sm:p-6">
                      <h3 className="text-sm font-bold text-cyan-300 mb-3 uppercase tracking-wide">Response playbook</h3>
                      <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">
                        {result.removal_playbook}
                      </pre>
                    </div>
                    <div className="bg-[#0d1424]/90 border border-purple-800/40 rounded-3xl p-5 sm:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wide">Safe reply</h3>
                        <button
                          type="button"
                          onClick={copyTemplate}
                          className="text-xs px-3 py-1.5 rounded-full bg-purple-800/60 hover:bg-purple-700 transition"
                        >
                          {copyStatus || 'Copy'}
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap text-sm text-cyan-200/90 font-mono leading-relaxed">
                        {result.safe_reply_template}
                      </pre>
                    </div>
                  </div>

                  {result.ml_used && result.ml_features && (
                    <div className="bg-[#0d1424]/90 border border-emerald-800/30 rounded-3xl p-5 sm:p-6">
                      <h3 className="text-sm font-bold text-emerald-300 mb-2 uppercase tracking-wide">
                        ML feature vector (on-device)
                      </h3>
                      <p className="text-xs text-gray-500 mb-3">
                        Logistic ensemble confidence {(result.ml_probability * 100).toFixed(1)}% — features stay in your browser.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(result.ml_features).map(([k, v]) => (
                          <div key={k} className="rounded-lg bg-black/40 border border-white/5 px-3 py-2 text-xs">
                            <div className="text-gray-500 truncate">{k}</div>
                            <div className="text-emerald-300 font-mono font-semibold">{Number(v).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-center text-xs text-gray-500">
                    Demo uses the same rules pack as the desktop console + extension. Optional desktop DistilBERT ML is available in the Streamlit app for heavier models.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'url' && (
            <div className="bg-gradient-to-br from-[#0d1424] to-black border border-purple-800/40 rounded-3xl p-5 sm:p-8 mb-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">URL inspector</h2>
              <p className="text-sm text-gray-400 mb-5">
                Check a single link for IP hosts, punycode, typosquats, free-host logins, and brand bait — no email required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={urlText}
                  onChange={(e) => setUrlText(e.target.value)}
                  placeholder="https://…"
                  className="flex-1 bg-black/80 border border-purple-800/60 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={runUrl}
                  disabled={!urlText.trim()}
                  className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 text-black disabled:opacity-50"
                >
                  Inspect
                </button>
              </div>
              {urlResult && (
                <div className="mt-6 space-y-3">
                  <div className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold ${LEVEL_STYLES[urlResult.risk_level]?.chip || LEVEL_STYLES.LOW.chip}`}>
                    {urlResult.risk_level} · {urlResult.risk_score}/100
                  </div>
                  {(urlResult.findings || []).length === 0 ? (
                    <p className="text-emerald-300 text-sm">No structural red flags on this URL alone. Still verify the destination carefully.</p>
                  ) : (
                    <ul className="space-y-2">
                      {urlResult.findings.map((f, i) => (
                        <li key={i} className="text-sm text-gray-200 border border-white/5 rounded-xl px-3 py-2 bg-black/40">
                          <span className="text-cyan-300 font-semibold uppercase text-[10px] mr-2">{f.severity}</span>
                          {f.message}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'features' && (
            <div className="mb-10 space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Complete capability list
                </h2>
                <p className="text-sm text-gray-400 mt-2 max-w-2xl mx-auto">
                  Everything PhishGuard can do across the live demo, Chrome extension, and desktop Threat Console — {featureCount} capabilities in {FEATURE_CATALOG.length} groups.
                </p>
              </div>
              {FEATURE_CATALOG.map((group) => (
                <div
                  key={group.group}
                  className="bg-gradient-to-br from-[#0d1424] to-black border border-purple-800/40 rounded-3xl p-5 sm:p-6"
                >
                  <h3 className="text-lg font-bold text-cyan-300 mb-4">{group.group}</h3>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {group.items.map((item) => (
                      <li
                        key={item.name}
                        className="rounded-2xl border border-white/5 bg-black/40 p-4 hover:border-cyan-500/20 transition"
                      >
                        <div className="font-semibold text-white text-sm mb-1">{item.name}</div>
                        <div className="text-xs text-gray-400 leading-relaxed">{item.detail}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Product surface */}
          <div className="bg-gradient-to-br from-[#0d1424] to-black border border-purple-800/40 rounded-3xl p-5 sm:p-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-xl bg-[#070b14] border border-cyan-400/25 overflow-hidden flex items-center justify-center">
              <img
                src="/phishguard-icon.png"
                alt=""
                className="w-[90%] h-[90%] object-contain object-center"
                width={64}
                height={64}
              />
            </div>
            <h3 className="text-2xl font-bold mb-3">Get the Chrome extension</h3>
            <p className="text-gray-300 mb-5 max-w-lg mx-auto text-sm sm:text-base">
              Free Manifest V3 pack — real-time URL badge, page shield, form protection, and link intel.
              Runs fully on your device.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-5">
              <a
                href="/phishguard-extension.zip"
                download="PhishGuard-Extension.zip"
                className="px-8 py-3.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full font-semibold text-black hover:scale-105 transition shadow-[0_10px_30px_rgba(34,211,238,0.2)]"
              >
                Download extension
              </a>
              <a
                href="/"
                className="px-8 py-3.5 border border-purple-700 rounded-full hover:bg-purple-900/30 transition"
              >
                Back to SolViedo Quantum
              </a>
            </div>
            <div className="max-w-md mx-auto text-left rounded-2xl border border-white/5 bg-black/40 p-4 text-xs text-gray-400 space-y-1.5">
              <p className="text-cyan-300 font-semibold text-sm mb-2">Install in 30 seconds</p>
              <p>1. Download and unzip the file</p>
              <p>2. Open <span className="text-gray-200">chrome://extensions</span></p>
              <p>3. Turn on <span className="text-gray-200">Developer mode</span></p>
              <p>4. Click <span className="text-gray-200">Load unpacked</span> → select the unzipped folder</p>
            </div>
            <p className="text-xs text-gray-500 mt-6 max-w-sm mx-auto">
              Detection is highly accurate but not 100% — always double-check when something feels off.
            </p>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
};

export default PhishGuardDemo;
