/**
 * Proxy SatNOGS audio/waterfall so <audio> works same-origin.
 * Only allows known SatNOGS / Wasabi hostnames (no open SSRF).
 */

const ALLOWED = [
  's3.eu-central-1.wasabisys.com',
  'network-satnogs.freetls.fastly.net',
  'network.satnogs.org',
  'db-satnogs.freetls.fastly.net',
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,HEAD');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    return res.end('Method not allowed');
  }

  try {
    const raw = String(req.query?.url || '');
    if (!raw.startsWith('https://')) {
      res.statusCode = 400;
      return res.end('Invalid url');
    }
    const u = new URL(raw);
    if (!ALLOWED.some((h) => u.hostname === h || u.hostname.endsWith('.' + h))) {
      res.statusCode = 403;
      return res.end('Host not allowed');
    }

    const upstream = await fetch(u.toString(), {
      headers: { 'User-Agent': 'WalkableWorlds-CosmicRadio/1.2' },
    });
    if (!upstream.ok) {
      res.statusCode = upstream.status;
      return res.end(`Upstream ${upstream.status}`);
    }

    const type = upstream.headers.get('content-type') || 'application/octet-stream';
    res.setHeader('Content-Type', type);
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.statusCode = 200;
    return res.end(buf);
  } catch (e) {
    res.statusCode = 502;
    return res.end(e instanceof Error ? e.message : 'proxy failed');
  }
}
