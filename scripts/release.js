/* eslint-disable @typescript-eslint/no-var-requires */

const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const semver = require('semver');
const { prompt } = require('enquirer');
const execa = require('execa');
const currentVersion = require('../package.json').version;

const preId =
    args.preid ||
    (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0]);
const skipTests = args.skipTests;
const skipBuild = args.skipBuild;

const versionIncrements = [
    'patch',
    'minor',
    'major',
    ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
];

const inc = (i) => semver.inc(currentVersion, i, preId);
const bin = (name) => path.resolve(__dirname, `../node_modules/.bin/${name}`);
const run = (rBin, rArgs, opts = {}) =>
    execa(rBin, rArgs, { stdio: 'inherit', ...opts });
const step = (msg) => console.log(chalk.cyan(msg));

function updatePackage(pkgRoot, version) {
    const pkgPath = path.resolve(pkgRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    pkg.version = version;
    fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

function updateVersions(version) {
    // 1. update root package.json
    updatePackage(path.resolve(__dirname, '..'), version);
}

async function publish(version) {
    let releaseTag = null;
    if (args.tag) {
        releaseTag = args.tag;
    } else if (version.includes('alpha')) {
        releaseTag = 'alpha';
    } else if (version.includes('beta')) {
        releaseTag = 'beta';
    } else if (version.includes('rc')) {
        releaseTag = 'rc';
    }

    step(`Publishing...`);
    try {
        await run(
            // note: use of yarn is intentional here as we rely on its publishing
            // behavior.
            'npm',
            [
                'publish',
                ...(releaseTag ? ['--tag', releaseTag] : []),
                '--access',
                'public',
                '--registry',
                'https://registry.npmjs.org',
            ],
        );
        console.log(chalk.green(`Successfully published ${version}`));
    } catch (e) {
        if (e.stderr.match(/previously published/)) {
            console.log(chalk.red(`Skipping already published`));
        } else {
            throw e;
        }
    }
}

async function main() {
    let targetVersion = args._[0];

    if (!targetVersion) {
        // no explicit version, offer suggestions
        const { release } = await prompt({
            type: 'select',
            name: 'release',
            message: 'Select release type',
            choices: versionIncrements
                .map((i) => `${i} (${inc(i)})`)
                .concat(['custom']),
        });

        if (release === 'custom') {
            targetVersion = (
                await prompt({
                    type: 'input',
                    name: 'version',
                    message: 'Input custom version',
                    initial: currentVersion,
                })
            ).version;
        } else {
            targetVersion = release.match(/\((.*)\)/)[1];
        }
    }

    if (!semver.valid(targetVersion)) {
        throw new Error(`invalid target version: ${targetVersion}`);
    }

    const { yes } = await prompt({
        type: 'confirm',
        name: 'yes',
        message: `Releasing v${targetVersion}. Confirm?`,
    });

    if (!yes) {
        return;
    }

    // run tests before release
    // step('\nRunning tests...');
    // if (!skipTests) {
    //     await run(bin('jest'), ['--clearCache']);
    //     await run('pnpm', ['test', '--', '--bail']);
    // } else {
    //     console.log(`(skipped)`);
    // }

    // update all package versions and inter-dependencies
    step('\nUpdating cross dependencies...');
    updateVersions(targetVersion);

    // build all packages with types
    step('\nBuilding all packages...');
    if (!skipBuild) {
        await run('pnpm', ['run', 'build']);
    } else {
        console.log(`(skipped)`);
    }

    // generate changelog
    step('\nGenerating changelog...');
    await run(`pnpm`, ['run', 'changelog']);

    // update pnpm-lock.yaml
    step('\nUpdating lockfile...');
    await run(`pnpm`, ['install', '--prefer-offline']);

    const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
    if (stdout) {
        step('\nCommitting changes...');
        await run('git', ['add', '-A']);
        await run('git', ['commit', '-m', `release: v${targetVersion}`]);
    } else {
        console.log('No changes to commit.');
    }

    // publish packages
    step('\nPublishing...');
    await publish(targetVersion, run);

    // push to GitHub
    step('\nPushing to GitHub...');
    await run('git', ['tag', `v${targetVersion}`]);
    await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`]);
    await run('git', ['push']);
    console.log();
}

main().catch((err) => {
    console.error(err);
});
