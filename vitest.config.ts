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
    },
});
