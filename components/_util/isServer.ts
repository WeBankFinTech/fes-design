/**
 * SSR 环境判定：服务端渲染期间无 window/document。
 *
 * 统一入口：所有触碰 DOM 全局的模块顶层/setup 期代码都必须先过此守卫，
 * 避免任何组件在 Nuxt 等 SSR 应用中渲染即抛 ReferenceError（架构审查 P0）。
 *
 * 注意：Vue SSR 下模块可能同时被服务端与客户端求值，此处只判定
 * "当前执行环境是否有 DOM"，与构建目标无关。
 */
export const isServer = typeof window === 'undefined'
    || typeof document === 'undefined';
