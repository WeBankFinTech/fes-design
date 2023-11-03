import fs from 'fs';
import path from 'path';
import { loadJsonFile } from './utils.mjs';

const rootDir = process.cwd();
const packageJsonPath = path.join(rootDir, './package.json');
const packageJson = loadJsonFile(packageJsonPath);
const currentVersion = packageJson.version;

const versionFilePath = path.join(rootDir, 'components/version/index.ts');
const versionFileContent = fs.readFileSync(versionFilePath, 'utf-8');

fs.writeFileSync(
    versionFilePath,
    versionFileContent.replace(/\d+\.\d+\.\d+/, currentVersion),
);
