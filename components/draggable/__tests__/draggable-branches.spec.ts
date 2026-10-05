import { mount } from '@vue/test-utils';
import { computed, defineComponent, h, nextTick, ref, withDirectives } from 'vue';
import type { Ref } from 'vue';
import FDraggable from '../draggable';
import vDrag from '../directive';
import { useDraggable } from '../useDraggable';
import type { BeforeDragEnd } from '../useDraggable';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('draggable');

// 等一个宏任务，让 onDragend 内 await checkDragEnd() 的 async 链落定
const wait = (ms = 30) => new Promise((r) => setTimeout(r, ms));

const slotsRender = (slotProps: { item: unknown }) =>
    h('div', { class: 'drag-item' }, String(slotProps.item));

/**
 * v-drag 指令宿主组件
 * #1036 归一化后 binding 输入统一为纯数组：绑定解包后的数组（模板 v-drag="list" 的真实形态，
 * 渲染上下文顶层 ref 自动解包），不再把 Ref 对象本身当 binding.value（Ref 会被归一化为 []）。
 */
function getDirectiveComp(listRef: Ref<unknown[]>) {
    return defineComponent({
        directives: {
            drag: vDrag,
        },
        setup() {
            return () => withDirectives(
                h('ul', null, listRef.value.map((item) => h('li', { class: 'drag-li' }, String(item)))),
                [[vDrag, listRef.value]],
            );
        },
    });
}

// 不可达分支说明：
// 1. useDraggable pushAt 的 `if (index < 0)`：唯一入口 arrayMove 的 target 参数，
//    onDragover 中 drop.index 来自 computeDropTarget（子元素 index ≥ 0 或 list.length），
//    永远不会为负数，该分支不可达。
// 2. useDraggable `drop.index < 0` / `drop.index === -1`：computeDropTarget 只能返回
//    子元素 index（≥0）或 list.length，不可能为负，两分支均不可达。
// 3. directive emit 的 `(args[0] as unknown[]) || []` 缺省臂：指令模式的 UPDATE_MODEL_EVENT
//    只由 emit(list)（恒为数组）与 revertStatus 的 emit(backup.list)（备份恒为数组，
//    否则 forEach 先崩）触发，缺省臂不可达。
// 4. directive updated 的 `drag && props` 短路：dragInstanceMap 中两者总是成对写入，
//    只存在「无实例 → 走 init 兜底」的场景（disabled 修饰符用例已覆盖）。
// 5. draggable.tsx 的 b0/b8 是 @vue/babel-plugin-jsx 编译产物的插槽归一化守卫：
//    `_isSlot(_slot = props.modelValue.map(renderItem))` —— map 恒返回数组，
//    `_isSlot` 恒为 false，其真臂（函数/对象子节点）与 `!isVNode` 短路分支不可达。

describe('Draggable 分支覆盖', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        document.body.innerHTML = '';
    });

    test('默认 slot 缺省且 modelValue 有值：渲染为空（无子节点）', async () => {
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2] },
        });
        await nextTick();
        expect(wrapper.classes()).toContain(prefixCls);
        expect(wrapper.element.children.length).toBe(0);
        wrapper.unmount();
    });

    test('item 命名 slot 渲染列表项', async () => {
        const wrapper = mount(FDraggable, {
            props: { modelValue: ['a', 'b', 'c'] },
            slots: { item: slotsRender },
        });
        await nextTick();
        const items = wrapper.findAll('.drag-item');
        expect(items.length).toBe(3);
        expect(items[2].text()).toBe('c');
        wrapper.unmount();
    });

    test('slot 返回多个根节点：告警并只渲染首个节点', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1] },
            slots: {
                default: () => [
                    h('div', { class: 'drag-item' }, 'first'),
                    h('div', { class: 'drag-item' }, 'second'),
                ],
            },
        });
        await nextTick();
        expect(warn).toHaveBeenCalled();
        expect(warn.mock.calls.every((call) => String(call[0]).includes('default slot must be a root element'))).toBe(true);
        const items = wrapper.findAll('.drag-item');
        expect(items.length).toBe(1);
        expect(items[0].text()).toBe('first');
        wrapper.unmount();
    });

    test('真实拖拽链：mousedown 后 mousemove 位移置灰、dragend 复位', async () => {
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2, 3] },
            slots: { default: slotsRender },
        });
        await nextTick();
        // mousedown 记录坐标并标记可拖拽
        await wrapper.findAll('.drag-item')[0].trigger('mousedown', { clientX: 100, clientY: 100 });
        await nextTick();
        expect(wrapper.findAll('.drag-item')[0].attributes('draggable')).toBe('true');
        expect(wrapper.emitted('dragstart')).toBeTruthy();
        // 原地 mousemove（无位移）不置灰
        await wrapper.trigger('mousemove', { clientX: 100, clientY: 100 });
        await nextTick();
        expect(wrapper.findAll('.drag-item')[0].attributes('style') || '').not.toContain('opacity');
        // 位移后 mousemove 触发 setOpacity 默认 0.4
        await wrapper.trigger('mousemove', { clientX: 160, clientY: 140 });
        await nextTick();
        expect(wrapper.findAll('.drag-item')[0].attributes('style') || '').toContain('opacity: 0.4');
        // dragend 后透明度与 draggable 都复位
        await wrapper.trigger('dragend');
        await nextTick();
        const item = wrapper.findAll('.drag-item')[0];
        expect(item.attributes('style') || '').not.toContain('opacity: 0.4');
        expect(item.attributes('draggable')).toBeUndefined();
        wrapper.unmount();
    });

    test('mousedown 前 mousemove 直接返回：不置灰也不产生事件', async () => {
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2] },
            slots: { default: slotsRender },
        });
        await nextTick();
        await wrapper.trigger('mousemove', { clientX: 200, clientY: 200 });
        await nextTick();
        expect(wrapper.findAll('.drag-item')[0].attributes('style') || '').not.toContain('opacity');
        expect(wrapper.emitted('dragstart')).toBeUndefined();
        wrapper.unmount();
    });

    test('在容器自身 mousedown（非子项）不触发拖拽', async () => {
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2] },
            slots: { default: slotsRender },
        });
        await nextTick();
        await wrapper.trigger('mousedown', { clientX: 50, clientY: 50 });
        await nextTick();
        expect(wrapper.emitted('dragstart')).toBeUndefined();
        expect(wrapper.findAll('.drag-item')[0].attributes('draggable')).toBeUndefined();
        wrapper.unmount();
    });

    test('拖回自身（原地 drop）：顺序不变且不发 update', async () => {
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2, 3] },
            slots: { default: slotsRender },
        });
        await nextTick();
        const items = wrapper.findAll('.drag-item');
        await items[0].trigger('mousedown');
        await items[0].trigger('dragover');
        await items[0].trigger('dragend');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.findAll('.drag-item').map((i) => i.text()).join(',')).toBe('1,2,3');
        wrapper.unmount();
    });

    test('拖到容器空白处（列表外，越界 index）：钳制到末尾', async () => {
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2, 3] },
            slots: { default: slotsRender },
        });
        await nextTick();
        const items = wrapper.findAll('.drag-item');
        await items[0].trigger('mousedown');
        // dragover 落在容器自身：computeDropTarget 返回 index=list.length（越界，落到末尾）
        await wrapper.trigger('dragover');
        await items[0].trigger('dragend');
        await nextTick();
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect((emitted![0][0] as number[]).join(',')).toBe('2,3,1');
        const dragend = wrapper.emitted('dragend');
        expect(dragend).toBeTruthy();
        expect(dragend![0][2]).toBe(2);
        wrapper.unmount();
    });

    test('连续两次 dragover：第二次被动画未结束拦截，只发一次 update', async () => {
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2, 3] },
            slots: { default: slotsRender },
        });
        await nextTick();
        const items = wrapper.findAll('.drag-item');
        await items[0].trigger('mousedown');
        await items[2].trigger('dragover');
        await items[1].trigger('dragover');
        await items[0].trigger('dragend');
        await nextTick();
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted!.length).toBe(1);
        expect((emitted![0][0] as number[]).join(',')).toBe('2,3,1');
        wrapper.unmount();
    });

    test('拖出列表外释放（无 dragover）：位置不变，仅发 dragend', async () => {
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2, 3] },
            slots: { default: slotsRender },
        });
        await nextTick();
        const items = wrapper.findAll('.drag-item');
        await items[0].trigger('mousedown');
        await items[0].trigger('dragend');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        const dragend = wrapper.emitted('dragend');
        expect(dragend).toBeTruthy();
        expect(dragend![0][1]).toBe(1);
        expect(dragend![0][2]).toBe(0);
        expect(wrapper.findAll('.drag-item').map((i) => i.text()).join(',')).toBe('1,2,3');
        wrapper.unmount();
    });

    test('beforeDragend 返回 true：允许放置并收到 drag/drop 参数', async () => {
        const beforeDragend = vi.fn<BeforeDragEnd>().mockResolvedValue(true);
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2, 3], beforeDragend },
            slots: { default: slotsRender },
        });
        await nextTick();
        const items = wrapper.findAll('.drag-item');
        await items[0].trigger('mousedown');
        await items[2].trigger('dragover');
        await items[0].trigger('dragend');
        await nextTick();
        await wait();
        expect(beforeDragend).toHaveBeenCalledTimes(1);
        const [drag, drop] = beforeDragend.mock.calls[0];
        expect(drag.item).toBe(1);
        expect(drop.index).toBe(2);
        expect((wrapper.emitted('update:modelValue')![0][0] as number[]).join(',')).toBe('2,3,1');
        wrapper.unmount();
    });

    test('beforeDragend 返回 false：撤销放置，恢复原顺序', async () => {
        const beforeDragend = vi.fn<BeforeDragend>().mockResolvedValue(false);
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2, 3], beforeDragend },
            slots: { default: slotsRender },
        });
        await nextTick();
        const items = wrapper.findAll('.drag-item');
        await items[0].trigger('mousedown');
        await items[2].trigger('dragover');
        await items[0].trigger('dragend');
        await nextTick();
        await wait();
        expect(beforeDragend).toHaveBeenCalledTimes(1);
        const updates = wrapper.emitted('update:modelValue')!;
        expect(updates.length).toBe(2);
        expect((updates[0][0] as number[]).join(',')).toBe('2,3,1');
        expect((updates[1][0] as number[]).join(',')).toBe('1,2,3');
        wrapper.unmount();
    });

    test('modelValue 长度变化重建拖拽项后仍可排序', async () => {
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2] },
            slots: { default: slotsRender },
        });
        await nextTick();
        expect(wrapper.findAll('.drag-item').length).toBe(2);
        await wrapper.setProps({ modelValue: [1, 2, 3, 4] });
        await nextTick();
        const items = wrapper.findAll('.drag-item');
        expect(items.length).toBe(4);
        await items[3].trigger('mousedown');
        expect(items[3].attributes('draggable')).toBe('true');
        await items[0].trigger('dragover');
        await items[3].trigger('dragend');
        await nextTick();
        expect((wrapper.emitted('update:modelValue')![0][0] as number[]).join(',')).toBe('4,1,2,3');
        wrapper.unmount();
    });

    test('droppable 容器无拖拽源（未 mousedown）时 dragover 直接返回', async () => {
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2, 3], droppable: true },
            slots: { default: slotsRender },
        });
        const wrapper2 = mount(FDraggable, {
            props: { modelValue: [4, 5], droppable: true },
            slots: { default: slotsRender },
        });
        await nextTick();
        await wrapper2.findAll('.drag-item')[0].trigger('dragover');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper2.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('dragstart')).toBeUndefined();
        wrapper.unmount();
        wrapper2.unmount();
    });

    test('droppable 跨容器：源容器 item 移入目标容器', async () => {
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2, 3], droppable: true },
            slots: { default: slotsRender },
        });
        const wrapper2 = mount(FDraggable, {
            props: { modelValue: [4, 5], droppable: true },
            slots: { default: slotsRender },
        });
        await nextTick();
        const items = wrapper.findAll('.drag-item');
        const items2 = wrapper2.findAll('.drag-item');
        await items[0].trigger('mousedown');
        expect(items[0].attributes('draggable')).toBe('true');
        await items2[1].trigger('dragover');
        await nextTick();
        await items[0].trigger('dragend');
        await nextTick();
        await wait();
        expect((wrapper.emitted('update:modelValue')![0][0] as number[]).join(',')).toBe('2,3');
        expect((wrapper2.emitted('update:modelValue')![0][0] as number[]).join(',')).toBe('4,1,5');
        wrapper.unmount();
        wrapper2.unmount();
    });

    test('跨容器在源容器结束（drag index<0）：beforeDragend 不执行、放置保留', async () => {
        const beforeDragend = vi.fn<BeforeDragEnd>().mockResolvedValue(true);
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2], droppable: true, beforeDragend },
            slots: { default: slotsRender },
        });
        const wrapper2 = mount(FDraggable, {
            props: { modelValue: [3], droppable: true },
            slots: { default: slotsRender },
        });
        await nextTick();
        const items = wrapper.findAll('.drag-item');
        const items2 = wrapper2.findAll('.drag-item');
        await items[0].trigger('mousedown');
        await nextTick();
        await items2[0].trigger('dragover');
        await nextTick();
        await items[0].trigger('dragend');
        await nextTick();
        await wait();
        expect(beforeDragend).not.toHaveBeenCalled();
        expect((wrapper2.emitted('update:modelValue')![0][0] as number[]).join(',')).toBe('1,3');
        expect((wrapper.emitted('update:modelValue')![0][0] as number[]).join(',')).toBe('2');
        wrapper.unmount();
        wrapper2.unmount();
    });

    test('跨容器在目标容器结束：beforeDragend 收到 source 侧 drag 参数', async () => {
        const beforeDragend = vi.fn<BeforeDragEnd>().mockResolvedValue(true);
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2, 3], droppable: true },
            slots: { default: slotsRender },
        });
        const wrapper2 = mount(FDraggable, {
            props: { modelValue: [4, 5], droppable: true, beforeDragend },
            slots: { default: slotsRender },
        });
        await nextTick();
        const items = wrapper.findAll('.drag-item');
        const items2 = wrapper2.findAll('.drag-item');
        await items[0].trigger('mousedown');
        await nextTick();
        await items2[1].trigger('dragover');
        await nextTick();
        await items2[1].trigger('dragend');
        await nextTick();
        await wait();
        expect(beforeDragend).toHaveBeenCalledTimes(1);
        const [drag, drop] = beforeDragend.mock.calls[0];
        expect(drag.list).toEqual([1, 2, 3]);
        expect(drag.index).toBe(0);
        expect(drop.index).toBe(1);
        expect((wrapper2.emitted('update:modelValue')![0][0] as number[]).join(',')).toBe('4,1,5');
        wrapper.unmount();
        wrapper2.unmount();
    });

    test('v-drag 指令：无子节点且 binding 为 falsy 时安全初始化', async () => {
        const wrapper = mount(defineComponent({
            directives: { drag: vDrag },
            setup() {
                return () => withDirectives(h('ul', { class: 'drag-ul' }, []), [[vDrag, undefined]]);
            },
        }));
        await nextTick();
        expect(wrapper.find('.drag-ul').exists()).toBe(true);
        expect(wrapper.element.children.length).toBe(0);
        // 无子节点时 mousedown 也安全返回（findElement 防御）
        expect(() => {
            wrapper.element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        }).not.toThrow();
        wrapper.unmount();
    });

    test('droppable 跨容器二次放置：目标容器 backup 已存在的分支', async () => {
        const wrapper = mount(FDraggable, {
            props: { modelValue: [1, 2, 3], droppable: true },
            slots: { default: slotsRender },
        });
        const wrapper2 = mount(FDraggable, {
            props: { modelValue: [4, 5], droppable: true },
            slots: { default: slotsRender },
        });
        await nextTick();
        // 第一次放置到目标容器
        let items = wrapper.findAll('.drag-item');
        const items2 = wrapper2.findAll('.drag-item');
        await items[0].trigger('mousedown');
        await items2[1].trigger('dragover');
        await nextTick();
        await items[0].trigger('dragend');
        await nextTick();
        await wait();
        expect((wrapper2.emitted('update:modelValue')![0][0] as number[]).join(',')).toBe('4,1,5');
        // 目标容器动画复位（模拟 transitionend），保留其 backup.list
        await wrapper2.trigger('transitionend');
        await nextTick();
        // 第二次放置：目标容器 backup.list 已存在，走「直接移动 source 项」分支
        items = wrapper.findAll('.drag-item');
        await items[0].trigger('mousedown');
        await wrapper2.findAll('.drag-item')[1].trigger('dragover');
        await nextTick();
        await items[0].trigger('dragend');
        await nextTick();
        await wait();
        const updates2 = wrapper2.emitted('update:modelValue')!;
        expect(updates2[1][0]).toEqual([4, 2, 1, 5]);
        expect((wrapper.emitted('update:modelValue')![1][0] as number[]).join(',')).toBe('3');
        wrapper.unmount();
        wrapper2.unmount();
    });

    test('v-drag 指令：拖拽中列表清空后 mousemove 仍安全（updateStyle 无子节点）', async () => {
        const list = ref<unknown[]>([1, 2]);
        const wrapper = mount(getDirectiveComp(list));
        await nextTick();
        await wrapper.findAll('li')[0].trigger('mousedown');
        await nextTick();
        expect(wrapper.findAll('li')[0].attributes('draggable')).toBe('true');
        // 拖拽进行中列表被外部清空：el 无子节点时 updateStyle 直接返回
        list.value = [];
        await nextTick();
        expect(wrapper.element.children.length).toBe(0);
        expect(() => {
            wrapper.element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 60, clientY: 40 }));
        }).not.toThrow();
        wrapper.unmount();
    });

    test('v-drag 指令：整体拖拽链驱动 DOM 排序', async () => {
        const list = ref([1, 2, 3, 4]);
        const wrapper = mount(getDirectiveComp(list));
        await nextTick();
        expect(wrapper.findAll('li').length).toBe(4);
        // mousedown 前 mousemove 安全返回
        await wrapper.trigger('mousemove', { clientX: 50, clientY: 50 });
        // 按下第一项
        await wrapper.findAll('li')[0].trigger('mousedown', { clientX: 10, clientY: 10 });
        await nextTick();
        expect(wrapper.findAll('li')[0].attributes('draggable')).toBe('true');
        // 位移后透明度生效
        await wrapper.trigger('mousemove', { clientX: 80, clientY: 30 });
        await nextTick();
        expect(wrapper.findAll('li')[0].attributes('style') || '').toContain('opacity: 0.4');
        // dragover 到第 3 项位置后 dragend
        await wrapper.findAll('li')[2].trigger('dragover');
        await nextTick();
        await wrapper.findAll('li')[0].trigger('dragend');
        await nextTick();
        expect(list.value.join(',')).toBe('2,3,1,4');
        const lis = wrapper.findAll('li');
        expect(lis.map((li) => li.text()).join(',')).toBe('2,3,1,4');
        expect(lis[0].attributes('draggable')).toBeUndefined();
        wrapper.unmount();
    });

    test('v-drag 指令：空列表 / falsy value 安全初始化且 updated 同步新值', async () => {
        const list = ref<unknown[]>([1, 2]);
        const passValue = ref(true);
        // 注意：binding 用普通数组（模板 v-drag="list" 的真实形态）。
        // 若 binding 从 Ref 切换到 undefined，Vue 3.5 的 reactive 属性替换
        // 会触发 "Maximum recursive updates"（见指令 updated 分支探针），
        // 普通数组绑定不受影响。
        const wrapper = mount(defineComponent({
            directives: { drag: vDrag },
            setup() {
                return () => withDirectives(
                    h('ul', { class: 'drag-ul' }, list.value.map((item) => h('li', { class: 'drag-li' }, String(item)))),
                    [[vDrag, passValue.value ? list.value : undefined]],
                );
            },
        }));
        await nextTick();
        expect(wrapper.element.children.length).toBe(2);
        // updated：binding value 变 falsy，props.list 重置为空数组
        passValue.value = false;
        await nextTick();
        expect(wrapper.findAll('li').length).toBe(2);
        // updated：binding value 恢复，列表扩容后仍可拖拽
        passValue.value = true;
        list.value = [7, 8, 9];
        await nextTick();
        expect(wrapper.findAll('li').length).toBe(3);
        await wrapper.findAll('li')[0].trigger('mousedown');
        await nextTick();
        expect(wrapper.findAll('li')[0].attributes('draggable')).toBe('true');
        wrapper.unmount();
    });

    test('v-drag 指令：unmount 触发解绑', async () => {
        const list = ref([1, 2]);
        const wrapper = mount(getDirectiveComp(list));
        await nextTick();
        await wrapper.findAll('li')[0].trigger('mousedown');
        await nextTick();
        expect(wrapper.findAll('li')[0].attributes('draggable')).toBe('true');
        expect(() => wrapper.unmount()).not.toThrow();
        expect(wrapper.element.isConnected).toBe(false);
    });

    test('v-drag 指令：disabled 修饰符下 updated 无实例走 init 兜底且不产生拖拽', async () => {
        const list = ref([1, 2]);
        const wrapper = mount(defineComponent({
            directives: { drag: vDrag },
            setup() {
                return () => withDirectives(
                    h('ul', null, list.value.map((item) => h('li', { class: 'drag-li' }, String(item)))),
                    [[vDrag, list, undefined, { disabled: true }]],
                );
            },
        }));
        await nextTick();
        list.value = [1, 2, 3];
        await nextTick();
        const lis = wrapper.findAll('li');
        expect(lis.length).toBe(3);
        await lis[0].trigger('mousedown');
        await nextTick();
        expect(lis[0].attributes('draggable')).toBeUndefined();
        wrapper.unmount();
    });

    test('v-drag 指令：dragover 落在根文本节点（非子项非容器）直接返回', async () => {
        const list = ref([1, 2]);
        const wrapper = mount(defineComponent({
            directives: { drag: vDrag },
            setup() {
                return () => withDirectives(
                    h('ul', null, [
                        'stray text',
                        ...list.value.map((item) => h('li', { class: 'drag-li' }, String(item))),
                    ]),
                    [[vDrag, list]],
                );
            },
        }));
        await nextTick();
        const lis = wrapper.findAll('li');
        expect(lis.length).toBe(2);
        await lis[0].trigger('mousedown');
        await nextTick();
        expect(lis[0].attributes('draggable')).toBe('true');
        // 在 ul 的文本节点上 dragover：findElement 找不到目标且非容器自身 → drop 为空
        const textNode = wrapper.element.firstChild as Node;
        expect(textNode.nodeType).toBe(Node.TEXT_NODE);
        textNode.dispatchEvent(new MouseEvent('dragover', { bubbles: true, cancelable: true }));
        await lis[0].trigger('dragend');
        await nextTick();
        expect(list.value.join(',')).toBe('1,2');
        expect(wrapper.findAll('li').map((li) => li.text()).join(',')).toBe('1,2');
        wrapper.unmount();
    });

    test('useDraggable 无 ctx 时 emit 走 noop：完整状态机仍可运行', async () => {
        const el = document.createElement('div');
        const c1 = document.createElement('div');
        c1.textContent = '1';
        const c2 = document.createElement('div');
        c2.textContent = '2';
        el.append(c1, c2);
        const containerRef = ref<Element | undefined>(el);
        const list = ref([1, 2]);
        const propsRef = computed(() => ({
            list: list.value,
            droppable: false,
            disabled: false,
        }));
        const drag = useDraggable(containerRef, propsRef);
        el.addEventListener('mousedown', drag.onDragstart);
        el.addEventListener('mousemove', drag.onMousemove);
        el.addEventListener('dragover', drag.onDragover);
        el.addEventListener('dragend', drag.onDragend);
        await nextTick();
        c1.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0, clientY: 0 }));
        expect(drag.draggableItems[0].draggable).toBeTruthy();
        c1.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 40, clientY: 0 }));
        expect(drag.draggableItems[0].style.opacity).toBe(0.4);
        c2.dispatchEvent(new MouseEvent('dragover', { bubbles: true, cancelable: true }));
        c1.dispatchEvent(new MouseEvent('dragend', { bubbles: true }));
        await nextTick();
        expect(list.value.join(',')).toBe('2,1');
        expect(drag.draggableItems[0].draggable).toBeFalsy();
        el.remove();
    });

    test('useDraggable 无 ctx：容器引用失效（防御分支）时事件仍安全返回', async () => {
        const el = document.createElement('div');
        const c1 = document.createElement('div');
        c1.textContent = '1';
        el.appendChild(c1);
        const containerRef = ref<Element | undefined>(el);
        const list = ref([1]);
        const propsRef = computed(() => ({
            list: list.value,
            droppable: false,
            disabled: false,
        }));
        const drag = useDraggable(containerRef, propsRef);
        el.addEventListener('mousedown', drag.onDragstart);
        el.addEventListener('dragover', drag.onDragover);
        containerRef.value = undefined; // 模拟容器引用失效
        expect(() => {
            c1.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            el.dispatchEvent(new MouseEvent('dragover', { bubbles: true, cancelable: true }));
        }).not.toThrow();
        expect(list.value.join(',')).toBe('1');
        el.remove();
    });

    // ===== #1036 指令输入归一化为纯数组模型 =====

    // 进程级监听：binding 从 Ref 切换到 undefined 时，指令内部不再发生
    // Ref↔数组↔undefined 属性类型跃迁（旧实现触发 Vue 3.5 递归更新崩溃），
    // 归一化后恒为纯数组，不得产生任何 unhandledRejection / uncaughtException。
    test('#1036 指令：binding 从 Ref 切换到 undefined：归一化不崩且列表清空（0 unhandled）', async () => {
        const listRef = ref<unknown[]>([1, 2, 3]);
        const passValue = ref(true);
        const onDragstart = vi.fn();
        const onDragend = vi.fn();
        const unhandled: unknown[] = [];
        const collect = (reason: unknown) => {
            unhandled.push(reason);
        };
        process.on('unhandledRejection', collect);
        process.on('uncaughtException', collect);
        try {
            const wrapper = mount(defineComponent({
                directives: { drag: vDrag },
                setup() {
                    return () => withDirectives(
                        h('ul', null, listRef.value.map((item) => h('li', { class: 'drag-li' }, String(item)))),
                        // binding 直接传 Ref 对象本身（withDirectives 不做解包），
                        // 随后切换到 undefined：旧实现 props.list=undefined 触发类型跃迁
                        [[vDrag, passValue.value ? listRef : undefined, { onDragstart, onDragend }]],
                    );
                },
            }));
            await nextTick();
            expect(wrapper.findAll('li').length).toBe(3);
            // Ref 绑定归一化为 []：触发 dragstart 时 item 为 undefined（内部列表为空）
            await wrapper.findAll('li')[0].trigger('mousedown', { clientX: 10, clientY: 10 });
            await nextTick();
            expect(wrapper.findAll('li')[0].attributes('draggable')).toBe('true');
            await wrapper.findAll('li')[0].trigger('dragend');
            await nextTick();
            expect(onDragstart).toHaveBeenCalledTimes(1);
            expect(onDragstart.mock.calls[0][1]).toBeUndefined();
            // binding: Ref → undefined：updated 归一化 next=[]，不崩不减引用
            passValue.value = false;
            await nextTick();
            await wrapper.findAll('li')[0].trigger('mousedown', { clientX: 10, clientY: 10 });
            await wrapper.findAll('li')[0].trigger('dragend');
            await nextTick();
            // 用户数组未被清空（归一化只影响指令内部 list，不写坏用户数据）
            expect(listRef.value).toEqual([1, 2, 3]);
            await wrapper.findAll('li')[0].trigger('mousemove', { clientX: 60, clientY: 40 });
            expect(unhandled).toHaveLength(0);
            wrapper.unmount();
        } finally {
            process.removeListener('unhandledRejection', collect);
            process.removeListener('uncaughtException', collect);
        }
    });

    test('#1036 指令：binding 数组长度切换 [1,2,3]→[4]：DOM 同步只剩 1 项', async () => {
        const list = ref<unknown[]>([1, 2, 3]);
        // 数组绑定（模板 v-drag="list" 真实形态）
        const wrapper = mount(defineComponent({
            directives: { drag: vDrag },
            setup() {
                return () => withDirectives(
                    h('ul', null, list.value.map((item) => h('li', { class: 'drag-li' }, String(item)))),
                    [[vDrag, list.value]],
                );
            },
        }));
        await nextTick();
        expect(wrapper.findAll('li').length).toBe(3);
        // 整数组替换为长度 1 的新数组：updated 用归一化后的 next 替换 props.list
        list.value = [4];
        await nextTick();
        const lis = wrapper.findAll('li');
        expect(lis.length).toBe(1);
        expect(lis[0].text()).toBe('4');
        // 新列表上仍可正常拖拽
        await lis[0].trigger('mousedown', { clientX: 10, clientY: 10 });
        await nextTick();
        expect(lis[0].attributes('draggable')).toBe('true');
        wrapper.unmount();
    });

    test('#1036 回归：普通数组模式（数组绑定 + 整组拖拽链）驱动 DOM 排序', async () => {
        const list = ref([1, 2, 3, 4]);
        const wrapper = mount(getDirectiveComp(list));
        await nextTick();
        expect(wrapper.findAll('li').length).toBe(4);
        await wrapper.findAll('li')[0].trigger('mousedown', { clientX: 10, clientY: 10 });
        await nextTick();
        await wrapper.trigger('mousemove', { clientX: 80, clientY: 30 });
        await nextTick();
        await wrapper.findAll('li')[2].trigger('dragover');
        await nextTick();
        await wrapper.findAll('li')[0].trigger('dragend');
        await nextTick();
        expect(list.value.join(',')).toBe('2,3,1,4');
        expect(wrapper.findAll('li').map((li) => li.text()).join(',')).toBe('2,3,1,4');
        wrapper.unmount();
    });
});
