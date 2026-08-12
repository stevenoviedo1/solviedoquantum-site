/**
 * Cosmic Radio beacon vault — public archive (not an RF uplink).
 */

/** @type {{ beacons: any[], lastByIp: Map<string, number> }} */
function store() {
  const g = globalThis;
  if (!g.__wwBeacons) {
    g.__wwBeacons = { beacons: [], lastByIp: new Map() };
  }
  return g.__wwBeacons;
}

const BLOCK = [/\bhttps?:\/\//i, /<\s*script/i];

function cleanText(t) {
  return String(t || '')
    .replace(/[\u0000-\u001f]/g, '')
    .trim()
    .slice(0, 280);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const s = store();

  if (req.method === 'GET' || req.method === 'HEAD') {
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        beacons: s.beacons.slice(0, 100),
        note: 'Archived on Earth for the cosmos — not an RF uplink to space.',
      }),
    );
  }

  if (req.method === 'POST') {
    const ip =
      String(req.headers['x-forwarded-for'] || '')
        .split(',')[0]
        ?.trim() ||
      req.socket?.remoteAddress ||
      'unknown';
    const now = Date.now();
    const last = s.lastByIp.get(ip) || 0;
    if (now - last < 4000) {
      res.statusCode = 429;
      return res.end(JSON.stringify({ error: 'Slow down — one beacon every few seconds.' }));
    }

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    }

    const text = cleanText(body?.text);
    if (text.length < 2) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Message too short' }));
    }
    if (BLOCK.some((r) => r.test(text))) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Message rejected by filter' }));
    }

    const beacon = {
      id: String(body?.id || '').slice(0, 32),
      hash: String(body?.hash || '').slice(0, 128),
      text,
      aim: String(body?.aim || 'mars').slice(0, 32),
      worldId: String(body?.worldId || 'earth').slice(0, 32),
      createdAt: String(body?.createdAt || new Date().toISOString()),
      handle: body?.handle ? String(body.handle).slice(0, 32) : undefined,
    };

    if (!beacon.id || !beacon.hash) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Missing id/hash' }));
    }

    if (!s.beacons.some((b) => b.id === beacon.id)) {
      s.beacons.unshift(beacon);
      if (s.beacons.length > 500) s.beacons.length = 500;
    }
    s.lastByIp.set(ip, now);

    res.statusCode = 201;
    return res.end(JSON.stringify({ ok: true, beacon }));
  }

  res.statusCode = 405;
  return res.end(JSON.stringify({ error: 'Method not allowed' }));
}
