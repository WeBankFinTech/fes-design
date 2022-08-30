import {
    computed,
    defineComponent,
    ref,
    SetupContext,
    PropType,
    cloneVNode,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import {
    DRAG_END_EVENT,
    DRAG_START_EVENT,
    UPDATE_MODEL_EVENT,
    useDraggable,
    BeforeDragEnd,
} from './useDraggable';
import { useTheme } from '../_theme/useTheme';

const prefixCls = getPrefixCls('draggable');

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
            return cloneVNode(vNode, {
                key: index,
                class: `${prefixCls}-item`,
                draggable: draggableItems[index]?.draggable,
                style: draggableItems[index]?.style,
            });
        };
        return () => (
            <tag
                ref={rootRef}
                class={prefixCls}
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
