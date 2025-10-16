import { Page } from '@playwright/test';

export class AccessibilityPage {
  constructor(public page: Page) {}

  async goto(path: string) {
    const base = process.env.BASE_URL || 'https://www.saucedemo.com';
    await this.page.goto(base + path, { waitUntil: 'networkidle' });
  }

  async injectAxe(): Promise<void> {
    // Pull axe-core from node_modules and inject it into the page
    const axeSource = require('axe-core').source;
    await this.page.addScriptTag({ content: axeSource });
  }

  async runAxe(options: any = {}): Promise<any> {
    // eslint-disable-next-line no-undef
    return await this.page.evaluate(async (opts: any) => {
      // @ts-ignore - axe will be present in the window
      const results = await (window as any).axe.run(document, opts);
      return results;
    }, options);
  }
}
