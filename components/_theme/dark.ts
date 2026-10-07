import type { Theme } from './interface';

/**
 * 暗色主题预设（element-plus 路线）
 *
 * baseTheme 的派生链锚定两组输入：
 * - tint(fontColorBase, ratio)：文字/边框/禁用等灰阶派生（向白混合）
 * - fade(fontColorBase, ratio)：阴影/遮罩
 *
 * 暗色模式（theme="dark"）下 baseTheme 内部做 tint↔shade 互换、
 * 遮罩阴影锚定黑色，本表只需覆盖无法推导的基础变量：
 * 文字基色翻浅、页面背景翻深。white/black 保持原值——
 * 它们承担「彩底白字」「勾选标记」等语义，不随主题翻转。
 */
export const darkThemeOverrides: Theme = {
    common: {
        // 文字基色翻浅，驱动 tint↔shade 互换后的灰阶派生链
        fontColorBase: '#e8ecf2',

        // 页面背景：深灰而非纯黑（参考 element-plus --el-bg-color-page #0a0a0a）
        bodyBgColor: '#141414',
    },
};
