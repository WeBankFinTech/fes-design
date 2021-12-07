module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-rational-order',
        'stylelint-config-prettier', // 排除与 prettier 冲突的 rule
    ],
    plugins: [
        'stylelint-declaration-block-no-ignored-properties'
    ],
    // https://stylelint.docschina.org/user-guide/rules/
    rules: {
        "indentation": 4,
        "no-empty-source": null,
        "max-empty-lines": 2,
        "no-duplicate-selectors": null,
        "at-rule-no-unknown": null,
        'comment-empty-line-before': null,
        'no-invalid-double-slash-comments': null,
        'no-descending-specificity': null,
        'no-invalid-position-at-import-rule': null,
        'declaration-empty-line-before': null,
        'rule-empty-line-before': null,
        'alpha-value-notation': null,
        'property-no-vendor-prefix': null,
        'keyframes-name-pattern': null,
        'value-no-vendor-prefix': null,
    },
    // https://github.com/stylelint/stylelint/blob/main/docs/migration-guide/to-14.md
    overrides: [
        {
          files: ["**/*.less"],
          customSyntax: "postcss-less"
        }
    ],
    ignoreFiles: [],
}