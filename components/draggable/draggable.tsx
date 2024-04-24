import {
    type ComponentObjectPropsOptions,
    type PropType,
    type SetupContext,
    cloneVNode,
    computed,
    defineComponent,
    ref,
} from 'vue';
import { mergeWith } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { flatten, isComment } from '../_util/vnode';
import type { ExtractPublicPropTypes } from '../_util/interface';
import {
    DRAG_END_EVENT,
    DRAG_START_EVENT,
    UPDATE_MODEL_EVENT,
    useDraggable,
} from './useDraggable';
import type { BeforeDragEnd } from './useDraggable';

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
} as const satisfies ComponentObjectPropsOptions;

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

        const renderItem = (item: unknown, index: number) => {
            const vNodes = flatten(
                ctx.slots.default?.({ item, index })
                || ctx.slots.item?.({ item, index })
                || [],
            )?.filter((node) => !isComment(node));
            if (!vNodes || !vNodes.length) {
                return;
            }
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
                style,
            });
        };
        return () => (
            <tag
                ref={rootRef}
                class={[
                    `${prefixCls}`,
                    propsRef.value.disabled && `${prefixCls}-disabled`,
                ]}
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
