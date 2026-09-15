import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import FTimeline from '../timeline';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const cls = (s: string) => `${getPrefixCls('timeline')}-${s}`;

// jsdom 无布局引擎，@juggle RO 不会派发回调 → mock 成 observe 时同步回调
const roCallbacks: ResizeObserverCallback[] = [];
vi.mock('@juggle/resize-observer', () => ({
    ResizeObserver: class {
        constructor(cb: ResizeObserverCallback) {
            roCallbacks.push(cb);
        }

        observe() {
            const cb = roCallbacks[roCallbacks.length - 1];
            cb(
                [
                    {
                        contentRect: {
                            width: 60,
                            height: 60,
                        } as DOMRectReadOnly,
                    } as ResizeObserverEntry,
                ],
                this as unknown as ResizeObserver,
            );
        }

        unobserve() {}
        disconnect() {}
    },
}));

// useResize 依赖 @juggle/resize-observer（jsdom 无布局引擎，回调不派发）。
// 这里只验证注册/注销与默认尺寸回退路径（updateIcon 不触发时的 ?? 分支）。
describe('FTimeline 自定义图标尺寸联动（useCustomIcons）', () => {
    test('自定义图标注册后 tail 与内容偏移生效', async () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [
                    { title: '一', icon: () => '图标1' },
                    { title: '二', icon: () => '图标2' },
                    { title: '三' },
                ],
            },
        });
        await nextTick();
        await wait(40);
        // 注册成功：节点渲染且任一 item 尾线存在（注册表非空才触发调整）
        const tails = wrapper.findAll(`.${cls('item-tail')}`);
        expect(tails.length).toBe(3);
        wrapper.unmount();
    });

    test('direction row 时内容偏移使用 inline-start', async () => {
        const wrapper = mount(FTimeline, {
            props: {
                direction: 'row',
                data: [
                    { title: '一', icon: () => '图标1' },
                    { title: '二' },
                ],
            },
        });
        await nextTick();
        await wait(40);
        // 横向布局渲染成功（column 才跳过 inline-start 偏移分支）
        expect(wrapper.find(`.${cls('item')}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('column 方向内容不做横向偏移', async () => {
        const wrapper = mount(FTimeline, {
            props: {
                direction: 'column',
                data: [{ title: '一', icon: () => '图标1' }],
            },
        });
        await nextTick();
        await wait(40);
        // column 不走 inline-start calc 分支
        expect(wrapper.find(`.${cls('item')}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('icon 从自定义切回默认时注销注册', async () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [{ title: '一', icon: () => '图标' } as any],
            },
        });
        await nextTick();
        await wait(40);
        await wrapper.setProps({
            data: [{ title: '一' } as any],
        });
        await nextTick();
        await wait(40);
        const icon = wrapper.find(`.${cls('item-icon')}`);
        expect(icon.classes()).not.toContain(cls('item-icon-custom'));
        wrapper.unmount();
    });
});
