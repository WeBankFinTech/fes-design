import path from 'node:path';
import { rollup } from 'rollup';
import fse from 'fs-extra';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';

async function compilerCss(entryPath, outputPath) {
    const bundle = await rollup({
        input: entryPath,
        plugins: [
            nodeResolve({
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
            }),
            postcss({
                modules: false,
                extract: true,
                plugins: [autoprefixer],
            }),
        ],
        onwarn(warning, warn) {
            if (warning.code === 'FILE_NAME_CONFLICT') return;
            warn(warning);
        },
    });
    await bundle.write({
        file: outputPath,
    });
    await bundle.close();
}

async function compilerStyleDir(codePath, outputDir) {
    fse.copySync(codePath, outputDir);

    const jsIndexPath = path.join(codePath, 'index.ts');
    if (fse.existsSync(jsIndexPath)) {
        fse.moveSync(
            path.join(outputDir, 'index.ts'),
            path.join(outputDir, 'index.js'),
        );
        const cssEntryPath = path.join(outputDir, 'css.js');
        fse.outputFileSync(
            cssEntryPath,
            fse.readFileSync(jsIndexPath, 'utf-8').replace(/\.less/g, '.css'),
        );
    }

    const lessIndexPath = path.join(codePath, 'index.less');
    if (fse.existsSync(lessIndexPath)) {
        const cssFileName = path.join(outputDir, 'index.css');
        compilerCss(lessIndexPath, cssFileName);
    }
}

export { compilerStyleDir, compilerCss };
