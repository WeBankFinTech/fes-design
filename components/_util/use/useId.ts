import { getCurrentInstance } from 'vue';

/**
 * 生成组件内唯一 id，用于 aria-labelledby / aria-controls 等关联。
 *
 * 不直接使用 Vue 3.5 新增的 useId：
 * 本库 peerDependencies 为 vue ^3.2.24，低版本没有该导出。
 * 静态具名导入（import { useId } from 'vue'）在原生 ESM 下会直接报错，
 * 因此这里自实现一份等价能力。
 *
 * SSR 稳定性：计数器挂在 appContext 上（每个应用一份）。
 * 同一棵组件树在服务端与客户端的生成顺序一致，id 因而可以对齐，
 * 不会产生 hydration 不匹配。多应用同页场景的注意事项与 Vue 官方
 * useId 相同（各应用计数独立，建议自行配置 idPrefix）。
 */
const appIdCounters = new WeakMap<object, number>();
let fallbackSeed = 0;

export default function useId(prefix = 'fes'): string {
    const appContext = getCurrentInstance()?.appContext;
    if (appContext) {
        const next = (appIdCounters.get(appContext) ?? 0) + 1;
        appIdCounters.set(appContext, next);
        return `${prefix}-${next}`;
    }
    // 无应用上下文（非 setup 环境调用）：退化为全局自增
    fallbackSeed += 1;
    return `${prefix}-${fallbackSeed}`;
}
