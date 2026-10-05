import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Drawer from '../drawer';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-drawer';

const $ = (sel: string) => document.querySelector(sel);
const $$ = (sel: string) => Array.from(document.querySelectorAll(sel));

const mountDrawer = (props: Record<string, unknown> = {}, slots = {}) => {
    document.body.innerHTML = '';
    const wrapper = mount(Drawer, {
        props: {
            show: true,
            title: '抽屉',
            ...props,
        },
        slots: { default: () => h('div', '内容'), ...slots },
        attachTo: document.body,
    });
    return wrapper;
};

describe('FDrawer 属性补全', () => {
    test('mask=false 无遮罩层', async () => {
        const wrapper = mountDrawer({ mask: false });
        await nextTick();
        await wait(80);
        expect($(`.${prefixCls}-mask`)).toBeNull();
        wrapper.unmount();
    });

    test('默认 mask 显示遮罩层', async () => {
        const wrapper = mountDrawer();
        await nextTick();
        await wait(80);
        expect($(`.${prefixCls}-mask`)).toBeTruthy();
        wrapper.unmount();
    });

    test('closable=false 无关闭按钮', async () => {
        const wrapper = mountDrawer({ closable: false });
        await nextTick();
        await wait(80);
        expect($(`.${prefixCls}-close`)).toBeNull();
        wrapper.unmount();
    });

    test('showCancel=false 仅确定按钮', async () => {
        const wrapper = mountDrawer({ footer: true, showCancel: false });
        await nextTick();
        await wait(80);
        const buttons = $$(`.${prefixCls}-footer button`);
        expect(buttons.length).toBe(1);
        wrapper.unmount();
    });

    test('dimension 自定义抽屉宽度', async () => {
        const wrapper = mountDrawer({ dimension: 400 });
        await nextTick();
        await wait(80);
        const target = $('.fes-drawer-wrapper') as HTMLElement;
        expect(target.getAttribute('style') || '').toContain('400');
        wrapper.unmount();
    });

    test('contentClass 透传到内容区', async () => {
        const wrapper = mountDrawer({ contentClass: 'custom-content' });
        await nextTick();
        await wait(80);
        expect($('.custom-content')).toBeTruthy();
        wrapper.unmount();
    });

    test('okLoading 确定按钮加载态', async () => {
        const wrapper = mountDrawer({ footer: true, okLoading: true });
        await nextTick();
        await wait(80);
        const buttons = $$(`.${prefixCls}-footer button`);
        expect(
            buttons.some((b) => b.className.includes('loading')),
        ).toBe(true);
        wrapper.unmount();
    });

    test('okText/cancelText 自定义按钮文案', async () => {
        const wrapper = mountDrawer({
            footer: true,
            okText: '确定呐',
            cancelText: '取消呐',
        });
        await nextTick();
        await wait(80);
        expect(document.body.textContent).toContain('确定呐');
        expect(document.body.textContent).toContain('取消呐');
        wrapper.unmount();
    });

    test('displayDirective=show 隐藏后保留 DOM', async () => {
        const wrapper = mountDrawer({ displayDirective: 'show' });
        await nextTick();
        await wait(80);
        await wrapper.setProps({ show: false });
        await wait(80);
        // show 模式 DOM 保留仅隐藏
        expect($(`.${prefixCls}-container`)).toBeTruthy();
        wrapper.unmount();
    });
});
