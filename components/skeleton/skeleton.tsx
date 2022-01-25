import {
    computed,
    defineComponent,
    ExtractPropTypes,
    h,
    mergeProps,
    PropType,
    Fragment,
} from 'vue';
import { useTheme } from '../_theme/useTheme';
import getPrefixCls from '../_util/getPrefixCls';
import { pxfy } from '../_util/utils';
import { getSlot } from '../_util/vnode';

type Size = 'small' | 'middle' | 'large';

const prefixCls = getPrefixCls('skeleton');

const skeletonProps = {
    text: Boolean,
    round: Boolean,
    circle: Boolean,
    height: [String, Number] as PropType<string | number>,
    width: [String, Number] as PropType<string | number>,
    size: String as PropType<Size>,
    repeat: {
        type: Number,
        default: 1,
    },
    animated: {
        type: Boolean,
        default: true,
    },
    sharp: {
        type: Boolean,
        default: true,
    },
} as const;

export type SkeletonProps = Partial<ExtractPropTypes<typeof skeletonProps>>;

export default defineComponent({
    name: 'FSkeleton',
    inheritAttrs: false,
    props: skeletonProps,
    setup(props) {
        useTheme();

        const style = computed(() => {
            const { circle, width, height } = props;
            const mergedWidth = circle ? width ?? height : width;
            const mergedHeight = circle ? height ?? width : height;

            return {
                width:
                    typeof mergedWidth === 'number'
                        ? pxfy(mergedWidth)
                        : mergedWidth,
                height:
                    typeof mergedHeight === 'number'
                        ? pxfy(mergedHeight)
                        : mergedHeight,
            };
        });

        const classes = computed(() => {
            const { circle, sharp, round, size, text, animated } = props;

            return [
                prefixCls,
                text && `is-text`,
                circle && `is-circle`,
                sharp && `is-sharp`,
                round && `is-round`,
                size && `size-${size}`,
                animated && `animated`,
            ];
        });

        return {
            prefixCls,
            style,
            classes,
        };
    },
    render() {
        const { repeat, style, $attrs, classes, $slots } = this;

        const slotDefault = $slots.default
            ? getSlot(this.$slots, 'default')
            : null;

        const child = h(
            'div',
            mergeProps(
                {
                    class: classes,
                    style,
                },
                $attrs,
            ),
            slotDefault,
        );

        if (repeat > 1) {
            return (
                <>
                    {Array.apply(null, { length: repeat } as any).map((_) => [
                        child,
                        '\n',
                    ])}
                </>
            );
        }

        return child;
    },
});
