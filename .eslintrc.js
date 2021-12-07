module.exports = {
    extends: ['@webank/eslint-config-webank/vue.js'],
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
        'no-restricted-syntax': ['error', 'WithStatement', "BinaryExpression[operator='in']"],
    },
};
