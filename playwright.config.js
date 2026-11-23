const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:1234',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  // Automatically start Parcel dev server before tests if not already running!
  webServer: {
    command: 'npm start',
    url: 'http://localhost:1234',
    reuseExistingServer: true,
    timeout: 30000,
  },
  projects: [
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
});
