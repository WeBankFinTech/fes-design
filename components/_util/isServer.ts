// 参考：
// - naive-ui src/_utils/env/is-browser.ts —— typeof 判定环境
// - element-plus packages/utils/browser.ts —— 直接复用 @vueuse/core 的 isClient
//
// fes-design 已依赖 @vueuse/core，故取 Element Plus 的做法：单一真源，
// 不自创判定。注意：isServer 在此文件作为模块级常量求值一次，
// 语义为“当前进程是否存在 DOM 全局”。
import { isClient } from '@vueuse/core';

export const isServer = !isClient;
