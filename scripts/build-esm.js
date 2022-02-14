/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const compiler = require('./esm-jsc');
const { compilerStyleDir } = require('./compilerCss');

const SOURCE = path.join(__dirname, '../components');
const OUTPUT_DIR = path.join(__dirname, '../es');

fse.removeSync(OUTPUT_DIR);

async function main(source, outputDir) {
    const files = fs.readdirSync(source);
    for (const file of files) {
        const filePath = path.join(source, file);
        const stats = fs.lstatSync(filePath);
        if (stats.isDirectory(filePath) && !/__tests__/.test(file)) {
            if (file === 'style') {
                await compilerStyleDir(filePath, path.join(outputDir, file));
            } else {
                await main(filePath, path.join(outputDir, file));
            }
        } else if (stats.isFile(filePath)) {
            const extname = path.extname(filePath);
            if (['.js', '.jsx', '.ts', '.tsx', '.vue'].includes(extname)) {
                await compiler(filePath, outputDir);
            }
        }
    }
}

main(SOURCE, OUTPUT_DIR);
