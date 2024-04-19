// eslint-disable-next-line
const fs = require('fs-extra');
const esModules = ['lodash-es'].map((pkg) => {
    if (fs.pathExistsSync('node_modules/.pnpm')) {
        return `.pnpm/(.*)?${pkg}`;
    } else {
        return pkg;
    }
});

module.exports = {
    globals: {
        __DEV__: true,
        'ts-jest': {
            babelConfig: true,
        },
    },

    // Automatically clear mock calls and instances between every test
    clearMocks: true,

    // An array of glob patterns indicating a set of files for which coverage information should be collected
    collectCoverageFrom: ['<rootDir>/src/**/*.(js|jsx|vue|ts|tsx)'],

    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',

    // An array of regexp pattern strings used to skip coverage collection
    coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],

    // A list of reporter names that Jest uses when writing coverage reports
    coverageReporters: ['text', 'lcov'],

    // An array of directory names to be searched recursively up from the requiring module's location
    moduleDirectories: ['node_modules'],

    // An array of file extensions your modules use
    moduleFileExtensions: ['js', 'ts', 'jsx', 'tsx', 'json', 'vue'],

    // The paths to modules that run some code to configure or set up the testing environment before each test
    setupFiles: ['jest-canvas-mock', './jest.setup.js'],

    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: [],

    // The test environment that will be used for testing
    testEnvironment: 'jest-environment-jsdom',

    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.vue$': '@vue/vue3-jest',
        '^.+\\.(css|styl|less|sass|scss|jpg|jpeg|png|svg|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            'jest-transform-stub',
    },

    // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
    testURL: 'http://localhost',

    // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
    transformIgnorePatterns: [`<rootDir>/node_modules/(?!${esModules})`],

    // Indicates whether each individual test should be reported during the run
    verbose: false,
};
