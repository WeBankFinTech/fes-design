import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Menu from '../menu';
import MenuItem from '../menuItem';
import SubMenu from '../subMenu';
import { wait } from '../../_util/__tests__/helpers';

const mountMenu = (props: Record<string, unknown> = {}) =>
    mount(Menu, {
        props: { modelValue: '1', ...props },
        slots: {
            default: () => [
                h(MenuItem, { key: '1', value: '1', label: '菜单1' }),
                h(MenuItem, { key: '2', value: '2', label: '菜单2' }),
                h(
                    SubMenu,
                    { key: '3', value: '3', title: '子菜单' },
                    {
                        default: () => [
                            h(MenuItem, { key: '3-1', value: '3-1', label: '子项1' }),
                        ],
                    },
                ),
            ],
        },
        attachTo: document.body,
    });

describe('FMenu 事件', () => {
    // 已知问题 #1017：MenuItem 的 renderTitle 只消费 label prop/slot，
    // default slot 子内容不渲染（元素挂载但文本为空）。用 label prop 验证交互，
    // 此用例显式锁定 default slot 现状，修复后应改为断言文本渲染。
    test('MenuItem default slot 子内容当前不渲染（#1017 现状）', async () => {
        const wrapper = mount(Menu, {
            props: { modelValue: '1' } as any,
            slots: {
                default: () => [
                    h(MenuItem, { key: '1', value: '1' }, () => '默认插槽内容'),
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // 元素已挂载，但 default slot 文本丢失
        expect(wrapper.findAll('.fes-menu-item').length).toBe(1);
        expect(wrapper.text()).not.toContain('默认插槽内容');
        wrapper.unmount();
    });

    test('点击菜单项触发 select 与 update:modelValue', async () => {
        const wrapper = mountMenu({ options: [
            { value: '1', label: '菜单1' },
            { value: '2', label: '菜单2' },
        ] });
        await nextTick();
        await wait();
        const items = wrapper.findAll('[class*="menu-item"]');
        expect(items.length).toBeGreaterThan(0);
        const target = items.find((i) => i.text() === '菜单2');
        expect(target).toBeTruthy();
        await target!.trigger('click');
        await wait();
        const select = wrapper.emitted('select');
        expect(select).toBeTruthy();
        const updates = wrapper.emitted('update:modelValue');
        expect(updates![updates!.length - 1][0]).toBe('2');
        wrapper.unmount();
    });
});

describe('FRadioGroup 事件', () => {
    test('切换选项触发 change 与 update:modelValue', async () => {
        const RadioGroup = (await import('../../radio-group/radio-group.vue')).default;
        const wrapper = mount(RadioGroup, {
            props: {
                modelValue: 1,
                options: [
                    { label: '选项A', value: 1 },
                    { label: '选项B', value: 2 },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        const radios = wrapper.findAll('[class*="radio"]').filter((r) => r.classes().some((c) => c.includes('is-item') || c.includes('radio')));
        const radioB = radios.find((r) => r.text() === '选项B');
        expect(radioB).toBeTruthy();
        await radioB!.trigger('click');
        await wait();
        const updates = wrapper.emitted('update:modelValue');
        expect(updates![updates!.length - 1][0]).toBe(2);
        wrapper.unmount();
    });
});

describe('FTable expand 事件', () => {
    test('展开行触发 expandChange', async () => {
        const Table = (await import('../../table/table')).default;
        const DATA = [
            { id: 1, name: 'a', children: [{ id: 11, name: 'a-1' }] },
            { id: 2, name: 'b' },
        ];
        const wrapper = mount(Table, {
            props: {
                data: DATA,
                columns: [
                    { type: 'expand', label: '' },
                    { prop: 'name', label: '名称' },
                ],
                rowKey: 'id',
            } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // 精确展开图标选择器（td.tsx 渲染 .fes-table-expand-icon），
        // 避免 [class*="expand"] 命中展开行容器等其它含 expand 的元素，
        // 全量高负载时点错对象导致偶发失败
        const expandIcons = wrapper.findAll('.fes-table-expand-icon');
        expect(expandIcons.length).toBeGreaterThan(0);
        await expandIcons[0].trigger('click');
        await wait();
        const emitted = wrapper.emitted('expandChange');
        expect(emitted![0][0]).toMatchObject({ row: { id: 1 }, expanded: true });
        wrapper.unmount();
    }, 15000); // FTable + 动态 import 高负载下曾 5s 超时偶发红：放宽到 15s（根因修复，非选择器加固）
});
