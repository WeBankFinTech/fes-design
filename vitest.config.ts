import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
    plugins: [vue(), vueJsx()],
    test: {
        environment: 'jsdom',
        include: ['components/**/__tests__/**/*.spec.ts'],
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'json-summary'],
            // 组件源码为覆盖目标；测试自身/主题/语言包不统计
            include: ['components/**/*.{ts,tsx,vue}'],
            exclude: [
                'components/**/__tests__/**',
                'components/**/demos/**',
                'components/_theme/**',
                'components/locales/**',
                'components/style/**',
                'components/version/**',
                'components/**/*.d.ts',
                'components/components.ts',
                'components/index.ts',
                'components/preset.ts',
            ],
        },
    },
});
