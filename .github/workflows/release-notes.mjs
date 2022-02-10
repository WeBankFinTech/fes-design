#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
const tag = process.argv[2].replace("v", "");
const log = readFileSync("./CHANGELOG.md", { encoding: "utf-8" }).split("\n");
let result = "";
let inScope = false;
for (let i = 0; i < log.length; i++) {
    if (/^#+ \[/.test(log[i])) {
        inScope = true;
        result += log[i];
        continue;
    }
    if (inScope && /^#+ \[/.test(log[i])) {
        inScope = false;
        break;
    }
    result += `\n${log[i]}`;
}
writeFileSync(`notes-v${tag}.md`, result)
