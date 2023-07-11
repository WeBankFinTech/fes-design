import {
    computed,
    defineComponent,
    ref,
    SetupContext,
    PropType,
    cloneVNode,
} from 'vue';
import { mergeWith } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { flatten, isComment } from '../_util/vnode';
import {
    DRAG_END_EVENT,
    DRAG_START_EVENT,
    UPDATE_MODEL_EVENT,
    useDraggable,
} from './useDraggable';
import type { BeforeDragEnd } from './useDraggable';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('draggable');

export const draggableProps = {
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
} as const;

export type DraggableProps = ExtractPublicPropTypes<typeof draggableProps>;

export default defineComponent({
    name: 'FDraggable',
    props: draggableProps,
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
