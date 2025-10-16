import fs from 'fs';
import path from 'path';
// Use require() for packages without types to avoid TS declaration errors at runtime
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const REPORTS_DIR = path.resolve(process.cwd(), 'reports', 'screenshots');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function saveAndCompareScreenshot(name: string, buffer: Buffer) {
  ensureDir(REPORTS_DIR);
  const baselineDir = path.join(REPORTS_DIR, 'baseline');
  const currentDir = path.join(REPORTS_DIR, 'current');
  const diffDir = path.join(REPORTS_DIR, 'diff');
  ensureDir(baselineDir);
  ensureDir(currentDir);
  ensureDir(diffDir);

  const baselinePath = path.join(baselineDir, name);
  const currentPath = path.join(currentDir, name);
  const diffPath = path.join(diffDir, name);

  fs.writeFileSync(currentPath, buffer);

  if (!fs.existsSync(baselinePath)) {
    // If no baseline exists, create one from current and return { createdBaseline: true }
    fs.writeFileSync(baselinePath, buffer);
    return { createdBaseline: true, baselinePath, currentPath, diffPath };
  }

  const baselineImg = PNG.sync.read(fs.readFileSync(baselinePath));
  const currentImg = PNG.sync.read(fs.readFileSync(currentPath));

  const { width, height } = baselineImg;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(baselineImg.data, currentImg.data, diff.data, width, height, { threshold: 0.1 });

  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  return { createdBaseline: false, numDiffPixels, baselinePath, currentPath, diffPath };
}
