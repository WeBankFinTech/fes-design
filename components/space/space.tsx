import {
    h,
    computed,
    CSSProperties,
    defineComponent,
    ExtractPropTypes,
    PropType,
    ref,
    watch,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { flatten, getSlot } from '../_util/vnode';

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

type Size = 'small' | 'middle' | 'large';

const spaceProps = {
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
        default: 'middle',
    },
    itemStyle: [String, Object] as PropType<string | CSSProperties>,
    wrap: {
        type: Boolean,
        default: true,
    },
} as const;

export type SpaceProps = Partial<ExtractPropTypes<typeof spaceProps>>;

const SIZE_MAP: Record<Size, number> = {
    small: 8,
    middle: 12,
    large: 16,
};

const useMargin = (props: SpaceProps) => {
    const horizontal = ref(0);
    const vertical = ref(0);

    watch(
        () => props.size,
        (size) => {
            if (Array.isArray(size)) {
                horizontal.value = size[0];
                vertical.value = size[1];
            } else if (typeof size === 'number') {
                horizontal.value = size;
                vertical.value = size;
            } else {
                const currentSize = SIZE_MAP[size] || SIZE_MAP.middle;
                horizontal.value = currentSize;
                vertical.value = currentSize;
            }
        },
        {
            immediate: true,
            deep: true
        },
    );

    const semiHorizontal = computed(() => horizontal.value / 2);
    const semiVertical = computed(() => vertical.value / 2);

    const horizontalMargin = computed(() => `${horizontal.value}px`);
    const verticalMargin = computed(() => `${vertical.value}px`);
    const semiHorizontalMargin = computed(() => `${semiHorizontal.value}px`);
    const semiVerticalMargin = computed(() => `${semiVertical.value}px`);

    return {
        horizontalMargin,
        verticalMargin,
        semiHorizontalMargin,
        semiVerticalMargin,
    };
};

export default defineComponent({
    name: 'FSpace',
    components: {},
    props: {
        ...spaceProps,
    },
    setup(props, ctx) {
        useTheme();

        const { vertical, align, inline, justify, itemStyle, wrap } = props;
        const {
            horizontalMargin,
            verticalMargin,
            semiHorizontalMargin,
            semiVerticalMargin,
        } = useMargin(props);
        const children = flatten(getSlot(ctx.slots));
        const lastIndex = children.length - 1;
        const isJustifySpace = justify.startsWith('space-');

        return () => (
            <div
                role="none"
                class={`${prefixCls}`}
                style={{
                    display: inline ? 'inline-flex' : 'flex',
                    flexDirection: vertical ? 'column' : 'row',
                    justifyContent: ['start', 'end'].includes(justify)
                        ? 'flex-' + justify
                        : justify,
                    flexWrap: !wrap || vertical ? 'nowrap' : 'wrap',
                    marginTop: vertical ? '' : `-${semiVerticalMargin.value}`,
                    marginBottom: vertical ? '' : `-${semiVerticalMargin.value}`,
                    alignItems: align,
                }}
            >
                {children.map((child, index) => (
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
                                              ? verticalMargin.value
                                              : '',
                                  }
                                : {
                                      marginRight: isJustifySpace
                                          ? justify === 'space-between' &&
                                            index === lastIndex
                                              ? ''
                                              : semiHorizontalMargin.value
                                          : index !== lastIndex
                                          ? horizontalMargin.value
                                          : '',
                                      marginLeft: isJustifySpace
                                          ? justify === 'space-between' &&
                                            index === 0
                                              ? ''
                                              : semiHorizontalMargin.value
                                          : '',
                                      paddingTop: semiVerticalMargin.value,
                                      paddingBottom: semiVerticalMargin.value,
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
