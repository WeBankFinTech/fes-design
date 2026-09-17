import { mount } from '@vue/test-utils';
import { nextTick, reactive } from 'vue';
import Cascader from '../cascader';
import {
    getCascadeParentByKeys,
    scrollIntoParentView,
} from '../helper';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-cascader';

// 三级数据：覆盖 handleChildren 递归、handleParent 半选判定
const TREE_3 = [
    {
        label: '广东',
        value: 'gd',
        children: [
            {
                label: '深圳',
                value: 'sz',
                children: [{ label: '南山', value: 'ns' }],
            },
            { label: '广州', value: 'gz' },
        ],
    },
    { label: '湖南', value: 'hn' },
];

const mountCascader = (props: Record<string, unknown> = {}) => {
    document.body.innerHTML = '';
    return mount(Cascader, {
        props: { data: TREE_3, ...props },
        attachTo: document.body,
    });
};

const node = (wrapper: any, value: string) =>
    wrapper.find(`.${prefixCls}-node[data-value='${value}']`);

/**
 * 不可达分支说明（真实交互链下无法触发，不硬造 mock）
 * - cascader.tsx L247 `if (expose)`：Vue 3.5 下 defineComponent setup 的
 *   expose 参数恒为函数（编译产物直接传入），假分支实际不可达。
 * - cascaderNode.tsx L164 handleClickCheckbox `if (disabled.value)`：
 *   节点 disabled 时 renderCheckbox 渲染的 Checkbox 自带 disabled 属性，
 *   checkbox 组件内部先拦截点击，onChange 永远不触发该守卫。
 * - cascaderNode.tsx L167 `checkable && isCheckLoaded` 假臂：
 *   isCheckLoaded=false 时渲染的是 Tooltip 包裹的 disabled Checkbox
 *   （无 onChange 绑定），同样无法从 UI 走到该判断。
 * - cascaderNode.tsx L172 handleClickRadio `if (disabled.value)`：
 *   disabled 节点的 Radio 自带 disabled，点击被 Radio 内部拦截。
 * - cascaderNode.tsx L176 handleClickRadio `if (selectable.value)` 假臂：
 *   Radio 仅在 selectable=true 时渲染（renderRadio 前置条件），守卫恒真。
 * - getCascadeParentByKeys：组件内未引用（仅 helper 导出），只能直接单测覆盖
 *   （技能八.2 纯算法模块独立单测）。
 * - scrollIntoParentView：jsdom 无布局引擎，offsetTop/scrollTop 全 0，
 *   滚动分支直接单测 + 桩几何属性覆盖（任务允许 defineProperty stub）。
 */
describe('FCascader cascader.tsx 分支', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    test('multiple+cascade 时 checkStrictly 非法值触发告警', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mountCascader({
            multiple: true,
            cascade: true,
            checkStrictly: 'unknown',
        });
        await nextTick();
        await wait();
        // 非合法枚举 → 进入告警分支
        expect(
            warn.mock.calls.some((c) => String(c[0]).includes('checkStrictly')),
        ).toBe(true);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('single 模式 checkStrictly=parent 触发告警', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mountCascader({
            multiple: false,
            checkStrictly: 'parent',
        });
        await nextTick();
        await wait();
        // parent 不在 single 合法列表 [all, child] → 告警分支
        expect(
            warn.mock.calls.some((c) => String(c[0]).includes('checkStrictly')),
        ).toBe(true);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('data 清空后重置 expandedKeys/selectedKeys/checkedKeys', async () => {
        const wrapper = mountCascader({
            selectable: true,
            selectedKeys: ['hn'],
            expandedKeys: ['gd'],
            checkedKeys: ['gz', 'ns'],
        });
        await nextTick();
        await wait();
        await wrapper.setProps({ data: [] });
        await nextTick();
        await wait();
        // nextData.length === 0 → 三组 keys 全部重置为空数组
        const expanded = wrapper.emitted('update:expandedKeys');
        const selected = wrapper.emitted('update:selectedKeys');
        const checked = wrapper.emitted('update:checkedKeys');
        expect(expanded).toBeTruthy();
        expect(expanded![expanded!.length - 1][0]).toEqual([]);
        expect(selected).toBeTruthy();
        expect(selected![selected!.length - 1][0]).toEqual([]);
        expect(checked).toBeTruthy();
        expect(checked![checked!.length - 1][0]).toEqual([]);
        // 菜单清空后渲染空态
        expect(wrapper.text()).toContain('暂无数据');
        wrapper.unmount();
    });

    test('data 由空变非空（watch 非空臂）能正常渲染菜单', async () => {
        const wrapper = mount(Cascader, {
            props: { data: [], selectable: true },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('暂无数据');
        await wrapper.setProps({ data: TREE_3 });
        await nextTick();
        await wait();
        // nextData.length !== 0 → 直接走转换渲染
        expect(node(wrapper, 'gd').exists()).toBe(true);
        expect(wrapper.findAll(`.${prefixCls}-node`).length).toBe(2);
        wrapper.unmount();
    });

    test('selectable=false 时 expose selectNode 直接拒绝', async () => {
        const wrapper = mountCascader({ selectable: false });
        await nextTick();
        await wait();
        (wrapper.vm as any).selectNode('hn');
        await nextTick();
        // !props.selectable → 提前 return，不产生任何 select/更新
        expect(wrapper.emitted('select')).toBeUndefined();
        expect(wrapper.emitted('update:selectedKeys')).toBeUndefined();
        wrapper.unmount();
    });

    test('multiple 模式点击已选项移除（cancelable=true）', async () => {
        const wrapper = mountCascader({
            multiple: true,
            selectable: true,
            selectedKeys: ['hn'],
        });
        await nextTick();
        await wait();
        await node(wrapper, 'hn')
            .find(`.${prefixCls}-node-content`)
            .trigger('click');
        await nextTick();
        // index !== -1 → cancelable=true → splice 移除
        const select = wrapper.emitted('select');
        expect(select).toBeTruthy();
        expect(select![0][0]).toMatchObject({
            selectedKeys: [],
            selected: false,
        });
        const updates = wrapper.emitted('update:selectedKeys');
        expect(updates![updates!.length - 1][0]).toEqual([]);
        wrapper.unmount();
    });

    test('multiple+cancelable=false 点击已选项不移除', async () => {
        const wrapper = mountCascader({
            multiple: true,
            selectable: true,
            cancelable: false,
            selectedKeys: ['hn'],
        });
        await nextTick();
        await wait();
        await node(wrapper, 'hn')
            .find(`.${prefixCls}-node-content`)
            .trigger('click');
        await nextTick();
        // cancelable=false → splice 分支被跳过，值保持
        const select = wrapper.emitted('select');
        expect(select).toBeTruthy();
        expect(select![0][0]).toMatchObject({
            selectedKeys: ['hn'],
            selected: true,
        });
        expect(node(wrapper, 'hn').classes()).toContain('is-selected');
        wrapper.unmount();
    });

    test('single+cancelable=false 再次点击已选项不取消', async () => {
        const wrapper = mountCascader({
            selectable: true,
            cancelable: false,
            selectedKeys: ['hn'],
        });
        await nextTick();
        await wait();
        await node(wrapper, 'hn')
            .find(`.${prefixCls}-node-content`)
            .trigger('click');
        await nextTick();
        // else if (index !== -1) → cancelable=false → 保持选中
        const select = wrapper.emitted('select');
        expect(select).toBeTruthy();
        expect(select![0][0]).toMatchObject({
            selectedKeys: ['hn'],
            selected: true,
        });
        expect(node(wrapper, 'hn').classes()).toContain('is-selected');
        wrapper.unmount();
    });

    test('checkedKeys 含未匹配节点时联动过滤（异步兼容）', async () => {
        const wrapper = mountCascader({
            multiple: true,
            cascade: true,
            checkable: true,
            checkedKeys: ['ghost'],
        });
        await nextTick();
        await wait();
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        // getCheckedKeys：nodeList 无 ghost → !node → return false 清除；
        // 默认 checkStrictly=child 仅叶子进 payload
        const check = wrapper.emitted('check');
        expect(check).toBeTruthy();
        const payload = check![0][0] as any;
        expect(payload.checkedKeys).not.toContain('ghost');
        expect(payload.checkedKeys).toContain('gz');
        expect(payload.checkedKeys).not.toContain('gd');
        wrapper.unmount();
    });

    test('checkStrictly=all 联动勾选父级保留在 keys', async () => {
        const wrapper = mountCascader({
            multiple: true,
            cascade: true,
            checkable: true,
            checkStrictly: 'all',
        });
        await nextTick();
        await wait();
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        // checkStrictly === ALL → return true，父级 gd 一并保留
        const payload = wrapper.emitted('check')![0][0] as any;
        expect(payload.checkedKeys).toContain('gd');
        expect(payload.checkedKeys).toContain('sz');
        expect(payload.checkedKeys).toContain('gz');
        wrapper.unmount();
    });

    test('checkStrictly 非法值 cascade 勾选走兜底 return true', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mountCascader({
            multiple: true,
            cascade: true,
            checkable: true,
            checkStrictly: 'unknown',
        });
        await nextTick();
        await wait();
        expect(
            warn.mock.calls.some((c) => String(c[0]).includes('checkStrictly')),
        ).toBe(true);
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        // 非 all/parent/child → 落到兜底 return true，全部保留
        const payload = wrapper.emitted('check')![0][0] as any;
        expect(payload.checkedKeys).toContain('gd');
        expect(payload.checkedKeys).toContain('ns');
        wrapper.unmount();
    });

    test('cascade 取消勾选父节点联动清除子级（含递归）', async () => {
        const wrapper = mountCascader({
            multiple: true,
            cascade: true,
            checkable: true,
        });
        await nextTick();
        await wait();
        const gdCheckbox = node(wrapper, 'gd').find(
            `.${prefixCls}-node-checkbox .fes-checkbox`,
        );
        await gdCheckbox.trigger('click');
        await nextTick();
        // 勾选父级 → 子级（含孙级递归）全部入原始 keys
        const firstUpd = wrapper.emitted('update:checkedKeys')![0][0] as any[];
        expect(firstUpd).toContain('gd');
        expect(firstUpd).toContain('sz');
        expect(firstUpd).toContain('ns');
        const first = wrapper.emitted('check')![0][0] as any;
        expect(first.checkedKeys).toContain('gz');
        expect(first.checkedKeys).toContain('ns');
        await gdCheckbox.trigger('click');
        await nextTick();
        // 取消父级 → splice + handleChildren(false) 递归清除
        const events = wrapper.emitted('check')!;
        const last = events[events.length - 1][0] as any;
        expect(last.checked).toBe(false);
        expect(last.checkedKeys).toEqual([]);
        const updates = wrapper.emitted('update:checkedKeys')!;
        expect(updates[updates.length - 1][0]).toEqual([]);
        wrapper.unmount();
    });

    test('cascade 逐级勾选叶子：全部子级选中才联动父级', async () => {
        const wrapper = mountCascader({
            multiple: true,
            cascade: true,
            checkable: true,
        });
        await nextTick();
        await wait();
        // 先展开 gd 让 sz/gz 进入 DOM
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-switcher`)
            .trigger('click');
        await wait();
        await node(wrapper, 'sz')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        // 单勾 sz：父级 gd 不满足 every(...) → 不进原始 keys
        let upd = wrapper.emitted('update:checkedKeys')![0][0] as any[];
        expect(upd).toContain('sz');
        expect(upd).not.toContain('gd');
        await node(wrapper, 'gz')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        // sz+gz 全选 → handleParent every 满足 → 父级 gd 进原始 keys
        const updates = wrapper.emitted('update:checkedKeys')!;
        upd = updates[updates.length - 1][0] as any[];
        expect(upd).toContain('gz');
        expect(upd).toContain('gd');
        wrapper.unmount();
    });

    test('cascade 半选态：取消其中一个叶子后父级退出 keys', async () => {
        const wrapper = mountCascader({
            multiple: true,
            cascade: true,
            checkable: true,
        });
        await nextTick();
        await wait();
        // 展开 gd 让 sz/gz 进入 DOM
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-switcher`)
            .trigger('click');
        await wait();
        await node(wrapper, 'sz')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await node(wrapper, 'gz')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        // 全勾状态：父级已联动进原始 keys
        let updates = wrapper.emitted('update:checkedKeys')!;
        expect(updates[updates.length - 1][0]).toContain('gd');
        // 取消 sz → handleParent(false) 移除父级 gd
        await node(wrapper, 'sz')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        updates = wrapper.emitted('update:checkedKeys')!;
        const lastUpd = updates[updates.length - 1][0] as any[];
        expect(lastUpd).toContain('gz');
        expect(lastUpd).not.toContain('gd');
        wrapper.unmount();
    });

    test('cascade 直接取消勾选叶子：不再递归清除子级（非叶子分支走空）', async () => {
        const wrapper = mountCascader({
            multiple: true,
            cascade: true,
            checkable: true,
        });
        await nextTick();
        await wait();
        // 先勾选 gd 整棵（gd/sz/ns/gz 全入原始 keys）
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        // 展开 gd 后取消叶子 gz：isLeaf=true → 跳过 handleChildren
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-switcher`)
            .trigger('click');
        await wait();
        await node(wrapper, 'gz')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        // 取消叶子 gz：handleParent(false) 联动移除父级 gd；
        // 因 gz 是叶子 → if (!isLeaf) 为假，跳过 handleChildren（其余子树保留）
        const updates = wrapper.emitted('update:checkedKeys')!;
        const lastUpd = updates[updates.length - 1][0] as any[];
        expect(lastUpd).not.toContain('gz');
        expect(lastUpd).not.toContain('gd');
        expect(lastUpd).toContain('sz');
        expect(lastUpd).toContain('ns');
        wrapper.unmount();
    });

    test('cascade 受控父级仅勾选父节点：取消时子级不在数组走跳过臂', async () => {
        const wrapper = mountCascader({
            multiple: true,
            cascade: true,
            checkable: true,
            checkedKeys: ['gd'],
        });
        await nextTick();
        await wait();
        // 受控态：只有 gd 在 keys（子级缺失），取消 gd
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        // handleChildren(false)：sz/ns/gz 均不在数组 → 各子级循环内 index
        // 为 -1（跳过 splice），最终清空
        const updates = wrapper.emitted('update:checkedKeys')!;
        expect(updates[updates.length - 1][0]).toEqual([]);
        const check = wrapper.emitted('check')!;
        expect(check[check.length - 1][0]).toMatchObject({
            checkedKeys: [],
            checked: false,
        });
        wrapper.unmount();
    });

    test('cascade 受控子级部分已勾：勾父级时不重复 push 子级', async () => {
        const wrapper = mountCascader({
            multiple: true,
            cascade: true,
            checkable: true,
            checkedKeys: ['sz'],
        });
        await nextTick();
        await wait();
        // 受控态已有 sz，勾选 gd → handleChildren(add)：sz 已在数组中 → 跳过重复
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        const updates = wrapper.emitted('update:checkedKeys')!;
        const lastUpd = updates[updates.length - 1][0] as any[];
        expect(lastUpd.filter((k: any) => k === 'sz').length).toBe(1);
        expect(lastUpd).toContain('gz');
        wrapper.unmount();
    });

    test('cascade 受控叶子已勾：取消叶子时父级不在数组走跳过臂', async () => {
        const wrapper = mountCascader({
            multiple: true,
            cascade: true,
            checkable: true,
            checkedKeys: ['gz'],
        });
        await nextTick();
        await wait();
        // 受控态仅 gz（父级 gd 未联动），展开后取消 gz
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-switcher`)
            .trigger('click');
        await wait();
        await node(wrapper, 'gz')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        // handleParent(false)：gd 不在数组 → index===-1 跳过 splice
        const updates = wrapper.emitted('update:checkedKeys')!;
        expect(updates[updates.length - 1][0]).toEqual([]);
        const check = wrapper.emitted('check')!;
        expect(check[check.length - 1][0]).toMatchObject({ checked: false });
        wrapper.unmount();
    });

    test('cascade 受控父级已勾：勾选子级时父级不重复 push', async () => {
        const wrapper = mountCascader({
            multiple: true,
            cascade: true,
            checkable: true,
            checkedKeys: ['gd'],
        });
        await nextTick();
        await wait();
        // 受控态已有 gd，展开后勾 sz → handleParent(add)：gd 已在数组 → 跳过重复
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-switcher`)
            .trigger('click');
        await wait();
        await node(wrapper, 'sz')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        const updates = wrapper.emitted('update:checkedKeys')!;
        const lastUpd = updates[updates.length - 1][0] as any[];
        expect(lastUpd.filter((k: any) => k === 'gd').length).toBe(1);
        expect(lastUpd).toContain('sz');
        wrapper.unmount();
    });
});

describe('FCascader helper.ts 纯函数分支', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('getCascadeParentByKeys 全子级勾选时补进父级', () => {
        const nodeList: any = {
            gd: {
                value: 'gd',
                level: 1,
                indexPath: ['gd'],
                children: [{ value: 'sz' }, { value: 'gz' }],
            },
            sz: { value: 'sz', level: 2, indexPath: ['gd', 'sz'] },
            gz: { value: 'gz', level: 2, indexPath: ['gd', 'gz'] },
        };
        const res = getCascadeParentByKeys(nodeList, ['sz', 'gz']);
        // every(...) 满足 → 父级 gd 补入
        expect(res).toEqual(['gd', 'sz', 'gz']);
    });

    test('getCascadeParentByKeys 部分勾选不补父级、幽灵 key 跳过', () => {
        const nodeList: any = {
            gd: {
                value: 'gd',
                level: 1,
                indexPath: ['gd'],
                children: [{ value: 'sz' }, { value: 'gz' }],
            },
            sz: { value: 'sz', level: 2, indexPath: ['gd', 'sz'] },
            gz: { value: 'gz', level: 2, indexPath: ['gd', 'gz'] },
        };
        // 仅 sz：every 不满足 → 无父级
        expect(getCascadeParentByKeys(nodeList, ['sz'])).toEqual(['sz']);
        // ghost 不在 nodeList → if (node) 跳过
        expect(getCascadeParentByKeys(nodeList, ['ghost'])).toEqual([]);
    });

    test('getCascadeParentByKeys level-1 节点无父级可提', () => {
        const nodeList: any = {
            gd: { value: 'gd', level: 1, indexPath: ['gd'], children: [] },
        };
        // parentValue 为 undefined → 不进入补父分支，原样返回
        expect(getCascadeParentByKeys(nodeList, ['gd'])).toEqual(['gd']);
    });

    test('scrollIntoParentView 节点在可视区上方时上滚', () => {
        const parent = document.createElement('div');
        const el = document.createElement('div');
        const scrollTo = vi.fn();
        Object.defineProperty(parent, 'scrollTo', {
            value: scrollTo,
            configurable: true,
            writable: true,
        });
        Object.defineProperty(el, 'offsetTop', { value: 30, configurable: true });
        Object.defineProperty(parent, 'offsetTop', {
            value: 100,
            configurable: true,
        });
        Object.defineProperty(parent, 'scrollTop', {
            value: 0,
            configurable: true,
            writable: true,
        });
        // elementToParent(-70) - scrollTop(0) < 0 → scrollTo(top: -70)
        scrollIntoParentView(el, parent);
        expect(scrollTo).toHaveBeenCalledTimes(1);
        expect(scrollTo).toHaveBeenCalledWith({ top: -70 });
    });

    test('scrollIntoParentView 节点在可视区下方时下滚', () => {
        const parent = document.createElement('div');
        const el = document.createElement('div');
        const scrollTo = vi.fn();
        Object.defineProperty(parent, 'scrollTo', {
            value: scrollTo,
            configurable: true,
            writable: true,
        });
        Object.defineProperty(el, 'offsetTop', { value: 300, configurable: true });
        Object.defineProperty(el, 'offsetHeight', {
            value: 40,
            configurable: true,
        });
        Object.defineProperty(parent, 'offsetTop', {
            value: 0,
            configurable: true,
        });
        Object.defineProperty(parent, 'scrollTop', {
            value: 0,
            configurable: true,
            writable: true,
        });
        Object.defineProperty(parent, 'offsetHeight', {
            value: 200,
            configurable: true,
        });
        // elementToParent(300)+offsetHeight(40)-0 > 200 → 下滚
        scrollIntoParentView(el, parent);
        expect(scrollTo).toHaveBeenCalledTimes(1);
        expect(scrollTo).toHaveBeenCalledWith({ top: 140 });
    });

    test('scrollIntoParentView 无父元素时安全返回', () => {
        const el = document.createElement('div');
        // 未挂载 → parentElement 为 null → !parent return
        expect(() => scrollIntoParentView(el)).not.toThrow();
        expect(el.parentElement).toBeNull();
    });

    test('scrollIntoParentView 未传 parent 时回退 element.parentElement', () => {
        const parent = document.createElement('div');
        const el = document.createElement('div');
        const scrollTo = vi.fn();
        Object.defineProperty(parent, 'scrollTo', {
            value: scrollTo,
            configurable: true,
            writable: true,
        });
        Object.defineProperty(el, 'offsetTop', { value: 10, configurable: true });
        Object.defineProperty(parent, 'offsetTop', {
            value: 100,
            configurable: true,
        });
        Object.defineProperty(parent, 'scrollTop', {
            value: 0,
            configurable: true,
            writable: true,
        });
        parent.appendChild(el);
        // parent 缺省 → parent || element.parentElement 取父容器
        scrollIntoParentView(el);
        expect(scrollTo).toHaveBeenCalledTimes(1);
        expect(scrollTo).toHaveBeenCalledWith({ top: -90 });
    });
});

describe('FCascader cascaderNode.tsx 分支', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    const DATA_NODE_FLAGS = [
        { label: '不可选', value: 'no-sel', selectable: false },
        { label: '可选', value: 'sel' },
    ];

    test('节点级 selectable=false 覆盖根缺省臂，兄弟节点仍可选', async () => {
        const wrapper = mount(Cascader, {
            props: { data: DATA_NODE_FLAGS, selectable: true },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // selectable:false 节点：props 分支生效 → 点击无效
        await node(wrapper, 'no-sel')
            .find(`.${prefixCls}-node-content`)
            .trigger('click');
        await nextTick();
        expect(wrapper.emitted('select')).toBeUndefined();
        // 未声明 selectable 节点：回退根 true → 可选中
        await node(wrapper, 'sel')
            .find(`.${prefixCls}-node-content`)
            .trigger('click');
        await nextTick();
        const select = wrapper.emitted('select');
        expect(select).toBeTruthy();
        expect(select![0][0]).toMatchObject({ selectedKeys: ['sel'] });
        wrapper.unmount();
    });

    const DATA_CHECK_FLAGS = [
        { label: '可勾选', value: 'ck', checkable: true },
        { label: '普通', value: 'plain' },
    ];

    test('节点级 checkable 渲染勾选框并触发 check', async () => {
        const wrapper = mount(Cascader, {
            props: {
                data: DATA_CHECK_FLAGS,
                checkable: false,
                multiple: true,
                cascade: false,
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // 节点显式 checkable:true → 渲染 checkbox（根 checkable=false 缺省臂）
        const ckBox = node(wrapper, 'ck').find(
            `.${prefixCls}-node-checkbox .fes-checkbox`,
        );
        expect(ckBox.exists()).toBe(true);
        // 显式 checkable:false/未声明节点 → 无 checkbox
        expect(
            node(wrapper, 'plain').find(`.${prefixCls}-node-checkbox`).exists(),
        ).toBe(false);
        await ckBox.trigger('click');
        await nextTick();
        const check = wrapper.emitted('check');
        expect(check).toBeTruthy();
        expect(check![0][0]).toMatchObject({ checkedKeys: ['ck'] });
        wrapper.unmount();
    });

    test('懒加载进行中再次点击 switcher 不重复请求', async () => {
        let resolveFn!: (v: unknown[]) => void;
        const loadData = vi.fn(
            () => new Promise<unknown[]>((r) => {
                resolveFn = r;
            }),
        );
        const data = reactive([{ value: 'p', label: '父节点', children: [] }]);
        const wrapper = mount(Cascader, {
            props: { data, loadData, remote: true },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        const switcher = node(wrapper, 'p').find(
            `.${prefixCls}-node-switcher`,
        );
        await switcher.trigger('click');
        await nextTick();
        // isLoading=true 期间再次点击 → 守卫早退，不再触发 loadData
        await switcher.trigger('click');
        await nextTick();
        expect(loadData).toHaveBeenCalledTimes(1);
        // 数据返回后子级渲染
        resolveFn([{ value: 'c1', label: '懒加载子' }]);
        await wait(120);
        await node(wrapper, 'p')
            .find(`.${prefixCls}-node-content`)
            .trigger('click');
        await wait(80);
        expect(wrapper.text()).toContain('懒加载子');
        wrapper.unmount();
    });

    test('loadData 返回非数组时子级不加载、可再次请求', async () => {
        const loadData = vi.fn(async () => undefined);
        const data = reactive([{ value: 'p', label: '父节点', children: [] }]);
        const wrapper = mount(Cascader, {
            props: { data, loadData, remote: true },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        await node(wrapper, 'p')
            .find(`.${prefixCls}-node-switcher`)
            .trigger('click');
        await wait(120);
        // isArray(children) 为 false → 不写 children 也不展开
        expect(loadData).toHaveBeenCalledTimes(1);
        expect(wrapper.text()).not.toContain('懒加载子');
        // 仍是非加载态，再次点击继续请求
        await node(wrapper, 'p')
            .find(`.${prefixCls}-node-switcher`)
            .trigger('click');
        await wait(120);
        expect(loadData).toHaveBeenCalledTimes(2);
        wrapper.unmount();
    });

    test('click 触发展开模式下 hover switcher 不展开', async () => {
        const wrapper = mountCascader({ expandTrigger: 'click' });
        await nextTick();
        await wait();
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-switcher`)
            .trigger('mouseenter');
        await nextTick();
        await wait();
        // expandTrigger !== HOVER → handleHoverSwitcher 早退
        expect(wrapper.emitted('expand')).toBeUndefined();
        expect(node(wrapper, 'sz').exists()).toBe(false);
        wrapper.unmount();
    });

    test('click 触发展开模式下 hover 节点内容不展开', async () => {
        const wrapper = mountCascader({ expandTrigger: 'click' });
        await nextTick();
        await wait();
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-content`)
            .trigger('mouseenter');
        await nextTick();
        await wait();
        // handleHoverContent 早退：不触发展开（仅根级 2 个节点）
        expect(wrapper.emitted('expand')).toBeUndefined();
        expect(wrapper.findAll(`.${prefixCls}-node`).length).toBe(2);
        wrapper.unmount();
    });

    test('hover 模式下 hover 叶子内容不展开（非叶子分支跳过）', async () => {
        const wrapper = mountCascader({ expandTrigger: 'hover' });
        await nextTick();
        await wait();
        // 先悬停父级展开 gz 叶子
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-content`)
            .trigger('mouseenter');
        await nextTick();
        await wait();
        expect(node(wrapper, 'gz').exists()).toBe(true);
        const expands = wrapper.emitted('expand')!.length;
        // hover 叶子：isLeaf 早退，不再触发展开
        await node(wrapper, 'gz')
            .find(`.${prefixCls}-node-content`)
            .trigger('mouseenter');
        await nextTick();
        await wait();
        expect(wrapper.emitted('expand')!.length).toBe(expands);
        expect(node(wrapper, 'gz').classes()).not.toContain('is-expanded');
        wrapper.unmount();
    });

    test('hover 模式下 hover switcher 触发展开（非 HOVER 判断走假臂）', async () => {
        const wrapper = mountCascader({ expandTrigger: 'hover' });
        await nextTick();
        await wait();
        // hover 展开模式：对 switcher mouseenter → handleHoverSwitcher 非早退
        await node(wrapper, 'gd')
            .find(`.${prefixCls}-node-switcher`)
            .trigger('mouseenter');
        await nextTick();
        await wait();
        const expand = wrapper.emitted('expand');
        expect(expand).toBeTruthy();
        expect(expand![0][0]).toMatchObject({ expandedKeys: ['gd'] });
        expect(node(wrapper, 'sz').exists()).toBe(true);
        wrapper.unmount();
    });

    test('remote 未加载节点走 expose checkNode：children 为空跳过递归', async () => {
        const loadData = vi.fn(async () => []);
        const data = reactive([{ value: 'p', label: '父节点' }]);
        const wrapper = mount(Cascader, {
            props: { data, loadData, remote: true },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        // remote 下无 children 的节点 isLeaf=false（视为可加载父级），
        // checkNode 直接调用 → handleChildren(values, undefined) → if (children) 为假
        (wrapper.vm as any).checkNode('p');
        await nextTick();
        const updates = wrapper.emitted('update:checkedKeys');
        expect(updates).toBeTruthy();
        expect(updates![0][0]).toEqual(['p']);
        // 展开路径同时被触发（updateExpandedKeysBySelectOrCheck）
        const expand = wrapper.emitted('expand');
        expect(expand).toBeTruthy();
        wrapper.unmount();
    });

    test('content 点击叶子走 check 分支（selectable=false）', async () => {
        const wrapper = mountCascader({
            selectable: false,
            checkable: true,
            multiple: true,
            cascade: false,
        });
        await nextTick();
        await wait();
        await node(wrapper, 'hn')
            .find(`.${prefixCls}-node-content`)
            .trigger('click');
        await nextTick();
        // selectable=false → 内容点击落到 check 分支
        const check = wrapper.emitted('check');
        expect(check).toBeTruthy();
        expect(check![0][0]).toMatchObject({ checkedKeys: ['hn'] });
        expect(wrapper.emitted('select')).toBeUndefined();
        wrapper.unmount();
    });

    test('已禁用节点点击 checkbox 无效', async () => {
        const data = [{ label: '禁用', value: 'd1', disabled: true }];
        const wrapper = mount(Cascader, {
            props: { data, checkable: true, multiple: true },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(node(wrapper, 'd1').classes()).toContain('is-disabled');
        await node(wrapper, 'd1')
            .find(`.${prefixCls}-node-checkbox .fes-checkbox`)
            .trigger('click');
        await nextTick();
        // handleClickCheckbox：disabled → 早退
        expect(wrapper.emitted('check')).toBeUndefined();
        expect(wrapper.emitted('update:checkedKeys')).toBeUndefined();
        wrapper.unmount();
    });

    test('checkStrictly=all 单选渲染 radio，点击触发 select', async () => {
        const wrapper = mountCascader({
            selectable: true,
            checkable: false,
            checkStrictly: 'all',
        });
        await nextTick();
        await wait();
        const radio = node(wrapper, 'hn').find(
            `.${prefixCls}-node-radio .fes-radio`,
        );
        expect(radio.exists()).toBe(true);
        await radio.trigger('click');
        await nextTick();
        const select = wrapper.emitted('select');
        expect(select).toBeTruthy();
        expect(select![0][0]).toMatchObject({ selectedKeys: ['hn'] });
        expect(node(wrapper, 'hn').classes()).toContain('is-selected');
        wrapper.unmount();
    });

    test('checkStrictly=all 禁用节点点击 radio 无效', async () => {
        const data = [{ label: '禁用', value: 'd1', disabled: true }];
        const wrapper = mount(Cascader, {
            props: {
                data,
                selectable: true,
                checkable: false,
                checkStrictly: 'all',
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        const radio = node(wrapper, 'd1').find(
            `.${prefixCls}-node-radio .fes-radio`,
        );
        expect(radio.exists()).toBe(true);
        await radio.trigger('click');
        await nextTick();
        // handleClickRadio：disabled → 早退
        expect(wrapper.emitted('select')).toBeUndefined();
        expect(node(wrapper, 'd1').classes()).not.toContain('is-selected');
        wrapper.unmount();
    });

    test('未加载完成节点 checkbox 渲染 Tooltip 禁用态且不可勾选', async () => {
        const loadData = vi.fn(async () => []);
        const data = reactive([{ value: 'p', label: '父节点', children: [] }]);
        const wrapper = mount(Cascader, {
            props: {
                data,
                loadData,
                remote: true,
                checkable: true,
                multiple: true,
                cascade: true,
            },
            global: {
                stubs: {
                    // Popper 在 jsdom+VTU 下会递归更新，桩掉 Tooltip 直接驱动面板
                    FTooltip: {
                        template:
                            '<span class="tooltip-stub"><slot />{{ $attrs.content }}</span>',
                    },
                },
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        // isCheckLoaded=false → Tooltip 包裹禁用 checkbox
        const disabledBox = node(wrapper, 'p').find(
            `.${prefixCls}-node-checkbox .fes-checkbox.is-disabled`,
        );
        expect(disabledBox.exists()).toBe(true);
        await disabledBox.trigger('click');
        await nextTick();
        // handleClickCheckbox：isCheckLoaded=false → 不触发 check
        expect(wrapper.emitted('check')).toBeUndefined();
        expect(wrapper.text()).toContain('加载全部 父节点 的子节点后才可选中');
        wrapper.unmount();
    });

    test('节点 prefix/suffix 插槽渲染并可点击选中', async () => {
        const data = [
            {
                label: '带前后缀',
                value: 'pf',
                prefix: () => '[前]',
                suffix: () => '[后]',
            },
        ];
        const wrapper = mount(Cascader, {
            props: { data, selectable: true },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        const pNode = node(wrapper, 'pf');
        // slots.prefix/suffix 存在 → 渲染 content-prefix / content-suffix
        expect(pNode.find(`.${prefixCls}-node-content-prefix`).text()).toBe(
            '[前]',
        );
        expect(pNode.find(`.${prefixCls}-node-content-suffix`).text()).toBe(
            '[后]',
        );
        // 点击前缀不冒泡到 content（stopPropagation）
        await pNode
            .find(`.${prefixCls}-node-content-prefix`)
            .trigger('click');
        await nextTick();
        expect(wrapper.emitted('select')).toBeUndefined();
        wrapper.unmount();
    });
});

describe('FCascader cascaderMenu.tsx 分支', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('节点 prefix 为函数/字符串时渲染对应插槽', async () => {
        const data = [
            { label: 'A', value: 'a', prefix: () => 'A前' },
            { label: 'B', value: 'b', prefix: 'B前' },
        ];
        const wrapper = mount(Cascader, {
            props: { data },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // isFunction(node.prefix) / isString(node.prefix) 两条臂
        expect(node(wrapper, 'a').text()).toContain('A前');
        expect(node(wrapper, 'b').text()).toContain('B前');
        expect(
            wrapper.findAll(`.${prefixCls}-node-content-prefix`).length,
        ).toBe(2);
        wrapper.unmount();
    });

    test('节点 suffix 为函数/字符串时渲染对应插槽', async () => {
        const data = [
            { label: 'A', value: 'a', suffix: () => 'A后' },
            { label: 'B', value: 'b', suffix: 'B后' },
        ];
        const wrapper = mount(Cascader, {
            props: { data },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // isFunction(node.suffix) / isString(node.suffix) 两条臂
        expect(node(wrapper, 'a').text()).toContain('A后');
        expect(node(wrapper, 'b').text()).toContain('B后');
        expect(
            wrapper.findAll(`.${prefixCls}-node-content-suffix`).length,
        ).toBe(2);
        wrapper.unmount();
    });
});
