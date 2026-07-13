/**
 * PhishGuard browser multi-signal engine + lightweight on-device ML scorer.
 * Mirrors desktop detector.py signals for the live demo (no network).
 */

import rules from '../data/phishing_rules.json';

const URL_RE =
  /https?:\/\/[^\s<>"')\]]+|www\.[a-z0-9][a-z0-9.-]+\.[a-z]{2,}[^\s<>"')\]]*/gi;
const FROM_RE = /(?:^|\n)from:\s*(?:"?([^"<\n]+)"?\s*)?<?([^\s>]+@[^\s>]+)>?/i;
const REPLY_RE = /(?:^|\n)reply-to:\s*(?:"?([^"<\n]+)"?\s*)?<?([^\s>]+@[^\s>]+)>?/i;
const SUBJECT_RE = /(?:^|\n)subject:\s*(.+)/i;
const HREF_RE = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

const FREE_HOSTS = [
  'github.io', 'netlify.app', 'vercel.app', 'web.app', 'pages.dev',
  'firebaseapp.com', 'ngrok.io', 'trycloudflare.com', 'glitch.me', 'herokuapp.com',
];

const PATH_FLAGS = rules.url_path_red_flags || [
  'login', 'signin', 'verify', 'secure', 'account', 'password', 'wallet', 'billing',
];

/** Fixed logistic weights over engineered features (on-device "ML" head). */
const ML_WEIGHTS = {
  bias: -2.4,
  keyword_density: 1.8,
  urgency_stack: 1.4,
  brand_mismatch: 2.6,
  url_risk: 2.1,
  header_risk: 1.5,
  tld_risk: 1.2,
  credential_bait: 2.3,
  free_host_login: 1.9,
  href_mismatch: 2.8,
  shortener: 0.7,
  generic_greeting: 0.9,
};

function sigmoid(x) {
  if (x > 20) return 1;
  if (x < -20) return 0;
  return 1 / (1 + Math.exp(-x));
}

function normalizeHost(host) {
  if (!host) return '';
  let h = String(host).toLowerCase().replace(/\.$/, '');
  if (h.startsWith('www.')) h = h.slice(4);
  return h;
}

function registrable(host) {
  const h = normalizeHost(host);
  const parts = h.split('.').filter(Boolean);
  if (parts.length <= 2) return h;
  return parts.slice(-2).join('.');
}

function isTrusted(host) {
  const trusted = rules.trusted_domains || [];
  const h = normalizeHost(host);
  const reg = registrable(h);
  return trusted.some((t) => {
    const tt = String(t).toLowerCase().replace(/^\./, '');
    if (tt === 'gov' || tt === 'edu') return reg.endsWith('.' + tt);
    return reg === tt || h === tt || h.endsWith('.' + tt) || reg.endsWith('.' + tt);
  });
}

function parseUrl(raw) {
  try {
    const s = raw.startsWith('http') ? raw : `http://${raw}`;
    return new URL(s);
  } catch {
    return null;
  }
}

function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function extractUrls(text) {
  const found = [];
  const matches = String(text || '').match(URL_RE) || [];
  for (const m of matches) {
    let u = m.replace(/[.,;:!?)]+$/, '');
    if (u.toLowerCase().startsWith('www.')) u = `http://${u}`;
    if (!found.includes(u)) found.push(u);
    if (found.length >= 40) break;
  }
  let hm;
  const hrefRe = new RegExp(HREF_RE.source, 'gi');
  while ((hm = hrefRe.exec(text || '')) && found.length < 40) {
    let href = hm[1];
    if (/^https?:\/\//i.test(href) || /^www\./i.test(href)) {
      if (href.toLowerCase().startsWith('www.')) href = `http://${href}`;
      if (!found.includes(href)) found.push(href);
    }
  }
  return found;
}

function analyzeUrl(urlStr) {
  const findings = [];
  const u = parseUrl(urlStr);
  if (!u) {
    return {
      findings: [{ category: 'malformed_url', severity: 'medium', score: 10, message: 'Malformed URL', signal: 'url' }],
      score: 10,
      host: '',
      trusted: false,
    };
  }
  const host = normalizeHost(u.hostname);
  const path = decodeURIComponent(`${u.pathname}?${u.search}`).toLowerCase();

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    findings.push({ category: 'ip_url', severity: 'high', score: 28, message: 'URL uses a raw IP address', evidence: host, signal: 'url' });
  }
  if (host.includes('xn--')) {
    findings.push({ category: 'punycode', severity: 'high', score: 30, message: 'Punycode (xn--) host — possible lookalike domain', evidence: host, signal: 'url' });
  }
  const tlds = rules.domain_rules?.suspicious_tlds || [];
  for (const tld of tlds) {
    if (host.endsWith(tld.toLowerCase())) {
      findings.push({
        category: 'suspicious_tld',
        severity: rules.domain_rules?.severity || 'medium',
        score: rules.domain_rules?.score || 16,
        message: `Abuse-prone TLD in URL: ${tld}`,
        evidence: host,
        signal: 'url',
      });
      break;
    }
  }
  if (FREE_HOSTS.some((h) => host === h || host.endsWith('.' + h))) {
    if (PATH_FLAGS.some((f) => path.includes(f))) {
      findings.push({
        category: 'free_host_login',
        severity: 'high',
        score: 26,
        message: 'Login/verify path on free hosting infrastructure',
        evidence: host,
        signal: 'url',
      });
    }
  }
  if (!isTrusted(host) && PATH_FLAGS.some((f) => path.includes(f))) {
    findings.push({
      category: 'path_bait',
      severity: 'medium',
      score: 12,
      message: 'Auth-like path on untrusted host',
      evidence: path.slice(0, 80),
      signal: 'url',
    });
  }
  if (host.split('.').length >= 5 && !isTrusted(host)) {
    findings.push({
      category: 'deep_subdomain',
      severity: 'medium',
      score: 14,
      message: 'Unusually deep subdomain chain',
      evidence: host,
      signal: 'url',
    });
  }
  if (u.username || (u.href.includes('@') && u.href.indexOf('@') < u.href.indexOf(host))) {
    findings.push({
      category: 'url_userinfo',
      severity: 'high',
      score: 24,
      message: 'URL embeds userinfo before the host (classic spoof)',
      evidence: host,
      signal: 'url',
    });
  }

  const byCat = {};
  for (const f of findings) byCat[f.category] = Math.max(byCat[f.category] || 0, f.score);
  const score = Math.min(100, Object.values(byCat).reduce((a, b) => a + b, 0));
  return { findings, score, host, trusted: isTrusted(host) };
}

function brandFindings(fullText, urls, fromAddr) {
  const findings = [];
  const mentioned = [];
  const bp = rules.brand_protection || { brands: [] };
  const textNoEmail = (fullText || '').replace(EMAIL_RE, ' ');
  const hosts = [];
  for (const u of urls) {
    try {
      const h = new URL(u.startsWith('http') ? u : `http://${u}`).hostname;
      if (h) hosts.push(normalizeHost(h));
    } catch { /* ignore */ }
  }
  let fromHost = '';
  if (fromAddr && fromAddr.includes('@')) fromHost = fromAddr.split('@')[1].toLowerCase();

  for (const brand of bp.brands || []) {
    const keys = (brand.keywords || []).map((k) => k.toLowerCase());
    const legit = (brand.legit_domains || []).map((d) => normalizeHost(d));
    const textHit = keys.some((k) => {
      if (k.includes(' ')) return textNoEmail.includes(k);
      return new RegExp(`(?<![a-z0-9])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z0-9])`).test(textNoEmail);
    });
    if (!textHit && !hosts.some((h) => keys.some((k) => h.includes(k.replace(/\s/g, ''))))) continue;
    if (textHit) mentioned.push(brand.name);

    for (const h of [...hosts, fromHost].filter(Boolean)) {
      const reg = registrable(h);
      if (legit.includes(reg) || legit.some((d) => reg.endsWith('.' + d))) continue;
      if (textHit && !isTrusted(h)) {
        findings.push({
          category: 'brand_impersonation',
          severity: 'critical',
          score: bp.impersonation_score || 36,
          message: `${brand.name} language with non-official domain “${reg}”`,
          evidence: h,
          signal: 'brand',
        });
        break;
      }
    }

    for (const h of hosts) {
      const reg = registrable(h);
      if (legit.includes(reg)) continue;
      for (const d of legit) {
        const core = normalizeHost(d).split('.')[0];
        for (const label of normalizeHost(h).split('.')) {
          if (!label || label === 'www' || label.length < 4) continue;
          const dist = levenshtein(label, core);
          if (dist > 0 && dist <= 2 && core.length >= 4) {
            findings.push({
              category: 'typosquat',
              severity: 'critical',
              score: bp.typosquat_score || 34,
              message: `Possible ${brand.name} typosquat: “${h}” ≈ ${d}`,
              evidence: h,
              signal: 'brand',
            });
          }
        }
      }
    }
  }

  const uniq = [];
  const seen = new Set();
  for (const f of findings) {
    const key = `${f.category}|${f.evidence || f.message}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniq.push(f);
    }
  }
  return { findings: uniq, brands: [...new Set(mentioned)] };
}

function headerFindings(raw, fullText, body) {
  const findings = [];
  const fromM = raw.match(FROM_RE);
  const replyM = raw.match(REPLY_RE);
  const fromName = (fromM?.[1] || '').trim();
  const fromAddr = (fromM?.[2] || '').trim();
  const replyTo = (replyM?.[2] || '').trim();

  for (const rule of rules.sender_rules || []) {
    if (fromAddr && fromAddr.length > (rule.min_length || 40)) {
      findings.push({
        category: rule.category || 'suspicious_sender',
        severity: rule.severity || 'medium',
        score: rule.score || 14,
        message: rule.message || 'Suspicious sender',
        evidence: fromAddr.slice(0, 80),
        signal: 'header',
      });
    }
  }

  if (fromName && fromName.includes('@') && fromAddr) {
    const embedded = fromName.match(EMAIL_RE) || [];
    if (embedded.some((e) => e.toLowerCase() !== fromAddr.toLowerCase())) {
      findings.push({
        category: 'display_name_spoof',
        severity: 'high',
        score: 28,
        message: 'Display name embeds an email that does not match From',
        evidence: fromName.slice(0, 80),
        signal: 'header',
      });
    }
  }

  const freeMail = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'mail.com', 'icloud.com'];
  if (fromName && fromAddr.includes('@')) {
    const domain = fromAddr.split('@')[1].toLowerCase();
    const brandish = fromName.match(/\b(paypal|microsoft|apple|amazon|google|netflix|irs|support|security|billing)\b/i);
    if (brandish && freeMail.includes(domain)) {
      findings.push({
        category: 'free_mail_brand_spoof',
        severity: 'high',
        score: 30,
        message: `Display name claims “${brandish[1]}” but From is free-mail`,
        evidence: fromAddr,
        signal: 'header',
      });
    }
  }

  if (replyTo && fromAddr && replyTo.includes('@') && fromAddr.includes('@')) {
    const rd = replyTo.split('@')[1].toLowerCase();
    const fd = fromAddr.split('@')[1].toLowerCase();
    if (rd !== fd && !isTrusted(rd)) {
      findings.push({
        category: 'reply_to_mismatch',
        severity: 'medium',
        score: 18,
        message: 'Reply-To domain differs from From domain',
        evidence: `from=${fd} reply-to=${rd}`,
        signal: 'header',
      });
    }
  }

  // href vs visible text domain mismatch
  let hm;
  const hrefRe = new RegExp(HREF_RE.source, 'gi');
  while ((hm = hrefRe.exec(body || raw || ''))) {
    const href = hm[1];
    const text = hm[2].replace(/<[^>]+>/g, '').trim();
    if (!/^https?:/i.test(href)) continue;
    const textUrls = text.match(URL_RE) || [];
    if (!textUrls.length) continue;
    try {
      const hrefHost = normalizeHost(new URL(href).hostname);
      let tUrl = textUrls[0].replace(/[.,;:!?)]+$/, '');
      if (tUrl.toLowerCase().startsWith('www.')) tUrl = `http://${tUrl}`;
      if (!/^https?:/i.test(tUrl)) tUrl = `http://${tUrl}`;
      const textHost = normalizeHost(new URL(tUrl).hostname);
      if (textHost && hrefHost && registrable(textHost) !== registrable(hrefHost)) {
        findings.push({
          category: 'href_mismatch',
          severity: 'critical',
          score: 40,
          message: 'Link text shows one domain but href goes elsewhere',
          evidence: `text=${textHost} href=${hrefHost}`,
          signal: 'structure',
        });
      }
    } catch { /* ignore */ }
  }

  const urgency = (fullText.match(/\b(urgent|immediately|asap|final notice|act now|within \d+ hours?)\b/g) || []).length;
  const action = (fullText.match(/\b(click|verify|confirm|login|sign in|update|password|suspend)\b/g) || []).length;
  if (urgency >= 2 && action >= 2) {
    findings.push({
      category: 'urgency_action_combo',
      severity: 'medium',
      score: 16,
      message: 'Stacked urgency language combined with login/verify CTAs',
      evidence: `urgency=${urgency} action=${action}`,
      signal: 'structure',
    });
  }

  return { findings, fromAddr, fromName, subject: (raw.match(SUBJECT_RE)?.[1] || '').trim() };
}

function ruleFindings(fullText) {
  const findings = [];
  const categoryHits = {};

  for (const pattern of rules.keyword_patterns || []) {
    const cat = pattern.category || 'keyword';
    let hits = 0;
    let evidence = '';
    for (const term of pattern.terms || []) {
      if (fullText.includes(term.toLowerCase())) {
        hits += 1;
        if (!evidence) evidence = term;
      }
    }
    if (hits) {
      let adj = Math.min(Math.round((pattern.score || 20) * (1 + 0.2 * (hits - 1))), (pattern.score || 20) * 2);
      categoryHits[cat] = (categoryHits[cat] || 0) + 1;
      if (categoryHits[cat] > 1) adj = Math.max(8, Math.floor(adj / 2));
      findings.push({
        category: cat,
        severity: pattern.severity || 'medium',
        score: adj,
        message: (pattern.message_template || '{term}').replace('{term}', evidence),
        evidence,
        signal: 'rules',
      });
    }
  }

  for (const regexRule of rules.regex_patterns || []) {
    try {
      if (new RegExp(regexRule.pattern, 'i').test(fullText)) {
        findings.push({
          category: regexRule.category || 'regex',
          severity: regexRule.severity || 'medium',
          score: regexRule.score || 15,
          message: regexRule.message || 'Suspicious pattern',
          signal: 'rules',
        });
      }
    } catch { /* bad regex */ }
  }

  return findings;
}

function buildMlFeatures(findings, fullText, urls) {
  const cats = new Set(findings.map((f) => f.category));
  const signals = findings.reduce((acc, f) => {
    acc[f.signal] = (acc[f.signal] || 0) + f.score;
    return acc;
  }, {});
  const words = Math.max(1, (fullText || '').split(/\s+/).length);
  const keywordHits = findings.filter((f) => f.signal === 'rules').length;

  return {
    keyword_density: Math.min(1, keywordHits / 6),
    urgency_stack: cats.has('urgency_action_combo') || cats.has('time_pressure') ? 1 : 0,
    brand_mismatch: cats.has('brand_impersonation') || cats.has('typosquat') ? 1 : 0,
    url_risk: Math.min(1, (signals.url || 0) / 40),
    header_risk: Math.min(1, (signals.header || 0) / 30),
    tld_risk: cats.has('suspicious_tld') ? 1 : 0,
    credential_bait: cats.has('credential_harvest') || cats.has('crypto_wallet_scam') ? 1 : 0,
    free_host_login: cats.has('free_host_login') ? 1 : 0,
    href_mismatch: cats.has('href_mismatch') ? 1 : 0,
    shortener: cats.has('suspicious_shortener') ? 1 : 0,
    generic_greeting: cats.has('generic_greeting') ? 1 : 0,
    url_count: Math.min(1, urls.length / 5),
    text_len: Math.min(1, words / 400),
  };
}

function runMlHead(features) {
  let z = ML_WEIGHTS.bias;
  for (const [k, w] of Object.entries(ML_WEIGHTS)) {
    if (k === 'bias') continue;
    z += w * (features[k] || 0);
  }
  const prob = sigmoid(z);
  const mlScore = Math.round(prob * 55);
  const findings = [];
  if (prob >= 0.55) {
    findings.push({
      category: 'ml_ensemble',
      severity: prob >= 0.82 ? 'high' : 'medium',
      score: mlScore,
      message: `On-device ML ensemble flagged phishing (confidence ${(prob * 100).toFixed(0)}%)`,
      evidence: `p=${prob.toFixed(3)}`,
      signal: 'ml',
    });
  }
  return { findings, probability: prob, mlScore, features };
}

function aggregate(findings, sensitivity = 'balanced') {
  const byCat = {};
  const signals = {};
  for (const f of findings) {
    byCat[f.category] = Math.max(byCat[f.category] || 0, f.score);
    signals[f.signal] = (signals[f.signal] || 0) + f.score;
  }
  const sorted = Object.values(byCat).sort((a, b) => b - a);
  let score = 0;
  sorted.forEach((s, i) => {
    score += i > 3 ? Math.round(s * 0.85 ** i) : s;
  });

  const sens = rules.scoring?.sensitivity?.[sensitivity] || {};
  score = Math.round(score * (sens.score_multiplier || 1));
  score = Math.max(0, Math.min(100, score));

  const th = rules.scoring?.thresholds || { CRITICAL: 70, HIGH: 50, MEDIUM: 30, LOW: 0 };
  const offset = sens.threshold_offset || 0;
  let level = 'LOW';
  if (score >= th.CRITICAL + offset) level = 'CRITICAL';
  else if (score >= th.HIGH + offset) level = 'HIGH';
  else if (score >= th.MEDIUM + offset) level = 'MEDIUM';

  const independent = new Set(findings.map((f) => f.signal)).size;
  let confidence = Math.min(95, 35 + independent * 12 + Math.min(30, findings.length * 4));
  if (score < 15) confidence = Math.max(40, confidence - 15);

  return { score, level, confidence, categories: byCat, signals };
}

function playbook(level) {
  return rules.playbooks?.[level] ||
    'Do not click links. Verify through official channels. Report phishing if unsure.';
}

/**
 * Full multi-signal analysis for the web demo.
 */
export function analyzeEmail(rawEmail, options = {}) {
  const sensitivity = options.sensitivity || 'balanced';
  const enableMl = options.enableMl !== false;
  const raw = String(rawEmail || '').slice(0, 200000);
  const fullText = raw.toLowerCase();

  const findings = [];
  findings.push(...ruleFindings(fullText));

  const headers = headerFindings(raw, fullText, raw);
  findings.push(...headers.findings);

  const urls = extractUrls(raw);
  const urlDetails = [];
  for (const u of urls) {
    const ur = analyzeUrl(u);
    findings.push(...ur.findings);
    urlDetails.push({
      url: u.slice(0, 300),
      host: ur.host,
      trusted: ur.trusted,
      findings: ur.findings.length,
      risk: ur.score,
    });
  }

  const brands = brandFindings(fullText, urls, headers.fromAddr);
  findings.push(...brands.findings);

  let ml = { findings: [], probability: 0, mlScore: 0, features: {} };
  if (enableMl) {
    const features = buildMlFeatures(findings, fullText, urls);
    ml = runMlHead(features);
    findings.push(...ml.findings);
  }

  const { score, level, confidence, categories, signals } = aggregate(findings, sensitivity);
  const findingsSorted = [...findings].sort((a, b) => b.score - a.score);

  const flags = findingsSorted.map((f) => {
    const icon = f.severity === 'critical' || f.severity === 'high' ? '🚨' : '⚠️';
    return `${icon} ${f.message}`;
  });

  const catList = [...new Set(findingsSorted.map((f) => f.category.replace(/_/g, ' ')))].slice(0, 6);
  let explanation =
    findingsSorted.length === 0
      ? `No strong automated red flags (score ${score}/100, ${level}). Still verify unexpected requests.`
      : `Multi-signal analysis scored ${score}/100 (${level}) from ${findingsSorted.length} signal(s): ${catList.join(', ')}.`;
  if (brands.brands.length) explanation += ` Brand context: ${brands.brands.join(', ')}.`;
  if (enableMl) explanation += ` On-device ML confidence: ${(ml.probability * 100).toFixed(0)}%.`;
  explanation += ` Mode: ${sensitivity}. Rules v${rules.version}.`;

  return {
    risk_score: score,
    risk_level: level,
    confidence,
    flags: flags.length ? flags : ['No strong red flags detected — always double-check suspicious emails'],
    findings: findingsSorted,
    categories,
    signals,
    explanation,
    removal_playbook: playbook(level),
    safe_reply_template:
      'I did not request this. Please remove my address from your list and confirm only via your official support channel.',
    urls_found: urlDetails,
    brands_mentioned: brands.brands,
    subject: headers.subject,
    from_addr: headers.fromAddr,
    sensitivity,
    ml_used: enableMl,
    ml_probability: ml.probability,
    ml_features: ml.features,
    rules_version: rules.version,
    analyzed_at: new Date().toISOString(),
  };
}

export function analyzeUrlOnly(url) {
  const ur = analyzeUrl(url);
  const brands = brandFindings(url.toLowerCase(), [url], '');
  const findings = [...ur.findings, ...brands.findings];
  const { score, level, confidence, categories, signals } = aggregate(findings, 'balanced');
  return {
    risk_score: score,
    risk_level: level,
    confidence,
    findings,
    categories,
    signals,
    brands_mentioned: brands.brands,
    url,
    host: ur.host,
    trusted: ur.trusted,
  };
}

export const FEATURE_CATALOG = [
  {
    group: 'Detection engine',
    items: [
      { name: 'Multi-signal scoring', detail: 'Rules, headers, URLs, brands, structure, and ML combined with per-category caps' },
      { name: 'Shared rules pack v' + (rules.version || '2'), detail: 'Same JSON rules as the desktop app and Chrome extension' },
      { name: 'Campaign keyword detection', detail: 'Cloud storage, invoice, tech support, crypto wallet, tax, QR quishing, and more' },
      { name: 'Regex pattern intel', detail: 'IP URLs, shorteners, punycode, free-host login paths, dangerous URI schemes' },
      { name: 'Sensitivity modes', detail: 'Quiet / Balanced / Strict thresholds for personal vs SOC-style use' },
      { name: 'Diminishing-return scoring', detail: 'Prevents one noisy category from maxing the risk meter alone' },
    ],
  },
  {
    group: 'Brand & identity defense',
    items: [
      { name: 'Brand impersonation graph', detail: 'PayPal, Microsoft, Apple, Amazon, Google, Netflix, banks, crypto, tax agencies' },
      { name: 'Typosquat distance checks', detail: 'Levenshtein lookalikes against official brand domains' },
      { name: 'Display-name spoof detection', detail: 'Embedded emails and brand names that do not match From' },
      { name: 'Free-mail brand spoof', detail: '“PayPal Support” from gmail/yahoo-style senders' },
      { name: 'Reply-To domain drift', detail: 'Flags when replies go to a different domain' },
    ],
  },
  {
    group: 'URL forensics',
    items: [
      { name: 'IP-literal hosts', detail: 'http://1.2.3.4 style phishing kits' },
      { name: 'Punycode / IDN hosts', detail: 'xn-- lookalike internationalized domains' },
      { name: 'Abuse-prone TLDs', detail: '.xyz .top .tk .zip and other high-abuse zones' },
      { name: 'Free-host login pages', detail: 'github.io / netlify / vercel paths that look like auth' },
      { name: 'Deep subdomain chains', detail: 'paypal.com.evil.example style spoofs' },
      { name: 'URL userinfo spoofs', detail: 'http://legit@evil.com redirect tricks' },
      { name: 'Href ≠ visible domain', detail: 'HTML anchors that lie about where they go' },
      { name: 'Standalone URL inspector', detail: 'Scan a single link without a full email' },
    ],
  },
  {
    group: 'Machine learning',
    items: [
      { name: 'On-device ML ensemble (web)', detail: 'Logistic model over engineered threat features — runs in your browser, no upload' },
      { name: 'ML confidence readout', detail: 'Probability + feature contribution for transparency' },
      { name: 'Desktop DistilBERT classifier', detail: 'Optional local transformer model in the Streamlit Threat Console' },
      { name: 'Hybrid fusion', detail: 'ML boosts rules only when the ensemble agrees — fewer lonely false positives' },
    ],
  },
  {
    group: 'Browser extension',
    items: [
      { name: 'Real-time URL badge', detail: '!! / ! / ? toolbar badge as you browse' },
      { name: 'Page content shield', detail: 'Scans visible text (Gmail/SPA aware)' },
      { name: 'Credential form shield', detail: 'Intercepts password submits on risky hosts' },
      { name: 'Link hover intel', detail: 'Outlines risky links and shows risk tooltips' },
      { name: 'Allowlist / Trust site', detail: 'Quiet your intranet or known-good domains' },
      { name: 'Sensitivity + notifications', detail: 'Popup and full options page' },
      { name: 'Local scan stats', detail: 'Pages scanned and threats flagged stay on-device' },
    ],
  },
  {
    group: 'Desktop Threat Console',
    items: [
      { name: 'Branded Streamlit console', detail: 'Cyan→purple UI matched to the PhishGuard logo' },
      { name: 'Batch email scan', detail: 'Separate messages with --- for bulk triage' },
      { name: 'Local history', detail: 'Saved only as .phishguard_history.json on disk' },
      { name: 'Branded PDF reports', detail: 'Export findings, playbooks, and URL forensics' },
      { name: 'Response playbooks', detail: 'CRITICAL / HIGH / MEDIUM / LOW action guides' },
      { name: 'Safe reply templates', detail: 'One-click style responses for unsolicited mail' },
    ],
  },
  {
    group: 'Privacy & product surface',
    items: [
      { name: '100% local analysis', detail: 'Email text never leaves the browser/device for scoring' },
      { name: 'No cloud phishing API required', detail: 'Works offline after assets load' },
      { name: 'Live portfolio demo', detail: 'This page — full multi-signal engine in-browser' },
      { name: 'Chrome MV3 extension pack', detail: 'One-click zip download from this page — load unpacked in Chrome' },
      { name: 'Shared rules pipeline', detail: 'copy:rules keeps site + desktop definitions aligned' },
    ],
  },
];

export default { analyzeEmail, analyzeUrlOnly, FEATURE_CATALOG };
