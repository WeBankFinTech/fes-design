import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Drawer from '../drawer';

const prefixCls = 'fes-drawer';

const getBodyDrawer = () => document.body.querySelector(`.${prefixCls}`);

const wait = (ms = 50) => new Promise((r) => setTimeout(r, ms));

async function openDrawer(
    props: Record<string, unknown>,
    slots: Record<string, any> = {},
) {
    const wrapper = mount(Drawer, {
        props: { show: true, ...props },
        slots,
        attachTo: document.body,
    });
    await nextTick();
    await wait(50);
    return wrapper;
}

describe('FDrawer', () => {
    test('show=true 渲染标题与内容', async () => {
        const wrapper = await openDrawer(
            { title: '抽屉A' },
            { default: () => h('div', '抽屉内容') },
        );
        const drawer = getBodyDrawer()!;
        expect(drawer.textContent).toContain('抽屉A');
        expect(drawer.textContent).toContain('抽屉内容');
        wrapper.unmount();
    });

    test('默认 placement right，类名正确', async () => {
        const wrapper = await openDrawer({ title: 't' });
        const drawer = getBodyDrawer()!;
        expect(drawer.classList.contains(`${prefixCls}-right`)).toBe(true);
        wrapper.unmount();
    });

    test('placement left 切换类名', async () => {
        const wrapper = await openDrawer({ title: 't', placement: 'left' });
        const drawer = getBodyDrawer()!;
        expect(drawer.classList.contains(`${prefixCls}-left`)).toBe(true);
        wrapper.unmount();
    });

    test('width 应用到面板样式', async () => {
        const wrapper = await openDrawer({ title: 't', width: 400 });
        const drawer = getBodyDrawer()!;
        const wrapperEl = drawer.querySelector(`.${prefixCls}-wrapper`) as HTMLElement;
        expect(wrapperEl).toBeTruthy();
        expect(wrapperEl.getAttribute('style')).toContain('400');
        wrapper.unmount();
    });

    test('footer 默认不渲染（footer 默认 false）', async () => {
        const wrapper = await openDrawer({ title: 't' });
        const drawer = getBodyDrawer()!;
        // no-footer 类挂在 container 上而非根节点
        const container = drawer.querySelector(`.${prefixCls}-container`) as HTMLElement;
        expect(drawer.querySelector(`.${prefixCls}-footer`)).toBeNull();
        expect(
            container.classList.contains(`${prefixCls}-no-footer`),
        ).toBe(true);
        wrapper.unmount();
    });

    test('footer=true 渲染 取消/确定 按钮', async () => {
        const wrapper = await openDrawer({ title: 't', footer: true });
        const drawer = getBodyDrawer()!;
        const footer = drawer.querySelector(`.${prefixCls}-footer`);
        expect(footer).toBeTruthy();
        const btns = footer!.querySelectorAll('.fes-btn');
        expect(btns.length).toBe(2);
        // drawer 默认按钮顺序：确定在前、取消在后（与 modal 相反）
        expect(btns[0].textContent).toContain('确定');
        expect(btns[1].textContent).toContain('取消');
        wrapper.unmount();
    });

    test('footer slot 自定义（footer 需为 true）', async () => {
        const wrapper = await openDrawer(
            { title: 't', footer: true },
            { footer: () => h('button', '自定义底部') },
        );
        const drawer = getBodyDrawer()!;
        expect(drawer.querySelector(`.${prefixCls}-footer`)!.textContent).toContain(
            '自定义底部',
        );
        wrapper.unmount();
    });

    test('footerBorder 类名分支', async () => {
        const wrapper = await openDrawer({ title: 't', footer: true, footerBorder: true });
        const drawer = getBodyDrawer()!;
        const footer = drawer.querySelector(`.${prefixCls}-footer`) as HTMLElement;
        expect(footer.classList.contains(`${prefixCls}-footer-has-border`)).toBe(
            true,
        );
        wrapper.unmount();
    });

    test('showCancel=false 只渲染确定按钮', async () => {
        const wrapper = await openDrawer({ title: 't', footer: true, showCancel: false });
        const drawer = getBodyDrawer()!;
        const btns = drawer.querySelectorAll(`.${prefixCls}-footer .fes-btn`);
        expect(btns.length).toBe(1);
        expect(btns[0].textContent).toContain('确定');
        wrapper.unmount();
    });

    test('点击取消触发 cancel 与 update:show', async () => {
        const wrapper = await openDrawer({ title: 't', footer: true });
        const drawer = getBodyDrawer()!;
        // drawer 按钮顺序：确定在前、取消在后
        const cancelBtn = drawer.querySelectorAll(
            `.${prefixCls}-footer .fes-btn`,
        )[1] as HTMLElement;
        cancelBtn.click();
        await nextTick();
        expect(wrapper.emitted('cancel')).toBeTruthy();
        expect(wrapper.emitted('update:show')![0]).toEqual([false]);
        wrapper.unmount();
    });

    test('点击确定触发 ok', async () => {
        const wrapper = await openDrawer({ title: 't', footer: true });
        const drawer = getBodyDrawer()!;
        const okBtn = drawer.querySelectorAll(
            `.${prefixCls}-footer .fes-btn`,
        )[0] as HTMLElement;
        okBtn.click();
        await nextTick();
        expect(wrapper.emitted('ok')).toBeTruthy();
        wrapper.unmount();
    });

    test('closable=false 不渲染关闭按钮', async () => {
        const wrapper = await openDrawer({ title: 't', closable: false });
        const drawer = getBodyDrawer()!;
        expect(drawer.querySelector(`.${prefixCls}-close`)).toBeNull();
        wrapper.unmount();
    });

    test('escClosable 键盘触发 cancel', async () => {
        const wrapper = await openDrawer({ title: 't', escClosable: true });
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
        await nextTick();
        expect(wrapper.emitted('cancel')).toBeTruthy();
        wrapper.unmount();
    });

    test('show=false 时面板隐藏（v-show display:none）', async () => {
        const wrapper = mount(Drawer, {
            props: { show: false, title: 't' },
            attachTo: document.body,
        });
        await nextTick();
        await nextTick();
        const drawer = getBodyDrawer();
        // displayDirective 默认 show：DOM 保留但隐藏
        const container = drawer?.querySelector(
            `.${prefixCls}-container`,
        ) as HTMLElement | null;
        if (container) {
            expect(container.getAttribute('style')).toContain(
                'display: none',
            );
        }
        wrapper.unmount();
    });
});
