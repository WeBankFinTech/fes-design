import path from 'node:path';
import process from 'node:process';

import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vitepress';
import { withPwa } from '@vite-pwa/vitepress';
import llmstxtPlugin from 'vitepress-plugin-llmstxt';
import { getProjectRootDir } from '../../scripts/utils.js';
import { genComponentDocWatch } from '../../scripts/genComponentDoc.js';
import { navbar, sidebar } from './configs/index';
import { pwa } from './pwa';

const rootDir = getProjectRootDir();

function ssrTransformCustomDir() {
    return {
        props: [],
        needRuntime: true,
    };
}

const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : '/';

// 开发模式，监听文档文件变更
if (process.env.NODE_ENV !== 'production') {
    genComponentDocWatch();
}

export default withPwa(
    defineConfig({
        pwa: pwa(),
        base: BASE_URL,
        lang: 'zh-CN',
        title: 'Fes Design',
        description: '微众银行中后台设计 Fes Design',
        appearance: false,
        // 配置图标
        head: [
            [
                'link',
                {
                    rel: 'icon',
                    href: '/logo.svg',
                },
            ],
        ],
        vite: {
            define: {
                __VUE_OPTIONS_API__: false,
            },
            server: {
                watch: {
                    ignored: ['**/docs/.vitepress/components/**'],
                },
            },
            optimizeDeps: {
                exclude: ['@vue/repl'],
            },
            ssr: {
                external: ['@vue/repl'],
                // lodash-es 模块是 esm，ssr 渲染的时候编译成 cjs 的引入方式，会引发 nodejs 的模块加载异常错误
                noExternal: ['lodash-es'],
            },
            resolve: {
                extensions: [
                    '.mjs',
                    '.js',
                    '.ts',
                    '.jsx',
                    '.tsx',
                    '.json',
                    '.vue',
                ],
                alias: {
                    '@fesjs/fes-design': path.resolve(rootDir, './components'),
                },
            },
            json: {
                stringify: true,
            },
            plugins: [vueJsx({}), llmstxtPlugin()],
            build: {
                chunkSizeWarningLimit: 1000,
            },
        },
        vue: {
            template: {
                compilerOptions: {
                    directiveTransforms: {
                        drag: ssrTransformCustomDir,
                        mousewheel: ssrTransformCustomDir,
                        sticky: ssrTransformCustomDir,
                    },
                },
            },
        },
        themeConfig: {
            logo: `${BASE_URL}images/fes-logo.svg`,
            socialLinks: [
                {
                    icon: 'github',
                    link: 'https://github.com/WeBankFinTech/fes-design',
                },
            ],
            nav: navbar.zh,
            sidebar: sidebar.zh,

            outline: {
                label: '本页目录',
                level: [2, 3],
            },

            search: {
                provider: 'local',
            },
        },
    }),
);
