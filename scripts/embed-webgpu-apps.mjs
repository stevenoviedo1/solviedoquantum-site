/**
 * Build planetary-webgpu + nanoverse-archive with site subpath bases
 * and copy dist → public/planetary and public/nanoverse.
 *
 * Usage (from solviedoquantum-site):
 *   node scripts/embed-webgpu-apps.mjs
 */
import { execSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  readdirSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, '..');
const home = join(siteRoot, '..');

const apps = [
  {
    name: 'planetary',
    src: join(home, 'planetary-webgpu'),
    base: '/planetary/',
    dest: join(siteRoot, 'public', 'planetary'),
    copyApi: true,
  },
  {
    name: 'nanoverse',
    src: join(home, 'nanoverse-archive'),
    base: '/nanoverse/',
    dest: join(siteRoot, 'public', 'nanoverse'),
    copyApi: false,
  },
];

function run(cmd, cwd, env = {}) {
  console.log(`\n> ${cmd}  (cwd: ${cwd})`);
  execSync(cmd, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, ...env },
    shell: true,
  });
}

for (const app of apps) {
  if (!existsSync(app.src)) {
    console.error(`Missing source: ${app.src}`);
    process.exit(1);
  }
  if (!existsSync(join(app.src, 'node_modules'))) {
    run('npm install', app.src);
  }
  run('npm run build', app.src, { SITE_BASE: app.base });

  const dist = join(app.src, 'dist');
  if (!existsSync(dist)) {
    console.error(`Build produced no dist: ${dist}`);
    process.exit(1);
  }

  rmSync(app.dest, { recursive: true, force: true });
  mkdirSync(app.dest, { recursive: true });
  cpSync(dist, app.dest, { recursive: true });
  const n = readdirSync(app.dest, { recursive: true }).length;
  console.log(`Copied ${app.name} → ${app.dest} (${n} entries)`);

  if (app.copyApi) {
    const apiSrc = join(app.src, 'api');
    const apiDest = join(siteRoot, 'api');
    if (existsSync(apiSrc)) {
      mkdirSync(apiDest, { recursive: true });
      cpSync(apiSrc, apiDest, { recursive: true });
      console.log(`Copied API handlers → ${apiDest}`);
    }
  }
}

console.log('\nDone. Embedded apps ready under public/planetary and public/nanoverse.');
