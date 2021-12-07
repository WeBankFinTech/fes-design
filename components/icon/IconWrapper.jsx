import { defineComponent, computed } from 'vue';

import { noop } from '../_util/utils';

const prefixCls = 'fes-design-icon';

export default defineComponent({
    name: 'FIconWrapper',
    props: ['spin', 'rotate', 'tabIndex'],
    setup(props, { slots, attrs }) {
        const iconTabIndex = computed(() => {
            let tabIndex = props.tabIndex;
            if (tabIndex == null && attrs.onClick) {
                tabIndex = -1;
            }
            return tabIndex;
        });
        const svgStyle = computed(() => (props.rotate
            ? {
                msTransform: `rotate(${props.rotate}deg)`,
                transform: `rotate(${props.rotate}deg)`,
            }
            : null));
        const svgClasses = computed(() => ({
            [prefixCls]: true,
            [`${prefixCls}--spin`]: !!props.spin,
        }));

        return () => (
            <span
                tabIndex={iconTabIndex.value}
                role="img"
                class={svgClasses.value}
                style={svgStyle.value}
                onClick={attrs.onClick || noop}
            >
                {slots.default && slots.default()}
            </span>
        );
    },
});
