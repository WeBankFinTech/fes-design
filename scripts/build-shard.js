import path from 'node:path';

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import vuePlugin from 'rollup-plugin-vue';
import { getProjectRootDir } from './utils.js';

const rootDir = getProjectRootDir();
const SOURCE_PATH = path.join(rootDir, './components/index.ts');
const OUTPUT_DIR = path.join(rootDir, './dist');

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.json'];

const getRollupConfig = (config = {}) => ({
    input: SOURCE_PATH,
    onwarn(warning, warn) {
        // 跳过未使用模块的警告（tree-shaking 会将其移除）
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
            return;
        }

        // Use default for everything else
        warn(warning);
    },
    external: ['vue'],
    plugins: [
        json(),
        nodeResolve({
            extensions,
        }),
        vuePlugin({
            preprocessStyles: false,
            target: 'browser',
        }),
        commonjs(),
        babel.babel({
            targets: 'defaults, Chrome >= 56, not IE 11',
            babelHelpers: 'runtime',
            extensions,
            presets: [
                '@babel/env',
                [
                    '@babel/preset-typescript',
                    {
                        allExtensions: true,
                        onlyRemoveTypeImports: true,
                        isTSX: true,
                        jsxPragma: 'h',
                        jsxPragmaFrag: 'Fragment',
                    },
                ],
            ],
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

export { OUTPUT_DIR, SOURCE_PATH, extensions, getRollupConfig };
