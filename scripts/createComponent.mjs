/* eslint-disable @typescript-eslint/no-var-requires */

import { join } from 'path';
import pkg from 'fs-extra';

const { pathExistsSync, outputFileSync, copySync } = pkg;

function hyphenate(str) {
    return str.replace(/\B([A-Z])/g, '-$1').toLowerCase();
}

function getCamel(str) {
    str = str.replace(/-([a-z])/g, (keb, item) => item.toUpperCase());
    return str[0].toUpperCase() + str.slice(1);
}

const componentName = hyphenate(process.argv[2]);

const rootPath = process.cwd();
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

    // index.ts
    const indexTpl = `
    import { withInstall } from '../_util/withInstall';
import COMPONENT_CAMEL_NAME from './COMPONENT_NAME';
import type { SFCWithInstall } from '../_util/interface';

type COMPONENT_CAMEL_NAMEType = SFCWithInstall<typeof COMPONENT_CAMEL_NAME>;

export const FCOMPONENT_CAMEL_NAME = withInstall<COMPONENT_CAMEL_NAMEType>(
    COMPONENT_CAMEL_NAME as COMPONENT_CAMEL_NAMEType,
);

export default FCOMPONENT_CAMEL_NAME;
`;
    outputFileSync(
        join(componentPath, 'index.ts'),
        indexTpl
            .replaceAll('COMPONENT_CAMEL_NAME', getCamel(componentName))
            .replaceAll('COMPONENT_NAME', componentName),
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
