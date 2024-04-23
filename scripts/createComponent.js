// 使用方式: npm run gen:component component-name
import { join } from 'node:path';
import process from 'node:process';
import { pathExistsSync, outputFileSync, copySync } from 'fs-extra';
import { INDEX_TPL } from './constants.js';
import { getProjectRootDir } from './utils.js';

function hyphenate(str) {
    return str.replace(/\B([A-Z])/g, '-$1').toLowerCase();
}

function getCamel(str) {
    str = str.replace(/-([a-z])/g, (keb, item) => item.toUpperCase());
    return str[0].toUpperCase() + str.slice(1);
}

const componentName = hyphenate(process.argv[2]);

const rootPath = getProjectRootDir();
const componentsPath = join(rootPath, 'components');
const componentPath = join(componentsPath, componentName);
const docPath = join(
    rootPath,
    'docs',
    'zh',
    'components',
    `${componentName}.md`,
);

// 这里不进行组件导出操作，因为有些组件内部使用不需要导出

if (pathExistsSync(join(componentsPath, componentName))) {
    console.log(`组件：${componentName} 已存在`);
    process.exit(0);
} else {
    // write docs
    outputFileSync(docPath, `# ${componentName}`);

    outputFileSync(
        join(componentPath, 'index.ts'),
        INDEX_TPL.replace(
            /COMPONENT_CAMEL_NAME/g,
            getCamel(componentName),
        ).replace(/COMPONENT_NAME/g, componentName),
    );

    outputFileSync(
        join(componentPath, `${componentName}.vue`, ''),
        '<template></template>\n<script></script>',
    );

    // test
    outputFileSync(
        join(componentPath, '__tests__', `${componentName}.ts`),
        "import { mount } from '@vue/test-utils'",
    );

    copySync(join(rootPath, 'scripts/styleTpl'), join(componentPath, 'style'));
}
