import {
    computed,
    defineComponent,
    ref,
    SetupContext,
    PropType,
    cloneVNode,
} from 'vue';
import {
    DRAG_END_EVENT,
    DRAG_START_EVENT,
    UPDATE_MODEL_EVENT,
    useDraggable,
    BeforeDragEnd,
} from './useDraggable';
import { useTheme } from '../_theme/useTheme';
import { mergeWith } from 'lodash-es';

export default defineComponent({
    name: 'FDraggable',
    props: {
        modelValue: {
            type: Array,
            default: [],
        },
        droppable: Boolean,
        disabled: Boolean,
        beforeDragEnd: Function as PropType<BeforeDragEnd>,
        tag: {
            type: String,
            default: 'div',
        },
    },
    emits: [UPDATE_MODEL_EVENT, DRAG_START_EVENT, DRAG_END_EVENT],
    setup(props, ctx) {
        useTheme();
        const rootRef = ref<HTMLElement>();
        const propsRef = computed(() => ({
            droppable: props.droppable,
            disabled: props.disabled,
            list: [...props.modelValue],
            beforeDragEnd: props.beforeDragEnd,
        }));
        const {
            onAnimationEnd,
            onDragStart,
            onDragOver,
            onDragEnd,
            draggableItems,
        } = useDraggable(rootRef, propsRef, ctx as SetupContext);

        const tag = props.tag || 'div';

        const renderItem = (item: unknown, index: number) => {
            const vNode = ctx.slots.default({ item, index })[0];
            if (!vNode) return;
            const style = { ...(vNode.props.style || {}) };
            mergeWith(
                style,
                draggableItems[index]?.style,
                (value, srcValue) => srcValue || value,
            );
            return cloneVNode(vNode, {
                key: index,
                draggable: draggableItems[index]?.draggable,
                style: style,
            });
        };
        return () => (
            <tag
                ref={rootRef}
                onMousedown={onDragStart}
                onDragover={onDragOver}
                onDragend={onDragEnd}
                onDrop={onDragEnd}
                onMouseup={onDragEnd}
                onTransitionend={onAnimationEnd}
            >
                {props.modelValue.map(renderItem)}
            </tag>
        );
    },
});
