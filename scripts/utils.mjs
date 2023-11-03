import fs from 'fs';

export function stringToCamelCase(str) {
    const re = /-(\w)/g;
    str = str.replace(re, ($0, $1) => $1.toUpperCase());
    return str[0].toUpperCase() + str.slice(1);
}

export function loadJsonFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
