import { h, defineComponent, computed, CSSProperties, ExtractPropTypes } from 'vue';

import { noop } from '../_util/utils';

const prefixCls = 'fes-design-icon';

const iconProps = {
    spin: Boolean,
    rotate: String,
    tabIndex: Number,
} as const;

export type IconProps = Partial<ExtractPropTypes<typeof iconProps>>;

export default defineComponent({
    name: 'FIconWrapper',
    props: iconProps,
    setup(props, { slots, attrs }) {
        const iconTabIndex = computed(() => {
            let tabIndex = props.tabIndex;
            if (tabIndex == null && attrs.onClick) {
                tabIndex = -1;
            }
            return tabIndex;
        });
        const svgStyle = computed(() =>
            props.rotate
                ? {
                    transform: `rotate(${props.rotate}deg)`,
                }
                : null,
        );
        const svgClasses = computed(() => ({
            [prefixCls]: true,
            [`${prefixCls}--spin`]: !!props.spin,
        }));

        return () => (
            <span
                tabindex={iconTabIndex.value}
                role="img"
                class={svgClasses.value}
                style={svgStyle.value as CSSProperties}
                onClick={(attrs.onClick || noop) as () => void}
            >
                {slots.default && slots.default()}
            </span>
        );
    },
});
