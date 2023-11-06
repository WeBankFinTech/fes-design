const {
    genComponentDoc,
} = require('../docs/.vitepress/scripts/genComponentDoc.js');

async function main() {
    await genComponentDoc();
}

main();
