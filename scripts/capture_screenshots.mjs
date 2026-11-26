// Automated Screenshot Capture Script using Headless Chrome
// Renders the 4 authentic scenes listed in shots.json

import { execSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('..', import.meta.url));
const shotsFile = join(here, 'shots.json');
const shots = JSON.parse(readFileSync(shotsFile, 'utf8'));

mkdirSync(join(here, 'screenshots'), { recursive: true });

// Start local server on port 8092
const server = spawn('node', [join(here, 'serve.ts'), '--port', '8092'], {
  stdio: 'inherit',
});

// Wait for server to start
await new Promise((r) => setTimeout(r, 1500));

try {
  for (const shot of shots) {
    const targetUrl = `http://localhost:8092/${shot.path}`;
    const outPath = join(here, 'screenshots', shot.file);
    const width = shot.viewport?.width || 1280;
    const height = shot.viewport?.height || 800;

    process.stdout.write(`Capturing ${shot.file} (${width}x${height}) from ${targetUrl}...\n`);

    const chromeCmd = [
      'google-chrome-stable',
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      `--window-size=${width},${height}`,
      '--hide-scrollbars',
      '--virtual-time-budget=3000',
      `--screenshot=${outPath}`,
      `"${targetUrl}"`,
    ].join(' ');

    execSync(chromeCmd, { stdio: 'inherit' });

    const size = statSync(outPath).size;
    process.stdout.write(`Saved ${shot.file} (${(size / 1024).toFixed(1)} KiB)\n`);
    if (size > 262144) {
      console.warn(`WARNING: ${shot.file} exceeds 256 KiB cap (${size} bytes)!`);
    }
  }
} finally {
  server.kill('SIGTERM');
}

process.stdout.write('All screenshots captured successfully!\n');
