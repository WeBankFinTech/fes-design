// column.tsx 分支补全（基线未覆盖分支：169、190、193、194、195）
//
// 分支语义（vue 3.5.13 源码实证）：
// - 169  parentId: parentInstance.uid || null —— uid 是 runtime-core 模块级计数器；
//   VTU mount 会包一层匿名 Parent（占走 uid=0），表内列永远走左侧真值。
//   仅当宿主组件是本模块内首个实例（uid=0，falsy）时才走右侧 null。
// - 186  slot 返回非数组（单 vnode）→ 不进入收集循环
// - 189/190  列 vnode（name 命中）与 shapeFlag≠36 的子节点收进 children 渲染；
//   shapeFlag=36（STATEFUL|SLOTS_CHILDREN）的非列组件被丢弃
// - 193-197  Fragment 展开分支：Fragment vnode 的 shapeFlag 恒为 0/8/16/32，
//   真实挂载到不了 else-if（它只在 shapeFlag===36 时求值）；用例按该防御分支
//   预期的 vnode 形态打标驱动收集逻辑（被打标的 Fragment 本身被展开替换，不进渲染）
import { mount } from '@vue/test-utils';
import {
    Fragment,
    defineComponent,
    h,
    nextTick,
    provide,
    render as vueRender,
} from 'vue';
import Table from '../table';
import FTableColumn from '../column';
import { provideKey } from '../const';
import { wait } from '../../_util/__tests__/helpers';

const DATA = [
    { id: 1, name: '张三', age: 20 },
    { id: 2, name: '李四', age: 25 },
];

// 带 slots children 的有状态组件：shapeFlag = 4|32 = 36，走「丢弃」分支
const NotColumn = defineComponent({
    name: 'NotColumn',
    setup() {
        return () => h('b', '不该出现');
    },
});

const mountTable = (slot: any) =>
    mount(
        defineComponent({
            setup() {
                return () =>
                    h(Table, { data: DATA, rowKey: 'id' }, { default: slot });
            },
        }),
        { attachTo: document.body },
    );

describe('FTableColumn 分支覆盖（render 收集与列注册）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    // 必须是文件内首个挂载用例：uid=0 依赖模块内「首个组件实例」的时点
    test('169: 宿主组件 uid 为 0 时 parentId 兜底为 null', async () => {
        const addColumn = vi.fn();
        const removeColumn = vi.fn();
        const Host = defineComponent({
            setup() {
                provide(provideKey, { addColumn, removeColumn } as any);
                return () => h(FTableColumn, { prop: 'name', label: '姓名' });
            },
        });
        const host = document.createElement('div');
        document.body.appendChild(host);
        vueRender(h(Host), host);
        await nextTick();
        expect(addColumn).toHaveBeenCalledTimes(1);
        const registered = addColumn.mock.calls[0][0];
        // parentInstance.uid 为 0（falsy）→ 走 `|| null` 右侧
        expect(registered.parentId).toBe(null);
        expect(registered.props.label).toBe('姓名');
        // 卸载对称：removeColumn 收到同一个列 id
        vueRender(null, host);
        expect(removeColumn).toHaveBeenCalledTimes(1);
        expect(removeColumn.mock.calls[0][0]).toBe(registered.id);
    });

    test('190: 普通元素子节点（shapeFlag≠36）收进列容器渲染', async () => {
        const wrapper = mountTable(() => [
            h(
                FTableColumn,
                { key: 'group', label: '父列' },
                {
                    default: () => [
                        h(FTableColumn, {
                            key: 'name',
                            prop: 'name',
                            label: '姓名',
                        }),
                        h('span', { key: 'raw' }, '裸元素'),
                    ],
                },
            ),
        ]);
        await nextTick();
        await wait();
        const hidden = wrapper.find('.hidden-columns');
        expect(hidden.exists()).toBe(true);
        // shapeFlag≠36 → push：裸元素渲染在列容器的 div 内
        expect(hidden.text()).toContain('裸元素');
        // 列收集不受影响：子列正常注册为分组子列并渲染数据
        expect(wrapper.text()).toContain('姓名');
        expect(wrapper.text()).toContain('张三');
        wrapper.unmount();
    });

    test('190/193: shapeFlag=36 的非列组件子节点被丢弃', async () => {
        const wrapper = mountTable(() => [
            h(
                FTableColumn,
                { key: 'group', label: '父列' },
                {
                    default: () => [
                        h(FTableColumn, {
                            key: 'name',
                            prop: 'name',
                            label: '姓名',
                        }),
                        // 有状态组件 + slots children → shapeFlag 36，name 非列 → 丢弃
                        h(NotColumn, { key: 'nc' }, { default: () => '不该出现' }),
                    ],
                },
            ),
        ]);
        await nextTick();
        await wait();
        // 36 形态的非列组件不进 children，整棵子树不渲染
        expect(wrapper.text()).not.toContain('不该出现');
        // 同组正常列不受影响
        expect(wrapper.text()).toContain('张三');
        wrapper.unmount();
    });

    test('186: slot 返回单个 vnode（非数组）跳过容器收集，嵌套列经再次挂载归入父列分组', async () => {
        const wrapper = mountTable(() => [
            h(
                FTableColumn,
                { key: 'group', label: '父列' },
                {
                    // 单 vnode 而非数组：column.tsx 的 Array.isArray 判否，
                    // 容器收集循环不执行；嵌套列 vnode 由再次调用列 default
                    // slot 的单元格渲染链路（cell.tsx）重新创建并挂载注册，
                    // 实证其 parentId 指向父列 → 仍归入分组（组件现状行为）
                    default: () =>
                        h(FTableColumn, {
                            key: 'age',
                            prop: 'age',
                            label: '年龄',
                        }),
                },
            ),
        ]);
        await nextTick();
        await wait();
        // 容器未收集数组：列容器内不产生文本节点
        expect(wrapper.find('.hidden-columns').text()).toBe('');
        // 嵌套列归入父列分组：两级表头
        expect(wrapper.findAll('thead tr').length).toBe(2);
        expect(wrapper.text()).toContain('年龄');
        expect(wrapper.text()).toContain('20');
        // 姓名列在任何路径都未注册：无其表头与数据
        expect(wrapper.text()).not.toContain('张三');
        wrapper.unmount();
    });

    test('190: Fragment 包裹的列 vnode 整体收进 children（真实模板场景）', async () => {
        const wrapper = mountTable(() => [
            h(
                FTableColumn,
                { key: 'group', label: '父列' },
                {
                    default: () => [
                        h(Fragment, { key: 'fg' }, [
                            h(FTableColumn, {
                                key: 'age',
                                prop: 'age',
                                label: '年龄',
                            }),
                            h(FTableColumn, {
                                key: 'name',
                                prop: 'name',
                                label: '姓名',
                            }),
                        ]),
                    ],
                },
            ),
        ]);
        await nextTick();
        await wait();
        // Fragment（shapeFlag 16≠36）整体 push 进 children 渲染，
        // 内部列 vnode 正常挂载注册为父列的分组子列
        expect(wrapper.findAll('thead tr').length).toBe(2);
        expect(wrapper.text()).toContain('张三');
        expect(wrapper.text()).toContain('20');
        wrapper.unmount();
    });

    test('193-195: shapeFlag=36 的 Fragment 按防御分支展开收集', async () => {
        // vue 3.5.13 下 Fragment vnode 的 shapeFlag 恒为 0/8/16/32，真实挂载
        // 到不了 else-if（它只在 shapeFlag===36 时求值）。按该防御分支预期的
        // vnode 形态打标以驱动收集逻辑；被打标的 Fragment 被展开替换，不进渲染
        const fragment = h(Fragment, { key: 'fg' }, [
            h(FTableColumn, { key: 'age', prop: 'age', label: '年龄' }),
            h(FTableColumn, { key: 'name', prop: 'name', label: '姓名' }),
        ]);
        fragment.shapeFlag = 36;
        const wrapper = mountTable(() => [
            h(
                FTableColumn,
                { key: 'group', label: '父列' },
                {
                    default: () => [fragment],
                },
            ),
        ]);
        await nextTick();
        await wait();
        // 展开后子列直接收进 children → 注册为父列的分组子列
        expect(wrapper.findAll('thead tr').length).toBe(2);
        expect(wrapper.text()).toContain('张三');
        expect(wrapper.text()).toContain('20');
        wrapper.unmount();
    });

    test('catch: default slot 抛错时兜底渲染空容器', async () => {
        // 脱离 Table 使用：setup 走 inject 失败早退，render 仍执行
        const spy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        try {
            const wrapper = mount(FTableColumn, {
                slots: {
                    default: () => {
                        throw new Error('slot boom');
                    },
                },
            });
            await nextTick();
            // catch 兜底 children = [] → 仅渲染空 div
            expect(wrapper.find('div').exists()).toBe(true);
            expect(wrapper.find('div').text()).toBe('');
            expect(spy).toHaveBeenCalled();
            wrapper.unmount();
        } finally {
            spy.mockRestore();
        }
    });
});
