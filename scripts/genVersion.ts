import fs from 'fs';
import path from 'path';
import { getProjectRootDir, getPackageJsonVersion } from './utils';

const rootDir = getProjectRootDir();
const currentVersion = getPackageJsonVersion();

const versionFilePath = path.join(rootDir, 'components/version/index.ts');
const versionFileContent = fs.readFileSync(versionFilePath, 'utf-8');

fs.writeFileSync(
    versionFilePath,
    versionFileContent.replace(/\d+\.\d+\.\d+/, currentVersion),
);
