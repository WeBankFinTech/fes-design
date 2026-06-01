import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        globals: true,
        include: ['components/**/__tests__/**/*.spec.ts'],
        setupFiles: [],
    },
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '.'),
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
});