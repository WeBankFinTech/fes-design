// 关闭 import 规则
/* eslint import/no-extraneous-dependencies: 0 */
const fse = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const { minify } = require('terser');

const { getRollupConfig, OUTPUT_DIR } = require('./build-shard');

fse.mkdirsSync(OUTPUT_DIR);

async function compiler() {
    const bundle = await rollup.rollup(getRollupConfig());
    const outputFilePath = path.join(OUTPUT_DIR, 'fes-design.js');

    await bundle.write({
        file: outputFilePath,
        format: 'umd',
        name: 'FesDesign',
        exports: 'named',
        globals: {
            vue: 'Vue',
        },
    });
    const compressResult = await minify(
        fse.readFileSync(outputFilePath, 'utf-8'),
        { sourceMap: false },
    );
    fse.outputFileSync(
        path.join(OUTPUT_DIR, 'fes-design.min.js'),
        compressResult.code,
    );
}

compiler();
