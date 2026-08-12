export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,HEAD');
  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');
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
    const upstream = await fetch('https://api.open-notify.org/iss-now.json');
    if (!upstream.ok) {
      res.statusCode = upstream.status;
      return res.end(JSON.stringify({ error: `ISS API ${upstream.status}` }));
    }
    const data = await upstream.json();
    res.statusCode = 200;
    return res.end(JSON.stringify(data));
  } catch (e) {
    res.statusCode = 502;
    return res.end(
      JSON.stringify({
        error: e instanceof Error ? e.message : 'ISS proxy failed',
      }),
    );
  }
}
