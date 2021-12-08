// eslint-disable-next-line import/no-extraneous-dependencies
const vueJsx = require('@vitejs/plugin-vue-jsx');
const path = require('path');
const { navbar, sidebar } = require('./configs');
const {genComponentDoc} = require('./scripts/genComponentDoc');
const baseConfig = require('@vue/theme/config')


const ssrTransformCustomDir = () => ({
    props: [],
    needRuntime: true,
});

genComponentDoc();

const BASE_URL = process.env.NODE_ENV === 'production' ? '/s/wxmp-extension/we-design/' : '/';

module.exports = {
    base: BASE_URL,
    extends: baseConfig,
    lang: 'zh-CN',
    title: 'Fes Design',
    description: '微众银行中后台设计 Fes Design',
    vite: {
        define: {
            __VUE_OPTIONS_API__: false
        },
        server: {
            watch: {
                ignored: ['**/docs/.vitepress/components/**']
            }
        },
        optimizeDeps: {
            exclude: ['@vue/repl']
        },
        ssr: {
            external: ['@vue/repl']
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
                'fes-design': path.resolve(__dirname, '../../components'),
            },
        },
        json: {
            stringify: true
        },
        plugins: [
            vueJsx({}),
        ],
    },
    vue: {
        template: {
            ssr: true,
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
        highlight: baseConfig.highlight,
        logo: `${BASE_URL}images/fes-logo.png`,
        nav: navbar.zh,
        sidebar: sidebar.zh,
    },
};
