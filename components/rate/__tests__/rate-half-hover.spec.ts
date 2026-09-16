import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Rate from '../rate';
import { wait } from '../../_util/__tests__/helpers';

// jsdom 无法通过 init 设置 offsetX：手动构造事件
const fireWithOffset = (
    el: HTMLElement,
    type: string,
    offsetX: number,
) => {
    const ev = new MouseEvent(type, { bubbles: true });
    Object.defineProperty(ev, 'offsetX', { value: offsetX });
    Object.defineProperty(el, 'offsetWidth', {
        value: 40,
        configurable: true,
    });
    el.dispatchEvent(ev);
};

describe('FRate 半星与 hover 分支', () => {
    const mountRate = (props = {}) =>
        mount(Rate, {
            props: { modelValue: 3, ...props } as any,
            attachTo: document.body,
        });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('allowHalf：mousemove 左半与右半分支', async () => {
        const wrapper = mountRate({ allowHalf: true });
        await nextTick();
        const items = wrapper.findAll('.fes-rate-container > div');
        expect(items.length).toBe(5);
        // 右半（offsetX > halfWidth）
        fireWithOffset(items[3].element, 'mousemove', 30);
        await wait(50);
        // 左半（offsetX <= halfWidth）
        fireWithOffset(items[3].element, 'mousemove', 5);
        await wait(50);
        wrapper.unmount();
    });

    test('allowHalf 点击半星并触发 change', async () => {
        const wrapper = mountRate({ allowHalf: true, modelValue: 0 });
        await nextTick();
        const items = wrapper.findAll('.fes-rate-container > div');
        // 点击右半 → index+1
        fireWithOffset(items[2].element, 'click', 30);
        await wait(50);
        expect(wrapper.emitted('change')?.[0]).toEqual([3]);
        // 点击左半 → index+0.5
        fireWithOffset(items[2].element, 'click', 5);
        await wait(50);
        wrapper.unmount();
    });

    test('clearable：点击当前整星值清零', async () => {
        const wrapper = mountRate({ modelValue: 3, clearable: true });
        await nextTick();
        const items = wrapper.findAll('.fes-rate-container > div');
        fireWithOffset(items[2].element, 'click', 30);
        await wait(50);
        expect(wrapper.emitted('change')?.[0]).toEqual([0]);
        expect(wrapper.emitted('clear')).toBeTruthy();
        wrapper.unmount();
    });

    test('半星值 hover 离开后保持半星显示', async () => {
        const wrapper = mountRate({ allowHalf: true, modelValue: 2.5 });
        await nextTick();
        const items = wrapper.findAll('.fes-rate-container > div');
        // hover 右半后离开 → 命中半星保持分支（item 级 mouseleave 调 hoverLeave）
        fireWithOffset(items[2].element, 'mousemove', 30);
        await wait(50);
        fireWithOffset(items[2].element, 'mouseleave', 0);
        await wait(50);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        wrapper.unmount();
    });

    test('hover 离开恢复原值', async () => {
        const wrapper = mountRate({ modelValue: 3 });
        await nextTick();
        const items = wrapper.findAll('.fes-rate-container > div');
        fireWithOffset(items[1].element, 'mousemove', 10);
        await wait(50);
        fireWithOffset(items[1].element, 'mouseleave', 0);
        await wait(50);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        wrapper.unmount();
    });
});
