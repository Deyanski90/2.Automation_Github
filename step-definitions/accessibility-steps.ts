import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { AccessibilityPage } from '../pages/accessibility-page';
import { writeAccessibilityReport, summarizeViolations } from '../support/accessibility-helper';
import fs from 'fs';

let config: any;
let results: Array<{ page: string; reportPath: string; summary: any }> = [];

// Increase default timeout for accessibility runs (network + axe processing can take longer)
setDefaultTimeout(60 * 1000);

Given('accessibility configuration is loaded', async function() {
  const cfgPath = require('path').resolve(process.cwd(), 'config', 'accessibility.config.json');
  config = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  if (!config || !Array.isArray(config.pages)) config = { pages: [] };
});

When('I run accessibility checks for each configured page', async function() {
  const Accessibility = require('../pages/accessibility-page').AccessibilityPage;
  const pageObj = new Accessibility(this.page);

  for (const p of config.pages) {
    await pageObj.goto(p.path);
    await pageObj.injectAxe();
    // Build options to pass to axe.run to exclude selectors
    const options: any = {};
    if (p.excludeSelectors && p.excludeSelectors.length) {
      options.exclude = p.excludeSelectors.map((s: string) => ({ type: 'css', selector: s }));
    }
    if (p.disableRules && Array.isArray(p.disableRules) && p.disableRules.length) {
      options.rules = {};
      for (const r of p.disableRules) options.rules[r] = { enabled: false };
    }
    const result = await pageObj.runAxe(options);
    const reportPath = writeAccessibilityReport(p.name, result);
    const summary = summarizeViolations(result);
    results.push({ page: p.name, reportPath, summary });
  }
});

Then('detailed accessibility reports should be generated', async function() {
  if (!results.length) throw new Error('No accessibility results generated');
  // Fail the step if any violations with impact 'critical' or 'serious' exist
  const problematic = results.filter(r => (r.summary || []).some((v: any) => v.impact === 'critical' || v.impact === 'serious'));
  console.log('Accessibility run summary:');
  for (const r of results) {
    console.log(`- Page: ${r.page}`);
    console.log(`  report: ${r.reportPath}`);
    console.log(`  violations: ${r.summary.length}`);
  }

  if (problematic.length) {
    const details = problematic.map(p => ({ page: p.page, violations: p.summary }));
    throw new Error(`Accessibility issues found on pages: ${JSON.stringify(details, null, 2)}`);
  }
});
