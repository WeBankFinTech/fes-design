import fs from 'node:fs';
import path from 'node:path';
import { getProjectRootDir, getPackageJsonVersion } from './utils.js';

const rootDir = getProjectRootDir();
const currentVersion = getPackageJsonVersion();

const versionFilePath = path.join(rootDir, 'components/version/index.ts');
const versionFileContent = fs.readFileSync(versionFilePath, 'utf-8');

fs.writeFileSync(
    versionFilePath,
    versionFileContent.replace(/\d+\.\d+\.\d+/, currentVersion),
);
