import path from 'path';
import fse from 'fs-extra';
import { getHighlighter, Highlighter } from 'shiki';
import cheapWatch from 'cheap-watch';

import { getProjectRootDir } from '../../../scripts/utils';
import { SCRIPT_TEMPLATE, DEMO_ENTRY_FILE } from './constants';
import type { Stats } from 'fs';

interface CheapWatchFile {
    path: string;
    stats: Stats;
}

const rootDir = getProjectRootDir();
const CODE_PATH = path.join(
    rootDir,
    './docs/.vitepress/theme/components/demoCode.json',
);

function getDemoCode() {
    if (fse.existsSync(CODE_PATH)) {
        return JSON.parse(fse.readFileSync(CODE_PATH, 'utf-8'));
    }

    return {
        app: DEMO_ENTRY_FILE,
    };
}

const code = getDemoCode();

function genOutputPath(name: string) {
    return path.join(process.cwd(), `./docs/zh/components/${name}.md`);
}

function handleCompDoc(compCode: string, compName: string, demoName: string) {
    const codeName = `${compName}.${demoName}`;
    const codeSrc = encodeURIComponent(code[`${codeName}`]);
    const codeFormat = encodeURIComponent(code[`${codeName}-code`]);
    return compCode.replace(
        /<template>([\s\S]*)<\/template>/,
        (match, p1) =>
            `<template><ComponentDoc codeName="${codeName}" codeSrc="${codeSrc}" codeFormat="${codeFormat}"><ClientOnly>${p1}</ClientOnly></ComponentDoc></template>`,
    );
}

const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

function escapeHtml(html: string) {
    return html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr]);
}

let highlighter: Highlighter;
const highlight = async (code: string, lang = 'vue') => {
    if (!lang || lang === 'text') {
        return `<pre v-pre><code>${escapeHtml(code)}</code></pre>`;
    }
    if (!highlighter) {
        highlighter = await getHighlighter({
            theme: 'material-palenight',
        });
    }
    return highlighter
        .codeToHtml(code, { lang })
        .replace(/^<pre.*?>/, '<pre v-pre>');
};

async function genComponentExample(dir: string, name: string) {
    const output = genOutputPath(name);
    const indexPath = path.join(dir, 'index.md');
    if (!fse.existsSync(indexPath)) return;

    let fileContent = fse.readFileSync(indexPath, 'utf-8');

    const demos = fse.readdirSync(dir);
    const demoMDStrs: string[] = [];
    const scriptCode: {
        imports: string[];
        components: string[];
    } = {
        imports: [],
        components: [],
    };
    const tempCode = {};
    for (const filename of demos) {
        const fullPath = path.join(dir, filename);
        if (
            fse.statSync(fullPath).isFile() &&
            path.extname(fullPath) === '.vue'
        ) {
            const demoContent: string[] = [];
            const demoName = path.basename(fullPath, '.vue');

            const compName = demoName.replace(/^\S/, (s) => s.toUpperCase());
            const tempCompPath = path.join(
                dir,
                `../../.temp/components/${name}/${demoName}.vue`,
            );

            scriptCode.imports.push(
                `import ${compName} from '../../.vitepress/.temp/components/${name}/${demoName}.vue'`,
            );
            fse.outputFileSync(
                tempCompPath,
                handleCompDoc(
                    fse.readFileSync(fullPath, 'utf-8'),
                    name,
                    demoName,
                ),
            );
            scriptCode.components.push(compName);

            demoContent.push(`<${compName} />`);

            const rawCode = fse.readFileSync(fullPath, 'utf-8');
            tempCode[`${name}.${demoName}`] = rawCode;
            tempCode[`${name}.${demoName}-code`] = await highlight(rawCode);

            const dashMatchRegExp = new RegExp(`--${demoName}`, 'ig');
            const colonMatchRegExp = new RegExp(
                `:::demo[\\s]*${demoName}\.vue[\\s]*:::`,
                'g',
            );

            if (
                dashMatchRegExp.test(fileContent) ||
                colonMatchRegExp.test(fileContent)
            ) {
                fileContent = fileContent
                    .replace(dashMatchRegExp, demoContent.join('\n\n\n'))
                    .replace(colonMatchRegExp, demoContent.join('\n\n\n'));
            } else {
                demoMDStrs.push(...demoContent);
            }
        }
    }

    const scriptStr = SCRIPT_TEMPLATE.replace(
        'IMPORT_EXPRESSION',
        scriptCode.imports.join('\n'),
    );

    demoMDStrs.push(scriptStr);

    const dashCodeMatchRegExp = new RegExp(`--CODE`);
    const colonCodeMatchRegExp = new RegExp(`:::code[\\s\\S]*:::`);
    if (
        !(
            dashCodeMatchRegExp.test(fileContent) ||
            colonCodeMatchRegExp.test(fileContent)
        )
    ) {
        const appendContent = '\n\n:::code:::\n\n';
        fileContent = fileContent + appendContent;
    }
    fse.outputFileSync(
        output,
        fileContent
            .replace(dashCodeMatchRegExp, demoMDStrs.join('\n\n'))
            .replace(colonCodeMatchRegExp, demoMDStrs.join('\n\n')),
    );

    if (Object.keys(tempCode).length) {
        fse.outputFileSync(
            CODE_PATH,
            JSON.stringify(Object.assign(code, tempCode), null, 2),
        );
    }
}

async function genComponents(src: string) {
    const components = fse.readdirSync(src);
    for (const name of components) {
        await genComponentExample(path.join(src, name), name);
    }
}

async function watch(src: string) {
    const watcher = new cheapWatch({
        dir: src,
        debounce: 50,
    });

    await watcher.init();

    const handleGen = (file: CheapWatchFile) => {
        // 只监听目录变更
        if (file.stats.isDirectory()) {
            const pathSeps = file.path.split(path.sep);
            const pkgName = pathSeps[0];
            genComponentExample(path.join(src, pkgName), pkgName);
        }
    };
    const handleDelete = (file: CheapWatchFile) => {
        const pathSeps = file.path.split(path.sep);

        // 删除组件文档
        if (pathSeps.length === 1) {
            const name = pathSeps[0];
            let hasDeleteCode = false;
            Object.keys(code).forEach((key) => {
                if (key.startsWith(name)) {
                    hasDeleteCode = true;
                    delete code[key];
                }
            });

            if (hasDeleteCode) {
                fse.writeFileSync(CODE_PATH, JSON.stringify(code, null, 2));
            }
            const outputPath = genOutputPath(name);
            if (fse.existsSync(outputPath)) {
                fse.unlinkSync(outputPath);
            }
        } else if (file.stats.isFile() && path.extname(file.path) === '.vue') {
            const pkgName = pathSeps[0];
            // 删除组件属性
            const codekey = `${pkgName}.${path.basename(file.path, '.vue')}`;
            if (code[codekey]) {
                delete code[codekey];
                fse.writeFileSync(CODE_PATH, JSON.stringify(code, null, 2));
            }
            genComponentExample(path.join(src, pkgName), pkgName);
        }
    };

    watcher.on('+', handleGen);
    watcher.on('-', handleDelete);
}

export const genComponentDoc = async () => {
    const src = path.join(process.cwd(), './docs/.vitepress/components');
    await genComponents(src);

    if (process.env.NODE_ENV !== 'production') {
        watch(src);
    }
};
