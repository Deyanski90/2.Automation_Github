import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  timeout: 30000,
  use: {
    headless: true,
    baseURL: process.env.BASE_URL || 'http://localhost:3000'
  }
};

export default config;
