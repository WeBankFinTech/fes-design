// 关闭 import 规则
/* eslint import/no-extraneous-dependencies: 0 */
const fse = require('fs-extra');
const path = require('path');
const rollup = require('rollup');

const { getRollupConfig, OUTPUT_DIR } = require('./build-shard');

fse.mkdirsSync(OUTPUT_DIR);

async function compiler() {
    const bundle = await rollup.rollup(getRollupConfig());
    const outputFilePath = path.join(OUTPUT_DIR, 'fes-design.esm-browser.js');
    await bundle.write({
        file: outputFilePath,
        format: 'esm',
    });
}

compiler();
