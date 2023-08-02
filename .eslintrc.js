module.exports = {
    extends: ['@webank/eslint-config-ts/vue.js'],
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
    },
};
