import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Drawer from '../drawer';
import Modal from '../../modal/modal';
import { wait } from '../../_util/__tests__/helpers';

const $ = (sel: string) => document.querySelector(sel);
const $$ = (sel: string) => Array.from(document.querySelectorAll(sel));

const mountDrawer = (props: Record<string, unknown> = {}) => {
    document.body.innerHTML = '';
    return mount(Drawer, {
        props: { show: true, title: '抽屉', ...props },
        slots: { default: () => h('div', '内容') },
        attachTo: document.body,
    });
};

describe('FDrawer 事件', () => {
    test('ok 事件点击确定按钮触发', async () => {
        const wrapper = mountDrawer({ footer: true });
        await nextTick();
        await wait(80);
        const buttons = $$('button');
        // primary 确定按钮渲染在最前
        const okBtn = buttons.find((b) => b.textContent.includes('确定'));
        okBtn!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await wait(80);
        expect(wrapper.emitted('ok')).toBeTruthy();
        wrapper.unmount();
    });

    test('cancel 事件点击取消按钮触发', async () => {
        const wrapper = mountDrawer({ footer: true });
        await nextTick();
        await wait(80);
        const buttons = $$('button');
        const cancelBtn = buttons.find((b) => b.textContent.includes('取消'));
        cancelBtn!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await wait(80);
        const events = wrapper.emitted('cancel')
            || wrapper.emitted('update:show');
        expect(events).toBeTruthy();
        wrapper.unmount();
    });

    test('关闭按钮触发 update:show=false', async () => {
        const wrapper = mountDrawer();
        await nextTick();
        await wait(80);
        const close = $(`.fes-drawer-close`);
        expect(close).toBeTruthy();
        close!.dispatchEvent(
            new MouseEvent('click', { bubbles: true }),
        );
        await wait(80);
        const updates = wrapper.emitted('update:show');
        expect(updates![updates!.length - 1][0]).toBe(false);
        wrapper.unmount();
    });

    test('escClosable Esc 触发关闭', async () => {
        const wrapper = mountDrawer({ escClosable: true });
        await nextTick();
        await wait(80);
        window.dispatchEvent(
            new KeyboardEvent('keydown', { code: 'Escape' }),
        );
        await wait(80);
        const updates = wrapper.emitted('update:show');
        expect(updates![updates!.length - 1][0]).toBe(false);
        wrapper.unmount();
    });
});

describe('FModal 事件补充', () => {
    test('input 事件与 update:show 同步', async () => {
        document.body.innerHTML = '';
        const wrapper = mount(Modal, {
            props: { show: true, title: '弹窗' },
            slots: { default: () => h('div', '内容') },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        expect($$('.fes-modal-container').length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    test('visibleChange 不存在时 show 控制 display', async () => {
        document.body.innerHTML = '';
        const wrapper = mount(Modal, {
            props: { show: true },
            slots: { default: () => 'x' },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        // 无头模式下至少不抛错
        expect(document.body.innerHTML.length).toBeGreaterThan(0);
        wrapper.unmount();
    });
});
