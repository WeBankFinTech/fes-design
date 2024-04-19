import config from '@antfu/eslint-config';

export default config({
    stylistic: {
        indent: 4,
        quotes: 'single',
        semi: true,
    },
    ignores: [
        '!docs/.vitepress',
        '!docs/.vitepress/**',
        'es',
        '**/es/**',
        'lib',
        '**/lib/**',
        'dist',
        '**/dist/**',
        'empty.ts',
        '**/empty.ts/**',
        'docs/.vitepress/vueTheme',
        'docs/.vitepress/vueTheme/**',
    ],
    vue: true,
    typescript: {
        // parserOptions: {
        //     // https://typescript-eslint.io/linting/troubleshooting/#i-get-errors-telling-me-eslint-was-configured-to-run--however-that-tsconfig-does-not--none-of-those-tsconfigs-include-this-file
        //     project: './tsconfig.eslint.json',
        //     // https://typescript-eslint.io/linting/troubleshooting/#i-use-a-framework-like-vue-that-requires-custom-file-extensions-and-i-get-errors-like-you-should-add-parseroptionsextrafileextensions-to-your-config
        //     extraFileExtensions: ['.vue'],
        // },
        tsconfigPath: './tsconfig.eslint.json',
    },
    rules: {
        'curly': ['error', 'all'],
        'antfu/top-level-function': ['off'],
        'style/brace-style': ['error', '1tbs'],
        'style/arrow-parens': ['error', 'always'],
        'vue/block-order': ['error', {
            order: [['script', 'template'], 'style'],
        }],
        'ts/consistent-type-definitions': ['off'],
        'ts/consistent-type-imports': ['error', {
            prefer: 'type-imports',
            fixStyle: 'separate-type-imports',
        }],

        // TODO: need discuss
        'vue/attribute-hyphenation': ['off'],
        'vue/v-on-event-hyphenation': ['off'],
    },
}, {
    files: ['**/*.json'],
    rules: {
        'jsonc/indent': ['error', 2],
    },
}, {
    files: ['**/*.yml'],
    rules: {
        'yaml/indent': ['error', 2],
    },
});
