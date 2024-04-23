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
            'vue/script-indent': 'off',
            'vue/multi-word-component-names': 'off',
            'vue/no-multiple-template-root': 'off',
            'vue/no-v-model-argument': 'off',
            'vue/html-indent': 'off',
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
        'prefer-template': 'off',
        'multiline-ternary': 'off',
        'antfu/if-newline': 'off',
        'style/brace-style': 'off',
        'style/multiline-ternary': 'off',
        'import/order': 'off',
        'style/indent': 'off',
        'style/quote-props': 'off',
        'curly': 'off',
        'style/operator-linebreak': 'off',
        'style/arrow-parens': 'off',
        'style/indent-binary-ops': 'off',
        'import/first': 'off',
        'vue/html-self-closing': 'off',
        'vue/block-order': 'off',
        'antfu/top-level-function': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/block-order': 'off',
        'vue/prefer-template': 'off',
        'test/prefer-lowercase-title': 'off',
        'ts/consistent-type-definitions': 'off',
        'ts/no-import-type-side-effects': 'off',
        'style/jsx-curly-brace-presence': 'off',
        'style/jsx-one-expression-per-line': 'off',
        'style/jsx-indent': 'off',
        'style/jsx-curly-newline': 'off',
        'import/no-duplicates': 'off',
        'style/jsx-closing-tag-location': 'off',
        'import/no-duplicates': 'off',
        'symbol-description': 'off',
        'jsdoc/no-multi-asterisks': 'off',
        'unicorn/prefer-includes': 'off',
        'vue/attribute-hyphenation': 'off',
        'test/consistent-test-it': 'off',
        'vue/component-name-in-template-casing': 'off',
        'no-empty-pattern': 'off',
        'test/no-identical-title': 'off',
        'no-unneeded-ternary': 'off',
        'object-shorthand': 'off',
        'ts/no-use-before-define': 'off',
        'jsdoc/require-returns-description': 'off',
        'unicorn/no-instanceof-array': 'off',
        'vue/no-unused-refs': 'off',
        'import/newline-after-import': 'off',
        'style/spaced-comment': 'off',
        'vue/no-reserved-component-names': 'off',
        'no-undefined': 'off',
        'no-restricted-syntax': 'off',
        'vue/operator-linebreak': 'off',
        'vue/html-indent': 'off',
        'vue/v-on-event-hyphenation': 'off',
        'prefer-const': 'off',
        'array-callback-return': 'off',
        '@typescript-eslint/ban-types': 'off',
        'unicorn/prefer-number-properties': 'off',
        'style/spaced-comment': 'off',
        'no-console': 'off',
        'vue/padding-line-between-blocks': 'off',
        'unicorn/prefer-number-properties': 'off',
        'style/quotes': 'off',
        'jsdoc/multiline-blocks': 'off',
        'prefer-promise-reject-errors': 'off',
        'style/lines-between-class-members': 'off',
        'unicorn/throw-new-error': 'off',
        'no-unexpected-multiline': 'off',
        'ts/method-signature-style': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'antfu/consistent-list-newline': 'off',
        'unicorn/no-new-array': 'off',
        'jsdoc/check-param-names': 'off',
        'eslint-comments/no-unlimited-disable': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'antfu/consistent-list-newline': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'one-var': 'off',
        'unused-imports/no-unused-vars': 'off',
        'no-useless-return': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'unused-imports/no-unused-vars': 'off',
        'no-case-declarations': 'off',
        'eqeqeq': 'off',
        'prefer-spread': 'off',
        'vue/no-useless-v-bind': 'off',
        'no-async-promise-executor': 'off',
        'vue/quote-props': 'off',
    },
});
