import path from 'node:path';
import fse from 'fs-extra';
import { rollup } from 'rollup';

import { getRollupConfig, OUTPUT_DIR } from './build-shard.js';

fse.mkdirsSync(OUTPUT_DIR);

async function compiler() {
    const bundle = await rollup(getRollupConfig());
    const outputFilePath = path.join(OUTPUT_DIR, 'fes-design.esm-browser.js');
    await bundle.write({
        file: outputFilePath,
        format: 'esm',
    });
}

compiler();
