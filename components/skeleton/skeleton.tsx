import {
    computed,
    defineComponent,
    mergeProps,
    PropType,
    StyleValue,
} from 'vue';
import { useTheme } from '../_theme/useTheme';
import getPrefixCls from '../_util/getPrefixCls';
import { pxfy } from '../_util/utils';
import { getSlot } from '../_util/vnode';
import type { ExtractPublicPropTypes } from '../_util/interface';

type Size = 'small' | 'middle' | 'large';

const prefixCls = getPrefixCls('skeleton');

export const skeletonProps = {
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

export type SkeletonProps = ExtractPublicPropTypes<typeof skeletonProps>;

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
                width: pxfy(mergedWidth),
                height: pxfy(mergedHeight),
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
                size && `is-size-${size}`,
                animated && `is-animated`,
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
        const mergeAttrs = mergeProps(
            {
                class: classes,
                style,
            },
            $attrs,
        );

        const renderChild = () => (
            <div
                class={mergeAttrs.class}
                style={mergeAttrs.style as StyleValue}
            >
                {slotDefault}
            </div>
        );

        return repeat <= 1 ? (
            renderChild()
        ) : (
            <>{[...Array(repeat)].map(() => [renderChild()])}</>
        );
    },
});
