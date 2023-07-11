import { defineComponent, computed, PropType } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('divider');

type TitlePlacement = 'center' | 'left' | 'right';

export const dividerProps = {
    // 是否是垂直方向
    vertical: {
        type: Boolean,
        default: false,
    },
    // 文字的位置
    titlePlacement: {
        type: String as PropType<TitlePlacement>,
        default: 'center',
    },
} as const;

export type DividerProps = ExtractPublicPropTypes<typeof dividerProps>;

export default defineComponent({
    name: 'FDivider',
    props: dividerProps,
    setup(props, { slots }) {
        useTheme();
        const classList = computed(() =>
            [prefixCls, props.vertical && 'is-vertical']
                .filter(Boolean)
                .join(' '),
        );
        return () => (
            <div class={classList.value}>
                {!props.vertical ? (
                    <div class={`${prefixCls}-text is-${props.titlePlacement}`}>
                        {slots.default?.()}
                    </div>
                ) : null}
            </div>
        );
    },
});
