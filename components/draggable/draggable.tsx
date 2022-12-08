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
} from './useDraggable';
import { useTheme } from '../_theme/useTheme';
import { mergeWith } from 'lodash-es';
import { flatten, isComment } from '../_util/vnode';
import type { BeforeDragEnd } from './useDraggable';

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
        beforeDragend: Function as PropType<BeforeDragEnd>,
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
            beforeDragend: props.beforeDragend,
        }));
        const {
            onAnimationEnd,
            onDragstart,
            onDragover,
            onDragend,
            onMousemove,
            draggableItems,
        } = useDraggable(rootRef, propsRef, ctx as SetupContext);

        const tag = props.tag || 'div';

        const renderItem = (item: unknown, index: number) => {
            const vNodes = flatten(ctx.slots.default({ item, index }))?.filter(
                (node) => !isComment(node),
            );
            if (!vNodes || !vNodes.length) return;
            if (vNodes.length > 1) {
                console.warn(
                    '[FDraggable]: default slot must be a root element',
                );
            }
            const style = { ...(vNodes[0].props?.style || {}) };
            mergeWith(
                style,
                draggableItems[index]?.style,
                (value, srcValue) => srcValue || value,
            );
            return cloneVNode(vNodes[0], {
                key: index,
                draggable: draggableItems[index]?.draggable,
                style: style,
            });
        };
        return () => (
            <tag
                ref={rootRef}
                class={prefixCls}
                onMousedown={onDragstart}
                onDragover={onDragover}
                onDragend={onDragend}
                onDrop={onDragend}
                onMouseup={onDragend}
                onMousemove={onMousemove}
                onTransitionend={onAnimationEnd}
            >
                {props.modelValue.map(renderItem)}
            </tag>
        );
    },
});
