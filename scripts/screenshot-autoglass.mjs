import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'screenshots');
const url = 'https://www.solviedoquantum.com/autoglass-shop/';

const browser = await chromium.launch();
const sizes = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-360', width: 360, height: 740 },
  { name: 'mobile-414', width: 414, height: 896 },
];

for (const s of sizes) {
  const context = await browser.newContext({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(outDir, `autoglass-${s.name}-top.png`),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(outDir, `autoglass-${s.name}-full.png`),
    fullPage: true,
  });
  // scroll to book section
  await page.locator('#book').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(outDir, `autoglass-${s.name}-book.png`),
    fullPage: false,
  });
  await context.close();
  console.log('done', s.name);
}

await browser.close();
console.log('all screenshots saved');
