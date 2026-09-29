import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.e2e.ts",
  reporter: [["list"], ["junit", { outputFile: "test-results/e2e-junit.xml" }]],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    timeout: 120_000,
  },
  use: {
    browserName: "chromium",
    headless: true,
  },
});
