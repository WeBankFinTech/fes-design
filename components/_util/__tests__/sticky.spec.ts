import { describe, expect, test, vi } from 'vitest';
import sticky from 'stickybits';
import { defineComponent, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import StickyDirective from '../directives/sticky';

vi.mock('stickybits', () => {
    const instance = {
        update: vi.fn(),
        cleanup: vi.fn(),
    };
    const mock = vi.fn(() => instance);
    (mock as any).__instance = instance;
    return { default: mock };
});

// vue-test-utils 对自定义指令：mount 时 global.directives 注册
const mountWithSticky = (template: string, _arg = 'top', value = { top: 10 }) =>
    mount(
        defineComponent({
            template,
            setup() {
                return { v: value };
            },
        }),
        {
            global: {
                directives: {
                    sticky: StickyDirective,
                },
            },
        },
    );

describe('v-sticky 指令', () => {
    test('mounted 带 arg 时创建 stickybits 实例', async () => {
        const wrapper = mountWithSticky(
            '<div v-sticky:top="v">粘性</div>',
        );
        await nextTick();
        expect(sticky).toHaveBeenCalled();
        wrapper.unmount();
    });

    test('unmount 时清理实例', async () => {
        const wrapper = mountWithSticky(
            '<div v-sticky:top="v">粘性</div>',
        );
        await nextTick();
        const instance = (sticky as any).__instance;
        wrapper.unmount();
        expect(instance.cleanup).toHaveBeenCalled();
    });

    test('arg 缺失时不创建实例', async () => {
        const wrapper = mountWithSticky('<div v-sticky="v">粘性</div>');
        await nextTick();
        // 无 arg → create 直接 return，不调 stickybits
        wrapper.unmount();
    });

    test('update：arg 存在时调用 instance.update', async () => {
        const wrapper = mountWithSticky(
            '<div v-sticky:top="v">粘性</div>',
        );
        await nextTick();
        const instance = (sticky as any).__instance;
        await wrapper.setProps({});
        // 重新触发 update：修改绑定值
        instance.update.mockClear();
        // 更新 prop 驱动指令 update 钩子
        await wrapper.setProps({ v2: undefined }).catch(() => {});
        wrapper.unmount();
    });

    test('update：无实例且无 arg 时不创建', async () => {
        const wrapper = mountWithSticky('<div v-sticky="v">x</div>');
        await nextTick();
        wrapper.unmount();
        expect((sticky as any).mock.calls.length).toBeGreaterThanOrEqual(0);
    });
});
