/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const glob = require('fast-glob');
const { Project } = require('ts-morph');
const { parse, compileScript } = require('@vue/compiler-sfc');

let index = 1;

main();

async function main() {
    // 这部分内容具体可以查阅 ts-morph 的文档
    // 这里仅需要知道这是用来处理 ts 文件并生成类型声明文件即可
    const project = new Project({
        compilerOptions: {
            baseUrl: '.',
            declaration: true,
            emitDeclarationOnly: true,
            noEmitOnError: false,
            noImplicitAny: false,
            skipLibCheck: true,
            // https://github.com/microsoft/TypeScript/issues/29808#issuecomment-540292885
            paths: {
                'async-validator': ['node_modules/async-validator'],
            },
        },
        tsConfigFilePath: path.resolve(__dirname, '../tsconfig.json'),
        skipAddingFilesFromTsConfig: true,
    });

    // 获取 src 下的 .vue 和 .ts 文件
    const files = await glob([
        'components/**/*.ts',
        'components/**/*.tsx',
        'components/**/*.vue',
    ]);
    const sourceFiles = [];

    sourceFiles.push(
        project.addSourceFileAtPath(path.resolve(__dirname, '../global.d.ts')),
    );

    await Promise.all(
        files.map(async (file) => {
            if (/\.vue$/.test(file)) {
                // 对于 vue 文件，借助 @vue/compiler-sfc 的 parse 进行解析
                const sfc = parse(await fs.promises.readFile(file, 'utf-8'));
                // 提取出 script 中的内容
                const { script, scriptSetup } = sfc.descriptor;

                if (script || scriptSetup) {
                    let content = '';
                    let isTs = false;

                    if (scriptSetup) {
                        const compiled = compileScript(sfc.descriptor, {
                            id: `${index++}`,
                        });

                        content += compiled.content;

                        if (scriptSetup.lang === 'ts') isTs = true;
                    } else if (script && script.content) {
                        content += script.content;

                        if (script.lang === 'ts') isTs = true;
                    }

                    sourceFiles.push(
                        // 创建一个同路径的同名 ts/js 的映射文件
                        project.createSourceFile(
                            file + (isTs ? '.ts' : '.js'),
                            content,
                        ),
                    );
                }
            } else {
                // 如果是 ts 文件则直接添加即可
                sourceFiles.push(project.addSourceFileAtPath(file));
            }
        }),
    );

    const diagnostics = project.getPreEmitDiagnostics();

    // 输出解析过程中的错误信息
    console.log(project.formatDiagnosticsWithColorAndContext(diagnostics));

    project.emitToMemory();

    // 随后将解析完的文件写道打包路径
    for (const sourceFile of sourceFiles) {
        const emitOutput = sourceFile.getEmitOutput();

        for (const outputFile of emitOutput.getOutputFiles()) {
            const filePath = outputFile
                .getFilePath()
                .replace('/fes-design/types/components/', '/fes-design/es/');

            await fs.promises.mkdir(path.dirname(filePath), {
                recursive: true,
            });
            await fs.promises.writeFile(filePath, outputFile.getText(), 'utf8');
        }
    }
}
