/**
 * Proxy SatNOGS Network API (Node serverless on Vercel).
 * Avoids browser CORS blocking network.satnogs.org.
 * ESM export — package.json has "type": "module".
 */

const BASE = 'https://network.satnogs.org/api';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,HEAD');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'GET only' }));
  }

  try {
    const q = req.query || {};
    const norad = q.norad ? String(q.norad) : '';
    const limit = Math.min(30, Math.max(1, Number(q.limit) || 12));
    const status = q.status ? String(q.status) : '';

    const params = new URLSearchParams();
    params.set('format', 'json');
    params.set('limit', String(limit));
    if (norad) params.set('satellite__norad_cat_id', norad);
    if (status) params.set('status', status);

    const url = `${BASE}/observations/?${params.toString()}`;
    const upstream = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'WalkableWorlds-CosmicRadio/1.2',
      },
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      res.statusCode = upstream.status;
      return res.end(
        JSON.stringify({
          error: `SatNOGS HTTP ${upstream.status}`,
          detail: text.slice(0, 200),
        }),
      );
    }

    const data = await upstream.json();
    const list = Array.isArray(data) ? data : data.results || [];
    res.statusCode = 200;
    return res.end(JSON.stringify({ observations: list, count: list.length }));
  } catch (e) {
    res.statusCode = 502;
    return res.end(
      JSON.stringify({
        error: e instanceof Error ? e.message : 'SatNOGS proxy failed',
      }),
    );
  }
}
