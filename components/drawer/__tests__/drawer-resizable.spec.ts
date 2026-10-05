import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Drawer from '../drawer';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-drawer';

const mountDrawer = (props: Record<string, unknown>, slots = {}) =>
    mount(Drawer, {
        props: { show: true, title: 't', ...props },
        slots,
        attachTo: document.body,
    });

// jsdom 无布局，offsetWidth/offsetHeight 需 mock 后 resize 计算才可预期
const mockSize = (el: HTMLElement, value: number) => {
    Object.defineProperty(el, 'offsetWidth', {
        value,
        configurable: true,
    });
    Object.defineProperty(el, 'offsetHeight', {
        value,
        configurable: true,
    });
};

const getDragHandle = () =>
    document.querySelector(`.${prefixCls}-drag-icon`)!.parentElement as HTMLElement;

const getWrapperEl = () =>
    document.querySelector(`.${prefixCls}-wrapper`) as HTMLElement;

const dragTo = async (startX: number, endX: number, startY = 0) => {
    getDragHandle().dispatchEvent(
        new MouseEvent('mousedown', { clientX: startX, clientY: startY, bubbles: true }),
    );
    document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: endX, clientY: startY, bubbles: true }),
    );
    await wait(50);
    document.dispatchEvent(
        new MouseEvent('mouseup', { clientX: endX, clientY: startY, bubbles: true }),
    );
    await wait(50);
};

describe('FDrawer resizable', () => {
    test('resizable 渲染拖拽把手', async () => {
        const wrapper = mountDrawer({ resizable: true, placement: 'right' });
        await nextTick();
        await wait(50);
        expect(getDragHandle()).toBeTruthy();
        wrapper.unmount();
    });

    test('right placement：向左拖动宽度增加', async () => {
        const wrapper = mountDrawer({ resizable: true, placement: 'right', width: 400 });
        await nextTick();
        await wait(50);
        mockSize(getWrapperEl(), 400);
        // right 抽屉：offset = -40 → nextSize = 400 + 40 = 440
        await dragTo(100, 60);
        expect(getWrapperEl().getAttribute('style')).toContain('440px');
        wrapper.unmount();
    });

    test('left placement：拖动方向相反', async () => {
        const wrapper = mountDrawer({ resizable: true, placement: 'left', width: 400 });
        await nextTick();
        await wait(50);
        mockSize(getWrapperEl(), 400);
        // left 抽屉：offset = +40 → nextSize = 400 + 40 = 440
        await dragTo(100, 140);
        expect(getWrapperEl().getAttribute('style')).toContain('440px');
        wrapper.unmount();
    });

    test('resizeMin 限制最小宽度', async () => {
        const wrapper = mountDrawer({
            resizable: true,
            placement: 'right',
            width: 400,
            resizeMin: 300,
        });
        await nextTick();
        await wait(50);
        mockSize(getWrapperEl(), 400);
        // right：offset = +500 → nextSize = -100 → 被 min 300 限制
        await dragTo(0, 500);
        expect(getWrapperEl().getAttribute('style')).toContain('300px');
        wrapper.unmount();
    });

    test('resizeMax 限制最大宽度', async () => {
        const wrapper = mountDrawer({
            resizable: true,
            placement: 'right',
            width: 400,
            resizeMax: 500,
        });
        await nextTick();
        await wait(50);
        mockSize(getWrapperEl(), 400);
        // right：offset = -200 → nextSize = 600 → 被 max 500 限制
        await dragTo(100, -100);
        expect(getWrapperEl().getAttribute('style')).toContain('500px');
        wrapper.unmount();
    });

    test('top placement 用高度与 clientY', async () => {
        const wrapper = mountDrawer({ resizable: true, placement: 'top', height: 300 });
        await nextTick();
        await wait(50);
        const wrapperEl = getWrapperEl();
        mockSize(wrapperEl, 300);
        // top 抽屉：offset = 40（clientY 增大）→ nextSize = 300 + 40 = 340
        getDragHandle().dispatchEvent(
            new MouseEvent('mousedown', { clientX: 0, clientY: 100, bubbles: true }),
        );
        document.dispatchEvent(
            new MouseEvent('mousemove', { clientX: 0, clientY: 140, bubbles: true }),
        );
        await wait(50);
        document.dispatchEvent(
            new MouseEvent('mouseup', { clientX: 0, clientY: 140, bubbles: true }),
        );
        await wait(50);
        expect(wrapperEl.getAttribute('style')).toContain('340px');
        wrapper.unmount();
    });

    test('mousedown 后未 move 时不改变尺寸', async () => {
        const wrapper = mountDrawer({ resizable: true, placement: 'right', width: 400 });
        await nextTick();
        await wait(50);
        const styleBefore = getWrapperEl().getAttribute('style');
        getDragHandle().dispatchEvent(
            new MouseEvent('mousedown', { clientX: 0, bubbles: true }),
        );
        await wait(50);
        document.dispatchEvent(
            new MouseEvent('mouseup', { clientX: 0, bubbles: true }),
        );
        await wait(50);
        expect(getWrapperEl().getAttribute('style')).toBe(styleBefore);
        wrapper.unmount();
    });
});

describe('FDrawer dimension', () => {
    test('top placement 高度生效', async () => {
        const wrapper = mountDrawer({ placement: 'top', dimension: '260px' });
        await nextTick();
        await wait(50);
        expect(getWrapperEl().getAttribute('style')).toContain('260px');
        wrapper.unmount();
    });

    test('footer slot 渲染', async () => {
        const wrapper = mountDrawer(
            { footer: true },
            { footer: () => h('div', '页脚区') },
        );
        await nextTick();
        await wait(50);
        expect(document.body.textContent).toContain('页脚区');
        wrapper.unmount();
    });
});
