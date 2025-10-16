import fs from 'fs';
import path from 'path';

const REPORT_DIR = path.resolve(process.cwd(), 'reports', 'accessibility');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function writeAccessibilityReport(pageName: string, result: any) {
  ensureDir(REPORT_DIR);
  const fileBase = `${Date.now()}-${pageName.replace(/[^a-z0-9-_]/gi, '_')}`;
  const jsonPath = path.join(REPORT_DIR, `${fileBase}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
  return jsonPath;
}

export function summarizeViolations(result: any) {
  const violations = result.violations || [];
  return violations.map((v: any) => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    help: v.help,
    nodes: v.nodes.map((n: any) => ({
      html: n.html,
      target: n.target,
      failureSummary: n.failureSummary
    }))
  }));
}
