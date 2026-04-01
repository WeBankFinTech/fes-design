const fs = require('node:fs');
const path = require('node:path');

const SRC_DIR = path.resolve(__dirname, '../docs/.vitepress/dist');
const DEST_DIR = path.resolve(__dirname, '../doc');

function collectMdFiles(dir, base = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const relPath = base ? `${base}/${entry.name}` : entry.name;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectMdFiles(fullPath, relPath));
        } else if (entry.name.endsWith('.md')) {
            files.push({ relPath, fullPath, name: entry.name.replace('.md', '') });
        }
    }
    return files;
}

if (!fs.existsSync(SRC_DIR)) {
    console.error(`Source directory not found: ${SRC_DIR}`);
    console.error('Please run "npm run docs:build" first.');
    // eslint-disable-next-line node/prefer-global/process
    process.exit(1);
}

fs.rmSync(DEST_DIR, { recursive: true, force: true });
fs.mkdirSync(DEST_DIR, { recursive: true });

const files = collectMdFiles(SRC_DIR);

const indexLines = ['# Document Index', ''];

for (const file of files) {
    const destSubDir = path.join(DEST_DIR, path.dirname(file.relPath));
    fs.mkdirSync(destSubDir, { recursive: true });
    fs.copyFileSync(file.fullPath, path.join(DEST_DIR, file.relPath));
    indexLines.push(`- [${file.name}](${file.relPath})`);
}

fs.writeFileSync(path.join(DEST_DIR, 'index.md'), `${indexLines.join('\n')}\n`);

console.log(`Copied ${files.length} .md files to ${DEST_DIR}`);
console.log(`Generated index.md with ${files.length} entries`);
