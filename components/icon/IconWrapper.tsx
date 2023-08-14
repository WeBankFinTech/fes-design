import {
    defineComponent,
    computed,
    ExtractPropTypes,
    ComputedRef,
    StyleValue,
    HTMLAttributes,
    PropType,
} from 'vue';
import { isNil } from 'lodash-es';

import { noop } from '../_util/utils';

const prefixCls = 'fes-design-icon';

const iconProps = {
    spin: Boolean,
    rotate: [String, Number] as PropType<string | number>,
    tabIndex: Number,
    size: Number,
    color: String,
} as const;

export type IconProps = Partial<ExtractPropTypes<typeof iconProps>> &
    HTMLAttributes;

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
        const svgStyle: ComputedRef<StyleValue> = computed(() => {
            return [
                props.rotate && {
                    transform: `rotate(${props.rotate}deg)`,
                },
                !isNil(props.size) && {
                    fontSize: `${props.size}px`,
                },
                props.color && {
                    color: props.color,
                },
            ];
        });
        const svgClasses = computed(() => [
            {
                [prefixCls]: true,
                [`${prefixCls}--spin`]: !!props.spin,
            },
        ]);

        return () => (
            <span
                tabindex={iconTabIndex.value}
                role="img"
                class={svgClasses.value}
                style={svgStyle.value}
                onClick={(attrs.onClick || noop) as () => void}
            >
                {slots.default && slots.default()}
            </span>
        );
    },
});
