import path from 'path';
import fse from 'fs-extra';
import { rollup } from 'rollup';
import replace from '@rollup/plugin-replace';
import { minify } from 'terser';

import { getRollupConfig, OUTPUT_DIR } from './build-shard.mjs';

fse.mkdirsSync(OUTPUT_DIR);

async function compiler() {
    const rollupConfig = getRollupConfig();
    rollupConfig.plugins.push(
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
            preventAssignment: true,
        }),
    );
    const bundle = await rollup(rollupConfig);
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
