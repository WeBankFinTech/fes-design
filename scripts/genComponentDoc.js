/* eslint-disable @typescript-eslint/no-var-requires */

const {
    genComponentDoc,
} = require('../docs/.vitepress/scripts/genComponentDoc.js');

async function main() {
    await genComponentDoc();
}

main();
