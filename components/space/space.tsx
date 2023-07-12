import { computed, CSSProperties, defineComponent, PropType, Ref } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { flatten, getSlot, isValidElementNode } from '../_util/vnode';
import { createKey } from '../_util/createKey';
import { depx } from '../_util/utils';
import type { TThemeVars } from '../_theme/base';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('space');

type Align =
    | 'stretch'
    | 'baseline'
    | 'start'
    | 'end'
    | 'center'
    | 'flex-end'
    | 'flex-start';

type Justify = 'start' | 'end' | 'center' | 'space-around' | 'space-between';

type Size = 'xsmall' | 'small' | 'middle' | 'large';

export const spaceProps = {
    align: String as PropType<Align>,
    justify: {
        type: String as PropType<Justify>,
        default: 'start',
    },
    inline: Boolean,
    vertical: Boolean, // 是否垂直布局
    size: {
        type: [String, Number, Array] as PropType<
            Size | number | [number, number]
        >,
        default: 'small',
    },
    itemStyle: [String, Object] as PropType<string | CSSProperties>,
    wrap: {
        type: Boolean,
        default: true,
    },
} as const;

export type SpaceProps = ExtractPublicPropTypes<typeof spaceProps>;

const useMargin = (props: SpaceProps, themeVarsRef: Ref<TThemeVars>) => {
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
                themeVarsRef.value[createKey('padding', size)] ||
                    themeVarsRef.value[createKey('padding', 'small')],
            );
            horizontal = currentSize;
            vertical = currentSize;
        }

        return {
            horizontal: `${horizontal}px`,
            vertical: `${vertical}px`,
            semiHorizontal: `${horizontal / 2}px`,
            semiVertical: `${vertical / 2}px`,
        };
    });

    return {
        margin,
    };
};

export default defineComponent({
    name: 'FSpace',
    components: {},
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
        const lastIndex = children.length - 1;
        const isJustifySpace = justify.startsWith('space-');

        return (
            <div
                role="none"
                class={`${prefixCls}`}
                style={{
                    display: inline ? 'inline-flex' : 'flex',
                    flexDirection: vertical ? 'column' : 'row',
                    justifyContent: ['start', 'end'].includes(justify)
                        ? 'flex-' + justify
                        : justify,
                    alignItems: align,
                    flexWrap: !wrap || vertical ? 'nowrap' : 'wrap',
                    marginTop: vertical ? '' : `-${margin.semiHorizontal}`,
                    marginBottom: vertical ? '' : `-${margin.semiVertical}`,
                }}
            >
                {children?.map((child, index) => (
                    <div
                        role="none"
                        style={[
                            itemStyle as any,
                            {
                                maxWidth: '100%',
                            },
                            vertical
                                ? {
                                      marginBottom:
                                          index !== lastIndex
                                              ? margin.vertical
                                              : '',
                                  }
                                : {
                                      marginRight: isJustifySpace
                                          ? justify === 'space-between' &&
                                            index === lastIndex
                                              ? ''
                                              : margin.semiHorizontal
                                          : index !== lastIndex
                                          ? margin.horizontal
                                          : '',
                                      marginLeft: isJustifySpace
                                          ? justify === 'space-between' &&
                                            index === 0
                                              ? ''
                                              : margin.semiHorizontal
                                          : '',
                                      paddingTop: margin.semiVertical,
                                      paddingBottom: margin.semiVertical,
                                  },
                        ]}
                    >
                        {child}
                    </div>
                ))}
            </div>
        );
    },
});
