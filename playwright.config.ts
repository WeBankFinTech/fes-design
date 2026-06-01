import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 180 * 1000,
    use: {
        baseURL: 'http://localhost:5173',
    },
    webServer: {
        command: 'pnpm run docs:dev',
        port: 5173,
        reuseExistingServer: true,
    },
});