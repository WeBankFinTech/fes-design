/**
 * Type 文档:
 * https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type
 */
module.exports = {
    'extends': ['@commitlint/config-conventional'],
    'rules': {
        'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert', 'release', 'build']],
        // 以下规则原本写在 rules 对象之外（module.exports 顶层），实际不生效，
        // 导致 @commitlint/config-conventional 默认 subject-case 生效，
        // PascalCase 开头（如「fix(select): SelectOption ...」）被误拒。
        // 已移入 rules 生效（level 0 = 关闭对应检查）。
        'type-case': [0],
        'type-empty': [0],
        'scope-empty': [0],
        'scope-case': [0],
        'subject-full-stop': [0, 'never'],
        'subject-case': [0, 'never'],
        'header-max-length': [0, 'always', 100],
    },
};