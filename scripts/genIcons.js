import { readdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

import { SVG_COMPONENT_TMPLATE } from './constants.js';
import optimizeSvg from './optimizeSvg.js';
import { getProjectRootDir, stringToCamelCase } from './utils.js';

const rootDir = getProjectRootDir();
const outputPath = join(rootDir, './components/icon');
const exportAllIconPath = join(
    rootDir,
    './docs/.vitepress/theme/IconDoc/icons.js',
);
const iconFileBase = join(rootDir, './icons');
const iconFiles = readdirSync(iconFileBase);

function genExportAllIconFile(iconNames) {
    const content = iconNames
        .map(
            (item) =>
                `export { default as ${item} } from '../../../../components/icon/${item}';`,
        )
        .join('\n');

    writeFileSync(exportAllIconPath, content);
}

function genIconIndex(iconNames) {
    const content = iconNames.map(
        (item) => `export { default as ${item} } from './${item}';`,
    );
    writeFileSync(`${outputPath}/index.ts`, content.join('\n'));
}

function gen() {
    const svgDatas = optimizeSvg(
        iconFiles.map((item) => join(iconFileBase, item)),
    );
    const iconNames = [];
    for (const { fileName, data } of svgDatas) {
        const iconName = stringToCamelCase(basename(fileName, '.svg'));
        iconNames.push(iconName);

        let attrs = '';
        if (iconName.startsWith('Loading')) {
            attrs = 'spin';
        }

        writeFileSync(
            `${outputPath}/${iconName}.tsx`,
            SVG_COMPONENT_TMPLATE.replace('SVG', data).replace('ATTRS', attrs),
        );
    }

    genExportAllIconFile(iconNames);
    genIconIndex(iconNames);
}

gen();
