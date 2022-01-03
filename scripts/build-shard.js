/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const json = require('@rollup/plugin-json');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const vuePlugin = require('rollup-plugin-vue');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');
const postcss = require('rollup-plugin-postcss');

const SOURCE_PATH = path.join(__dirname, '../components/index.js');
const OUTPUT_DIR = path.join(__dirname, '../dist');

const getRollupConfig = (config = {}) => ({
    input: SOURCE_PATH,
    external: ['vue'],
    plugins: [
        json(),
        nodeResolve({
            extensions: ['.js', '.vue', '.jsx', '.json'],
        }),
        vuePlugin({
            preprocessStyles: false,
            target: 'browser',
        }),
        commonjs(),
        babel.babel({
            targets: 'defaults, Chrome >= 56, not IE 11',
            babelHelpers: 'runtime',
            presets: ['@babel/env'],
            plugins: [
                [
                    '@vue/babel-plugin-jsx',
                    {
                        enableObjectSlots: false,
                    },
                ],
                ['@babel/plugin-transform-runtime', { useESModules: true }],
            ],
        }),
        postcss({
            extract: false,
        }),
    ],
    ...config,
});

module.exports = {
    OUTPUT_DIR,
    SOURCE_PATH,
    getRollupConfig,
};
