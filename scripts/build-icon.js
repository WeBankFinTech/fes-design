import path from 'node:path';
import fse from 'fs-extra';
import { rollup } from 'rollup';
import { getProjectRootDir } from './utils.js';

import { getRollupConfig, OUTPUT_DIR } from './build-shard.js';

const rootDir = getProjectRootDir();
const SOURCE_PATH = path.join(rootDir, './components/icon/index.ts');

fse.mkdirsSync(OUTPUT_DIR);

async function compiler() {
    const bundle = await rollup(
        getRollupConfig({
            input: SOURCE_PATH,
        }),
    );
    const outputFilePath = path.join(OUTPUT_DIR, 'fes-design.icon-browser.js');
    await bundle.write({
        file: outputFilePath,
        format: 'esm',
    });
}

compiler();
