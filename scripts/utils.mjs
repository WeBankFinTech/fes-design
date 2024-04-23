import fs from 'fs';
import path from 'path';

export function stringToCamelCase(str) {
    const re = /-(\w)/g;
    str = str.replace(re, ($0, $1) => $1.toUpperCase());
    return str[0].toUpperCase() + str.slice(1);
}

export function loadJsonFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function getProjectRootDir() {
    return process.cwd();
}

export function getPackageJsonVersion() {
    const rootDir = getProjectRootDir();
    const packageJsonPath = path.join(rootDir, './package.json');
    const packageJson = loadJsonFile(packageJsonPath);
    return packageJson.version;
}
