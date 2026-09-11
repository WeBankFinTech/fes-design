import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import FTransfer from '../transfer';
import { calcCheckStatus } from '../checkbox';
import {
    defaultFilter,
    flattenTree,
    isTree,
} from '../utils';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('transfer');
const cls = (s: string) => `${prefixCls}-${s}`;

const options = [
    { value: 'a', label: '选项A' },
    { value: 'b', label: '选项B' },
    { value: 'c', label: '选项C' },
];

describe('Transfer utils', () => {
    test('isTree 判断树形数据', () => {
        expect(isTree(options)).toBe(false);
        expect(
            isTree([{ value: 1, label: 'x', children: [{ value: 2, label: 'y' }] }]),
        ).toBe(true);
        expect(isTree([{ value: 1, label: 'x', children: [] }])).toBe(false);
    });

    test('flattenTree 展平树形数据', () => {
        const tree = [
            {
                value: 1,
                label: 'x',
                children: [
                    { value: 2, label: 'y' },
                    { value: 3, label: 'z', children: [{ value: 4, label: 'w' }] },
                ],
            },
        ];
        expect(flattenTree(tree).map((o) => o.value)).toEqual([1, 2, 3, 4]);
    });

    test('defaultFilter 按 label 包含判断', () => {
        expect(defaultFilter('A', options[0])).toBe(true);
        expect(defaultFilter('D', options[0])).toBe(false);
    });
});

describe('calcCheckStatus', () => {
    test('0 为 none', () => {
        expect(calcCheckStatus(0, 3)).toBe('none');
    });
    test('全选为 all', () => {
        expect(calcCheckStatus(3, 3)).toBe('all');
    });
    test('部分为 some', () => {
        expect(calcCheckStatus(1, 3)).toBe('some');
    });
});

describe('FTransfer', () => {
    test('单向模式基础渲染', async () => {
        const wrapper = mount(FTransfer, {
            props: { options },
        });
        await nextTick();
        expect(wrapper.find(`.${cls('one-way')}`).exists()).toBe(true);
        // 源面板树渲染选项（tree label 为渲染函数）
        // 树组件挂载后异步构建节点，此处断言容器与计数渲染
        expect(wrapper.find(`.${cls('panel-list')}.fes-tree`).exists()).toBe(
            true,
        );
        expect(wrapper.find(`.${cls('panel-count')}`).text()).toContain(
            `${options.length}`,
        );
        // 被选中的项显示在右侧面板
        const wrapper2 = mount(FTransfer, {
            props: { options, modelValue: ['a'] },
        });
        await nextTick();
        expect(wrapper2.text()).toContain('已选 1 项');
    });

    test('单向模式移除已选项', async () => {
        const wrapper = mount(FTransfer, {
            props: { options, modelValue: ['a', 'b'] },
        });
        await nextTick();
        const removeBtns = wrapper.findAll(
            `.${cls('checked-option-remove-button')}`,
        );
        expect(removeBtns.length).toBe(2);
        await removeBtns[0].trigger('click');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![0][0]).toEqual(['b']);
    });

    test('单向模式清空', async () => {
        const wrapper = mount(FTransfer, {
            props: { options, modelValue: ['a'] },
        });
        await nextTick();
        const clearBtn = wrapper.find(`.${cls('panel-clear-button')}`);
        expect(clearBtn.exists()).toBe(true);
        await clearBtn.trigger('click');
        expect(wrapper.emitted('update:modelValue')![0][0]).toEqual([]);
    });

    test('双向模式基础渲染与穿梭', async () => {
        const wrapper = mount(FTransfer, {
            props: { options, twoWay: true },
        });
        await nextTick();
        expect(wrapper.find(`.${cls('two-way')}`).exists()).toBe(true);
        expect(wrapper.text()).toContain('选项A');

        // 勾选源面板第一项
        const optionCheckboxes = wrapper.findAll(`.${cls('option')} .fes-checkbox`);
        expect(optionCheckboxes.length).toBeGreaterThanOrEqual(options.length);
        await optionCheckboxes[0].trigger('click');
        // 移动按钮激活，点击后 value 移入右侧
        const actionButtons = wrapper.findAll(`.${cls('action-button')}`);
        expect(actionButtons[0].attributes('disabled')).toBeUndefined();
        await actionButtons[0].trigger('click');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![0][0]).toEqual(['a']);
        expect(wrapper.emitted('change')).toBeTruthy();
    });

    test('双向模式反向穿梭', async () => {
        const wrapper = mount(FTransfer, {
            props: { options, twoWay: true, modelValue: ['a'] },
        });
        await nextTick();
        // 目标面板的选项（右侧面板）
        const targetCheckbox = wrapper.find(
            `.${cls('target-panel')} .${cls('option')} .fes-checkbox`,
        );
        expect(targetCheckbox.exists()).toBe(true);
        await targetCheckbox.trigger('click');
        const actionButtons = wrapper.findAll(`.${cls('action-button')}`);
        await actionButtons[1].trigger('click');
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted![0][0]).toEqual([]);
    });

    test('双向模式未勾选时按钮禁用', async () => {
        const wrapper = mount(FTransfer, {
            props: { options, twoWay: true },
        });
        await nextTick();
        const actionButtons = wrapper.findAll(`.${cls('action-button')}`);
        expect(actionButtons[0].attributes('disabled')).toBeDefined();
        expect(actionButtons[1].attributes('disabled')).toBeDefined();
    });

    test('双向模式计数显示', async () => {
        const wrapper = mount(FTransfer, {
            props: { options, twoWay: true, modelValue: ['a', 'b'] },
        });
        await nextTick();
        // 源面板 1 项，目标面板 2 项（计数 span 内含 &nbsp; 分隔）
        const counts = wrapper.findAll(`.${cls('panel-count')}`).map((n) => n.text());
        expect(counts[0]).toContain('0');
        expect(counts[0]).toContain('1');
        expect(counts[1]).toContain('0');
        expect(counts[1]).toContain('2');
    });

    test('双向模式树形数据回退单向并告警', async () => {
        const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const treeOptions: any[] = [
            {
                value: 'root',
                label: '根节点',
                children: [{ value: 'c1', label: '子节点' }],
            },
        ];
        const wrapper = mount(FTransfer, {
            props: { options: treeOptions, twoWay: true },
        });
        await nextTick();
        expect(consoleWarn).toHaveBeenCalled();
        expect(wrapper.find(`.${cls('one-way')}`).exists()).toBe(true);
        consoleWarn.mockRestore();
    });

    test('filterable 过滤源面板选项', async () => {
        const wrapper = mount(FTransfer, {
            props: { options, twoWay: true, filterable: true },
        });
        await nextTick();
        const filterInput = wrapper.find(`.${cls('panel-filter')} input`);
        expect(filterInput.exists()).toBe(true);
        await filterInput.setValue('A');
        await nextTick();
        const labels = wrapper.findAll(`.${cls('option-label')}`).map((n) => n.text());
        expect(labels).toContain('选项A');
        expect(labels).not.toContain('选项B');
    });

    test('height 开启虚拟滚动', async () => {
        const many = Array.from({ length: 30 }, (_, i) => ({
            value: i,
            label: `选项${i}`,
        }));
        const wrapper = mount(FTransfer, {
            props: { options: many, twoWay: true, height: 400 },
        });
        await nextTick();
        expect(wrapper.find(`.${cls('panel-list')}`).exists()).toBe(true);
    });

    test('label slot 自定义渲染', async () => {
        const wrapper = mount(FTransfer, {
            props: { options, twoWay: true },
            slots: {
                label: ({ option }: any) => `slot-${option.label}`,
            },
        });
        await nextTick();
        expect(wrapper.text()).toContain('slot-选项A');
    });

    test('全选 checkbox 状态联动', async () => {
        const wrapper = mount(FTransfer, {
            props: { options, twoWay: true },
        });
        await nextTick();
        // 源面板头部的全选框
        const headerCheckbox = wrapper.find(
            `.${cls('source-panel')} .${cls('panel-header')} .fes-checkbox`,
        );
        await headerCheckbox.trigger('click');
        const actionButtons = wrapper.findAll(`.${cls('action-button')}`);
        expect(actionButtons[0].attributes('disabled')).toBeUndefined();
        await actionButtons[0].trigger('click');
        expect(wrapper.emitted('update:modelValue')![0][0]).toEqual([
            'a',
            'b',
            'c',
        ]);
    });
});
