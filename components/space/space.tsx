import { type Ref, computed, defineComponent } from 'vue';
import { useTheme } from '../_theme/useTheme';
import { flatten, getSlot, isValidElementNode } from '../_util/vnode';
import { createKey } from '../_util/createKey';
import { depx } from '../_util/utils';
import type { TThemeVars } from '../_theme/base';
import { COMPONENT_NAME, prefixCls } from './const';
import { type SpaceInnerProps, spaceProps } from './props';

const useGap = (props: SpaceInnerProps, themeVarsRef: Ref<TThemeVars>) => {
    const gap = computed(() => {
        const { size } = props;

        if (Array.isArray(size)) {
            return { row: size[0], col: size[1] };
        } else if (typeof size === 'number') {
            return { row: size, col: size };
        }

        const currentSize = depx(
            themeVarsRef.value[createKey('padding', size)]
            || themeVarsRef.value[createKey('padding', 'small')],
        );
        return { row: currentSize, col: currentSize };
    });

    return {
        gap,
    };
};

export default defineComponent({
    name: COMPONENT_NAME,
    props: spaceProps,
    setup(props) {
        const { themeVars } = useTheme();

        const { gap } = useGap(props, themeVars);

        return {
            prefixCls,
            gap,
        };
    },
    render() {
        const {
            vertical,
            align,
            inline,
            justify,
            wrapItem,
            itemStyle,
            wrap,
            prefixCls,
            gap,
        } = this;

        const children = flatten(getSlot(this.$slots) || []).filter((node) =>
            isValidElementNode(node),
        );

        return (
            <div
                role="none"
                class={`${prefixCls}`}
                style={{
                    display: inline ? 'inline-grid' : 'grid',
                    gridTemplateColumns: vertical ? 'unset' : 'repeat(auto-fit, minmax(0, 1fr))',
                    gridTemplateRows: vertical ? 'repeat(auto-fit, minmax(0, 1fr))' : 'unset',
                    justifyItems: justify === 'start' || justify === 'end'
                        ? `flex-${justify}`
                        : justify === 'center' ? 'center' : justify,
                    alignItems: align,
                    gap: `${gap.row}px ${gap.col}px`,
                }}
            >
                { wrapItem
                    ? children?.map((child) => (
                        <div
                            role="none"
                            style={[
                                {
                                    maxWidth: '100%',
                                },
                                itemStyle as any,
                            ]}
                        >
                            {child}
                        </div>
                    ))
                    : children
                }
            </div>
        );
    },
});
