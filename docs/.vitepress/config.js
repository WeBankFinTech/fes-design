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

const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : '/';

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
            // lodash-es 模块是 esm，ssr 渲染的时候编译成 cjs 的引入方式，会引发 nodejs 的模块加载异常错误
            noExternal: ['lodash-es'],
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
        logo: `${BASE_URL}images/fes-logo.svg`,
        nav: navbar.zh,
        sidebar: sidebar.zh,
    },
};
