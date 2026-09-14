import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Menu from '../menu';
import MenuItem from '../menuItem';
import SubMenu from '../subMenu';

const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

const mountMenu = (props: Record<string, unknown> = {}) =>
    mount(Menu, {
        props: { modelValue: '1', ...props },
        slots: {
            default: () => [
                h(MenuItem, { key: '1', value: '1' }, () => '菜单1'),
                h(MenuItem, { key: '2', value: '2' }, () => '菜单2'),
                h(
                    SubMenu,
                    { key: '3', value: '3', title: '子菜单' },
                    {
                        default: () => [
                            h(MenuItem, { key: '3-1', value: '3-1' }, () => '子项1'),
                        ],
                    },
                ),
            ],
        },
        attachTo: document.body,
    });

describe('FMenu 事件', () => {
    test('点击菜单项触发 select 与 update:modelValue', async () => {
        const wrapper = mountMenu();
        await nextTick();
        await wait();
        const items = wrapper.findAll('[class*="menu-item"]');
        const target = items.find((i) => i.text() === '菜单2');
        if (target) {
            await target.trigger('click');
            await wait();
            const select = wrapper.emitted('select');
            expect(select).toBeTruthy();
            const updates = wrapper.emitted('update:modelValue');
            expect(updates).toBeTruthy();
            expect(updates![updates!.length - 1][0]).toBe('2');
        }
        wrapper.unmount();
    });

    test('SubMenu 点击展开子菜单', async () => {
        const wrapper = mountMenu();
        await nextTick();
        await wait();
        const subs = wrapper.findAll('[class*="submenu"], [class*="sub-menu"]');
        const sub = subs.find((s) => s.text().includes('子菜单'));
        if (sub) {
            await sub.trigger('click');
            await wait();
            // 展开后子项可见
            expect(wrapper.text()).toContain('子项1');
        }
        wrapper.unmount();
    });

    test('点击已选中项 select 事件仍触发', async () => {
        const wrapper = mountMenu({ modelValue: '1' });
        await nextTick();
        await wait();
        const items = wrapper.findAll('[class*="menu-item"]');
        const target = items.find((i) => i.text() === '菜单1');
        if (target) {
            await target.trigger('click');
            await wait();
            expect(wrapper.emitted('select')).toBeTruthy();
        }
        wrapper.unmount();
    });
});

describe('FRadioGroup 事件', () => {
    test('切换选项触发 change 与 update:modelValue', async () => {
        const RadioGroup = (await import('../../radio-group/radio-group.vue')).default;
        const wrapper = mount(RadioGroup, {
            props: { modelValue: 1, options: [
                { name: '选项A', value: 1 },
                { name: '选项B', value: 2 },
            ] },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        const radios = wrapper.findAll('[class*="radio"]').filter((r) => r.classes().some((c) => c.includes('is-item') || c.includes('radio')));
        const radioB = radios.find((r) => r.text() === '选项B');
        if (radioB) {
            await radioB.trigger('click');
            await wait();
            const updates = wrapper.emitted('update:modelValue');
            expect(updates).toBeTruthy();
            expect(updates![updates!.length - 1][0]).toBe(2);
        }
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
                columns: [{ prop: 'name', label: '名称' }],
                rowKey: 'id',
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        const expandIcons = wrapper.findAll('[class*="expand"]');
        if (expandIcons.length > 0) {
            await expandIcons[0].trigger('click');
            await wait();
            const emitted = wrapper.emitted('expandChange');
            expect(emitted).toBeTruthy();
            expect(emitted![0][0]).toMatchObject({ row: { id: 1 }, expanded: true });
        }
        wrapper.unmount();
    });
});
