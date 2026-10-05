import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import StickyDirective from '../directives/sticky';

/**
 * v-sticky 指令 update 钩子分支补全（基线 6/8，死分支）：
 * - L26[1] updated 时实例存在 + 无 arg → clean(el)（清理实例）
 * - L27[1] 该分支内部的实例清理路径
 *
 * 既有 sticky.spec.ts 只覆盖 create/unmount；本文件用「动态指令参数」驱动
 * updated 钩子的两种走向：arg 存在 → instance.update(value)；
 * arg 被移除 → clean(el) → instance.cleanup()。
 * stickybits 用 vi.mock 控制实例（真实库在 jsdom 下不可靠）。
 */

const stickyMock = vi.hoisted(() => {
    const instance = {
        update: vi.fn(),
        cleanup: vi.fn(),
    };
    const factory = vi.fn(() => instance);
    return { instance, factory };
});

vi.mock('stickybits', () => ({
    default: stickyMock.factory,
}));

const mountDynamic = (initialArg: string | undefined) =>
    mount(
        defineComponent({
            props: {
                stickyArg: { type: String, default: undefined },
                value: { type: Object, default: () => ({ top: 10 }) },
            },
            template: '<div class="sticky-host" v-sticky:[stickyArg]="value">粘性</div>',
        }),
        {
            props: { stickyArg: initialArg },
            global: {
                directives: { sticky: StickyDirective },
            },
        },
    );

beforeEach(() => {
    stickyMock.instance.update.mockClear();
    stickyMock.instance.cleanup.mockClear();
    stickyMock.factory.mockClear();
});

describe('v-sticky update 钩子分支', () => {
    test('arg 存在时 updated 调用 instance.update(value)（L27 真支）', async () => {
        const wrapper = mountDynamic('top');
        await nextTick();
        expect(stickyMock.factory).toHaveBeenCalledTimes(1);

        // 改绑定值 → updated 钩子：实例已存在 + arg 存在 → update(value)
        await wrapper.setProps({ value: { top: 50 } });
        await nextTick();
        await nextTick();
        expect(stickyMock.instance.update).toHaveBeenCalledWith({ top: 50 });
        // 不重建实例
        expect(stickyMock.factory).toHaveBeenCalledTimes(1);
        wrapper.unmount();
    });

    test('arg 被移除时 updated 清理实例（L26/L27 假支 → clean）', async () => {
        const wrapper = mountDynamic('top');
        await nextTick();
        expect(stickyMock.factory).toHaveBeenCalledTimes(1);

        // 动态 arg 变为 undefined → updated: 实例存在 + 无 arg → clean(el)
        await wrapper.setProps({ stickyArg: undefined });
        await nextTick();
        await nextTick();
        expect(stickyMock.instance.cleanup).toHaveBeenCalled();

        // 实例已从 WeakMap 删除：unmount 不再重复 cleanup
        stickyMock.instance.cleanup.mockClear();
        wrapper.unmount();
        expect(stickyMock.instance.cleanup).not.toHaveBeenCalled();
    });

    test('无实例时 updated 走 create：无 arg 不创建，arg 恢复后创建', async () => {
        // 初次无 arg：beforeMount 不创建实例
        const wrapper = mountDynamic(undefined);
        await nextTick();
        expect(stickyMock.factory).not.toHaveBeenCalled();

        // updated（无实例）→ create：无 arg 仍不创建
        await wrapper.setProps({ value: { top: 20 } });
        await nextTick();
        await nextTick();
        expect(stickyMock.factory).not.toHaveBeenCalled();

        // arg 出现 → updated（无实例）→ create → stickybits 实例化
        await wrapper.setProps({ stickyArg: 'top' });
        await nextTick();
        await nextTick();
        expect(stickyMock.factory).toHaveBeenCalledTimes(1);
        wrapper.unmount();
    });

    test('多次 arg 值变更只更新不重建实例', async () => {
        const wrapper = mountDynamic('top');
        await nextTick();
        await wrapper.setProps({ stickyArg: 'bottom' });
        await nextTick();
        await nextTick();
        await wrapper.setProps({ stickyArg: 'top' });
        await nextTick();
        await nextTick();
        // 始终复用同一实例
        expect(stickyMock.factory).toHaveBeenCalledTimes(1);
        expect(wrapper.find('.sticky-host').exists()).toBe(true);
        wrapper.unmount();
    });
});
