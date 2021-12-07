// 关闭 import 规则
/* eslint import/no-extraneous-dependencies: 0 */
const fse = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const json = require('@rollup/plugin-json');
const commonjs = require('@rollup/plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const { minify } = require('terser');
const csso = require('csso');

const { compilerCss } = require('./compilerCss');

const SOURCE = path.join(__dirname, '../es/index.js');
const STYLE_SOURCE = path.join(__dirname, '../es/style.js');
const OUTPUT_DIR = path.join(__dirname, '../dist');

fse.removeSync(OUTPUT_DIR);
fse.mkdirsSync(OUTPUT_DIR);

async function compiler() {
    const bundle = await rollup.rollup({
        input: SOURCE,
        plugins: [
            json(),
            commonjs(),
            nodeResolve({
                extensions: ['.js', '.vue', '.jsx', '.json'],
            }),
            postcss({
                // plugins: [
                //   autoprefixer(),
                // ],
                extract: false,
            }),
        ],
    });
    const outputFilePath = path.join(OUTPUT_DIR, 'fesDesign.js');
    await bundle.write({
        file: outputFilePath,
        format: 'umd',
        name: 'FesDesign',
        exports: 'named',
    });
    const compressResult = await minify(fse.readFileSync(outputFilePath, 'utf-8'), { sourceMap: false });
    fse.outputFileSync(path.join(OUTPUT_DIR, 'fesDesign.min.js'), compressResult.code);
}

async function compilerCSS() {
    const outputFilePath = path.join(OUTPUT_DIR, 'fesDesign.css');
    await compilerCss(STYLE_SOURCE, outputFilePath);
    const compressResult = csso.minify(fse.readFileSync(outputFilePath, 'utf-8'));
    fse.outputFileSync(path.join(OUTPUT_DIR, 'fesDesign.min.css'), compressResult.css);
}


compiler();
compilerCSS();
