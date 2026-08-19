import { defineConfig, devices } from "@playwright/test";
const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:4173";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 15_000,
  expect: { timeout: 5_000 },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "reports/results.json" }],
  ],
  use: { baseURL, trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "api", testMatch: /api\/.*\.spec\.ts/ },
    {
      name: "ui",
      testMatch: /ui\/.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm start",
    url: `${baseURL}/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
