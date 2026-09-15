import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import PickerItem from '../picker-item.vue';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('time-picker');
const wait = (ms = 40) => new Promise((r) => setTimeout(r, ms));

const TIMES = Array.from({ length: 12 }, (_, i) => ({
    value: `${String(i).padStart(2, '0')}:00`,
    disabled: i === 3,
}));

const mountPickerItem = (props = {}) =>
    mount(PickerItem, {
        props: {
            times: TIMES,
            ...props,
        } as any,
        attachTo: document.body,
    });

describe('TimePicker picker-item 滚动与选择', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('点击可用项触发 change，禁用项不触发', async () => {
        const wrapper = mountPickerItem();
        await nextTick();
        await wait();
        const items = wrapper.findAll(`.${prefixCls}-content-item-child`);
        expect(items.length).toBe(12);
        await items[1].trigger('click');
        await wait();
        expect(wrapper.emitted('change')?.[0][0].value).toBe('01:00');
        // 禁用项（index 3）
        await items[3].trigger('click');
        await wait();
        expect(wrapper.emitted('change')?.length).toBe(1);
        wrapper.unmount();
    });

    test('value 命中后 selectedIndex 滚动定位', async () => {
        const wrapper = mountPickerItem({ value: '05:00' });
        await nextTick();
        await wait();
        // selectedIndex 命中 → scrollToSelected 分支执行
        expect(wrapper.emitted('change')).toBeUndefined();
        wrapper.unmount();
    });

    test('value 未命中时 index 回退 0', async () => {
        const wrapper = mountPickerItem({ value: '99:99' });
        await nextTick();
        await wait();
        // 12 个时间项均渲染，未命中 value 不影响列表
        expect(wrapper.findAll(`.${prefixCls}-content-item-child`).length).toBe(12);
        // 无任何项处于激活态
        expect(wrapper.findAll('.is-active').length).toBe(0);
        wrapper.unmount();
    });

    test('visible 变 true 时滚动到选中项', async () => {
        const wrapper = mountPickerItem({ visible: false, value: '05:00' });
        await nextTick();
        await wait();
        await wrapper.setProps({ visible: true });
        await nextTick();
        await wait();
        // 选中项带 is-active
        expect(wrapper.findAll('.is-active').length).toBe(1);
        expect(wrapper.find('.is-active').text()).toContain('05:00');
        wrapper.unmount();
    });

    test('focus 键盘导航向下滚动（difference > paddingBottom）', async () => {
        const wrapper = mountPickerItem({ focus: -1 });
        await nextTick();
        await wait();
        // focus 大于可视数 → setScrollTop 向下
        await wrapper.setProps({ focus: 10 });
        await nextTick();
        await wait();
        // focus 小于当前滚动 → difference < 0 分支
        await wrapper.setProps({ focus: 0 });
        await nextTick();
        await wait();
        // 键盘导航后列表仍完整渲染
        expect(wrapper.findAll(`.${prefixCls}-content-item-child`).length).toBe(12);
        wrapper.unmount();
    });

    test('selectedTime 无 data-key 时不触发', async () => {
        const wrapper = mountPickerItem();
        await nextTick();
        await wait();
        // 点击容器（非 li）→ 无 data-key
        await wrapper.find(`.${prefixCls}-content-item`).trigger('click');
        await wait();
        expect(wrapper.emitted('change')).toBeUndefined();
        wrapper.unmount();
    });

    test('visibleCount 影响 padding 与高度', () => {
        const wrapper = mountPickerItem({ visibleCount: 4 });
        const ul = wrapper.find(`.${prefixCls}-content-item`);
        expect(ul.attributes('style')).toContain('padding-bottom');
        wrapper.unmount();
    });
});
