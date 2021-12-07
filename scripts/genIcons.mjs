/* eslint import/no-extraneous-dependencies: 0 */

import { join, basename } from 'path';
import { readdirSync, writeFileSync } from 'fs';

import optimizeSvg from './optimizeSvg';
import { stringToCamelCase } from './utils';

const outputPath = join(process.cwd(), './components/icon');
const exportAllIconPath = join(process.cwd(), './docs/.vitepress/theme/IconDoc/icons.js');
const iconFileBase = join(process.cwd(), './icons');
const iconFiles = readdirSync(iconFileBase);

const SVG_COMPONENT_TMPLATE = `
import IconWrapper from './IconWrapper';
import './style';

export default props => (
    <IconWrapper {...props} ATTRS>
        SVG
    </IconWrapper>
);
`;

function genExportAllIconFile(iconNames) {
    const content = iconNames.map(item => `export { default as ${item} } from '../../../../components/icon/${item}';`).join('\n');

    writeFileSync(exportAllIconPath, content);
}

function genIconIndex(iconNames) {
    const content = iconNames.map(item => `export { default as ${item} } from './${item}';`);
    writeFileSync(
        `${outputPath}/index.js`,
        content.join('\n'),
    );
}

function gen() {
    const svgDatas = optimizeSvg(iconFiles.map(item => join(iconFileBase, item)));
    const iconNames = [];
    // eslint-disable-next-line
    for (const { fileName, data } of svgDatas) {
        const iconName = stringToCamelCase(basename(fileName, '.svg'));
        iconNames.push(iconName);

        let attrs = '';
        if (iconName.startsWith('Loading')) {
            attrs = 'spin';
        }
        writeFileSync(
            `${outputPath}/${iconName}.jsx`,
            SVG_COMPONENT_TMPLATE.replace('SVG', data).replace('ATTRS', attrs),
        );
    }

    genExportAllIconFile(iconNames);
    genIconIndex(iconNames);
}

gen();
