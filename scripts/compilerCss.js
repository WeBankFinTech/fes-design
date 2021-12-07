// 关闭 import 规则
/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path');
const rollup = require('rollup');
const fse = require('fs-extra');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const postcss = require('rollup-plugin-postcss');


async function compilerCss(entryPath, outputPath) {
    const bundle = await rollup.rollup({
        input: entryPath,
        plugins: [
            nodeResolve(),
            postcss({
                modules: false,
                extract: true,
                plugins: [require('autoprefixer')],
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

    const jsIndexPath = path.join(codePath, 'index.js');
    if (fse.existsSync(jsIndexPath)) {
        const cssEntryPath = path.join(outputDir, 'css.js');
        fse.outputFileSync(cssEntryPath, fse.readFileSync(jsIndexPath, 'utf-8').replace(/\.less/g, '.css'));
    }

    const lessIndexPath = path.join(codePath, 'index.less');
    if (fse.existsSync(lessIndexPath)) {
        const cssFileName = path.join(outputDir, 'index.css');
        compilerCss(lessIndexPath, cssFileName);
    }
}

module.exports = {
    compilerStyleDir,
    compilerCss,
};
