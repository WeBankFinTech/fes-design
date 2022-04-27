/* eslint-disable @typescript-eslint/no-var-requires */

const csso = require('csso');
const fse = require('fs-extra');
const path = require('path');

const { compilerCss } = require('./compilerCss');
const { OUTPUT_DIR } = require('./build-shard');

const STYLE_SOURCE = path.join(__dirname, '../components/_style.ts');

fse.mkdirsSync(OUTPUT_DIR);

async function main() {
    const outputFilePath = path.join(OUTPUT_DIR, 'fes-design.css');
    await compilerCss(STYLE_SOURCE, outputFilePath);
    const compressResult = csso.minify(
        fse.readFileSync(outputFilePath, 'utf-8'),
    );
    fse.outputFileSync(
        path.join(OUTPUT_DIR, 'fes-design.min.css'),
        compressResult.css,
    );
}

main();
