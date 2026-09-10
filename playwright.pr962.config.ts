import { defineConfig } from '@playwright/test'

// PR #962 验证专用配置：5173 被其他应用（code-agent-scheduler web）占用时使用独立端口
export default defineConfig({
    testDir: './e2e',
    timeout: 180 * 1000,
    use: {
        baseURL: 'http://localhost:5199',
    },
    webServer: {
        command: 'npx vitepress dev docs --port 5199',
        port: 5199,
        reuseExistingServer: true,
    },
})
