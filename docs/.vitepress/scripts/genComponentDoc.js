/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const shiki = require('shiki');

const { SCRIPT_TEMPLATE, DEMO_ENTRY_FILE } = require('./constants');

const CODE_PATH = path.join(
    process.cwd(),
    './docs/.vitepress/theme/components/demoCode.json',
);

function getDemoCode() {
    if (fs.existsSync(CODE_PATH)) {
        return JSON.parse(fs.readFileSync(CODE_PATH, 'utf-8'));
    }

    return {
        app: DEMO_ENTRY_FILE,
    };
}

const code = getDemoCode();

function genOutputPath(name) {
    return path.join(process.cwd(), `./docs/zh/components/${name}.md`);
}

function handleCompDoc(compCode, compName, demoName) {
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

function escapeHtml(html) {
    return html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr]);
}

let highlighter;
const highlight = async (code, lang = 'vue') => {
    if (!lang || lang === 'text') {
        return `<pre v-pre><code>${escapeHtml(code)}</code></pre>`;
    }
    if (!highlighter) {
        highlighter = await shiki.getHighlighter({
            theme: 'material-palenight',
        });
    }
    return highlighter
        .codeToHtml(code, lang)
        .replace(/^<pre.*?>/, '<pre v-pre>');
};

async function genComponent(dir, name) {
    const output = genOutputPath(name);
    const indexPath = path.join(dir, 'index.md');
    if (!fs.existsSync(indexPath)) return;

    let fileContent = fs.readFileSync(indexPath, 'utf-8');

    const demos = fs.readdirSync(dir);
    const demoMDStrs = [];
    const scriptCode = {
        imports: [],
        components: [],
    };
    const tempCode = {};
    for (const filename of demos) {
        const fullPath = path.join(dir, filename);
        if (
            fs.statSync(fullPath).isFile() &&
            path.extname(fullPath) === '.vue'
        ) {
            const demoContent = [];
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
                    fs.readFileSync(fullPath, 'utf-8'),
                    name,
                    demoName,
                ),
            );
            scriptCode.components.push(compName);

            demoContent.push(`<${compName} />`);

            const rawCode = fs.readFileSync(fullPath, 'utf-8');
            tempCode[`${name}.${demoName}`] = rawCode;
            tempCode[`${name}.${demoName}-code`] = await highlight(rawCode);

            const matchStr = new RegExp(
                `--${demoName.toLocaleUpperCase()}\\s`,
                'i',
            );
            if (matchStr.test(fileContent)) {
                fileContent = fileContent.replace(
                    matchStr,
                    demoContent.join('\n\n\n'),
                );
            } else {
                demoMDStrs.push(...demoContent);
            }
        }
    }

    const scriptStr = SCRIPT_TEMPLATE.replace(
        'IMPORT_EXPRESSION',
        scriptCode.imports.join('\n'),
    ).replace('COMPONENTS', scriptCode.components.join(',\n'));

    demoMDStrs.push(scriptStr);

    fse.outputFileSync(
        output,
        fileContent.replace('--CODE', demoMDStrs.join('\n\n')),
    );

    if (Object.keys(tempCode).length) {
        fse.outputFileSync(
            CODE_PATH,
            JSON.stringify(Object.assign(code, tempCode), null, 2),
        );
    }
}

async function genComponents(src) {
    const components = fs.readdirSync(src);
    for (const name of components) {
        await genComponent(path.join(src, name), name);
    }
}

async function watch(src) {
    const watcher = new (require('cheap-watch'))({
        dir: src,
        debounce: 50,
    });
    await watcher.init();
    const gen = (data) => {
        const fullPath = path.join(src, data.path);
        // 只监听目录变更
        if (fs.statSync(fullPath).isDirectory()) {
            const pathSeps = data.path.split(path.sep);
            const componentName = pathSeps[0];
            genComponent(path.join(src, componentName), componentName);
        }
    };
    const handleDelete = (data) => {
        const pathSeps = data.path.split(path.sep);

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
                fs.writeFileSync(CODE_PATH, JSON.stringify(code, null, 2));
            }
            const outputPath = genOutputPath(name);
            if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath);
            }
        } else if (data.stats.isFile() && path.extname(data.path) === '.vue') {
            // 删除组件属性
            const codekey = `${pathSeps[0]}.${path.basename(
                data.path,
                '.vue',
            )}`;
            if (code[codekey]) {
                delete code[codekey];
                fs.writeFileSync(CODE_PATH, JSON.stringify(code, null, 2));
            }
            genComponent(path.join(src, pathSeps[0]), pathSeps[0]);
        }
    };
    watcher.on('+', gen);
    watcher.on('-', handleDelete);
}

exports.genComponentDoc = async () => {
    const src = path.join(process.cwd(), './docs/.vitepress/components');
    await genComponents(src);

    if (process.env.NODE_ENV !== 'production') {
        watch(src);
    }
};
