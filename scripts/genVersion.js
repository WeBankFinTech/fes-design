const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const rootDir = process.cwd();
const versionFilePath = path.join(rootDir, 'components/version/index.js');
const versionFileContent = fs.readFileSync(versionFilePath, 'utf-8');

fs.writeFileSync(versionFilePath, versionFileContent.replace(/\d+\.\d+\.\d+/, pkg.version));
