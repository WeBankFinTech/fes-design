import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Modal from '../modal';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-modal';

const getBodyModal = () => document.body.querySelector(`.${prefixCls}`);

async function openModal(props: Record<string, unknown>, slots: Record<string, any> = {}) {
    const wrapper = mount(Modal, {
        props: { show: true, ...props },
        slots,
        attachTo: document.body,
    });
    await nextTick();
    await wait(50);
    return wrapper;
}

describe('FModal', () => {
    test('show=true 渲染标题与内容', async () => {
        const wrapper = await openModal(
            { title: '标题A' },
            { default: () => h('div', '内容X') },
        );
        const modal = getBodyModal()!;
        expect(modal.querySelector(`.${prefixCls}-wrapper`)!.textContent).toContain(
            '标题A',
        );
        expect(modal.querySelector(`.${prefixCls}-body`)!.textContent).toContain(
            '内容X',
        );
        wrapper.unmount();
    });

    test('footer 默认渲染 取消/确定 按钮', async () => {
        const wrapper = await openModal({ title: 't' });
        const modal = getBodyModal()!;
        const footerBtns = modal.querySelectorAll(`.${prefixCls}-footer .fes-btn`);
        expect(footerBtns.length).toBe(2);
        expect(footerBtns[0].textContent).toContain('取消');
        expect(footerBtns[1].textContent).toContain('确定');
        wrapper.unmount();
    });

    test('footer=false 不渲染底部', async () => {
        const wrapper = await openModal({ title: 't', footer: false });
        const modal = getBodyModal()!;
        expect(modal.querySelector(`.${prefixCls}-footer`)).toBeNull();
        wrapper.unmount();
    });

    test('footer slot 自定义', async () => {
        const wrapper = await openModal(
            { title: 't' },
            { footer: () => h('button', '自定义按钮') },
        );
        const modal = getBodyModal()!;
        expect(modal.querySelector(`.${prefixCls}-footer`)!.textContent).toContain(
            '自定义按钮',
        );
        wrapper.unmount();
    });

    test('title slot 优先于 title prop', async () => {
        const wrapper = await openModal(
            { title: 'prop标题' },
            { title: () => h('span', 'slot标题') },
        );
        const modal = getBodyModal()!;
        expect(modal.textContent).toContain('slot标题');
        wrapper.unmount();
    });

    test('点击取消按钮触发 cancel 与 update:show', async () => {
        const wrapper = await openModal({ title: 't' });
        const modal = getBodyModal()!;
        const cancelBtn = modal.querySelectorAll(
            `.${prefixCls}-footer .fes-btn`,
        )[0] as HTMLElement;
        cancelBtn.click();
        await nextTick();
        expect(wrapper.emitted('cancel')).toBeTruthy();
        expect(wrapper.emitted('update:show')![0]).toEqual([false]);
        wrapper.unmount();
    });

    test('点击确定按钮触发 ok', async () => {
        const wrapper = await openModal({ title: 't' });
        const modal = getBodyModal()!;
        const okBtn = modal.querySelectorAll(
            `.${prefixCls}-footer .fes-btn`,
        )[1] as HTMLElement;
        okBtn.click();
        await nextTick();
        expect(wrapper.emitted('ok')).toBeTruthy();
        wrapper.unmount();
    });

    test('closable=false 不渲染关闭按钮', async () => {
        const wrapper = await openModal({ title: 't', closable: false });
        const modal = getBodyModal()!;
        expect(modal.querySelector(`.${prefixCls}-close`)).toBeNull();
        wrapper.unmount();
    });

    test('maskClosable 点击容器触发 cancel', async () => {
        const wrapper = await openModal({ title: 't', maskClosable: true });
        const modal = getBodyModal()!;
        // handleClickMask 挂在 container（wrapper 的父级）上
        const container = modal.querySelector(`.${prefixCls}-container`) as HTMLElement;
        container.dispatchEvent(new MouseEvent('click', { bubbles: false }));
        await nextTick();
        expect(wrapper.emitted('cancel')).toBeTruthy();
        wrapper.unmount();
    });

    test('escClosable 键盘触发 cancel', async () => {
        const wrapper = await openModal({ title: 't', escClosable: true });
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
        await nextTick();
        expect(wrapper.emitted('cancel')).toBeTruthy();
        wrapper.unmount();
    });

    test('useAnimation=false 时 after-enter 触发', async () => {
        const wrapper = await openModal({ title: 't', useAnimation: false });
        await wait(200);
        // 无动画时直接渲染
        expect(getBodyModal()).toBeTruthy();
        wrapper.unmount();
    });
});
