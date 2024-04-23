import antfu from '@antfu/eslint-config';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default antfu({
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

    // Legacy config
    ...compat.config({
        extends: ['@webank/eslint-config-ts/vue'],

        parserOptions: {
            // https://typescript-eslint.io/linting/troubleshooting/#i-get-errors-telling-me-eslint-was-configured-to-run--however-that-tsconfig-does-not--none-of-those-tsconfigs-include-this-file
            project: './tsconfig.eslint.json',
            // https://typescript-eslint.io/linting/troubleshooting/#i-use-a-framework-like-vue-that-requires-custom-file-extensions-and-i-get-errors-like-you-should-add-parseroptionsextrafileextensions-to-your-config
            extraFileExtensions: ['.vue'],
        },

        overrides: [
            {
                files: [
                    '**/__tests__/*.{j,t}s?(x)',
                    '**/tests/unit/**/*.spec.{j,t}s?(x)',
                ],
            },
        ],
        settings: {
            'import/resolver': {
                'eslint-import-resolver-custom-alias': {
                    alias: {
                        '@fesjs/fes-design': './components/index.ts',
                    },
                },
            },
        },

        env: {
            jest: true,
        },
        // 规则
        rules: {
            '@typescript-eslint/no-unused-vars': 'error',
            'vue/one-component-per-file': 'off',
            'import/no-named-as-default': 'off',
            'import/no-extraneous-dependencies': 'off',
            'no-restricted-syntax': [
                'error',
                'WithStatement',
                'BinaryExpression[operator=\'in\']',
            ],
            'vue/multi-word-component-names': 'off',
            'vue/no-multiple-template-root': 'off',
            'vue/no-v-model-argument': 'off',
            // 保留现状, 允许 any
            '@typescript-eslint/no-explicit-any': 'off',
            // 保留现状, 允许定义变量值为 undefined
            'no-undefined': 'off',
            // 保留现状, 允许 !. 用法
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            // 保留现状，允许 vue 文件中 :a="{ b: { c: 500 } }" 的写法
            'vue/object-curly-spacing': 'off',
            'no-unused-expressions': 'off',
            // import, export type
            '@typescript-eslint/consistent-type-exports': 'warn',
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { fixStyle: 'inline-type-imports' },
            ],
        },
    }),

    // Other flat configs...
    rules: {
        'vue/block-order': ['error', {
            order: [['template', 'script'], 'style'],
        }],
        'no-async-promise-executor': 'off',
        'prefer-spread': 'off',
        'no-case-declarations': 'off',
        'one-var': 'off',
        'unicorn/prefer-includes': 'off',
        'no-console': 'off',
        'unicorn/no-new-array': 'off',

        'vue/singleline-html-element-content-newline': 'off',
        'vue/attribute-hyphenation': 'off',
        'vue/component-name-in-template-casing': 'off',
        'vue/v-on-event-hyphenation': 'off',

        'ts/no-use-before-define': 'off',

        'test/consistent-test-it': 'off',
        'test/no-identical-title': 'off',

        'style/jsx-curly-brace-presence': 'off',
        'style/jsx-one-expression-per-line': 'off',
        'style/jsx-curly-newline': 'off',
        'style/jsx-closing-tag-location': 'off',

        'multiline-ternary': 'off',
        'antfu/if-newline': 'off',
        'style/brace-style': 'off',
        'style/multiline-ternary': 'off',
        'style/indent': 'off',
        'curly': 'off',
        'style/arrow-parens': 'off',
        'antfu/top-level-function': 'off',
        'test/prefer-lowercase-title': 'off',
        'ts/no-import-type-side-effects': 'off',
        'symbol-description': 'off',
        'no-empty-pattern': 'off',
        'no-unneeded-ternary': 'off',
        'object-shorthand': 'off',
        'unicorn/no-instanceof-array': 'off',
        'prefer-const': 'off',
        'array-callback-return': 'off',
        'prefer-promise-reject-errors': 'off',
        'unicorn/throw-new-error': 'off',
        'antfu/consistent-list-newline': 'off',
    },
});
