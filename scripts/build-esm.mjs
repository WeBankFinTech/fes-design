import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import compiler from './esm-jsc.mjs';
import { compilerStyleDir } from './compilerCss.mjs';

const rootDir = process.cwd();
const SOURCE = path.join(rootDir, './components');
const OUTPUT_DIR = path.join(rootDir, './es');

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
