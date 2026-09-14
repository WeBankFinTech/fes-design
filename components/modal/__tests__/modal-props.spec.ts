import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Modal from '../modal';

const prefixCls = 'fes-modal';

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));

const $ = (sel: string) => document.querySelector(sel);
const $$ = (sel: string) => Array.from(document.querySelectorAll(sel));

const mountModal = (props: Record<string, unknown> = {}, slots = {}) => {
    document.body.innerHTML = '';
    const wrapper = mount(Modal, {
        props: {
            show: true,
            title: '标题',
            ...props,
        },
        slots: { default: () => h('div', '内容'), ...slots },
        attachTo: document.body,
    });
    return wrapper;
};

describe('FModal 属性补全', () => {
    test('fullScreen 全屏模式', async () => {
        const wrapper = mountModal({ fullScreen: true });
        await nextTick();
        await wait();
        const container = $(`.${prefixCls}-container`) as HTMLElement;
        expect(container.className).toContain('fullscreen');
        wrapper.unmount();
    });

    test('showCancel=false 隐藏取消按钮', async () => {
        const wrapper = mountModal({ showCancel: false });
        await nextTick();
        await wait();
        const buttons = $$(`.${prefixCls}-footer button`);
        expect(buttons.length).toBe(1);
        expect(buttons[0].textContent).not.toContain('取消');
        wrapper.unmount();
    });

    test('默认 showCancel 显示取消和确定按钮', async () => {
        const wrapper = mountModal();
        await nextTick();
        await wait();
        const buttons = $$(`.${prefixCls}-footer button`);
        expect(buttons.length).toBe(2);
        wrapper.unmount();
    });

    test('okText/cancelText 自定义按钮文案', async () => {
        const wrapper = mountModal({ okText: '确定啊', cancelText: '取消啊' });
        await nextTick();
        await wait();
        expect(document.body.textContent).toContain('确定啊');
        expect(document.body.textContent).toContain('取消啊');
        wrapper.unmount();
    });

    test('点击确定触发 ok 事件', async () => {
        const wrapper = mountModal();
        await nextTick();
        await wait();
        const buttons = $$(`.${prefixCls}-footer button`);
        // modal 确定按钮为 primary 类型
        const okBtn = buttons.find((b) => b.className.includes('primary'));
        await okBtn!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        expect(wrapper.emitted('ok')).toBeTruthy();
        wrapper.unmount();
    });

    test('escClosable=false 不响应 Esc', async () => {
        const wrapper = mountModal({ escClosable: false });
        await nextTick();
        await wait();
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
        await wait();
        expect(wrapper.emitted('update:show')).toBeUndefined();
        wrapper.unmount();
    });

    test('escClosable 默认响应 Esc 关闭', async () => {
        const wrapper = mountModal();
        await nextTick();
        await wait();
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
        await wait();
        expect(wrapper.emitted('update:show')).toBeTruthy();
        wrapper.unmount();
    });

    test('closable 关闭按钮触发 update:show', async () => {
        const wrapper = mountModal({ closable: true });
        await nextTick();
        await wait();
        const close = $(`.${prefixCls}-close`) as HTMLElement;
        expect(close).toBeTruthy();
        close.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        expect(wrapper.emitted('update:show')).toBeTruthy();
        wrapper.unmount();
    });

    test('maskClosable 点击遮罩关闭', async () => {
        const wrapper = mountModal({ maskClosable: true });
        await nextTick();
        await wait();
        // handleClickMask 需要先有 mousedown（非弹窗内）再 click
        const container = $(`.${prefixCls}-container`) as HTMLElement;
        container.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        await nextTick();
        container.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        expect(wrapper.emitted('update:show')).toBeTruthy();
        wrapper.unmount();
    });
});
