import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref, withDirectives } from 'vue';
import type { Ref } from 'vue';
import FDraggable from '../draggable';
import vDrag from '../directive';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('draggable');

const slotsRender = (slotProps: { item: unknown }) => h('div', { class: 'drag-item' }, slotProps.item as string);

// 使用 v-drag 指令的测试组件
function getDirectiveComp(listRef: Ref<number[]>) {
    return defineComponent({
        directives: {
            drag: vDrag,
        },
        setup() {
            return () => withDirectives(
                h('ul', null, listRef.value.map((item) => h('li', { class: 'drag-li' }, String(item)))),
                [[vDrag, listRef]],
            );
        },
    });
}

describe('Draggable', () => {
    test('列表渲染：按 modelValue 渲染每项，根节点带 fes-draggable 类名', async () => {
        const wrapper = mount(FDraggable, {
            props: {
                modelValue: [1, 2, 3, 4, 5],
            },
            slots: {
                default: slotsRender,
            },
        });
        await nextTick();

        expect(wrapper.classes()).toContain(prefixCls);
        const items = wrapper.findAll('.drag-item');
        expect(items.length).toBe(5);
        expect(items[0].text()).toBe('1');
        expect(items[4].text()).toBe('5');
    });

    test('拖拽排序：第 1 项拖到第 2 项后触发 update:modelValue', async () => {
        const list = ref([1, 2, 3, 4, 5]);
        const wrapper = mount(FDraggable, {
            props: {
                modelValue: list.value,
            },
            slots: {
                default: slotsRender,
            },
        });
        await nextTick();

        const children = wrapper.findAll('.drag-item');
        // mousedown 后当前项变为可拖拽
        await children[0].trigger('mousedown');
        expect(children[0].attributes('draggable')).toBe('true');

        // HTML5 拖拽：dragover 目标项后 dragend 完成排序
        await children[1].trigger('dragover');
        await children[1].trigger('dragend');
        await nextTick();

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted.length).toBeGreaterThan(0);
        expect((emitted[0][0] as number[]).join(',')).toBe('2,1,3,4,5');
    });

    test('disabled 时不可拖拽', async () => {
        const list = ref([1, 2, 3, 4, 5]);
        const wrapper = mount(FDraggable, {
            props: {
                modelValue: list.value,
                disabled: true,
            },
            slots: {
                default: slotsRender,
            },
        });
        await nextTick();

        expect(wrapper.classes()).toContain(`${prefixCls}-disabled`);
        const children = wrapper.findAll('.drag-item');
        await children[0].trigger('mousedown');
        // disabled 时不允许拖拽（draggable 保持 falsy，不渲染属性）
        expect(children[0].attributes('draggable')).toBeUndefined();
        // 也不触发 dragstart
        expect(wrapper.emitted('dragstart')).toBeUndefined();
        await children[2].trigger('dragend');
        // dragend 不产生任何事件，列表顺序不变
        expect(wrapper.emitted('dragend')).toBeUndefined();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.findAll('.drag-item').map((item) => item.text()).join(',')).toBe('1,2,3,4,5');
    });

    test('droppable 跨容器：从源容器拖到目标容器', async () => {
        const list = ref([1, 2, 3, 4]);
        const list2 = ref([5, 6, 7]);
        const wrapper = mount(FDraggable, {
            props: {
                modelValue: list.value,
                droppable: true,
            },
            slots: {
                default: slotsRender,
            },
        });
        const wrapper2 = mount(FDraggable, {
            props: {
                modelValue: list2.value,
                droppable: true,
            },
            slots: {
                default: slotsRender,
            },
        });
        await nextTick();

        const children = wrapper.findAll('.drag-item');
        const children2 = wrapper2.findAll('.drag-item');
        // 在源容器按下第 1 项
        await children[0].trigger('mousedown');
        expect(children[0].attributes('draggable')).toBe('true');
        // 在目标容器第 2 项上 dragover，随后 dragend 完成放置
        await children2[1].trigger('dragover');
        await children[1].trigger('dragend');
        await nextTick();

        // 源容器移除第 1 项，目标容器插入到第 2 项位置
        expect((wrapper.emitted('update:modelValue')[0][0] as number[]).join(',')).toBe('2,3,4');
        expect((wrapper2.emitted('update:modelValue')[0][0] as number[]).join(',')).toBe('5,1,6,7');
    });

    test('触发 dragstart / dragend 自定义事件并携带 item 与 index', async () => {
        const wrapper = mount(FDraggable, {
            props: {
                modelValue: [1, 2, 3],
            },
            slots: {
                default: slotsRender,
            },
        });
        await nextTick();

        const children = wrapper.findAll('.drag-item');
        await children[0].trigger('mousedown');
        await children[2].trigger('dragover');
        await children[2].trigger('dragend');
        await nextTick();

        // mousedown 即视为拖拽开始
        const dragstart = wrapper.emitted('dragstart');
        expect(dragstart.length).toBe(1);
        expect(dragstart[0][1]).toBe(1);
        expect(dragstart[0][2]).toBe(0);

        const dragend = wrapper.emitted('dragend');
        expect(dragend.length).toBe(1);
        expect((dragend[0][1] as number[]).length || typeof dragend[0][1]).toBe('number');
        expect(dragend[0][2]).toBe(2);
    });

    test('v-drag 指令：挂载后可拖拽排序', async () => {
        const list = ref([1, 2, 3, 4, 5]);
        const wrapper = mount(getDirectiveComp(list));
        await nextTick();

        // 指令挂载成功，列表渲染正常
        const lis = wrapper.findAll('li');
        expect(lis.length).toBe(5);

        await lis[0].trigger('mousedown');
        await nextTick();
        expect(lis[0].attributes('draggable')).toBe('true');

        await lis[1].trigger('dragover');
        await lis[1].trigger('dragend');
        await nextTick();
        expect(list.value.join(',')).toBe('2,1,3,4,5');
    });

    test('v-drag 指令：disabled 修饰符下不初始化拖拽', async () => {
        const list = ref([1, 2, 3]);
        const wrapper = mount(defineComponent({
            directives: {
                drag: vDrag,
            },
            setup() {
                return () => withDirectives(
                    h('ul', null, list.value.map((item) => h('li', { class: 'drag-li' }, String(item)))),
                    [[vDrag, list, undefined, { disabled: true }]],
                );
            },
        }));
        await nextTick();

        const lis = wrapper.findAll('li');
        await lis[0].trigger('mousedown');
        await nextTick();
        // 未设置 draggable 属性
        expect(lis[0].attributes('draggable')).toBeUndefined();
        await lis[1].trigger('dragover');
        await lis[1].trigger('dragend');
        expect(list.value.join(',')).toBe('1,2,3');
    });
});
