import path from 'node:path';

import csso from 'csso';
import fse from 'fs-extra';

import { OUTPUT_DIR } from './build-shard.js';
import { compilerCss } from './compilerCss.js';
import { getProjectRootDir } from './utils.js';

const rootDir = getProjectRootDir();
const STYLE_SOURCE = path.join(rootDir, './components/_style.ts');

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
