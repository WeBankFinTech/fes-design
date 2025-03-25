import { type Ref, computed, defineComponent } from 'vue';
import { useTheme } from '../_theme/useTheme';
import { flatten, getSlot, isValidElementNode } from '../_util/vnode';
import { createKey } from '../_util/createKey';
import { depx } from '../_util/utils';
import type { TThemeVars } from '../_theme/base';
import { COMPONENT_NAME, prefixCls } from './const';
import { type SpaceInnerProps, spaceProps } from './props';

const useMargin = (props: SpaceInnerProps, themeVarsRef: Ref<TThemeVars>) => {
    const margin = computed(() => {
        const { size } = props;
        let horizontal = 0;
        let vertical = 0;

        if (Array.isArray(size)) {
            horizontal = size[0];
            vertical = size[1];
        } else if (typeof size === 'number') {
            horizontal = size;
            vertical = size;
        } else {
            const currentSize = depx(
                themeVarsRef.value[createKey('padding', size)]
                || themeVarsRef.value[createKey('padding', 'small')],
            );
            horizontal = currentSize;
            vertical = currentSize;
        }

        return {
            horizontal: `${horizontal}px`,
            vertical: `${vertical}px`,
        };
    });

    return {
        margin,
    };
};

export default defineComponent({
    name: COMPONENT_NAME,
    props: spaceProps,
    setup(props) {
        const { themeVars } = useTheme();

        const { margin } = useMargin(props, themeVars);

        return {
            prefixCls,
            margin,
        };
    },
    render() {
        const {
            vertical,
            align,
            inline,
            justify,
            itemStyle,
            wrap,
            prefixCls,
            margin,
        } = this;

        const children = flatten(getSlot(this.$slots) || []).filter((node) =>
            isValidElementNode(node),
        );

        return (
            <div
                role="none"
                class={`${prefixCls}`}
                style={{
                    display: inline ? 'inline-flex' : 'flex',
                    flexDirection: vertical ? 'column' : 'row',
                    justifyContent: ['start', 'end'].includes(justify)
                        ? `flex-${justify}`
                        : justify,
                    alignItems: align,
                    flexWrap: !wrap || vertical ? 'nowrap' : 'wrap',
                    gap: `${margin.vertical} ${margin.horizontal}`,
                }}
            >
                { itemStyle
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
