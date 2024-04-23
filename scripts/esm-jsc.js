import path from 'node:path';
import { rollup } from 'rollup';
import babel from '@rollup/plugin-babel';
import vuePlugin from 'rollup-plugin-vue';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pluginRenameExtensions from '@betit/rollup-plugin-rename-extensions';

import { extensions } from './build-shard.js';
import injectCss from './injectcss.js';

const renameExtensions =
    pluginRenameExtensions.default || pluginRenameExtensions;

async function compiler(codePath, outputDir) {
    const extname = path.extname(codePath);
    const outputPath = path.join(
        outputDir,
        `${path.basename(codePath, extname)}.js`,
    );
    const bundle = await rollup({
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
            nodeResolve({
                extensions,
            }),
            renameExtensions({
                mappings: {
                    '.vue': '.js',
                    '.ts': '.js',
                    '.tsx': '.js',
                },
            }),
            vuePlugin({
                preprocessStyles: false,
                target: 'browser',
            }),
            injectCss(),
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
        ],
    });

    await bundle.write({
        file: outputPath,
        format: 'esm',
    });

    // closes the bundle
    await bundle.close();
}

export default compiler;
