import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    use: {
        baseURL: 'http://localhost:5174',
    },
    webServer: {
        command: 'pnpm run docs:dev',
        port: 5174,
        reuseExistingServer: false,
    },
});