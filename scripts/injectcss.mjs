import path from 'path';
import fs from 'fs';

function injectCss() {
    return {
        name: 'inline-to-extract',
        generateBundle(options_, bundle) {
            Object.keys(bundle).forEach((name) => {
                const bundleItem = bundle[name];
                if (name === 'index.js') {
                    const dir = path.dirname(bundleItem.facadeModuleId);
                    if (
                        fs.existsSync(path.join(dir, 'style')) &&
                        !fs.existsSync(path.join(dir, 'style/themes'))
                    ) {
                        bundleItem.code = `import './style';\n${bundleItem.code}`;
                    }
                }
            });
        },
    };
}

export default injectCss;
