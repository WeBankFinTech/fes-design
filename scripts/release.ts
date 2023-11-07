import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import chalk from 'chalk';
import semver from 'semver';
import enquirer from 'enquirer';
import execa from 'execa';
import {
    getProjectRootDir,
    getPackageJsonVersion,
    loadJsonFile,
} from './utils';
const prompt = enquirer.prompt;

const args = minimist(process.argv.slice(2));

const rootDir = getProjectRootDir();
const packageJsonPath = path.join(rootDir, './package.json');
const currentVersion = getPackageJsonVersion();

const preId =
    args.preid ||
    (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0]);
const skipBuild = args.skipBuild;

const versionIncrements = [
    'patch',
    'minor',
    'major',
    ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
];

const inc = (i: string) => semver.inc(currentVersion, i, preId);
const run = (rBin: string, rArgs: string[], opts: execa.Options = {}) =>
    execa(rBin, rArgs, { stdio: 'inherit', ...opts });
const step = (msg: string) => console.log(chalk.cyan(msg));

function updatePackage(version: string) {
    const pkg = loadJsonFile(packageJsonPath);
    pkg.version = version;
    fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

function updateVersions(version: string) {
    // 1. update root package.json
    updatePackage(version);
}

async function publish(version: string) {
    let releaseTag: null | string = null;
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
    let targetVersion: any = args._[0];

    if (!targetVersion) {
        // no explicit version, offer suggestions
        const { release } = (await prompt({
            type: 'select',
            name: 'release',
            message: 'Select release type',
            choices: versionIncrements
                .map((i) => `${i} (${inc(i)})`)
                .concat(['custom']),
        })) as { release: string };

        if (release === 'custom') {
            targetVersion = (
                (await prompt({
                    type: 'input',
                    name: 'version',
                    message: 'Input custom version',
                    initial: currentVersion,
                })) as { version: string }
            ).version;
        } else {
            targetVersion = release.match(/\((.*)\)/)?.[1];
        }
    }

    if (!semver.valid(targetVersion)) {
        throw new Error(`invalid target version: ${targetVersion}`);
    }

    const { yes } = (await prompt({
        type: 'confirm',
        name: 'yes',
        message: `Releasing v${targetVersion}. Confirm?`,
    })) as { yes: boolean };

    if (!yes) {
        return;
    }

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
    await publish(targetVersion);

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
