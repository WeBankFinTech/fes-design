import { mount } from '@vue/test-utils';
import { ref, nextTick, h, defineComponent } from 'vue';
import FDraggable from '../draggable.vue';
import vDrag from '../directive';

const slotsRender = (props) => h('div', {}, props.item);

function getDirectiveComp(listRef, opt = {}) {
    return defineComponent({
        directives: {
            drag: vDrag,
        },
        render() {
            const children = listRef.value.map((item) => <li>{item}</li>);
            return opt.droppable ? (
                <ul v-drag={[listRef, ['droppable']]}>{children}</ul>
            ) : (
                <ul v-drag={listRef}>{children}</ul>
            );
        },
    });
}

describe('Draggable', () => {
    test('FDraggable 1 to 2', async () => {
        const list = ref([1, 2, 3, 4, 5]);
        const wrapper = mount(FDraggable, {
            props: {
                modelValue: list,
            },
            slots: {
                default: slotsRender,
            },
        });
        await nextTick();
        const children = wrapper.findAll('li');
        await children[0].trigger('mousedown');
        expect(children[0].attributes('draggable')).toBe('true');
        await children[1].trigger('dragover');
        await children[1].trigger('dragend');
        expect(wrapper.emitted()['update:modelValue'][0].join(',')).toBe(
            '2,1,3,4,5',
        );
        // expect(list.value.join(',')).toBe('2,1,3,4,5');
    });

    test('FDraggable disabled', async () => {
        const list = ref([1, 2, 3, 4, 5]);
        const wrapper = mount(FDraggable, {
            props: {
                modelValue: list,
                disabled: true,
            },
            slots: {
                default: slotsRender,
            },
        });
        await nextTick();
        const children = wrapper.findAll('li');
        await children[0].trigger('mousedown');
        expect(children[0].attributes('draggable')).toBe('false');
        await children[2].trigger('dragover');
        await children[2].trigger('dragend');
        expect(list.value.join(',')).toBe('1,2,3,4,5');
    });

    test('FDraggable droppable', async () => {
        const list = ref([1, 2, 3, 4]);
        const list2 = ref([5, 6, 7]);
        const wrapper = mount(FDraggable, {
            props: {
                modelValue: list,
                droppable: true,
            },
            slots: {
                default: slotsRender,
            },
        });
        const wrapper2 = mount(FDraggable, {
            props: {
                modelValue: list2,
                droppable: true,
            },
            slots: {
                default: slotsRender,
            },
        });
        await nextTick();
        const children = wrapper.findAll('li');
        const children2 = wrapper2.findAll('li');
        await children[0].trigger('mousedown');
        expect(children[0].attributes('draggable')).toBe('true');
        await children2[1].trigger('dragover');
        await children[1].trigger('dragend');
        await nextTick();
        expect(wrapper.emitted()['update:modelValue'][0].join(',')).toBe(
            '2,3,4',
        );
        expect(wrapper2.emitted()['update:modelValue'][0].join(',')).toBe(
            '5,1,6,7',
        );
        // expect(list.value.join(',')).toBe('2,3,4');
        // expect(list2.value.join(',')).toBe('5,1,6,7');
    });

    test('v-drag 1 to 2', async () => {
        const list = ref([1, 2, 3, 4, 5]);
        const wrapper = mount(getDirectiveComp(list));
        await nextTick();
        const children = wrapper.findAll('li');
        await children[0].trigger('mousedown');
        await nextTick();
        expect(children[0].attributes('draggable')).toBe('true');
        await children[1].trigger('dragover');
        await children[1].trigger('dragend');
        expect(list.value.join(',')).toBe('2,1,3,4,5');
    });

    test('v-drag droppable', async () => {
        const list = ref([1, 2, 3, 4]);
        const list2 = ref([5, 6, 7]);
        const wrapper = mount(getDirectiveComp(list, { droppable: true }));
        const wrapper2 = mount(getDirectiveComp(list2, { droppable: true }));
        await nextTick();
        const children = wrapper.findAll('li');
        const children2 = wrapper2.findAll('li');
        await children[0].trigger('mousedown');
        expect(children[0].attributes('draggable')).toBe('true');
        await children2[1].trigger('dragover');
        await children[1].trigger('dragend');
        await nextTick();
        expect(list.value.join(',')).toBe('2,3,4');
        expect(list2.value.join(',')).toBe('5,1,6,7');
    });
});
