module.exports = {
    extends: ['@webank/eslint-config-ts/vue.js'],

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
            "BinaryExpression[operator='in']",
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
};
