import path from 'node:path';
import process from 'node:process';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

const resolve = (p: string) => path.resolve(process.cwd(), p);

export default defineConfig({
    plugins: [vue(), vueJsx()],
    test: {
        environment: 'jsdom',
        // docs demo 引用 @fesjs/fes-design —— 映射到本地源码 barrel，
        // 使 demoTest 挂载的是当前改动而非 node_modules 发布版
        alias: [
            {
                find: /^@fesjs\/fes-design\/icon$/,
                replacement: resolve('components/icon/index.ts'),
            },
            {
                find: /^@fesjs\/fes-design$/,
                replacement: resolve('components/index.ts'),
            },
            // message/content.vue 用 '../../../theme/IconDoc/icons.js'：
            // 源文件位置解析为 docs/theme/...（不存在），docs 站点靠 .temp
            // 副本位置巧合解析；demoTest 按源文件跑，需显式对齐
            {
                find: /theme\/IconDoc\/icons\.js$/,
                replacement: resolve('docs/.vitepress/theme/IconDoc/icons.js'),
            },
        ],
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
