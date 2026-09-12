/**
 * Regenerates the brand assets from src/assets/logo.jpg (the original art on a navy background):
 *   src/assets/logo-hero.webp   transparent hero cutout (S + wordmark), edges feathered
 *   src/assets/mark.webp        transparent square S mark for nav / footer
 *   public/favicon.png, favicon-32.png, apple-touch-icon.png   square S crop on the dark bg
 *   public/og-image.jpg         1200x630 social preview
 *
 * Usage: node scripts/generate-logo-assets.mjs   (writes into the project; needs Playwright Chromium)
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src/assets/logo.jpg');
const OUT = process.argv[2] || path.join(ROOT, '.logo-assets-tmp'); fs.mkdirSync(OUT, { recursive: true });
const b64 = fs.readFileSync(SRC).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage();
const files = await page.evaluate(async ({ b64 }) => {
  const img = new Image(); img.src = 'data:image/jpeg;base64,' + b64; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
  const p = ctx.getImageData(0, 0, W, H).data;
  // black-to-alpha: navy background -> transparent, glow preserved
  const T = 58, FLOOR = 0.05;
  const out = ctx.createImageData(W, H); const q = out.data;
  for (let i = 0; i < p.length; i += 4) {
    const r = p[i], g = p[i + 1], b = p[i + 2]; const m = Math.max(r, g, b);
    let a = (m - T) / (255 - T); a = a < 0 ? 0 : a > 1 ? 1 : a; a = Math.pow(a, 0.85);
    if (a < FLOOR) { q[i] = q[i + 1] = q[i + 2] = 0; q[i + 3] = 0; continue; }
    const s = 1 / a; q[i] = Math.min(255, r * s); q[i + 1] = Math.min(255, g * s); q[i + 2] = Math.min(255, b * s); q[i + 3] = Math.round(a * 255);
  }
  const tc = document.createElement('canvas'); tc.width = W; tc.height = H; tc.getContext('2d').putImageData(out, 0, 0);
  const smooth = (t) => t * t * (3 - 2 * t);
  // crop + feather alpha toward the crop border with a superellipse (rounded-rect) falloff
  const cropFeather = (srcC, x, y, w, h, ow, oh, inner) => {
    const cc = document.createElement('canvas'); cc.width = ow; cc.height = oh;
    const cx = cc.getContext('2d'); cx.imageSmoothingQuality = 'high'; cx.drawImage(srcC, x, y, w, h, 0, 0, ow, oh);
    const id = cx.getImageData(0, 0, ow, oh); const d = id.data;
    for (let yy = 0; yy < oh; yy++) for (let xx = 0; xx < ow; xx++) {
      const dx = Math.abs((xx + 0.5) / ow * 2 - 1), dy = Math.abs((yy + 0.5) / oh * 2 - 1);
      const r = Math.pow(dx ** 4 + dy ** 4, 0.25);
      let m = 1; if (r >= 1) m = 0; else if (r > inner) m = 1 - smooth((r - inner) / (1 - inner));
      if (m < 1) { const i = (yy * ow + xx) * 4; d[i + 3] = Math.round(d[i + 3] * m); if (d[i + 3] === 0) { d[i] = d[i + 1] = d[i + 2] = 0; } }
    }
    cx.putImageData(id, 0, 0); return cc;
  };
  const crop = (srcC, x, y, w, h, ow, oh) => { const cc = document.createElement('canvas'); cc.width = ow; cc.height = oh; const cx = cc.getContext('2d'); cx.imageSmoothingQuality = 'high'; cx.drawImage(srcC, x, y, w, h, 0, 0, ow, oh); return cc; };
  const files = {};
  const HX = 30, HY = 250, HW = W - 60, HH = 760;
  const hero = cropFeather(tc, HX, HY, HW, HH, HW, HH, 0.84);
  files['logo-hero.webp'] = hero.toDataURL('image/webp', 0.84);
  files['logo-hero.png'] = hero.toDataURL('image/png');
  const MX = 120, MY = 300, MS = 540;
  files['mark.webp'] = cropFeather(tc, MX, MY, MS, MS, 160, 160, 0.88).toDataURL('image/webp', 0.9);
  const FX = 150, FY = 335, FS = 480;
  files['favicon.png'] = crop(c, FX, FY, FS, FS, 192, 192).toDataURL('image/png');
  files['favicon-32.png'] = crop(c, FX, FY, FS, FS, 32, 32).toDataURL('image/png');
  files['apple-touch-icon.png'] = crop(c, FX, FY, FS, FS, 180, 180).toDataURL('image/png');
  const og = document.createElement('canvas'); og.width = 1200; og.height = 630; const ox = og.getContext('2d');
  const grad = ox.createLinearGradient(0, 0, 1200, 630); grad.addColorStop(0, '#060a1c'); grad.addColorStop(1, '#000000');
  ox.fillStyle = grad; ox.fillRect(0, 0, 1200, 630);
  const glow = ox.createRadialGradient(330, 315, 20, 330, 315, 420); glow.addColorStop(0, 'rgba(56,189,248,0.22)'); glow.addColorStop(0.5, 'rgba(139,92,246,0.14)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
  ox.fillStyle = glow; ox.fillRect(0, 0, 1200, 630);
  ox.drawImage(cropFeather(tc, MX, MY, MS, MS, 560, 560, 0.88), 50, 35);
  ox.font = 'bold 92px system-ui, Segoe UI, sans-serif';
  const tg = ox.createLinearGradient(620, 0, 1150, 0); tg.addColorStop(0, '#67e8f9'); tg.addColorStop(1, '#a78bfa');
  ox.fillStyle = tg; ox.fillText('SolViedo', 620, 285);
  ox.font = '500 64px system-ui, Segoe UI, sans-serif'; ox.fillStyle = '#c4b5fd'; ox.fillText('Quantum', 624, 360);
  ox.font = '500 30px system-ui, Segoe UI, sans-serif'; ox.fillStyle = '#cbd5e1'; ox.fillText('Custom web apps · Games · Performance', 624, 430);
  ox.font = '26px system-ui, Segoe UI, sans-serif'; ox.fillStyle = '#64748b'; ox.fillText('solviedoquantum.com', 624, 480);
  files['og-image.jpg'] = og.toDataURL('image/jpeg', 0.88);
  return files;
}, { b64 });
for (const [n, u] of Object.entries(files)) fs.writeFileSync(path.join(OUT, n), Buffer.from(u.split(',')[1], 'base64'));
await browser.close();
console.log(fs.readdirSync(OUT).map(f => f + ' ' + fs.statSync(path.join(OUT, f)).size).join('\n'));
if (!process.argv[2]) {
  const dest = {
    'logo-hero.webp': 'src/assets/logo-hero.webp',
    'mark.webp': 'src/assets/mark.webp',
    'favicon.png': 'public/favicon.png',
    'favicon-32.png': 'public/favicon-32.png',
    'apple-touch-icon.png': 'public/apple-touch-icon.png',
    'og-image.jpg': 'public/og-image.jpg',
  };
  for (const [from, to] of Object.entries(dest)) fs.copyFileSync(path.join(OUT, from), path.join(ROOT, to));
  fs.rmSync(OUT, { recursive: true, force: true });
  console.log('Copied assets into src/assets and public/.');
}
