import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SelectTree from '../selectTree.vue';
import SelectTrigger from '../../select-trigger/selectTrigger.vue';
import Tree from '../../tree/tree';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-select-tree';

const data = [
    {
        label: '广东',
        value: 'gd',
        children: [
            { label: '深圳', value: 'sz' },
            { label: '广州', value: 'gz' },
        ],
    },
    { label: '湖南', value: 'hn' },
];

// 可控开关的 Popper stub：仅在点击 trigger 区域时切换 v-model，
// 面板内的节点点击不会冒泡到 trigger（真实 Popper 的点击外部关闭语义）
const TogglePopperStub = {
    name: 'Popper',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template:
        '<div class="popper-stub">'
        + '<div class="popper-trigger" @click="$emit(&quot;update:modelValue&quot;, !modelValue)"><slot name="trigger" /></div>'
        + '<div class="popper-panel" v-if="modelValue"><slot /></div>'
        + '</div>',
};

const mountSt = (props: Record<string, unknown>) =>
    mount(SelectTree, {
        props: { data, ...props },
        global: { stubs: { Popper: TogglePopperStub } },
        attachTo: document.body,
    });

const openPanel = async (wrapper: any) => {
    await wrapper.find('.popper-trigger').trigger('click');
    await wait(80);
};

const emitFromTrigger = (wrapper: any, event: string, payload?: unknown) => {
    const trigger = wrapper.findComponent(SelectTrigger as any);
    trigger.vm.$emit(event, payload);
};

describe('FSelectTree 交互链分支补全（branches2）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('virtualList 分支：虚拟滚动渲染树节点', async () => {
        const wrapper = mountSt({ virtualList: true });
        await openPanel(wrapper);
        // 虚拟化分支树面板渲染（含下拉类名与最小宽占位）
        const treePanel = wrapper.find(`.${prefixCls}-dropdown`);
        expect(treePanel.exists()).toBe(true);
        const nodes = wrapper.findAll('.fes-tree-node');
        expect(nodes.length).toBeGreaterThan(0);
        // 非空数据时空态元素 v-show 隐藏
        const empty = wrapper.find(`.${prefixCls}-null`);
        expect(empty.exists()).toBe(true);
        expect(empty.attributes('style') || '').toContain('display: none');
        wrapper.unmount();
    });

    test('virtualList 空数据渲染空态文案', async () => {
        const wrapper = mountSt({ virtualList: true, data: [] });
        await openPanel(wrapper);
        const empty = wrapper.find(`.${prefixCls}-null`);
        expect(empty.exists()).toBe(true);
        expect(empty.text().length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    test('单选 + emitPath：选中叶子写入路径数组并收起弹层', async () => {
        // 已知问题（建议提 issue）：单选 + emitPath 时 modelValue 传 null 会在
        // targetValues 计算中崩溃（null['length']），传标量会被截断；这里用
        // 路径数组形态的合法初始值 [] 走通真实选择链
        const wrapper = mountSt({ emitPath: true, modelValue: [] });
        await openPanel(wrapper);
        expect(wrapper.text()).toContain('请选择');
        await wrapper.find(`.fes-tree-node[data-value='gd'] .fes-tree-node-switcher`).trigger('click');
        await wait(80);
        const node = wrapper.find(`.fes-tree-node[data-value='sz']`);
        expect(node.exists()).toBe(true);
        await node.find('.fes-tree-node-content').trigger('click');
        await nextTick();
        await wait(80);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        // emitPath：payload 为整条路径
        expect(emitted![emitted!.length - 1][0]).toEqual(['gd', 'sz']);
        // 单选选中后弹层收起
        expect(wrapper.find('.popper-panel').exists()).toBe(false);
        wrapper.unmount();
    });

    test('multiple + emitPath：勾选父级写入路径数组（含子级）', async () => {
        const wrapper = mountSt({
            multiple: true,
            cascade: true,
            emitPath: true,
            modelValue: [],
        });
        await openPanel(wrapper);
        const boxes = wrapper.findAll('.fes-tree-node .fes-checkbox');
        expect(boxes.length).toBeGreaterThan(0);
        await boxes[0].trigger('click');
        await nextTick();
        await wait(80);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        const last = emitted![emitted!.length - 1][0] as string[][];
        // 级联勾选 gd → sz/gz，emitPath 映射为路径数组
        expect(last).toHaveLength(3);
        expect(JSON.stringify(last)).toContain('gd","sz');
        expect(JSON.stringify(last)).toContain('gd","gz');
        // gd 节点 checkbox 呈现勾选态（树节点 classList 不含 is-checked，落到 checkbox 上）
        expect(
            wrapper.find(`.fes-tree-node[data-value='gd'] .fes-checkbox`).classes(),
        ).toContain('is-checked');
        wrapper.unmount();
    });

    test('multiple 清空选中值：payload 重置为 []', async () => {
        const wrapper = mountSt({
            multiple: true,
            cascade: true,
            clearable: true,
            modelValue: ['sz'],
        });
        // 先打开弹层让 Tree 挂载回填 nodeList，tag 才能按 label 渲染
        await openPanel(wrapper);
        const tags = wrapper.find('.fes-select-trigger');
        expect(tags.text()).toContain('深圳');
        emitFromTrigger(wrapper, 'clear');
        await nextTick();
        await wait(80);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![emitted!.length - 1][0]).toEqual([]);
        expect(wrapper.emitted('clear')).toBeTruthy();
        wrapper.unmount();
    });

    test('disabled 组件点击节点不触发 select', async () => {
        const wrapper = mountSt({ disabled: true });
        await openPanel(wrapper);
        await wrapper.find(`.fes-tree-node[data-value='hn'] .fes-tree-node-content`).trigger('click');
        await nextTick();
        await wait(80);
        // 值层契约：disabled 时 handleSelect 提前返回，不产生任何值事件
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('change')).toBeUndefined();
        wrapper.unmount();
    });

    test('disabled 多选勾选无效', async () => {
        const wrapper = mountSt({ disabled: true, multiple: true });
        await openPanel(wrapper);
        const boxes = wrapper.findAll('.fes-tree-node .fes-checkbox');
        expect(boxes.length).toBeGreaterThan(0);
        await boxes[1].trigger('click');
        await nextTick();
        await wait(80);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('change')).toBeUndefined();
        wrapper.unmount();
    });

    test('blur 时收起已打开弹层', async () => {
        const wrapper = mountSt({ data, modelValue: null });
        await openPanel(wrapper);
        expect(wrapper.find('.popper-panel').exists()).toBe(true);
        emitFromTrigger(wrapper, 'blur', new Event('blur'));
        await nextTick();
        await wait(80);
        expect(wrapper.find('.popper-panel').exists()).toBe(false);
        expect(wrapper.emitted('blur')).toBeTruthy();
        wrapper.unmount();
    });

    test('filterable + 自定义 filter：仅展示匹配节点并触发 filter 事件', async () => {
        const filter = vi.fn((_value: string, node: any) => node.value === 'hn');
        const wrapper = mountSt({ filterable: true, filter });
        // 先打开弹层让 Tree 挂载，防抖回调才能调用 refTree.filter
        await openPanel(wrapper);
        const input = wrapper.find('input');
        expect(input.exists()).toBe(true);
        await input.setValue('湖');
        await wait(400);
        // 自定义 filter 被树过滤流程调用
        expect(filter).toHaveBeenCalled();
        expect(wrapper.emitted('filter')).toBeTruthy();
        expect(wrapper.emitted('filter')![wrapper.emitted('filter')!.length - 1][0]).toBe('湖');
        // 树只剩匹配节点：hn 可见，gd 被过滤
        expect(wrapper.find(`.fes-tree-node[data-value='hn']`).exists()).toBe(true);
        expect(wrapper.find(`.fes-tree-node[data-value='gd']`).exists()).toBe(false);
        wrapper.unmount();
    });

    test('filterable + label 自定义渲染：警告并过滤为空', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const fnLabelData = [
            { label: () => '渲染函数', value: 'fn' },
            { label: '普通', value: 'plain' },
        ];
        const wrapper = mountSt({ filterable: true, data: fnLabelData });
        // 打开弹层让 Tree 挂载，避免防抖回调对未挂载的 refTree 调用
        await openPanel(wrapper);
        await nextTick();
        await wait(50);
        // filterMethod 被访问即触发警告（filterable 且存在非字符串 label）
        expect(spy).toHaveBeenCalledWith(expect.stringContaining('自定义渲染'));
        const input = wrapper.find('input');
        await input.setValue('渲');
        await wait(400);
        // filterMethod 返回 () => false：所有节点被过滤
        expect(wrapper.findAll('.fes-tree-node').length).toBe(0);
        spy.mockRestore();
        wrapper.unmount();
    });

    test('打开弹层测量 trigger 宽度：下拉容器应用最小宽', async () => {
        const wrapper = mountSt({ data, modelValue: null });
        const triggerEl = wrapper.find('.fes-select-trigger').element;
        Object.defineProperty(triggerEl, 'offsetWidth', {
            value: 220,
            configurable: true,
            writable: true,
        });
        await openPanel(wrapper);
        const style = wrapper.find(`.${prefixCls}-dropdown`).attributes('style') || '';
        expect(style).toContain('min-width: 220px');
        wrapper.unmount();
    });

    test('showPath：indexPath 指向缺失节点时回退为 key 文本', async () => {
        const wrapper = mountSt({ showPath: true, modelValue: 'sz' });
        // 打开弹层让 Tree 挂载，拿到真实组件实例
        await openPanel(wrapper);
        const tree = wrapper.findComponent(Tree as any);
        expect(tree.exists()).toBe(true);
        tree.vm.$emit('update:nodeList', new Map([
            ['sz', { value: 'sz', label: '深圳', indexPath: ['missing', 'sz'], children: [] }],
        ]));
        await nextTick();
        await wait(80);
        // 缺失 key 的路径段回退为 key 文本，而不是崩溃
        expect(wrapper.find('.fes-select-trigger').text()).toContain('missing/深圳');
        wrapper.unmount();
    });

    test('单选模式收到 check 事件（防御分支）：关闭弹层并写入值', async () => {
        const wrapper = mountSt({ data, modelValue: null });
        await openPanel(wrapper);
        const tree = wrapper.findComponent(Tree as any);
        tree.vm.$emit('check', {
            checkedKeys: ['sz'],
            node: data[0].children![0],
            selected: true,
            event: new MouseEvent('click'),
        });
        await nextTick();
        await wait(80);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![emitted!.length - 1][0]).toBe('sz');
        expect(wrapper.find('.popper-panel').exists()).toBe(false);
        wrapper.unmount();
    });

    test('multiple 模式收到 select 事件（防御分支）：不收起弹层并写入数组', async () => {
        const wrapper = mountSt({ multiple: true, cascade: true, modelValue: [] });
        await openPanel(wrapper);
        const tree = wrapper.findComponent(Tree as any);
        tree.vm.$emit('select', {
            selectedKeys: ['sz'],
            node: data[0].children![0],
            selected: true,
            event: new MouseEvent('click'),
        });
        await nextTick();
        await wait(80);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![emitted!.length - 1][0]).toEqual(['sz']);
        // multiple 模式 select 不关闭弹层
        expect(wrapper.find('.popper-panel').exists()).toBe(true);
        wrapper.unmount();
    });

    test('multiple + emitPath：勾选 key 未回填 nodeList 时路径回退为 [key]', async () => {
        // 异步/远端场景中间态：Tree 已可勾选，但 SelectTree 的 nodeList 快照
        // 尚未回填该 key → getCurrentValueByKeys 走 `node?.indexPath || [key]`
        const wrapper = mountSt({ multiple: true, cascade: true, emitPath: true, modelValue: [] });
        await openPanel(wrapper);
        // 通过真实 update:nodeList 通道注入过期快照（仅父级，子级未回填）
        const tree = wrapper.findComponent(Tree as any);
        tree.vm.$emit('update:nodeList', new Map([
            ['gd', { value: 'gd', label: '广东', indexPath: ['gd'], children: [] }],
            ['hn', { value: 'hn', label: '湖南', indexPath: ['hn'], children: [] }],
        ]));
        await nextTick();
        // 真实勾选 sz（Tree 自身 nodeList 完整，交互不受影响）
        await wrapper.find(`.fes-tree-node[data-value='gd'] .fes-tree-node-switcher`).trigger('click');
        await wait(80);
        const boxes = wrapper.findAll(`.fes-tree-node[data-value='sz'] .fes-checkbox`);
        expect(boxes.length).toBe(1);
        await boxes[0].trigger('click');
        await nextTick();
        await wait(80);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        // sz 在 selectTree 侧未命中 nodeList → 路径回退为 [key]
        expect(emitted![emitted!.length - 1][0]).toEqual([['sz']]);
        wrapper.unmount();
    });

    test('单选 + emitPath：选中 key 未回填 nodeList 时路径回退为 []', async () => {
        const wrapper = mountSt({ emitPath: true, modelValue: [] });
        await openPanel(wrapper);
        const tree = wrapper.findComponent(Tree as any);
        // 过期快照：无 sz
        tree.vm.$emit('update:nodeList', new Map([
            ['gd', { value: 'gd', label: '广东', indexPath: ['gd'], children: [] }],
            ['hn', { value: 'hn', label: '湖南', indexPath: ['hn'], children: [] }],
        ]));
        await nextTick();
        await wrapper.find(`.fes-tree-node[data-value='gd'] .fes-tree-node-switcher`).trigger('click');
        await wait(80);
        const node = wrapper.find(`.fes-tree-node[data-value='sz']`);
        expect(node.exists()).toBe(true);
        await node.find('.fes-tree-node-content').trigger('click');
        await nextTick();
        await wait(80);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        // 未回填 → indexPath 为空数组 → 值写入 []
        expect(emitted![emitted!.length - 1][0]).toEqual([]);
        // 单选 select 仍会收起弹层
        expect(wrapper.find('.popper-panel').exists()).toBe(false);
        wrapper.unmount();
    });

    test('单选 + emitPath + modelValue=null：空回显不崩（无 TypeError）', async () => {
        // 修复前：#1037 targetValues 对 [null] 读 null.length 抛 TypeError，挂载即崩
        const wrapper = mountSt({ emitPath: true, modelValue: null });
        expect(wrapper.exists()).toBe(true);
        await openPanel(wrapper);
        // null 被过滤为安全降级：无选中项，回显占位符
        expect(wrapper.find('.fes-select-trigger').text()).toContain('请选择');
        wrapper.unmount();
    });

    test('单选 + emitPath + modelValue=标量：空回显（不再截断为末字符）', async () => {
        // 修复前：#1037 标量 'sz' 被 item[item.length-1] 截断为 'z'
        const wrapper = mountSt({ emitPath: true, modelValue: 'sz' });
        expect(wrapper.exists()).toBe(true);
        await openPanel(wrapper);
        const trigger = wrapper.find('.fes-select-trigger');
        expect(trigger.text()).toContain('请选择');
        expect(trigger.text()).not.toContain('z');
        wrapper.unmount();
    });

    test('multiple + emitPath：数组含 null/标量项时仅回显合法末级', async () => {
        const wrapper = mountSt({
            multiple: true,
            cascade: true,
            emitPath: true,
            modelValue: [['gd', 'sz'], null, 'bad'],
        });
        // 打开弹层让 Tree 挂载回填 nodeList，tag 才能按 label 渲染
        await openPanel(wrapper);
        const tags = wrapper.find('.fes-select-trigger');
        // null/标量项被过滤，仅合法路径 ['gd','sz'] 的末级 sz 回显
        expect(tags.text()).toContain('深圳');
        expect(tags.text()).not.toContain('bad');
        wrapper.unmount();
    });

    test('回归：单选 + emitPath + 合法路径数组正常回显', async () => {
        // 单选 emitPath 的合法形态为扁平路径数组（组件自身选择时发出 ['gd','sz']）
        const wrapper = mountSt({ emitPath: true, modelValue: ['gd', 'sz'] });
        // 打开弹层让 Tree 挂载回填 nodeList，label 才能按末级 key 渲染
        await openPanel(wrapper);
        expect(wrapper.find('.fes-select-trigger').text()).toContain('深圳');
        wrapper.unmount();
    });
});
