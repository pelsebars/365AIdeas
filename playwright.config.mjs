import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
  globalTimeout: 5 * 60 * 1000,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', {open: 'never'}]],
  use: {baseURL: 'http://127.0.0.1:3000', trace: 'retain-on-failure', screenshot: 'only-on-failure'},
  projects: [
    {name: 'desktop', use: {browserName: 'chromium', viewport: {width: 1280, height: 900}}},
    {name: 'mobile', use: {browserName: 'chromium', viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true}},
  ],
  webServer: {command: 'python3 -m http.server 3000 --bind 127.0.0.1', url: 'http://127.0.0.1:3000', reuseExistingServer: !process.env.CI},
});
