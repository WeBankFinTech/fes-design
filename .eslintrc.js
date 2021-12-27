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
    env: {
        jest: true,
    },
    // 规则
    rules: {
        'import/no-named-as-default': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-restricted-syntax': [
            'error',
            'WithStatement',
            "BinaryExpression[operator='in']",
        ],
        'vue/script-indent': 'off',
    },
};
