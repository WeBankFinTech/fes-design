// 关闭 import 规则
/* eslint import/no-extraneous-dependencies: 0 */

const path = require('path');
const rollup = require('rollup');
const babel = require('@rollup/plugin-babel');
const vuePlugin = require('rollup-plugin-vue');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

const injectCss = require('./injectcss');

async function compiler(codePath, outputDir) {
    const extname = path.extname(codePath);
    const outputPath = path.join(outputDir, `${path.basename(codePath, extname)}.js`);
    const bundle = await rollup.rollup({
        input: codePath,
        onwarn(warning, warn) {
            // 跳过未使用模块的警告（tree-shaking 会将其移除）
            if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;

            // Use default for everything else
            warn(warning);
        },
        external: (id) => {
            if (id.indexOf(codePath) !== -1) {
                return false;
            }
            return true;
        },
        plugins: [
            nodeResolve(),
            vuePlugin({
                preprocessStyles: false,
                target: 'browser',
            }),
            injectCss(),
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
        ],
    });

    await bundle.write({
        file: outputPath,
        format: 'esm',
    });

    // closes the bundle
    await bundle.close();
}

module.exports = compiler;
