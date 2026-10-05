import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, test, vi } from 'vitest';
import FTimeline from '../timeline';
import { wait } from '../../_util/__tests__/helpers';

// jsdom 无布局引擎：@juggle/resize-observer 不会派发回调，
// mock 成「observe 时用自身回调同步派发 60x60」，使 useCustomIconRegister
// 的 useResize 在图标挂载时立即 updateIcon。
// 注意：每个 ResizeObserver 实例必须使用自己的 callback —— 同文件内的多个
// useResize（timeline 与 icon）各自持有独立实例，误用最后一个回调会把
// 60x60 误派发给别的实例，导致注册表拿不到 rect。
vi.mock('@juggle/resize-observer', () => ({
    ResizeObserver: class {
        cb: ResizeObserverCallback;
        constructor(cb: ResizeObserverCallback) {
            this.cb = cb;
        }

        observe() {
            this.cb(
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

const itemCls = (s: string) => `fes-timeline-item-${s}`;

afterEach(() => {
    document.body.innerHTML = '';
});

// cssstyle 会把 calc 里的运算化简：calc(8px / 2 + 4px) → calc(8px)、
// calc(0px - 60px / 2) → calc(-30px)。下面断言按化简后的稳定值书写。

describe('useCustomIcons row 方向（!= column && currentIconRect 分支）', () => {
    test('row：自定义图标节点内容负偏移，其前一节点按 index+1 调整', async () => {
        const wrapper = mount(FTimeline, {
            props: {
                direction: 'row',
                data: [
                    { title: '一' },
                    { title: '二', icon: () => '自定义' },
                ],
            },
        });
        await nextTick();
        await wait(80);
        const items = wrapper.findAll('.fes-timeline-item');
        expect(items.length).toBe(2);
        // 节点 1 有自定义图标（rect 60x60）：row 方向内容按图标半宽负偏移
        const content1 = items[1].find(`.${itemCls('content-wrapper')}`);
        expect(content1.attributes('style')).toContain('left: calc(-30px)');
        // 节点 0 默认图标，因 index+1 是自定义而调整：无 rect → ?? 默认边长 8
        const tail0Style = items[0]
            .find(`.${itemCls('tail')}`)
            .attributes('style') || '';
        expect(tail0Style).toContain('left: calc(8px)');
        expect(tail0Style).toContain('width: calc(100% - 42px)');
        wrapper.unmount();
    });

    test('默认图标切换为自定义后注册并调整相邻节点（registerIcon 分支）', async () => {
        const wrapper = mount(FTimeline, {
            props: {
                direction: 'row',
                data: [{ title: '一' }, { title: '二' }],
            },
        });
        await nextTick();
        await wait(60);
        // 节点 1 从默认图标变为自定义：isCustom false→true → registerIcon
        await wrapper.setProps({
            data: [
                { title: '一' },
                { title: '二', icon: () => '自定义' },
            ],
        });
        await nextTick();
        await wait(80);
        const items = wrapper.findAll('.fes-timeline-item');
        expect(items.length).toBe(2);
        // 注册成功（未拿到 rect 前按默认边长 8 调整前一节点 tail）
        const tail0Style = items[0]
            .find(`.${itemCls('tail')}`)
            .attributes('style') || '';
        expect(tail0Style).toContain('left: calc(8px)');
        wrapper.unmount();
    });
});

describe('useCustomIcons column 方向（axisDirection !== column 短路）', () => {
    test('column：即使有自定义图标 rect 也不生成内容偏移，tail 走 height', async () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [
                    { title: '一' },
                    { title: '二', icon: () => '自定义' },
                ],
            },
        });
        await nextTick();
        await wait(80);
        const items = wrapper.findAll('.fes-timeline-item');
        expect(items.length).toBe(2);
        // 注册表非空（tail 有样式）证明 rect 已写入，但内容无横向偏移
        const content1 = items[1].find(`.${itemCls('content-wrapper')}`);
        expect(content1.attributes('style')).toBeUndefined();
        const tailStyle = items[1]
            .find(`.${itemCls('tail')}`)
            .attributes('style') || '';
        expect(tailStyle).toContain('top: calc(34px)');
        expect(tailStyle).toContain('height: calc(100% - 42px)');
        wrapper.unmount();
    });

    test('自定义图标由真变假时注销注册（!isCustom 分支）', async () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [{ title: '一', icon: () => '自定义' }],
            },
        });
        await nextTick();
        await wait(80);
        // 单节点：自身注册 → 自身被调整（rect 60 → top 34px）
        expect(
            wrapper.find(`.${itemCls('tail')}`).attributes('style') || '',
        ).toContain('top: calc(34px)');
        // 图标改为预设类型 success → customIcon 为空 → isCustom false → 注销注册
        await wrapper.setProps({ data: [{ title: '一', icon: 'success' }] });
        await nextTick();
        await wait(80);
        expect(
            (wrapper.find(`.${itemCls('tail')}`).attributes('style') || ''),
        ).not.toContain('calc');
        expect(wrapper.find(`.${itemCls('icon')}`).classes()).toContain(
            `${itemCls('icon')}-success`,
        );
        wrapper.unmount();
    });
});
